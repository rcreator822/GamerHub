<?php
// Include database configuration
require 'config.php';

// Set up the DSN and options for PDO
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch(PDOException $e) {
    exit('Database connection failed: ' . $e->getMessage());
}

// If the request is for loading messages (AJAX GET request)
if (isset($_GET['action']) && $_GET['action'] === 'load') {
    $stmt = $pdo->query("SELECT username, content, timestamp FROM messages ORDER BY id ASC");
    $messages = $stmt->fetchAll();
    foreach ($messages as $msg) {
        echo "<p><strong>" . htmlspecialchars($msg['username'], ENT_QUOTES, 'UTF-8') .
             "</strong> [" . $msg['timestamp'] . "]: " .
             htmlspecialchars($msg['content'], ENT_QUOTES, 'UTF-8') . "</p>";
    }
    exit;
}

// If a new message is posted via a POST request
if (isset($_POST['username']) && isset($_POST['message'])) {
    $username = trim($_POST['username']);
    $message  = trim($_POST['message']);
    if (!empty($username) && !empty($message)) {
        $stmt = $pdo->prepare("INSERT INTO messages (username, content) VALUES (:username, :content)");
        $stmt->execute(['username' => $username, 'content' => $message]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Gamer Hub Chat</title>
    <style>
        /* Basic styling */
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: black;
            color: lawngreen;
        }
        #chat-window {
            width: 100%;
            height: 300px;
            border: 1px solid #ccc;
            padding: 10px;
            overflow-y: auto;
            background: #f9f9f9;
        }
        form {
            margin-top: 10px;
        }
        input[type="text"] {
            padding: 5px;
            font-size: 1em;
        }
        #username-input {
            width: 20%;
        }
        #message-input {
            width: 60%;
        }
        input[type="submit"] {
            padding: 5px 10px;
            font-size: 1em;
        }
    </style>
</head>
<body>
    <h1>Multi-User Messaging App</h1>
    <!-- Chat window where messages will appear -->
    <div id="chat-window"></div>
    <!-- Message form with separate inputs for username and message -->
    <form id="message-form">
        <input type="text" name="username" id="username-input" placeholder="Your Name" autocomplete="off" required />
        <input type="text" name="message" id="message-input" placeholder="Type your message here..." autocomplete="off" required />
        <input type="submit" value="Send" />
    </form>
    <script>
        // Function to asynchronously load messages from the server
        function loadMessages() {
            fetch('?action=load')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('chat-window').innerHTML = data;
                });
        }

        // Listen for the form submission event to send a new message
        document.getElementById('message-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username-input').value;
            const message  = document.getElementById('message-input').value;
            if (username.trim() !== "" && message.trim() !== "") {
                const formData = new URLSearchParams();
                formData.append('username', username);
                formData.append('message', message);
                fetch('', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: formData.toString()
                }).then(() => {
                    document.getElementById('message-input').value = '';
                    loadMessages();
                });
            }
        });

        // Poll the server every 3 seconds to get the latest messages
        setInterval(loadMessages, 3000);
        
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            event.returnValue = ''; // Required for most browsers to show a confirmation dialog
        });
    </script>
</body>
</html>
