import React, { useState, useEffect } from 'react';
import Screen from '../../../components/screen/screen';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';
import ConfigureForm from './configureForm';

import Typography from '@mui/material/Typography';
import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';

import { useSelector } from 'react-redux';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';

import api from '../../../components/api/api';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, TestdateObjToInput, formatDate } from '../../../components/fields/dateHelpers';



const useStylesGrid = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);



const defaultInput = {
    'UserID': '',
    'DCMUser': ''
}

const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: pink[600],
        '&:hover': {
            backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: pink[600],
    },
}));

export default function SafetyIncidents() {

    const classesGrid = useStylesGrid();

    const [array, setArray] = useState([
        {
            "DCMUser": user,
            "Label": "",
            "TextFieldValue": "",
            "SelectedCheckBoxItem": "",
            "SelectedRadioButtonItem": ""
        },
    ])

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

    const [tableData, setTableData] = useState([]);
    const user = useSelector(store => store.user); // update by will be dcm user 

    var today = new Date();
    today.setDate(today.getDate());

    const [toggleToTriggerOpenDialog, setToggleToTriggerOpenDialog] = useInputState(false);

    useEffect(() => {
        getChecklistTemplate();
    }, []);

    const getChecklistTemplate = async () => {

        let body = new URLSearchParams({
            'DCMUser': user,
            'Date': today.toString().substr(4, 11),
        });

        await api.post('/Maintenance/SafetyInspectionChecklist/getTemplate', body).then(
            res => {
                let data = res.data;
                setTableData(data);

            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {
                        console.log(err.response)
                    }
                    else {
                    }
                }
            );
    };



    const addCompletedChecklist = async () => {

        try {

            tableData.forEach((item) => {

                let body = new URLSearchParams({
                    'DCMUser': user,
                    'ChecklistID': item.ChecklistID,
                    'Sequence': item.Sequence,
                    'InputFieldType': item.InputFieldType,
                    'Label': item.Label,
                    'TextFieldValue': item.TextFieldValue,
                    'SelectedCheckBoxItem': item.SelectedCheckBoxItem,
                    'SelectedRadioButtonItem': item.SelectedRadioButtonItem
                });

                api.post('/Maintenance/SafetyInspectionChecklist/addNewChecklist', body).then(
                    res => {
                        let data = res.data;
                    }).catch(
                        err => {
                            // TODO: Error handling
                            if (err.response) {
                                console.log(err.response)
                            }
                            else {
                            }
                        }
                    );
            });

            window.alert("Check list has been added to DCMetrics.")
            setTableData([]);
            getChecklistTemplate();

        } catch (error) {
            // ...
        }

    };

    const handleConfigurationDialog = () => {
        setToggleToTriggerOpenDialog(!toggleToTriggerOpenDialog);
    }

    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    return (
        <Screen>
            <div className={classesGrid.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classesGrid.paper} style={{ 'paddingBottom': '5em' }}>
                            <Box sx={{ width: '100%', textAlign: 'left', paddingBottom: '1em' }}>
                                {tableData.map(obj => {

                                    switch (obj.InputFieldType) {
                                        case "Textfield":
                                            return (
                                                <div>
                                                    <Typography variant="subtitle1" gutterBottom component="div">
                                                        {obj.Label}
                                                    </Typography>
                                                    <div style={{marginBottom:'2em'}}>
                                                        {obj.CheckboxRequired == "Y"
                                                            ? <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'row', position: 'flex', alignItems: 'center' }}>
                                                                    <GreenSwitch {...label} onChange={(e) => obj.SelectedCheckBoxItem = (e.target.checked)} /> <label>NO</label>
                                                                </div>
                                                                <TextField id="outlined-basic" label="Comment" variant="outlined" onChange={(e) => obj.TextFieldValue = (e.target.value)} style={{ width: '100%', marginLeft: '2%' }} />
                                                            </div>
                                                            : <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                <TextField id="outlined-basic" label="Comment" variant="outlined" onChange={(e) => obj.TextFieldValue = (e.target.value)} style={{ width: '100%', marginLeft: '2%' }} />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            );
                                            break;

                                        case "Radio":
                                            return (

                                                <div>
                                                    <Typography variant="subtitle1" gutterBottom component="div">
                                                        {obj.Label}
                                                    </Typography>

                                                    <RadioGroup
                                                        aria-label="gender"
                                                        defaultValue="female"
                                                        name="radio-buttons-group"
                                                        onChange={(e) => obj.SelectedRadioButtonItem = (e.target.value)}
                                                        style={{ marginBottom: '2em', }}
                                                    >
                                                        {/* <FormControlLabel value={obj.UDF1} control={<Radio />} label={obj.UDF1} /> */}

                                                        {obj.UDF1 == "" ? "" : <FormControlLabel value={obj.UDF1} control={<Radio />} label={obj.UDF1} />}
                                                        {obj.UDF2 == "" ? "" : <FormControlLabel value={obj.UDF2} control={<Radio />} label={obj.UDF2} />}
                                                        {obj.UDF3 == "" ? "" : <FormControlLabel value={obj.UDF3} control={<Radio />} label={obj.UDF3} />}
                                                    </RadioGroup>
                                                </div>
                                            )
                                        default:
                                            break;
                                    }
                                })}


                            </Box>

                            <Button variant="contained" endIcon={<CloudUploadIcon />} onClick={addCompletedChecklist} style={{ 'float': 'left',color:'white',backgroundColor:'rgb(35,168,224)' }}>
                                Save Form
                            </Button>
                            <Button variant="contained" endIcon={<SettingsIcon />} onClick={handleConfigurationDialog} style={{ 'marginLeft': '1em', 'float': 'right',color:'white',backgroundColor:'rgb(35,168,224)' }}>
                                Configure Form
                            </Button>
                            <Button variant="contained" endIcon={<DescriptionIcon />} onClick={ConfigureForm} style={{ 'marginLeft': '1em', 'float': 'right',color:'white',backgroundColor:'rgb(35,168,224)' }}>
                                Load Old Forms
                            </Button>
                            <ConfigureForm
                                toggleToTriggerOpenDialog={toggleToTriggerOpenDialog}
                            />
                        </Paper>

                    </Grid>

                </Grid>
            </div>

        </Screen>
    );
}