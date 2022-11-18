import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Screen from '../../../components/screen/screen';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import api from '../../../components/api/api';
import './addUser.scss';


import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

import EmailIcon from '@material-ui/icons/Email';
import PersonIcon from '@material-ui/icons/Person';

import {
  Container
} from '@material-ui/core';
import clsx from "clsx";
import Select from "react-select";




const dropdownData = {
  'Warehouse': [''],
  'usergroup':['']
};

//const user = useSelector(store => store.user);

const AddUser = () => {
//  const history = useHistory();

  const useStyles = makeStyles((theme) => ({
    root: {
      height: 750,
      width: 650,
      maxWidth: 1000,
      alignContent: 'center',
      marginLeft: 430,
      backgroundColor:'rgb(241,242,242)'
    },

    formclass:
    {
      marginLeft: 30,
    },
    margin: {
      display: "flex",
      flex: "column",
      margin: theme.spacing(1)
    },
    textField: {
      width: "65ch",
      fontfamily: "calibri",
      fontSize: "small"
    },
    SelectDropdown: {
      margin: theme.spacing(1),
      width: "53ch",
      fontFamily: 'calibri',
     
      color: 'grey',
      marginLeft: 60,
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
    avatar: {
      backgroundColor: "black",
    },
    heading:
    {
      alignContent: 'center',
      marginLeft: 430,
      fontFamily:'Montserrat',
      color:'rgb(35,168,224)'
    }
  }));

  const classes = useStyles();
  const [FirstName, setFirstName] = useState('');
  const [SurName, setSurName] = useState('');
  const [Email, setEmail] = useState('');
  const [UserName, setUserName] = useState('');
  const [Warehouse, setWarehouse] = useState('');
  const [usergroup, setUsergroup] = useState('');
  const [error, setError] = useState(null);
  const [success, setsuccess] = useState(null);
  const [disablebutton, setdisablebutton] = useState(1); 
  const user = useSelector(store => store.user);

 // update by will be dcm user
  const handleActivityChange = (event) => {
    setWarehouse('');
    if (event) {
      setError('');
      setWarehouse(event.map(x => x["value"]));
    }

  };
  
  const handleUserGroupChange = (event) => {

    if (event) {
      setError('');
      setUsergroup(event.value);
    }
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
    
  };

  const onSubmit = (event) => {
    event.preventDefault();
setdisablebutton(2);
    if (usergroup === '')
    {
      setError("Please Select a User Group");
      return;
    }

    if (Warehouse.length === 0)
    {
      setError("Please Select a Warehouse");
      return;
    }
    
   
    let body = new URLSearchParams({

      'AccessSite':Warehouse,
      'Username':UserName,
      'UserGroup':usergroup,
      'FirstName':FirstName,
      'LastName':SurName ,
      'Email':Email,
      'Addedby':user
    })
    
    api.post('/Settings/Register/AddUser', body).then(
      res => {
        setdisablebutton(1);
        let data = res.data;
        if (data === 'User is added into the database') {
          setError('');
          setsuccess("User is added into the DC Metrics.An Email will be send to their registered email address in a couple of minutes with the Login Details");
          setFirstName('');
          setSurName('');
          setWarehouse('');
          setUserName('');
          setEmail('');
          setUsergroup('');
        }
        else {
         setError(data);
        }
    

      }).catch(
      
        err => {
          if (err.response) { // Server responded with error - web service issue
            setError(err.response);
         
          }
          else {

          }
        }
      )
  
    };
    


  function MakeOption(x) {
    return { value: x, label: x };
  }

  useEffect(() => { // Get table and Dropdown Data
    

    api.get('/Settings/Register/GetAllSites').then( // Team Manager List
      res => {
        let data = res.data;
        
        dropdownData['Warehouse'] = data.map(x => x.value);
      });

    // Retrieve Dropdown Data

    let body = new URLSearchParams({
    'AddedBy':user
    })

    api.post('/Settings/Register/GetUserGroup',body).then( // Team Manager List
      res => {
        let data = res.data;
        dropdownData['usergroup'] = data.map(x => x.UserGroup);
      });

  }, [user]);

  return (
    <Screen>
      <h2 className={classes.heading} >Add New User</h2>
      <Card className={classes.root}>
      
        <CardContent>
          <Container maxWidth="sm">
          <form onSubmit={onSubmit}>
          <div className='login-form-item--mui'>
        <TextField required
          label="First Name"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          value={FirstName}
          onChange={e => setFirstName(e.target.value.trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      
      </div>
      <div className='login-form-item--mui'>
        <TextField required
          label="Last Name"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          value={SurName}
          onChange={e => setSurName(e.target.value.trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      
      </div>
      <div className='login-form-item--mui'>
        <TextField required
          label="Email"
          type="Email"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          value={Email}
          onChange={e => setEmail(e.target.value.trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      
      </div>
      <div className='login-form-item--mui'>
        <TextField required
          label="Username"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          value={UserName}
          onChange={e => setUserName(e.target.value.trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </div>
      <div>
      
      <Select
                  
                  label="Select UserGroup"
                  name="Warehouse"
                  textFieldProps={{
                    label: "Select Warehouse",
                    InputLabelProps: {
                        shrink: true
                    }
                }}
                  options={dropdownData['usergroup'].map((x) => MakeOption(x))}
                  className={clsx(classes.SelectDropdown)}
                placeholder="Select UserGroup"
                  required
                  onChange={handleUserGroupChange }
                  
                 
                />
                </div>
                <br></br>
             
      
      <Select
                  isMulti
                  label="Select Warehouse"
                  name="Warehouse"
                  textFieldProps={{
                    label: "Select Warehouse",
                    InputLabelProps: {
                        shrink: true
                    }
                }}
                  options={dropdownData['Warehouse'].map((x) => MakeOption(x))}
                  className={clsx(classes.SelectDropdown)}
                placeholder="Select Warehouse"
                  required
                  onChange={handleActivityChange}
                 
                />
            
            <br></br>
              <br></br>
              <div className ={clsx(classes.errorblock)} >
                {error}
               
              </div>
              <div className ={clsx(classes.successblock)} >
                {success}
                
              </div>
            <br></br>
      <button disabled={disablebutton === 1 ? null : true} className='modal-button modal-button--styling hover-cursor'>SIGN UP NOW</button>
      </form>
          </Container>
        </CardContent>
      </Card>
    </Screen>
  );
}
export default AddUser;