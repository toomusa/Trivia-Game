
// dynamic background adjusts with browser window size

$(".jumbotron").css({ height: $(window).height() + "px" });

$(window).on("resize", function() {
  $(".jumbotron").css({ height: $(window).height() + "px" });
});

//declare global variables

let rightPicks = 0;
let wrongPicks = 0;
let questionsAsked = 0;
var timer = 30;
var intervalId;
const timeScore = [];
let timeAvgTotal = 0;
let category = "";
let difficulty = "";
let question = "";
let cAnswer = "";
let iAnswer1 = "";
let iAnswer2 = "";
let iAnswer3 = "";
let $question = "";
let $cAnswer = "";
let $iAnswer1 = "";
let $iAnswer2 = "";
let $iAnswer3 = "";
var options = [];
var quizObject = {};
let giphySearch = "";
let categorySelect = false;
let difficultySelect = false;
let resetState = false;

$("#game-results").hide();
$("#game-giphy").hide();
$("#game-trivia").hide();
$("#text-box").text("Choose a Category and Difficulty");

// timer functions

function startClock() {
    timer = 30;
    clearInterval(intervalId);
    intervalId = setInterval(decrement, 1000);
}

function decrement() {
    timer--;
    $("#clock").text(timer);
    if (timer === 0) {
        stopClock();
        $("#clock").text("0");
        $("#text-box").html(`You ran out of time! The correct answer was: <span style='color: green'>${cAnswer}</span>`);
        giphyCue();
        setTimeout(askQuestion, 5000);
    }
}

function stopClock() {
    clearInterval(intervalId);
}

// Fisher-Yates shuffle for randomizing order of multiple choice options

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

// game start, reset, and restart functions

$(document).on("click", "#start-game", function() {
    if (categorySelect === true && difficultySelect === true) {
        resetState = false;
        $("#category1").addClass("unable");
        $("#category2").addClass("unable");
        $("#category3").addClass("unable");
        $("#diff-easy").addClass("unable");
        $("#diff-medium").addClass("unable");
        $("#diff-hard").addClass("unable");
        askQuestion();
        startClock();
        setTimeout(function() {
            $("#start-game").attr("id", "reset-game").text("Reset Game");
        }, 200);
    } else if (categorySelect === false && difficultySelect === false) {
        $("#text-box").text("First Choose a Category and Difficulty");
    } else if (categorySelect === false && difficultySelect === true) {
        $("#text-box").text("First Choose a Category");
    } else if (categorySelect === true && difficultySelect === false) {
        $("#text-box").text("First Choose a Difficulty");
    } else {};
}) 

$(document).on("click", "#reset-game", function() {
    gameReset();
    resetState = true;
    $("#game-trivia").hide();
    $("#game-giphy").hide();
    $("#giphy-home").hide();
    $("#reset-game").attr("id", "restart-game").text("Restart Game");
}) 

$(document).on("click", "#restart-game", function() {
    if (categorySelect === true && difficultySelect === true) {
        $("#right-picks").text("0");
        $("#wrong-picks").text("0");
        $("#restart-game").attr("id", "reset-game").text("Reset Game");
        resetState = false;
        questionsAsked = 0;
        $("#category1").addClass("unable");
        $("#category2").addClass("unable");
        $("#category3").addClass("unable");
        $("#diff-easy").addClass("unable");
        $("#diff-medium").addClass("unable");
        $("#diff-hard").addClass("unable");
        $("#game-results").hide();
        askQuestion();
        startClock();
    } else if (categorySelect === false && difficultySelect === false) {
        $("#text-box").text("First Choose a Category and Difficulty");
    } else if (categorySelect === false && difficultySelect === true) {
        $("#text-box").text("First Choose a Category");
    } else if (categorySelect === true && difficultySelect === false) {
        $("#text-box").text("First Choose a Difficulty");
    } else {};
}) 

// category and difficulty toggle buttons

$(document).on("click", "#category1", function() {
    category = "27";
    $(this).removeClass("btn-secondary").addClass("btn-dark active");
    if ($("#category2").hasClass("btn-dark active")) {
        $("#category2").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#category3").hasClass("btn-dark active")) {
        $("#category3").removeClass("btn-dark active").addClass("btn-secondary");
    }
    categorySelect = true;
})

$(document).on("click", "#category2", function() {
    category = "26";
    $(this).removeClass("btn-secondary").addClass("btn-dark active");
    if ($("#category1").hasClass("btn-dark active")) {
        $("#category1").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#category3").hasClass("btn-dark active")) {
        $("#category3").removeClass("btn-dark active").addClass("btn-secondary");
    }
    categorySelect = true;
})

$(document).on("click", "#category3", function() {
    category = "21";
    $(this).removeClass("btn-secondary").addClass("btn-dark active");
    if ($("#category1").hasClass("btn-dark active")) {
        $("#category1").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#category2").hasClass("btn-dark active")) {
        $("#category2").removeClass("btn-dark active").addClass("btn-secondary");
    }
    categorySelect = true;
})

$(document).on("click", "#diff-easy", function() {
    difficulty = "easy";
    $(this).removeClass("btn-secondary").addClass("btn-dark active");
    if ($("#diff-medium").hasClass("btn-dark active")) {
        $("#diff-medium").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#diff-hard").hasClass("btn-dark active")) {
        $("#diff-hard").removeClass("btn-dark active").addClass("btn-secondary");
    }
    difficultySelect = true;
})

$(document).on("click", "#diff-medium", function() {
    difficulty = "medium";
    $(this).removeClass("btn-secondary").addClass("btn-dark active");
    if ($("#diff-easy").hasClass("btn-dark active")) {
        $("#diff-easy").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#diff-hard").hasClass("btn-dark active")) {
        $("#diff-hard").removeClass("btn-dark active").addClass("btn-secondary");
    }
    difficultySelect = true;
})

$(document).on("click", "#diff-hard", function() {
    difficulty = "hard";
    $(this).removeClass("btn-secondary").addClass("btn-dark active");
    if ($("#diff-easy").hasClass("btn-dark active")) {
        $("#diff-easy").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#diff-medium").hasClass("btn-dark active")) {
        $("#diff-medium").removeClass("btn-dark active").addClass("btn-secondary");
    }
    difficultySelect = true;
})

// giphy api call finds a giphy that's generated by the correct answer

const giphyCue = () => {

    if (resetState === true) {
        return;
    } else {
        giphySearch = cAnswer;
        var queryURL = `https://api.giphy.com/v1/gifs/search?q=${giphySearch}&limit=5&api_key=WQeGcqgEdYHR6ekiScLHg7XbYTpLdhHm`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);  

            $("#game-trivia").hide();
            $("#game-giphy").show();
            $("#giphy-home").show();

            var i = Math.floor(Math.random() * response.data.length);

            var $giphyWrite = $("<img>").attr("src", response.data[i].images.fixed_height.url);
            $giphyWrite.attr("style", "max-width: 525px");
            $("#giphy-home").html($giphyWrite);
        });
    }
}

// open-trivia api call populates game-trivia field with question and answers

const askQuestion = () => {

    if (resetState === true) {
        return;
    } else {

        $.ajax({
            url: `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`,
            method: "GET"
        }).then(function(response) {
            console.log(response)

            question = "";
            cAnswer = "";
            iAnswer1 = "";
            iAnswer2 = "";
            iAnswer3 = "";
            $question = "";
            $cAnswer = "";
            $iAnswer1 = "";
            $iAnswer2 = "";
            $iAnswer3 = "";
            options = [];

            quizObject = {...response};

            var i = Math.floor(Math.random() * 10);

            question = response.results[i].question;
            cAnswer = response.results[i].correct_answer;
            iAnswer1 = response.results[i].incorrect_answers[0];
            iAnswer2 = response.results[i].incorrect_answers[1];
            iAnswer3 = response.results[i].incorrect_answers[2];
        
            $("#game-trivia").show();
            $("#giphy-home").empty().hide();
            $("#game-giphy").hide();
            $("#text-box").text("");

            $question = $("<span>").html(question).attr("id", "question");
            $cAnswer = $("<span>").html(cAnswer).attr("id", "cAnswer");
            $iAnswer1 = $("<span>").html(iAnswer1).attr("id", "iAnswer");
            $iAnswer2 = $("<span>").html(iAnswer2).attr("id", "iAnswer");
            $iAnswer3 = $("<span>").html(iAnswer3).attr("id", "iAnswer");

            options = [$cAnswer, $iAnswer1, $iAnswer2, $iAnswer3];
            shuffle(options);

            $("#questionDiv").html($question);
            $("#answerDiv1").html(options[0]);
            $("#answerDiv2").html(options[1]);
            $("#answerDiv3").html(options[2]);   
            $("#answerDiv4").html(options[3]);

            questionsAsked++;
            startClock();
        });
    }
};

// listens for when a multiple choice answer is clicked 

$(document).on("click", ".option", function(){
    if ($(this).children().children().attr("id") === "cAnswer") {
        rightPicks++;                
        console.log("true");
        $("#text-box").html(`That's right! The correct answer is: <span style='color: green'>${cAnswer}</span>`);
        choiceMade();
    }
    else if ($(this).children().children().attr("id") === "iAnswer") {
        wrongPicks++;
        console.log("false");
        let wrongGuess = $(this).text();
        $("#text-box").html(`Nope! You chose <span style='color: red'>${wrongGuess}</span> <br> The correct answer is: <span style='color: green'>${cAnswer}</span>`);
        choiceMade();
    }
})

// resets game variables and print fields

const gameReset = () => {
    category = "";
    categorySelect = false;
    difficulty = "";
    difficultySelect = false;
    stopClock();
    $("#clock").text("");
    $("#category1").removeClass("unable");
    $("#category2").removeClass("unable");
    $("#category3").removeClass("unable");
    $("#diff-easy").removeClass("unable");
    $("#diff-medium").removeClass("unable");
    $("#diff-hard").removeClass("unable");
    $("#reset-game").attr("id", "restart-game").text("Restart Game");
    if ($("#category1").hasClass("btn-dark active")) {
        $("#category1").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#category2").hasClass("btn-dark active")) {
        $("#category2").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#category3").hasClass("btn-dark active")) {
        $("#category3").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#diff-easy").hasClass("btn-dark active")) {
        $("#diff-easy").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#diff-medium").hasClass("btn-dark active")) {
        $("#diff-medium").removeClass("btn-dark active").addClass("btn-secondary");
    }
    if ($("#diff-hard").hasClass("btn-dark active")) {
        $("#diff-hard").removeClass("btn-dark active").addClass("btn-secondary");
    }
}

// fires when an answer selection is made

const choiceMade = () => {
    $("#right-picks").html(rightPicks);
    $("#wrong-picks").html(wrongPicks);
    $(".receptacle").empty();
    var currentTime = $("#clock").text();
    currentTime = 30 - currentTime;
    timeScore.push(currentTime);
    stopClock();
    giphyCue();
    if (questionsAsked === 10) {
        setTimeout(function() {
            if (rightPicks > wrongPicks) {
                cAnswer = "You Win";
                $("#game-results").show();
                gameReset();
                timeScoreAvg();
                giphyCue();
                $("#text-box").text("You Won! Choose a Category and Difficulty to Restart Game.");
            } else if (rightPicks < wrongPicks) {
                cAnswer = "You Lose";    
                $("#game-results").show();        
                gameReset();
                timeScoreAvg();
                giphyCue();
                $("#text-box").text("You Lost! Choose a Category and Difficulty to Restart Game.");
            } else if ( rightPicks === wrongPicks) {
                cAnswer = "You Tied";
                $("#game-results").show();
                gameReset();
                timeScoreAvg();
                giphyCue();
                $("#text-box").text("You Tied! Choose a Category and Difficulty to Restart Game.");
            } else {};
        }, 5000)
    } else {
        setTimeout(askQuestion, 5000);
    }
}

// calculates player's average response time

const timeScoreAvg = () => {
    for (let i = 0; i < timeScore.length; i++) {
        timeAvgTotal += timeScore[i];
    }
    $timeAvgTotal = timeAvgTotal / timeScore.length;
    $("#response-time").html(`Average Response Time: ${$timeAvgTotal.toFixed(1)} seconds`);
    $("#response-score").html(`You got ${rightPicks} out of ${questionsAsked} correct`);
}