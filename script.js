import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoogJZaXaKCDZWDRTPqFIUtvmbaWNDi6M",
  authDomain: "yintypingtest.firebaseapp.com",
  projectId: "yintypingtest",
  storageBucket: "yintypingtest.firebasestorage.app",
  messagingSenderId: "568565055078",
  appId: "1:568565055078:web:5f9ae7faa235c5733077a7",
  measurementId: "G-3WZ6HXK0BJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const reviewsCol = collection(db, "reviews");

const quote = document.getElementById("text-to-type").innerText.trim();
const inputField = document.getElementById("user-input");
const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');

let startTime = null;

inputField.addEventListener("input", () => {
  if (!startTime) startTime = Date.now();
  const userInput = inputField.value;
  let correctChars = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === quote[i]) correctChars++;
  }
  const accuracy = userInput.length > 0 ? (correctChars / userInput.length) * 100 : 0;
  document.getElementById("accuracy").innerText = `Accuracy: ${accuracy.toFixed(2)}%`;
  const timeElapsed = (Date.now() - startTime) / 60000;
  if (timeElapsed > 0) {
    const wpm = (userInput.length / 5) / timeElapsed;
    document.getElementById("wpm").innerText = `Words Per Minute: ${Math.round(wpm)}`;
  }
});

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reviewer-name').value;
  const text = document.getElementById('review-text').value;
  try {
    await addDoc(reviewsCol, { name, text, timestamp: serverTimestamp() });
    reviewForm.reset();
  } catch (error) { console.error("Error: ", error); }
});

onSnapshot(query(reviewsCol, orderBy("timestamp", "desc")), (snapshot) => {
  reviewsList.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `<strong>${data.name}:</strong> "${data.text}"`;
    reviewsList.appendChild(li);
  });
});