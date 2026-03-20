# HEARTBEAT.md

Durante execução longa:

- Reportar progresso a cada etapa relevante
- Não ficar silencioso por longos períodos

## 🌅 Briefing Matinal

Todos os dias às 7:30am, executar o script de briefing automático:

```bash
/data/.openclaw/workspace/rotina-briefing.sh
```

O briefing inclui:
- 📍 Previsão do tempo para Porto Alegre
- 💵 Cotação do dólar
- 🛢️ Preço do barril de petróleo

A mensagem é salva em `/data/.openclaw/workspace/rotina-briefing.log`.

Para envio automático pelo WhatsApp, é necessário configurar a API do WhatsApp.
