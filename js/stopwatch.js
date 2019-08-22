

function StopWatch(
    timeAlotted,
    managers,
    factsArray,
    roundTimes
    ) {
    var time;
    var interval;
    var offset;
    this.isOn = false;
    var round = 1;
    var pick = 0;
    var currentSwap;
    var transStep = 0;

    function determinePick() {
        if ((round % 2) == 0) {
            return 11 - pick;
        }
        else {
            return pick;
        }
    }

    function getRoundTime(){
        return roundTimes[round-1] * 1000
    }
    function update() {
        if (this.isOn) {
            time -= delta();
        }
        if (time < 30000 && !$("#timer").hasClass("confirm_selection")) {
            $("#timer").addClass("confirm_selection");
        }
        if (time < 1) {

            time = 0;

            this.stop();

        }
        var formattedTime = timeFormat(time);
        $('#timer').text(formattedTime);
    }

    function updateHistory() {
        //$('#timerHistory').prepend("<div class='row justify-content-md-center'><div class='col-md-4 text-left'><p class='display-4 text-muted'>" + (managers[determinePick()]) + "</p></div> <div class='col-md-4 text-right'><p class='display-4 text-muted'>" + (timeFormat(timeAlotted - time)) + "</p></div></div>");
        var currentPick = determinePick();
        var timeUsed = timeFormat(getRoundTime() - time);
        if($("#timerHistory").children().length > 4)
        {
            transitionHistory();
        }
        setTimeout(function(){
            $("<div class='row justify-content-md-center'><div class='col-md-4 text-left'><p class='display-4 text-muted'>" + (managers[currentPick]) + "</p></div> <div class='col-md-4 text-right'><p class='display-4 text-muted'>" + timeUsed + "</p></div></div>").hide().prependTo('#timerHistory').fadeIn(375);
        },375);
        
        
    }

    function delta() {
        var now = Date.now();
        var timePassed = now - offset;
        offset = now;
        return timePassed;
    }

    function timeFormat(timeInMilli) {
        var time = new Date(timeInMilli);
        var minutes = time.getMinutes().toString();
        var seconds = time.getSeconds().toString();
        var milli = time.getMilliseconds().toString();

        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }

        if (seconds.length < 2) {
            seconds = '0' + seconds;
        }

        while (milli.length < 3) {
            milli = '0' + milli;
        }

        return minutes + ' : ' + seconds + ' . ' + milli;
    }

    this.start = function () {
        time = getRoundTime();
        transitionStep1();
        this.manageTopStatus();
        if (!this.isOn) {
            interval = setInterval(update.bind(this), 10);
            offset = Date.now();
            this.isOn = true;
        }
    };

    this.stop = function () {
        if (this.isOn) {
            clearInterval(interval);
            interval = null;
            this.isOn = false;
        }
    };

    this.reset = function () {
        $("#timer").removeClass("confirm_selection");
        if (round > 1 || pick > 0 || this.isOn) {
            updateHistory();
            pick++;
        }
        if (pick == 12) {
            pick = 0;
            round++;
        }
        time = getRoundTime();
        update();
        if (!this.isOn) {
            this.start();
        }
        this.manageTopStatus();
        transitionStep1();
    };

    this.manageTopStatus = function (){
        $('#roundLabel').text("Round: " + round);
        $('#pickLabel').text("Pick: " + (pick + 1));
        $('#overallLabel').text("Overall: " + this.determineOverall());
    }

    this.determineOverall = function () {
        return ((round - 1) * 12) + pick + 1;
    }

    function transitionStep1(){
        if(transStep != 0){
            clearTimeout(currentSwap);
        }
        transStep = 1;
        $("#pickingDisplay").fadeOut(200);
        $("#manager").fadeOut(200);
        currentSwap = setTimeout(function(){
            transStep = 0;
            transitionStep2();
        }, 200);
    }

    function transitionStep2(){
        transStep = 2;
        $("#manager").removeClass("h3");
        $("#managerCol").removeClass("mt-4");
        $("#manager").addClass("h1");
        $("#managerCol").addClass("mt-3");
        $('#manager').html("<strong>" + (managers[determinePick()]) + "</strong> is on the clock.");
        $("#manager").fadeIn(200);
        currentSwap = setTimeout(function(){
            transStep = 0;
            transitionStep3();
        },200);
    }

    function transitionStep3(){
        transStep = 3;
        currentSwap = setTimeout(function(){
            transStep = 0;
            transitionStep4();
        }, 5000);
    }
    function transitionStep4(){
        transStep = 4;
        $("#manager").fadeOut(700);
        $("#pickingDisplay").text(managers[determinePick()]);
        $("#pickingDisplay").fadeIn(700);
        currentSwap = setTimeout(function(){
            transStep = 0;
            transitionStep5();
        }, 900);
    }

    function transitionStep5(){
        transStep = 5;
        $("#manager").text(getFact());
        $("#manager").removeClass("h1");
        $("#managerCol").removeClass("mt-3");
        $("#manager").addClass("h3");
        $("#managerCol").addClass("mt-4");
        $("#manager").fadeIn(600);
        currentSwap = setTimeout(function(){
            transStep = 0;
        }, 600);
    }

    function transitionHistory(){
        $('#timerHistory').children().last().fadeOut(375);
        setTimeout(function(){
            $('#timerHistory').children().last().remove();
        },375);
    }

    function getFact(){
        var num = (Math.random() * this.factsArray[determinePick()].length) - 1;
        return factsArray[determinePick()][Math.round(Math.abs(num))];
    }

  

}