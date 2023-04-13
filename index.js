addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const handleRequest = async (request) => {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/submit-article" && request.method === "POST") {
    return handleArticleSubmission(request);
  } else {
    // Serve the appropriate HTML, CSS, and JS files for your application
  }
};

const handleArticleSubmission = async (request) => {
  const { companyName, companyWebsite, topic, article } = await request.json();
  // Generate a unique ID for the article
  const articleId = new Date().getTime();

  // Store the submitted article and company information in Cloudflare Workers KV
  await ARTICLE_DATA.put(articleId, JSON.stringify({ companyName, companyWebsite, topic, article, approved: false }));

  return new Response("Article submitted successfully!", { status: 200 });
};

// This function retrieves the approved articles and returns them as JSON
const getApprovedArticles = async () => {
  const approvedArticles = [];
  for await (const key of ARTICLE_DATA.list()) {
    const articleId = key.name;
    const articleData = await ARTICLE_DATA.get(articleId);
    const articleObj = JSON.parse(articleData);
    if (articleObj.approved) {
      approvedArticles.push(articleObj);
    }
  }
  return new Response(JSON.stringify(approvedArticles), { status: 200 });
};
