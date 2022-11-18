import React, { useState } from 'react';
import Screen from '../../../components/screen/screen';
import { useSelector } from 'react-redux';
import './userSettings.scss';
import api from '../../../components/api/api';
import { useHistory } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';

import { blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import clsx from "clsx";
import OutlinedInput from "@material-ui/core/OutlinedInput";

//Accordian
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//List with check box
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import { modules } from "./module";





const UserSettings = () => {
  const user = useSelector(store => store.user);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [error, setError] = useState(null);

  const history = useHistory();
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const ErrorMessage = (props) => {
    return (
      <div className="ErrorMessage-item error-message" >
        {props.msg}
      </div>
    )
  };


  const onError = (msg) => {
    setError(<ErrorMessage msg={msg}></ErrorMessage>);
    setNewPassword('');
    setNewPasswordRepeat('');
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      height: 400,
      width: 450,
      maxWidth: 600,
      background: '#E8E8E8',
      alignContent: 'center',
      marginLeft: 500,
    },
    formclass:
    {
      marginLeft: 30,
    },
    margin: {
      margin: theme.spacing(1),
      alignItems: "center",
    },
    avatar: {
      backgroundColor: blue[300],
    },
  }));

  const classes = useStyles();


  const [checkedState, setCheckedState] = useState(
    new Array(modules.length).fill(false)
  );

  const [total, setTotal] = useState(0);

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

  };

  const [values, setValues] = useState({
    password: '',
    confirm: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handlenewPasswordChange = (event) => {
    onError("");
    setNewPassword(event.target.value);
  };

  const handlePasswordchange = (event) => {
    setNewPasswordRepeat(event.target.value)
  };

  const onSubmitNewPassword = (event) => {
    event.preventDefault();

    let body = new URLSearchParams({
      'Username': user,
      'Password': newPassword
    })
    if (newPassword === newPasswordRepeat) {

      api.post('/Settings/ChangePassword', body).then(
        res => {
          let data = res.data;
          if (data !== 'Password Updated') {
            // setHelperText("Password Updatation failed for the User");
          }
          else {
            window.alert("Password Updated for the User");
          }
      

        }).catch(
          err => {
            if (err.response) { // Server responded with error - web service issue
              onError('Error');
           
            }
            else {

            }
          }
        )
    }
    else {
      onError('Confirm Password Should match with Reset Password');
    }
  };

  return (
    <Screen >


<div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Change Password</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <Card className={classes.root}>
        <CardContent>
          <form onSubmit={onSubmitNewPassword} autoComplete="off">
            <div className="form-item">
            <FormControl
          fullWidth
          required
          className={clsx(classes.margin, classes.textField)}
          variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={newPassword}
            onChange={handlenewPasswordChange}
            startAdornment={
              <InputAdornment position="start">
                <VpnKeyIcon></VpnKeyIcon>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
            </div>
            <div className="form-item">
            <FormControl
              fullWidth
              required
              className={clsx(classes.margin, classes.textField)}
              variant="outlined">
               <InputLabel htmlFor="outlined-adornment-password">
                Confirm Password
               </InputLabel>
               <OutlinedInput
                id="outlined-adornment-confirm-password"
                type={values.showPassword ? "text" : "password"}
                value={newPasswordRepeat}
                onChange={handlePasswordchange}
                startAdornment={
                 <InputAdornment position="start">
                  <VpnKeyIcon></VpnKeyIcon>
                 </InputAdornment>
                 }
                 endAdornment={
                  <InputAdornment position="end">
                   <IconButton
                     aria-label="toggle password visibility"
                     onClick={handleClickShowPassword}
                     onMouseDown={handleMouseDownPassword}
                     edge="end"
                    >
                     {values.showPassword ? <Visibility /> : <VisibilityOff />}
                     </IconButton>
                    </InputAdornment>
                  }
                 labelWidth={70}
          />
        </FormControl>
            </div>
            <br></br>
          
            <button className='modal-button modal-button--styling hover-cursor'>Reset Password</button>
          </form>
          <br></br>
          {error}
        </CardContent>
      </Card>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Notification Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <ul className="toppings-list">
        {modules.map(({ name, price }, index) => {
          return (
            <li key={index}>
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
            </li>
          );
        })}

      </ul>
          
    <button className='modal-button modal-button--styling hover-cursor'>Save Changes</button>
          </Typography>
        </AccordionDetails>
      </Accordion>
     
    </div>










      
    </Screen>
  )
}

export default UserSettings;