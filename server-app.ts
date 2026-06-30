import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
const DB_FILE = path.join(process.cwd(), "messages-db.json");

function normalizeDatabaseUrl(rawUrl: string | undefined): string | undefined {
  if (!rawUrl) return undefined;

  const trimmed = rawUrl.trim();
  const withoutQuotes = trimmed.replace(/^['"]|['"]$/g, "");

  if (!withoutQuotes) return undefined;

  return withoutQuotes;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

// PostgreSQL pool initialization
let pool: pg.Pool | null = null;
let usePostgres = false;

const normalizedDatabaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);

if (normalizedDatabaseUrl) {
  try {
    // Remove sslmode param from URL to avoid conflict with explicit ssl config
    const cleanDbUrl = normalizedDatabaseUrl.replace(/[?&]sslmode=[^&]*/g, '').replace(/\?$/, '');
    pool = new Pool({
      connectionString: cleanDbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Listen for unexpected errors on idle pool clients to prevent process crashes
    pool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client:", err);
    });

    usePostgres = true;
    console.log("PostgreSQL Database URL detected. Initializing Supabase PostgreSQL pool.");
  } catch (error) {
    console.error("Failed to initialize PostgreSQL pool:", error);
  }
} else {
  console.log("No DATABASE_URL environment variable found. Falling back to local JSON database storage.");
}

async function ensureTableExists() {
  if (!usePostgres || !pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        timestamp VARCHAR(255) NOT NULL
      );
    `);
    console.log("Successfully verified messages table in Supabase PostgreSQL.");
  } catch (error: any) {
    console.error("Error creating/verifying table in PostgreSQL:", error);
    console.warn("Temporarily disabling PostgreSQL and falling back to local JSON file storage due to DB connection or credentials error.");
    usePostgres = false;
  }
}

let hasCheckedTable = false;
async function checkTable() {
  if (!hasCheckedTable) {
    await ensureTableExists();
    hasCheckedTable = true;
  }
}

// Helper to write messages to JSON file
async function saveAllMessages(messages: Message[]): Promise<void> {
  try {
    await fs.promises.writeFile(DB_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing messages file:", error);
    throw error;
  }
}

// Helper to read messages from SQL or fallback JSON file
async function getAllMessages(): Promise<Message[]> {
  if (usePostgres && pool) {
    try {
      await checkTable();
      if (usePostgres) {
        const result = await pool.query("SELECT id, name, email, message, timestamp FROM messages ORDER BY id DESC");
        return result.rows as Message[];
      }
    } catch (error) {
      console.error("Error querying messages from PostgreSQL, falling back to local storage:", error);
      console.warn("Temporarily disabling PostgreSQL and falling back to local JSON file storage.");
      usePostgres = false;
    }
  }

  try {
    if (!fs.existsSync(DB_FILE)) {
      return [];
    }
    const data = await fs.promises.readFile(DB_FILE, "utf-8");
    if (!data.trim()) return [];
    const list = JSON.parse(data);
    if (!Array.isArray(list)) return [];
    // Sort messages: newest first based on the generated ID msg-timestamp
    return list.sort((a, b) => b.id.localeCompare(a.id));
  } catch (error) {
    console.error("Error reading messages file:", error);
    return [];
  }
}

async function insertMessage(msg: Message): Promise<Message> {
  if (usePostgres && pool) {
    try {
      await checkTable();
      if (usePostgres) {
        await pool.query(
          "INSERT INTO messages (id, name, email, message, timestamp) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, message = $4, timestamp = $5",
          [msg.id, msg.name, msg.email, msg.message, msg.timestamp]
        );
        return msg;
      }
    } catch (error) {
      console.error("Error inserting message into PostgreSQL, falling back to local storage:", error);
      console.warn("Temporarily disabling PostgreSQL and falling back to local JSON file storage.");
      usePostgres = false;
    }
  }

  const messages = await getAllMessages();
  // Avoid duplicate by ID if any
  const filtered = messages.filter(m => m.id !== msg.id);
  filtered.push(msg);
  await saveAllMessages(filtered);
  return msg;
}

async function deleteMessageById(id: string): Promise<void> {
  if (usePostgres && pool) {
    try {
      await checkTable();
      if (usePostgres) {
        await pool.query("DELETE FROM messages WHERE id = $1", [id]);
        return;
      }
    } catch (error) {
      console.error("Error deleting message from PostgreSQL, falling back to local storage:", error);
      console.warn("Temporarily disabling PostgreSQL and falling back to local JSON file storage.");
      usePostgres = false;
    }
  }

  const messages = await getAllMessages();
  const filtered = messages.filter(m => m.id !== id);
  await saveAllMessages(filtered);
}

async function deleteAllMessages(): Promise<void> {
  if (usePostgres && pool) {
    try {
      await checkTable();
      if (usePostgres) {
        await pool.query("TRUNCATE TABLE messages");
        return;
      }
    } catch (error) {
      console.error("Error truncating messages table in PostgreSQL, falling back to local storage:", error);
      console.warn("Temporarily disabling PostgreSQL and falling back to local JSON file storage.");
      usePostgres = false;
    }
  }

  await saveAllMessages([]);
}

const app = express();

// Add JSON parsing middleware
app.use(express.json());

// API routes
app.get("/api/debug-db", async (req, res) => {
  try {
    const testId = "debug-" + Date.now();
    const testMsg: Message = {
      id: testId,
      name: "Debug User",
      email: "debug@example.com",
      message: "This is a debug message testing DB connection",
      timestamp: new Date().toISOString()
    };
    await insertMessage(testMsg);
    await deleteMessageById(testId);
    res.json({
      success: true,
      mode: usePostgres ? "PostgreSQL (Supabase)" : "Local JSON File",
      message: `${usePostgres ? "Supabase PostgreSQL" : "Local JSON Database"} connection and write/delete test passed successfully!`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      mode: usePostgres ? "PostgreSQL (Supabase)" : "Local JSON File",
      error: error?.message || String(error),
      stack: error?.stack || null
    });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (error: any) {
    console.error("API error (GET /api/messages):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const { id, name, email, message, timestamp } = req.body;
    if (!id || !name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newMsg = await insertMessage({
      id,
      name,
      email,
      message,
      timestamp: timestamp || new Date().toISOString()
    });
    res.status(201).json(newMsg);
  } catch (error: any) {
    console.error("API error (POST /api/messages):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteMessageById(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error(`API error (DELETE /api/messages/${req.params.id}):`, error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.delete("/api/messages", async (req, res) => {
  try {
    await deleteAllMessages();
    res.json({ success: true });
  } catch (error: any) {
    console.error("API error (DELETE /api/messages):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

export { app };
