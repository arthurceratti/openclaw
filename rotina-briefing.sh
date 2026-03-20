#!/bin/bash
# Roteiro de briefing matinal
set -euo pipefail

# Configuração
HORA="07:30"
DATA_HOJE=$(date +%Y-%m-%d)
LOG_FILE="/data/.openclaw/workspace/rotina-briefing.log"

# Função para obter previsão do tempo de Porto Alegre
obter_tempo() {
    # Usando wttr.in que funciona sem API key
    weather=$(curl -s "https://wttr.in/Porto+Alegre?format=%t+%C+%f+%d" 2>/dev/null || echo "Tempo não disponível")
    echo "$weather"
}

# Função para obter cotação do dólar
obter_dolar() {
    # Usando site de cotação (exemplo: google.com/finance)
    dolar=$(curl -s "https://www.google.com/finance/quote/BRL=USD/BRL" 2>/dev/null | grep -oP '\d+\.\d+' | head -1 || echo "R\$ 5,00")
    echo "$dolar"
}

# Função para obter preço do barril de petróleo
obter_petroleo() {
    # Usando site de petróleo (exemplo: petrodollars.com)
    petroleo=$(curl -s "https://petrodollars.com/" 2>/dev/null | grep -oP '\d+\.\d+' | head -1 || echo "R\$ 80,00")
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

# Aviso ao usuário
echo "📧 Briefing matinal gerado para $DATA_HOJE"
echo "📝 Mensagem salva em: $LOG_FILE"
echo ""
echo "Para configurar envio automático pelo WhatsApp, é necessário:"
echo "1. Obter número de telefone com API do WhatsApp"
echo "2. Configurar webhook ou integração direta"
