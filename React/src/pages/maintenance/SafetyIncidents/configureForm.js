import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import ConfigureForm_TableComponent from './configureForm_TableComponent';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const useStylesGrid = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            // textAlign: 'center',
            color: theme.palette.text.secondary,

        },
    }),
);

export default function ConfigureForm(props) {
    const classesGrid = useStylesGrid();

    const [open, setOpen] = React.useState(false);
    const [componentLabelText, setComponentLabelText] = React.useState("");
    const [displayCheckboxRequired, setDisplayCheckboxRequired] = React.useState('block');
    const [displayRadioOptions, setDisplayRadioOptions] = React.useState('none');

    const [triggerChecklistsReload, setTriggerChecklistsReload] = React.useState(false);

    // input field type drop down
    const [inputFieldType, setInputFieldType] = React.useState('Textfield');
    //is check box requried drop down (Yes/No)
    const [isCheckBoxRequired, setIsCheckBoxRequired] = React.useState('N');

    const [radioOption1, setRadioOption1] = React.useState("");
    const [radioOption2, setRadioOption2] = React.useState("");
    const [radioOption3, setRadioOption3] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleChange_SelectInputFieldType = (event) => {
        if (event.target.value == "Textfield") {
            setDisplayCheckboxRequired('block')
        }
        switch (event.target.value) {
            case "Textfield": setDisplayCheckboxRequired('block');
                setDisplayRadioOptions('none');
                setRadioOption1("");
                setRadioOption2("");
                setRadioOption3("");
                break;

            case "Radio": setDisplayRadioOptions('block');
                setDisplayCheckboxRequired('none');
                setIsCheckBoxRequired('N');
                break;

            default:

        }
        setInputFieldType(event.target.value);
    };

    const handleChangeCheckBoxRequired = (event) => {
        setIsCheckBoxRequired(event.target.value);
    };

    useEffect(() => { // runs everytime an event is clicked (toggle boolean prop value triggers this)

        setOpen(true);

    }, [props.toggleToTriggerOpenDialog])

    useEffect(() => { // on first load, we ensure dialog is closed (setOpen is false)

        setOpen(false);
    }, [])

    const user = useSelector(store => store.user); // update by will be dcm user 

    const addComponentToChecklistTemplate = async () => {

        if (componentLabelText == "") {
            window.alert("Please add a label for your component");
            return;
        }
        if (inputFieldType == "Radio" &&
            radioOption1 == "" &&
            radioOption2 == "" &&
            radioOption3 == "") {

            window.alert("Please add at least ONE option for your radio button component.");
            return;
        }

        try {
            let body = new URLSearchParams({
                'DCMUser': user,
                'InputFieldType': inputFieldType,
                'Label': componentLabelText,
                'CheckboxRequired': isCheckBoxRequired,
                'UDF1': radioOption1,
                'UDF2': radioOption2,
                'UDF3': radioOption3,
            });

            api.post('/Maintenance/SafetyInspectionChecklist/AddNewComponentToSafetyChecklistTemplate', body).then(
                res => {
                    let data = res.data;
                    setTriggerChecklistsReload(!triggerChecklistsReload);
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
            
            window.alert("New component has been added to safety checklist template.")


        } catch (error) {
            // ...
        }

    };

    return (
        <div>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Configure Safety Checklist Form
                        </Typography>
                        {/* <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button> */}
                    </Toolbar>
                </AppBar>

                <div>
                    <Paper className={classesGrid.paper}>
                        <Typography variant="subtitle1" gutterBottom component="div">
                            Add a Label to your form component
                        </Typography>

                        <TextField id="outlined-basic" label="Label text" variant="outlined" onChange={(e) => setComponentLabelText(e.target.value)} style={{ width: '100%' }} />

                        <Typography variant="subtitle1" gutterBottom component="div">
                            Input Field Type
                        </Typography>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={inputFieldType}
                            label="InputField"
                            onChange={handleChange_SelectInputFieldType}
                        >
                            <MenuItem value={"Textfield"} defaultValue>Text Field</MenuItem>
                            <MenuItem value={"Radio"}>Radio Button</MenuItem>
                        </Select>

                        <div style={{ 'display': displayCheckboxRequired }}>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                Is a Yes/No Checkbox required for the text field?
                            </Typography>

                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={isCheckBoxRequired}
                                label="InputField"
                                onChange={handleChangeCheckBoxRequired}
                            >
                                <MenuItem value={"Y"} defaultValue>Yes</MenuItem>
                                <MenuItem value={"N"}>No</MenuItem>
                            </Select>

                        </div>

                        <div style={{ 'display': displayRadioOptions }}>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                Add up to 3 options for radio button
                            </Typography>

                            <TextField id="outlined-basic" label="First Option" variant="outlined" onChange={(e) => setRadioOption1(e.target.value)} />
                            <TextField id="outlined-basic" label="Second Option" variant="outlined" onChange={(e) => setRadioOption2(e.target.value)} style={{ marginLeft: '1em' }} />
                            <TextField id="outlined-basic" label="Third Option" variant="outlined" onChange={(e) => setRadioOption3(e.target.value)} style={{ marginLeft: '1em' }} />

                        </div>

                    </Paper>
                    <Button variant="contained" endIcon={<AddCircleOutlineIcon />} onClick={addComponentToChecklistTemplate} style={{ 'float': 'left', marginTop: '1em', marginLeft: '1em' }}>
                        Add To Template
                    </Button>
                </div>
                <div style={{ marginTop: '1em', marginBottom: '1em' }}>
                    <Paper className={classesGrid.paper}>
                        <ConfigureForm_TableComponent
                            triggerChecklistsReload={triggerChecklistsReload}
                        />
                    </Paper>
                </div>
            </Dialog>
        </div>
    );
}
