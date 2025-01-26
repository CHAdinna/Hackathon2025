document.addEventListener("DOMContentLoaded", () => {
  const getStartedButton = document.getElementById("get-started");

  // Check if user has already set up their account
  chrome.storage.sync.get(["username", "avatarName"], (result) => {
    const { username, avatarName } = result;

    if (username && avatarName) {
      // If account exists, redirect to the main popup
      window.location.href = "popup.html";
    } else {
      // Otherwise, show the Get Started button for login flow
      getStartedButton.style.display = "block";
    }
  });

  // Redirect to login page on button click
  getStartedButton.addEventListener("click", () => {
    window.location.href = "login.html";
  });
});
