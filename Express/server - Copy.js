const express = require('express');
const uuid = require('uuid')
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT ;
const api = require('./api');
const axios = require('axios');

const login = require('./routesUser/login');
const settings = require('./routesUser/settings');
const maintenance = require('./routesScreens/maintenance');
const dataCapture= require('./routesScreens/dataCapture');
const report= require('./routesScreens/Reports');
const benchmark = require('./routesScreens/Benchmark');
const dashboard = require('./routesScreens/Dashboard');
const userManagement = require('./routesScreens/UserManagement');
const homeScreen = require('./routesScreens/HomeScreenDashboard');

/**
 * Express server for connecting the frontend to other webservices.
 * File contains webservice URLs and routes.
 */

let whitelist = ['http://202.83.83.56:122','http://hstdcm1.unhosting.net:122'];

app.use(cors({ 
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, // Set to React URL
  credentials: true                // Passes the header
}));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb'})) 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());

app.use(session({ // Function for generating session id
  genid: function(req) {
    return uuid.v4()
  },
  secret: 'dcmetrics',
  cookie: {
    maxAge: 1800000,  // Cookie expires ater 30 minutes of inactivity
    secure: false,  // Set to true if using HTTPS
  },
  resave: false,
  saveUninitialized: false, // Only save sessions when logged in
  rolling: true    // Cookies maxAge resets after every response
}));


/**
 * TODO. Change session store for production. (Redis? Mongoose?)
 */

/**
 * Server routes
 * Functions for Testing
 */
app.get('/Test', (req,res) => { // Test CORS Report
  const t = axios.create({
    baseURL: 'http://winpc1017/ReportServer_MSSQLSERVER2016?/',
  });
  t.get('Reports/Lost%20Time&TeamManager=a').then(
    res => {
        console.log(res);
    }
  );
});

app.get('/' ,(req, res) => { // Get Session ID
  res.send(req.sessionID);
});

app.get('/Session', (req, res) => { // Send Session State
  res.send(req.session);
});


/**
 * Server routes
 */
app.use('/Login', login);

/**
 * Determine if user is logged in before proceeding
 */

app.all('/*', (req,res,next) => {

  if (req.session.User) {
    next();
  }
  else {
    res.status('401').send({
      auth: 'Failure'
    });
  }
});

app.use('/Settings', settings);

app.use('/Maintenance', maintenance);

app.use('/DataCapture',dataCapture);

app.use('/Report',report);

app.use('/Benchmark',benchmark);

app.use('/Dashboard',dashboard);

app.use('/UserManagement',userManagement);

app.use('/HomeScreen',homeScreen);

app.listen(port, () => console.log(`Listening on port ${port}`));
