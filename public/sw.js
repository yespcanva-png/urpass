const SW_VERSION = "urpass-pwa-v1-2026-10-14";
const STATIC_CACHE = `${SW_VERSION}-static`;
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = [
  OFFLINE_URL,
  "/favicon.ico",
  "/icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-icon.png",
];

const PRIVATE_PATH_PREFIXES = [
  "/api/",
  "/auth/",
  "/login",
  "/signup",
  "/dashboard",
  "/event",
  "/scan",
  "/billing",
  "/onboarding",
  "/org",
  "/portal",
  "/pass",
  "/join",
  "/feedback",
];

const PRIVATE_PATH_PARTS = [
  "razorpay",
  "payu",
  "checkout",
  "subscription",
  "invoice",
  "qr",
  "passToken",
  "attendee",
  "manifest",
  "verify",
  "webhook",
];

function isPrivateRequest(request) {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return true;
  if (request.method !== "GET") return true;
  if (request.headers.has("authorization")) return true;
  if (request.headers.has("x-supabase-auth-token")) return true;
  if (request.mode === "navigate") {
    return PRIVATE_PATH_PREFIXES.some((prefix) => url.pathname === prefix || url.pathname.startsWith(prefix + "/"));
  }
  return (
    PRIVATE_PATH_PREFIXES.some((prefix) => url.pathname === prefix || url.pathname.startsWith(prefix + "/")) ||
    PRIVATE_PATH_PARTS.some((part) => url.pathname.toLowerCase().includes(part.toLowerCase()))
  );
}

function isStaticAssetRequest(request) {
  const url = new URL(request.url);
  return (
    request.method === "GET" &&
    url.origin === self.location.origin &&
    !isPrivateRequest(request) &&
    (
      url.pathname.startsWith("/_next/static/") ||
      url.pathname === "/favicon.ico" ||
      url.pathname === "/icon.png" ||
      url.pathname === "/icon-192.png" ||
      url.pathname === "/icon-512.png" ||
      url.pathname === "/apple-icon.png"
    )
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("urpass-pwa-") && key !== STATIC_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(async () => {
          if (isPrivateRequest(request)) {
            return Response.redirect(OFFLINE_URL, 302);
          }
          return (await caches.match(OFFLINE_URL)) || Response.error();
        })
    );
    return;
  }

  if (!isStaticAssetRequest(request)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});

