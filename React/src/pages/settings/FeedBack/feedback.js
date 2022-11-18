import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Screen from '../../../components/screen/screen';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import api from '../../../components/api/api';
import './feedback.scss';
import DropDown from '../../../components/fields/dropdown';


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
  'Module': ['Maintenance','Report','Benchmark','Payroll','Time And Attendence','Dashboard','Other'],
 
};

//const user = useSelector(store => store.user);

const FeedBack = () => {
//  const history = useHistory();

  const useStyles = makeStyles((theme) => ({
    root: {
      height: 500,
      width: 650,
      maxWidth: 1000,
      alignContent: 'center',
      marginLeft: 430,
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
  
      width:'70ch',
      fontFamily:'Montserrat',
      fontSize: "small"
    },
    SelectDropdown: {
     
      width:'65ch',
      fontFamily:'Montserrat',
     
 
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
  const [FullName, setFullName] = useState('');
  const [UserName, setUserName] = useState('');
  const [Module, setModule] = useState('');
  const [Description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setsuccess] = useState(null);
  const [disablebutton, setdisablebutton] = useState(1); 
  const user = useSelector(store => store.user);

 // update by will be dcm user
  const handleActivityChange = (event) => {
    
    setModule(event.value);
    if (event) {
      setError('');
      setModule(event.value);
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
 

if (Module === '')
{
  setError('Please Select A Module');
  return;
}
    
   
    let body = new URLSearchParams({

      'UserName':user,
      'Module':Module,
      'Description':Description

    })
    
    
    api.post('/Settings/FeedBack/InsertFeedback', body).then(
      res => {
        setdisablebutton(1);
        let data = res.data;
        if (data === 'FeedBack is added into the database') {
          setError('');
          setDescription('');
          setsuccess("Thanks for your feedback.This is already send to Win Solutions technical Team and they will get in touch with you.");
       
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
    

   

    // Retrieve Dropdown Data

    let body = new URLSearchParams({
    'UserName':user
    })

    api.post('/Settings/FeedBack/GetFullName',body).then( // Team Manager List
      res => {
        let data = res.data;
      
        setFullName(data[0]);
      });

  }, [user]);

  return (
    <Screen>
      
      <h2 className={classes.heading} >Feedback</h2>
      <Card className={classes.root}>
        <CardContent>
          <Container maxWidth="sm">
          <form onSubmit={onSubmit}>
          <div className='login-form-item--mui'>
        <TextField required
          label="Full Name"
          id="outlined-start-adornment"
          style={{ fontFamily:'Montserrat'}}
          className={clsx(classes.margin, classes.textField)}
          value={FullName}
          disabled 
         
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
      
      
      <div  className='login-form-item--mui'>
      
      
        <TextField required
          label="Module"
          id="outlined-start-adornment"
          style={{ fontFamily:'Montserrat'}}
          className={clsx(classes.margin, classes.textField)}
          value={module}
          value={Module}
         onChange={e => setModule(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
              
              </InputAdornment>
            ),
          }}
        />
      
     

          </div>
                <br></br>
            
                <div className='login-form-item--mui'>

                <TextField
          className={clsx(classes.margin, classes.textField)}
          id="outlined-multiline-static"
         value={Description}
         onChange={e => setDescription(e.target.value)}
          multiline
          rows={4}
          required
          variant="outlined"
          placeholder="Description"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
              
              </InputAdornment>
            ),
          }}
        
        />

                  </div>
            
            <br></br>
              <br></br>
              <div className ={clsx(classes.errorblock)} >
                {error}
               
              </div>
              <div className ={clsx(classes.successblock)} >
                {success}
                
              </div>
            <br></br>
      <button disabled={disablebutton === 1 ? null : true} className='modal-button modal-button--styling hover-cursor'>SUBMIT</button>
      </form>
          </Container>
        </CardContent>
      </Card>
    </Screen>
  );
}
export default FeedBack;