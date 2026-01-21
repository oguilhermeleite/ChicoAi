import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

let db = null;
let firebaseInitialized = false;

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== 'your_firebase_api_key' && apiKey.length > 10;
};

// Initialize Firebase
const initFirebase = () => {
  if (firebaseInitialized) return db;

  if (isFirebaseConfigured()) {
    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      };

      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      firebaseInitialized = true;
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.warn('Firebase initialization failed:', error);
    }
  } else {
    console.log('Firebase not configured, using localStorage');
  }

  return db;
};

// Initialize on load
initFirebase();

// Generate or get user ID from localStorage
export const getUserId = () => {
  let userId = localStorage.getItem('chicoai_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('chicoai_user_id', userId);
  }
  return userId;
};

// Save message to Firestore or localStorage
export const saveMessage = async (userId, message) => {
  // Always save to localStorage as backup
  const localKey = `chicoai_messages_${userId}`;
  const localMessages = JSON.parse(localStorage.getItem(localKey) || '[]');
  localMessages.push({
    ...message,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(localKey, JSON.stringify(localMessages));

  // Try to save to Firestore if available
  if (db) {
    try {
      const messagesRef = collection(db, 'conversations', userId, 'messages');
      await addDoc(messagesRef, {
        ...message,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.warn('Error saving to Firestore:', error);
    }
  }
};

// Load conversation history
export const loadConversationHistory = async (userId) => {
  // Try Firestore first
  if (db) {
    try {
      const messagesRef = collection(db, 'conversations', userId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data()
          });
        });
        return messages;
      }
    } catch (error) {
      console.warn('Error loading from Firestore:', error);
    }
  }

  // Fallback to localStorage
  const localKey = `chicoai_messages_${userId}`;
  const localMessages = JSON.parse(localStorage.getItem(localKey) || '[]');
  return localMessages;
};

export { db };
