import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import api from '../../../components/api/api';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { useSelector } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import props from 'prop-types';
import DropDown from '../../../components/fields/dropdown';
import TextField from '../../../components/fields/textfield';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));


const useStylesCard = makeStyles({
    root: {
        minWidth: 275,
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

const defaultInput = {
    'UserID': '',
    'DCMUser': ''
}


const dropdownData = {
    'Available Skills': []
};

export default function SkillsChips(props) {
    const classes = useStyles();
    const classesCard = useStylesCard();

    const user = useSelector(store => store.user);
    defaultInput.DCMUser = user;

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [tableData, setTableData] = useState([]);

    const [skillChip, setSkillChip] = useState("");



    useEffect(() => { // Get data at tab load

        getTable(props.userID);
        getDropdown();

    }, [])

    const getDropdown = async () => {

        input.DCMUser = defaultInput.DCMUser;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/Skills', body).then( // Roles List 
            res => {
                let data = res.data;
                dropdownData['Available Skills'] = data.map(x => x.Skill);
            });
    };

    // Function to send requests to update table
    const getTable = async (selectedUser) => {
        //setTableLoading(true);

        input.DCMUser = defaultInput.DCMUser;
        input.UserID = selectedUser;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/UserSkills', body).then(
            res => {
                let data = res.data;
                // Convert dates to date objects  
                data = data.map(x => {
                    return x;
                });
                setTableData(data);
                // console.log(data);
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

    const addSkill = async (e) => {

        input.DCMUser = defaultInput.DCMUser;
        input.UserID = props.userID;
        input.Skill = e.target.value;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/AddUserSkill', body).then(
            res => {
                let data = res.data;
                if (data == "New Skill Added for user.") {
                    getTable(props.userID);
                } else if (data == "Skill already exists for this user.") {
                    //do nothing
                    return;
                }
                else {
                    window.alert("Failed to add skill for user.");
                }

            }).catch(
                err => {
                    // TODO: Error handling
                    window.alert("Failed to add skill for user.");
                }
            );
    };


    const handleDelete = async (h) => {

        input.DCMUser = defaultInput.DCMUser;
        input.UserID = props.userID;
        input.Skill = h;
        let body = new URLSearchParams(input);

        await api.post('/Maintenance/UserInfo/RemoveUserSkills', body).then(
            res => {

                if (res.data == 'Skill has been removed for user.') {

                    //window.alert("Skill has been removed for user.");
                }
                else {
                    window.alert("Failed to remove skill for this user.");
                }
                getTable(props.userID);
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
        <div className={classes.root}>

            <Card className={classesCard.root} variant="outlined" style={{maxWidth: '460px'}}>

                <CardContent>
                    <CardContent>
                        <Typography className={classesCard.title} color="textSecondary" gutterBottom>
                            
                            <DropDown name='Skills' label='Available Skills' options={dropdownData['Available Skills']} onChange={(e) => addSkill(e)} ></DropDown>
                        </Typography>
                    </CardContent>
                    <Typography className={classes.root} color="textSecondary" gutterBottom>
                        {tableData.map(d => (<Chip label={d.Skill} onDelete={() => handleDelete(d.Skill)} color="primary" variant="outlined" />))}
                    </Typography>

                </CardContent>

            </Card>



        </div>
    );
}
