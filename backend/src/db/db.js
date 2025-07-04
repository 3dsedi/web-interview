import Database from 'better-sqlite3'
import path from 'path'

let db

try {
  const dbPath = path.join(process.cwd(), 'data', 'todos.db')
  db = new Database(dbPath)
  db.exec(`
    CREATE TABLE IF NOT EXISTS todo_lists (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      list_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      text TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      due_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (list_id) REFERENCES todo_lists(id) ON DELETE CASCADE
    );
  `)
} catch (error) {
  console.error('Error initializing database or creating tables:', error)
  throw error
}

export default db