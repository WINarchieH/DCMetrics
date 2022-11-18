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
// Accordion
import { CardContent } from '@material-ui/core';

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
  // const [managersList, setManagersList] = useState([]);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "90vw",
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
    AccordionDetails3: {
      backgroundColor: "white",
      color: "white",
      height: "70vh",
      width: "80vw"
    },
  }));

  const classes = useStyles();

  // Parameters
  // const [input, , setInputName, handleInputEvent] = useInputState(defaultInput);
  // // Parameter Handlers
  // const startDateHandler = (e) => { setInputName('StartDate', e.currentTarget.value) };
  // const endDateHandler = (e) => { setInputName('EndDate', e.currentTarget.value) };

  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(generateURL(ssrs, reportURL, input, true));
  }, [input]);

  // useEffect(() => { // Get table and Dropdown Data
  //   // Retrieve Dropdown Data
  //   api.get('/Maintenance/TeamManager/GetAllManager').then( // Team Manager List
  //     res => {
  //       let data = res.data;
  //       setManagersList(data.map(x => x['ManagerName']));
  //     });
  // }, []);

  return (
    <div>
      <Header></Header>
      <div className='screen-container'>
        <div>
          {/* <br></br>
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
              Select Filters
              </Typography>
                <div className='parameter-container parameter-container--row'>
                  <DropDown name='TeamManager' label='Team Managers' options={managersList} defaultValue={input.TeamManager} onChange={handleInputEvent} required></DropDown>
                  <DropDown name='ShiftType' label='Shift Types' options={dropdownData['Shift Types']} defaultValue={input.ShiftType} onChange={handleInputEvent} required></DropDown>
                  <TextField name='StartDate' label='Start Date' value={input.StartDate} onChange={startDateHandler} type='date' required></TextField>
                  <TextField name='EndDate' label="End Date" value={input.EndDate} onChange={endDateHandler} type='date' required></TextField>
                </div>
            </CardContent>
          </Card>  */}
          <br></br>
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Lost Time Report
              </Typography>
              <iframe className={classes.AccordionDetails3}
                      title="Lost Time Report"
                      src={url}/>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
// http://winpc1012/ReportServer_MSSQLSERVER2016?/Reports/Lost%20Time&TeamManager=a

export default LostTimeReports;