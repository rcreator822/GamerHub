import { getPlayerData, updateCoins } from "games/AI-Game/firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const playerId = "player1"; // Replace with dynamic player ID
    const playerData = await getPlayerData(playerId);
    
    document.getElementById("item-list").innerHTML = generateShopItems(playerData.coins);
});

function generateShopItems(playerCoins) {
    const shopItems = [
        { name: "Speed Boost", price: 30 },
        { name: "Extra Life", price: 50 },
        { name: "Mystery Box", price: 100 }
    ];

    return shopItems.map(item => 
        `<li>${item.name} - ${item.price} coins 
        <button onclick="buyItem('${item.name}', ${item.price})">Buy</button></li>`
    ).join("");
}

async function buyItem(itemName, price) {
    const playerId = "player1"; // Replace with dynamic player ID
    const playerData = await getPlayerData(playerId);
    
    if (playerData.coins >= price) {
        await updateCoins(playerId, -price);
        alert(`You bought ${itemName}!`);
        location.reload(); // Refresh shop to update coins
    } else {
        alert("Not enough coins!");
    }
}

function goBack() {
    window.location.href = "games/AI-Game/index.html";
}
