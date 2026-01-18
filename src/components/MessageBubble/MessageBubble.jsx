import { motion } from 'framer-motion';
import ChicoLogo from '../ChicoLogo/ChicoLogo';
import './MessageBubble.css';

const MessageBubble = ({ message, isUser }) => {
  return (
    <motion.div
      className={`message-bubble ${isUser ? 'user' : 'assistant'}`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {!isUser && (
        <div className="message-avatar">
          <ChicoLogo size={16} />
        </div>
      )}
      <div className="message-content">
        <p>{message.content}</p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
