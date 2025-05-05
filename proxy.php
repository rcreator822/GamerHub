<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Proxy Browser</title>
    <style>   
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        body {
            background: black;
            color: lawngreen;
            font-family: Courier Prime;
        }
    </style>
</head>
<body>
    <form method="POST" action="">
        <input type="text" name="url" placeholder="Enter URL" required>
        <button type="submit">Go</button>
    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['url'])) {
        $url = filter_var($_POST['url'], FILTER_SANITIZE_URL);

        // Validate URL
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            // Initialize cURL
            $ch = curl_init();

            // Set cURL options
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Enable SSL certificate verification
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);    // Verify host

            // Execute the cURL request
            $content = curl_exec($ch);

            // Check for cURL errors
            if ($content === false) {
                echo "cURL Error: " . curl_error($ch);
            } else {
                // Display fetched content
                echo $content;
            }

            // Close cURL session
            curl_close($ch);
        } else {
            echo "Invalid URL.";
        }
    }
    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = ''; // Required for most browsers to show a confirmation dialog
    });
    ?>
</body>
</html>
