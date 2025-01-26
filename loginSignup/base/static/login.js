

// listen for form submission
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault(); // prevents default form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const avatarName = document.getElementById("avatar-name").value.trim();

    // Validate input fields
    if (!username || !password || !avatarName) {
      alert("Please fill out all fields.");
      return; // Stop submission if validation fails
    }

    // Save to Chrome Storage or Local Storage
    chrome.storage.sync.set(
      { username, password, avatarName },
      () => {
        console.log("User data saved:", { username, avatarName });
        // Redirect to the main popup page
        window.location.href = "popup.html";
    });
});

document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault(); // Prevent default form submission

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

  // Send the POST request using Fetch API or XMLHttpRequest
  fetch("/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,  // Include the CSRF token in the header
    },
    body: JSON.stringify({
      username: username,
      password: password
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = "/dashboard/";  // Redirect to dashboard on success
    } else {
      alert("Invalid login credentials");
    }
  })
  .catch(error => console.error('Error:', error));
});
