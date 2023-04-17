async function fetchApprovedArticles() {
    const response = await fetch("/get-approved-articles");
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
      `;
      container.appendChild(articleElem);
    });
  }
  
  fetchApprovedArticles();
  