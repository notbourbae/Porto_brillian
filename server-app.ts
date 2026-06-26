import express from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase with the workspace configuration
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
const messagesCol = collection(db, "messages");

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

async function getAllMessages(): Promise<Message[]> {
  const snapshot = await getDocs(messagesCol);
  const list: Message[] = [];
  snapshot.forEach(document => {
    list.push(document.data() as Message);
  });
  // Sort messages: newest first
  return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

async function insertMessage(msg: Message): Promise<Message> {
  const docRef = doc(db, "messages", msg.id);
  await setDoc(docRef, msg);
  return msg;
}

async function deleteMessageById(id: string): Promise<void> {
  const docRef = doc(db, "messages", id);
  await deleteDoc(docRef);
}

async function deleteAllMessages(): Promise<void> {
  const snapshot = await getDocs(messagesCol);
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, "messages", document.id));
  }
}

const app = express();

// Add JSON parsing middleware
app.use(express.json());

// API routes
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
