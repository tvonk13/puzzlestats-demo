import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Box } from '@material-ui/core';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import VisibilityOffRoundedIcon from '@material-ui/icons/VisibilityOffRounded';
import { user } from '../demoData';
import PropTypes from 'prop-types';

export default function NytAccount(props) {
    const buttonTextedLinked = "Update Account";
    const buttonTextNotLinked = "Link Account";

    const {classesProp, showCheckHandler} = props;
    const [statUser, setStatUser] = useState({});
    const [nytEmail, setNytEmail] = useState("");
    const [nytPassword, setNytPassword] = useState("");
    const [isNytLinked, setIsNytLinked] = useState(false);
    const [buttonText, setButtonText] = useState(buttonTextNotLinked);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setStatUser(user);
    }, []);

    useEffect(() => {
        setNytEmail(statUser.nytEmail);
        setNytPassword(statUser.nytPassword);
        setIsNytLinked(statUser.isNytLinked);
    }, [statUser]);

    useEffect(() => {
        if (isNytLinked) setButtonText(buttonTextedLinked);
        else setButtonText(buttonTextNotLinked);
    }, [isNytLinked]);

    function linkNytAccount() {
        if (nytEmail == null || nytPassword == null) {
            setError("Username and password required");
        } else {
            setIsNytLinked(true);
            showCheckHandler(true);
            setError(null);
        }
    }

    function unlinkNytAccount() {
        setNytEmail(null);
        setNytPassword(null);
        setIsNytLinked(false);
        showCheckHandler(false);
    }

    function toggleShowPassword() {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
            setShowPassword(true);
        } else {
            x.type = "password";
            setShowPassword(false);
        }
    }

    return(
        <>
            <div className={classesProp.accountItem}>
                <Typography variant='body1' className={classesProp.accountItemName}><strong>NYT username:</strong></Typography>
                <TextField id="email" variant="outlined" size="small" type="username" value={nytEmail || ''} onChange={(event) => setNytEmail(event.target.value)}/>
            </div>
            <div className={classesProp.accountItem}>
                <Typography variant='body1' className={classesProp.accountItemName}><strong>NYT password:</strong></Typography>
                <TextField id="password" variant="outlined" size="small" type="password" value={nytPassword || ''} onChange={(event) => setNytPassword(event.target.value)}/>
                {showPassword ? <VisibilityOffRoundedIcon onClick={toggleShowPassword} style={{marginLeft: '10px', cursor: 'pointer'}}/> : <VisibilityRoundedIcon onClick={toggleShowPassword} style={{marginLeft: '10px', cursor: 'pointer'}}/>}
            </div>
            <Box mb={6} display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                    <Button variant="contained" color="secondary" onClick={linkNytAccount} className={classesProp.button}>{buttonText}</Button>
                    {isNytLinked && <Button variant="contained" color="secondary" onClick={unlinkNytAccount} className={classesProp.button} style={{marginRight: '8px'}}>Unlink Account</Button>}
                </Box>
                <Box mt={2}>{error && <Typography variant="body2" color="error">{error}</Typography>}</Box>
            </Box>
        </>
    )
}

NytAccount.propTypes = {
    classesProp: PropTypes.object,
    showCheckHandler: PropTypes.func,
}