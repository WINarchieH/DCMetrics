import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {  Container } from '@material-ui/core';

import Screen from '../../../components/screen/screen';
import { useSelector } from 'react-redux';
// import SettingsPassword from '../components/settings/SettingsPassword';
import { modules } from "./module";
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import clsx from "clsx";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import api from '../../../components/api/api';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
  TextField
} from '@material-ui/core';

const UserSettings = () => {

  const user = useSelector(store => store.user);
  const [checkedState, setCheckedState] = useState(
    new Array(modules.length).fill(false)
  );

  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  });


  const handleOnChange = (position) => {

    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });

  };


  const SaveNotificationChanges =(event)=>
  {
    event.preventDefault();

   var savedmodules =[];
  
   for (var i =0; i < checkedState.length ; i++ )
   {
   
          if(checkedState[i] === true)
          {
          
             savedmodules.push(modules[i].name);
          } 

   }

   let body = new URLSearchParams({
    'UserID': user,
    'Module': savedmodules
  })

    api.post('/Maintenance/Notifications/UpdateUserNotificationSettings', body).then(
      res => {
        let data = res.data;
        if (data !== 'Setting Saved') {
          // setHelperText("Password Updatation failed for the User");
        }
        else {
          window.alert("Notification Settings Saved for the User.");
          window.location.reload();
        }
    

      }).catch(
        err => {
          if (err.response) { // Server responded with error - web service issue
            
          }
          else {

          }
        }
      )

   }

 // Submit New Password On Click Method
 const onSubmitNewPassword = (event) => {
  event.preventDefault();

  let body = new URLSearchParams({
    'Username': user,
    'Password': values.password
  })

  if (values.password === values.confirm) {

    api.post('/Settings/ChangePassword', body).then(
      res => {
        let data = res.data;
        if (data !== 'Password Updated') {
          // setHelperText("Password Updatation failed for the User");
        }
        else {
          window.alert("Password Updated for the User");
          window.location.reload();
        }
    

      }).catch(
        err => {
          if (err.response) { // Server responded with error - web service issue
            
          }
          else {

          }
        }
      )
  }
  else {
    window.alert('Confirm Password Should match with Reset Password');
    
  }
};
useEffect(() => { // Get table and Dropdown Data
    

  let body = new URLSearchParams({
    'UserID':user
    })

  api.post('/Maintenance/Notifications/GetUserSelectedNotificationModules',body).then( 
    res => {
      let data = res.data;
      
         var selectedmodulestate =modules.map(x => x.name);

         var updatedstate = [];

         for (var i =0; i < selectedmodulestate.length ; i++)
         {
           updatedstate.push(false);
         }


         for (var i =0; i < data.length ; i++)
         {
          
           var position = selectedmodulestate.indexOf(data[i]);

           if (position >=0)
           {
            

               updatedstate[position] = true;
             
           }

         }

         setCheckedState(updatedstate);
      
    
    });

  // Retrieve Dropdown Data


}, [user]);

  return( 
  <Screen>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '150%',
        py: 3
      }}
    >
      <Container maxWidth="lg">
      <form>
      <Card style = {{ backgroundColor :'rgb(241,242,242)'}}>
      <CardHeader style ={{   fontFamily: "Montserrat", color:'rgb(35,168,224)'}}subheader="Manage Notifications"
      
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={6}
          wrap="wrap"
        >
          <Grid
            item
            md={4}
            sm={6}
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
            xs={12}
          >
            <Typography>
          
        {modules.map(({ name, price }, index) => {
          return (
            <ul key={index}>
              <div className="toppings-list-item">
                <div className="left-section">
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={name}
                    checked={checkedState[index]}
                    onChange={() => handleOnChange(index)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                </div>
              </div>
              </ul>
         
          );
        })}
          </Typography>
          </Grid>
          </Grid>
      </CardContent>
      <Divider />
        <Box sx={{ display: 'flex',justifyContent: 'flex-end', p: 2 }} >
        <Button color="primary" variant="contained" onClick={SaveNotificationChanges}style={{color:'white',backgroundColor:'rgb(35,168,224)' }}> Save </Button>
        </Box>
        </Card>
      </form>
        <Box sx={{ pt: 3 }}>
        <form  onSubmit={onSubmitNewPassword} >
      <Card style = {{ backgroundColor :'rgb(241,242,242)'}}>
      <CardHeader style ={{   fontFamily: "Montserrat",color:'rgb(35,168,224)'}}
          subheader="Update Password" />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm password"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type="password"
            value={values.confirm}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button color="primary" variant="contained" onClick={onSubmitNewPassword}style={{color:'white',backgroundColor:'rgb(35,168,224)' }}> Update  </Button>
        </Box>
      </Card>
    </form>
    
        </Box>
      </Container>
    </Box>
    </Screen>
  
);
      }

export default UserSettings;