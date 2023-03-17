const landingPage = document.querySelector("#landing-page");
const questionContainer = document.querySelector("#question-container");
const scoreContainer = document.querySelector("#score-container");
const leaderboardContainer = document.querySelector("#leaderboard-container");
const results = document.querySelector("#results");
const resultsText = document.querySelector("#results-text");

// questions
const questions = [
    {
        Quizquestions: "How can a datatype be declared to be a constant type?",
        options: ["var", "let", "constant", "const"],
        answer: "const",
    },
    {
        Quizquestions: "JavaScript is an ___ language",
        options: ["Object-Oriented", "Object-Based", "Procedural", "None of the above"],
        answer: "Object-Oriented",
    },
    {
        Quizquestions: "Which of the following keywords is used to define a variable in Javascript?",
        options: ["var", "let", "Both var and let", "None of the above"],
        answer: "Both var and let",
    },
    {
        Quizquestions: "Which of the following methods is used to access HTML elements using Javascript?",
        options: ["getElementbyId()", "getElementsByClassName()", "Both a and b", "None of the above"],
        answer: "Both a and b",
    },
    {
        Quizquestions: "Which of the following methods can be used to display data in some form using Javascript?",
        options: ["document.write()", "console.log()", "window.alert()", "All of the above"],
        answer: "All of the above",
    },
];

//questions hidden
function hideContainers() {
    landingPage.setAttribute("hidden", true);
    questionContainer.setAttribute("hidden", true);
    scoreContainer.setAttribute("hidden", true);
    leaderboardContainer.setAttribute("hidden", true);
}

function hideTextResults() {
  results.style.display = "none";
}

var intervalID;
var time;
var currentQuestion;

//start game
document.querySelector("#start-btn").addEventListener("click", startGame);

function startGame() {
    
  hideContainers();
    questionContainer.removeAttribute("hidden");
    
    currentQuestion = 0;
    displayQuestion();

    time = questions.length * 10;

    intervalID = setInterval(countdown, 1000);

    displayTime();
}

function countdown() {
    time--;
    displayTime();
    if (time < 1) {
      endGame();
    }
  }

const timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}

//display questions
function displayQuestion() {
    var question = questions[currentQuestion];
    var options = question.options;
  
    var QuestionsElement = document.querySelector("#Quizquestions");
    QuestionsElement.textContent = question.Quizquestions;
  
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      var optionButton = document.querySelector("#option" + i);
      optionButton.textContent = option;
    }
}

//check to see if answer is correct or wrong
document.querySelector("#answer-options").addEventListener("click", checkAnswer);

function optionIsCorrect(optionButton) {
    return optionButton.textContent === questions[currentQuestion].answer;
}

function checkAnswer(eventObject) {
    var optionButton = eventObject.target;
    results.style.display = "block";
    if (optionIsCorrect(optionButton)) {
      resultsText.textContent = "Correct!";
      setTimeout(hideTextResults, 1000);
    } else {
      resultsText.textContent = "Incorrect!";
      setTimeout(hideTextResults, 1000);
      if (time >= 5) {
        time = time - 5;
        displayTime();
      } else {
        time = 0;
        displayTime();
        endGame();
      }
    }
    
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
      } else {
        endGame();
      }
}

// score
const score = document.querySelector("#score");

//end game
function endGame() {
    clearInterval(intervalID);
    hideContainers();
    scoreContainer.removeAttribute("hidden");
    score.textContent = time;
}
  
const submitBtn = document.querySelector("#submit-btn");
const inputElement = document.querySelector("#initials");

submitBtn.addEventListener("click", storeScore);

function storeScore(event) {
    
    event.preventDefault();
  
    if (!inputElement.value) {
      alert("Don't forget to enter your initials before hitting the submit button!");
      return;
    }
  
    var leaderboardItem = {
      initials: inputElement.value,
      score: time,
    };
  
    updateStoredLeaderboard(leaderboardItem);
  
    hideContainers();
    leaderboardContainer.removeAttribute("hidden");
  
    renderLeaderboard();
}

//update leaderboards
function updateStoredLeaderboard(leaderboardItem) {
    var leaderboardArray = getLeaderboard();
    leaderboardArray.push(leaderboardItem);
    localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

function getLeaderboard() {
    var storedLeaderboard = localStorage.getItem("leaderboardArray");
    if (storedLeaderboard !== null) {
      var leaderboardArray = JSON.parse(storedLeaderboard);
      return leaderboardArray;
    } else {
      leaderboardArray = [];
    }
    return leaderboardArray;
}

function renderLeaderboard() {
    var sortedLeaderboardArray = sortLeaderboard();
    const highscoreList = document.querySelector("#highscore-list");
    highscoreList.innerHTML = "";
    for (let i = 0; i < sortedLeaderboardArray.length; i++) {
      var leaderboardEntry = sortedLeaderboardArray[i];
      var newListItem = document.createElement("li");
      newListItem.textContent =
        leaderboardEntry.initials + " - " + leaderboardEntry.score;
      highscoreList.append(newListItem);
    }
}

function sortLeaderboard() {
    var leaderboardArray = getLeaderboard();
    if (!leaderboardArray) {
      return;
    }
  
    leaderboardArray.sort(function (a, b) {
      return b.score - a.score;
    });
    return leaderboardArray;
}

//clear leaderboards
const clearBtn = document.querySelector("#clear-btn");
clearBtn.addEventListener("click", clearHighscores);

function clearHighscores() {
    localStorage.clear();
    renderLeaderboard();
}

//back to main screen
const backBtn = document.querySelector("#back-btn");
backBtn.addEventListener("click", returnToStart);

function returnToStart() {
    hideContainers();
    landingPage.removeAttribute("hidden");
}

const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
  hideContainers();
  leaderboardContainer.removeAttribute("hidden");
  clearInterval(intervalID);
  time = undefined;
  displayTime();
  renderLeaderboard();
}