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

//PayrollExportFile

router.post('/PayrollExportFile/GetAllRecord', (req,res) => {
    let data = req.body;
    api.dc4.post('/PayrollExportFile/SearchRecord', data).then(
        response => {
            let output = response.data;
            if (typeof(output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


router.get('/PayrollExportFile/GeneratePayroll', (req,res) => {
    let data = req.body;
    api.dc4.post('/PayrollExportFile/GeneratePayrollFile', data).then(
        response => {
            let output = response.data;
            if (typeof(output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }   
        );
});


// PayrollSettings
router.post('/PayrollSettings/GetPermanentPaySettings', (req,res) => {
    let data = req.body;
    api.dc4.post('/PayrollSettings/GetPayrollSettings', req.body).then(
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

router.post('/PayrollSettings/AddPaySettings', (req,res) => {
    let data = req.body;
    api.dc4.post('/PayrollSettings/AddPayrollSettings', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});

router.post('/PayrollSettings/UpdatePaySettings', (req,res) => {
    let data = req.body;
    api.dc4.post('/PayrollSettings/UpdatePayrollSettings', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


router.post('/PayrollSettings/DeletePaySettings', (req,res) => {
    let data = req.body;
    api.dc4.post('/PayrollSettings/DeletePayrollSettings', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


// Indirect Activity Details
router.post('/IndirectActivityDetails/GetAllIndirectTransactions', (req,res) => {
    let data = req.body;
    api.dc4.post('/IndirectActivityDetails/GetAllIndirectTransactions', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});



// Indirect Activity Details
router.post('/IndirectActivityDetails/AddGroupIndirectTransaction', (req,res) => {
    let data = req.body;
    api.dc4.post('/IndirectActivityDetails/AddGroupIndirectTransaction', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});
router.post('/IndirectActivityDetails/UpdateIndirectTransaction', (req,res) => {
    let data = req.body;
    api.dc4.post('/IndirectActivityDetails/UpdateIndirectTransaction', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


router.post('/IndirectActivityDetails/DeleteIndirectTransaction', (req,res) => {
    let data = req.body;
    api.dc4.post('/IndirectActivityDetails/DeleteIndirectTransaction', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


router.post('/IndirectActivityDetails/AddIndirectTransaction', (req,res) => {
    let data = req.body;
    api.dc4.post('/IndirectActivityDetails/AddIndirectTransaction', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});

//Dropdowns
router.get('/IndirectActivityDetails/GetAllTaskNames', (req, res) => {
    let data = req.body;
    api.dc4.post('/IndirectActivityDetails/GetAllTaskNames', data).then(
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


router.post('/Pickers/GetAllCostCenters', (req,res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllCostCenters', data).then(
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


router.post('/Pickers/GetAllCostCentersWithAssignments', (req,res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllCostCentersWithAssignments', data).then(
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



router.post('/MaintainIndirectActivity/AddNewActivity', (req,res) => {
    let data = req.body;
    api.dc4.post('/MaintainActivity/AddNewActivity', data).then(
        response => {
           
            let output = response.data;
            if (typeof(output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});



router.post('/MaintainActivity/AddNewCostCenter', (req,res) => {
    let data = req.body;
    api.dc4.post('/MaintainActivity/AddNewCostCenter', data).then(
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


router.post('/MaintainActivity/AddNewDirectCostCenter', (req,res) => {
    let data = req.body;
    api.dc4.post('/MaintainActivity/AddNewDirectCCCode', data).then(
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

router.post('/MaintainActivity/DeleteActivity', (req,res) => {
    let data = req.body;
    api.dc4.post('/MaintainActivity/DeleteIndirectActivity', data).then(
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


router.post('/Pickers/GetAllIndirectActivity', (req,res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllIndirectActivity', data).then(
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

router.post('/Pickers/GetIndirectActivityOnCCbased', (req,res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetIndirectActivityOnCCbased', data).then(
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


//DirectActivity
// Add New DirectActivity
router.post('/MaintainActivity/AddNewDirectActivity', (req,res) => {
    let data = req.body;
    api.dc4.post('/MaintainActivity/AddNewDirectActivity', data).then(
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


router.post('/MaintainActivity/DeleteDirectActivity', (req,res) => {
    let data = req.body;
    api.dc4.post('/MaintainActivity/DeleteDirectActivity', data).then(
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


//GetAll ActivityGroup

router.post('/Pickers/GetAllActivityGroup', (req,res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllActivityGroup', data).then(
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

router.post('/Pickers/GetAllDirectActivity', (req,res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllDirectActivity', data).then(
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

// Errror Contrroller Screen

router.post('/Errors/GetAllErrors', (req,res) => {
    let data = req.body;
    api.dc4.post('/Errors/GetAllErrors', data).then(
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
router.post('/Errors/UpdateError', (req,res) => {
    let data = req.body;
    api.dc4.post('/Errors/UpdateError', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});
router.post('/Errors/DeleteError', (req,res) => {
    let data = req.body;
    api.dc4.post('/Errors/DeleteError', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});
router.post('/Errors/AddError', (req,res) => {
    let data = req.body;
    api.dc4.post('/Errors/AddError', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


router.post('/Errors/InsertExcelImportError', (req,res) => {
    let data = req.body;
    api.dc4.post('/Errors/InsertExcelImportError', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});









module.exports = router;