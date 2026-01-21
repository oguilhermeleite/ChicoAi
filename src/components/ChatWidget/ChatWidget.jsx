import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { claudeService } from '../../services/claude';
import { getUserId, saveMessage, loadConversationHistory } from '../../config/firebase';
import MessageBubble from '../MessageBubble/MessageBubble';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import ChicoLogo from '../ChicoLogo/ChicoLogo';
import './ChatWidget.css';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: 'E aí! 👋 Sou o Chico, seu parceiro de apostas aqui na ChicoIA. Posso te ajudar a analisar jogos, encontrar value bets e montar estratégias. Em qual jogo você tá pensando em apostar hoje?'
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize user and load history
  useEffect(() => {
    const initChat = async () => {
      const id = getUserId();
      setUserId(id);

      try {
        const history = await loadConversationHistory(id);
        if (history && history.length > 0) {
          // Ensure all messages have IDs
          const messagesWithIds = history.map((msg, index) => ({
            ...msg,
            id: msg.id || `history_${index}_${Date.now()}`
          }));
          setMessages(messagesWithIds);
        }
      } catch (error) {
        console.error('Error loading history:', error);
      }

      setIsLoading(false);
    };

    initChat();
  }, []);

  // Smooth scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 300);
    }
  }, [isOpen, scrollToBottom]);

  // Handle viewport resize for mobile keyboard
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setTimeout(scrollToBottom, 100);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, [isOpen, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessageContent = inputValue.trim();
    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMessageContent
    };

    // Update state with user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    // Save user message to Firebase
    if (userId) {
      saveMessage(userId, userMessage);
    }

    try {
      // Get conversation history for context (excluding welcome message if it's the default)
      const historyForApi = updatedMessages.filter(msg => msg.id !== 'welcome');

      // Call Claude API with conversation history
      const response = await claudeService.sendMessage(userMessageContent, historyForApi);

      const assistantMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.content
      };

      // Update state with assistant response
      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to Firebase
      if (userId) {
        saveMessage(userId, assistantMessage);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Opa, tive um probleminha aqui. Pode tentar de novo? 🔄'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
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
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
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
              <button className="close-button" onClick={toggleChat} aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="chat-messages" ref={messagesContainerRef}>
              <div className="messages-wrapper">
                {isLoading ? (
                  <div className="loading-state">
                    <TypingIndicator />
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isUser={message.role === 'user'}
                      />
                    ))}
                    {isTyping && <TypingIndicator />}
                  </>
                )}
                <div ref={messagesEndRef} className="scroll-anchor" />
              </div>
            </div>

            {/* Input Area */}
            <div className="chat-input-wrapper">
              <div className="chat-input-container">
                <input
                  ref={inputRef}
                  type="text"
                  className="chat-input"
                  placeholder="Digite sua mensagem..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping || isLoading}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <motion.button
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Enviar mensagem"
                >
                  <Send size={20} />
                </motion.button>
              </div>

              {/* Footer */}
              <div className="chat-footer">
                <span>Powered by <strong>ChicoIA</strong></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
