// Routes for UserManagement Screens
const express = require('express')
const router = express.Router()
const api = require('../api');

// Add current site to all get and post requests
const appendSite = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'GET') {
        req.body.Site = req.session.Site;
    }
    next();
};

router.use(appendSite);


// UserHistory Routes: 

router.post('/UserHistory/GetAttributes', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserHistory/GetUserHistoryAttributes', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});

router.post('/UserHistory/GetUserSummaryPerformance', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserHistory/GetUserProductivitySummary', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});


router.post('/UserHistory/UserProductivityRates', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserHistory/UserProductivityRates', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});

router.post('/UserHistory/UserHistoryLostTime', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserHistory/UserHistory_LostTime', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});

router.post('/UserHistory/TabsforGraphs', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserHistory/GetTabsforGraphs', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});



// User Management Config

router.post('/UserManagementConfig/ConfigureSkills_Get', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserManagementConfig/ConfigureSkills_Get', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});

router.post('/UserManagementConfig/ConfigureSkills_Add', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserManagementConfig/ConfigureSkills_Add', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});


router.post('/UserManagementConfig/ConfigureOnboardingChecklist_Get', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserManagementConfig/ConfigureOnboardingChecklist_Get', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});

router.post('/UserManagementConfig/ConfigureOnboardingChecklist_Add', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserManagementConfig/ConfigureOnboardingChecklist_Add', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});

router.post('/UserManagementConfig/ConfigureOnboardingChecklist_MoveUp', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserManagementConfig/ConfigureOnboardingChecklist_MoveUp', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});


router.post('/UserManagementConfig/ConfigureOnboardingChecklist_MoveDown', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserManagementConfig/ConfigureOnboardingChecklist_MoveDown', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});

router.post('/UserManagementConfig/ChangeChecklistActivationStatus', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserManagementConfig/ChangeChecklistActivationStatus', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
            message: 'Failed to connect to server.'});
        }
    );
});


module.exports = router;