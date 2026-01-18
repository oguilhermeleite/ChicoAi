# ChicoAI Chatbot

Assistente virtual inteligente para a plataforma de apostas esportivas ChicoIA.

## Estrutura do Projeto

```
ChicoAi/
├── public/
│   └── chico-icon.svg
├── src/
│   ├── components/
│   │   ├── ChatWidget/
│   │   │   ├── ChatWidget.jsx
│   │   │   └── ChatWidget.css
│   │   ├── MessageBubble/
│   │   │   ├── MessageBubble.jsx
│   │   │   └── MessageBubble.css
│   │   ├── TypingIndicator/
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── TypingIndicator.css
│   │   └── ChicoLogo/
│   │       └── ChicoLogo.jsx
│   ├── config/
│   │   └── firebase.js
│   ├── services/
│   │   └── claude.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Anthropic API Key
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative o Firestore Database
4. Configure as regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /conversations/{userId}/messages/{messageId} {
      allow read, write: if true; // Para desenvolvimento
      // Para produção, implemente autenticação
    }
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

### 4. Obter API Key da Anthropic

1. Acesse [Anthropic Console](https://console.anthropic.com/)
2. Crie uma API Key
3. Adicione ao seu `.env`

### 5. Rodar o projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## Funcionalidades

- **Floating Widget**: Ícone animado no canto inferior direito
- **Chat Modal**: Interface de chat responsiva e elegante
- **Histórico Persistente**: Conversas salvas no Firebase
- **Integração Claude**: Respostas inteligentes em português brasileiro
- **Mobile-First**: Design otimizado para dispositivos móveis
- **Animações**: Transições suaves com Framer Motion

## Paleta de Cores

| Variável | Cor | Uso |
|----------|-----|-----|
| `--primary-green` | #C7FF00 | Cor principal (lime green) |
| `--primary-dark` | #0A0F0D | Background |
| `--secondary-dark` | #1A1F1D | Cards/modais |
| `--success-green` | #00FF87 | Status online |
| `--danger-red` | #FF3B3B | Erros |
| `--text-primary` | #FFFFFF | Texto principal |

## Integração

Para integrar o ChatWidget em uma página existente:

```jsx
import ChatWidget from './components/ChatWidget/ChatWidget';
import './styles/globals.css';

function MinhaApp() {
  return (
    <div>
      {/* Seu conteúdo */}
      <ChatWidget />
    </div>
  );
}
```

## Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## Tecnologias

- React 18
- Vite 5
- Firebase 10 (Firestore)
- Anthropic SDK (Claude claude-sonnet-4-20250514)
- Framer Motion
- Lucide React Icons
