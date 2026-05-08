import { Database } from 'bun:sqlite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, '..', 'database.sqlite')

export const db = new Database(dbPath)

// Initialize schema
db.run(`
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    times TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    evidence_at DATETIME NULL
  )
`)

export type Reminder = {
  id: number
  title: string
  times: string
  created_at: string
  evidence_at: string | null
}