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

            // Rewrite anchor links
            body = body.replace(/href="(.*?)"/g, (match, href) => {
                try {
                    const absolute = new URL(href, base).href;
                    return `href="/.netlify/functions/proxy?url=${encodeURIComponent(absolute)}"`;
                } catch {
                    return match;
                }
            });

            // Rewrite scripts, images, etc.
            body = body.replace(/src="(.*?)"/g, (match, src) => {
                try {
                    const absolute = new URL(src, base).href;
                    return `src="${absolute}"`;
                } catch {
                    return match;
                }
            });

            // Inject <base> tag and script to intercept client-side navigations
            body = body.replace(/<head[^>]*>/i, match => {
                return `${match}
<base href="${base.href}">
<script>
    const proxy = url => '/.netlify/functions/proxy?url=' + encodeURIComponent(url);

    // Intercept location changes
    Object.defineProperty(window.location, 'href', {
        set(val) { window.location.assign(val); },
        get() { return location.href; }
    });

    ['assign', 'replace'].forEach(method => {
        const original = window.location[method];
        window.location[method] = function(url) {
            original.call(window.location, proxy(url));
        };
    });

    // Override window.open to preserve proxying
    const originalOpen = window.open;
    window.open = function(url, name, specs) {
        return originalOpen(proxy(url), name, specs);
    };
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
