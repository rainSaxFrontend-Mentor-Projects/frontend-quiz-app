// light dark switch section
const toggleSwitch = document.querySelector('.light-dark-switch input[type="checkbox"]');
document.querySelector(".start-menu").classList.toggle("visible")

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
var quizType;

for (var i = 0; i < quizButtons.length; i++) {
    quizButtons[i].addEventListener("click", function () {
        quizType = this.id;
        questionScreen(quizType);
    })
}

function questionScreen(type) {
    document.querySelector(".start-menu").classList.toggle("visible")
    setSubjectBars(type)
    document.querySelector(".question-screen").classList.toggle("visible")

    //retrieve quiz data based on selection
    getQuiz(type);
}

function setSubjectBars(type) {
    var bars = document.querySelectorAll(".curr-subject");
    for (let bar of bars) {
        bar.lastElementChild.innerHTML = type
        if (type == "HTML") {
            bar.firstElementChild.firstElementChild.src = "./assets/images/icon-html.svg"
        }
        else if (type == "CSS") {
            bar.firstElementChild.firstElementChild.src = "./assets/images/icon-css.svg"
        }
        else if (type == "JavaScript") {
            bar.firstElementChild.firstElementChild.src = "./assets/images/icon-js.svg"
        }
        else {
            bar.firstElementChild.firstElementChild.src = "./assets/images/icon-accessibility.svg"
        }
        bar.style.visibility = "visible"
    }
}

var quizChosen;
var qCount = -1;
var totalQuestions;
var score = 0;
var submit = document.querySelector(".submit-answer");
var increment;

// fetch returns a Promise, .json() returns a *2nd* Promise, therefore 2 .thens
async function getQuiz(type) {
    const response = await fetch('./data.json');
    const data = await response.json();
    for (const quiz of data.quizzes) {
        if (quiz.title == type) {
            quizChosen = quiz;
            totalQuestions = quizChosen.questions.length;
            document.querySelector(".question-total").textContent = totalQuestions
            increment = (1 / totalQuestions) * 100;
        }
    }
    makeQuestions(quizChosen)
}

// quiz flow:
// populate fields -> submit event handler validates (wrong - show wrong, do nothing. right - show right, move on)

function makeQuestions(quizChoice) {
    qCount++;
    document.querySelector(".question-number").textContent = (qCount + 1);
    document.querySelector(".progress-bar.done").style.width = (increment * (qCount + 1)).toString() + "%";
    submit.textContent = "Submit"
    let options = document.querySelectorAll(".option");

    document.querySelector(".question").textContent = quizChoice.questions[qCount].question;

    for (let option of options) {
        option.classList.remove("selected")
        option.classList.remove("invalid")
        option.classList.remove("correct")
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
    }
}

var options = document.querySelectorAll(".option");

for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", function () {
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

    if (submit.textContent == "Next Question") {
        makeQuestions(quizChosen);
        return;
    }
    if (submit.textContent == "See Results") {
        showQuizComplete();
        return;
    }
    if (selectedBox = document.querySelector(".selected")) {

        // remove selection letter from string
        answerText = selectedBox.textContent.slice(1, selectedBox.textContent.length);

        // once submit is pressed, is a selected box exists, remove it's selected classes
        selectedBox.classList.remove("selected")
        selectedBox.firstChild.classList.remove("selected-box")
    }
    else {
        document.querySelector(".select-prompt").style.visibility = "visible"
        return
    }

    if (validate(answerText)) {
        // instead of makeQuestions, change styling to green look, and submit button to next question text
        if (!selectedBox.classList.contains("correct")) {
            score++;
            selectedBox.innerHTML += "<img class='correct-icon' src='./assets/images/icon-correct.svg'>"
        }
        selectedBox.classList.add("correct")
        selectedBox.firstChild.classList.add("correct-box")
        document.querySelector(".select-prompt").style.visibility = "hidden"
    }
    else {
        // apply some invalid css styles to boxes
        if (!selectedBox.classList.contains("invalid")) {
            selectedBox.innerHTML += "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>"
        }

        selectedBox.classList.add("invalid")
        selectedBox.firstChild.classList.add("invalid-box")
        document.querySelector(".select-prompt").style.visibility = "hidden"
    }

    revealAnswers();

    if (qCount >= (totalQuestions - 1)) {
        submit.textContent = "See Results"

    }
    else {
        submit.textContent = "Next Question";
    }
    return;
})

function revealAnswers() {
    for (option of options) {
        let text = option.textContent.slice(1, option.textContent.length)

        if (validate(text)) {
            if (!option.classList.contains("correct")) {
                option.classList.add("correct")
                option.firstChild.classList.add("correct-box")
                option.innerHTML += "<img class='correct-icon' src='./assets/images/icon-correct.svg'>"

            }
        }
        else {
            if (!option.classList.contains("invalid")) {
                option.classList.add("invalid")
                option.firstChild.classList.add("invalid-box")
                option.innerHTML += "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>"
            }
        }
    }
}

function validate(selected) {
    let question = quizChosen.questions[qCount];
    return (question.answer === selected)
}

function showQuizComplete() {
    document.querySelector(".question-screen").classList.toggle("visible")
    document.querySelector(".quiz-complete").classList.toggle("visible")
    document.querySelector(".final-score").textContent = score
    document.querySelector(".complete-question-total").textContent = totalQuestions
}

document.querySelector(".restart").addEventListener("click", function () {
    document.querySelector(".quiz-complete").classList.toggle("visible")
    document.querySelector(".start-menu").classList.toggle("visible")
    document.querySelector(".curr-subject").style.visibility = "hidden"
    qCount = -1
    score = 0
})