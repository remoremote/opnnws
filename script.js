document.getElementById("article-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const companyName = document.getElementById("company-name").value;
  const companyWebsite = document.getElementById("company-website").value;
  const topic = document.getElementById("topic").value;
  const article = document.getElementById("article").value;

  const response = await fetch("https://opnnws.org/my-worker/submit-article", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ companyName, companyWebsite, topic, article }),
});

  if (response.ok) {
    alert("Article submitted successfully!");
  } else {
    alert("An error occurred. Please try again.");
  }
});
