#!/usr/bin/env node
import meow from 'meow'
import { addCommand } from './commands/add.js'
import { listCommand } from './commands/list.js'
import { pendingCommand } from './commands/pending.js'
import { completeCommand } from './commands/complete.js'
import { resetCommand } from './commands/reset.js'

const cli = meow(
  `
  Usage
    $ reminders <command> [options]

  Commands
    add <title> --times "12:00,15:00,17:00,18:30"    Agrega un recordatorio nuevo
    list                                            Lista todos los recordatorios
    pending                                         Muestra los pendientes (JSON)
    complete <id> --evidence <path>                 Marca como completado
    reset <id>                                       Resetea para nuevo día

  Options
    --times, -t    Horarios separados por coma
    --evidence, -e Path a la evidencia (opcional)

  Examples
    $ reminders add "Agendar tarea inglés" --times "12:00,15:00,17:00,18:30"
    $ reminders list
    $ reminders pending
    $ reminders complete 1 --evidence "/path/to/screenshot.png"
    $ reminders reset 1
`,
  {
    importMeta: import.meta,
    flags: {
      times: {
        type: 'string',
        shortFlag: 't'
      },
      evidence: {
        type: 'string',
        shortFlag: 'e'
      }
    }
  }
)

const [command, ...args] = cli.input

switch (command) {
  case 'add': {
    const [title, ...restTitle] = args
    const titleStr = title || restTitle.join(' ')
    
    if (!titleStr) {
      console.error('Error: El título es requerido')
      process.exit(1)
    }
    
    const times = cli.flags.times
    if (!times) {
      console.error('Error: --times es requerido para add')
      process.exit(1)
    }
    
    addCommand(titleStr, times)
    break
  }

  case 'list':
    listCommand()
    break

  case 'pending':
    pendingCommand()
    break

  case 'complete': {
    const id = parseInt(args[0], 10)
    if (isNaN(id)) {
      console.error('Error: El ID debe ser un número')
      process.exit(1)
    }
    completeCommand(id, cli.flags.evidence)
    break
  }

  case 'reset': {
    const id = parseInt(args[0], 10)
    if (isNaN(id)) {
      console.error('Error: El ID debe ser un número')
      process.exit(1)
    }
    resetCommand(id)
    break
  }

  default:
    cli.showHelp()
    break
}