let rememberMe = false;

/**
 * This function gets the input of Login and search with the Values, in the users Array.
 */
function login() {
    let email = document.getElementById("login-email");
    let password = document.getElementById("login-password");
    rememberMe = document.getElementById("remember-me").checked;
    let existingUser = users.find(user => user.email === email.value && user.password === password.value);
    localStorage.setItem('alreadyGreetMobile', alreadyGreetMobile);

    if (existingUser) {
        if (rememberMe) {
            saveUserToLocalStorage(email, password, rememberMe);
        } else {
            localStorage.setItem("rememberLogin", rememberMe);
            localStorage.clear();
        }
        goToSummaryAfterTimeout();
        localStorage.setItem('currentUser', existingUser.name);
    } else {
        showEmailAlreadyInUse(email, password);
    }
}


/**
 * This function saves User data to Local Storage.
 * 
 * @param {element} email -input field.
 * @param {element} password -input field.
 * @param {boolean} rememberMe -this is true of false.
 */
function saveUserToLocalStorage(email, password, rememberMe) {
    localStorage.setItem("email", email.value);
    localStorage.setItem("password", password.value);
    localStorage.setItem("rememberLogin", rememberMe)
}


/**
 * This function moves the User to Summary.html,
 * after Timout.
 */
function goToSummaryAfterTimeout() {
    setTimeout(function () {
        window.location.href = "./summary.html";
    }, 1000);
}


/**
 * This function shows Email already in Use Message,
 * and clears input after Timout.
 */
function showEmailAlreadyInUse() {
    email.value = 'Email oder Passwort inkorrekt';
    setTimeout(() => {
        email.value = '';
        password.value = '';
    }, 2000);
}


/**
 * This function loads existing User from Local Storage,
 * to autoFill the Input of Login.
 */
function loadUserCredentials() {
    let storedEmail = localStorage.getItem("email");
    let storedPassword = localStorage.getItem("password");
    rememberMe = localStorage.getItem("rememberLogin");
    if (rememberMe == 'true') {
        document.getElementById("login-email").value = storedEmail;
        document.getElementById("login-password").value = storedPassword;
        document.getElementById("remember-me").checked = rememberMe;
    }
}


/**
 * This function Reset the Password of a User.
 * 
 * @returns If requirements not true.
 */
function resetPassword() {
    let extractedEmail = window.location.href.substr(window.location.href.indexOf('(') + 1).slice(0, -1);
    let newPassword = document.getElementById("resetPWInput");
    let newPasswordCONF = document.getElementById("resetPWInputConf");
    let existingUser = users.find(user => user.email == extractedEmail);

    if (!(newPassword.value === newPasswordCONF.value)) {
        loginFailed(newPassword, newPasswordCONF, 'Passwords do not match!');
        console.log('failed')
        return;
    }
    if (!existingUser) {
        loginFailed(newPassword, newPasswordCONF, 'Could not find user!');
        console.log('failed')
        return;
    }

    existingUser.password = newPassword.value;
    backend.setItem("users", JSON.stringify(users));
    resetPW.classList.add("flighUp");
    setTimeout(function () {
        window.location.href = "./index.html";
    }, 900);
}


// /**
//  * This function changes the value of given input Field to show
//  * the User Validation.
//  * 
//  * @param {element} newPassword -input Element.
//  * @param {element} newPasswordCONF -input Element.
//  */
function loginFailed(newPassword, newPasswordCONF, noMatch){
    setResetPasswordInputType('text');
    newPassword.value = `${noMatch}`;
    newPasswordCONF.value = `${noMatch}`;
    resetPasswordTypeTimeout('password');
}


/**
 * This function changes the Type of input fields. Wich Type to set
 * is defined in Var type.
 * 
 * @param {string} type -text with name of Type.
 */
function setResetPasswordInputType(type) {
    let newPassword = document.getElementById("resetPWInput");
    let newPasswordCONF = document.getElementById("resetPWInputConf");
    newPassword.type = type;
    newPasswordCONF.type = type;
}


/**
 * This function changes after Timout the type and value of input field.
 * 
 * @param {string} type -text with name of Type.
 */
function resetPasswordTypeTimeout(type) {
    let newPassword = document.getElementById("resetPWInput");
    let newPasswordCONF = document.getElementById("resetPWInputConf");
    setTimeout(() => {
        setResetPasswordInputType(type);
        newPassword.value = '';
        newPasswordCONF.value = '';
    }, 2000);
}


/**
 * This function Creates a new User and add them to Backend, If Email
 * not already in Use.
 */
async function register() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email");
    let password = document.getElementById("password").value;
    let existingUser = users.find(user => user.email === email.value);

    if (!existingUser) {
        users.push({
            name: name,
            email: email.value,
            password: password
        });
        await backend.setItem("users", JSON.stringify(users));
        document.getElementById("signUpSingle").classList.add("flighUp");
        setTimeout(() => { window.location.href = "./index.html"; }, 900);

    } else {
        email.value = 'Email already in use!';
    }
}


/**
 * function for sending an Email for reset
 */
function sendMail() {
    let email_input = document.getElementById("resetEmailInput").value;
    let confirmSentMail = document.getElementById("resetPWackknowledge");
    confirmSentMail.classList.add("flighUp");
    email = email_input;
    setTimeout(function () { confirmSentMail.classList.remove("flighUp"); }, 2000);
}


/**
 * function for enterin summary.html as guest
 */
function guestLogin() {
    currentNavPoint = window.location.href = './summary.html';
    localStorage.clear();
    areadyGreetMobile = true;
    localStorage.setItem('alreadyGreetMobile', alreadyGreetMobile);

}


/**
 * This function close SignUp and open Login.
 */
function closeSignUpOpenLogin() {
    setOverlay("signUp", "none");
    showLogin();
    setOverlay("signup_button", "unset");
}


/**
 * This function opens Signup and close other Overlays.
 */
function showSignUpCloseOther() {
    setOverlay("signUp", "flex");
    setOverlay("forgotPw", "none");
    setOverlay("login-container", "none");
    setOverlay("signup_button", "none");
}


/**
 * This function open ForgotPassword and close other Overlays.
 */
function showForgotPwCloseOther() {
    setOverlay("forgotPw", "flex");
    setOverlay("login-container", "none");
    setOverlay("signup_button", "none");
}


/**
 * This function close ForgotPassword and open Login.
 */
function closeForgotPwOpenLogin() {
    setOverlay("forgotPw", "none");
    setOverlay("signup_button", "unset");
    showLogin();
}


/**
 * This function sets the style of an HTMlElement,
 * to show of hide Overlays.
 */
function setOverlay(elm, style){
    document.getElementById(`${elm}`).style.display = `${style}`;
}


/**
 * This function manipulate the style of defined HTMlElement,
 * to show of hide Overlays.
 */
function showLogin() {
    let loginDiv = document.getElementById("login-container");
    loginDiv.classList.remove("fade-in-login");
    loginDiv.style.display = "flex";
}
