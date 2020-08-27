var moment = require('moment');
const formatDate = "YYYY-MM-DD";
const formatDateTime = "YYYY-MM-DD hh:mm";

var user = {
    username: "bob",
    email: "bob@bob.com",
    nytEmail: "test@test.com",
    nytPassword: "test",
    isNytLinked: true,
}

let notesList = ["", "this was a fun one!", "got stuck on the theme clue", "learned a new word!", "had to look some up", "what a puzzle"]

function generateStats() {
    var stats = [];

    for (let step = 1; step < 90; step++) {
        const puzzleDate = moment().month(0).date(step);
        const weekday = puzzleDate.weekday();
        const dateDiff = getRandomInt(0,5);
        const solved = getRandomInt(0,11) < 8;
        const chance = getRandomInt(0,11);
        let dateCompleted = null;
        if (solved) {
            dateCompleted = moment().month(0);
            if (chance < 8) {
                dateCompleted.date(step)
            } else {
                dateCompleted.date(step + dateDiff);
            }
            dateCompleted.hour(getRandomInt(1,12)).minute(getRandomInt(0,60))
        }
        const eligible = solved && puzzleDate.isSame(dateCompleted, 'day');
        const timeElapsed = solved ? generateTimeElapsed(weekday) : 0;
        if (dateCompleted !== null) dateCompleted = dateCompleted.format(formatDateTime);

        const stat = {
            id: 1,
            notes: notesList[getRandomInt(0,notesList.length)],
            weekday: weekday,
            eligible: eligible,
            puzzle_date: puzzleDate.format(formatDate),
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

function generateTimeElapsed(weekday) {
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

var stats = generateStats();

export { stats, user };