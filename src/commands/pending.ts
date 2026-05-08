import { getPendingReminders } from '../repository/reminders.js'

export function pendingCommand() {
  const reminders = getPendingReminders()
  
  console.log(JSON.stringify({
    pending: reminders.map(r => ({
      id: r.id,
      title: r.title,
      times: r.times.split(',').map(t => t.trim())
    }))
  }))
}