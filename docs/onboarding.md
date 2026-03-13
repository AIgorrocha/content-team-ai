# Onboarding - Passo a Passo

## O que voce precisa

1. **Claude Code** instalado no seu computador
2. **Conta Supabase** com as tabelas ct_* criadas
3. **Chaves de API** (Instagram, RapidAPI, etc.)

## Passo 1: Clonar o repositorio

```bash
git clone https://github.com/igorrochasoares/content-team-ai.git
cd content-team-ai
```

## Passo 2: Configurar variaveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas chaves reais. Cada chave tem um comentario explicando onde conseguir.

## Passo 3: Instalar dependencias

```bash
npm install
```

Isso instala o Playwright (para carrosseis) e outras dependencias.

## Passo 4: Abrir com Claude Code

```bash
claude .
```

O Claude Code vai ler o CLAUDE.md automaticamente e saber que tem 13 agentes disponiveis.

## Passo 5: Testar

Fale com o Claude:

```
"Cria um post sobre automacao com IA para Instagram"
```

O Maestro vai delegar para o Quill (texto) e Slider (carrossel).

## Analogia

Pense no Content Team AI como uma **empresa virtual**:
- Voce e o **dono** (da as ordens)
- O **Maestro** e o **gerente** (distribui tarefas)
- Os outros 12 sao **funcionarios** especializados

Voce so fala com o gerente. Ele cuida do resto.

## Problemas Comuns

| Problema | Solucao |
|----------|---------|
| "Agente nao encontrado" | Verifique que os arquivos .md estao em `agents/` |
| "Supabase nao conecta" | Verifique SUPABASE_URL e SUPABASE_SERVICE_KEY no .env |
| "Carrossel nao gera" | Rode `npx playwright install chromium` |
| "Instagram nao publica" | Verifique INSTAGRAM_ACCESS_TOKEN (expira a cada 60 dias) |
