import React, { useEffect } from 'react';
import Screen from '../../../components/screen/screen';
import './maintainIndirectActivity.scss';

import api from '../../../components/api/api';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// Accordiam
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'


//Model
import TextField from '../../../components/fields/textfield';
import { useInputState, } from '../../../components/hooks/hooks';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import DropDown from '../../../components/fields/dropdown';
import Divider from '@material-ui/core/Divider';
import AccordionActions from '@material-ui/core/AccordionActions';



//MultiSelect

import Select from "react-select";

const defaultInput = {
  'Activity': '',
  'ActivityGroup': '',
  'ActivityType': 'Direct',
  'DeleteActivity': ''
};

const dropdownData = {
  'ActivityGroup': [''],
  'Activity': ['']
};

const MaintainIndirectActivity = () => {
  const [input, , , handleInputEvent] = useInputState(defaultInput);

  //Accordian Styling
  const useStyles = makeStyles((theme) => ({
    root: {
      width: 1000,
      background: 'whitesmoke',
      alignContent: 'center',
    },
    SelectDropdown: {
      margin: theme.spacing(2),
      minWidth: 400,
      fontFamily: 'Montserrat',
      color: 'grey'
    },
    heading: {
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
    },
    formclass:
    {
      marginLeft: 30,
    },
    margin: {
      margin: theme.spacing(1),
      alignItems: "center",
    },
    Accordion: {
      backgroundColor: 'rgb(241,242,242)',
      color: "black"
    },
    AccordionDetails: {
     
      color: "white"
    },
    AccordionDetails2: {
    
      color: "white",
      height: 300,
      display: "block"
    },
    button: {
      margin: theme.spacing(1),
      fontFamily:'Montserrat',
      color:'white',
      backgroundColor:'rgb(35,168,224)'
    },
    select:
    {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    }
  }));




  const classes = useStyles();



  //function to get CostCenter
  const getTable = async () => {
    await api.post('/DataCapture/Pickers/GetAllActivityGroup').then(
      res => {

        let data = res.data;
        dropdownData['ActivityGroup'] = data.map(x => x['ActivityGroup']);


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


  // Add new activity
  const AddNewActivity = (event) => {
    event.preventDefault();

    let body = new URLSearchParams(input);

    api.post('/DataCapture/MaintainActivity/AddNewDirectActivity', body).then(
      res => {
        let response = res.data;

        if (response === 'New Task Created') {
          getTable();
          window.alert('New Task Created');
          window.location.reload();
        }
        else if (response === 'Duplicate Activity is already there') {
          window.alert("Activity is alsready registered");
        }
        else {
          window.alert(response);
        }

      }
    ).catch(
      err => { // TODO: Error handling
        console.log(err);

      }
    );
  };


  const AddNewCostCenter = (event) => {
    event.preventDefault();

    let body = new URLSearchParams(input);

    api.post('/DataCapture/MaintainActivity/AddNewDirectCostCenter', body).then(
      res => {
        let response = res.data;

        if (response === 'New Cost Center Added') {
          getTable();
          window.alert("New Cost Center Added");
          window.location.reload();
        }
        else if (response === 'Cost Center already there') {
          window.alert("Cost Center already there");
        }
        else {
          window.alert(response);
        }

      }
    ).catch(
      err => { // TODO: Error handling
        console.log(err);

      }
    );
  };



  //Delete Direct Actvity
  const DeleteDirectActivity = (event) => {
    event.preventDefault();

    let body = new URLSearchParams(input);

    if (input.DeleteActivity !== '') {
      api.post('/DataCapture/MaintainActivity/DeleteDirectActivity', body).then(
        res => {
          let response = res.data;

          if (response === 'Selected Activity Deleted') {
            getTable();
            window.alert('Selected Activity Deleted');
            window.location.reload();
          }
          else {
            window.alert(response);
          }

        }
      ).catch(
        err => { // TODO: Error handling
          console.log(err);

        }
      );
    }
    else {
      window.alert("Please select an Activity");
    }
  };


  //accordian expand methods

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // cost center change


  //activitychange
  const handleActivityChange = (event) => {
    input.DeleteActivity = '';
    if (event) {
      input.DeleteActivity = event.map(x => x["value"]);
    }

  };


  function MakeOption(x) {
    return { value: x, label: x };
  }

  useEffect(() => { // Get table and Dropdown Data
    getTable();

    api.post('/DataCapture/Pickers/GetAllDirectActivity').then( // Team Manager List
      res => {
        let data = res.data;
        dropdownData['Activity'] = data.map(x => x['Activity']);
      });

    // Retrieve Dropdown Data


  }, []);

  return (
    <Screen center>
      <Card className={classes.root}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            className={classes.Accordion}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <Typography className={classes.heading}>Add New Direct Activity</Typography>
          </AccordionSummary>
          <form onSubmit={AddNewActivity} >
            <AccordionDetails className={classes.AccordionDetails}>
                <div className="modal-grouping--col-2">
                  <TextField name='Activity' label='Activity Name' value={input.Activity} onChange={handleInputEvent} required restrictions='default'></TextField>
                  <DropDown name='ActivityGroup' label='Activity Group' options={dropdownData['ActivityGroup']} defaultValue={input.ActivityGroup} onChange={handleInputEvent} required ></DropDown>
                </div>
                <br></br>
            </AccordionDetails>
            <Divider />
            <AccordionActions>
              <Button
                variant="contained"
               
                size="small"
                type="submit"
                className={classes.button}
                startIcon={<SaveIcon />}>Add</Button>
            </AccordionActions>
          </form>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary
            className={classes.Accordion}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
          <Typography className={classes.heading}>Add New Direct Cost Center</Typography>
          </AccordionSummary>
          <form onSubmit={AddNewCostCenter}>
            <AccordionDetails className={classes.AccordionDetails}>
              <div className="modal-grouping--col-2">
                <TextField name='NewCostCenter' label='New Cost Center' value={input.NewCostCenter} onChange={handleInputEvent} required restrictions='default'></TextField>
              </div>
              <br></br>
            </AccordionDetails>
            <Divider />
            <AccordionActions>
              <Button
                variant="contained"
              
                type="submit"
                className={classes.button}
                startIcon={<SaveIcon />}>Add</Button>
            </AccordionActions>
          </form>
        </Accordion>
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary
            className={classes.Accordion}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <Typography className={classes.heading}>Delete Direct Activity</Typography>
          </AccordionSummary>
          <form onSubmit={DeleteDirectActivity}>
            <AccordionDetails className={classes.AccordionDetails2}>
                <Select
                  isMulti
                  name="DeleteActivity"
                  options={dropdownData['Activity'].map((x) => MakeOption(x))}
                  className={classes.SelectDropdown}
                  classNamePrefix="select"
                  required
                  onChange={handleActivityChange}
                />
            </AccordionDetails>
            <Divider />
            <AccordionActions >
              <Button
                variant="contained"
                color="secondary"
                size="small"
                type="submit"
                className={classes.button}
                startIcon={<DeleteIcon />}> Delete</Button>
            </AccordionActions>
          </form>
        </Accordion>
      </Card>
    </Screen>
  )
}

export default MaintainIndirectActivity;