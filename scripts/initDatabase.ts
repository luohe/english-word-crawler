import { Database } from 'sqlite3';
import { open } from 'sqlite';

async function initDatabase() {
    const db = await open({
        filename: './database.sqlite',
        driver: Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS proxies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            status TEXT NOT NULL,
            last_checked DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS crawled_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await db.close();
}

initDatabase().catch(err => {
    console.error('Error initializing database:', err);
});