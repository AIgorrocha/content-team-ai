# Mapa de Delegacao - Content Team AI

## Hierarquia

```
Igor (Usuario)
  └── Maestro (ct-maestro) — Diretor Geral
        ├── Kronos (ct-kronos) — Calendario/Prazos
        ├── Quill (ct-quill) — Redacao/Copy
        ├── Scout (ct-scout) — Pesquisa/Tendencias
        ├── Slider (ct-slider) — Carrosseis
        ├── Pixel (ct-pixel) — Design/Visual
        ├── Remix (ct-remix) — Reaproveitamento
        ├── Doppel (ct-doppel) — Videos/Avatar
        ├── Echo (ct-echo) — Social/DMs
        ├── Beacon (ct-beacon) — Email Marketing
        ├── Tuner (ct-tuner) — Otimizacao
        ├── Bridge (ct-bridge) — Parcerias
        └── Nexus (ct-nexus) — Integracoes
```

## Fluxos Comuns

### Criar Post Instagram
1. Igor pede → Maestro
2. Maestro → Quill (escreve copy)
3. Maestro → Slider (cria carrossel) ou Pixel (imagem)
4. Maestro valida → Igor aprova
5. Maestro → instagram-poster skill

### Pesquisar Concorrentes
1. Igor pede → Maestro
2. Maestro → Scout (pesquisa)
3. Scout → Supabase (salva em ct_competitor_posts)
4. Scout retorna relatorio → Maestro → Igor

### Criar Sequencia de Email
1. Igor pede → Maestro
2. Maestro → Quill (escreve copys dos emails)
3. Maestro → Beacon (configura sequencia no Supabase)
4. Beacon → Mailjet (agenda envios)

### Reaproveitar Conteudo
1. Igor pede → Maestro
2. Maestro → Remix (adapta para outra plataforma)
3. Maestro → Tuner (otimiza para a plataforma destino)
4. Maestro valida → Igor aprova

## Regras

- Todo pedido passa pelo Maestro primeiro
- Maestro NUNCA produz conteudo diretamente
- Sub-agentes podem se comunicar entre si via Maestro
- Publicacao SEMPRE requer aprovacao do Igor
