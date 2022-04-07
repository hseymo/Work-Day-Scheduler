var today = $("#currentDay")
var container = $(".container")
var rows = $(".time-block")
var hours = $(".hour");
var textareaInputs = $('textarea');
var saveButtons = $('.saveBtn'); 
var header = $('.jumbotron')

let currentDate = moment().format("dddd, MMMM Do, YYYY");
let currentHour = moment().format("HH");
let currentMil = currentHour + '00';
let itemDate;
let itemTime;
let currentTextareaInput;
let currentAddition;
let schedule;

pageLoad();

function pageLoad() {
    displayDate();
    updateToday()
    pastPresentFuture();
    // check for updated time every 30 seconds
    setInterval(pastPresentFuture, 30000);
}   

function displayDate () {
    $('#currentDay').text(currentDate);
}

function updateToday () {
    //  pull schedule from local storage the schedule for the day
    downloadSchedule();
    //  for each object in our schedule array, we need to publish to the page if it's on today's agenda
    for (let i=0; i<schedule.length; i++) {
    // check each element to see if the object's date matches today's date
        if (currentDate == schedule[i].date) {
    // identify row (parent) on page with id matching schedule[i].time
            var matchedRow = $('#' + schedule[i].time);
            var matchedTextarea = matchedRow.children().eq(1);
            // use .text() method to add textera input at parent[1]
            matchedTextarea.text(schedule[i].task)
            }
    }
}


// listen for clicks on entire container
container.on("click", function(event) {
    event.preventDefault();
    var selectedEl = event.target;
    var parent = $(event.target).parent();
    var parentTime = parent.children().eq(0);
    var parentTextareaInput = parent.children().eq(1)
// find out what was clicked and check if it was a save button
    if (selectedEl.matches("button")) {
// if it matches the element type
// identify todays date and save to variable
        itemDate = today[0].innerHTML;
// identify selected hour and sve to variable
        itemTime = parentTime[0].innerHTML;
// identify textarea input and save to variable
        currentTextareaInput = parentTextareaInput[0].value.trim();
        currentAddition = {
            date: itemDate,
            time: itemTime,
            task: currentTextareaInput
        };
        downloadSchedule();
        schedule.push(currentAddition);
        localStorage.setItem("storedSchedulerActivities", JSON.stringify(schedule));

// notify it was saved
        var notification = $('<p>');
        notification.text('✅ Appointment added to local storage! ✅');
        notification.addClass('.lead');
        notification.addClass('.notification')
        header.append(notification);
// turn off notification after 5 seconds
        setTimeout(function() {
        notification.text('');
        header.append(notification);
        }, 5000)
    }
})

function downloadSchedule() {
// pull schedule from local storage and save to variable array
    var storedSchedule = JSON.parse(localStorage.getItem("storedSchedulerActivities"));
    if (storedSchedule !== null) {
// push current addition to schedule and save to local storage
        schedule = storedSchedule;
        return schedule;
    } else {
        schedule = [];
        return schedule;
    }
}

function pastPresentFuture() {
    // for each timeblock
    $('.time-block').each(function () { 
        // myhour is the id of the row
        var myHour = $(this).attr('id');
        // if current time (from moment) is greater than myhour, it is in the past
        if(currentMil > myHour){
            // select timeblock using this selector then traverse to the 1st child which is the textarea; add class
            $(this).children().eq(1).addClass('past');
        }else if(currentMil == myHour){
            // check for current hour
            $(this).children().eq(1).removeClass('past');
            $(this).children().eq(1).addClass('present');
        } else {
            // otherwise future. remove old classes each time.
            $(this).children().eq(1).removeClass('past');
            $(this).children().eq(1).removeClass('present');
            $(this).children().eq(1).addClass('future');
        }
    })
}