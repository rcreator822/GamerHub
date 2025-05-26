self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("pwa-cache").then((cache) => {
      return cache.addAll(["/", "/index.html", "/.gitignore", "/403.html", "/404.html", "/LICENSE", "/README.md", "/TabIcon.png", "/apps.html", "/appsredirect.html", "/errors.htaccess", "/games.html", "/gamesredireect.html", "/helios.html", "/indexredirect.html", "/manifest.json", "/proxy.php", "/apps/", "/apps/calc.html", "/apps/paintappv2.html", "/apps/texteditv2.html", "/apps/tryit.html"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
