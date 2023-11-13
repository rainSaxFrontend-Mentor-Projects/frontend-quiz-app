
// fetch returns a Promise, .json() returns a *2nd* Promise, therefore 2 .thens
fetch('./data.json')
    .then(response => response.json())
    .then(data => console.log(data))

// light dark switch section
const toggleSwitch = document.querySelector('.light-dark-switch input[type="checkbox"]');

function switchMode(event) {
    if (event.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchMode, false);

var buttons = document.querySelectorAll("button");

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        var quizType = this.id;
        questionScreen(quizType);
    })
}

function questionScreen(type) {
    document.querySelector(".start-menu").style.display = "none"
    document.querySelector(".subject-chosen").innerHTML = type
    document.querySelector(".curr-subject").style.visibility = "visible"

    // if statement for setting image
    if (type == "HTML") {
        document.querySelector(".subject-img").src = "./assets/images/icon-html.svg"
    }
    else if (type == "CSS") {
        document.querySelector(".subject-img").src = "./assets/images/icon-css.svg"
    }
    else if (type == "Javascript") {
        document.querySelector(".subject-img").src = "./assets/images/icon-js.svg"
    }
    else {
        document.querySelector(".subject-img").src = "./assets/images/icon-accessibility.svg"
    }
    document.querySelector(".question-screen").style.display = "block";
    //populate question & buttons, possibly with a function
}