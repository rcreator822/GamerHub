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
            const base = new URL(targetUrl);

            // Rewrite <a href="..."> to stay in the proxy
            body = body.replace(/href="(.*?)"/g, (match, href) => {
                const absolute = new URL(href, base).href;
                return `href="/.netlify/functions/proxy?url=${encodeURIComponent(absolute)}"`;
            });

            // Rewrite <script src="...">, <img src="..."> etc.
            body = body.replace(/src="(.*?)"/g, (match, src) => {
                const absolute = new URL(src, base).href;
                return `src="${absolute}"`;
            });

            // Add <base> tag and interception script
            body = body.replace(/<head[^>]*>/i, match => {
                return `${match}
<base href="${base.href}">
<script>
    const proxy = url => '/.netlify/functions/proxy?url=' + encodeURIComponent(url);
    const _open = window.open;
    window.open = (...args) => _open(proxy(args[0]), ...args.slice(1));
    ['replace','assign'].forEach(fn => {
        const orig = window.location[fn];
        window.location[fn] = function(url) { window.location.href = proxy(url); };
    });
    Object.defineProperty(window.location, 'href', {
        set(val) { window.location.href = proxy(val); }
    });
</script>`;
            });
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
