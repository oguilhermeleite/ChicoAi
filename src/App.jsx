import ChatWidget from './components/ChatWidget/ChatWidget';
import ChicoLogo from './components/ChicoLogo/ChicoLogo';
import './styles/globals.css';

function App() {
  return (
    <div className="app">
      {/* Demo Page - Replace with your actual page content */}
      <main className="demo-page">
        <div className="demo-content">
          <div className="demo-logo">
            <ChicoLogo size={48} />
          </div>
          <h1 className="demo-title">ChicoIA</h1>
          <p className="demo-subtitle">
            Sua plataforma inteligente de apostas esportivas.
            Palpites baseados em dados, estratégias vencedoras e
            um assistente virtual sempre pronto para ajudar.
          </p>
          <div className="demo-hint">
            <span>Clique no ícone</span>
            <span className="demo-hint-icon">👉</span>
          </div>
        </div>
      </main>

      {/* Chat Widget - Always visible */}
      <ChatWidget />
    </div>
  );
}

export default App;
