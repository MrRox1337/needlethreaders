// Aman Mishra
// CST 2120
// 13/12/2023
// Coursework #1
//
// This code will simply sign the user out.

// Signs the currently logged in user out and resets session storage.
function signOut() {
    sessionStorage.clear();
    window.location.href = "../index.html";
}
