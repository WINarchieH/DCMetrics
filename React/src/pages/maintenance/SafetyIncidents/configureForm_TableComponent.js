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

export default function ConfigureForm_TableComponent(props) {

    const defaultInput = {
        'DCMUser': ''
    }

    const user = useSelector(store => store.user);
    defaultInput.DCMUser = user;

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [tableData, setTableData] = useState([]);

    // Function to send requests to update table
    const getTable = async () => {
        //setTableLoading(true);

        let body = new URLSearchParams(input);

        await api.post('/Maintenance/SafetyInspectionChecklist/LoadTable', body).then(
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
        input.ID = row.ID;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/SafetyInspectionChecklist/SafetyTemplateSequence_MoveUp', body).then(
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
        input.ID = row.ID;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/SafetyInspectionChecklist/SafetyTemplateSequence_MoveDown', body).then(
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
        input.ID = row.ID;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/SafetyInspectionChecklist/SafetyTemplate_ChangeActiveStatus', body).then(
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
                                <TableRow style={{ backgroundColor: '#89CFF0' }}>
                                    <TableCell style={{ padding: '4px' }}><b>Label</b></TableCell>
                                    <TableCell style={{ padding: '4px' }}><b>Input Field Type</b></TableCell>
                                    <TableCell style={{ padding: '4px' }}><b>Is Checkbox Required</b></TableCell>
                                    <TableCell style={{ padding: '4px' }}><b>UDF1</b></TableCell>
                                    <TableCell style={{ padding: '4px' }}><b>UDF2</b></TableCell>
                                    <TableCell style={{ padding: '4px' }}><b>UDF3</b></TableCell>
                                    <TableCell style={{ padding: '4px', display: 'none' }}><b>ID</b></TableCell>
                                    <TableCell style={{ padding: '4px' }}><b>Sequence</b></TableCell>
                                    <TableCell style={{ padding: '4px' }}><b>Activated</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow style={{ backgroundColor: row.IsActive == 'Y' ? '#C3FDB8' : '#ffcccb' }}>
                                        <TableCell style={{ padding: '4px' }}>{row.Label}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.InputFieldType}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.CheckboxRequired}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.UDF1}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.UDF2}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.UDF3}</TableCell>
                                        <TableCell style={{ padding: '4px', display:'none' }}>{row.ID}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <div style={{ display: 'flex' }}>
                                                <IconButton style={{ padding: '2px' }}
                                                    onClick={(e) => { moveUp(row) }}
                                                    aria-label="Move Up"
                                                >
                                                    {row.IsActive == 'Y' ? <KeyboardArrowUpIcon style={{ color: '#4169E1' }} /> : <KeyboardArrowUpIcon style={{ display: 'none' }} />}
                                                </IconButton>
                                                <IconButton style={{ padding: '2px' }}
                                                    onClick={(e) => { moveDown(row) }}
                                                    aria-label="Move Down"
                                                >
                                                    {row.IsActive == 'Y' ? <KeyboardArrowDownIcon style={{ color: '#FF5733' }} /> : <KeyboardArrowDownIcon style={{ display: 'none' }} />}
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <IconButton style={{ padding: '2px' }}
                                                onClick={(e) => { changeActivationStatus(row) }}
                                                aria-label="Activate/Inactivate"
                                            >
                                                {row.IsActive == 'Y' ? <CancelOutlinedIcon style={{ color: '#FF5733' }} /> : <CheckCircleOutlineIcon style={{ color: '#32CD32' }} />}
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