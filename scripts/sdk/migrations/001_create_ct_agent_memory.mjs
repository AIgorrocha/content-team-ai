/**
 * Migration: Criar tabela ct_agent_memory
 * Uso: node scripts/sdk/migrations/001_create_ct_agent_memory.mjs
 */
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const SQL = `
CREATE TABLE IF NOT EXISTS ct_agent_memory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent text NOT NULL,
  category text NOT NULL CHECK (category IN ('resultado', 'decisao', 'aprendizado', 'contexto', 'handoff')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  session_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ct_agent_memory_agent ON ct_agent_memory(agent);
CREATE INDEX IF NOT EXISTS idx_ct_agent_memory_category ON ct_agent_memory(category);
CREATE INDEX IF NOT EXISTS idx_ct_agent_memory_session ON ct_agent_memory(session_id);
CREATE INDEX IF NOT EXISTS idx_ct_agent_memory_created ON ct_agent_memory(created_at DESC);

COMMENT ON TABLE ct_agent_memory IS 'Memoria persistente dos agentes — estilo OpenClaw Camada 2';
`

async function migrate() {
  console.log('🔄 Criando tabela ct_agent_memory...')

  const { error } = await supabase.rpc('exec_sql', { sql: SQL }).maybeSingle()

  if (error) {
    // rpc exec_sql pode nao existir, tentar via REST
    console.log('⚠️  rpc exec_sql nao disponivel, tentando via fetch...')

    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql: SQL })
    })

    if (!response.ok) {
      console.log('⚠️  REST tambem falhou. Execute o SQL manualmente no Supabase Dashboard:')
      console.log('\n' + SQL)
      console.log('\n📋 Copie o SQL acima e cole no SQL Editor do Supabase.')
      return
    }
  }

  console.log('✅ Tabela ct_agent_memory criada com sucesso!')

  // Verificar
  const { data, error: checkError } = await supabase
    .from('ct_agent_memory')
    .select('id')
    .limit(1)

  if (checkError) {
    console.log('❌ Verificacao falhou:', checkError.message)
  } else {
    console.log('✅ Verificacao OK — tabela acessivel')
  }
}

migrate().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
