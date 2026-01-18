// Demo responses for the chatbot
const DEMO_RESPONSES = [
  "E aí! 👋 Sou o Chico, seu parceiro aqui na ChicoIA! Como posso te ajudar hoje com suas apostas esportivas?",
  "Fala! Quer saber sobre nossos palpites de futebol? Temos análises diárias dos principais campeonatos! ⚽",
  "Show! Posso te explicar como funciona nosso plano Premium. Ele inclui palpites exclusivos e alertas em tempo real! 🎯",
  "Boa pergunta! Na ChicoIA a gente analisa dados estatísticos pra te dar os melhores palpites. Gestão de banca é fundamental! 💰",
  "Tranquilo! Lembra que apostas são entretenimento. Nunca aposte mais do que pode perder. Posso te ajudar com estratégias de gestão de banca! 📊",
  "Nosso time analisa jogos de futebol, basquete, tênis e muito mais. Qual esporte você curte? 🏀",
  "O plano Premium te dá acesso a análises avançadas e palpites VIP. Quer saber mais detalhes? ✨",
  "Beleza! Qualquer dúvida sobre a plataforma, é só chamar. Tô aqui pra te ajudar a fazer apostas mais inteligentes! 🚀"
];

class ClaudeService {
  async sendMessage(messages) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    // Return demo response
    const randomIndex = Math.floor(Math.random() * DEMO_RESPONSES.length);
    return {
      success: true,
      content: DEMO_RESPONSES[randomIndex]
    };
  }
}

export const claudeService = new ClaudeService();
