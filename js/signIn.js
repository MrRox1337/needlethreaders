// Aman Mishra
// CST 2120
// 13/12/2023
// Coursework #1
//
// This code will sign a user in after validation and redirect them to the game rules page.

// Validates credentials and logs in to the correct account
function logIn() {
    // To prevent the page from resetting and reloading
    event.preventDefault();

    let form = document.getElementById("logIn");
    username = form.username.value;
    pass = form.password.value;
    feedback = "";

    if (localStorage[username] == undefined) {
        feedback += "Username does not exist.";
    } else {
        feedback += "User found.";
        let user = JSON.parse(localStorage[username]);

        if (pass != user.password) {
            feedback += " Invalid Password.";
        } else {
            feedback += " Welcome " + user.fullname;
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
            console.log(JSON.parse(sessionStorage["loggedInUser"]));
        }
    }

    alert(feedback);
    window.location.href = "pages/rules.html";

    // Must mention this if we are not submitting to server.
    return false;
}
