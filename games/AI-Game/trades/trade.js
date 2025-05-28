import { tradeCoins } from "games/AI-Game/firebase.js";

async function tradeCoins() {
    const senderId = "player1"; // Replace with dynamic player ID
    const receiverId = document.getElementById("receiver-id").value;
    const amount = parseInt(document.getElementById("coin-amount").value);

    if (!receiverId || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid player ID and coin amount.");
        return;
    }

    const result = await tradeCoins(senderId, receiverId, amount);
    alert(result);
    location.reload(); // Refresh page after trade
}

function goBack() {
    window.location.href = "games/AI-Game/index.html";
}
