import { getAllReminders } from '../repository/reminders.js'

export function listCommand() {
  const reminders = getAllReminders()
  
  console.log(JSON.stringify({
    reminders: reminders.map(r => ({
      id: r.id,
      title: r.title,
      times: r.times,
      created_at: r.created_at,
      completed: r.evidence_at !== null,
      evidence_at: r.evidence_at
    }))
  }))
}