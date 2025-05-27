document.addEventListener("DOMContentLoaded", () => {
    loadPlayerData();
});

function loadPlayerData() {
    // Placeholder: Fetch coin balance from database (Replace this with Firebase or Supabase logic)
    let coins = localStorage.getItem("coins") || 100; // Default to 100 coins if not set
    document.getElementById("coin-count").textContent = coins;
}

function playGame() {
    alert("Game logic goes here! Earn coins by playing.");
    // Example: Adding coins for playing (Replace with actual game mechanics)
    let coins = parseInt(localStorage.getItem("coins")) || 100;
    coins += 10; // Player earns 10 coins per play
    localStorage.setItem("coins", coins);
    document.getElementById("coin-count").textContent = coins;
}

function openShop() {
    window.location.href = "shop/shop.html"; // Redirect to the shop page
}

function tradeItems() {
    window.location.href = "trades/trade.html"; // Redirect to the trade page
}
