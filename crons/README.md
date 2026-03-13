# Crons - Automacoes Agendadas

O Claude Code nao tem crons nativos. Use uma destas opcoes:

## Opcao 1: n8n (recomendado)

Importe os workflows JSON no n8n:

| Arquivo | Horario | O que faz |
|---------|---------|-----------|
| weekly-plan.json | Seg 7h | Maestro cria plano semanal |
| daily-competitor.json | Diario 6h | Scout pesquisa concorrentes |
| daily-publish-check.json | Diario 8h | Kronos verifica publicacoes |

## Opcao 2: crontab do sistema

```bash
# Editar crontab
crontab -e

# Plano semanal - Segunda 7h
0 7 * * 1 cd /path/to/content-team-ai && claude --agent ct-maestro "Crie o plano semanal de conteudo"

# Pesquisa concorrentes - Diario 6h
0 6 * * * cd /path/to/content-team-ai && claude --agent ct-scout "Pesquise os concorrentes e reporte tendencias"

# Verificar publicacoes - Diario 8h
0 8 * * * cd /path/to/content-team-ai && claude --agent ct-kronos "Verifique publicacoes agendadas para hoje"
```

## Timezone

Todos os horarios em America/Sao_Paulo (UTC-3).
