
console.log("JS is connected!");
document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page refresh

    const username = document.getElementById("signupName").value;
    const password = document.getElementById("signupPassword").value;

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    alert("Account created sucessfully! Please log in.");
    
});

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page refresh

    const username = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;

    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (username === storedUsername && password === storedPassword) {
        alert("Login successful!");

        window.location.href = "homepage.html"; 
    }else{
        alert("Invalid username or password. Please try again.");
    }
});