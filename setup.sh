#!/bin/bash
# Content Team AI - Setup Script
# Instala dependencias e configura o ambiente

set -e

echo "=== Content Team AI - Setup ==="
echo ""

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
  echo "ERRO: Node.js nao encontrado. Instale em https://nodejs.org"
  exit 1
fi
echo "Node.js: $(node --version)"

# 2. Verificar Claude Code
if ! command -v claude &> /dev/null; then
  echo "AVISO: Claude Code nao encontrado. Instale com: npm install -g @anthropic-ai/claude-code"
fi

# 3. Instalar dependencias
echo ""
echo "Instalando dependencias..."
npm install

# 4. Instalar Playwright Chromium
echo ""
echo "Instalando Playwright Chromium (para carrosseis)..."
npx playwright install chromium

# 5. Verificar .env
if [ ! -f .env ]; then
  echo ""
  echo "AVISO: Arquivo .env nao encontrado!"
  echo "Copie o template: cp .env.example .env"
  echo "E edite com suas chaves de API."
fi

# 6. Copiar foto do Igor (se existir no repo original)
if [ -f "../configuracoes moltbot/carousel-output/igor-photo.jpg" ]; then
  cp "../configuracoes moltbot/carousel-output/igor-photo.jpg" skills/carousel-generator/assets/
  echo "Foto do Igor copiada para assets/"
fi

echo ""
echo "=== Setup concluido! ==="
echo ""
echo "Proximo passo: abra com 'claude .' e fale com o Maestro"
echo "Exemplo: 'cria um post sobre automacao com IA para Instagram'"
