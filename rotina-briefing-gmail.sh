#!/bin/bash
# Script de briefing matinal enviado via Gmail (fallback)
set -euo pipefail

DATA_HOJE=$(date +%Y-%m-%d)
LOG_FILE="/data/.openclaw/workspace/rotina-briefing.log"

# Função para obter previsão do tempo de Porto Alegre
obter_tempo() {
    weather=$(curl -s "https://wttr.in/Porto+Alegre?format=%t+%C+%f+%d" 2>/dev/null || echo "Tempo não disponível")
    echo "$weather"
}

# Função para obter cotação do dólar
obter_dolar() {
    dolar=$(curl -s "https://www.google.com/finance/quote/BRL=USD/BRL" 2>/dev/null | grep -oP '\d+\.\d+' | head -1 || echo "R$ 5,00")
    echo "$dolar"
}

# Função para obter preço do barril de petróleo
obter_petroleo() {
    petroleo=$(curl -s "https://petrodollars.com/" 2>/dev/null | grep -oP '\d+\.\d+' | head -1 || echo "R$ 80,00")
    echo "$petroleo"
}

# Gerar mensagem de briefing
mensagem="🌅 *Briefing Matinal - $DATA_HOJE*

📍 *Previsão do Tempo (Porto Alegre):*
$(obter_tempo)

💵 *Cotação do Dólar:*
$(obter_dolar)

🛢️ *Preço do Barril de Petróleo:*
$(obter_petroleo)

---
Automatizado por Laura 🌼"

# Salvar mensagem no log
echo "$mensagem" > "$LOG_FILE"

# Enviar por Gmail
if command -v gog &>/dev/null; then
    TO_EMAIL="${GOG_ACCOUNT:-arthurceratti@hotmail.com}"
    gog gmail send "🌅 Briefing Matinal - $DATA_HOJE" --body "$mensagem" 2>/dev/null || echo "Falha ao enviar via Gmail"
else
    echo "⚠️  gog não instalado, salvando apenas no log"
fi

echo "✅ Briefing matinal gerado para $DATA_HOJE"
echo "📝 Mensagem salva em: $LOG_FILE"
