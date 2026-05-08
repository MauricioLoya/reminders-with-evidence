import { createReminder } from '../repository/reminders.js'

export function addCommand(title: string, times: string) {
  if (!title) {
    console.error('Error: El título es requerido')
    process.exit(1)
  }
  
  if (!times) {
    console.error('Error: Los horarios son requeridos')
    process.exit(1)
  }

  const id = createReminder(title, times)
  console.log(JSON.stringify({ success: true, id, title, times }))
}