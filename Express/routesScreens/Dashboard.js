// Routes for Maintenance Screens
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


router.post('/DashboardTaskTime/Dash_TimePerDirectTasks', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardTaskTime/Dash_TimePerDirectTasks', data).then(
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
router.post('/DashboardTaskTime/Dash_TimePerDirect_PerDay', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardTaskTime/Dash_TimePerDirect_PerDay', data).then(
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

router.post('/DashboardProductivity/GetCCA_TotalPalletPicks', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/GetCCA_TotalPalletPicks', data).then(
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


router.post('/DashboardProductivity/GetCCA_BlendedPickRates', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/GetCCA_BlendedPickRates', data).then(
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

router.post('/DashboardProductivity/Dash_CCA_PickTimes', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_CCA_PickTimes', data).then(
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


router.post('/DashboardProductivity/Dash_CCA_PickTimes', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_CCA_PickTimes', data).then(
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


router.post('/DashboardProductivity/GetCCA_PutawayProd_Split', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/GetCCA_PutawayProd_Split', data).then(
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

router.post('/DashboardProductivity/GetCCA_MoveProd_Split', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/GetCCA_MoveProd_Split', data).then(
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


router.post('/DashboardProductivity/GetCCA_RepProd_Split', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/GetCCA_RepProd_Split', data).then(
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

router.post('/DashboardProductivity/GetCCA_PickProd_Split', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/GetCCA_PickProd_Split', data).then(
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

router.post('/DashboardProductivity/GetPutaway_PerUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/DashBoardGetPutaway_PerUser', data).then(
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

router.post('/DashboardProductivity/GetMove_PerUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/DashBoardGetMove_PerUser', data).then(
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

router.post('/DashboardProductivity/GetRep_PerUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/DashBoardGetRep_PerUser', data).then(
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


router.post('/DashboardProductivity/GetPick_PerUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/DashBoardGetPick_PerUser', data).then(
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


router.post('/DashboardLosttime/DashBoardGetLostTimeAll', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardLosttime/DashBoardGetLostTimeAll', data).then(
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


router.post('/CCAPickDashboard/GetCCA_PickRates_Exp', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_Exp', data).then(
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

router.post('/CCAPickDashboard/GetCCA_PickCases_Exp', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickCases_Exp', data).then(
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




router.post('/CCAPickDashboard/GetCCA_PickRates_Trainee', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_Trainee', data).then(
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


router.post('/CCAPickDashboard/GetCCA_PickCases_Trainee', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickCases_Trainee', data).then(
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


router.post('/CCAPickDashboard/GetCCA_PickRates_DC', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_DC', data).then(
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
router.post('/CCAPickDashboard/GetCCA_PickCases_DC', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickCases_DC', data).then(
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

router.post('/CCAPickDashboard/GetCCA_PickCases_All', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickCases_All', data).then(
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


router.post('/CCAPickDashboard/GetCCA_PickCases_All', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickCases_All', data).then(
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

router.post('/CCAPickDashboard/GetCCA_PickRates_User_AfternoonShift', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_User_AfternoonShift', data).then(
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

router.post('/CCAPickDashboard/GetCCA_PickRates_User_AfternoonShift_Trainee', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_User_AfternoonShift_Trainee', data).then(
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

router.post('/CCAPickDashboard/GetCCA_PickRates_User_DayShift_Trainee', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_User_DayShift_Trainee', data).then(
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


router.post('/CCAPickDashboard/GetCCA_PickRates_User_DayShift', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_User_DayShift', data).then(
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


router.post('/CCAPickDashboard/GetCCA_PickRates_Exp_Weekly', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_Exp_Weekly', data).then(
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


router.post('/CCAPickDashboard/GetCCA_PickRates_Trainee_Weekly', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_Trainee_Weekly', data).then(
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

router.post('/CCAPickDashboard/GetCCA_PickRates_DC_Weekly', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickRates_DC_Weekly', data).then(
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


router.post('/CCAPickDashboard/GetCCA_PickCases_Exp_Weekly', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickCases_Exp_Weekly', data).then(
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



router.post('/CCAPickDashboard/GetCCA_PickCases_Trainee_Weekly', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickCases_Trainee_Weekly', data).then(
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



router.post('/CCAPickDashboard/GetCCA_PickCases_DC_Weekly', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickCases_DC_Weekly', data).then(
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

router.post('/CCAPickDashboard/GetCCA_PickCases_All_Weekly', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickCases_All_Weekly', data).then(
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

router.post('/CCAPickDashboard/GetCCA_Reworks_Weekly', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_Reworks_Weekly', data).then(
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

router.post('/CCAPickDashboard/GetCCA_Reworks_Daily', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_Reworks_Daily', data).then(
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


router.post('/CCAPickDashboard/GetCCA_PickAccuracy_All_Weekly', (req, res) => {
    let data = req.body;
    api.dc4.post('/CCAPickDashboard/GetCCA_PickAccuracy_All_Weekly', data).then(
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


router.post('/Makita/GetMakita_Picks_Weekly_DayShift', (req, res) => {
    let data = req.body;
    api.dc4.post('/Makita/GetMakita_Picks_Weekly_DayShift', data).then(
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


router.post('/Makita/GetMakita_Picks_Weekly_afternoonShift', (req, res) => {
    let data = req.body;
    api.dc4.post('/Makita/GetMakita_Picks_Weekly_afternoonShift', data).then(
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

router.post('/Makita/GetMakita_Putaways_Weekly_DayShift', (req, res) => {
    let data = req.body;
    api.dc4.post('/Makita/GetMakita_Putaways_Weekly_DayShift', data).then(
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



router.post('/Makita/GetMakita_Putaways_Weekly_afternoonShift', (req, res) => {
    let data = req.body;
    api.dc4.post('/Makita/GetMakita_Putaways_Weekly_afternoonShift', data).then(
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