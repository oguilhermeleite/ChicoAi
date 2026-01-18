import { motion } from 'framer-motion';
import ChicoLogo from '../ChicoLogo/ChicoLogo';
import './TypingIndicator.css';

const TypingIndicator = () => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -5 }
  };

  return (
    <motion.div
      className="typing-indicator"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="typing-avatar">
        <ChicoLogo size={16} />
      </div>
      <div className="typing-bubble">
        <div className="typing-dots">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="dot"
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.15
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
