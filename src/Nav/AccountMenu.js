import React, {useState, useRef, useEffect } from 'react';
import { makeStyles, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    user: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        marginRight: theme.spacing(2),
    },
    accountIcon: {
        marginRight: theme.spacing(1),
    },
}));

export default function AccountMenu({username}) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
        }
    }

    function signOut(event) {
        alert("You have successfully signed out!")
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div>
            <div className={classes.user} 
                color="secondary"
                ref={anchorRef}
                onClick={handleToggle}
            >
                <AccountCircleIcon fontSize="small" className={classes.accountIcon}/>
                <Typography>{username}</Typography>
            </div>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                    <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                            <MenuItem component={Link} to='/account'>
                                Account
                            </MenuItem>
                            <MenuItem onClick={signOut}>Logout</MenuItem>
                        </MenuList>
                    </ClickAwayListener>
                    </Paper>
                </Grow>
                )}
            </Popper>
        </div>
    );
}