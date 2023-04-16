// Add these two new route handlers to the existing if-else block in handleRequest()
if (path === "/get-submitted-articles" && request.method === "GET") {
    return getSubmittedArticles();
  } else if (path === "/approve-article" && request.method === "PUT") {
    return approveArticle(request);
  }
  
  // New functions to handle the admin requests
  const getSubmittedArticles = async () => {
    const submittedArticles = [];
    for await (const key of ARTICLE_DATA.list()) {
      const articleId = key.name;
      const articleData = await ARTICLE_DATA.get(articleId);
      const articleObj = JSON.parse(articleData);
      if (!articleObj.approved) {
        submittedArticles.push({ ...articleObj, articleId });
      }
    }
    return new Response(JSON.stringify(submittedArticles), { status: 200 });
  };
  
  const approveArticle = async (request) => {
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