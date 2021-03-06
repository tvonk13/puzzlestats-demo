import React, { useState, useEffect } from 'react';
import { Container, Divider } from '@material-ui/core';
import { makeStyles } from "@material-ui/core";
import Settings from './Settings';
import AllGraph from './AllGraph';
import WeekdaysGraph from './WeekdaysGraph';
import * as util from '../Utils/util';
import { stats } from '../demoData';
const useStyles = makeStyles(theme => ({
    graphs: {
        paddingTop: 50,
        display: 'flex'
    },
    settings: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: theme.spacing(2)
    },
    graph: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        height: 600
    }
}));

function Graphs() {
    const styles = useStyles();

    const [statList, setStatList] = useState([]);
    const [filters, setFilters] = useState({})
    const [data, setData] = useState([]);

    const defaultWeekdayData = util.weekdays.map(value => {
        return ({
            "id": value,
            "average": 0
        });
    });

    const defaultAllData = [
        {
            id: 'all',
            color: '#00b0ff',
            data: []
        }
    ];

    useEffect(() => {
        setStatList(stats);
    }, []);

    useEffect(() => {
        setData(generateData());
    }, [statList, filters]);
        
    function generateData() {
        var filteredStats = filterStatList();
        filteredStats.sort(util.compareStatsByPuzzleDateAsc)
        var data = [];

        if (filters.categorization === 'weekdays') {
            data = generateWeekdaysData(filteredStats)
        } else {
            data = generateAllData(filteredStats);
        }

        return data;
    }

    function generateWeekdaysData(filteredStats) {
        var data = [];
        if (filteredStats.length > 0) {
            var dataMap = new Map();
            util.weekdays.forEach((weekday, index) => {
                dataMap.set(index, {'weekday': weekday, 'count': 0, 'total': 0, 'average': 0, 'best': null});
            })

            filteredStats.forEach(stat => {
                var key = stat.weekday

                if (filters.average && stat.solved) {
                    dataMap.get(key).count++;
                    dataMap.get(key).total += stat.time_elapsed;
                    if (dataMap.get(key).total !== 0) {
                        var newAverage = Math.round(dataMap.get(key).total / dataMap.get(key).count);
                        dataMap.get(key).average = newAverage;
                    }
                }

                if (filters.best) {
                    if ((dataMap.get(key).best === null || stat.time_elapsed < dataMap.get(key).best) && stat.solved) dataMap.get(key).best = stat.time_elapsed;
                }
            })

            dataMap.forEach(value => {
                var dataEntry = {"id": value.weekday}
                if (filters.average) {
                    dataEntry["average"] = value.average
                }
                if (filters.best) {
                    dataEntry["best"] = value.best
                }
                if (!filters.average && !filters.best) {
                    dataEntry["average"] = 0;
                    dataEntry["best"] = 0;
                }
                data.push(dataEntry)
            });
        } else {
            data = defaultWeekdayData;
        }

        return data;
    }

    function generateAllData(filteredStats) {
        var data = [];
        if (filteredStats.length > 0) {
            if (!filters.groupByWeekday) {
                var all = {
                    id: 'all',
                    color: '#00b0ff',
                    data: []
                };

                filteredStats.forEach(stat => {
                    all.data.push({x: stat.puzzle_date, y: stat.time_elapsed});
                })

                data.push(all);
            } else {
                var dataMap = new Map();
                util.weekdays.forEach((weekday, index) => {
                    dataMap.set(index, {'id': weekday, 'color': '#00b0ff', 'data': []});
                });

                filteredStats.forEach(stat => {
                    var weekdayKey = stat.weekday
                    dataMap.get(weekdayKey).data.push({x: stat.puzzle_date, y: stat.time_elapsed});
                });

                dataMap.forEach(value => {
                    var dataObj = {
                        id: value.id,
                        color: value.color,
                        data: value.data
                    }
                    data.push(dataObj);
                })
            }
        } else {
            data = defaultAllData;

        }
        return data;
    }

    function filterStatList() {
        if (Object.keys(filters).length === 0) return statList.filter(stat => true);
        return statList.filter(stat => {
            var weekdayBool = filters.weekdays.includes(stat.weekday);
            var completedBool = filters.completed ? stat.solved : true;
            var completedOnPuzzleDateBool = filters.completedOnPuzzleDate ? util.isSameDay(stat.puzzle_date, stat.date_completed) : true;
            var puzzleDateAfterFrom = filters.puzzleDateFrom !== null ? util.isSameOrAfterDay(stat.puzzle_date, filters.puzzleDateFrom) : true;
            var puzzleDateBeforeTo = filters.puzzleDateTo !== null ? util.isBeforeDay(stat.puzzle_date, filters.puzzleDateTo) : true;
            var puzzleDateBool = puzzleDateAfterFrom && puzzleDateBeforeTo;
            var dateCompletedAfterFrom = filters.dateCompletedFrom !== null ? util.isSameOrAfterDay(stat.date_completed, filters.dateCompletedFrom) : true;
            var dateCompletedBeforeTo = filters.dateCompletedTo !== null ? util.isBeforeDay(stat.date_completed, filters.dateCompletedTo) : true;
            var dateCompletedBool = dateCompletedAfterFrom && dateCompletedBeforeTo;
            var sourceBool = filters.sources.includes(stat.source);

            return weekdayBool &&
                    completedBool &&
                    completedOnPuzzleDateBool &&
                    puzzleDateBool &&
                    dateCompletedBool &&
                    sourceBool;
        });
    }

    function generateKeys() {
        var keys = [];
        if (filters.categorization === 'weekdays') {
            if (filters.average) keys.push("average");
            if (filters.best) keys.push("best");
            if (keys.length <= 0) keys.push("average");
        } else if (filters.categorization === 'all') {
            if (filters.groupByWeekday) {
                keys = util.weekdays;
            } else {
                keys = ['all'];
            }
        }
        return keys;
    }

    function generateColors() {
        var colors = [];
        if (filters.categorization === 'weekdays') {
            if (filters.average) colors.push("#00b0ff");
            if (filters.best) colors.push("#ffc400");
            if (colors.length <= 0) colors.push("#00b0ff");
        } else if (filters.categorization === 'all') {
            if (filters.groupByWeekday) {
                colors = ['#58355E', '#FE5F55', '#FFE066', '#C7EFCF', '#247BA0', '#D6A2AD',  '#7CAE7A']
            } else {
                colors = ['#00b0ff']
            }
        }
        return colors;
    }

    return(
        <Container size="md">
            <div className={styles.graphs}>
                <div className={styles.settings}>
                    <Settings filterChangeHandler={setFilters} />
                </div>
                <Divider orientation="vertical" flexItem />
                <div className={styles.graph}>
                    {
                        filters.categorization === 'weekdays' ?
                            <WeekdaysGraph data={data} keys={generateKeys()} colors={generateColors()} />
                        :
                            <AllGraph data={data} keys={generateKeys()} colors={generateColors()}/>
                    }
                </div>
            </div>
        </Container>
    )
}

export default Graphs;