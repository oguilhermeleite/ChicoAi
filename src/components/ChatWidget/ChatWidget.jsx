import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle } from 'lucide-react';
import { claudeService } from '../../services/claude';
import { getUserId, saveMessage, loadConversationHistory } from '../../config/firebase';
import MessageBubble from '../MessageBubble/MessageBubble';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import ChicoLogo from '../ChicoLogo/ChicoLogo';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize user and load history
  useEffect(() => {
    const id = getUserId();
    setUserId(id);

    const loadHistory = async () => {
      const history = await loadConversationHistory(id);
      if (history.length > 0) {
        setMessages(history);
      } else {
        // Add welcome message for new users
        const welcomeMessage = {
          role: 'assistant',
          content: 'E aí! Beleza? 👋 Sou o Chico, seu parceiro aqui na ChicoIA. Tô aqui pra te ajudar com palpites, tirar dúvidas sobre a plataforma ou trocar uma ideia sobre estratégias de apostas. Como posso te ajudar hoje?'
        };
        setMessages([welcomeMessage]);
        saveMessage(id, welcomeMessage);
      }
    };

    loadHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Save user message
    saveMessage(userId, userMessage);

    // Prepare messages for Claude (last 10 for context)
    const contextMessages = [...messages.slice(-9), userMessage];

    // Get response from Claude
    const response = await claudeService.sendMessage(contextMessages);

    const assistantMessage = {
      role: 'assistant',
      content: response.content
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);

    // Save assistant message
    saveMessage(userId, assistantMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-widget-container">
      {/* Floating Button */}
      <motion.button
        className="chat-toggle-button"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="logo-container"
            >
              <ChicoLogo size={32} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation when closed */}
        {!isOpen && (
          <motion.div
            className="pulse-ring"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="header-info">
                <div className="avatar">
                  <ChicoLogo size={24} />
                </div>
                <div className="header-text">
                  <h3>Chico</h3>
                  <span className="status">
                    <span className="status-dot"></span>
                    Online
                  </span>
                </div>
              </div>
              <button className="close-button" onClick={toggleChat}>
                <X size={20} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="chat-messages">
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message}
                  isUser={message.role === 'user'}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-container">
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <motion.button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
              </motion.button>
            </div>

            {/* Footer */}
            <div className="chat-footer">
              <span>Powered by <strong>ChicoIA</strong></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
