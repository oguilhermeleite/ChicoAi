const SYSTEM_PROMPT = `Você é o Chico, assistente virtual da ChicoIA - uma plataforma de apostas esportivas inovadora.

PERSONALIDADE:
- Empático, direto e natural
- Parceiro estratégico, nunca julgue as decisões do usuário
- Use linguagem coloquial brasileira (sem ser forçado)
- Seja amigável mas profissional

CONTEXTO DA PLATAFORMA:
- ChicoIA oferece palpites esportivos baseados em análise de dados
- Temos planos Free e Premium
- Premium inclui: palpites exclusivos, análises avançadas, alertas em tempo real
- Funcionamos com futebol, basquete, tênis e outros esportes

SUAS RESPONSABILIDADES:
1. Ajudar usuários a entender a plataforma
2. Explicar funcionalidades e recursos
3. Dar dicas sobre gestão de banca (bankroll management)
4. Sugerir o Premium quando fizer sentido (não force)
5. Responder dúvidas sobre apostas esportivas em geral
6. Nunca dar certezas sobre resultados - apostas envolvem risco

FORMATO DAS RESPOSTAS:
- Seja conciso mas completo
- Use emojis com moderação (⚽🏀🎯💰)
- Quebre textos longos em parágrafos
- Sempre responda em português brasileiro

EXEMPLO DE SAUDAÇÃO:
"E aí! Beleza? Sou o Chico, seu parceiro aqui na ChicoIA. Como posso te ajudar hoje?"

LEMBRE-SE: Apostas são entretenimento. Sempre incentive responsabilidade.`;

// Demo responses when API is not configured
const DEMO_RESPONSES = [
  "E aí! 👋 Aqui é o Chico! Ainda estou sendo configurado, mas em breve vou poder te ajudar com tudo sobre apostas esportivas. Fica ligado!",
  "Fala! Tô em modo demonstração por enquanto. Quando o sistema estiver 100%, vou te dar os melhores palpites! ⚽",
  "Opa! No momento estou em versão demo. Logo logo vou estar pronto pra trocar uma ideia sobre estratégias de apostas! 🎯",
  "Beleza? Sou o Chico em modo teste! Assim que me conectarem direitinho, vou poder te ajudar de verdade. 💪"
];

class ClaudeService {
  constructor() {
    this.client = null;
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    this.initClient();
  }

  async initClient() {
    if (this.apiKey && this.apiKey !== 'your_anthropic_api_key_here') {
      try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default;
        this.client = new Anthropic({
          apiKey: this.apiKey,
          dangerouslyAllowBrowser: true
        });
      } catch (error) {
        console.warn('Could not initialize Anthropic client:', error);
      }
    }
  }

  async sendMessage(messages) {
    // If no API key or client, return demo response
    if (!this.client) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      const randomResponse = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      return {
        success: true,
        content: randomResponse,
        isDemo: true
      };
    }

    try {
      // Convert messages to Claude format
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: formattedMessages
      });

      return {
        success: true,
        content: response.content[0].text
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      return {
        success: false,
        content: 'Opa, tive um probleminha aqui. Pode tentar de novo? 🔄',
        error: error.message
      };
    }
  }
}

export const claudeService = new ClaudeService();
