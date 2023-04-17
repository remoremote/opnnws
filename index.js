const ARTICLE_DATA_NAMESPACE_ID = 'd4ec98da9c4a4793bdac872e4c7ff5a4';

// Add an event listener to listen for incoming requests
addEventListener("fetch", (event) => {
  // Respond to the event with the result of the handleRequest() function
  event.respondWith(handleRequest(event.request));
});

const handleArticleSubmission = async (request) => {
  const data = await request.json();
  const articleId = new Date().getTime().toString();
  await ARTICLE_DATA_BINDING.put(articleId, JSON.stringify({ ...data, approved: false }));
  return new Response("Article submitted successfully!", { status: 201 });
};

// This function handles the incoming requests and decides which function to call based on the request's method and path
const handleRequest = async (request) => {  
  // Get the request's URL and path
  const url = new URL(request.url);
  const path = url.pathname;

  // Check if the request is a POST to /submit-article
  if (path === "/submit-article" && request.method === "POST") {
    return handleArticleSubmission(request);
  } else if (path === "/get-submitted-articles" && request.method === "GET") {
    return getSubmittedArticles();
  } else if (path === "/get-approved-articles" && request.method === "GET") {
    return getApprovedArticles();
  } else if (path === "/approve-article" && request.method === "PUT") {
    return approveArticle(request);
  } else {
    // If none of the above conditions are met, serve static assets
    return serveStaticAsset(request);
  }
};

// This function returns a list of submitted articles that are not yet approved
const getSubmittedArticles = async () => {
  const submittedArticles = [];
  for await (const key of ARTICLE_DATA_BINDING.list({ namespace: ARTICLE_DATA_NAMESPACE_ID })) {
    const articleId = key.name;
    const articleData = await ARTICLE_DATA_BINDING.get(articleId, { namespace: ARTICLE_DATA_NAMESPACE_ID });
    const articleObj = JSON.parse(articleData);
    if (!articleObj.approved) {
      submittedArticles.push({ ...articleObj, articleId });
    }
  }
  return new Response(JSON.stringify(submittedArticles), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

// This function approves an article by updating its "approved" property to true
const approveArticle = async (request) => {
  const url = new URL(request.url);
  const articleId = url.searchParams.get("id");
  const articleData = await ARTICLE_DATA_BINDING.get(articleId);
  if (articleData) {
    const articleObj = JSON.parse(articleData);
    articleObj.approved = true;
    await ARTICLE_DATA_BINDING.put(articleId, JSON.stringify(articleObj));
    return new Response("Article approved successfully!", { status: 200 });
  } else {
    return new Response("Article not found.", { status: 404 });
  }
};

// This function serves static assets (HTML, CSS, JS) for the application
async function serveStaticAsset(request) {
  // Determine the file to serve based on the request URL
  let file;
  const url = new URL(request.url);

  if (url.pathname === "/") {
    file = "index.html";
  } else {
    file = url.pathname.substring(1); // Remove the leading "/"
  }

  // Fetch the file from the static assets
  const fileResponse = await fetch(`https://0cd44760.opnnws.pages.dev/${file}`, {
    headers: {
    "Content-Type": file.endsWith(".html") ? "text/html" : "application/json",
    },
    });
    
    // If the file is not found, serve a fallback response
    if (!fileResponse.ok) {
    return new Response("File not found", { status: 404 });
    }
    
    // Return the fetched file as the response
    return fileResponse;
    }
    
    const getApprovedArticles = async () => {
    const approvedArticles = [];
    for await (const key of ARTICLE_DATA_BINDING.list()) {
    const articleId = key.name;
    const articleData = await ARTICLE_DATA_BINDING.get(articleId);
    const articleObj = JSON.parse(articleData);
    if (articleObj.approved) {
    approvedArticles.push({ ...articleObj, articleId });
    }
    }
    return new Response(JSON.stringify(approvedArticles), { status: 200, headers: { 'Content-Type': 'application/json' } });
    };
