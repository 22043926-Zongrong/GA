const paymentForm = document.getElementById("paymentForm");
const paymentStatus = document.getElementById("paymentStatus");
const totalPayment = document.getElementById("totalPayment");

const isLoggedIn = localStorage.getItem("isLoggedIn");
const loginLink = document.getElementById("loginLink");
const logoutLink = document.getElementById("logoutLink");

// Check if user is logged in
if (isLoggedIn === "true") {
  loginLink.style.display = "none";
  logoutLink.style.display = "block";
} else {
  loginLink.style.display = "block";
  logoutLink.style.display = "none";
}

// Handle logout
logoutLink.addEventListener("click", function (event) {
  event.preventDefault();

  // Clear login status from storage cookies
  localStorage.removeItem("isLoggedIn");

  // Redirect to login.html
  window.location.href = "login.html";
});

