import React, { useEffect } from 'react';
import Screen from '../../../components/screen/screen';
import api from '../../../components/api/api';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import './AssignIndirect.scss';
// Accordion
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'


//Model
import { useInputState } from '../../../components/hooks/hooks';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import AccordionActions from '@material-ui/core/AccordionActions';

//MultiSelect
//import Select from "react-select";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

//TransferList
// import List from '@material-ui/core/List';

// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import Checkbox from '@material-ui/core/Checkbox';
// import Paper from '@material-ui/core/Paper';

const dropdownData = {
  'CostCenter': [''],
  'CostCenterSingle': [''], // this is for single select cost centre dropdown on un assign indirect accordion
  'Activity': [''],
  'ActivityUnassign': [''],
  'UserList': [''],
  'CostCenterUnassign': [''],
};

const ITEM_HEIGHT = 80;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const defaultInput = { //parms that are used on single select drop down change on un assign accordion
  'UserID': '', 
  'CostCentre': '',
}


const MaintainIndirectActivity = () => {

  const [user, setUser] = React.useState([]);
  const [userSingle, setUserSingle] = React.useState(''); // for single select user drop down on un assign accordion
  const [costcenter,setcostcenter] = React.useState([]);
  const [costcenterSingle, setCostcenterSingle] = React.useState(''); // for single select cost centre drop down on un assign accordion (drop down list items)
  const [costcenterSingleValue, setCostcenterSingleValue] = React.useState(''); // only selected item in dropdown for single select cost centre
  const [activity,setactivity] = React.useState([]);
  const [activityUnassign,setActivityUnassign] = React.useState([]); // activities for unassign accordion
  const [costcenterUnassign,setcostcenterUnassign] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [success, setsuccess] = React.useState(null);
  const [unSuccess, setUnsuccess] = React.useState(null);
  const [unCCSuccess, setCCUnsuccess] = React.useState(null);

  const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
  
  const MultiSelecthandleChange = (event) => {
    setUser(event.target.value);
    setError('');
    setsuccess('');
    setUnsuccess('');
    setCCUnsuccess('');
  };

  const costcenterchange =(event)=>
  {
    setcostcenter(event.target.value);

     let body = new URLSearchParams({
      'assignedActivityCostCenter':event.target.value
    });

    api.post('/Maintenance/Pickers/GetIndirectActivityOnCCbased', body).then( // Reasons Codes List 
      res => {
        let data = res.data;                        
        dropdownData['Activity'] = data.map(x => x['ActivityName']);
        setactivity(dropdownData['Activity']);
      });
      
    setsuccess('');
    setError('');
  };


  const costcenterUnassignchange =(event)=>
  {
    setcostcenterUnassign(event.target.value);

     let body = new URLSearchParams({
      'CostCenter':event.target.value
    });

    api.post('/Maintenance/Pickers/GetIndirectActivityOnCCbased', body).then( // Reasons Codes List 
      res => {
        let data = res.data;                        
        dropdownData['Activity'] = data.map(x => x['ActivityName']);
        setactivity(dropdownData['Activity']);
      });
      
    setsuccess('');
    setError('');
  };

  const activitychange =(event)=>
  {
   setactivity(event.target.value);
   setError('');  
   setsuccess('');
  };

  const activityChangeUnassign =(event)=>
  {
    setActivityUnassign(event.target.value);
    setError('');  
    setUnsuccess('');
  };

  // // const handleChangeMultiple = (event) => {
  // //   const { options } = event.target;
  // //   const value = [];
  // //   for (let i = 0, l = options.length; i < l; i += 1) {
  // //     if (options[i].selected) {
  // //       value.push(options[i].value);
  // //     }
  // //   }
  // //   setUser(value);
  // // };


  // This function handles the event of selecting one user from single select dropdown on Un Assign accordion
  const handleSingleUserSelectEvent = (event) => {
        
    setUserSingle(event.target.value);
    
    input.UserID = event.target.value;
    let body = new URLSearchParams(input);
    api.post('/Maintenance/Pickers/GetCCforUser', body).then(  
      res => {
        let data = res.data;                        
        dropdownData['CostCenterSingle'] = data.map(x => x['CostCenter']); // loading drop down value
        setCostcenterSingle(dropdownData['CostCenterSingle']); // setting state for dropdown value
        setCostcenterSingleValue('');  // selected drop down state is empty now
        setActivityUnassign(['']); // tried to empty the activities list - does not work
        
      });
      
    setError('');
    setUnsuccess('');  
  };

  // This function handles the event of selecting one cost centre from single select dropdown on Un Assign accordion
  const handleSingleCostCentreSelectEvent = (event) => {
    setCostcenterSingleValue(event.target.value);    

    input.UserID = userSingle;
    input.DeptCode = event.target.value;
    
    let body = new URLSearchParams(input);
    api.post('/Maintenance/Pickers/GetAssignedIndirectsForUser', body).then( // Reasons Codes List 
      res => {
        let data = res.data;                        
        dropdownData['ActivityUnassign'] = data.map(x => x['ActivityName']);
        setActivityUnassign(dropdownData['ActivityUnassign']);
      });
     
    setError('');
    setUnsuccess('');        

  };

  //Accordian Styling
  const useStyles = makeStyles((theme) => ({
    root: {
      width: 1000,
      background: 'whitesmoke',
      alignContent: 'center',
    },
    SelectDropdown: {
      margin: theme.spacing(2),
      minWidth: 300,
    fontFamily:'Montserrat',
      color: 'white'
    },
    heading: {
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily:'Montserrat',
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
      backgroundColor: 'rgb(241,242,242)',
      
    },
    AccordionDetails2: {
      
    
      display: "block",
      height: 350
    },
    AccordionDetailsCC: {
    
    
      display: "block",
      height: 200
    },
    button: {
      margin: theme.spacing(1),
      fontFamily:'Montserrat',
      color:'white',
      backgroundColor:'rgb(35,168,224)'
    },
    
    errorblock:{
      color:"red",
      display: "flex",
      flexdirection: "column",
      justifyContent:"center",
      fontSize:"16px"
    },

    successblock:
    {
      color:"green",
      display: "flex",
      flexdirection: "column",
      justifyContent:"center",
      fontSize:"16px"
    },
    
    
  }));

  const classes = useStyles();

  //accordian expand methods

  const [expanded, setExpanded] = React.useState(true);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  //Error Message Div
  const ErrorMessage = (props) => {
    return (
      <div className={classes.errorblock} >
        {props.msg}
      </div>
    )
  };
  const onError = (msg) => {
    setError(<ErrorMessage msg={msg}></ErrorMessage>);
    setactivity('');
    setUser('');
    setcostcenter('');
    setcostcenterUnassign('');
  };

  const SuccessMessage = (props) => {
    return (
      <div className={classes.successblock} >
        {props.msg}
      </div>
    )
  };

  const onSuccess = (msg) => {
    setsuccess(<SuccessMessage msg={msg}></SuccessMessage>);
    setactivity('');
    setUser('');
    setcostcenter('');
    setcostcenterUnassign('');
  };


  // Add activityMethod
  const onaddClick = (event) => {
    
    event.preventDefault();

    if (user.length === 0)
    {
     setError("Please Select Some Users");
      return;
    }

    if (costcenter  === '')
    {
     setError("Please Select the required Cost Center");
      return;
    }

    if (activity.length === 0)
    {
     setError("Please Select Some Activities");
      return;
    }
    let body = new URLSearchParams({
      'User': user,
      'CostCenter': costcenter,
      'Activity': activity
    })


    api.post('/Maintenance/MaintainActivity/AssignIndirectActivities', body).then(
      res => {
        let data = res.data;
        if (data === 'Activities Assigned') {

         setsuccess("All Selected Activities Assigned to the Selected Users");
        }
        else {
         setError(data);
        }
      

      }).catch(
        err => {
          if (err.response) { // Server responded with error - web service issue
           setError(err.response)
           
          }
          else {

          }
        }
      )

  };



  // Delete activityMethod
  const onDeleteClick = (event) => {
    event.preventDefault();
    setCCUnsuccess('');
    
    if (userSingle.length === 0)
    {
     setError("Please Select a User!");
      return;
    }

    if (costcenterSingleValue.length === 0)
    {
     setError("Please Select the required Cost Center!");
      return;
    }    

    if (activityUnassign.length === 0)
    {
     setError("Please Select at least one Activity to delete!");
      return;
    }

    let body = new URLSearchParams({
      'User': userSingle,
      'CostCenter': costcenterSingleValue,
      'Activity': activityUnassign
    })


    api.post('/Maintenance/MaintainActivity/RemoveIndirectActivities', body).then(
      res => {
        let data = res.data;
        if (data === 'Activities Removed') {

         setUnsuccess("All Selected Activities for the user have been removed!");
         setCostcenterSingleValue('');
         setCostcenterSingle('');
         setActivityUnassign(['']);
         setUserSingle('');
        }
        else {
         setError(data);
        }
      

      }).catch(
        err => {
          if (err.response) { // Server responded with error - web service issue
           setError(err.response)
           
          }
          else {

          }
        }
      )

  };




  // Add activityMethod
  const onUnassignCCClick = (event) => {
    
    event.preventDefault();   

    if (costcenterUnassign  === '')
    {
     setError("Please Select at least one Cost Center");
      return;
    }
    
    let body = new URLSearchParams({      
      'CostCenter': costcenterUnassign,      
    })

    api.post('/Maintenance/MaintainActivity/UnassignCC', body).then(
      res => {
        let data = res.data;
        if (data === 'All tasks under the cost centeres have been un-assigned') {

         setCCUnsuccess("All tasks under the cost centeres have been un-assigned");
         setcostcenterUnassign('');
        }
        else {
         setError(data);
        }
      

      }).catch(
        err => {
          if (err.response) { // Server responded with error - web service issue
           setError(err.response)
           
          }
          else {

          }
        }
      )

  };


  useEffect(() => { // Get table and Dropdown Data
    // Retrieve Dropdown Data
    api.post('/DataCapture/Pickers/GetAllCostCenters').then(
      res => {
        let data = res.data;
        dropdownData['CostCenter'] = data.map(x => x['CostCenter']);        
      });


      api.post('/DataCapture/Pickers/GetAllCostCentersWithAssignments').then(
        res => {
          let data = res.data;          
          dropdownData['CostCenterUnassign'] = data.map(x => x['CostCenter']);        
        });

    api.post('/Maintenance/Pickers/GetAllUserNames').then( // Reasons Codes List 
      res => {
        let data = res.data;
        dropdownData['UserList'] = data.map(x => x);
      });

      api.post('/Maintenance/Pickers/GetAllIndirectActivities').then( // Reasons Codes List 
        res => {
         
          let data = res.data;
          dropdownData['Activity'] = data.map(x => x['ActivityName']);
         
        });
  }, []);

  return (
    <Screen center>
      <Card className={classes.root}>
        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary             
            className={classes.Accordion}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
              
            <Typography className={classes.heading}>Assign Indirects</Typography>
          </AccordionSummary>
          <form onSubmit= {onaddClick} >
            <AccordionDetails className={classes.AccordionDetails2} >
              <div className="modal-grouping--col-2">
                                        <div className='modal-item'>
                                       <label className='label label--position'> Select Employee</label>
                                      <FormControl className={classes.formControl}>
                                     <Select
                                     labelId="demo-mutiple-checkbox-label"
                                   id="demo-mutiple-checkbox"
                                   multiple
                                  value={user}
                           onChange={MultiSelecthandleChange}
                            input={<Input />}
                          renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                      >
                     { dropdownData['UserList'].map((name) => (
                   <MenuItem key={name} value={name}>
                   <Checkbox checked={user.indexOf(name) > -1} />
                   <ListItemText primary={name} />
                  </MenuItem>
                    ))}
                 </Select>
                </FormControl>
                </div>

                <div className='modal-item'>
                  <label className='label label--position'> Cost Center</label>

                  {/* Single Select Cost Centre Dropdown */}

                  <FormControl className={classes.formControl}>
                    {/*<InputLabel id="demo-simple-select-label">Cost Center</InputLabel> */}
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={costcenter}
                      onChange={costcenterchange}
                    >
                      { dropdownData["CostCenter"].map((name) => (
                        <MenuItem key={name} value={name}>              
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>                                
                  
                </div>
               
              </div>
              <br></br>
              <div className="modal-grouping--col-2">
              <div className='modal-item'>
              <label className='label label--position'> Activity</label>
              <FormControl className={classes.formControl}>
             
              <Select
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          multiple
          value={activity}
          onChange={activitychange}
          input={<Input />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          { dropdownData['Activity'].map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={activity.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
              </div>
              </div>
              <br></br>
              <br></br>
              <br></br>
              <div className ={classes.errorblock} >
                {error}
               
              </div>
              <div className ={classes.successblock} >
                {success}
               
              </div>
              
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

        {/* Below is the code for Un-Assign Indirect Accordion */}
        
        <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
          <AccordionSummary
            className={classes.Accordion}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <Typography className={classes.heading}>Un-Assign Indirects</Typography>
          </AccordionSummary>
          <form onSubmit= {onDeleteClick} >
            <AccordionDetails className={classes.AccordionDetails2}>
              <div className="modal-grouping--col-2">
                <div className='modal-item'>
                  <label className='label label--position'> Select Employee</label>
                  
                  {/* Single Select User Dropdown */}

                  <FormControl className={classes.formControl}>
                    {/* <InputLabel id="demo-simple-select-label">Select Employee</InputLabel> */}
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={userSingle}
                      onChange={handleSingleUserSelectEvent}
                    >
                      { dropdownData["UserList"].map((name) => (
                        <MenuItem key={name} value={name}>              
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                </div>
                <div className='modal-item'>
                  <label className='label label--position'> Cost Center</label>

                  {/* Single Select Cost Centre Dropdown */}

                  <FormControl className={classes.formControl}>
                    {/*<InputLabel id="demo-simple-select-label">Cost Center</InputLabel> */}
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={costcenterSingleValue}
                      onChange={handleSingleCostCentreSelectEvent}
                    >
                      { dropdownData["CostCenterSingle"].map((name) => (
                        <MenuItem key={name} value={name}>              
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>                                
                  
                </div>

              </div>

              <br></br>
              
              <div className='modal-item'>
                <label className='label label--position'> Activity</label>
                <FormControl className={classes.formControl}>
              
                  <Select
                      labelId="demo-mutiple-checkbox-label"
                      id="demo-mutiple-checkbox"
                      multiple
                      value={activityUnassign}
                      onChange={activityChangeUnassign}
                      input={<Input />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                      
                    >

                    { dropdownData['ActivityUnassign'].map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={activityUnassign.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </div>
              
              <br></br>
              <br></br>
              <br></br>
              <div className ={classes.errorblock} >
                {error}
               
              </div>
              <div className ={classes.successblock} >
                {unSuccess}
               
              </div>
              
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


        <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
          <AccordionSummary
            className={classes.Accordion}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <Typography className={classes.heading}>UnAssign Cost Centres</Typography>
          </AccordionSummary>
          <form onSubmit= {onUnassignCCClick} >
            <AccordionDetails className={classes.AccordionDetailsCC}>              

                <div className='modal-item'>
                  <label className='label label--position'> Cost Center</label>

                  {/* Single Select Cost Centre Dropdown */}

                  <FormControl className={classes.formControl}>
                    {/*<InputLabel id="demo-simple-select-label">Cost Center</InputLabel> */}
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={costcenterUnassign}
                      onChange={costcenterUnassignchange}
                    >
                      { dropdownData["CostCenterUnassign"].map((name) => (
                        <MenuItem key={name} value={name}>              
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>                                
                  
                </div>
              
                <br></br>
                <br></br>
                <br></br>
                <div className ={classes.errorblock} >
                  {error}
                
                </div>
                <br></br>
                <div className ={classes.successblock} >
                  {unCCSuccess}
                
                </div>
              
            </AccordionDetails>
            <Divider />
            <AccordionActions >
              <Button
                variant="contained"
                
                size="small"
                type="submit"
                className={classes.button}
                startIcon={<DeleteIcon />}>UnAssign</Button>
            </AccordionActions>
          </form>
        </Accordion>



      </Card>
    </Screen>
  )
}

export default MaintainIndirectActivity;