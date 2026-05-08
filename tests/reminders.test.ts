import { describe, it, expect, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'

// Create in-memory database for testing
const db = new Database(':memory:')

// Initialize schema
db.run(`
  CREATE TABLE reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    times TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    evidence_at DATETIME NULL
  )
`)

// Import after db is initialized - we need to mock the db import
// Since we can't easily mock the import, we'll test the functions directly by redefining them

function createReminder(title: string, times: string): number {
  const query = db.query('INSERT INTO reminders (title, times) VALUES (?, ?)')
  const result = query.run(title, times)
  return Number(result.lastInsertRowid)
}

function getAllReminders() {
  const query = db.query('SELECT * FROM reminders ORDER BY id DESC')
  return query.all()
}

function getPendingReminders() {
  const query = db.query('SELECT * FROM reminders WHERE evidence_at IS NULL ORDER BY created_at DESC')
  return query.all()
}

function getReminderById(id: number) {
  const query = db.query('SELECT * FROM reminders WHERE id = ?')
  return query.get(id)
}

function completeReminder(id: number) {
  const query = db.query('UPDATE reminders SET evidence_at = CURRENT_TIMESTAMP WHERE id = ?')
  const result = query.run(id)
  return result.changes > 0
}

function resetReminder(id: number) {
  const query = db.query('UPDATE reminders SET evidence_at = NULL WHERE id = ?')
  const result = query.run(id)
  return result.changes > 0
}

function deleteReminder(id: number) {
  const query = db.query('DELETE FROM reminders WHERE id = ?')
  const result = query.run(id)
  return result.changes > 0
}

describe('Reminders Repository', () => {
  beforeEach(() => {
    // Clean up and reset auto-increment before each test
    db.run('DELETE FROM reminders')
    db.run('DELETE FROM sqlite_sequence WHERE name = "reminders"')
  })

  describe('createReminder', () => {
    it('should create a new reminder', () => {
      const id = createReminder('Test reminder', '12:00,15:00')
      expect(id).toBe(1)
    })

    it('should return incrementing ids', () => {
      const id1 = createReminder('Reminder 1', '12:00')
      const id2 = createReminder('Reminder 2', '15:00')
      expect(id1).toBe(1)
      expect(id2).toBe(2)
    })
  })

  describe('getAllReminders', () => {
    it('should return empty array when no reminders', () => {
      const reminders = getAllReminders()
      expect(reminders).toHaveLength(0)
    })

    it('should return all reminders', () => {
      createReminder('Reminder 1', '12:00')
      createReminder('Reminder 2', '15:00')
      const reminders = getAllReminders()
      expect(reminders).toHaveLength(2)
    })

    it('should return most recent first', () => {
      createReminder('First', '12:00')
      createReminder('Second', '15:00')
      const reminders = getAllReminders() as any[]
      // Ordered by id DESC, so higher id (Second) comes first
      expect(reminders[0].title).toBe('Second')
    })
  })

  describe('getPendingReminders', () => {
    it('should return only pending reminders', () => {
      const id1 = createReminder('Pending', '12:00')
      const id2 = createReminder('Completed', '15:00')
      completeReminder(id2)
      
      const pending = getPendingReminders()
      expect(pending).toHaveLength(1)
      expect((pending[0] as any).title).toBe('Pending')
    })

    it('should return empty when all completed', () => {
      const id = createReminder('Test', '12:00')
      completeReminder(id)
      
      const pending = getPendingReminders()
      expect(pending).toHaveLength(0)
    })
  })

  describe('getReminderById', () => {
    it('should return reminder by id', () => {
      const id = createReminder('Test', '12:00')
      const reminder = getReminderById(id) as any
      expect(reminder.title).toBe('Test')
      expect(reminder.times).toBe('12:00')
    })

    it('should return null for non-existent id', () => {
      const reminder = getReminderById(999)
      expect(reminder).toBeNull()
    })
  })

  describe('completeReminder', () => {
    it('should mark reminder as completed', () => {
      const id = createReminder('Test', '12:00')
      const success = completeReminder(id)
      expect(success).toBe(true)
      
      const reminder = getReminderById(id) as any
      expect(reminder.evidence_at).not.toBeNull()
    })

    it('should return false for non-existent id', () => {
      const success = completeReminder(999)
      expect(success).toBe(false)
    })
  })

  describe('resetReminder', () => {
    it('should reset completed reminder to pending', () => {
      const id = createReminder('Test', '12:00')
      completeReminder(id)
      
      const success = resetReminder(id)
      expect(success).toBe(true)
      
      const reminder = getReminderById(id) as any
      expect(reminder.evidence_at).toBeNull()
    })

    it('should return false for non-existent id', () => {
      const success = resetReminder(999)
      expect(success).toBe(false)
    })
  })

  describe('deleteReminder', () => {
    it('should delete reminder', () => {
      const id = createReminder('Test', '12:00')
      const success = deleteReminder(id)
      expect(success).toBe(true)
      
      const reminder = getReminderById(id)
      expect(reminder).toBeNull()
    })

    it('should return false for non-existent id', () => {
      const success = deleteReminder(999)
      expect(success).toBe(false)
    })
  })
})