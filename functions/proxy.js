exports.handler = async (event) => {
    const targetUrl = event.queryStringParameters.url;

    if (!targetUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing URL parameter" }),
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

        // Handle server-side redirects (3xx)
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get("location");
            const absolute = new URL(location, targetUrl).href;
            return {
                statusCode: 302,
                headers: {
                    Location: `/.netlify/functions/proxy?url=${encodeURIComponent(absolute)}`
                }
            };
        }

        const contentType = response.headers.get("content-type") || "";

        // If the content is HTML, rewrite the links to stay within the proxy
        let body = await response.text();
        if (contentType.includes("text/html")) {
            body = body.replace(/href="(.*?)"/g, (match, href) => {
                const absolute = new URL(href, targetUrl).href;
                return `href="/.netlify/functions/proxy?url=${encodeURIComponent(absolute)}"`;
            });
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": contentType
            },
            body,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch data", details: error.message }),
        };
    }
};
console.log("hi");
