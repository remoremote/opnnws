async function fetchSubmittedArticles() {
    const response = await fetch("/my-worker/get-submitted-articles");
    const articles = await response.json();
    displayArticles(articles);
  }
  
  function displayArticles(articles) {
    const container = document.getElementById("articles-container");
    articles.forEach(article => {
      const articleElem = document.createElement("div");
      articleElem.innerHTML = `
        <h3>${article.companyName}</h3>
        <p><a href="${article.companyWebsite}" target="_blank">${article.companyWebsite}</a></p>
        <p>Topic: ${article.topic}</p>
        <p>${article.article}</p>
        <button onclick="approveArticle(${article.articleId})">Approve</button>
      `;
      container.appendChild(articleElem);
    });
  }
  
  fetchSubmittedArticles();
  
  async function approveArticle(articleId) {
    const response = await fetch(`/my-worker/approve-article?id=${articleId}`, { method: "PUT" });
    if (response.ok) {
      alert("Article approved successfully!");
      location.reload();
    } else {
      alert("An error occurred. Please try again.");
    }
  }
  
