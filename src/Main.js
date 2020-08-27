import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { makeStyles, LinearProgress, Typography, Collapse } from "@material-ui/core";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CustomScrollBar from './Utils/CustomScrollBar';
import Nav from './Nav/Nav';
import Home from './Home/Home';
import Data from './Data/Data';
import Graphs from './Graphs/Graphs';
import Account from './Account/Account';
import Puzzle from './Puzzle';
import SyncContext from './Contexts/SyncContext';

const useStyles = makeStyles(theme => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100vw',
    },
    syncStatus: {
        padding: theme.spacing(2),
    },
    syncText: {
        marginBottom: theme.spacing(1),
    },
}));

function Main() {
    const styles = useStyles();
    const [{isSyncing, progress}, ] = useContext(SyncContext);

    return <MuiPickersUtilsProvider utils={MomentUtils}>
        <CustomScrollBar
                style={{ height: '100vh' }}
                autoHide
            >
            <div className={styles.main}>
                <Nav />
                <Collapse in={isSyncing} >
                    <div className={styles.syncStatus}>
                        <Typography className={styles.syncText}>Syncing NYT Data</Typography>
                        <LinearProgress variant="determinate" value={progress} color="secondary"/>
                    </div>
                </Collapse>
                <Route exact path="/" component={Home} />
                <Route exact path="/data" component={Data} />
                <Route exact path="/graphs" component={Graphs} />
                <Route exact path="/account" component={Account} />
                <Route exact path="/puzzle/:date" component={Puzzle} />
            </div>
        </CustomScrollBar>
    </MuiPickersUtilsProvider>
}

export default Main;