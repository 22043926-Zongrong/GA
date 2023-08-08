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
  window.location.href = "login.html";
}

// Handle logout
logoutLink.addEventListener("click", function (event) {
  event.preventDefault();

  // Clear login status from storage cookies
  localStorage.removeItem("isLoggedIn");

  // Redirect to login.html
  window.location.href = "login.html";
});

// Implement Paypal payment
paypal.Buttons({
  createOrder: function (data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: transactionAmount,
          },
        },
      ],
    });
  },
  onApprove: function (data, actions) {
    return actions.order.capture().then(function (details) {
      paymentStatus.textContent = "Payment successful!";
    });
  },
  onError: function (err) {
    paymentStatus.textContent =
      "An error occurred while processing your payment. Please try again.";
  },
}).render("#paypal-button-container");

document.getElementById("cardNumber").addEventListener("input", function () {
  let cardNumber = this.value;

  if (cardNumber.startsWith("4")) {
    document.getElementById("visaIcon").style.opacity = "1";
    document.getElementById("mastercardIcon").style.opacity = "0.5";
  } else if (cardNumber.startsWith("5")) {
    document.getElementById("visaIcon").style.opacity = "0.5";
    document.getElementById("mastercardIcon").style.opacity = "1";
  } else {
    document.getElementById("visaIcon").style.opacity = "0.5";
    document.getElementById("mastercardIcon").style.opacity = "0.5";
  }
});

paymentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value;
  const expirationDate = document.getElementById("expirationDate").value;
  const cvv = document.getElementById("cvv").value;

  const isCardValid = validateCardDetails(cardNumber, expirationDate, cvv);

  if (!isCardValid) {
    paymentStatus.textContent =
      "Invalid card details. Please check your information and try again.";
    return;
  }

  const isFraudulent = checkForFraud(cardNumber, expirationDate, cvv);

  if (isFraudulent) {
    paymentStatus.textContent =
      "Fraudulent transaction detected. Your payment has been declined.";
    return;
  }

  const isMoneyLaundering = checkForMoneyLaundering(totalPayment.value);

  if (isMoneyLaundering) {
    paymentStatus.textContent =
      "Money laundering detected. Your payment has been declined.";
    return;
  }

  paymentStatus.textContent = "Payment successful!";
});

function validateCardDetails(cardNumber, expirationDate, cvv) {
  const cardRegex = /^\d{16}$/;
  const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const cvvRegex = /^\d{3}$/;

  if (
    !cardRegex.test(cardNumber) ||
    !expirationDateRegex.test(expirationDate) ||
    !cvvRegex.test(cvv)
  ) {
    console.log("Invalid card details");
    return false;
  }

  const currentDate = new Date();
  const [expMonth, expYear] = expirationDate.split("/");
  const cardExpirationDate = new Date(`20${expYear}`, expMonth - 1, 1);

  if (currentDate > cardExpirationDate) {
    console.log("Card has expired");
    return false;
  }

  console.log("Card details are valid");
  return true;
}

function checkForFraud(cardNumber, expirationDate, cvv) {
  if (cardNumber.startsWith("1234") || cvv === "000") {
    console.log("Fraudulent transaction detected");
    return true;
  }

  console.log("No fraudulent activity detected");
  return false;
}

function checkForMoneyLaundering(amount) {
  if (amount > 10000) {
    return true;
  }

  return false;
}

const transactionAmount = 150.0;
totalPayment.value = transactionAmount;
totalPayment.textContent = `Total Payment: $${transactionAmount.toFixed(2)}`;
