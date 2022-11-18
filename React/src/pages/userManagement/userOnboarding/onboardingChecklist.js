import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';

import props from 'prop-types';
import Button from '@material-ui/core/Button';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const defaultInput = {
    'UserID': '',
    'DCMUser': ''
}

export default function OnboardingCheckLists(props) {
    const user = useSelector(store => store.user);
    defaultInput.DCMUser = user;

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [tableData, setTableData] = useState([]);

    // Function to send requests to update table
    const getTable = async (selectedUser) => {
        //setTableLoading(true);

        input.DCMUser = defaultInput.DCMUser;
        input.UserID = selectedUser;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/OnboardingChecklist', body).then(
            res => {
                let data = res.data;
                // Convert dates to date objects  
                data = data.map(x => {
                    return x;
                });
                setTableData(data);
                //setTableLoading(false);
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {

                    }
                    else {
                    }
                }
            );
    };


    // let checklistNums = tableData.map(function (checklistNum) {
    //     let num = checklistNum['ChecklistNumber'];
    //     return num;
    // });

    // let checklists = tableData.map(function (checklist) {
    //     let item = checklist['Checklist'];
    //     return item;
    // });

    // let isTickedList = tableData.map(function (isTicked) {
    //     let item = isTicked['IsTicked'];
    //     return item == 'Y' ? true : false;
    // });

    useEffect(() => { // Get data at tab load
        getTable(props.userID);
    }, [])

    const markCompleted = async (row) => {

        input.DCMUser = defaultInput.DCMUser;
        input.UserID = props.userID;
        input.ChecklistNumber  = row.ChecklistNumber;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/TickUserOnboardingChecklist', body).then(
            res => {
                let data = res.data;
            
                //setTableLoading(false);
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {

                    }
                    else {
                    }
                }
            );
            getTable(props.userID);
    }

    return (

        <div>
            <Grid container spacing={3}>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#89CFF0' }}>
                                    <TableCell style={{ padding: '4px' }}><b>Checklist</b></TableCell>
                                    <TableCell style={{ padding: '4px' }}><b>Mark Complete</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow style={{ backgroundColor: row.IsTicked == 'Y' ? '#C3FDB8' : '#ffcccb' }}>
                                        <TableCell style={{ padding: '4px' }}>{row.Checklist}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <IconButton style={{ padding: '2px' }}
                                                onClick={(e)=>{markCompleted(row)}}
                                                aria-label="Mark as Completed"
                                            >
                                                {row.IsTicked == 'Y' ? <CancelOutlinedIcon style={{color: '#FF5733'}} /> : <CheckCircleOutlineIcon style={{ color: '#32CD32' }} />}
                                            </IconButton>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>

        </div>
    );

}
