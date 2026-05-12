import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "data.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to connect to SQLite", err);
        return;
    }
    console.log("Connected to SQLite database");
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS organisation_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain TEXT UNIQUE NOT NULL,
        company_name TEXT,
        legal_name TEXT,
        company_number TEXT,
        industry TEXT,
        website TEXT,
        linkedin_url TEXT,
        companies_house_status TEXT,
        confidence_score INTEGER,
        source_data TEXT,
        last_checked TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

export default db;