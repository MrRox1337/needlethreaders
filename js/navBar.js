// Aman Mishra
// CST 2120
// 13/12/2023
// Coursework #1
//
// This script will manage the user account control links namely sign-in, sign-up, and sign-out.

// Enables/Disables sign-in, sign-up, and sign-out based on currently logged in user in
// one session.
function navBar() {
    if (sessionStorage["loggedInUser"] == undefined) {
        let signOutLink = document.getElementById("userClear");
        signOutLink.setAttribute("disabled", "true");
        signOutLink.removeAttribute("href");
    } else {
        buttons = document.getElementsByClassName("userControl");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute("disabled", "true");
            buttons[i].removeAttribute("href");
        }
    }
}

// Force calls the navBar function when a page loads
window.navBar = navBar();
