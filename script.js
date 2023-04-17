const form = document.getElementById("article-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const companyName = document.getElementById("company-name").value;
  const companyWebsite = document.getElementById("company-website").value;
  const topic = document.getElementById("topic").value;
  const article = document.getElementById("article").value;

  const submission = { companyName, companyWebsite, topic, article };

  const response = await fetch("/submit-article", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  });

  if (response.ok) {
    alert("Article submitted successfully!");
    form.reset();
  } else {
    alert("Failed to submit article. Please try again.");
  }
});
