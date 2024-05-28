// Aman Mishra
// CST 2120
// 13/12/2023
// Coursework #1
//
// This code will register a user after validation and redirect them to the sign-in page.

// Provides javascript form validation and checks for errors in fields
// and ensures full name and username are not empty, password is at
// least 8 characters long,
function check(form) {
    let fullname = form.fullname.value;
    let username = form.username.value;
    let password = form.password.value;

    let errorMsg = "";
    if (fullname.length == 0) {
        errorMsg += "Name cannot be empty.";
    }
    if (username.length == 0) {
        errorMsg += " Username cannot be empty.";
    }
    if (password.length < 8) {
        errorMsg += " Password must be at least 8 characters.";
    }

    isErr = !(errorMsg === "");
    if (isErr) {
        alert(errorMsg);
    }

    // Returns true if there is error in fields
    return isErr;
}

// Calls for validation and adds the user information into localStorage
function register() {
    // event.preventDefault();
    let form = document.getElementById("signUp");
    let fullname = form.fullname.value;
    let username = form.username.value;
    let password = form.password.value;
    let region = form.region.value;

    // Check for incorrect form information and exit
    if (check(form)) {
        return false;
    }

    let user = {
        username: username,
        fullname: fullname,
        password: password,
        region: region,
        best: 0,
    };
    userString = JSON.stringify(user);

    localStorage[username] = userString;

    // I have attempted at applying a seamless transition but after referencing
    // the SLAs, I am still unable to get this redirection to work properly.
    // I have left this code here as a proof of my attempt at seamless transition.
    //
    location.href = "../index.html";
    // C:\Users\amanr\Documents\MDX Courses\CST2120\Coursework1_Website\index.html

    return false;
}
