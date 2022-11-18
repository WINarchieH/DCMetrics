import React, { useState, useEffect } from 'react';
import Screen from '../../../components/screen/screen';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import api from '../../../components/api/api';
import TextField from '@material-ui/core/TextField';

import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { useSelector } from 'react-redux';

import Checklists from './ChecklistManagement';

const useStylesCards = makeStyles({
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

const useStylesChips = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));


export default function UserManagementConfig() {
    const classesCards = useStylesCards();
    const classesGrid = useStylesGrid();
    const classesChips = useStylesChips();

    const [skillsChip, setSkillsChip] = React.useState([]);
    const [triggerChecklistsReload,setTriggerCheklistsReload] = React.useState(false);

    useEffect(() => { // Get data at tab load

        getAllSkills();
        
    }, [])


    const defaultInput = {
        'DCMUser': ''
    }

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

    const user = useSelector(store => store.user);
    defaultInput.DCMUser = user;

    const getAllSkills = async () => {
        //setTableLoading(true);

        await api.post('/UserManagement/UserManagementConfig/ConfigureSkills_Get').then(
            res => {
                // dropdownData['UserList'] = data.map(x => x);
                setSkillsChip(res.data);
            }).catch(() => { });
    };

    const addSkill = async (e) => {
        if (e.key === 'Enter' &&  e.target.value != "") {
            input.DCMUser = defaultInput.DCMUser;
            input.Skill = e.target.value;
            let body = new URLSearchParams(input);

            await api.post('UserManagement/UserManagementConfig/ConfigureSkills_Add', body).then(
                res => {
                    let data = res.data;
                    if (data == "New Skill has been Added.") {
                        getAllSkills();
                    } else if (data == "Skill is already added!") {
                        window.alert("Skill already exists.");
                        return;
                    }
                    else {
                        window.alert("Failed to add skill.");
                    }

                }).catch(
                    err => {
                        // TODO: Error handling
                        window.alert("Failed to add skill.");
                    }
                );
        }

    };

    
    const addChecklist = async (e) => {
        if (e.key === 'Enter' &&  e.target.value != "") {
            input.DCMUser = defaultInput.DCMUser;
            input.Checklist = e.target.value;
            let body = new URLSearchParams(input);

            await api.post('UserManagement/UserManagementConfig/ConfigureOnboardingChecklist_Add', body).then(
                res => {
                    let data = res.data;
                    if (data == "New Checklist has been Added.") {
                        // getAllChecklists();
                        setTriggerCheklistsReload(!triggerChecklistsReload);//force reload checklists component
                    } else if (data == "Checklist is already added!") {
                        window.alert("Checklist task already exists.");
                        return;
                    }
                    else {
                        window.alert("Failed to add Checklist.");
                    }

                }).catch(
                    err => {
                        // TODO: Error handling
                        window.alert("Failed to add Checklist.");
                    }
                );
        }

    };
   

    return (
        <Screen>
            <div className={classesGrid.root} >
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Card className={classesCards.root} style={{ backgroundColor:'rgb(241,242,242)' }} >
                            <CardContent>
                                <Typography variant="h5" component="h2" style={{ fontFamily:'Montserrat',color:'rgb(35,168,224)' }}>
                                    Manage Skills
                                </Typography>
                                <Typography>
                                    <div style={{paddingTop:'1em'}}>
                                        <TextField
                                            id="outlined-full-width-skill"
                                            label="Skill"
                                            style={{ margin: 8 , color:'black' }}
                                            placeholder="Add a new Skill..."
                                            helperText="Type new skill and press Enter"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            onKeyDown={addSkill}
                                        />

                                    </div>
                                </Typography>
                                    <Typography className={classesChips.root} gutterBottom>
                                        {skillsChip.map(d => (<Chip label={d.Skill}  style={{ border:'0',  backgroundColor:'rgb(35,168,224)' ,fontFamily:'Montserrat', color :'white'}}  variant="outlined" />))}
                                    </Typography>

                            </CardContent>
                            <CardActions>
                                {/* <Button size="small">Learn More</Button> */}
                            </CardActions>
                        </Card>
                    </Grid>

                    <Grid item xs={6}>
                        <Card className={classesCards.root} style={{ backgroundColor:'rgb(241,242,242)'}}>
                            <CardContent>
                                <Typography variant="h5" component="h2" style={{ fontFamily:'Montserrat',color:'rgb(35,168,224)' }}>
                                    Manage Onboarding Checklist
                                </Typography>
                                <Typography>
                                    <div style={{paddingTop:'1em'}}>
                                        <TextField
                                            id="outlined-full-width-checklist"
                                            label="Checklist"
                                            style={{ margin: 8, color:'black' }}
                                            placeholder="Add a new Checklist Item..."
                                            helperText="Type new task and press Enter"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            onKeyDown={addChecklist}
                                        />

                                    </div>
                                </Typography>
                                    <Checklists
                                        triggerChecklistsReload={triggerChecklistsReload}
                                    />

                            </CardContent>
                            <CardActions>
                                {/* <Button size="small">Learn More</Button> */}
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Screen>

    );
}
