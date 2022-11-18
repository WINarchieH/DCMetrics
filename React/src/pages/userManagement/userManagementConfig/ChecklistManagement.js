import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

export default function CheckListsManagement(props) {

    const defaultInput = {
        'DCMUser': ''
    }

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

        await api.post('/UserManagement/UserManagementConfig/ConfigureOnboardingChecklist_Get', body).then(
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

    const moveUp = async (row) => {
        input.DCMUser = defaultInput.DCMUser;
        input.Checklist = row.Checklist;
        let body = new URLSearchParams(input);

        await api.post('/UserManagement/UserManagementConfig/ConfigureOnboardingChecklist_MoveUp', body).then(
            res => {
                let data = res.data;
            }).catch(
                err => {
                    if (err.response) {
                    }
                    else {
                    }
                }
            );
        getTable();
    }

    const moveDown = async (row) => {
        input.DCMUser = defaultInput.DCMUser;
        input.Checklist = row.Checklist;
        let body = new URLSearchParams(input);

        await api.post('/UserManagement/UserManagementConfig/ConfigureOnboardingChecklist_MoveDown', body).then(
            res => {
                let data = res.data;
            }).catch(
                err => {
                    if (err.response) {
                    }
                    else {
                    }
                }
            );
        getTable();
    }

    const changeActivationStatus = async (row) => {
        input.DCMUser = defaultInput.DCMUser;
        input.Checklist = row.Checklist;
        let body = new URLSearchParams(input);

        await api.post('/UserManagement/UserManagementConfig/ChangeChecklistActivationStatus', body).then(
            res => {
                let data = res.data;
            }).catch(
                err => {
                    if (err.response) {
                    }
                    else {
                    }
                }
            );
        getTable();
    }
    


    useEffect(() => { // Get data at tab load
        getTable();
    }, [])

    useEffect(() => { 
        getTable();
    }, [props.triggerChecklistsReload])
    

    return (

        <div>
            <Grid container spacing={3}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow style={{   backgroundColor: 'rgb(35,168,224)' }}>
                                    <TableCell style={{ padding: '1opx', color:'white' }}><b>Checklist</b></TableCell>
                                    <TableCell style={{ padding: '10px', color:'white' }}><b>Sequence</b></TableCell>
                                    <TableCell style={{ padding: '10px' , color:'white'}}><b>Activated</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow style={{   backgroundColor: row.IsActive == 'Y' ? '#ffffff' : '#ffffff' }}>
                                        <TableCell style={{ padding: '10px', fontFamily:'Montserrat',   }}>{row.Checklist}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <div style={{ display: 'flex' }}>
                                                <IconButton style={{ padding: '2px' }}
                                                    onClick={(e) => { moveUp(row) }}
                                                    aria-label="Move Up"
                                                >
                                                    {row.IsActive == 'Y' ? <KeyboardArrowUpIcon style={{ color: '#FF5733' }} /> : <KeyboardArrowUpIcon style={{ display: 'none' }} />}
                                                </IconButton>
                                                <IconButton style={{ padding: '2px' }}
                                                    onClick={(e) => { moveDown(row) }}
                                                    aria-label="Move Down"
                                                >
                                                    {row.IsActive == 'Y' ? <KeyboardArrowDownIcon style={{ color: '#4169E1' }} /> : <KeyboardArrowDownIcon style={{ display: 'none' }} />}
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ fontFamily:'Montserrat', padding: '4px' }}>
                                            <IconButton style={{ padding: '2px' }}
                                                onClick={(e) => { changeActivationStatus(row) }}
                                                aria-label="Activate/Inactivate"
                                            >
                                                {row.IsActive == 'Y' ? <CheckCircleOutlineIcon style={{ color: '#32CD32' }} /> : <CancelOutlinedIcon style={{ color: 'red' }} />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>

        </div>
    );

}