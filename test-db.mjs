// Test script - diagnosa koneksi Supabase PostgreSQL
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Baca .env manual
const envPath = resolve(process.cwd(), '.env');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
  console.log('[OK] File .env berhasil dibaca');
} catch (e) {
  console.error('[GAGAL] Membaca .env:', e.message);
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('[GAGAL] DATABASE_URL tidak ditemukan di .env!');
  process.exit(1);
}
console.log('[OK] DATABASE_URL ditemukan:', dbUrl.replace(/:([^@]+)@/, ':***@'));

let pg;
try {
  pg = require('pg');
  console.log('[OK] Package pg berhasil diimport');
} catch(e) {
  console.error('[GAGAL] Import pg:', e.message);
  process.exit(1);
}

const { Pool } = pg;

// Bersihkan sslmode dari URL (pg v8+ memperlakukan sslmode=require sbg verify-full)
const baseUrl = dbUrl.replace(/[?&]sslmode=[^&]*/g, '').replace(/\?$/, '');
const url6543 = baseUrl; // Transaction Pooler
const url5432 = baseUrl.replace(':6543/', ':5432/'); // Session Pooler

async function tryConnect(url, label) {
  console.log(`\n[TEST] ${label}: ${url.replace(/:([^@]+)@/, ':***@')}`);
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as t, version() as v');
    console.log(`[OK] BERHASIL! Waktu server:`, result.rows[0].t);
    console.log(`[INFO] PG:`, result.rows[0].v.split(' ').slice(0,2).join(' '));
    
    const tableCheck = await client.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='messages') as exists`
    );
    const tableExists = tableCheck.rows[0].exists;
    console.log(`[INFO] Tabel messages:`, tableExists ? 'Sudah ada' : 'Belum ada (akan dibuat otomatis saat server start)');
    if (tableExists) {
      const count = await client.query('SELECT COUNT(*) as c FROM messages');
      console.log(`[INFO] Jumlah data di tabel messages:`, count.rows[0].c);
    }
    client.release();
    await pool.end();
    return true;
  } catch (err) {
    console.error(`[GAGAL]:`, err.message);
    if (err.code) console.error(`[CODE]:`, err.code);
    if (client) client.release();
    await pool.end().catch(() => {});
    return false;
  }
}

console.log('\n========== MULAI TEST KONEKSI SUPABASE ==========');
const ok6543 = await tryConnect(url6543, 'Transaction Pooler (port 6543)');
const ok5432 = !ok6543 ? await tryConnect(url5432, 'Session Pooler (port 5432)') : false;

console.log('\n========== RINGKASAN ==========');
if (ok6543) {
  console.log('[REKOMENDASI] Gunakan port 6543 (Transaction Pooler) — SUDAH BERFUNGSI!');
  console.log('[URL UNTUK .env]:', baseUrl.replace(/:([^@]+)@/, ':***@'));
} else if (ok5432) {
  console.log('[REKOMENDASI] Gunakan port 5432 (Session Pooler)');
  console.log('[URL UNTUK .env]:', url5432.replace(/:([^@]+)@/, ':***@'));
  console.log('\n[ACTION] Update DATABASE_URL di .env dengan ganti :6543/ menjadi :5432/');
} else {
  console.log('[ERROR] Semua koneksi GAGAL!');
  console.log('[SOLUSI] Kemungkinan project Supabase dalam status PAUSE.');
  console.log('[ACTION] Buka https://supabase.com/dashboard dan klik "Restore" pada project kamu.');
}
