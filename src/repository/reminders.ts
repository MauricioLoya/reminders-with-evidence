import { db, Reminder } from '../db.js'

export function createReminder(title: string, times: string): number {
  const query = db.query('INSERT INTO reminders (title, times) VALUES (?, ?)')
  const result = query.run(title, times)
  return Number(result.lastInsertRowid)
}

export function getAllReminders(): Reminder[] {
  const query = db.query('SELECT * FROM reminders ORDER BY created_at DESC')
  return query.all() as Reminder[]
}

export function getPendingReminders(): Reminder[] {
  const query = db.query('SELECT * FROM reminders WHERE evidence_at IS NULL ORDER BY created_at DESC')
  return query.all() as Reminder[]
}

export function getReminderById(id: number): Reminder | undefined {
  const query = db.query('SELECT * FROM reminders WHERE id = ?')
  return query.get(id) as Reminder | undefined
}

export function completeReminder(id: number, _evidencePath?: string): boolean {
  const query = db.query('UPDATE reminders SET evidence_at = CURRENT_TIMESTAMP WHERE id = ?')
  const result = query.run(id)
  return result.changes > 0
}

export function resetReminder(id: number): boolean {
  const query = db.query('UPDATE reminders SET evidence_at = NULL WHERE id = ?')
  const result = query.run(id)
  return result.changes > 0
}

export function deleteReminder(id: number): boolean {
  const query = db.query('DELETE FROM reminders WHERE id = ?')
  const result = query.run(id)
  return result.changes > 0
}