

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

    function getRoundTime() {
        return roundTimes[round - 1] * 1000
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

    function determineNumberOfPrevPicks(curPick, overAllPick) {
        // $('#roundLabel').text("Round: " + round);
        // $('#pickLabel').text("Pick: " + (pick + 1));
        // $('#overallLabel').text("Overall: " + determineOverall());
        var num = 12 - (curPick + 1);
        num = num + overAllPick;
        num = num / 12;
        return num;
    }
    function updateHistory() {
        //$('#timerHistory').prepend("<div class='row justify-content-md-center'><div class='col-md-4 text-left'><p class='display-4 text-muted'>" + (managers[determinePick()]) + "</p></div> <div class='col-md-4 text-right'><p class='display-4 text-muted'>" + (timeFormat(timeAlotted - time)) + "</p></div></div>");
        var currentPick = determinePick();
        var pickToPass = pick;
        var overAllPick = determineOverall();
        var timeUsed = timeFormat(getRoundTime() - time);
        if ($("#timerHistory").children().length > 5) {
            transitionHistory();
        }
        setTimeout(function () {
            console.log(managers[currentPick] + "has picked " + determineNumberOfPrevPicks(pickToPass, overAllPick) + " picks so far.");
            console.log(determinePick());
            $("<div class='row justify-content-md-center'><div class='col-md-6 text-left'><p class='display-4 text-muted'>" + (managers[currentPick]) + "</p></div> <div class='col-md-6 text-right'><p class='display-4 text-muted'>" + timeUsed + "</p></div></div>").hide().prependTo('#timerHistory').fadeIn(375);
            if (round == 1) {
                $('#averageTime' + currentPick).html(timeUsed);
            }
            else {
                $('#averageTime' + currentPick).html(timeFormat(findAverageTime(currentPick, timeUnformat(timeUsed), determineNumberOfPrevPicks(pickToPass, overAllPick))));
                removeMarkersForTimes();
                $('#averageLI' + findSlowest()).addClass('list-group-item-danger');
                $('#averageLI' + findFastest()).addClass('list-group-item-success');
            }
        }, 375);


    }

    function delta() {
        var now = Date.now();
        var timePassed = now - offset;
        offset = now;
        return timePassed;
    }

    function removeMarkersForTimes() {
        for (var i = 0; i < managers.length; i++) {
            $('#averageLI' + i).removeClass('list-group-item-danger');
            $('#averageLI' + i).removeClass('list-group-item-success');
        }
    }
    function findAverageTime(curPick, newTime, numPicks) {
        console.log(newTime);
        var curAvg = timeUnformat($('#averageTime' + curPick).html());
        console.log(curAvg);
        var total = curAvg * (numPicks - 1);
        var newAvg = (total + newTime) / (numPicks);
        console.log(newAvg);
        return newAvg;
    }

    function findSlowest() {
        var slowestManager;
        var slowestManagerTime = 0
        for (var i = 0; i < managers.length; i++) {
            if (timeUnformat($('#averageTime' + i).html()) > slowestManagerTime) {
                slowestManagerTime = timeUnformat($('#averageTime' + i).html());
                slowestManager = i;
            }
        }
        return slowestManager;
    }

    function findFastest() {
        var fastestManager = findSlowest();
        var fastestManagerTime = timeUnformat($('#averageTime' + findSlowest()).html());
        for (var i = 0; i < managers.length; i++) {
            if (timeUnformat($('#averageTime' + i).html()) < fastestManagerTime) {
                fastestManagerTime = timeUnformat($('#averageTime' + i).html());
                fastestManager = i;
            }
        }
        return fastestManager;
    }
    function timeUnformat(timeString) {
        console.log(timeString);
        var timeInMilliseconds = 0;
        var min = timeString.substring(0, 2);
        var sec = timeString.substring(5, 7);
        var mil = timeString.substring(10, 14);
        timeInMilliseconds = parseInt(min * 60000) + parseInt(sec * 1000) + parseInt(mil);
        console.log(timeInMilliseconds);
        return timeInMilliseconds;
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
        if (determineOverall() > (12 * (roundTimes.length))-1) {
            $("#timer").removeClass("confirm_selection");
            this.stop();
            $('#timer').html('-- : -- : ---');
            $('#manager').html('Draft Complete.');
        }
        else {
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
        }
    };

    this.manageTopStatus = function () {
        $('#roundLabel').text("Round: " + round);
        $('#pickLabel').text("Pick: " + (pick + 1));
        $('#overallLabel').text("Overall: " + determineOverall());
    }

    function determineOverall() {
        return ((round - 1) * 12) + pick + 1;
    }

    function transitionStep1() {
        if (transStep != 0) {
            clearTimeout(currentSwap);
        }
        transStep = 1;
        $("#pickingDisplay").fadeOut(200);
        $("#manager").fadeOut(200);
        currentSwap = setTimeout(function () {
            transStep = 0;
            transitionStep2();
        }, 200);
    }

    function transitionStep2() {
        transStep = 2;
        $("#manager").removeClass("h3");
        $("#managerCol").removeClass("mt-4");
        $("#manager").addClass("h1");
        $("#managerCol").addClass("mt-3");
        $('#manager').html("<strong>" + (managers[determinePick()]) + "</strong> is on the clock.");
        $("#manager").fadeIn(200);
        currentSwap = setTimeout(function () {
            transStep = 0;
            transitionStep3();
        }, 200);
    }

    function transitionStep3() {
        transStep = 3;
        currentSwap = setTimeout(function () {
            transStep = 0;
            transitionStep4();
        }, 5000);
    }
    function transitionStep4() {
        transStep = 4;
        $("#manager").fadeOut(700);
        $("#pickingDisplay").text(managers[determinePick()]);
        $("#pickingDisplay").fadeIn(700);
        currentSwap = setTimeout(function () {
            transStep = 0;
            transitionStep5();
        }, 900);
    }

    function transitionStep5() {
        transStep = 5;
        $("#manager").text(getFact());
        $("#manager").removeClass("h1");
        $("#managerCol").removeClass("mt-3");
        $("#manager").addClass("h3");
        $("#managerCol").addClass("mt-4");
        $("#manager").fadeIn(600);
        currentSwap = setTimeout(function () {
            transStep = 0;
        }, 600);
    }

    function transitionHistory() {
        $('#timerHistory').children().last().fadeOut(375);
        setTimeout(function () {
            $('#timerHistory').children().last().remove();
        }, 375);
    }

    function getFact() {
        var num = (Math.random() * this.factsArray[determinePick()].length) - 1;
        return factsArray[determinePick()][Math.round(Math.abs(num))];
    }



}