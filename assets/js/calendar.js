
// State
var day = new Date();
var calendar = new Object();
calendar.month = day.getMonth();
calendar.year = day.getFullYear();
calendar.monthLimit = 12;
calendar.current = 0;
calendar.events = [
    {dayEntry: {day: 16, month: 8, year: 2019}, eventHTML: "<h6>Sokol&nbsp;spolu&nbsp;v&nbsp;pohybu</h6>"}
];

var calendarId = "calendar";

calendar.render = function() {
    var today = {day: day.getDate(), month: day.getMonth(), year: day.getFullYear()};
    var monthGrid = getMonthGrid(this.year, this.month);
    var i,j;
    for (i = 0; i < 6; i++){
        for (j = 0; j < 7; j++){

            var cell = document.getElementById(getCellId(String(i) + String(j)));
            gridvalue = monthGrid[j + i * 7];

            // Set numbers  
            cell.innerText = gridvalue.day;
            if (gridvalue.gray) {
                cell.classList.add("gray");
            }
            else {
                cell.classList.remove("gray");
            }

            // Set events
            var k;
            var found = false;
            var tooltip = document.getElementById(getTooltipId(String(i) + String(j)))
            for (k = 0; k < this.events.length; k++){
                if (dayEntryEqual(this.events[k].dayEntry, gridvalue)){
                    tooltip.innerHTML = this.events[k].eventHTML;
                    tooltip.hidden = false;
                    found = true;
                    break;
                }
            }
            if (!found) {
                tooltip.hidden = true;
                cell.classList.remove("event");
            } 
            else {
                cell.classList.add("event");
            }

            // Set today
            if (dayEntryEqual(gridvalue, today)){
                cell.classList.add("today");
            }
            else {
                cell.classList.remove("today");
            }
        }
    }

    document.getElementById(getDayId()).innerText = today.day < 10 ? ("0" + today.day) : ("" + today.day);
    document.getElementById(getDayNameId()).innerText = getDayName(day.getDay());
    document.getElementById(getMonthYearId()).innerText = getMonthName(calendar.month) + " " + calendar.year;
}

calendar.goNextMonth = function() {
    if (this.current === this.monthLimit) return;
    this.current += 1;

    var nextMonth = (this.month + 1) % 12;
    var nextYear = nextMonth > this.month ? this.year : this.year + 1;
    this.month = nextMonth;
    this.year = nextYear;

    this.render();
}

calendar.goPreviousMonth = function() {
    if (this.current === 0) return;
    this.current -= 1;
    
    var previousMonth = (this.month - 1) % 12;
    if (previousMonth < 0) previousMonth += 12;
    var previousYear = previousMonth < this.month ? this.year : this.year - 1;
    this.month = previousMonth;
    this.year = previousYear;

    this.render();
}


function getDaysInMonths(year) {
    return  new Array(31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28,  31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
}

function coerceDay(day){
    var result = (day - 1) % 7;
    return result >= 0 ? result : result + 7;
}

function getMonthGrid(year, month) {
    var daysInMonths = getDaysInMonths(year);
    var theFirst = new Date(year, month, 1, 0, 0, 0, 0);
    var previousDaysToInclude = coerceDay(theFirst.getDay());

    var previousMonth = (month - 1) % 12;
    if (previousMonth < 0) previousMonth += 12;
    var previousYear = previousMonth < month ? year : year - 1;

    var nextMonth = (month + 1) % 12;
    var nextYear = nextMonth > month ? year : year + 1;

    var result = new Array();
    var i;
    for (i = 0; i < previousDaysToInclude; i++) {
        result.push({
            gray: true, 
            month: previousMonth, 
            day: daysInMonths[previousMonth] + 1 - previousDaysToInclude + i,
            year: previousYear
        });
    }
    for (i = 0; i < daysInMonths[month]; i++){
        result.push({
            gray: false, 
            month: month, 
            day: i + 1,
            year: year
        });
    }
    for (i = 0; result.length !== 42; i++) {
        result.push({
            gray: true,
            month: nextMonth, 
            day: i + 1,
            year: nextYear
        });
    }
    return result;
}

function dayEntryEqual(left, right) {
    return left.day == right.day && left.month == right.month && left.year == right.year;
}


function getCellId(address) {
    return calendarId + address;
}

function getTooltipId(address) {
    return calendarId + address + "tooltip";
}

function getDayId() {
    return calendarId + "day";
}

function getDayNameId() {
    return calendarId + "name";
}

function getMonthYearId() {
    return calendarId + "month-year";
}

function getDayName(day) {
    var names = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    return names[day];
}

function getMonthName(month) {
    var names = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];
    return names[month];
}

$(document).ready(function () {
    calendar.render();
    document.getElementById("button-next-month").onclick = function() {
        calendar.goNextMonth();
    }
    document.getElementById("button-previous-month").onclick = function() {
        calendar.goPreviousMonth();
    }
})
