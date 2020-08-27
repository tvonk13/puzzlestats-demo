import React, { useState, useEffect } from "react";
import { makeStyles, Container, Typography } from "@material-ui/core";
import OverallStatistics from './OverallStatistics';
import TodayBarGraph from './TodayBarGraph';
import Resources from './Resources';
import * as util from '../Utils/util';
import { stats } from '../demoData';
import moment from "moment";

const useStyles = makeStyles(theme => ({
    home: {
        paddingTop: theme.spacing(10),
        marginBottom: theme.spacing(4),
    },
    homeGrid: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    overallStatistics: {
        width: '80%',
        textAlign: 'center',
        marginBottom: theme.spacing(10),
    },
    todayAndResources: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    todayHeader: {
        marginTop: theme.spacing(1),
    },
    todayGraph: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    resourcesContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 500
    },
    resourcesHeader: {
        marginBottom: theme.spacing(4),
        textAlign: 'center'
    }
}));

function Home() {
    const weekdayToday = util.getWeekdayToday();
    const styles = useStyles();

    const [statList, setStatList] = useState([]);
    const [statListByWeekday, setStatListByWeekday] = useState([]);
    const [average, setAverage] = useState(0);
    const [best, setBest] = useState(0);
    const [today, setToday] = useState(0);
    const [puzzlesSolved, setPuzzlesSolved] = useState(0);
    const [solveRate, setSolveRate] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);

    useEffect(() => {
        setStatList(stats);
    }, []);

    useEffect(() => {
        setStatListByWeekday(util.getStatListByWeekday(statList, util.now().day()));
    }, [statList]);

    // Whenever stat list changes, recalculate the statistics
    useEffect(() => {
        var solvedCount = 0;
        var currentStreakCount = 0;
        var longestStreakCount = 0;
        statList.sort((a, b) => {
            if (a.puzzle_date < b.puzzle_date) return -1;
            if (a.puzzle_date > b.puzzle_date) return 1;
            return 0;
        })
        statList.forEach(stat => {
            if (stat.solved) solvedCount++;

            if (stat.eligible) {
                currentStreakCount++;
            } else {
                if (currentStreakCount > longestStreakCount) longestStreakCount = currentStreakCount;
                if (!util.isSameDay(stat.puzzle_date, moment())) currentStreakCount = 0;
            }
        })

        if (currentStreakCount > longestStreakCount) longestStreakCount = currentStreakCount;


        setPuzzlesSolved(solvedCount);
        if (solvedCount > 0 && statList.length > 0) {
            setSolveRate(Math.round((solvedCount / statList.length) * 100));
        }
        setCurrentStreak(currentStreakCount);
        setLongestStreak(longestStreakCount);

    }, [statList]);

    useEffect(() => {
        setAverage(calculateAverage(statListByWeekday));
        setBest(calculateBest(statListByWeekday));
        setToday(1000);
    }, [statListByWeekday])

    function calculateAverage(stats) {
        var total = 0;
        var count = 0;
        stats.forEach((stat) => {
            if (stat.solved) {
                count++;
                total += stat.time_elapsed;
            }
        });
        if (total === 0) return total;
        var avg = total/count;
        return Math.round(total/count);
    }

    function calculateBest(stats) {
        if (stats.length <= 0) return 0;

        var best = Number.POSITIVE_INFINITY;
        stats.forEach((stat) => {
            if (stat.time_elapsed < best && stat.solved) best = stat.time_elapsed;
        });

        if (best === Number.POSITIVE_INFINITY) return 0;
        return best;
    }

    return (
        <Container className={styles.home}>
            <div className={styles.homeGrid}>
                <div className={styles.overallStatistics}>
                    <Typography variant="h4">Overall Statistics</Typography>
                    <OverallStatistics puzzlesSolved={puzzlesSolved} solveRate={solveRate} currentStreak={currentStreak} longestStreak={longestStreak} />
                </div>
                <div className={styles.todayAndResources}>
                    <div className={styles.todayGraph}>
                        <div className={styles.todayHeader}>
                            <Typography variant="h4">On {weekdayToday}s</Typography>
                        </div>
                        <TodayBarGraph average={average} best={best} today={today}/>
                    </div>
                    <div className={styles.resourcesContainer}>
                        <Typography variant="h4" className={styles.resourcesHeader}>Resources</Typography>
                        <Resources />
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Home;