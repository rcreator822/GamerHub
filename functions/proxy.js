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

        if (contentType.includes("text/html")) {
            // Make all relative and absolute links go through the proxy
            const base = new URL(targetUrl);

            body = body.replace(/href="(.*?)"/g, (match, href) => {
                const absolute = new URL(href, base).href;
                return `href="/.netlify/functions/proxy?url=${encodeURIComponent(absolute)}"`;
            });

            body = body.replace(/src="(.*?)"/g, (match, src) => {
                const absolute = new URL(src, base).href;
                return `src="${absolute}"`;
            });

            // Optional: inject a <base> tag to help with relative resource loading
            if (!body.includes("<base")) {
                body = body.replace(/<head[^>]*>/i, match => {
                    return `${match}\n<base href="${base.href}">`;
                });
            }
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
