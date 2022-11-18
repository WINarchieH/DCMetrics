import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser, setSites } from '../../redux/actions';
import Logo from '../../images/logo_name.svg';
import api from '../../components/api/api';
import './login.scss';
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField"
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
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
  );
};

const ErrorMessage = (props) => {
  return (
    <div className="login-form-item error-message" >
      {props.msg}
    </div>
  );
};

const LoginButton = (props) => {
  return (
    <button type="submit">{props.text}</button>
  );
};

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginState, setLoginState] = useState('Login');
  const [error, setError] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  const onError = (msg) => {
    setError(<ErrorMessage msg={msg}></ErrorMessage>);
    setUsername('');
    setPassword('');
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    margin: {
      display: "flex",
      flex: "column",
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
    showPassword: false
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onLogin = (event) => {
    event.preventDefault();
    setLoginState('Loading');
    let body = new URLSearchParams({
      'Username': username,
      'Password': password
    });

    api.post('/Login/Login', body).then(
      res => {
        let data = res.data;

        if (data.auth === 'User') { // Successfully logged in
          dispatch(setUser(username));
          dispatch(setSites(JSON.parse(data.sites)));
          history.push('/Dashboard');
        }
        else {
          onError('Your username and/or password did not match. Please try again.');
          setLoginState('Login');
        }
      }).catch(
        err => {
          if (err.response) { // Server responded with error - web service issue
            console.log(err.response)
            onError('Unable to connect to server. Please try again.');
          }
          else {
            onError('Failed to connect to server. Please try again.');
          }
          setLoginState('Login');
        }
      );
  }

  return (
    <form className='login-form' onSubmit={onLogin}>
      <div className='login-form-item--mui'>
        <TextField required
          label="Username"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          value={username}
          onChange={e => setUsername(e.target.value.trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        {/* <label>Username:</label>
                <input name='username' type="text" value={username}  onChange={e => setUsername(e.target.value)} required></input> */}
      </div>

      <div className='login-form-item--mui'>
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
            value={password}
            onChange={e => setPassword(e.target.value.trim())}
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
      <div className='login-form-item--mui'>
        <a href="/ForgotPassword" >Forgot Password?</a>
      </div>
      {error}
      <div className="login-form-item">
        <LoginButton text={loginState}></LoginButton>
      </div>

    </form>
  )
}

const Login = () => {
  const history = useCallback(useHistory(), []);

  useEffect(() => {
    api.get('/Login/IsLoggedIn').then((res) => { // Skip login if already logged in
      let data = res.data;
      if (data.auth === 'User') {
        history.push('/Dashboard');
      }
    })
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