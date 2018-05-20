const quizContainer = document.getElementById('card');
const startButton = document.getElementById("start");
const nextButton = document.getElementById("next");
let attempts = 0;
let incorrectAnswers = 0;
let numberOfQuestions;

let myQuestions;
const quizUrl = 'https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/e75dc7c19b918a9f0f5684595899dba2e5ad4f43/history-flashcards.json';

const getQuestions = function() {
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
  nextButton.style.visibility = 'visible';
  getQuestions();
};

const echoResults = function() {
  numberOfQuestions = myQuestions.length;
  showCardQuestion(myQuestions[0]);
};

const showCardQuestion = function(currentQuestion) {
  let output = [];

  let answers = [];
  currentQuestion.answers.forEach(ans => {
    answers.push(`<label class="sg-text-bit--dark">
        <input type="radio" name="card" value="${ans.answer}">${ans.answer}</label><br/>`);
  });

  output.push(
    `<div class="question sg-text-bit--small">${currentQuestion.question}</div>
        <div class="answers sg-text-bit--dark">${answers.join("")}</div>`
  );

  const card = document.getElementById('card');
  card.innerHTML = output.join('');
};

const showNextSlide = function() {
  const answerContainer = quizContainer.querySelectorAll(".answers")[0];

  const selector = `input[name=card]:checked`;
  const userAnswer = (answerContainer.querySelector(selector) || {}).value;

  let isAnswerCorrect = false;

  if (userAnswer) {
    attempts++;
    const cardAnswers = myQuestions[0].answers;
    const current = cardAnswers.find((element) => element.answer === userAnswer);

    if (!current.correct) {
      incorrectAnswers++;
    }
    isAnswerCorrect = current.correct;
  }

  getNextQuestion(isAnswerCorrect)
};

const getNextQuestion = function(isCorrectAnswer) {
  const currentQuestion = myQuestions.shift();

  if(!isCorrectAnswer) {
    myQuestions.push(currentQuestion);
  }

  if (myQuestions.length > 0) {
    showCardQuestion(myQuestions[0]);
  } else {
    showResults();
  }
};

const showResults = function() {
  nextButton.removeEventListener("click", showNextSlide);
  nextButton.style.visibility = 'hidden';
  let output = [];
  output.push(
    `<div class="question--result sg-text-bit--small">
        Number of questions: ${numberOfQuestions}<br/>
        Attempts: ${attempts}<br/>
        Incorrect: ${incorrectAnswers}
    </div>`
  );
  const card = document.getElementById('card');
  card.innerHTML = output.join('');
};

nextButton.addEventListener("click", showNextSlide);
startButton.addEventListener("click", quizVisible);
