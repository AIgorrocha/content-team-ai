-- ============================================
-- Phase 5: Credentials Vault (ct_credentials)
-- Stores encrypted API keys/tokens in client DB
-- ============================================

CREATE TABLE IF NOT EXISTS ct_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service VARCHAR(50) NOT NULL,
  credential_key VARCHAR(100) NOT NULL,
  encrypted_value TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(service, credential_key)
);

CREATE INDEX IF NOT EXISTS idx_credentials_service ON ct_credentials(service);

-- ============================================
-- Phase 6: Agent-OpenClaw mapping
-- ============================================

CREATE TABLE IF NOT EXISTS ct_agent_openclaw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug VARCHAR(100) NOT NULL UNIQUE,
  openclaw_session_id VARCHAR(255),
  openclaw_workspace VARCHAR(255),
  provisioned_at TIMESTAMPTZ,
  last_sync_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_openclaw_slug ON ct_agent_openclaw(agent_slug);
