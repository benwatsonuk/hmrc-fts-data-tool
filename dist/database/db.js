"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(process.cwd(), "data.sqlite");
const db = new sqlite3_1.default.Database(dbPath, (err) => {
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
exports.default = db;
