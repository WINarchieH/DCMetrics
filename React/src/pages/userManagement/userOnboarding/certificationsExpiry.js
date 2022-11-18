import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { useSelector } from 'react-redux';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';

import api from '../../../components/api/api';
import props from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
//date picker
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';

// table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
    root: {
        minWidth: 275,
        maxWidth: 360,
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',

    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});


const useStylesSelect = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const useStylesGrid = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));


const defaultInput = {
    'UserID': '',
    'DCMUser': ''
}


const dropdownData = {
    'Certificates': [],
    'CertificatesForUser': []
};

export default function UserCerts(props) {

    const [tableData, setTableData] = React.useState([]);

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const classesGrid = useStylesGrid();

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

    const user = useSelector(store => store.user);
    defaultInput.DCMUser = user;

    const [selectedDate, setSelectedDate] = React.useState((new Date()));

    useEffect(() => { // Get data at tab load

        getTable(props.userID);
        getDropdownAllCerts();
        getDropdownAllCertsForUser(props.userID);

    }, [])


    const getDropdownAllCerts = async (selectedUser) => {

        input.DCMUser = defaultInput.DCMUser;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/Certificates', body).then( // Roles List 
            res => {
                let data = res.data;
                dropdownData['Certificates'] = data.map(x => x.Certificate);
            });
    };

    const getDropdownAllCertsForUser = async (selectedUser) => { // only certs with an expiry in the system

        input.DCMUser = defaultInput.DCMUser;
        input.UserID = selectedUser;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/CertificatesForUser', body).then( // Roles List 
            res => {
                let data = res.data;
                dropdownData['CertificatesForUser'] = data.map(x => x.Certificate);
            });
    };

    const getTable = async (selectedUser) => {
        //setTableLoading(true);
        getDropdownAllCertsForUser(props.userID);

        input.DCMUser = defaultInput.DCMUser;
        input.UserID = selectedUser;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/UserCerts', body).then(
            res => {
                let data = res.data;
                data = data.map(x => {
                    return x;
                });
                setTableData(data);
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

    const handleDateChange = (date) => {
        setSelectedDate(date);

    };

    // for pop up select component
    const classesSelect = useStylesSelect();
    const [open, setOpen] = React.useState(false);
    const [open_Upload, setOpen_Upload] = React.useState(false);
    const [cert, setCert] = React.useState('');
    const [cert_Upload, setCert_Upload] = React.useState('');

    const [files, setFiles] = React.useState([]);
    //const [btnPopUpText, setBtnPopUpText] = React.useState('Select Certificate');
    const [imgData, setImgData] = React.useState();
    const [showImage, setShowImage] = React.useState(false);

    const handleChange = (event) => {
        setCert(event.target.value || '');
        //setBtnPopUpText(event.target.value);
    };

    const handleChange_Upload = (event) => {
        setCert_Upload(event.target.value || '');
        //setBtnPopUpText(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickOpen_Upload = () => {
        getDropdownAllCertsForUser(props.userID);
        setOpen_Upload(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCert('');
    };

    const handleClose_Upload = () => {
        setFiles([]);
        setCert_Upload('');
        setOpen_Upload(false);
    };

    const handleOk = async () => {

        if (cert == "" || dropdownData['Certificates'].indexOf(cert) < 0) {
            window.alert("Please select a certificate from the list.");
            return;
        }

        setOpen(false);

        input.DCMUser = defaultInput.DCMUser;
        input.UserID = props.userID;
        input.Certificate = cert;
        input.Expiry = selectedDate.toString().substr(4, 12);
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/AddCertificateExpiry', body).then(
            res => {
                let data = res.data;
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {

                    }
                    else {
                    }
                }
            );
        setCert('');
        getTable(props.userID);
    };


    const fileUpload = async (e) => {
        setFiles(e.target.files);
    };


    const handleOk_Upload = async () => {

        if (cert_Upload == "" || dropdownData['CertificatesForUser'].indexOf(cert_Upload) < 0) {
            window.alert("Please select a certificate from the list.");
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

            input.DCMUser = defaultInput.DCMUser;
            input.UserID = props.userID;
            input.Certificate = cert_Upload;
            input.File = e.target.result.split(',')[1];

            let body = new URLSearchParams(input);

            await api.post('/Maintenance/UserInfo/UploadFile', body).then(
                res => {
                    let data = res.data;
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
                setFiles([]);
                setCert_Upload('');
                
                setOpen_Upload(false);
        };
        
    };


    const getImg = async (row) => {
        setShowImage(true);

        input.DCMUser = defaultInput.DCMUser;
        input.UserID = row.UserID;
        input.Certificate = row.Certificate;
        //input.UserID = selectedUser;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/RetrieveFile', body).then(
            res => {
                let data = res.data;

                setImgData(data[0].File);
                // console.log(data[0].File);
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


    return (
        <div className={classesGrid.root}>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Card variant="outlined" style={{ maxWidth: '360px', height: '50%' }}>
                        <CardContent>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    {/* <DropDown name='Certificates' label='Certificates' options={dropdownData['Certificates']} onChange={handleInputEvent} ></DropDown> */}
                                    <Button variant="outlined" color="primary" onClick={handleClickOpen}>Add/Update Certificate</Button>
                                    <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
                                        <DialogTitle>Select A Certificate</DialogTitle>
                                        <DialogContent>
                                            <form className={classesSelect.container}>
                                                <FormControl className={classesSelect.formControl}>
                                                    <InputLabel htmlFor="demo-dialog-native">Certificate</InputLabel>
                                                    <Select
                                                        native
                                                        value={cert}
                                                        onChange={handleChange}
                                                        input={<Input id="demo-dialog-native" />}

                                                    >
                                                        <option aria-label="None" value="Select Certificate" />
                                                        {dropdownData['Certificates'].map((cert) => (
                                                            <option value={cert}>{cert}</option>
                                                        ))}

                                                    </Select>

                                                    <div>
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <KeyboardDatePicker
                                                                disableToolbar
                                                                variant="inline"
                                                                format="dd/MM/yyyy"
                                                                margin="normal"
                                                                id="date-picker-inline"
                                                                label="Expiry Date"
                                                                value={selectedDate}
                                                                onChange={handleDateChange}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                            />
                                                        </MuiPickersUtilsProvider>
                                                    </div>
                                                </FormControl>

                                            </form>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleOk} color="primary">
                                                Save
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Typography>

                            </CardContent>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" style={{ maxWidth: '360px', height: '50%' }}>
                        <CardContent>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <Button variant="outlined" color="primary" onClick={handleClickOpen_Upload}>Upload Certificate Image</Button>
                                    <Dialog disableBackdropClick disableEscapeKeyDown open={open_Upload} onClose={handleClose_Upload}>
                                        <DialogTitle>Upload Certificate</DialogTitle>
                                        <DialogContent>
                                            <form className={classesSelect.container}>
                                                <FormControl className={classesSelect.formControl}>
                                                    <InputLabel htmlFor="demo-dialog-native">Certificate</InputLabel>
                                                    <Select
                                                        native
                                                        value={cert_Upload}
                                                        onChange={handleChange_Upload}
                                                        input={<Input id="demo-dialog-native" />}

                                                    >
                                                        <option aria-label="None" value="Select Certificate" />
                                                        {dropdownData['CertificatesForUser'].map((cert) => (
                                                            <option value={cert}>{cert}</option>
                                                        ))}

                                                    </Select>

                                                    <div>
                                                        <input type="file" name="file" accept="image/png, image/gif, image/jpeg" onChange={(e) => fileUpload(e)} style={{paddingTop:'1em'}}/>
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
                                </Typography>
                            </CardContent>
                        </CardContent>
                    </Card>




                </Grid>
                <Grid item xs={4}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="Certificates Expiry Dates">
                            <TableHead>
                                <TableRow >
                                    <TableCell ><b>Certificate</b></TableCell>
                                    <TableCell ><b>Expiry</b></TableCell>
                                    <TableCell ><b>Image</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow>
                                        <TableCell>{row.Certificate}</TableCell>
                                        <TableCell>{row.Expiry}</TableCell>
                                        <TableCell>
                                            <IconButton style={{ padding: '2px' }}
                                                onClick={(e) => { getImg(row) }}
                                                aria-label="View Image"
                                            >
                                                {row.ImageUploaded == 'Y' ? <ImageSearchIcon style={{ color: '#32CD32' }} /> : ""}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={4}>
                    <div style={{ display: showImage ? '' : 'none' }}>
                        <img src={`data:image/jpeg;base64,${imgData}`} height="200" alt="Image preview..." />
                    </div>

                </Grid>
            </Grid>

        </div>

    );
}
