import React, { useState, useEffect } from 'react';
import { TableCell, TableRow, IconButton, TextField, makeStyles } from '@material-ui/core';
import { TimePicker } from '@material-ui/pickers';
import CloseIcon from '@material-ui/icons/CloseRounded';
import DoneIcon from '@material-ui/icons/DoneRounded';
import DatePickerTextField from '../Utils/DatePickerTextField';
import CustomDatePicker from '../Utils/CustomDatePicker';
import * as util from '../Utils/util';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    notes: {
        width: 200
    },
    datePicker: {
        width: 100
    },
    numLookups: {
        width: 65,
    },
    timeElapsed: {
        width: 90,
    },
    inputFont: {
        fontSize: 14
    },
    disabled: {
        color: theme.palette.secondary.light,
    }
}))

export default function EditableTableRow(props) {
    const styles = useStyles();
    const moment = require('moment');

    const {row, labelId, closeEditModeHandler, saveEditedStatHandler, statList} = props;
    const fromSourceNyt = util.fromSourceNyt(row.source);
    const [puzzleDate, setPuzzleDate] = useState(moment(row.puzzle_date));
    const [dateCompleted, setDateCompleted] = useState(row.date_completed === null ? null : moment(row.date_completed));
    const [timeElapsed, setTimeElapsed] = useState(util.secondsToMoment(row.time_elapsed));
    const [notes, setNotes] = useState(row.notes === null ? '' : row.notes);
    const [numLookups, setNumLookups] = useState(row.num_lookups === null ? 0 : row.num_lookups);
    const [weekday, setWeekday] = useState(row.weekday);
    const [puzzleDateErrorProps, setPuzzleDateErrorProps] = useState({error: false});
    const [dateCompletedErrorProps, setDateCompletedErrorProps] = useState({error: false});

    useEffect(() => {
        setWeekday(util.weekdays[puzzleDate.day()]);
    }, [puzzleDate])

    useEffect(() => {
        //PUZZLE DATE
        // Don't show error if the input date is the same as the stat's current date
        if (util.puzzleDateExists(statList, puzzleDate) && !util.momentDaysEqual(puzzleDate, row.date_completed)) {
            setPuzzleDateErrorProps({
                error: true,
                helperText: "Date exists"
            });
        } else {
            setPuzzleDateErrorProps({
                error: false
            })
        }

        //DATE COMPLETED
        if (dateCompleted !== null && util.isBeforeDay(dateCompleted, puzzleDate)) {
            setDateCompletedErrorProps({
                error: true,
                helperText: "Can't be before puzzle date"
            });
        } else {
            setDateCompletedErrorProps({
                error: false
            })
        }
    }, [puzzleDate, dateCompleted, statList, row.date_completed])

    function handleSave() {
        closeEditModeHandler();
        saveEditedStatHandler();
    }

    return (
        <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={row.id}
        >
            <TableCell padding="checkbox"></TableCell>
            {
                fromSourceNyt
                ? 
                <>
                <TableCell id={labelId} scope="row">{util.formatMomentToDateString(puzzleDate)}</TableCell>
                <TableCell align="left">{util.formatMomentToDateTimeString(dateCompleted)}</TableCell>
                <TableCell align="left">{util.secondsToFormattedTime(row.time_elapsed)}</TableCell>
                </>
                :
                <>
                <TableCell id={labelId} scope="row">
                    <CustomDatePicker 
                        dateValue={puzzleDate}
                        changeHandler={setPuzzleDate}
                        clearable={false}
                        errorProps={puzzleDateErrorProps}
                    />
                </TableCell>
                <TableCell align="left">
                    <CustomDatePicker 
                        dateValue={dateCompleted}
                        changeHandler={setDateCompleted}
                        clearable={true}
                        errorProps={dateCompletedErrorProps}
                    /> 
                </TableCell>
                <TableCell align="left">
                    <TimePicker
                        ampm={false}
                        margin="dense"
                        openTo="minutes"
                        views={["hours", "minutes", "seconds"]}
                        format="HH:mm:ss"
                        TextFieldComponent={({onClick, value}) =>
                            <DatePickerTextField onClick={onClick} value={value} className={styles.timeElapsed} />
                        }
                        value={timeElapsed}
                        onChange={setTimeElapsed}
                    />
                </TableCell>
                </>
            }
            <TableCell align="left">
                <TextField
                    id="outlined-number"
                    type="number"
                    variant="outlined"
                    size="small"
                    margin="dense"
                    value={numLookups}
                    onChange={(event) => setNumLookups(event.target.value)}
                    className={styles.numLookups}
                />
            </TableCell>
            <TableCell align="left">{weekday}</TableCell>
            <TableCell align="left">
                <TextField
                    multiline
                    rowsMax="4"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    variant="outlined"
                    margin="dense"
                    className={styles.notes}
                    InputProps={{
                        classes: {
                            input: styles.inputFont
                        }
                    }}
                />
            </TableCell>
            <TableCell align="left">{util.typeToString(row.source)}</TableCell>
            <TableCell align="right">
                <IconButton 
                    size="small" 
                    onClick={closeEditModeHandler}
                >
                    <CloseIcon fontSize="small" color="secondary"/>
                </IconButton>
                <IconButton 
                    size="small"
                    onClick={() => handleSave()}
                >
                    <DoneIcon fontSize="small" color="secondary"/>
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

EditableTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    labelId: PropTypes.string.isRequired,
    closeEditModeHandler: PropTypes.func.isRequired,
    saveEditedStatHandler: PropTypes.func.isRequired,
    statList: PropTypes.array.isRequired,

}