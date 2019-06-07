$(".jumbotron").css({ height: $(window).height() + "px" });

$(window).on("resize", function() {
  $(".jumbotron").css({ height: $(window).height() + "px" });
});

var timer = 30;

const startClock = () => {
    for (let i = 0; i < 32; i++) {
        setTimeout(function () {
            $("#clock").text(timer);
            if (timer === 0) {
                $("#clock").text("You're out of time!");
                return;
            } else {
                timer--;
            }
        }, 1000 * (i + 1))
    }
};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

const askQuestion = () => {
    $(".receptacle").empty();

    $.ajax({
        url: "https://opentdb.com/api.php?amount=10&category=30&type=multiple",
        method: "GET"
    }).then(function(response) {
        console.log(response);

        let question;
        let cAnswer;
        let iAnswer1;
        let iAnswer2;
        let iAnswer3;

        question = response.results[1].question;
        cAnswer = response.results[1].correct_answer;
        iAnswer1 = response.results[1].incorrect_answers[0];
        iAnswer2 = response.results[1].incorrect_answers[1];
        iAnswer3 = response.results[1].incorrect_answers[2];

        $question = $("<button>").text(question).attr("id", "question").addClass("option");
        $cAnswer = $("<button>").text(cAnswer).attr("id", "cAnswer").addClass("option");
        $iAnswer1 = $("<button>").text(iAnswer1).attr("id", "iAnswer").addClass("option");
        $iAnswer2 = $("<button>").text(iAnswer2).attr("id", "iAnswer").addClass("option");
        $iAnswer3 = $("<button>").text(iAnswer3).attr("id", "iAnswer").addClass("option");

        var options = [$cAnswer, $iAnswer1, $iAnswer2, $iAnswer3];
        console.log(options);
        shuffle(options);
        console.log(options);
        shuffle(options);
        console.log(options);
        shuffle(options);
        console.log(options);
        shuffle(options);
        console.log(options);

        $("#questiondiv").html($question);
        $("#cAnswerdiv").html(options[0]);
        $("#iAnswer1div").html(options[1]);
        $("#iAnswer2div").html(options[2]);   
        $("#iAnswer3div").html(options[3]);

        $(document).on("click", ".option", function(){
            if ($(this).attr("id") === "cAnswer") {
                console.log("true");
            }
            else if ($(this).attr("id") === "iAnswer") {
                console.log("false");
            }
        })

    });
};


        
    // console.log(question);
    // console.log(cAnswer);
    // console.log(iAnswer1);
    // console.log(iAnswer2);
    // console.log(iAnswer3);
    


    // for (let i=0; i < response.results.length; i++) {
    //     question = response.results[i].question;
    //     cAnswer = response.results[i].correct_answer;
    //     iAnswer1 = response.results[i].incorrect_answers[0];
    //     iAnswer2 = response.results[i].incorrect_answers[1];
    //     iAnswer3 = response.results[i].incorrect_answers[2];

    //     populate();
        
    //     console.log(question);
    //     console.log(cAnswer);
    //     console.log(iAnswer1);
    //     console.log(iAnswer2);
    //     console.log(iAnswer3);
    // }
// })
