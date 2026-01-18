import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, getDocs, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generate or get user ID from localStorage
export const getUserId = () => {
  let userId = localStorage.getItem('chicoai_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('chicoai_user_id', userId);
  }
  return userId;
};

// Save message to Firestore
export const saveMessage = async (userId, message) => {
  try {
    const messagesRef = collection(db, 'conversations', userId, 'messages');
    await addDoc(messagesRef, {
      ...message,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

// Load conversation history from Firestore
export const loadConversationHistory = async (userId) => {
  try {
    const messagesRef = collection(db, 'conversations', userId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);

    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return messages;
  } catch (error) {
    console.error('Error loading conversation history:', error);
    return [];
  }
};

// Save user metadata
export const saveUserMetadata = async (userId, metadata) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...metadata,
      lastActive: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user metadata:', error);
  }
};

export { db };
