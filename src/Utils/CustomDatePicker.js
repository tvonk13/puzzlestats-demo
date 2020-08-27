import React from 'react';
import { makeStyles } from '@material-ui/core'
import { DatePicker } from '@material-ui/pickers';
import DatePickerTextField from './DatePickerTextField';
import * as util from './util';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    datePicker: {
        width: 110,
        marginRight: theme.spacing(1),
    },
}))

function CustomDatePicker(props) {
    const styles = useStyles();
    const {name, dateValue, changeHandler, label, clearable, errorProps} = props;
    return(
        <DatePicker
            format={util.nytDateFormat}
            label={label}
            disableFuture
            autoOk
            clearable={clearable}
            allowKeyboardControl
            TextFieldComponent={({onClick, value}) =>
                <DatePickerTextField 
                    onClick={onClick} 
                    value={value} 
                    label={label} 
                    className={styles.datePicker}
                    errorProps={errorProps}
                />
            }
            value={dateValue}
            onChange={(value) => changeHandler(value, name)}
        />
    )
}

CustomDatePicker.propTypes = {
    name: PropTypes.string,
    dateValue: PropTypes.string,
    changeHandler: PropTypes.func,
    label: PropTypes.string,
    clearable: PropTypes.bool,
    errorProps: PropTypes.object,
}

export default CustomDatePicker;