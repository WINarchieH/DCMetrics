import React, { useState, useEffect } from 'react';
import Screen from '../../../components/screen/screen';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import ClearIcon from '@material-ui/icons/Clear';

import TextField from '@material-ui/core/TextField';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';

import { useSelector } from 'react-redux';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';

import api from '../../../components/api/api';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, TestdateObjToInput, formatDate } from '../../../components/fields/dateHelpers';
import Button from '@material-ui/core/Button';
//date picker
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import Moment from 'moment';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';

const useStylesImgList = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        imageList: {
            width: 900,
            height: 950,
        },
        icon: {
            color: 'rgba(255, 255, 255, 0.54)',
        },
    }),
);

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

const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const useStylesModal = makeStyles((theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            top: '3%',
            left: '10%',
            overflow: 'scroll',
            maxHeight: '90%',
            display: 'block',
            width: 600,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),

        },
    }),
);


const defaultInput = {
    'UserID': '',
    'DCMUser': ''
}

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const itemData = [
 *   {
 *     img: image,
 *     incident: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
export default function SafetyIncidents() {
    const classesImgList = useStylesImgList();
    const classesGrid = useStylesGrid();
    const classesSelect = useStylesSelect();
    const classesModal = useStylesModal();

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

    const [tableData, setTableData] = useState([]);
    const user = useSelector(store => store.user); // update by will be dcm user 
    const [selectedItem, setSelectedItem] = useState({});

    var dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 56);
    var dateTo = new Date();
    dateTo.setDate(dateTo.getDate());

    const [fromDate, setFromDate] = React.useState(dateFrom);
    const [toDate, setToDate] = React.useState(dateTo);

    const handleFromDateChange = (date) => {
        setFromDate(date);
    };
    const handleToDateChange = (date) => {
        setToDate(date);
    };


    // File Upload Dialog Relevant
    const [open_Upload, setOpen_Upload] = React.useState(false);
    const [files, setFiles] = React.useState([]);
    const [incidentText, setIncidentText] = React.useState('');
    const [incidentUploadDate, setIncidentUploadDate] = React.useState(new Date());

    const handleClose_Upload = () => {
        setFiles([]);
        setIncidentText();
        setIncidentUploadDate(new Date());
        setOpen_Upload(false);
    };

    const handleClickOpen_Upload = () => {
        setOpen_Upload(true);
    };

    const handleChange_IncidentText = (event) => {
        setIncidentText(event.target.value || '');
    };
    const handleIncidentUpload_DateChange = (date) => {
        setIncidentUploadDate(date);
    };

    const fileUpload = async (e) => {
        setFiles(e.target.files);
    };


    const handleOk_Upload = async () => {

        if (incidentText == "") {
            window.alert("Please add safety incident information.");
            return;
        }
        if (files.length == 0 || files == "undefined") {
            window.alert("Please select an image to upload.");
            return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(files[0]);

        reader.onload = async (e) => {
            // console.warn(e.target.result);
            // const formData = { 'File': e.target.result };

            input.DCMUser = user;
            input.img = e.target.result.split(',')[1];
            input.incident = incidentText;
            input.date = incidentUploadDate.toString().substr(4, 11);
            let body = new URLSearchParams(input);

         
            await api.post('/Maintenance/SafetyIncidents/AddIncident', body).then(
                res => {
                    let data = res.data;
                    if (data !== "New safety incident has been recorded.") {
                        window.alert("Upload failed, please try again!");
                        return;
                    }
                }).catch(
                    err => {
                        // TODO: Error handling
                        if (err.response) {
                            window.alert("Upload failed, please try again!");
                            return;
                        }
                        else {
                        }
                    }
                );
            setFiles([]);
            setIncidentText();
            setIncidentUploadDate(new Date());
            setOpen_Upload(false);
            getIncidents();
        };
    };


    const deleteIncident = async (item) => {

        let body = new URLSearchParams({
            'DCMUser': user,
            'ID': item.ID
        });

        await api.post('/Maintenance/SafetyIncidents/RemoveIncident', body).then(
            res => {
                let data = res.data;
                if (res.data == "Safety Incident has been removed.") {
                    getIncidents();
                }
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {
                        console.log(err.response)
                        window.alert("Safety Incident cannot be removed. Please try again.");
                        return;
                    }
                    else {
                    }
                }
            );

        // setSelectedItem(item);
        // setOpen(true);
    };

    useEffect(() => {
        getIncidents();
    }, []);

    const getIncidents = async () => {

        let body = new URLSearchParams({
            'DCMUser': user,
            'fromDate': fromDate.toString().substr(4, 11), // from and to state vars always stay updated
            'toDate': toDate.toString().substr(4, 11)
        });

        await api.post('/Maintenance/SafetyIncidents/getIncidents', body).then(
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

    const onFetchButtonClick = (e) => {
        // console.log(fromDate);
        // console.log(toDate);
        getIncidents();
    }

    //modal

    const [open, setOpen] = React.useState(false);

    const handleOpen = (item) => {

        setSelectedItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const body = (
        <div className={classesModal.paper}>
            <h2 id="incident-title">{selectedItem.incident}</h2>
            <p id="incident-date">
                <u>Reported By: </u>
                {selectedItem.fullName} <span style={{ float: 'right' }}><u>On: </u> {selectedItem.date}</span>
                <br /><br />
                <img src={`data:image/jpeg;base64,${selectedItem.img}`} style={{ maxHeight: 'auto', maxWidth: '100%' }} alt="img" />
            </p>
        </div>
    );

    return (
        <Screen>
            <div className={classesGrid.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classesGrid.paper}>

                            <div>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="From Date"
                                        value={fromDate}
                                        onChange={handleFromDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        style={{ paddingRight: '1em' }}
                                    />
                                </MuiPickersUtilsProvider>

                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="To Date"
                                        value={toDate}
                                        onChange={handleToDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    style={{ marginLeft: '40px', marginTop: '26px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                                    onClick={(e) => onFetchButtonClick(e)}
                                >
                                    Update
                                </Button>

                                <IconButton aria-label={`Add New incident`} style={{ color: '#3f51b5', marginTop: '26px', paddingLeft: '1em' }} onClick={handleClickOpen_Upload}>
                                    <AddAPhoto />
                                </IconButton>

                                <Dialog disableBackdropClick disableEscapeKeyDown open={open_Upload} onClose={handleClose_Upload}>
                                    <DialogTitle>Add New Incident</DialogTitle>
                                    <DialogContent>
                                        <form className={classesSelect.container}>
                                            <FormControl className={classesSelect.formControl}>
                                                <TextField required id="incidentTextID" label="Incident" value={incidentText} onChange={handleChange_IncidentText} style={{ paddingBottom: '1em' }} />

                                                <div>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <KeyboardDatePicker
                                                            disableToolbar
                                                            variant="inline"
                                                            format="dd/MM/yyyy"
                                                            margin="normal"
                                                            id="date-picker-inline"
                                                            label="From Date"
                                                            value={incidentUploadDate}
                                                            onChange={handleIncidentUpload_DateChange}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date',
                                                            }}
                                                            style={{ paddingBottom: '1em' }}
                                                        />
                                                    </MuiPickersUtilsProvider>
                                                </div>

                                                <div>
                                                    <input type="file" name="file" accept="image/png, image/gif, image/jpeg" onChange={(e) => fileUpload(e)} />
                                                </div>
                                            </FormControl>

                                        </form>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose_Upload} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleOk_Upload} color="primary">
                                            Upload
                                        </Button>
                                    </DialogActions>
                                </Dialog>


                            </div>
                            <div className={classesImgList.root}>
                                <ImageList rowHeight={300} className={classesImgList.imageList} style={{ padding: '10px', height: 'auto', width: 'auto', overflow: 'hidden' }}>
                                    {/* <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
                                        <ListSubheader component="div">SAFETY INCIDENTS</ListSubheader>
                                    </ImageListItem> */}
                                    {tableData.map((item) => (
                                        <ImageListItem key={item.ID} style={{minWidth:'300px'}}>
                                            <img src={`data:image/jpeg;base64,${item.img}`} style={{ maxHeight: '300px', maxWidth: '300px'}} alt={item.incident} />
                                            <ImageListItemBar
                                                title={item.incident}
                                                subtitle={<span>by: {item.fullName} ({item.date})</span>}
                                                actionIcon={
                                                    <div>
                                                        <IconButton aria-label={`info about ${item.incident}`} className={classesImgList.icon} onClick={() => handleOpen(item)}>
                                                            <InfoIcon />

                                                        </IconButton>
                                                        <IconButton>
                                                            <ClearIcon style={{ color: '#FF3131' }} onClick={() => deleteIncident(item)} />
                                                        </IconButton>
                                                    </div>
                                                }

                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </div>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                
                            >
                                {body}
                            </Modal>
                        </Paper>
                    </Grid>

                </Grid>
            </div>

        </Screen>
    );
}