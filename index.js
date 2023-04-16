addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const handleRequest = async (request) => {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/submit-article" && request.method === "POST") {
    return handleArticleSubmission(request);
  } else if (path === "/get-submitted-articles" && request.method === "GET") {
    return getSubmittedArticles();
  } else if (path === "/approve-article" && request.method === "PUT") {
    return approveArticle(request);
  } else {
    // Serve the appropriate HTML, CSS, and JS files for your application
    return serveStaticAsset(request);
  }
};

const handleArticleSubmission = async (request) => {
  // ...
};

const getSubmittedArticles = async () => {
  // ...
};

const approveArticle = async (request) => {
  // ...
};

// This function serves the static assets (HTML, CSS, JS, etc.) based on the incoming request
async function serveStaticAsset(request) {
  // Define a mapping between paths and files
  const staticAssetMap = {
    "/": "index.html",
    "/admin": "admin.html",
    "/script.js": "script.js",
    "/admin.js": "admin.js",
    // Add other static assets like CSS, images, etc., if needed
  };

  const url = new URL(request.url);
  const path = url.pathname;
  const filename = staticAssetMap[path] || "404.html";

  // Fetch the asset from the static hosting
  const assetUrl = new URL(`https://your-static-assets-hosting.example.com/${filename}`);
  const assetResponse = await fetch(assetUrl);

  // If the asset is not found, respond with a 404 status
  if (!assetResponse.ok) {
    return new Response("Not found", { status: 404 });
  }

  // Respond with the fetched asset
  return assetResponse;
}
