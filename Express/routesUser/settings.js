const express = require('express')
const router = express.Router()
const api = require('../api');

router.post('/SetSite', (req, res) => {
    const body = new URLSearchParams({
      'Username': req.session.User,
      'Site': req.body.Site
    });
  
    api.dc4.post('Login/AssignSite', body).then(
      response => {
        // Set site and navbar (if successful)
        req.session.Navbar = response.data;
        req.session.Site = req.body.Site; 
        
        res.send({
          navbar: response.data
        });
      }).catch(
      err => {
        res.status('503').send({
          message: 'Failed to connect to server.'});
      });
      req.session.Site = req.body.Site; // Set site if successful
  })

router.post('/ChangePassword', (req, res) => {
    let data = req.body;
    api.dc4.post('/Login/ChangePassword', data).then(
        response => {
            let output = response.data;
            console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});

// Creating the Route for the Insert User

router.post('/Register/AddUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/DCMUser/Add', data).then(
        response => {
            let output = response.data;
            res.send(output);
           
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});

router.post('/Register/UpdateDCMUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/DCMUser/UpdateDCMUser', data).then(
        response => {
            let output = response.data;
            res.send(output);
           
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


router.post('/Register/DeleteDCMUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/DCMUser/DeleteDCMUser', data).then(
        response => {
            let output = response.data;
           
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});

router.get('/Register/GetAllSites', (req, res) => {
    let data = req.body;
    api.dc4.post('/DCMUser/GetWarehosueSites', data).then(
        response => {
            let output = response.data;
          
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});

//FeedBack Form API

router.post('/FeedBack/InsertFeedback', (req, res) => {
    let data = req.body;
    api.dc4.post('/FeedBack/InsertFeedback', data).then(
        response => {
            let output = response.data;
           
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


router.post('/Email/InsertNewSubscription', (req, res) => {
    let data = req.body;
    api.dc4.post('/Email/InsertNewSubscription', data).then(
        response => {
            let output = response.data;
           
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});



router.post('/FeedBack/GetFullName', (req, res) => {
    let data = req.body;
    api.dc4.post('/FeedBack/GetFullName', data).then(
        response => {
            let output = response.data;
          
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


module.exports = router;