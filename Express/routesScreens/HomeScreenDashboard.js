const express = require('express')
const router = express.Router()
const api = require('../api');





// // Add current site to all get and post requests
// const appendSite = (req, res, next) => {
//     if (req.method === 'POST' || req.method === 'GET') {
//         req.body = req.session;
//     }
//     next();
// };

// router.use(appendSite);


// Routes for Dashboard

router.post('/DashboardProductivity/Dash_PickandPut_Productivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_PickandPut_Productivity', data).then(
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



router.post('/DashboardLosttime/DashBoardGetLostTime', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardLosttime/DashBoardGetLostTime', data).then(
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

// Route for Get Lost time Per User

router.post('/DashboardLosttime/DashBoardGetLostTime_PerUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardLosttime/DashBoardGetLostTime_PerUser', data).then(
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


router.post('/DashboardProductivity/Dashboard_PutawayUnits', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dashboard_PutawayUnits', data).then(
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


router.post('/DashboardTaskTime/Dashboard_TimePerIndirectTasks', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardTaskTime/Dash_TimePerIndirectTasks', data).then(
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



router.post('/DashboardTaskTime/Dash_TimePerIndirect_CC', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardTaskTime/Dash_TimePerIndirect_CC', data).then(
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


router.post('/DashboardProductivity/Dash_MoveProductivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_MoveProductivity', data).then(
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


router.post('/DashboardProductivity/Dash_RepProductivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_RepProductivity', data).then(
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


router.post('/DashboardProductivity/Dash_PutawayProductivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_PutawayProductivity', data).then(
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

router.post('/DashboardProductivity/Dash_PackProductivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_PackProductivity', data).then(
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

router.post('/DashboardProductivity/Dash_CCProductivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_CycleCountProductivity', data).then(
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
// RPF
router.post('/DashboardProductivity/ShippedUnits', (req, res) => { 
    let data = req.body;
    api.dc4.post('/DashboardProductivity/ShippedUnits', data).then(
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


//Asics
// Picked Units


router.post('/DashboardProductivity/Dash_RepProductivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_RepProductivity', data).then(
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


router.post('/DashboardProductivity/Asics_Dash_PickedUnits', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Asics_Dash_PickedUnits', data).then(
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



router.post('/DashboardProductivity/Asics_Dash_PickedProductivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Asics_Dash_PickedProductivity', data).then(
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


router.post('/HomeScreenProductivity/Dash_PickandPut_Productivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/HomeScreenProductivity/Dash_PickandPut_Productivity', data).then(
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

router.post('/HomeScreenProductivity/GetHomeScreenRoute', (req, res) => {
    let data = req.body;
    api.dc4.post('/HomeScreenProductivity/GetHomeScreenRoute', data).then(
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