// Add an event listener to listen for incoming requests
addEventListener("fetch", (event) => {
  // Respond to the event with the result of the handleRequest() function
  event.respondWith(handleRequest(event.request));
});

const handleArticleSubmission = async (request, ARTICLE_DATA) => {
  const data = await request.json();
  const articleId = new Date().getTime().toString();
  await ARTICLE_DATA.put(articleId, JSON.stringify({ ...data, approved: false }));
  return new Response("Article submitted successfully!", { status: 201 });
};

// This function handles the incoming requests and decides which function to call based on the request's method and path
const handleRequest = async (request) => {
  // Initialize ARTICLE_DATA here
  const ARTICLE_DATA = new ARTICLE_DATA();
  
  // Get the request's URL and path
  const url = new URL(request.url);
  const path = url.pathname;

  // Check if the request is a POST to /submit-article
  if (path === "/submit-article" && request.method === "POST") {
    return handleArticleSubmission(request, ARTICLE_DATA);
  } else if (path === "/get-submitted-articles" && request.method === "GET") {
    return getSubmittedArticles(ARTICLE_DATA);
  } else if (path === "/get-approved-articles" && request.method === "GET") {
    return getApprovedArticles(ARTICLE_DATA);
  } else if (path === "/approve-article" && request.method === "PUT") {
    return approveArticle(request, ARTICLE_DATA);
  } else {
    // If none of the above conditions are met, serve static assets
    return serveStaticAsset(request);
  }
};

// This function returns a list of submitted articles that are not yet approved
const getSubmittedArticles = async (ARTICLE_DATA) => {
  const submittedArticles = [];
  // Loop through all the articles in ARTICLE_DATA
  for await (const key of ARTICLE_DATA.list()) {
    const articleId = key.name;
    const articleData = await ARTICLE_DATA.get(articleId);
    const articleObj = JSON.parse(articleData);
    // If the article is not approved, add it to the submittedArticles array
    if (!articleObj.approved) {
      submittedArticles.push({ ...articleObj, articleId });
    }
  }
  // Return the submittedArticles array as a JSON response
  return new Response(JSON.stringify(submittedArticles), { status: 200 });
};

// This function approves an article by updating its "approved" property to true
const approveArticle = async (request, ARTICLE_DATA) => {
  const url = new URL(request.url);
  const articleId = url.searchParams.get("id");
  const articleData = await ARTICLE_DATA.get(articleId);
  if (articleData) {
    const articleObj = JSON.parse(articleData);
    articleObj.approved = true;
    await ARTICLE_DATA.put(articleId, JSON.stringify(articleObj));
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
  const fileResponse = await fetch(`https://0cd44760.opnnws.pages.dev/${file}`);

  // If the file is not found, serve a fallback response
  if (!fileResponse.ok) {
    return new Response("File not found", { status: 404 });
  }

  // Return the fetched file as the response
  return fileResponse;
}

const getApprovedArticles = async (ARTICLE_DATA) => {
  const approvedArticles = [];
  for await (const key of ARTICLE_DATA.list()) {
    const articleId = key.name;
    const articleData = await ARTICLE_DATA.get(articleId);
    const articleObj = JSON.parse(articleData);
    if (articleObj.approved) {
      approvedArticles.push({ ...articleObj, articleId });
    }
  }
  return new Response(JSON.stringify(approvedArticles), { status: 200, headers: { 'Content-Type': 'application/json' } });
};


