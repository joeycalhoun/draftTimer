var timer = document.getElementById('timer');
//var toggleBtn = document.getElementById('toggle');
var resetBtn = document.getElementById('reset');
var timerHistory = document.getElementById('timerHistory');
//var clearBtn = document.getElementById('clear');
var manager = document.getElementById("manager");
var roundLabel = document.getElementById("roundLabel");
var pickLabel = document.getElementById("pickLabel");
var overallLabel = document.getElementById("overallLabel");
var timeAlotted = 120000;
var managers1 = ["", "", "", "", "", "", "", "", "", "", "", ""];
var managers = ["AJ", "Mike", "Joey", "Matt", "Dustin", "Jeremy", "Domingo", "Alex", "Jason", "Kyle", "Jordan", "Zack"];
var rawFacts;
var factsArray;
var configMenuOpen = false;
var configComplete = false;
var self = this;
var roundTimes = [];
// var newRow ="<div class='row'>"
//                         +"<div class='col-12'>"
//                             +"<div class='input-group mb-3'>"
//                                 +"<div class='input-group-prepend'>"
//                                     +"<span class='input-group-text' id='basic-addon1'>&nbspRound "+(i+1)+"&nbsp</span>"
//                                 +"</div>"
//                                 +"<input type='text' class='form-control' placeholder='Name' aria-label='Username'"
//                                     +"aria-describedby='basic-addon1' id='round1'>"
//                             +"</div>"
//                         +"</div>"
//                     +"</div>";

var watch;

/* clearBtn.addEventListener('click', function(){
    watch.reset();
    timerHistory.textContent = "";
});
toggleBtn.addEventListener('click', function(){
    if(watch.isOn){
        watch.stop();
        toggleBtn.textContent = 'Start';
    }
    else{
        watch.start();
        toggleBtn.textContent = 'Stop';
    }
 }); */

$('#reset').click(function () {
    //fillTeams();
    //fillFacts(rawFacts);
    if (watch.isOn || resetBtn.textContent == "Start Draft") {
        if(resetBtn.textContent == "Start Draft")
        {
            fillAverages(0);
        }
        resetBtn.textContent = 'Next Pick';
    }
    else {
        resetBtn.textContent = 'Resume Draft';
    }
    watch.reset();
});

function fillAverages(iteration){
    
        setTimeout(function(){
            $("<li class='list-group-item'><span class='text-left'>"+managers[iteration]+" </span><span class='text-right' id='averageTime"+iteration+"'>00 : 00 : 000</span></li>").hide().appendTo('#right-side').fadeIn(375);
            if(iteration < managers.length-1){
                fillAverages(iteration+1);
            }
        },200);  
}
// resetBtn.addEventListener('click', function () {
//     //fillTeams();
//     fillFacts(rawFacts);
//     if (watch.isOn || resetBtn.textContent == "Start Draft") {
//         resetBtn.textContent = 'Next Pick';
//     }
//     else {
//         resetBtn.textContent = 'Resume Draft';
//     }
//     watch.reset();
// });

var fillTeams = function () {
    for (var i = 0; i < 12; i++) {
        managers[i] = document.getElementById("team" + ((i + 1).toString())).value;
    }
};

function fillRoundTimes(){
    var isUniform;
    var uniformTime;
    if ($('input:radio[name="roundTimeOptions"]:checked').val() == 'rbUniformTimes'){
        isUniform = true;
        uniformTime = $('#txtTimePerPick').val().toString();
    }
    else{
        isUniform = false;
    }
    console.log(isUniform);
    for(var i = 0; i < $('#txtNumRounds').val().toString(); i++){
        if(isUniform){
            roundTimes.push(uniformTime);
        }
        else{
            console.log("doing custom");
            roundTimes.push($('#round'+(i+1)+'').val());
        }
    }
    console.log(roundTimes);
    //roundTimes.push($('#txtNumRounds').val().toString());
}
function fillFacts(myFacts) {
    factsArray = new Array(managers.length);
    var pairs = myFacts.split('\n');
    for (var i = 0; i < pairs.length; i++) {
        pairs[i] = pairs[i].split(',');
        for (var j = 0; j < managers.length; j++) {
            if (pairs[i][0].toUpperCase() == managers[j].toUpperCase()) {
                if (factsArray[j] == null) {
                    factsArray[j] = new Array(1);
                    factsArray[j][0] = pairs[i][1];
                }
                else {
                    var depth = factsArray[j].length;
                    factsArray[j][depth] = pairs[i][1];
                }
            }
        }
    }
    console.log("Facts Loaded Successfully");
}

function fillRightSide(){
    for(var i = 0; i < 3; i++){
        $('#right-side').append("<li class='list-group-item'>"+managers[i]+" - 02 : 02 : 000</li>");
    }
}
$("#apply").click(function () {
    fillRoundTimes();
    //fillRightSide();
    setTimeout(function () {
        if (checkAllComplete()) {
            watch = new StopWatch(
                timeAlotted,
                managers,
                factsArray,
                roundTimes
            );
            console.log("Created Watch Successfully")
            configComplete = true;
        }
    }, 500);
});

$("#configMenu").click(function () {
    if (configMenuOpen && configComplete) {
        $("#reset").prop('disabled', false);
    }
    else {
        $("#reset").prop('disabled', true);
    }
    configMenuOpen = !configMenuOpen;
});

// var gatherData = function(callback){
//     readFactsFile();
//     callback();
// }
// var constructWatch = function(){
//     watch = new StopWatch(
//         timeAlotted,
//         managers,
//         factsArray
//     );
//     console.log("constructed watch");
//     console.log("constructed watch 2");
//}

$("#inputGroupFile04").change(function(){
    console.log("File Imported");
    readFactsFile();
    $("#fileLabel").html($("#inputGroupFile04").val().toString());
});
function readFactsFile() {
    var fileInput = $("#inputGroupFile04")[0];
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function (e) {
            fillFacts(reader.result);
        }

        reader.readAsText(file);
    } else {
        fileDisplayArea.innerText = "File not supported!"
    }
}

$("#applyFacts").click(function () {
    var fileInput = $("#inputGroupFile04")[0];
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function (e) {
            rawFacts = reader.result;
        }

        reader.readAsText(file);
    } else {
        fileDisplayArea.innerText = "File not supported!"
    }
});

function createRoundTimeTextBoxes(numOfRounds) {
    var newRow = "<div class='row'>"
        + "<div class='col-12'>"
        + "<div class='input-group mb-3'>"
        + "<div class='input-group-prepend'>"
        + "<span class='input-group-text' id='basic-addon1'>&nbspRound " + (i + 1) + "&nbsp</span>"
        + "</div>"
        + "<input type='text' class='form-control' placeholder='Name' aria-label='Username'"
        + "aria-describedby='basic-addon1' id='round"+(i+1)+"'>"
        + "</div>"
        + "</div>"
        + "</div>";

    for (var i = 0; i < numOfRounds; i++) {

        var newRow = "<div class='row'>"
            + "<div class='col-12'>"
            + "<div class='input-group mb-3'>"
            + "<div class='input-group-prepend'>"
            + "<span class='input-group-text' id='basic-addon1'>&nbspRound " + (i + 1) + "&nbsp</span>"
            + "</div>"
            + "<input type='text' class='form-control' placeholder='Time In Seconds' aria-label='Username'"
            + "aria-describedby='basic-addon1' id='round"+(i+1)+"'>"
            + "</div>"
            + "</div>"
            + "</div>";
        if (i < 6) {
            $(newRow).appendTo('#column1');
        }
        else if (i >= 6 && i < 12) {
            $(newRow).appendTo('#column2');
        }
        else if (i >= 12 && i < 18) {
            $(newRow).appendTo('#column3');
        }
        else {

        }
        // if(i == (numOfRounds-1)){
        //     console.log("i is "+i+" and I am newRow + end column");
        //     $(beginRow+newRow+endRow+endColumn).appendTo('#customRoundTimesWrapper');
        // }
        // else if(i == 0){
        //     console.log("i is "+i+" and I am beginColumn + newRow");
        //     $(beginColumn+beginRow+newRow+endRow).appendTo('#customRoundTimesWrapper');
        // }
        // else if((i%6) == 0){
        //     console.log("i is "+i+" and I am endColumn + newRow");
        //     $(endColumn+beginColumn+beginRow+newRow+endRow).appendTo('#customRoundTimesWrapper');
        // }
        // else{
        //     console.log("i is "+i+" and I am newRow");
        //     $(beginRow+newRow+endRow).appendTo('#customRoundTimesWrapper');
        // }

    }
}
console.log($('input:radio[name="roundTimeOptions"]:checked').val());

$('input:radio[name="roundTimeOptions"]').change(function () {
    if ($(this).val() == 'rbUniformTimes') {
        console.log("Uniform");
        $("#txtTimePerPick").prop("disabled", false);
    }
    else {
        console.log("Custom");
        if(checkRoundsSet()){
            $("#txtTimePerPick").html('');
            $("#txtTimePerPick").prop("disabled", true);
            $('#rbCustomTimes').popover('disable');
             createRoundTimeTextBoxes($('#txtNumRounds').val());
        }
        else{
            $('#rbCustomTimes').popover('enable');
            $('#rbCustomTimes').attr('data-content', 'The number of Rounds has not been set yet!');
            $('#rbCustomTimes').popover('show');
        }
    }
});


function checkAllComplete() {
    console.log('checkAllComplete()');
    if (checkNamesComplete() && checkFileImported() && checkTimeSet()) {
        console.log('checkAllComplete = True');
        return true;
    }
    else {
        console.log('checkAllComplete = False');
        return false;
    }
}
function checkNamesComplete() {
    console.log('checkNamesComplete()');
    var finished = true;
    for (var i = 0; i < 12; i++) {
        if ($('#team' + (i + 1)).val() == '') {
            finished = false;
        }
    }
    return finished;
}
function checkFileImported() {
    console.log('checkFileImported()');
    if (factsArray != null) {
        return true;
    }
    else {
        return false;
    }
}
function checkTimeSet() {
    console.log('checkTimeSet()');
    if ($('input:radio[name="roundTimeOptions"]:checked').val() == 'rbUniformTimes') {
        console.log("Uniform");
        if($('#txtTimePerPick').val() == null || $('#txtTimePerPick').val() == ''){
            return false;
        }
        else{
            return true;
        }
    }
    else {
        for(var i = 0; i < $('#txtNumRounds').val(); i++){
            if($('#round'+(i+1)).val() == null || $('#round'+(i+1)).val() == ''){
                return false;
            }
        }
        return true;
    }
}

function checkRoundsSet(){
    if(!verifyInputNumerical('#txtNumRounds')){ //'#txtNumRounds').val() == null || $('#txtNumRounds').val() == ''
        return false;
    }
    else{
        return true;
    }
}

function verifyInputNumerical(inputElement){

    var isValid = /^\d+$/.test($(''+inputElement+'').val());
    applyValidationClass(inputElement, isValid);
    return isValid;
}

function applyValidationClass(inputToMark, isValid){
    if(isValid){
        console.log("is Valid");
        $(''+inputToMark+'').addClass('is-valid');
    }
    else{
        console.log("isnt Valid");
        $(''+inputToMark+'').addClass('is-invalid');
    }
}

function checkIfDocIsValid(){
    $('*').each(function(index){
        if($(this).hasClass('is-invalid')){
            return false;
        }
    });
    return true;
}


$('#rbCustomTimes').popover({
    trigger: 'focus'
  });


