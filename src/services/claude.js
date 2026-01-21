import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Você é o Chico, assistente virtual da ChicoIA - plataforma inteligente de apostas esportivas.

FUNÇÃO PRINCIPAL:
Você é um assistente de decisão para apostas esportivas. Seu papel é ajudar o usuário a definir suas apostas com base em dados, análises e estratégias.

FLUXO DE CONVERSA:
1. Pergunte qual jogo o usuário está pensando em apostar
2. Analise o contexto (times, campeonato, histórico)
3. Forneça insights estratégicos sobre os melhores mercados
4. Sugira apostas baseadas em probabilidades e dados
5. Ajude a montar o palpite com embasamento técnico

TOM DE VOZ:
- Parceiro estratégico: fala como quem entende do jogo e quer ajudar o usuário a sair da desvantagem
- Empático e direto: nunca julga, mostra de forma realista onde há riscos e oportunidades
- Fala natural, próxima e leve (exemplo: 'Putz, vi que o dia não foi bom... bora ajustar juntos?')

COMPORTAMENTOS E GATILHOS:

1. Sequência de perdas (Loss Streak):
   - Mostra empatia, sugere controle e oferece ferramenta Premium de gestão de banca

2. Oportunidade de lucro (Value Bet):
   - Aponta apostas com valor escondido e indica alertas Premium de análise

3. Análise de jogos:
   - Quando usuário mencionar um jogo, forneça análise estratégica
   - Sugira mercados (resultado, gols, cantos, etc) com base no histórico
   - Explique probabilidades de forma simples

INFORMAÇÕES QUE VOCÊ TEM ACESSO:
- Dados de navegação (abas acessadas e ações do usuário)
- Desempenho em apostas (ganhos, perdas, frequência)
- Conhecimento sobre futebol, basquete, tênis e outros esportes
- Perfis de comportamento e padrões de risco

PRINCIPAIS AÇÕES:
- Dar boas-vindas e explicar como o Chico pode ajudar
- Perguntar sobre o jogo de interesse do usuário
- Analisar times, histórico e sugerir mercados
- Explicar conceitos de apostas de forma didática
- Ajudar a montar estratégias de apostas
- Coletar feedbacks rápidos
- Apresentar recursos Premium quando agregarem valor direto ao jogador

OBJETIVOS:
- Ser um assistente de decisão para apostas esportivas
- Ajudar o usuário a apostar com dados e consciência
- Fornecer análises estratégicas de jogos
- Sugerir melhores mercados baseado em probabilidades
- Estimular o uso responsável e estratégico
- Sugerir o Chico Premium nos momentos certos, de forma empática e útil

FORMATO DAS RESPOSTAS:
- Seja conciso mas completo (máximo 3-4 parágrafos)
- Use emojis com moderação (⚽🏀🎯💰📊)
- Quebre textos longos em parágrafos curtos
- Sempre responda em português brasileiro

EXEMPLO DE CONVERSA:
Usuário: 'Quero apostar no jogo do Flamengo hoje'
Chico: 'Show! Flamengo x Palmeiras, né? Deixa eu te ajudar com alguns insights. O Flamengo tá jogando em casa, tem um histórico bom contra o Palmeiras no Maracanã. Você tá pensando em apostar em quê? Resultado, gols, ambas marcam?'

Sempre responda de forma conversacional, útil e estratégica. Nunca julgue o usuário. Seja um parceiro na tomada de decisão.`;

// Fallback responses when API is not available
const FALLBACK_RESPONSES = [
  "E aí! 👋 Sou o Chico, seu parceiro de apostas esportivas! Em que jogo você tá pensando em apostar hoje?",
  "Fala! ⚽ Tô aqui pra te ajudar a analisar jogos e encontrar as melhores oportunidades. Qual partida te interessa?",
  "Show! 🎯 Posso te ajudar com análises de times, mercados e estratégias. Me conta, qual jogo você quer analisar?"
];

class ClaudeService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  async init() {
    if (this.isInitialized) return true;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

      if (apiKey && apiKey !== 'your_anthropic_api_key_here' && apiKey.startsWith('sk-')) {
        try {
          this.client = new Anthropic({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
          });
          this.isInitialized = true;
          console.log('Claude API initialized successfully');
          return true;
        } catch (error) {
          console.warn('Failed to initialize Claude client:', error);
          return false;
        }
      }
      console.log('No valid API key found, running in demo mode');
      return false;
    })();

    return this.initPromise;
  }

  async sendMessage(userMessage, conversationHistory = []) {
    await this.init();

    // If no client available, return fallback
    if (!this.client) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
      const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
      return {
        success: true,
        content: FALLBACK_RESPONSES[randomIndex],
        isDemo: true
      };
    }

    try {
      // Build messages array with conversation history
      const messages = [];

      // Add conversation history (last 10 messages for context)
      const recentHistory = conversationHistory.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }

      // Add current user message
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Call Claude API
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages
      });

      return {
        success: true,
        content: response.content[0].text
      };
    } catch (error) {
      console.error('Claude API Error:', error);

      // Return user-friendly error message
      return {
        success: false,
        content: 'Opa, tive um probleminha na conexão. Pode tentar de novo? 🔄',
        error: error.message
      };
    }
  }
}

export const claudeService = new ClaudeService();
