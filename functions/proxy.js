exports.handler = async (event) => {
    const targetUrl = event.queryStringParameters.url;
    if (!targetUrl) {
        return {
            statusCode: 400,
            body: "Missing URL parameter"
        };
    }

    try {
        const response = await fetch(targetUrl, {
            redirect: "manual",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "*/*"
            }
        });

        let contentType = response.headers.get("content-type") || "";
        let body = await response.text();

        // Rewrite links to stay within the proxy
        if (contentType.includes("text/html")) {
            body = body.replace(/href="(.*?)"/g, (match, href) => {
                const absolute = new URL(href, targetUrl).href;
                return `href="/.netlify/functions/proxy?url=${encodeURIComponent(absolute)}"`;
            });

            // You can also inject JS to intercept client-side redirects here if needed
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": contentType
            },
            body
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: `Fetch error: ${err.message}`
        };
    }
};
