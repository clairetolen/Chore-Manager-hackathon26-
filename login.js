document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const createForm = document.getElementById('createForm');

    function getAccounts() {
    return JSON.parse(localStorage.getItem('accounts')) || [];
    }

    function saveAccounts(accounts) {
    localStorage.setItem('accounts', JSON.stringify(accounts));
    }

    // Handle account creation
    createForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('createName').value.trim();
    const password = document.getElementById('createPassword').value;

    if (!name || !password) {
      alert("Please enter both name and password.");
        return;
    }

    let accounts = getAccounts();
    if (accounts.some(acc => acc.name === name)) {
      alert("Account with this name already exists.");
      return;
    }

    accounts.push({ name, password });
    saveAccounts(accounts);

    // Automatically log in after creating account
    localStorage.setItem('currentUser', JSON.stringify({ name }));
    window.location.href = "homepage.html";
    });

    // Handle login
      
    loginForm.addEventListener('submit', function(event) {
     event.preventDefault();

     const name = document.getElementById('loginName').value.trim();
     const password = document.getElementById('loginPassword').value;

     let accounts = getAccounts();
     const account = accounts.find(acc => acc.name === name && acc.password === password);

     if (account) {
       localStorage.setItem('currentUser', JSON.stringify({ name }));
       window.location.href = "homepage.html";
     } else {
       alert("Incorrect name or password.");
     }
    });
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
    });

});