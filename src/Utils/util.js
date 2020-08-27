var moment = require('moment');

export var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export var sources = ["NYT", "Manual"];
export var errorMessage = "Oops! There was an error. Data not saved.";
export var successMessage = "Data saved!";
export var dateFormat = "YYYY-MM-DD";
export var dateTimeFormat = "YYYY-MM-DD hh:mm";
export var snackBarTimeout = 3000;
export var sourceTypeNYT = 0;
export var sourceTypeManual = 1;
export const nytDateFormat = "YYYY-MM-DD";

export function getWeekdayToday() {
    return weekdays[moment().day()];
}

export function getStatListByWeekday(statList, weekday) {
    return statList.filter(stat => stat.weekday === weekday);
}

export function filterStat(stat, filters) {
    return stat.weekday === filters.weekday.value ||
            (filters.puzzle_date_to.value != null && filters.puzzle_date_from.value == null && isSameOrBeforeDay(stat.puzzle_date, filters.puzzle_date_to.value)) ||
            (filters.puzzle_date_from.value != null && filters.puzzle_date_to.value == null && isSameOrAfterDay(stat.puzzle_date, filters.puzzle_date_from.value)) ||
            (filters.puzzle_date_to.value != null && filters.puzzle_date_from.value != null && isSameOrBeforeDay(stat.puzzle_date, filters.puzzle_date_to.value) && isSameOrAfterDay(stat.puzzle_date, filters.puzzle_date_from.value)) ||
            stat.source === filters.source.value ||
            stat.num_lookups === filters.num_lookups.value;
}

export function now() {
    return moment();
}

export function secondsToFormattedTime(totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var remainingSeconds = totalSeconds - hours * 3600;
    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = remainingSeconds - minutes * 60;

    return paddedTime(hours, minutes, seconds);
}

export function secondsToMoment(totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var remainingSeconds = totalSeconds - hours * 3600;
    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = remainingSeconds - minutes * 60;

    return moment.utc(0).hours(hours).minutes(minutes).seconds(seconds);
}

export function formattedDateStringToMoment(dateString, format) {
    return moment(dateString, format);
}

export function formatMomentToStringWithFormat(date, format) {
    return date.format(format);
}

export function formatMomentToDateString(date) {
    return formatMomentToStringWithFormat(date, dateFormat);
}

export function formatMomentToDateTimeString(date) {
    return formatMomentToStringWithFormat(date, dateTimeFormat);
}

export function puzzleDateExists(stats, date) {
    return stats.some((stat) => moment(stat.puzzle_date).isSame(date, 'day'));
}

export function getTotalSecondsFromMoment(momentTime) {
    var hours = momentTime.hours() * 3600;
    var minutes = momentTime.minutes() * 60;
    var seconds = momentTime.seconds();

    return hours + minutes + seconds;
}

export function isSameDay(date1, date2) {
    if (date1 === null) return false;
    if (date2 === null) return true;
    return moment(date1).isSame(moment(date2), 'day');
}

export function isBeforeDay(date1, date2) {
    if (date1 === null) return false;
    if (date2 === null) return true;
    return moment(date1).isBefore(moment(date2), 'day');
}

export function isSameOrBeforeDay(date1, date2) {
    if (date1 === null) return false;
    if (date2 === null) return true;
    return moment(date1).isSameOrBefore(moment(date2), 'day');
}

export function isSameOrAfterDay(date1, date2) {
    if (date1 === null) return false;
    if (date2 === null) return true;
    return moment(date1).isSameOrAfter(moment(date2), 'day');
}

export function isAfterDay(date1, date2) {
    if (date1 === null) return false;
    if (date2 === null) return true;
    return moment(date1).isAfter(moment(date2), 'day');
}

export function isBlankOrNull(value) {
    return value === '' || value === null;
}

export function compareStatsByPuzzleDate(a, b) {
    if (a.puzzle_date < b.puzzle_date) return 1;
    if (a.puzzle_date > b.puzzle_date) return -1;
    return 0;
}

export function compareStatsByPuzzleDateAsc(a, b) {
    if (a.puzzle_date < b.puzzle_date) return -1;
    if (a.puzzle_date > b.puzzle_date) return 1;
    return 0;
}

// Link to daily puzzle
export function getNYTLink() {
    var date = now();
    return "https://www.nytimes.com/crosswords/game/daily/" + date.year() + "/" + (date.month() + 1) + "/" + date.date();
}

export function typeToString(type) {
    if (fromSourceNyt(type)) return "NYT";
    return "Manual";
}

export function fromSourceNyt(type) {
    return (type === sourceTypeNYT);
}

export function momentDaysEqual(date1, date2) {
    if (date1 === null || date2 === null) return false;
    return moment(date1).isSame(date2, 'day');
}

let notesList = ["", "this was a fun one!", "got stuck on the theme clue", "learned a new word!", "had to look some up", "what a puzzle"]

export function generateStats() {
    var stats = [];

    for (let step = 1; step < 90; step++) {
        const puzzleDate = moment().date(step).subtract(90, 'd');
        const weekday = puzzleDate.weekday();
        const dateDiff = getRandomInt(0,5);
        const solved = getRandomInt(0,11) < 8;
        const chance = getRandomInt(0,11);
        let dateCompleted = null;
        if (solved) {
            dateCompleted = moment();
            if (chance < 8) {
                dateCompleted.date(step);
            } else {
                dateCompleted.date(step + dateDiff);
            }
            dateCompleted.subtract(90, 'd');
            dateCompleted.hour(getRandomInt(1,12)).minute(getRandomInt(0,60))
        }
        const eligible = solved && puzzleDate.isSame(dateCompleted, 'day');
        const timeElapsed = solved ? generateTimeElapsed(weekday) : 0;
        if (dateCompleted !== null) dateCompleted = dateCompleted.format(dateTimeFormat);

        const stat = {
            id: 1,
            notes: notesList[getRandomInt(0,notesList.length)],
            weekday: weekday,
            eligible: eligible,
            puzzle_date: puzzleDate.format(dateFormat),
            date_completed: dateCompleted,
            solved: solved,
            time_elapsed: timeElapsed,
            board: [],
            source: getRandomInt(0,2),
            numLookups: getRandomInt(0, 5),
        }

        stats.push(stat);
    }
    return stats;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateTimeElapsed(weekday) {
    switch (weekday) {
        case 0:
            return getRandomInt(3000, 5400);
        case 1:
            return getRandomInt(480, 900);
        case 2:
            return getRandomInt(600, 1800);
        case 3:
            return getRandomInt(1200, 2400);
        case 4:
            return getRandomInt(2400, 4200);
        case 5:
            return getRandomInt(2400, 4200);
        case 6:
            return getRandomInt(3000, 5400);
        default:
            return 0;
    }
}

/*---------- HELPER METHODS ----------*/

function pad(num) {
    var numString = num + "";
    if (numString.length < 2) numString = "0" + numString;
    return numString;
}

function paddedTime(hours, minutes, seconds) {
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); 
}