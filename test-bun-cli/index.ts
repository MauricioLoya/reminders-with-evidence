#!/usr/bin/env node
import meow from 'meow'

const cli = meow(
  `
  Usage
    $ my-cli <command> [options]

  Commands
    add     Agrega una nueva tarjeta
    list    Lista las tarjetas

  Options
    --name, -n    Nombre de la tarjeta (para add)
    --all, -a     Muestra todas las tarjetas (para list)

  Examples
    $ my-cli add --name "Tarjeta de crédito"
    $ my-cli list --all
`,
  {
    importMeta: import.meta,
    flags: {
      name: {
        type: 'string',
        shortFlag: 'n'
      },
      all: {
        type: 'boolean',
        shortFlag: 'a',
        default: false
      }
    }
  }
)

// cli.input es un array con los argumentos posicionales
// ej: "my-cli add --name foo" → cli.input = ['add']
const [command] = cli.input

switch (command) {
  case 'add':
    if (!cli.flags.name) {
      console.error('Error: --name es requerido para add')
      process.exit(1)
    }
    console.log(`Agregando: ${cli.flags.name}`)
    // tu lógica aquí
    break

  case 'list':
    console.log(`Listando tarjetas${cli.flags.all ? ' (todas)' : ''}`)
    // tu lógica aquí
    break

  default:
    cli.showHelp() // muestra el texto de Usage
    break
}
