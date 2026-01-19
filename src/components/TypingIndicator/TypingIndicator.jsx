import ChicoLogo from '../ChicoLogo/ChicoLogo';
import './TypingIndicator.css';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-avatar">
        <ChicoLogo size={16} />
      </div>
      <div className="typing-bubble">
        <div className="typing-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
