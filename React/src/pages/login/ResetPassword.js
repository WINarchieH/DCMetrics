import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";

// import Logo from '../../images/logo.bmp'; // Logo with text at the bottom
import Logo from '../../images/logo_name.svg';
import api from '../../components/api/api';
import './login.scss';
// Input form control for password

import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import VpnKeyIcon from '@material-ui/icons/VpnKey';
/**
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
};


const ErrorMessage = (props) => {
  return (
    <div className="login-form-item error-message" >
      {props.msg}
    </div>
  );
};

const SuccessMessage = (props) => {
  return (
    <div className="login-form-item Success-Message" >
      {props.msg}
    </div>
  );
};

const LoginButton = (props) => {
  return (
    <button type="submit">{props.text}</button>
  )
};

const LoginForm = () => {

  const [loginState, setLoginState] = useState('Reset');
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
  const [values, setValues] = useState({
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

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const onError = (msg) => {
    setError(<ErrorMessage msg={msg}></ErrorMessage>);
  };

  const onSuccess = (msg) => {
    setSuccess(<SuccessMessage msg={msg}></SuccessMessage>);
  };


  const onLogin = (event) => {
    event.preventDefault();
    setLoginState('Wait');
    const test = window.location.href;
    let stringarr = test.split('/');
    var uid = stringarr[stringarr.length - 1];
    uid = uid.replace("uid=", "");

    if (values.password === values.confirmPassword) {

      let body = new URLSearchParams({
        'uid': uid,
        Password: values.password

      });

      api.post('/Login/ResetPassword', body).then(
        res => {
          let data = res.data;
          if (data === 'Invalid/Expired Link') {
            onSuccess('');
            onError("Reset Password link has been Expired.Please try again.");

            setLoginState('Reset');
          }
          else if (data === "Password Updated") {
            onError('');
            onSuccess("Password has been Updated.Please click to login Page.");
            setLoginState('Reset');
          }
          else {
            onSuccess('');
            onError("Reset Password link has been Expired.Please try again.");
            setLoginState('Reset');
          }
        }).catch(
          err => {
            if (err.response) { // Server responded with error - web service issue
              onError('Error');

            }
            else {
              setLoginState('Reset');
              onError('Reset Password link has been Expired.Please try again.');
            }
          }
        )

    }
    else {
      setLoginState('Reset');
      onError('Password and Confirm Password should match each other');
    }

  }


  return (
    <form onSubmit={onLogin}>
      <br></br>
      <div>
        <FormControl
          fullWidth
          required
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
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

      <div>
        <FormControl
          fullWidth
          required
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Confirm Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
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

  const history = useCallback(useHistory(), []);

  useEffect(() => {

  }
    , [history]);

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

