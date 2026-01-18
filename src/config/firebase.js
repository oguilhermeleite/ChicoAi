// Generate or get user ID from localStorage
export const getUserId = () => {
  let userId = localStorage.getItem('chicoai_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('chicoai_user_id', userId);
  }
  return userId;
};

// Save message to localStorage
export const saveMessage = async (userId, message) => {
  const key = `chicoai_messages_${userId}`;
  const messages = JSON.parse(localStorage.getItem(key) || '[]');
  messages.push({ ...message, timestamp: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(messages));
};

// Load conversation history from localStorage
export const loadConversationHistory = async (userId) => {
  const key = `chicoai_messages_${userId}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
};
