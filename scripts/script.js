var loginBtnElement = document.getElementById("loginBtn");
var registerBtnElement = document.getElementById("registerBtn");
var loginElement = document.getElementById("login");
var registerElement = document.getElementById("register");

function login() {
  loginElement.style.left = "4px";
  registerElement.style.right = "-520px";
  loginBtnElement.className += " white-btn";
  registerBtnElement.className = "btn";
  loginElement.style.opacity = 1;
  registerElement.style.opacity = 0;
}

function register() {
  loginElement.style.left = "-510px";
  registerElement.style.right = "5px";
  loginBtnElement.className = "btn";
  registerBtnElement.className += " white-btn";
  loginElement.style.opacity = 0;
  registerElement.style.opacity = 1;
}

function menuFunction() {
  var i = document.getElementById("navMenu");
  if (i.className === "nav-menu") {
    i.className += " responsive";
  } else {
    i.className = "nav-menu";
  }
}
