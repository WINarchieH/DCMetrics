import React, { useState } from 'react';
// import { useHistory } from "react-router-dom";
// import Logo from '../../images/logo.bmp'; // Logo with text at the bottom
import Logo from '../../images/logo_name.svg';
import api from '../../components/api/api';
import './login.scss';
// Input form control for password


import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import AccountCircle from '@material-ui/icons/AccountCircle';

/**
 * Component for login form.
 */

/**
 *  Component for Login Header and Caption
 */
const LoginHeader = () => {
  return (
    <figure className="logo-container">
      <img src={Logo} alt="DC Metrics Logo"></img>
      <figcaption>A complete tool to measure your work performance.</figcaption>
    </figure>
  )
}

const ErrorMessage = (props) => {
  return (
    <div className="login-form-item error-message" >
      {props.msg}
    </div>
  )
}

const SuccessMessage = (props) => {
  return (
    <div className="login-form-item Success-Message" >
      {props.msg}
    </div>
  )
}

const LoginButton = (props) => {
  return (
    <button type="submit">{props.text}</button>
  )
}




const LoginForm = () => {
  // const [username, setUsername] = useState('');
  // const [newPassword, setNewPassword] = useState('');
  // const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [loginState, setLoginState] = useState('Send');
  const [error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    margin: {
      margin: theme.spacing(1)
    },
    withoutLabel: {
      marginTop: theme.spacing(3)
    },
    textField: {
      width: "45ch",
      fontfamily: "calibri",
      fontSize: "small"
    },

  }));


  const classes = useStyles();
  const [values, setValues] = React.useState({
    UserName: "",
    password: "",
    confirmPassword: "",
    Email: "",
    showPassword: false
  });

  const handleChange = (prop) => (event) => {
    setError('');
    setSuccess('');
    setValues({ ...values, [prop]: event.target.value.trim() });
  };

  // const handleClickShowPassword = () => {
  //   setValues({ ...values, showPassword: !values.showPassword });
  // };

  // const handleMouseDownPassword = (event) => {
  //   event.preventDefault();
  // };


  const onError = (msg) => {
    setError(<ErrorMessage msg={msg}></ErrorMessage>);
    // setUsername('');
  }

  const onSuccess = (msg) => {
    setSuccess(<SuccessMessage msg={msg}></SuccessMessage>);
    // setUsername('');
  }

  const onLogin = (event) => {
    event.preventDefault();
    setLoginState('Wait');
    let body = new URLSearchParams({
      'Username': values.UserName,

    });


    api.post('/Login/ForgotPassword', body).then(
      res => {
        let data = res.data;
        if (data !== 'EmailSend') {
          onSuccess('');
          onError(data);

          setLoginState('Send');
        }
        else {
          onError('');
          onSuccess("An email with instructions to reset your password will be sent to your registered email in a couple of minutes.");
          setLoginState('Send');
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

  return (
    <form onSubmit={onLogin}>
      <br></br>
      <TextField
        required
        label="Username"
        id="outlined-start-adornment"
        className={clsx(classes.margin, classes.textField)}
        value={values.UserName}
        onChange={handleChange("UserName")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
      <div>
        <a className={"centermessage"} href="/"> BACK TO LOGIN</a>
      </div>
      {Success}
      {error}
      <div className="login-form-item">
        <LoginButton text={loginState}></LoginButton>
      </div>
      <div className="login-form-item">
      </div>
    </form>
  )
}

const Login = () => {
  // const history = useCallback(useHistory(), []);

  return (
    <div className="background">
      <div className="login-container">
        <LoginHeader></LoginHeader>
        <LoginForm></LoginForm>
      </div>
    </div>
  )
}

export { LoginHeader, ErrorMessage };
export default Login;