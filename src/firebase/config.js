import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBxC8NLNZQkuXKMV03T9bWNsaB9aVcvYtU',
  authDomain: 'platz-rooms.firebaseapp.com',
  databaseURL: 'https://platz-rooms-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'platz-rooms',
  storageBucket: 'platz-rooms.appspot.com',
  messagingSenderId: '840304822913',
  appId: '1:840304822913:web:ed028b53876ae0a4c09b80',
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
