// Smart responses based on user input keywords
const RESPONSE_MAP = {
  // Greetings
  greetings: [
    "E aí! 👋 Beleza? Sou o Chico, seu parceiro aqui na ChicoIA! Posso te ajudar com palpites, estratégias ou tirar qualquer dúvida sobre a plataforma. Manda aí!",
    "Fala! 👋 Tudo certo? Aqui é o Chico da ChicoIA! Tô pronto pra te ajudar com apostas esportivas. O que você precisa?",
    "Opa! 👋 Seja bem-vindo! Sou o Chico e estou aqui pra ser seu parceiro nas apostas. Como posso te ajudar hoje?"
  ],

  // Football
  futebol: [
    "Futebol é minha especialidade! ⚽ Aqui na ChicoIA a gente analisa os principais campeonatos: Brasileirão, Premier League, La Liga, Champions... Quer saber os palpites de hoje?",
    "Bora falar de futebol! ⚽ Temos análises completas de todos os grandes campeonatos. No Premium você recebe alertas em tempo real quando sai um palpite quente!",
    "Futebol? Esse é o carro-chefe! ⚽ Nosso time analisa estatísticas, confrontos diretos, lesões... Tudo pra te dar os melhores palpites. Quer começar por qual campeonato?"
  ],

  // Premium
  premium: [
    "O plano Premium é outro nível! ✨ Você ganha acesso a: palpites exclusivos VIP, análises detalhadas, alertas em tempo real no celular e suporte prioritário. Vale muito a pena!",
    "Quer saber do Premium? 🎯 É onde a mágica acontece! Palpites VIP, odd mínima garantida, e análises que só os assinantes recebem. O retorno é muito melhor!",
    "Premium é pra quem leva a sério! 💎 Além dos palpites exclusivos, você tem acesso a estatísticas avançadas e pode filtrar por odd, campeonato, tipo de aposta..."
  ],

  // Help/How it works
  ajuda: [
    "Claro, deixa eu te explicar! 📚 A ChicoIA analisa dados estatísticos de milhares de jogos pra gerar palpites inteligentes. Você pode ver os palpites gratuitos ou assinar o Premium pra conteúdo exclusivo.",
    "Posso te ajudar sim! 🤝 Aqui na plataforma você encontra palpites diários, análises de jogos e dicas de gestão de banca. Quer saber mais sobre algum recurso específico?",
    "Tô aqui pra isso! 💡 Me pergunta qualquer coisa sobre a plataforma, sobre apostas, ou sobre como usar os palpites. Pode mandar!"
  ],

  // Bankroll/Management
  banca: [
    "Gestão de banca é FUNDAMENTAL! 💰 Minha dica: nunca aposte mais de 2-5% da sua banca por entrada. Assim você se protege das variâncias e fica no jogo por mais tempo.",
    "Boa pergunta sobre gestão! 📊 O segredo é consistência: define um valor fixo por aposta, não tenta recuperar perdas, e sempre respeita seu limite. Quer mais dicas?",
    "Gestão de banca é o que separa apostador casual de profissional! 🎯 Regra de ouro: sua stake deve ser proporcional à sua confiança no palpite. Stakes altas só em green garantido!"
  ],

  // Thanks
  obrigado: [
    "Imagina! 😊 Tô aqui pra isso. Qualquer dúvida é só chamar. Boa sorte nas apostas!",
    "Por nada! 🙌 Sempre que precisar, é só mandar mensagem. Bora lucrar juntos!",
    "Disponha! ✌️ Sucesso nas apostas e lembra: aposte com responsabilidade!"
  ],

  // Yes/Affirmative
  sim: [
    "Show! 🔥 Então bora lá! Me conta mais sobre o que você quer saber ou qual esporte te interessa mais.",
    "Isso aí! 💪 Fico feliz que tá curtindo. O que mais posso fazer por você?",
    "Fechou! ✅ Pode contar comigo. Manda sua próxima dúvida!"
  ],

  // Default responses
  default: [
    "Entendi! 🤔 Posso te ajudar com palpites de futebol, basquete, tênis e outros esportes. Também tiro dúvidas sobre a plataforma e dou dicas de gestão de banca. O que te interessa?",
    "Beleza! 👍 Aqui na ChicoIA você encontra os melhores palpites esportivos. Quer saber sobre algum jogo específico ou conhecer nosso plano Premium?",
    "Show! 🎯 Tô aqui pra te ajudar a fazer apostas mais inteligentes. Pode perguntar sobre palpites, odds, estratégias... Manda ver!",
    "Tranquilo! 😎 Me conta mais sobre o que você precisa. Posso ajudar com palpites do dia, explicar como funciona a plataforma ou dar dicas de apostas.",
    "Entendido! ✨ Sou especialista em apostas esportivas. Quer dicas de hoje ou quer saber mais sobre como usar a ChicoIA?"
  ]
};

// Keywords for matching
const KEYWORDS = {
  greetings: ['oi', 'olá', 'ola', 'hey', 'eai', 'e ai', 'fala', 'salve', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'],
  futebol: ['futebol', 'football', 'jogo', 'jogos', 'time', 'times', 'campeonato', 'brasileirao', 'brasileirão', 'premier', 'champions', 'libertadores', 'copa'],
  premium: ['premium', 'vip', 'assinar', 'assinatura', 'plano', 'pago', 'mensalidade', 'upgrade'],
  ajuda: ['ajuda', 'ajudar', 'help', 'como funciona', 'o que é', 'explica', 'explicar', 'duvida', 'dúvida', 'entender'],
  banca: ['banca', 'bankroll', 'gestao', 'gestão', 'dinheiro', 'stake', 'quanto apostar', 'gerenciamento'],
  obrigado: ['obrigado', 'obrigada', 'valeu', 'vlw', 'thanks', 'brigado', 'agradeco', 'agradeço'],
  sim: ['sim', 'yes', 'claro', 'pode', 'quero', 'bora', 'vamos', 'isso', 'ok', 'blz', 'beleza']
};

class ClaudeService {
  constructor() {
    this.lastResponseIndex = {};
  }

  getRandomResponse(category) {
    const responses = RESPONSE_MAP[category];
    if (!responses || responses.length === 0) {
      return RESPONSE_MAP.default[0];
    }

    // Avoid repeating the last response
    let index;
    do {
      index = Math.floor(Math.random() * responses.length);
    } while (responses.length > 1 && index === this.lastResponseIndex[category]);

    this.lastResponseIndex[category] = index;
    return responses[index];
  }

  detectCategory(message) {
    const lowerMessage = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    for (const [category, keywords] of Object.entries(KEYWORDS)) {
      for (const keyword of keywords) {
        const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (lowerMessage.includes(normalizedKeyword)) {
          return category;
        }
      }
    }

    return 'default';
  }

  async sendMessage(userMessage) {
    // Simulate API delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    // Detect category and get appropriate response
    const category = this.detectCategory(userMessage);
    const response = this.getRandomResponse(category);

    return {
      success: true,
      content: response
    };
  }
}

export const claudeService = new ClaudeService();
