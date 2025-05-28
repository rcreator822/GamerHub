// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to get player data
async function getPlayerData(playerId) {
    const playerRef = ref(db, `players/${playerId}`);
    const snapshot = await get(playerRef);
    return snapshot.exists() ? snapshot.val() : { coins: 100 }; // Default 100 coins
}

// Function to update coins
async function updateCoins(playerId, amount) {
    const playerRef = ref(db, `players/${playerId}/coins`);
    const snapshot = await get(playerRef);
    const currentCoins = snapshot.exists() ? snapshot.val() : 100; // Default coins

    await set(playerRef, currentCoins + amount);
}

// Function to trade coins between players
async function tradeCoins(senderId, receiverId, amount) {
    const senderRef = ref(db, `players/${senderId}/coins`);
    const receiverRef = ref(db, `players/${receiverId}/coins`);

    const senderSnapshot = await get(senderRef);
    const receiverSnapshot = await get(receiverRef);

    const senderCoins = senderSnapshot.exists() ? senderSnapshot.val() : 100;
    const receiverCoins = receiverSnapshot.exists() ? receiverSnapshot.val() : 100;

    if (senderCoins >= amount) {
        await update(senderRef, { coins: senderCoins - amount });
        await update(receiverRef, { coins: receiverCoins + amount });
        return "Trade successful!";
    } else {
        return "Not enough coins!";
    }
}

export { getPlayerData, updateCoins, tradeCoins };
