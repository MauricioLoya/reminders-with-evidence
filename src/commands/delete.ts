import { deleteReminder, getReminderById } from '../repository/reminders.js'

export function deleteCommand(id: number) {
  if (!id) {
    console.error('Error: El ID es requerido')
    process.exit(1)
  }

  const reminder = getReminderById(id)
  if (!reminder) {
    console.error(`Error: No existe recordatorio con ID ${id}`)
    process.exit(1)
  }

  const success = deleteReminder(id)
  console.log(JSON.stringify({ success, id, title: reminder.title }))
}