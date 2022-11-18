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

router.post('/LostTime/GetLostTime', (req,res) => {
    let data = req.body;
    api.dc4.post('/LostTime/GetLostTime', data).then(
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

router.post('/ProductivityPick/GetProductivityReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivityPickReport', data).then(
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


router.post('/ProductivityPick/GetRPFCProductivityReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivityPickReport_RPFC', data).then(
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

router.post('/ProductivityPick/GetProductivityReport_HR', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivityPickReport_HR', data).then(
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


router.post('/ProductivityRep/GetProductivityRepReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivityRepReport', data).then(
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


router.post('/ProductivityPutaway/GetProductivityPutawayReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivityPutawayReport', data).then(
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

router.post('/ProductivityPack/GetProductivityPackReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivityPackReport', data).then(
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


router.post('/ProductivityMove/GetProductivityMoveReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivityMoveReport', data).then(
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


router.post('/Calender/GetCalenderReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Calender/GetCalenderReport', data).then(
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

router.post('/NoShow/GetNoShowReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/NoShow/GetNoShowReport', data).then(
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


router.post('/IndirectActivityReport/GetIndirectActivityReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/IndirectActivityReport/GetIndirectActivityReport', data).then(
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


router.post('/Performance/GetPerformanceReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Performance/GetPerformanceReport', data).then(
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


router.post('/PerformancePerOrder/GetPerformanceReportPerOrder', (req,res) => {
    
    let data = req.body;
    api.dc4.post('/PerformancePerOrder/GetPerformancePerOrderReport', data).then(
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


router.post('/Summary/GetSummaryReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/SummaryReport/GetSummaryReport', data).then(
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


router.post('/CasualReverseBilling/GetCasualReverseBillingReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/CasualReverseBilling/GetCasualReverseBillingReport', data).then(
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


router.post('/ManagementAuditTrail/GetReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/ManagementAuditTrail/GetReport', data).then(
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


router.post('/OverTime/GetReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/OverTime/GetReport', data).then(
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

router.post('/CustomUserReport/GetReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/CustomUserReport/GetReport', data).then(
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



router.post('/SummaryReport/GetUserSummaryReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/SummaryReport/GetUserSummaryReport', data).then(
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


router.post('/EmployeeTracking/GetEmployeeTrackingReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/EmployeeTracking/GetEmployeeTrackingReport', data).then(
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


router.post('/AsicsCasualReverseBilling/GetCasualReverseBillingReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/AsicsCasualReverseBilling/GetCasualReverseBillingReport', data).then(
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


router.post('/ScanTimeException/GetScanTimeExceptionReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/ScanTimeException/GetScanTimeExceptionReport', data).then(
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


router.post('/IdleReport/GetReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/IdleReport/GetReport', data).then(
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

router.post('/ChutePickReport/GetChutePickReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/ChutePickReport/GetChutePickReport', data).then(
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

router.post('/ChutePickReport/GetSelectedUserChutePickReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/ChutePickReport/GetSelectedUserChutePickReport', data).then(
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



router.post('/TimeCostPerCC/GetTimeCostPerCCReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/TimeCostPerCC/GetTimeCostPerCCReport', data).then(
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


router.post('/TimeCostPerCC/GetTimeCostPerCCDetail', (req,res) => {
    let data = req.body;
    api.dc4.post('/TimeCostPerCC/GetTimeCostPerCCDetail', data).then(
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


router.post('/TimeSheet/GetTimesheetReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/TimeSheet/GetTimesheetReport', data).then(
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

//Route For User Task Summary Report

router.post('/UserTaskSummary/GetUserTaskSummaryReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserTaskSummary/GetUserTaskSummaryReport', data).then(
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

// Productivity Load Report
router.post('/Productivity/GetProductivityLoadReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivityLoadReport', data).then(
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


// Daily Scan Report 

//Route For User Task Summary Report

router.post('/UserTaskSummary/GetUserTaskSummaryReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/UserTaskSummary/GetUserTaskSummaryReport', data).then(
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


router.post('/TimeSheet/GetTimesheetReport_BRI', (req,res) => {
    let data = req.body;
    api.dc4.post('/TimeSheet/GetTimesheetReport_BRI', data).then(
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


router.post('/TimeSheet/GetAllTransactions', (req,res) => {
    let data = req.body;
    api.dc4.post('/TimeSheet/GetAllTransactions', data).then(
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



router.post('/CostPerUnitReport/GetReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/TimeVActivity/GetCostPerUnitReport', data).then(
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


router.post('/CurrentResAllocation/getCurrentResAllocation', (req,res) => {
    let data = req.body;
    api.dc4.post('/CurrentResAllocation/getCurrentResAllocation', data).then(
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



router.post('/Productivity/GetProductivityRepReport_Asics', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivityRepReport_Asics', data).then(
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

router.post('/Productivity/GetAllSelectedUserTransactionProdRep_Asics', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetAllSelectedUserTransactionProdRep_Asics', data).then(
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

router.post('/ProductivityReport/GetReworkReport', (req,res) => {
    let data = req.body;
    api.dc4.post('/Productivity/GetProductivitReworkReport', data).then(
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

router.post('/TardinessReport/GetReport', (req,res) => {
    let data = req.body;
    console.log(req);
    api.dc4.post('/TardinessReport/GetReport', data).then(
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


router.post('/TimeBetweenOrdersreport/GetReport', (req,res) => {
    let data = req.body;
    console.log(req);
    api.dc4.post('/TimeBetweenOrdersreport/GetReport', data).then(
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