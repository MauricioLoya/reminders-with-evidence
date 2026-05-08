---
name: reminders-cli
description: CLI tool to manage reminders with evidence tracking for OpenClaw
trigger: When user asks to manage reminders, add tasks to track, or check pending items
---

# Reminders CLI Skill

This skill provides instructions for interacting with the reminders CLI tool that helps OpenClaw (Carqui) have memory of tasks you've completed with evidence.

## When to use this skill

- User asks to "recordar algo", "agendar recordatorio", "trackear tarea"
- User wants to add a new reminder for the day
- User shows evidence of completing a task and you need to mark it as done
- User asks what tasks are pending
- You need to check if a task is already completed before asking again

## Project Location

The reminders tool is located at:
```
/root/systems/reminders-with-evidence/
```

All commands should be run from this directory with:
```bash
cd /root/systems/reminders-with-evidence && bun run src/cli.ts <command>
```

## Available Commands

### 1. Add a new reminder

```bash
bun run src/cli.ts add "Tarea title" --times "12:00,15:00,17:00,18:30"
```

- `title`: What the reminder is about
- `times`: Comma-separated list of times to ask (use 24h format)

**Example:** For "Agendar tarea de inglés" that should be asked at 12pm, 3pm, 5pm, and 6:30pm:
```bash
bun run src/cli.ts add "Agendar tarea inglés" --times "12:00,15:00,17:00,18:30"
```

### 2. Check pending reminders (JSON output)

```bash
bun run src/cli.ts pending
```

Returns JSON with all reminders that don't have evidence yet. Use this to know what to ask the user about.

**Example output:**
```json
{"pending":[{"id":1,"title":"Agendar tarea inglés","times":["12:00","15:00","17:00","18:30"]}]}
```

### 3. Mark reminder as complete

```bash
bun run src/cli.ts complete <id> --evidence "/path/to/screenshot.png"
```

- `id`: The reminder ID (from pending or list command)
- `evidence`: Optional path to evidence file

**Example:**
```bash
bun run src/cli.ts complete 1 --evidence "/root/systems/screenshots/screenshot.png"
```

### 4. List all reminders

```bash
bun run src/cli.ts list
```

Shows all reminders with their status (completed or pending).

### 5. Reset a reminder for a new day

```bash
bun run src/cli.ts reset <id>
```

Resets a completed reminder back to pending so it can be asked again the next day.

## Workflow with OpenClaw (Carqui)

### Morning: Check what to ask

1. Run `bun run src/cli.ts pending` to get pending reminders
2. For each pending reminder, check the current time against the `times` array
3. Ask the user at the appropriate times

### When user shows evidence

1. Run `bun run src/cli.ts complete <id> --evidence <path>` to mark as done
2. Next time you check `pending`, that reminder won't appear

### Daily reset

If a reminder needs to be asked again another day:
1. Run `bun run src/cli.ts reset <id>` to reset it to pending

## Important Notes

- **Always use JSON output** - The CLI returns JSON so you can parse it easily
- **Check pending before asking** - Don't ask about a task that already has evidence
- **Store the evidence path** - If user provides a screenshot, pass the path to the complete command
- **Times are in 24h format** - "15:00" is 3pm, "18:30" is 6:30pm