import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
const DB_FILE = path.join(process.cwd(), "messages-db.json");
const PROFILE_DB_FILE = path.join(process.cwd(), "profile-db.json");
const PROJECTS_DB_FILE = path.join(process.cwd(), "projects-db.json");
const EXPERIENCES_DB_FILE = path.join(process.cwd(), "experiences-db.json");

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

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  tags: string[];
  role: string;
  year: string;
  client: string;
  link?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  major?: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  bio: string;
  avatarUrl: string;
  email: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutQuote?: string;
  skillCat1Title?: string;
  skillCat1Desc?: string;
  skillCat1Tags?: string;
  skillCat2Title?: string;
  skillCat2Desc?: string;
  skillCat2Tags?: string;
  skillCat3Title?: string;
  skillCat3Desc?: string;
  skillCat3Tags?: string;
  contactTitle?: string;
  contactDesc?: string;
  heroTag?: string;
  heroHeading?: string;
}

// PostgreSQL pool initialization
let pool: pg.Pool | null = null;
let usePostgres = false;
let dbInitializationError: string | null = null;

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
  } catch (error: any) {
    dbInitializationError = error?.message || String(error);
    console.error("Failed to initialize PostgreSQL pool:", error);
    usePostgres = false;
  }
} else {
  console.log("No DATABASE_URL environment variable found. Falling back to local JSON database storage.");
}

async function ensureTablesExist() {
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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id VARCHAR(255) PRIMARY KEY DEFAULT 'main',
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL,
        avatar_url TEXT NOT NULL,
        email VARCHAR(255) NOT NULL,
        github TEXT,
        linkedin TEXT,
        instagram TEXT,
        tiktok TEXT,
        about_paragraph1 TEXT,
        about_paragraph2 TEXT,
        about_quote TEXT,
        skill_cat1_title TEXT,
        skill_cat1_desc TEXT,
        skill_cat1_tags TEXT,
        skill_cat2_title TEXT,
        skill_cat2_desc TEXT,
        skill_cat2_tags TEXT,
        skill_cat3_title TEXT,
        skill_cat3_desc TEXT,
        skill_cat3_tags TEXT,
        contact_title TEXT,
        contact_desc TEXT,
        hero_tag TEXT,
        hero_heading TEXT
      );
    `);
    await pool.query(`
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hero_tag TEXT;
    `);
    await pool.query(`
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hero_heading TEXT;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        tags TEXT NOT NULL,
        role VARCHAR(255) NOT NULL,
        year VARCHAR(50) NOT NULL,
        client VARCHAR(255) NOT NULL,
        link TEXT
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id VARCHAR(255) PRIMARY KEY,
        role VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        period VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        major VARCHAR(255)
      );
    `);
    console.log("Successfully verified all tables (messages, profiles, projects, experiences) in Supabase PostgreSQL.");
  } catch (error: any) {
    dbInitializationError = error?.message || String(error);
    const errorMsg = error?.message || String(error);
    const isNetworkIssue = errorMsg.includes("getaddrinfo") || errorMsg.includes("ENOTFOUND") || errorMsg.includes("ECONNREFUSED") || errorMsg.includes("ETIMEDOUT");
    if (isNetworkIssue) {
      console.warn("⚠️ PostgreSQL database host is currently unreachable or offline. Seamlessly falling back to local JSON database storage.");
    } else {
      console.warn("Error creating/verifying tables in PostgreSQL, will fallback to local JSON storage:", errorMsg);
    }
    usePostgres = false;
  }
}

let hasCheckedTables = false;
async function checkTables() {
  if (!hasCheckedTables && usePostgres) {
    try {
      await ensureTablesExist();
      hasCheckedTables = true;
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      const errorMsg = error?.message || String(error);
      const isNetworkIssue = errorMsg.includes("getaddrinfo") || errorMsg.includes("ENOTFOUND") || errorMsg.includes("ECONNREFUSED") || errorMsg.includes("ETIMEDOUT");
      if (isNetworkIssue) {
        console.warn("⚠️ checkTables failed because PostgreSQL is unreachable/offline. Local JSON storage is active.");
      } else {
        console.warn("checkTables failed, disabling PostgreSQL for this session:", errorMsg);
      }
      usePostgres = false;
    }
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
      await checkTables();
      if (usePostgres && pool) {
        const result = await pool.query("SELECT id, name, email, message, timestamp FROM messages ORDER BY id DESC");
        return result.rows as Message[];
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error querying messages from PostgreSQL, falling back to local JSON storage:", error);
      usePostgres = false;
    }
  }

  if (normalizedDatabaseUrl && !usePostgres) {
    console.log("PostgreSQL is configured but currently unavailable. Falling back to local JSON database storage.");
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
      await checkTables();
      if (usePostgres && pool) {
        await pool.query(
          "INSERT INTO messages (id, name, email, message, timestamp) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, message = $4, timestamp = $5",
          [msg.id, msg.name, msg.email, msg.message, msg.timestamp]
        );
        return msg;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error inserting message into PostgreSQL, falling back to local JSON storage:", error);
      usePostgres = false;
    }
  }

  if (normalizedDatabaseUrl && !usePostgres) {
    console.log("PostgreSQL is configured but unavailable for insert. Using local JSON file fallback.");
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
      await checkTables();
      if (usePostgres && pool) {
        await pool.query("DELETE FROM messages WHERE id = $1", [id]);
        return;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error deleting message from PostgreSQL, falling back to local JSON storage:", error);
      usePostgres = false;
    }
  }

  if (normalizedDatabaseUrl && !usePostgres) {
    console.log("PostgreSQL is configured but unavailable for delete. Using local JSON file fallback.");
  }

  const messages = await getAllMessages();
  const filtered = messages.filter(m => m.id !== id);
  await saveAllMessages(filtered);
}

async function deleteAllMessages(): Promise<void> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        await pool.query("TRUNCATE TABLE messages");
        return;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error truncating messages table in PostgreSQL, falling back to local JSON storage:", error);
      usePostgres = false;
    }
  }

  if (normalizedDatabaseUrl && !usePostgres) {
    console.log("PostgreSQL is configured but unavailable for truncate. Using local JSON file fallback.");
  }

  await saveAllMessages([]);
}

// ========== PROFILE HELPERS ==========

async function saveProfileToJson(profile: Profile): Promise<void> {
  try {
    await fs.promises.writeFile(PROFILE_DB_FILE, JSON.stringify(profile, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing profile file:", error);
    throw error;
  }
}

async function loadProfileFromJson(): Promise<Profile | null> {
  try {
    if (!fs.existsSync(PROFILE_DB_FILE)) return null;
    const data = await fs.promises.readFile(PROFILE_DB_FILE, "utf-8");
    if (!data.trim()) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading profile file:", error);
    return null;
  }
}

function profileToDb(p: Profile): any {
  return {
    id: 'main',
    name: p.name,
    role: p.role,
    location: p.location,
    bio: p.bio,
    avatar_url: p.avatarUrl,
    email: p.email,
    github: p.github || null,
    linkedin: p.linkedin || null,
    instagram: p.instagram || null,
    tiktok: p.tiktok || null,
    about_paragraph1: p.aboutParagraph1 || null,
    about_paragraph2: p.aboutParagraph2 || null,
    about_quote: p.aboutQuote || null,
    skill_cat1_title: p.skillCat1Title || null,
    skill_cat1_desc: p.skillCat1Desc || null,
    skill_cat1_tags: p.skillCat1Tags || null,
    skill_cat2_title: p.skillCat2Title || null,
    skill_cat2_desc: p.skillCat2Desc || null,
    skill_cat2_tags: p.skillCat2Tags || null,
    skill_cat3_title: p.skillCat3Title || null,
    skill_cat3_desc: p.skillCat3Desc || null,
    skill_cat3_tags: p.skillCat3Tags || null,
    contact_title: p.contactTitle || null,
    contact_desc: p.contactDesc || null,
    hero_tag: p.heroTag || null,
    hero_heading: p.heroHeading || null,
  };
}

function profileFromDb(row: any): Profile {
  return {
    name: row.name,
    role: row.role,
    location: row.location,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    email: row.email,
    github: row.github || undefined,
    linkedin: row.linkedin || undefined,
    instagram: row.instagram || undefined,
    tiktok: row.tiktok || undefined,
    aboutParagraph1: row.about_paragraph1 || undefined,
    aboutParagraph2: row.about_paragraph2 || undefined,
    aboutQuote: row.about_quote || undefined,
    skillCat1Title: row.skill_cat1_title || undefined,
    skillCat1Desc: row.skill_cat1_desc || undefined,
    skillCat1Tags: row.skill_cat1_tags || undefined,
    skillCat2Title: row.skill_cat2_title || undefined,
    skillCat2Desc: row.skill_cat2_desc || undefined,
    skillCat2Tags: row.skill_cat2_tags || undefined,
    skillCat3Title: row.skill_cat3_title || undefined,
    skillCat3Desc: row.skill_cat3_desc || undefined,
    skillCat3Tags: row.skill_cat3_tags || undefined,
    contactTitle: row.contact_title || undefined,
    contactDesc: row.contact_desc || undefined,
    heroTag: row.hero_tag || undefined,
    heroHeading: row.hero_heading || undefined,
  };
}

async function getProfile(): Promise<Profile | null> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        const result = await pool.query("SELECT * FROM profiles WHERE id = 'main'");
        if (result.rows.length > 0) {
          return profileFromDb(result.rows[0]);
        }
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error reading profile from PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  return await loadProfileFromJson();
}

async function saveProfile(profile: Profile): Promise<Profile> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        const db = profileToDb(profile);
        const keys = Object.keys(db).filter(k => k !== 'id');
        const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
        const values = keys.map(k => (db as any)[k]);
        await pool.query(
          `INSERT INTO profiles (id, ${keys.join(', ')}) VALUES ($1, ${keys.map((_, i) => `$${i + 2}`).join(', ')})
           ON CONFLICT (id) DO UPDATE SET ${setClause}`,
          ['main', ...values]
        );
        return profile;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error saving profile to PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  await saveProfileToJson(profile);
  return profile;
}

// ========== PROJECT HELPERS ==========

async function saveProjectsToJson(projects: Project[]): Promise<void> {
  try {
    await fs.promises.writeFile(PROJECTS_DB_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing projects file:", error);
    throw error;
  }
}

async function loadProjectsFromJson(): Promise<Project[]> {
  try {
    if (!fs.existsSync(PROJECTS_DB_FILE)) return [];
    const data = await fs.promises.readFile(PROJECTS_DB_FILE, "utf-8");
    if (!data.trim()) return [];
    const list = JSON.parse(data);
    if (!Array.isArray(list)) return [];
    return list;
  } catch (error) {
    console.error("Error reading projects file:", error);
    return [];
  }
}

async function getAllProjects(): Promise<Project[]> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
        return result.rows.map((row: any) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          description: row.description,
          longDescription: row.long_description,
          imageUrl: row.image_url,
          tags: JSON.parse(row.tags || '[]'),
          role: row.role,
          year: row.year,
          client: row.client,
          link: row.link || undefined,
        }));
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error querying projects from PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  return await loadProjectsFromJson();
}

async function insertProject(proj: Project): Promise<Project> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        await pool.query(
          `INSERT INTO projects (id, title, category, description, long_description, image_url, tags, role, year, client, link)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO UPDATE SET title = $2, category = $3, description = $4, long_description = $5, image_url = $6, tags = $7, role = $8, year = $9, client = $10, link = $11`,
          [proj.id, proj.title, proj.category, proj.description, proj.longDescription, proj.imageUrl, JSON.stringify(proj.tags), proj.role, proj.year, proj.client, proj.link || null]
        );
        return proj;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error inserting project into PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  const projects = await loadProjectsFromJson();
  const filtered = projects.filter(p => p.id !== proj.id);
  filtered.push(proj);
  await saveProjectsToJson(filtered);
  return proj;
}

async function deleteProjectById(id: string): Promise<void> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        await pool.query("DELETE FROM projects WHERE id = $1", [id]);
        return;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error deleting project from PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  const projects = await loadProjectsFromJson();
  const filtered = projects.filter(p => p.id !== id);
  await saveProjectsToJson(filtered);
}

async function deleteAllProjects(): Promise<void> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        await pool.query("TRUNCATE TABLE projects");
        return;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error truncating projects table in PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  await saveProjectsToJson([]);
}

// ========== EXPERIENCE HELPERS ==========

async function saveExperiencesToJson(experiences: Experience[]): Promise<void> {
  try {
    await fs.promises.writeFile(EXPERIENCES_DB_FILE, JSON.stringify(experiences, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing experiences file:", error);
    throw error;
  }
}

async function loadExperiencesFromJson(): Promise<Experience[]> {
  try {
    if (!fs.existsSync(EXPERIENCES_DB_FILE)) return [];
    const data = await fs.promises.readFile(EXPERIENCES_DB_FILE, "utf-8");
    if (!data.trim()) return [];
    const list = JSON.parse(data);
    if (!Array.isArray(list)) return [];
    return list;
  } catch (error) {
    console.error("Error reading experiences file:", error);
    return [];
  }
}

async function getAllExperiences(): Promise<Experience[]> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        const result = await pool.query("SELECT * FROM experiences ORDER BY id DESC");
        return result.rows.map((row: any) => ({
          id: row.id,
          role: row.role,
          company: row.company,
          period: row.period,
          description: row.description,
          major: row.major || undefined,
        }));
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error querying experiences from PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  return await loadExperiencesFromJson();
}

async function insertExperience(exp: Experience): Promise<Experience> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        await pool.query(
          `INSERT INTO experiences (id, role, company, period, description, major)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET role = $2, company = $3, period = $4, description = $5, major = $6`,
          [exp.id, exp.role, exp.company, exp.period, exp.description, exp.major || null]
        );
        return exp;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error inserting experience into PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  const experiences = await loadExperiencesFromJson();
  const filtered = experiences.filter(e => e.id !== exp.id);
  filtered.push(exp);
  await saveExperiencesToJson(filtered);
  return exp;
}

async function deleteExperienceById(id: string): Promise<void> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        await pool.query("DELETE FROM experiences WHERE id = $1", [id]);
        return;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error deleting experience from PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  const experiences = await loadExperiencesFromJson();
  const filtered = experiences.filter(e => e.id !== id);
  await saveExperiencesToJson(filtered);
}

async function deleteAllExperiences(): Promise<void> {
  if (usePostgres && pool) {
    try {
      await checkTables();
      if (usePostgres && pool) {
        await pool.query("TRUNCATE TABLE experiences");
        return;
      }
    } catch (error: any) {
      dbInitializationError = error?.message || String(error);
      console.warn("Error truncating experiences table in PostgreSQL, falling back to local JSON:", error);
      usePostgres = false;
    }
  }

  await saveExperiencesToJson([]);
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
      databaseConfigured: Boolean(normalizedDatabaseUrl),
      databaseUrlPresent: Boolean(normalizedDatabaseUrl),
      message: `${usePostgres ? "Supabase PostgreSQL" : "Local JSON Database"} connection and write/delete test passed successfully!`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      mode: usePostgres ? "PostgreSQL (Supabase)" : "Local JSON File",
      databaseConfigured: Boolean(normalizedDatabaseUrl),
      databaseUrlPresent: Boolean(normalizedDatabaseUrl),
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

// ========== PROFILE API ==========

app.get("/api/profile", async (req, res) => {
  try {
    const profile = await getProfile();
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ error: "No profile found" });
    }
  } catch (error: any) {
    console.error("API error (GET /api/profile):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.put("/api/profile", async (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.name) {
      return res.status(400).json({ error: "Missing required profile fields" });
    }
    const saved = await saveProfile(profile);
    res.json(saved);
  } catch (error: any) {
    console.error("API error (PUT /api/profile):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// ========== PROJECTS API ==========

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (error: any) {
    console.error("API error (GET /api/projects):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const proj = req.body;
    if (!proj || !proj.id || !proj.title) {
      return res.status(400).json({ error: "Missing required project fields" });
    }
    const saved = await insertProject(proj);
    res.status(201).json(saved);
  } catch (error: any) {
    console.error("API error (POST /api/projects):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  try {
    const proj = { ...req.body, id: req.params.id };
    if (!proj.title) {
      return res.status(400).json({ error: "Missing required project fields" });
    }
    const saved = await insertProject(proj);
    res.json(saved);
  } catch (error: any) {
    console.error(`API error (PUT /api/projects/${req.params.id}):`, error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProjectById(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error(`API error (DELETE /api/projects/${req.params.id}):`, error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.delete("/api/projects", async (req, res) => {
  try {
    await deleteAllProjects();
    res.json({ success: true });
  } catch (error: any) {
    console.error("API error (DELETE /api/projects):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// ========== EXPERIENCES API ==========

app.get("/api/experiences", async (req, res) => {
  try {
    const experiences = await getAllExperiences();
    res.json(experiences);
  } catch (error: any) {
    console.error("API error (GET /api/experiences):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.post("/api/experiences", async (req, res) => {
  try {
    const exp = req.body;
    if (!exp || !exp.id || !exp.role || !exp.company) {
      return res.status(400).json({ error: "Missing required experience fields" });
    }
    const saved = await insertExperience(exp);
    res.status(201).json(saved);
  } catch (error: any) {
    console.error("API error (POST /api/experiences):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.put("/api/experiences/:id", async (req, res) => {
  try {
    const exp = { ...req.body, id: req.params.id };
    if (!exp.role || !exp.company) {
      return res.status(400).json({ error: "Missing required experience fields" });
    }
    const saved = await insertExperience(exp);
    res.json(saved);
  } catch (error: any) {
    console.error(`API error (PUT /api/experiences/${req.params.id}):`, error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.delete("/api/experiences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteExperienceById(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error(`API error (DELETE /api/experiences/${req.params.id}):`, error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.delete("/api/experiences", async (req, res) => {
  try {
    await deleteAllExperiences();
    res.json({ success: true });
  } catch (error: any) {
    console.error("API error (DELETE /api/experiences):", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

export { app };
