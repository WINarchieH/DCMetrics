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


router.post('/AisleMatrix/GetAisle', (req,res) => {
    let data = req.body;
    api.dc4.post('/AisleMatrix/GetAisle', data).then(
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


router.post('/AisleMatrix/DeleteAisle', (req,res) => {
    let data = req.body;
    api.dc4.post('/AisleMatrix/DeleteAisle', data).then(
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

router.post('/AisleMatrix/UpdateAisle', (req,res) => {
    let data = req.body;
    api.dc4.post('/AisleMatrix/UpdateAisle', data).then(
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

router.post('/AisleMatrix/InsertNewAisle', (req,res) => {
    let data = req.body;
    api.dc4.post('/AisleMatrix/InsertNewAisle', data).then(
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


router.post('/PFDMatrix/DeleteMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/PFDMatrix/DeleteMatrix', data).then(
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



router.post('/PFDMatrix/GetpfdMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/PFDMatrix/GetpfdMatrix', data).then(
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


router.post('/PFDMatrix/InsertNewMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/PFDMatrix/InsertNewMatrix', data).then(
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



//ActivityStartEndTimeMatrix
//GetAllEntries
router.post('/ActivityStartEndTime/GetAllEntries', (req,res) => {
    let data = req.body;
    api.dc4.post('/ActivityStartEndTime/SearchZone', data).then(
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


router.post('/ActivityStartEndTime/InsertRecord', (req,res) => {
    let data = req.body;
    api.dc4.post('/ActivityStartEndTime/InsertRecord', data).then(
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


router.post('/ActivityStartEndTime/DeleteMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/ActivityStartEndTime/DeleteMatrix', data).then(
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

router.post('/PalletHandlingMatrix/DeleteMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/PalletHandlingMatrix/DeleteMatrix', data).then(
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
router.post('/PalletHandlingMatrix/GetMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/PalletHandlingMatrix/GetMatrix', data).then(
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
router.post('/PalletHandlingMatrix/AddMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/PalletHandlingMatrix/AddMatrix', data).then(
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


//MapLocationForAisle

router.post('/MapLocation/SearchRecord', (req,res) => {
    let data = req.body;
    api.dc4.post('/MapLocation/SearchRecord', data).then(
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

router.post('/MapLocation/InsertRecord', (req,res) => {
    let data = req.body;
    api.dc4.post('/MapLocation/InsertRecord', data).then(
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


router.post('/ProductHandlingMatrix/GetMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/ProductHandlingMatrix/GetMatrix', data).then(
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

router.post('/ProductHandlingMatrix/AddMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/ProductHandlingMatrix/AddMatrix', data).then(
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

router.post('/ProductHandlingMatrix/DeleteMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/ProductHandlingMatrix/DeleteMatrix', data).then(
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

router.post('/ProductHandlingMatrix/UpdateMatrix', (req,res) => {
    let data = req.body;
    api.dc4.post('/ProductHandlingMatrix/UpdateMatrix', data).then(
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

//Routes for Payroll Export File
//Agency Payroll Route
router.post('/AgencyExportPayroll/SearchPayrollRecord', (req,res) => {
    let data = req.body;
    api.dc4.post('/AgencyExportPayroll/SearchPayrollRecord', data).then(
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

router.post('/AgencyExportPayroll/GeneratePayrollFile', (req,res) => {
    let data = req.body;
    api.dc4.post('/AgencyExportPayroll/GeneratePayrollFile', data).then(
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

//Routes for Payroll Export File
//Agency Payroll Route
router.post('/EliteExportPayroll/SearchPayrollRecord', (req,res) => {
    let data = req.body;
    api.dc4.post('/EliteExportPayroll/SearchPayrollRecord', data).then(
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

router.post('/EliteExportPayroll/GeneratePayrollFile', (req,res) => {
    let data = req.body;
    api.dc4.post('/EliteExportPayroll/GeneratePayrollFile', data).then(
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
