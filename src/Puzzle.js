import React, {useState, useEffect, useContext} from 'react';
import {IconButton, makeStyles, Typography} from "@material-ui/core";
import * as util from './Utils/util';
import clsx from "clsx";
import SyncContext from "./Contexts/SyncContext";
import SyncRoundedIcon from "@material-ui/icons/SyncRounded";

const cellSize = 25;

const useStyles = makeStyles(theme => ({
    boardContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingTop: 20,
        paddingBottom: 50,
    },
    board: {
        marginTop: 20,
        border: '2px solid black',
        width: 'fit-content'
    },
    row: {
        display: 'flex',
    },
    cell: {
        width: 25,
        height: 25,
        borderRight: '0.5px solid black',
        borderBottom: '0.5px solid black',
        paddingTop: 2,
    },
    textBlue: {
        color: '#2860d8'
    },
    cellBlock: {
        background: 'black'
    },
    cellText: {
        display: 'inline',
        marginLeft: 7,
    },
    divDot: {
        width: 3,
        height: 3,
        borderRadius: 30,
        background: 'red',
        float: 'right',
        marginRight: 2,
    }
}));

export default function Puzzle(props) {
    const classes = useStyles();

    const [stat, setStat] = useState({});
    const [dateString, setDateString] = useState(props.match.params.date);
    const [{isSyncing, progress}, {setIsSyncing, setProgress}] = useContext(SyncContext);
    const momentDate = util.formattedDateStringToMoment(dateString, "YYYY-MM-DD");
    const [size, setSize] = useState(momentDate.day() === 0 ? 21 : 15);

    function generateBoard() {
        var count = 0;
        var boardArray = [];
        var row = [];

        stat.board.forEach(cell => {
            count++;
            {
                var cellArray = cell.split("|");
                var cellMap = {}

                cellMap["value"] = cellArray[0];
                cellMap["status"] = cellArray[1];
                cellMap["time"] = cellArray[2];
                row.push(cellMap);
            }
            if (count % size === 0) {
                boardArray.push(row);
                row = []
            }
        })

        return boardArray;
    }

    function syncData() {
        var startString = dateString;
        var endString = dateString;

        // setIsSyncing(true);
        //
        // amplify.syncData(statUser.nytEmail, statUser.nytPassword, startString, endString, false, onComplete)
        //     .then(() => {
        //         setIsSyncing(false);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });

        setTimeout(() => setIsSyncing(false), 3000);

    }

    const onComplete = () => {
        setProgress(progress => progress + 100/1);
    }

    return (
        <div className={classes.boardContainer}>
            <div>
                <Typography>Puzzle Date: {stat.puzzle_date}</Typography>
                <Typography>Completed: {"" + stat.solved}</Typography>
                <Typography>Streak Eligible: {"" + stat.eligible}</Typography>
                <Typography>Time Elapsed: {util.secondsToFormattedTime(stat.time_elapsed)}</Typography>
                <Typography>Last Updated: {stat.last_update_time}</Typography>
                <Typography>Last Synced: {stat.last_sync_time}</Typography>
            </div>
            <IconButton onClick={syncData}>
                <SyncRoundedIcon fontSize="small" />
            </IconButton>
            <div className={classes.board}>
                {
                    stat.board !== undefined &&
                    generateBoard().map((row, rowIndex) => {
                        return (
                            <div className={classes.row} key={rowIndex}>
                                {
                                    row.map((cell, cellIndex) => {
                                        return <div className={clsx({
                                            [classes.cell]: true,
                                            [classes.cellBlock]: cell["value"] === "",
                                        })
                                        } key={rowIndex+cellIndex}>
                                            <Typography variant="body1" className={clsx({
                                                [classes.cellText]: true,
                                                [classes.textBlue]: (cell["status"] === "1" || cell["status"] === "9")
                                            })}>
                                                {cell["value"]}
                                            </Typography>
                                            {
                                                cell["status"] === "9" &&
                                                <div className={classes.divDot}></div>
                                            }
                                        </div>
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}