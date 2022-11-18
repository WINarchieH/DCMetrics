
const express = require('express')
const router = express.Router()
const api = require('../api');


router.get('/Logout', (req, res) => { // Log out - Destroy session.
    if (req.session.User) {
        req.session.destroy();
        res.send({
            message: 'Logged Out'
        });
    }
});

router.post('/Login', (req, res) => { // Log in - Create session.
    let data = req.body;
    console.log(data);
    api.dc4.post('Login/LoginCheck', data).then(
        response => {
            let output = JSON.parse(response.data);
          
            if (output.output === 'OK') {
                // Store Data in Express Session
                req.session.User = data.Username;
                req.session.Navbar = null;
                req.session.Sites = output.Sites;
                req.session.Site = null;

                res.send({
                    auth: 'User',
                    sites: req.session.Sites
                });
            }
            else {
                res.send({
                    auth: 'Failure'
                });
            }
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

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

router.post('/ForgotPassword', (req, res) => {
    let data = req.body;
    api.dc4.post('/Login/ForgotPassword', data).then(
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



router.post('/ResetPassword', (req, res) => {
    let data = req.body;
    api.dc4.post('/Login/ResetPassword', data).then(
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


router.get('/IsLoggedIn', (req, res) => { // Checks log in status - Gives username
    console.log(req.session)
    if (req.session.User) {
        res.send({
            auth: 'User',
            username: req.session.User,
            navbar: req.session.Navbar,
            sites: req.session.Sites,
            site: req.session.Site
        });
    }
    else {
        res.send({
            auth: 'Not Logged In'
        });
    }
});


module.exports = router;