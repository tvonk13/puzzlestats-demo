import React from 'react'
import { makeStyles, Divider, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    statisticsDiv: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        height: 100,
        marginTop: theme.spacing(4),
    },
    statisticItemDiv: {
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    star: {
        color: theme.palette.best,
    }
}))

function OverallStatistics(props){
    const styles = useStyles();
    const {puzzlesSolved, solveRate, currentStreak, longestStreak} = props;

    return (
        <div className={styles.statisticsDiv}>
            <div className={styles.statisticItemDiv}>
                <Typography variant='h4'>{puzzlesSolved}</Typography>
                <Typography>Puzzles Solved</Typography>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className={styles.statisticItemDiv}>
                <Typography variant='h4'>{solveRate}%</Typography>
                <Typography>Solve Rate</Typography>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className={styles.statisticItemDiv}>
                <Typography variant='h4'>{currentStreak}</Typography>
                <Typography>Current Streak</Typography>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className={styles.statisticItemDiv}>
                <Typography variant='h4'>{longestStreak}</Typography>
                <Typography>Longest Streak</Typography>
            </div>
        </div>
    )
}

OverallStatistics.propTypes = {
    puzzlesSolved: PropTypes.number.isRequired,
    solveRate: PropTypes.number.isRequired,
    currentStreak: PropTypes.number.isRequired,
    longestStreak: PropTypes.number.isRequired,

}

export default OverallStatistics;