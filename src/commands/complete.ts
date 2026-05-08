import { completeReminder, getReminderById } from '../repository/reminders.js'

export function completeCommand(id: number, evidencePath?: string) {
  if (!id) {
    console.error('Error: El ID es requerido')
    process.exit(1)
  }

  const reminder = getReminderById(id)
  if (!reminder) {
    console.error(`Error: No existe recordatorio con ID ${id}`)
    process.exit(1)
  }

  const success = completeReminder(id, evidencePath)
  console.log(JSON.stringify({ success, id, title: reminder.title }))
}