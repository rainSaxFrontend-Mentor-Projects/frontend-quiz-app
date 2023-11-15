
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

var quizButtons = document.querySelectorAll(".quiz-type");
let quizType;

for (var i = 0; i < quizButtons.length; i++) {
    quizButtons[i].addEventListener("click", function () {
        quizType = this.id;
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
    else if (type == "JavaScript") {
        document.querySelector(".subject-img").src = "./assets/images/icon-js.svg"
    }
    else {
        document.querySelector(".subject-img").src = "./assets/images/icon-accessibility.svg"
    }
    document.querySelector(".question-screen").style.display = "block";

    //retrieve quiz data based on selection
    getQuiz(type);
}

var quizChosen;
var qCount = -1;
var score = 0;
var submit = document.querySelector(".submit-answer");

// fetch returns a Promise, .json() returns a *2nd* Promise, therefore 2 .thens
async function getQuiz(type) {
    const response = await fetch('./data.json');
    const data = await response.json();
    for (const quiz of data.quizzes) {
        if (quiz.title == type) {
            quizChosen = quiz;
        }
    }
    makeQuestions(quizChosen)
}

// quiz flow:
// populate fields -> submit event handler validates (wrong - show wrong, do nothing. right - show right, move on)

function makeQuestions(quizChoice) {
    qCount++;
    document.querySelector(".question-number").textContent = (qCount + 1);
    let options = document.querySelectorAll(".option");

    document.querySelector(".question").textContent = quizChoice.questions[qCount].question;
    // console.log(quizChoice.questions[qCount].question)
    // console.log(quizChoice.questions[qCount].options)

    for (let option of options) {
        option.classList.remove("selected")
    }

    for (let i = 0; i < options.length; i++) {
        switch (i) {
            case 0: options[i].innerHTML = "<div class='option-box'>A</div>"
                break;
            case 1: options[i].innerHTML = "<div class='option-box'>B</div>"
                break;
            case 2: options[i].innerHTML = "<div class='option-box'>C</div>"
                break;
            case 3: options[i].innerHTML = "<div class='option-box'>D</div>"
                break;
        }
        options[i].append(quizChoice.questions[qCount].options[i])
        // options[i].innerHTML += "<img src='./assets/images/icon-correct.svg'>"
    }
}

var options = document.querySelectorAll(".option");

for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", function () {
        // console.log(options[i].id + " was clicked!")
        for (option of options) {
            option.classList.remove("selected")
            option.firstChild.classList.remove("selected-box")
        }
        options[i].classList.add("selected")
        options[i].firstChild.classList.add("selected-box")
    })
}

submit.addEventListener("click", function () {
    let selectedBox, answerText;
    if (selectedBox = document.querySelector(".selected")) {
        // remove selection letter from string
        answerText = selectedBox.textContent.slice(1, selectedBox.textContent.length);
        // console.log(selected)
    }
    else {
        console.log("no selected :(")
        document.querySelector(".select-prompt").style.visibility = "visible"
        return
    }
    // validate - if good, then call makeQuestions

    if (validate(answerText)) {
        // instead of makeQuestions, change styling to green look, and submit button to next question text
        if (!selectedBox.classList.contains("correct")) {
            score++;
            selectedBox.innerHTML += "<img class='correct-icon' src='./assets/images/icon-correct.svg'>"
        }
        selectedBox.classList.remove("selected")
        selectedBox.firstChild.classList.remove("selected-box")

        selectedBox.classList.add("correct")
        selectedBox.firstChild.classList.add("correct-box")
        document.querySelector(".select-prompt").style.visibility = "hidden"
        submit.textContent = "Next Question";
        // makeQuestions(quizChosen);
    }
    else {
        // apply some invalid css styles to boxes
        if (!selectedBox.classList.contains("invalid-icon")) {
            selectedBox.innerHTML += "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>"
        }
        selectedBox.classList.remove("selected")
        selectedBox.firstChild.classList.remove("selected-box")

        selectedBox.classList.add("invalid")
        selectedBox.firstChild.classList.add("invalid-box")
        document.querySelector(".select-prompt").style.visibility = "hidden"
    }
    return
})

function validate(selected) {
    let question = quizChosen.questions[qCount];
    return (question.answer === selected)
}