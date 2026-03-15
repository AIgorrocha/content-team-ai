/**
 * run-script.mjs - Executar scripts existentes via child_process
 */

import { execFile } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCRIPTS_DIR = resolve(__dirname, '../../scripts')

const ALLOWED_SCRIPTS = [
  'cross-post.mjs',
  'generate-weekly-plan.mjs',
  'daily-publish-check.mjs',
  'auto-publish.mjs',
  'process-video.mjs',
  'post-carousel.mjs',
  'post-linkedin.mjs',
  'scrape-competitors.mjs',
]

export const definition = {
  name: 'run_script',
  description: 'Executa um dos scripts existentes do content-team. Scripts disponiveis: ' + ALLOWED_SCRIPTS.join(', '),
  input_schema: {
    type: 'object',
    properties: {
      script: {
        type: 'string',
        description: 'Nome do script (ex: "cross-post.mjs")',
      },
      args: {
        type: 'array',
        items: { type: 'string' },
        description: 'Argumentos para o script (opcional)',
      },
    },
    required: ['script'],
  },
}

export async function execute(input) {
  const { script, args = [] } = input

  if (!ALLOWED_SCRIPTS.includes(script)) {
    return { error: `Script "${script}" nao permitido. Permitidos: ${ALLOWED_SCRIPTS.join(', ')}` }
  }

  const scriptPath = resolve(SCRIPTS_DIR, script)

  return new Promise((resolve) => {
    const child = execFile('node', [scriptPath, ...args], {
      timeout: 120_000,
      env: process.env,
      cwd: SCRIPTS_DIR,
    }, (error, stdout, stderr) => {
      if (error) {
        resolve({ error: error.message, stderr: stderr?.substring(0, 500) })
      } else {
        resolve({
          success: true,
          stdout: stdout?.substring(0, 2000) || '(sem output)',
          stderr: stderr?.substring(0, 500) || '',
        })
      }
    })
  })
}
