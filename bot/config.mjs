/**
 * config.mjs - Validacao de env vars
 */

// Carregar .env se existir (para dev local)
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

try {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const envPath = resolve(__dirname, '../.env')
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.substring(0, eqIndex)
    const value = trimmed.substring(eqIndex + 1)
    if (!process.env[key]) process.env[key] = value
  }
} catch {}

const required = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
}

const missing = Object.entries(required)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missing.length > 0) {
  console.error(`Variaveis faltando: ${missing.join(', ')}`)
  process.exit(1)
}

export const config = {
  anthropicApiKey: required.ANTHROPIC_API_KEY,
  supabaseUrl: required.SUPABASE_URL,
  supabaseKey: required.SUPABASE_SERVICE_ROLE_KEY,
  telegramToken: required.TELEGRAM_BOT_TOKEN,
  telegramChatId: required.TELEGRAM_CHAT_ID,
  telegramApi: `https://api.telegram.org/bot${required.TELEGRAM_BOT_TOKEN}`,
  model: 'claude-haiku-4-5-20251001',
  maxHistoryMessages: 20,
  historyTtlMs: 30 * 60 * 1000,
}
