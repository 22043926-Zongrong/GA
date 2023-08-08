const loginForm = document.getElementById("loginForm");

const isLoggedIn = localStorage.getItem("isLoggedIn");
if (isLoggedIn === "true") {
  window.location.href = "index.html";
}

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Retrieve user input
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Example: Perform simple login validation (static email and password)
  const validEmail = "user@example.com";
  const validPassword = "password123";

  if (email === validEmail && password === validPassword) {
    // Save login status to storage cookies
    localStorage.setItem("isLoggedIn", true);

    // Redirect to index.html
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password. Please try again.");
  }
});
