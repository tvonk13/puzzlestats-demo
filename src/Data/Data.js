import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableContainer, TablePagination, Paper, Container, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import * as util from '../Utils/util';
import DynamicTableRow from './DynamicTableRow';
import { stats } from '../demoData';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] == null || b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (a[orderBy] == null || b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(6),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    testDiv: {
        height: '100%'
    },
    table: {
        minWidth: 750,
    },
}));

export default function Data(){
    const styles = useStyles();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('puzzle_date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statList, setStatList] = useState([]);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackBarSeverity, setSnackBarSeverity] = useState("success");
    const [snackBarMessage, setSnackBarMessage] = useState("");

    useEffect(() => {
        setStatList(stats);
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClicked = event => {
        if (event.target.checked) {
            const newSelecteds = statList.map(n => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleCheckBoxClicked = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    function handleDeleteClicked() {
        let rowString = " rows "
        if (selected.length <= 1) rowString = " row ";
        setSnackBarMessage(selected.length + rowString + "deleted!");
        setIsSnackbarOpen(true);
        setSelected([]);
        setPage(0);
    }

    function handleFilter(filters, numFilters) {
        if (numFilters === 0) {
            setStatList(stats);
        } else {
            console.log(filters);
            setStatList(stats.filter(stat => util.filterStat(stat, filters)));
            setPage(0);
        }
    }

    function handleCloseSnackBar(event, reason) {
        if (reason === 'clickaway') {
          return;
        }
        setIsSnackbarOpen(false);
    };

    const handleSaveEditedStat = (editedStat) => {
        if (editedStat === null) {
            setSnackBarSeverity("error");
            setSnackBarMessage(util.errorMessage);
        } else {
            setSnackBarSeverity("success");
            setSnackBarMessage(util.successMessage);
        }
        setIsSnackbarOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const isSelected = name => selected.indexOf(name) !== -1;

    return (
        <Container size="lg" className={styles.root}>
            <Paper className={styles.paper}>
                <EnhancedTableToolbar 
                    numSelected={selected.length}
                    deleteClickedHandler={handleDeleteClicked}
                    filterHandler={handleFilter}
                    dense={dense}
                    changeDenseHandler={handleChangeDense}
                />
                <TableContainer>
                <Table
                    className={styles.table}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClicked}
                        onRequestSort={handleRequestSort}
                        rowCount={statList.length}
                    />
                    <TableBody>
                        {stableSort(statList, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <DynamicTableRow 
                                        key={row.id}
                                        isItemSelected={isItemSelected}
                                        row={row}
                                        statList={statList}	
                                        labelId={labelId} 
                                        clickCheckBoxHandler={handleCheckBoxClicked}
                                        saveEditedStatHandler={handleSaveEditedStat}
                                    />
                                );
                        })}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={statList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <Snackbar open={isSnackbarOpen} autoHideDuration={util.snackBarTimeout} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBarSeverity}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}