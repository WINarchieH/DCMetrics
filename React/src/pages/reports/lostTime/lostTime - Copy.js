import React, { useState, useEffect } from 'react';
import ssrs, { generateURL } from '../../../components/ssrs/srss';
import api from '../../../components/api/api';
import Header from '../../../components/header/header';
import TextField from '../../../components/fields/textfield';
import { dateToInput } from '../../../components/fields/dateHelpers';
import DropDown from '../../../components/fields/dropdown';
import '../../../assets/panel.scss';
import { useInputState } from '../../../components/hooks/hooks';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
// Accordiam
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const today = dateToInput(new Date().toLocaleDateString());
const reportURL = 'Reports/Lost%20Time';
const dropdownData = {
  'Shift Types': ['A', 'N', 'D']
};

const defaultInput = {
  'StartDate': today,
  'EndDate': today,
  'UserName': '',
  'ShiftType': '',
  'TeamManager': '',
};

const LostTimeReports = () => {
  const [managersList, setManagersList] = useState([]);

  const useStyles = makeStyles((theme) => ({
    root: {

      width: 1300,


      background: 'whitesmoke',
      alignContent: 'center',
      marginLeft: 100,
    },
    SelectDropdown: {
      margin: theme.spacing(2),
      minWidth: 500,
      fontFamily: 'calibri',
      color: 'grey'

    },
    heading: {
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: 'calibri',
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
      backgroundColor: "darkgrey",
      color: "white"
    },
    AccordionDetails: {
      backgroundColor: "lightgrey",
      color: "white"
    },
    AccordionDetails2: {
      backgroundColor: "lightgrey",
      color: "white",
      height: 500,

    },
    AccordionDetails3: {
      backgroundColor: "white",
      color: "white",
      height: 500,
      width: 1250

    },
  }));

  const classes = useStyles();
  // Accordian Styling:

  const [expanded, setExpanded] = React.useState(true);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  // Parameters
  const [input, , setInputName, handleInputEvent] = useInputState(defaultInput);
  // Parameter Handlers
  const startDateHandler = (e) => { setInputName('StartDate', e.currentTarget.value) };
  const endDateHandler = (e) => { setInputName('EndDate', e.currentTarget.value) };

  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(generateURL(ssrs, reportURL, input, true));
  }, [input]);

  useEffect(() => { // Get table and Dropdown Data
    // Retrieve Dropdown Data
    api.get('/Maintenance/TeamManager/GetAllManager').then( // Team Manager List
      res => {
        let data = res.data;
        setManagersList(data.map(x => x['ManagerName']));
      });
  }, []);

  return (
    <div>
      <Header></Header>
      <div className='screen-container'>
        <div>
          <br>
          </br>
          <Card className={classes.root}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} >
              <AccordionSummary
                className={classes.Accordion}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>Select Filters</Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.AccordionDetails}>
                  <div className='parameter-container parameter-container--row'>
                    <DropDown name='TeamManager' label='Team Managers' options={managersList} defaultValue={input.TeamManager} onChange={handleInputEvent} required></DropDown>
                    <DropDown name='ShiftType' label='Shift Types' options={dropdownData['Shift Types']} defaultValue={input.ShiftType} onChange={handleInputEvent} required></DropDown>
                    <TextField name='StartDate' label='Start Date' value={input.StartDate} onChange={startDateHandler} type='date' required></TextField>
                    <TextField name='EndDate' label="End Date" value={input.EndDate} onChange={endDateHandler} type='date' required></TextField>
                  </div>
              </AccordionDetails>

            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary
                className={classes.Accordion}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>Lost Time Report</Typography>
              </AccordionSummary>

              <AccordionDetails className={classes.AccordionDetails2}>
                <Typography>
                  <iframe className={classes.AccordionDetails3}

                    title="Lost Time Report"
                    src={url}>
                  </iframe>
                </Typography>
              </AccordionDetails>

            </Accordion>
          </Card>
          <br>
          </br>



        </div>

















      </div>
    </div>
  )
}
// http://winpc1012/ReportServer_MSSQLSERVER2016?/Reports/Lost%20Time&TeamManager=a

export default LostTimeReports;