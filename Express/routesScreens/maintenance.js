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

// TeamManager Routes: GetAllManager, AddManager, UpdateManager, DeleteManager
router.post('/TeamManager/GetAllManager', (req, res) => {
    let data = req.body;
    api.dc4.post('/TeamManager/GetAllManager', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/TeamManager/AddManager', (req, res) => {
    let data = req.body;
    api.dc4.post('/TeamManager/InsertNewManager', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/TeamManager/UpdateManager', (req, res) => {
    let data = req.body;
    api.dc4.post('/TeamManager/UpdateManager', data).then(
        response => {
            let output = response.data;
            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/TeamManager/DeleteManager', (req, res) => {
    let data = req.body;
    api.dc4.post('/TeamManager/DeleteManager', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


// Reason Code Routes: GetAllRoutes, AddReason,  DeleteReason
router.post('/ReasonCode/GetAllReasons', (req, res) => {
    let data = req.body;
    api.dc4.post('/ReasonCode/GetAllReasons', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/ReasonCode/InsertNewReason', (req, res) => {
    let data = req.body;
    api.dc4.post('/ReasonCode/InsertNewReason', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});



router.post('/ReasonCode/Deletereason', (req, res) => {
    let data = req.body;
    api.dc4.post('/ReasonCode/Deletereason', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});





// EmailNotification Routes: 
router.post('/EmailNotifications/GetAllEntries', (req, res) => {
    let data = req.body;
    api.dc4.post('/EmailNotifications/GetAllEntries', data).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/EmailNotifications/InsertNewEmailNotification', (req, res) => {
    let data = req.body;
    api.dc4.post('/EmailNotifications/InsertNewEmailNotification', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/EmailNotifications/UpdateEntry', (req, res) => {
    let data = req.body;
    api.dc4.post('/EmailNotifications/UpdateEntry', data).then(
        response => {
            let output = response.data;
            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/EmailNotifications/DeleteEntry', (req, res) => {
    let data = req.body;
    api.dc4.post('/EmailNotifications/DeleteEntry', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});



// UserInfo Routes: GetAllUsers, UpdateUser, InsertUser, DeleteUser, 
// GetShiftCodes, GetAgencies, GetUserRole
router.post('/UserInfo/GetAllUsers', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetAllUsers', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/UserInfo/AddUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/InsertUser', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/UserInfo/UpdateUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/updateUser', data).then(
        response => {
            if (response === 'Update Failed. Multiple records or no records are present in the system.') {
                res.status('400').send({
                    message: 'Multiple or no user records found.'
                });
            }
            else {
                let output = response.data;

                res.send({
                    response: output
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


router.post('/UserInfo/UpdateRoster', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/UpdateUserRoster', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

//Makita UserInfo

router.post('/UserInfo/GetAllMakitaUsers', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetAllMakitaUsers', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});


router.post('/UserInfo/InsertMakitaUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/InsertMakitaUser', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/UserInfo/updateMakitaUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/updateMakitaUser', data).then(
        response => {
            if (response === 'Update Failed. Multiple records or no records are present in the system.') {
                res.status('400').send({
                    message: 'Multiple or no user records found.'
                });
            }
            else {
                let output = response.data;

                res.send({
                    response: output
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


//User Diary

// get user diary notes
router.post('/UserInfo/UserNotes', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetUserDiaryNotes', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

//get note types for dropdown
router.post('/UserInfo/NoteTypes', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetNoteTypes', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

//add new diary note for a user
router.post('/UserInfo/AddUserNote', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/AddUserDiaryNote', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/UserInfo/DeleteNote', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/DeleteUserDiaryNote', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});




//Onboarding Checklist
router.post('/UserInfo/OnboardingChecklist', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetOnboardingChecklist', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});


router.post('/UserInfo/TickUserOnboardingChecklist', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/UpdateUserOnboardingChecklist', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});



//USER SKILLS

router.post('/UserInfo/UserSkills', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetUserSkills', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/UserInfo/Skills', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetSkills', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/UserInfo/AddUserSkill', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/AddUserSkill', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});


router.post('/UserInfo/RemoveUserSkills', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/DeleteUserSkills', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});



//User Certifications
router.post('/UserInfo/Certificates', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetCertificationTypes', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});


router.post('/UserInfo/CertificatesForUser', (req, res) => { // certs already with expiry for user in system - to upload image
    let data = req.body;
    api.dc4.post('/UserInfo/GetCertificationTypesForUser', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});


router.post('/UserInfo/UserCerts', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetUserCertifications', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});


router.post('/UserInfo/AddCertificateExpiry', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/AddCertExpiry', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});


// Upload Docs
router.post('/UserInfo/UploadFile', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/UploadFile', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});


router.post('/UserInfo/RetrieveFile', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/RetrieveFile', data).then(
        response => {
            if (response === 'Error Occured:While Fetching the List') {
                res.status('500').send({
                    message: 'Error retrieving from datasbase.'
                });
            }
            else {
                var output = JSON.parse(response.data);
                res.send(output);
            }
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.get('/UserInfo/GetAllShiftCodes', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/getAllShiftCodes', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.get('/UserInfo/GetAllAgencies', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/getAllAgencies', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.get('/UserInfo/GetUserRole', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetUserRole', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/UserInfo/AssignLeave', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/AssignLeave', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


//Date effective payroll update
router.post('/UserInfo/ChangePayroll', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/ChangePayroll', data).then(
        response => {
            let output = response.data;
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/UserInfo/GetPayroll', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/GetPayroll', data).then(
        response => {
            let output = response.data;
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


//GetAllUserlist

router.post('/Pickers/GetAllUserNames', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllUserNames', data).then(
        response => {
            let output = response.data;
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/Pickers/GetAllLoggedUsers', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllLoggedUsers', data).then(
        response => {
            let output = response.data;
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

// Time and Attendence
router.post('/TimeAttendance/GetAllAttendence', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/GetAllTimeandAttendenceEntries', data).then(
        response => {
            let output = response.data;
            if (output === 'Error Occured:While Fetching the List') {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/TimeAttendance/UpdateAttendance', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/UpdateTimeandAttendenceEntry', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});
// Ag Grid time and attendence route
router.post('/TimeAttendance/EditTimeandAttendenceEntry_Grid', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/EditTimeandAttendenceEntry_Grid', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/TimeAttendance/UpdateRoster', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/UpdateRoster', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/TimeAttendance/getAllReasons', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/getAllReasons', data).then(
        response => {
            let output = response.data;
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/TimeAttendance/AddAttendance', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/AddAttendance', data).then(
        response => {
            let output = response.data;
            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/TimeAttendance/DeleteAttendance', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/DeleteTimeAndAttendenceEntry', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/TimeAttendance/ApproveAllEntries', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/ApproveAllEntries', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

// ELITE Time Attendance GET Records
router.post('/TimeAttendance/GetAllAttendenceElite', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/GetAllTimeandAttendenceEntries_Elite', data).then(
        response => {
            let output = response.data;
            if (output === 'Error Occured:While Fetching the List') {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


// Route for Public Holiday: Get,  Add New Public Holiday, Update Public Holiday, Delete Public Holiday
router.post('/PublicHoliday/GetAllPublicHoliday', (req, res) => {
    let data = req.body;
    api.dc4.post('/PublicHoliday/GetAllPublicHolidays', req.body).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/PublicHoliday/Add', (req, res) => {
    let data = req.body;
    api.dc4.post('/PublicHoliday/InsertNewPublicHoliday', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/PublicHoliday/Delete', (req, res) => {
    let data = req.body;
    api.dc4.post('/PublicHoliday/DeletePublicHoliday', data).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/PublicHoliday/Update', (req, res) => {
    let data = req.body;
    api.dc4.post('/PublicHoliday/UpdatePublicHoliday', data).then(
        response => {
            let output = response.data;
            res.send({
                response: output
            });
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

// Route for Leave Screen: GetAllLeaveRequest, Add Leave, Update Leave, Delete Leave
router.get('/Leave/GetAllLeave', (req, res) => {
    let data = req.body;
    api.dc4.post('/Leave/GetAllLeave', req.body).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/Leave/AddLeave', (req, res) => {
    let data = req.body;
    api.dc4.post('/Leave/InsertNewLeave', req.body).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/Leave/Update', (req, res) => {
    let data = req.body;
    api.dc4.post('/Leave/UpdateLeave', req.body).then(
        response => {
            let output = response.data;
            res.send({
                response: output
            });
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/Leave/Delete', (req, res) => {
    let data = req.body;
    api.dc4.post('/Leave/DeleteLeave', req.body).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});


// Routes for the Payroll Rules Screen
// Get Rules
//Add New Rules
// Update Rules

router.post('/PayrollRule/GetAllRules', (req, res) => {
    let data = req.body;
    api.dc4.post('/PayrollRules/GetAllPayrollRules', req.body).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/PayrollRule/UpdatePayrollRule', (req, res) => {
    let data = req.body;
    api.dc4.post('/PayrollRules/UpdatePayrollRule', req.body).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

// Routes for the Payroll Codes Screen
// Get Payroll Codes
//Add New Payroll Codes
// Update Payroll Codes

router.post('/PayrollCode/GetAllPayrollCode', (req, res) => {
    let data = req.body;
    api.dc4.post('/PayrollCode/GetAllPayrollCodes', req.body).then(
        response => {
            var output = JSON.parse(response.data);
            res.send(output);
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

router.post('/PayrollCode/UpdatePayrollCode', (req, res) => {
    let data = req.body;
    api.dc4.post('/PayrollCode/UpdatePayrollCode', req.body).then(
        response => {
            let output = response.data;

            res.send({
                response: output
            });
        }
    ).catch(
        err => {
            res.status('503').send({
                message: 'Failed to connect to server.'
            });
        }
    );
});

//Pickers Routes
//GetleaveTypes
router.post('/Pickers/GetLeaveTypes', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllLeavesTypes', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

//GetAllActivities
router.post('/Pickers/GetAllActivities', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllActivities', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

//GetAllZones

router.post('/Pickers/GetAllZone', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllZone', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

// this function is called from AssignIndirects ( Assign accordion - when a cost center is selected)
// fetches all actvities for that selected cost center

router.post('/Pickers/GetIndirectActivityOnCCbased', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetIndirectActivityOnCCbased', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});
// this function is called from AssignIndirects (Un Assign accordion - when a user is selected)
// fetches all cost centres the user has at least one activity assigned
router.post('/Pickers/GetCCforUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllCCforUser', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

// This function is called in assigned indirects - un assign accordion - when a single cost centre is selected
// fetches all activities the selected user is assigned to (within the selected cost centre)
router.post('/Pickers/GetAssignedIndirectsForUser', (req, res) => {

    let data = req.body;
    api.dc4.post('/Pickers/GetAllAssignedIndirectsForUser', data).then(
        response => {
            let output = response.data;
            //console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


//Leave Management Screen Route
//GetAllleaveRequest

router.post('/LeaveManagement/GetAllLeaveRequest', (req, res) => {
    let data = req.body;
    // req.body.StartDate = '12/12/2019';
    // req.body.EndDate = '12/12/2019';
    api.dc4.post('/LeaveManagement/GetallLeaveRequest', data).then(
        response => {
            let output = response.data;
          
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

//Leave Management Screen Route
//ApproveLeave
router.post('/LeaveManagement/ApproveLeave', (req, res) => {
    let data = req.body;
    // req.body.StartDate = '12/12/2019';
    // req.body.EndDate = '12/12/2019';
    api.dc4.post('/LeaveManagement/ApproveSelectedLeave', data).then(
        response => {
            let output = response.data;
          
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

//Leave Management Screen Route
//Reject or Cancel Leave
router.post('/LeaveManagement/RejectSelectedLeave', (req, res) => {
    let data = req.body;
    // req.body.StartDate = '12/12/2019';
    // req.body.EndDate = '12/12/2019';
    api.dc4.post('/LeaveManagement/RejectSelectedLeave', data).then(
        response => {
            let output = response.data;
           
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/LeaveManagement/GetAllApprovedLeaves', (req, res) => {
    let data = req.body;
    // req.body.StartDate = '12/12/2019';
    // req.body.EndDate = '12/12/2019';
    api.dc4.post('/LeaveManagement/GetAllApprovedLeaves', data).then(
        response => {
            let output = response.data;
            
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


// User Time Information Screen Routes: GetAllEntries, UpdateUserTimeEntry
router.post('/UserTimeInformation/GetAllEntries', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeInfoByUser/GetAllEntries', data).then(
        response => {
            let output = response.data;
            console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/UserTimeInformation/UpdateUserTimeEntry', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeInfoByUser/UpdateUserTimeEntry', data).then(
        response => {
            let output = response.data;
            console.log(output);
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

// Agency Routes
//Get Agency
//Add New Agency
//Update Agency
//Delete Agency
router.post('/Agency/GetAllAgencies', (req, res) => {
    let data = req.body;
    api.dc4.post('/Agency/GetAllAgencies', data).then(
        response => {
            console.log(response);
            let output = response.data;
            if (typeof (output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Agency/InsertNewAgency', (req, res) => {
    let data = req.body;
    api.dc4.post('/Agency/InsertAgency', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Agency/UpdateAgency', (req, res) => {
    let data = req.body;
    api.dc4.post('/Agency/UpdateAgency', data).then(
        response => {

            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Agency/DeleteAgency', (req, res) => {
    let data = req.body;
    api.dc4.post('/Agency/DeleteAgency', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


// TransactionHistory

// router.post('/TransactionHistory/GetTransaction', (req, res) => {
//     let data = req.body;
//     api.dc4.post('/TransactionHistory/GetAllTransaction', data).then(
//         response => {
//             let output = response.data;
//             res.send(output);
//         }).catch(
//             err => {
//                 res.status('503').send({
//                     message: 'Failed to connect to server.'
//                 });
//             }
//         );
// });


router.post('/TransactionHistory/GetTransaction', (req, res) => {
    let data = req.body;
    api.dc4.post('/TransactionHistory/GetAllTransaction', data).then(
        response => {
            // debugger;
            // console.log(response);
            // debugger;
            let output = response.data;
            
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'});
            }
        );
});


router.post('/TransactionHistory/GetCCATransaction', (req, res) => {
    let data = req.body;
    api.dc4.post('/TransactionHistory/GetAllTransaction_CCA', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

//SelectedUserTransaction
router.post('/TransactionHistory/GetAllSelectedUserTransaction', (req, res) => {
    let data = req.body;
    api.dc4.post('/TransactionHistory/GetAllSelectedUserTransaction', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

//RPFC_productivityPick
router.post('/TransactionHistory/GetAllSelectedUserTransactionProd_RPFC', (req, res) => {
    let data = req.body;
    api.dc4.post('/TransactionHistory/GetAllSelectedUserTransactionProd_RPFC', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});




//GetAllSelectedUserTransactionProdPutaways
router.post('/TransactionHistory/GetAllSelectedUserTransactionProdPutaways', (req, res) => {
    let data = req.body;
    api.dc4.post('/TransactionHistory/GetAllSelectedUserTransactionProdPutaways', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

//GetAllSelectedUserTransactionProdPack
router.post('/TransactionHistory/GetAllSelectedUserTransactionProdPack', (req, res) => {
    let data = req.body;
    api.dc4.post('/TransactionHistory/GetAllSelectedUserTransactionProdPack', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


//GetAllSelectedUserTransactionProdMove
router.post('/TransactionHistory/GetAllSelectedUserTransactionProdMove', (req, res) => {
    let data = req.body;
    api.dc4.post('/TransactionHistory/GetAllSelectedUserTransactionProdMove', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


//GetAllSelectedUserTransactionProdRep
router.post('/TransactionHistory/GetAllSelectedUserTransactionProdRep', (req, res) => {
    let data = req.body;
    api.dc4.post('/TransactionHistory/GetAllSelectedUserTransactionProdRep', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});





router.post('/TransactionHistory/UpdateTransaction', (req, res) => {
    let data = req.body;
    api.dc4.post('/TransactionHistory/UpdateTransaction', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});



//shiftDetails
//Get
//Add
//Update//Delete


router.post('/ShiftDetails/GetAllShifts', (req, res) => {
    let data = req.body;
    api.dc4.post('/ShiftDetails/GetAllShifts', data).then(
        response => {

            let output = response.data;
            if (typeof (output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/ShiftDetails/AddNewShift', (req, res) => {
    let data = req.body;
    api.dc4.post('/ShiftDetails/AddNewShift', data).then(
        response => {

            let output = response.data;
            if (typeof (output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});
router.post('/ShiftDetails/UpdateShift', (req, res) => {
    let data = req.body;
    api.dc4.post('/ShiftDetails/UpdateShift', data).then(
        response => {

            let output = response.data;
            if (typeof (output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/ShiftDetails/DeleteShift', (req, res) => {
    let data = req.body;
    api.dc4.post('/ShiftDetails/DeleteShift', data).then(
        response => {

            let output = response.data;
            if (typeof (output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


//OrderTimeMatrixApi
//get
//Update
//Add
//Delete
router.post('/OrderTimeMatrix/GetAllOrders', (req, res) => {
    let data = req.body;
    api.dc4.post('/OrderTimeMatrix/GetAllOrderMatrix', data).then(
        response => {

            let output = response.data;
            if (typeof (output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/OrderTimeMatrix/InsertNewOrder', (req, res) => {
    let data = req.body;
    api.dc4.post('/OrderTimeMatrix/InsertNewOrderMatrix', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/OrderTimeMatrix/UpdateOrder', (req, res) => {
    let data = req.body;
    api.dc4.post('/OrderTimeMatrix/UpdateOrderMatrix', data).then(
        response => {

            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/OrderTimeMatrix/DeleteOrder', (req, res) => {
    let data = req.body;
    api.dc4.post('/OrderTimeMatrix/DeleteOrderMatrix', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


//MaintainZoneApi
//get
//Update
//Add
//Delete
router.post('/MaintainZone/GetAllZones', (req, res) => {
    let data = req.body;
    api.dc4.post('/MaintainZone/MaintainZoneGetAllEntries', data).then(
        response => {

            let output = response.data;
            if (typeof (output) != 'string') {
                res.status('501').send({
                    message: output
                });
            }
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/MaintainZone/AddZone', (req, res) => {
    let data = req.body;
    api.dc4.post('/MaintainZone/AddNewZone', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/MaintainZone/UpdateZone', (req, res) => {
    let data = req.body;
    api.dc4.post('/MaintainZone/UpdateZone', data).then(
        response => {

            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/MaintainZone/DeleteZone', (req, res) => {
    let data = req.body;
    api.dc4.post('/MaintainZone/DeleteZone', data).then(
        response => {
            let output = response.data;


            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

///GetreportsList
router.post('/Pickers/GetReportsList', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetReportsList', data).then(
        response => {
            let output = response.data;


            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});



router.post('/Pickers/GetAllIndirectActivities', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllIndirectActivities', data).then(
        response => {
            let output = response.data;


            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/MaintainActivity/AssignIndirectActivities', (req, res) => {
    let data = req.body;
    api.dc4.post('/MaintainActivity/AssignIndirectActivities', data).then(
        response => {
            let output = response.data;
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/MaintainActivity/RemoveIndirectActivities', (req, res) => {
    let data = req.body;
    api.dc4.post('/MaintainActivity/DeleteIndirectActivities', data).then(
        response => {
            let output = response.data;
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


// this is to unassign all indirects under the selected cost centres
router.post('/MaintainActivity/UnassignCC', (req, res) => {
    let data = req.body;
    api.dc4.post('/MaintainActivity/UnassignCostCentres', data).then(
        response => {
            let output = response.data;
            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
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
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/Email/GetAllSubscription', (req, res) => {
    let data = req.body;
    api.dc4.post('/Email/GetAllSubscription', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/Email/UpdateSubscription', (req, res) => {
    let data = req.body;
    api.dc4.post('/Email/UpdateSubscription', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

////Routes For DashBoard
//Dashboard Units
router.post('/Login/Dash_PickedUnits', (req, res) => {
    let data = req.body;
    api.dc4.post('/Login/Dash_PickedUnits', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});



router.post('/DashboardProductivity/Dash_PickProductivity', (req, res) => {
    let data = req.body;
    api.dc4.post('/DashboardProductivity/Dash_PickProductivity', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/UserInfo/InsertExcelImportUser', (req, res) => {
    let data = req.body;
    api.dc4.post('/UserInfo/InsertExcelImportUser', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


// Calendar
router.post('/Calendar/GetEvents', (req, res) => {
    let data = req.body;
    api.dc4.post('/Calendar/GetAllEvents', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Calendar/UpdateEvent', (req, res) => {
    let data = req.body;
    api.dc4.post('/Calendar/UpdateEvent', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/Calendar/AddEvent', (req, res) => {
    let data = req.body;
    api.dc4.post('/Calendar/AddEvent', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Calendar/RemoveEvent', (req, res) => {
    let data = req.body;
    api.dc4.post('/Calendar/RemoveEvent', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Calendar/AddFile', (req, res) => {
    let data = req.body;
    api.dc4.post('/Calendar/AddFile', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Calendar/GetEventPdf', (req, res) => {
    let data = req.body;
    api.dc4.post('/Calendar/GetEventPdf', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


//SAFETY INCIDENTS
router.post('/SafetyIncidents/getIncidents', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyIncidents/GetSafetyIncidents', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/SafetyIncidents/AddIncident', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyIncidents/AddNewIncident', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/SafetyIncidents/RemoveIncident', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyIncidents/DeleteIncident', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


// SAFETY INSPECTION CHECKLIST
router.post('/SafetyInspectionChecklist/getTemplate', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyInspectionChecklist/GetInspectionTemplateComponents', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/SafetyInspectionChecklist/addNewChecklist', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyInspectionChecklist/AddNewSafetyChecklist', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/SafetyInspectionChecklist/AddNewComponentToSafetyChecklistTemplate', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyInspectionChecklist/AddNewComponentToSafetyChecklistTemplate', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/SafetyInspectionChecklist/LoadTable', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyInspectionChecklist/LoadSafetyChecklistTable', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/SafetyInspectionChecklist/SafetyTemplateSequence_MoveDown', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyInspectionChecklist/SafetyTemplateSequence_MoveDown', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/SafetyInspectionChecklist/SafetyTemplateSequence_MoveUp', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyInspectionChecklist/SafetyTemplateSequence_MoveUp', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/SafetyInspectionChecklist/SafetyTemplate_ChangeActiveStatus', (req, res) => {
    let data = req.body;
    api.dc4.post('/SafetyInspectionChecklist/SafetyTemplate_ChangeActiveStatus', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


// notification  routes
//GetAllActivities
router.post('/Notifications/GetAllUserNotifications', (req, res) => {
    let data = req.body;
    api.dc4.post('/Notifications/GetAllUserNotifications', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Notifications/UpdateUserNotificationSettings', (req, res) => {
    let data = req.body;
    api.dc4.post('/Notifications/UpdateUserNotificationSettings', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/Notifications/GetUserSelectedNotificationModules', (req, res) => {
    let data = req.body;
    api.dc4.post('/Notifications/GetUserSelectedNotificationModules', data).then(
        response => {
            let output = response.data;

            res.send(output);
        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});




router.post('/UserGroupManagement/CreateNewUserGroup', (req, res) => {
    let data = req.body;
    api.dc4.post('/DCMUser/CreateUserGroup', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Pickers/GetAllUserGroups', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllUserGroups', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/Pickers/GetAllUserGroupScreens', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllUserGroupScreens', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Pickers/GetAllDCMUsers', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllDCMUsers', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/Pickers/GetAllSelectedGroupDCMUsers', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/GetAllSelectedGroupDCMUsers', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/Pickers/UpdateUserGroup', (req, res) => {
    let data = req.body;
    api.dc4.post('/Pickers/UpdateUserGroup', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/payrollHistory/GetAllRecords', (req, res) => {
    let data = req.body;
    api.dc4.post('/payrollHistory/GetAllRecords', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});

router.post('/TimeAndAttendence/GetAllTimeandAttendenceEntries_Makita', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/GetAllTimeandAttendenceEntries_Makita', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/TimeAndAttendence/AddAttendance_Makita', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/AddAttendance_Makita', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});


router.post('/TimeAndAttendence/UpdateTimeandAttendenceEntry_Makita', (req, res) => {
    let data = req.body;
    api.dc4.post('/TimeAndAttendence/UpdateTimeandAttendenceEntry_Makita', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});



router.post('/UserRole/GetAllRoles', (req, res) => {
    let data = req.body;
    api.dc4.post('/Roles/GetAllRoles', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});



router.post('/UserRole/InsertNewUserRole', (req, res) => {
    let data = req.body;
    api.dc4.post('/Roles/InsertNewUserRole', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});



router.post('/UserRole/DeleteUserRole', (req, res) => {
    let data = req.body;
    api.dc4.post('/Roles/DeleteUserRole', data).then(
        response => {
            let output = response.data;

            res.send(output);

        }).catch(
            err => {
                res.status('503').send({
                    message: 'Failed to connect to server.'
                });
            }
        );
});



module.exports = router;