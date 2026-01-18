let db = null;
let firebaseInitialized = false;

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== 'your_firebase_api_key' && apiKey !== undefined;
};

// Initialize Firebase lazily
const initFirebase = async () => {
  if (firebaseInitialized || !isFirebaseConfigured()) return;

  try {
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');

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
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
};

// Generate or get user ID from localStorage
export const getUserId = () => {
  let userId = localStorage.getItem('chicoai_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('chicoai_user_id', userId);
  }
  return userId;
};

// Save message to Firestore (or localStorage fallback)
export const saveMessage = async (userId, message) => {
  await initFirebase();

  if (!db) {
    // Fallback to localStorage
    const key = `chicoai_messages_${userId}`;
    const messages = JSON.parse(localStorage.getItem(key) || '[]');
    messages.push({ ...message, timestamp: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(messages));
    return;
  }

  try {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const messagesRef = collection(db, 'conversations', userId, 'messages');
    await addDoc(messagesRef, {
      ...message,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

// Load conversation history from Firestore (or localStorage fallback)
export const loadConversationHistory = async (userId) => {
  await initFirebase();

  if (!db) {
    // Fallback to localStorage
    const key = `chicoai_messages_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  try {
    const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
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
  await initFirebase();
  if (!db) return;

  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
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
