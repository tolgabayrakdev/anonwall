// Database initialization script
// Run this once to set up the database schema

import pool from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = schema.split(';').filter(s => s.trim().length > 0);
        
        for (const statement of statements) {
            if (statement.trim()) {
                await pool.query(statement);
            }
        }
        
        console.log('Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
}

initDatabase();

