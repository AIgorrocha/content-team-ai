#!/bin/bash
# setup-vps-crons.sh
# Configura crontab na VPS pra rodar os scripts do Content Team AI
#
# Uso: ssh root@VPS "bash /root/content-team-ai/scripts/setup-vps-crons.sh"

CONTENT_DIR="/root/content-team-ai"
LOG_DIR="/tmp"

echo "🔧 Configurando crons do Content Team AI..."

# Carregar .env
set -a
source "$CONTENT_DIR/.env" 2>/dev/null
set +a

# Criar crontab entries
CRON_ENTRIES="
# === Content Team AI Crons ===
# Scraping de concorrentes (diario 6h BRT)
0 6 * * * cd $CONTENT_DIR && /usr/bin/node scripts/scrape-competitors.mjs >> $LOG_DIR/scrape-competitors.log 2>&1

# Daily publish check (diario 8h BRT)
0 8 * * * cd $CONTENT_DIR && /usr/bin/node scripts/daily-publish-check.mjs >> $LOG_DIR/daily-publish-check.log 2>&1

# Plano semanal (segunda 7h BRT)
0 7 * * 1 cd $CONTENT_DIR && /usr/bin/node scripts/generate-weekly-plan.mjs >> $LOG_DIR/weekly-plan.log 2>&1

# Auto-publish (a cada 30min)
*/30 * * * * cd $CONTENT_DIR && /usr/bin/node scripts/auto-publish.mjs >> $LOG_DIR/auto-publish.log 2>&1
# === Fim Content Team AI ===
"

# Preservar crontab existente, remover entries antigas do Content Team
crontab -l 2>/dev/null | sed '/=== Content Team AI/,/=== Fim Content Team AI ===/d' > /tmp/crontab_temp
echo "$CRON_ENTRIES" >> /tmp/crontab_temp
crontab /tmp/crontab_temp
rm /tmp/crontab_temp

echo "✅ Crons configurados!"
echo ""
echo "Verificando:"
crontab -l | grep -A1 "Content Team"
echo ""
echo "Logs em:"
echo "  $LOG_DIR/scrape-competitors.log"
echo "  $LOG_DIR/daily-publish-check.log"
echo "  $LOG_DIR/weekly-plan.log"
echo "  $LOG_DIR/auto-publish.log"
