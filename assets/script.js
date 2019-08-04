const quizContainer = document.getElementById('card');
const startButton = document.getElementById("start");
const nextButton = document.getElementById("next");
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarHud = document.getElementById('hud');

let attempts = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let numberOfQuestions;

let myQuestions;
const quizUrl = 'https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/e75dc7c19b918a9f0f5684595899dba2e5ad4f43/history-flashcards.json';

const getQuestions = function () {
    fetch(quizUrl)
        .then((response) => response.json())
        .then((data) => {
            myQuestions = data;
            echoResults();
        })
        .catch((err) => {
            showErrorMessage();
        });
};

const showErrorMessage = function () {
    nextButton.removeEventListener("click", showNextSlide);
    nextButton.style.visibility = 'hidden';
    const card = document.getElementById('card');
    card.innerHTML = `<h1 class="question--result">Site is currently unavailable. Please try again later.</h1>`
};

const quizVisible = function () {
    startButton.removeEventListener("click", quizVisible);
    startButton.style.visibility = 'hidden';
    nextButton.style.visibility = 'visible';
    getQuestions();
};

const echoResults = function () {
    numberOfQuestions = myQuestions.length;
    showCardQuestion(myQuestions[0]);
};

const showCardQuestion = function (currentQuestion) {
    let output = [];

    let answers = [];
    currentQuestion.answers.forEach(ans => {
        answers.push(`<label class="heading-tertiary">
        <input type="radio" name="card" value="${ans.answer}">${ans.answer}</label>`);
    });

    output.push(
        `<div class="question heading-secondary heading-secondary__guestion">${currentQuestion.question}</div>
     <div class="answers heading-tertiary">${answers.join("")}</div>`
    );

    const card = document.getElementById('card');
    card.innerHTML = output.join('');
};

const showNextSlide = function () {
    const answerContainer = quizContainer.querySelectorAll(".answers")[0];
    const selector = `input[name=card]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    let isAnswerCorrect = false;

    if (userAnswer) {
        attempts++;
        progressText.innerHTML = `Question ${attempts} / ${numberOfQuestions}`;
        //update progressBar
        const progressBarFull = document.querySelector('.progress-bar-full');
        progressBarFull.style.width = `${(attempts / numberOfQuestions) * 100}%`;


        const cardAnswers = myQuestions[0].answers;
        const current = cardAnswers.find((element) => element.answer === userAnswer);

        if (current.correct) {
            correctAnswers++;
            scoreText.innerText = `${correctAnswers}`;
        }
        if (!current.correct) {
            incorrectAnswers++;
        }

        isAnswerCorrect = current.correct;
    }

    getNextQuestion(isAnswerCorrect)
};

const getNextQuestion = function (isCorrectAnswer) {
    let currentQuestion = myQuestions.shift();

    if (!isCorrectAnswer) {
        myQuestions.slice(currentQuestion);
    }

    if (myQuestions.length > 0) {
        showCardQuestion(myQuestions[0]);
    } else {
        showResults();
    }
};

const showResults = function () {
    nextButton.removeEventListener("click", showNextSlide);
    nextButton.style.visibility = 'hidden';
    progressBarHud.style.visibility = 'hidden';

    let output = [];
    output.push(
        `<div class="question--result heading-secondary">
        Number of questions: ${numberOfQuestions}<br/>
        Score: ${correctAnswers}<br/>
        Incorrect: ${incorrectAnswers}
    </div>`
    );
    const card = document.getElementById('card');
    card.innerHTML = output.join('');
};

nextButton.addEventListener("click", showNextSlide);
startButton.addEventListener("click", quizVisible);
