import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, { checkChange } from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import DropDown from '../../../components/fields/dropdown';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import MUIRichTextEditor from "mui-rte";


// Ag Grid

// Importing Ag Grid Community Version
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Screen from '../../../components/screen/screen';
import Header from '../../../components/header/header';

import SaveIcon from '@material-ui/icons/Save';

import Backdrop from '@material-ui/core/Backdrop';
import { ClockLoader } from "react-spinners";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import './userDiary.scss';
import Add from '../../../components/icons/Add.png';
import DownloadExcel from '../../../components/icons/Download_Excel.png';
import Delete from '../../../components/icons/Bin.png';
const tableTitle = 'User Diary';


const defaultInput = {

    'NoteType': '',
    'FirstName': '',
    'SurName': '',
    'DCMUser': ''
};

const dropdownData = {
    'NoteTypes': [],
    'UserList': []
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 50%',
        fontFamily: 'calibri',
        fontSize: 'small'
    },
}));



const UserDiary = () => {

    const [tableData, setTableData] = useState([]);
    const user = useSelector(store => store.user); // update by will be dcm user 
    defaultInput.DCMUser = user;
    const [input, setInput, , handleInputEvent] = useInputState(defaultInput);

    const [userID, setUserID] = useState('');
    const [FullName, setFullName] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [surname, setSurname] = useState(null);
    const [userId, setUserId] = useState(null);
    const [save, setSave] = useState(null);
    const [noteType, setNoteType] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState((new Date()));

    const handleChange = (event) => {
        setNoteType(event.target.value || '');
        //setBtnPopUpText(event.target.value);
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);

    };
    const handleNote = (event) => {
        setSave(event.target.value);
    }

    // Drop change change method  for User List Dropdown and populating the FirstName and Surname Textbox in the add modal 
    const UserListChange = (event) => {

        const username = event.target.value;
        if (username) {
            var names = username.split(' ');
            setFirstName(names[0]);
            setSurname(names[names.length - 2]);

            names[names.length - 1] = names[names.length - 1].replace('(', '').replace(')', '');
            setUserId(names[names.length - 1]);

            setFullName(username);
        }
    };
    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add New Note');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');

    // const originalInput = usePrevious(input);
    const [originalInput, setOriginalInput] = useInputState(input);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const [noteText, setNoteText] = useState('')
    
    const onRTEChange = event => {
        const plainText = event.getCurrentContent().getPlainText().toString(); // for plain text
        setNoteText(plainText);
        // console.log({value});
      }

    //Backdrop
    const [open, setOpen] = React.useState(false);


    //cSS Classes 
    const classes = useToolbarStyles();
    // Current State
    const [tableLoading, setTableLoading] = useState(true);

    // Event Handlers for Table
    const addTableHandler = () => {
        setShowModal(true);
        setModalMode(1);
        setInput(defaultInput);
        setModalMessage('');
        setModalMessageError('');
    };

    const editTableHandler = (data) => {
        setShowModal(true);
        setModalMode(2);
        setInput(data);
        setOriginalInput(data);
        setModalMessage('');
        setModalMessageError('');
    };

    // Function to send requests to update table
    const getNotes = async () => {
        setTableLoading(true);

        let body = new URLSearchParams({
            'DCMUser': user,
            'UserID': userID
        });

        await api.post('/Maintenance/UserInfo/UserNotes', body).then(
            res => {
                let data = res.data;
                setTableData(data);
                setTableLoading(false);
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {
                        console.log(err.response)
                    }
                    else {
                    }
                }
            );
    };

    const getNoteTypesDropdown = async () => {
        setTableLoading(true);

        let body = new URLSearchParams({
            'DCMUser': user,
        });

        await api.post('/Maintenance/UserInfo/NoteTypes', body).then(
            res => {
                let data = res.data;
                dropdownData['NoteTypes'] = data.map(x => x['NoteType']);
                setTableLoading(false);
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {
                        console.log(err.response)
                    }
                    else {
                    }
                }
            );
    };

    const getUserList = async () => {
        setTableLoading(true);

        let body = new URLSearchParams({
            'DCMUser': user,
        });
        api.post('/Maintenance/Pickers/GetAllUserNames').then( // Reasons Codes List
            res => {
                let data = res.data;
                dropdownData['UserList'] = data.map(x => x);
            });
    };

    // API Handlers
    const addHandler = async () => {

        if(noteText==""){
            window.alert("You may have forgotten to write a note.");
            return;
        }

        input.DCMUser = user;
        input.IncidentDate = selectedDate.toString().substr(4, 12);
        input.UserID = userId;
        input.NoteType = noteType;
        input.Note = noteText;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/UserInfo/AddUserNote', body).then(
            res => {
                let response = res.data;

                if (response === 'New Note has been Added for user.') {
                    getNotes();
                    setModalMessage(`Diary Note for ${userId} has been successfully added.`);
                    setSelectedDate(new Date());
                    setNoteType('');
                    setNoteText('');
                    setUserID('');
                    setFullName('');
                }
                else {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                }

            }
        ).catch(
            err => { // TODO: Error handling
                console.log(err);
                setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                setLoadModal(false);
            }
        );
    }

    const updateHandler = async (rowdata) => {


        // String Validation check



        if (isNaN(rowdata.ManagerName) === false) {
            alert("Error: Please enter valid Manager Name");
            return;
        }
        if (isNaN(rowdata.Position) === false) {
            alert("Error: Please enter valid Position");
            return;
        }

        input.SerialID = rowdata.SerialID;
        input.ManagerName = rowdata.ManagerName;
        input.Position = rowdata.Position;
        input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/TeamManager/UpdateManager', body).then(
            res => {
                let response = res.data.response;
                console.log(response);

                if (response === 'Manager updated in the DC Metrics') {
                    alert(`Manager ${input.ManagerName} with position ${input.Position} successfully updated.`);
                    // Update table on the frontend

                    // setTableData(data);
                }
                else if (response === 'Dulpicate entries in the DC Metrics System') {
                    alert(`Error: Manager ${input.ManagerName} with position ${input.Position} already exists. Please change manager name or position.`);
                }
                else {
                    alert(`Error: Failed to connect to server. Please try again.`);
                }

            }).catch(
                err => { // TODO: Error handling
                    console.log(err);
                    alert(`Error: Failed to connect to server. Please try again.`);

                }
            );
    };

    const deleteHandler = async (params) => {

        let body = new URLSearchParams({
            'SerialID': params.data.SerialID,
            'DCMUser': user
        });


        await api.post('Maintenance/UserInfo/DeleteNote', body).then(
            res => {
                if (res.data === 'Note has been removed for user.') {
                    params.api.applyTransaction({
                        remove: [params.node.data]
                    });
                }
                else {
                    window.alert("Note deletion has failed.");
                }

            }
        ).catch(
            err => { // TODO: Error handling
                window.alert(err);
            }
        );
    }

    const onSubmit = (event) => { // Form switchs submit eveent
        event.preventDefault();
        setLoadModal(true);
        setModalMessage('');
        setModalMessageError('');

        if (modalMode === 1) {
            addHandler(event);
            setLoadModal(false);
        }
        else {
            updateHandler(event);
        }
    };



    const ActionRowButton = (params) => {
        params.columnApi.autoSizeAllColumns();
        return (

            <React.Fragment>

                {/* <Tooltip title="Save">
                    <IconButton aria-label="Save" onClick={() => updateHandler(params.data)} >
                        <SaveIcon></SaveIcon>
                    </IconButton>
                </Tooltip> */}
                <Tooltip title="Delete">
                    <IconButton aria-label="Delete" onClick={() => deleteHandler(params)} >
                    <img width={ 35 } height={35} src={Delete}></img>
                    </IconButton>
                </Tooltip>
            </React.Fragment>
        );
    };
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };


    const ExportDataToCSVFile = () => {
        var excelParams = {

            fileName: 'Diary Notes_' + user,
            skipHeader: false,
        };
        gridApi.exportDataAsCsv(excelParams);

    }

    //Ag grid Row Styling


    var gridOptions = {

        rowStyle: { borderBottom: 'rgb(255, 255, 255)',    fontFamily: 'Montserrat' ,  },
        getRowStyle: params =>
        {
            if (params.node.rowIndex % 2 === 0)
            {
                return { background: 'rgb(233,247,254)'  };

             }
             else
             {
                return { background: 'rgb(255,255,255)'};

             }
        },
        suppressClickEdit: false,

        onRowEditingStarted: (params) => {
            params.api.refreshCells({
                columns: ["Action"],
                rowNodes: [params.node],
                force: true
            });
        },
        onRowEditingStopped: (params) => {
            params.api.refreshCells({
                columns: ["Action"],
                rowNodes: [params.node],
                force: true
            });
        },
        // editType: "fullRow",

    };

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add New Note');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Manager');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => {
        getNotes();
        getNoteTypesDropdown();
        getUserList();
    }, []);
    
    return (

        <div>
            <Header></Header>

            <div>
                <Backdrop className={classes.backdrop} open={open}>
                    <ClockLoader color="green" loading={true} size={50}></ClockLoader>
                </Backdrop>
            </div>
            <div className="screen-container">

                <div className="panel panel--table">
                    <div className='table-full-container'>

                        <div className="test-header">
                            <React.Fragment>
                                <div className="title-header">
                                    <h4> USER DIARY</h4>
                                </div>

                                <div className="add-header">
                                    <Tooltip title='Add Entry'>
                                        <IconButton aria-label='Add Entry' onClick={() => addTableHandler()} >
                                        <img width={ 35 } height={35} src={Add}></img>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Export CSV'>
                                        <IconButton aria-label='ExportCSV' onClick={() => ExportDataToCSVFile()} >
                                        <img width={ 35 } height={35} src={DownloadExcel}></img>
                                        </IconButton>
                                    </Tooltip>

                                </div>


                            </React.Fragment>
                        </div>

                        <div className="ag-theme-alpine" style={{ width: '100%', height: 590 }}  >

                            <AgGridReact rowHeight={50}

                                gridOptions={gridOptions}
                                onGridReady={onGridReady}
                                defaultColDef={{
                                    editable: false,
                                    enableRowGroup: true,
                                    enablePivot: true,
                                    enableValue: true,
                                    sortable: true,
                                    resizable: true,
                                    filter: true,
                                    floatingFilter: true,
                                    flex: 1,
                                    minWidth: 152,
                                }}

                                pagination={true}
                                animateRows={true}
                                rowSelection="multiple"
                                rowData={tableData}
                            >

                                <AgGridColumn headerName="Action" lockPosition={true} cellRendererFramework={ActionRowButton} colId="Action" editable={false} filter={false} />
                                <AgGridColumn headerName="User ID" field="UserID" editable={false} />
                                <AgGridColumn headerName="FullName" field="FullName" />
                                <AgGridColumn headerName="Incident Date" field="IncidentDate" />
                                <AgGridColumn headerName="NoteType" field="NoteType" />
                                <AgGridColumn headerName="UpdatedBy" field="UpdatedBy" />
                                <AgGridColumn headerName="Note" field="Note" />
                                <AgGridColumn headerName="ID" field="SerialID" />
                            </AgGridReact>
                        </div>
                        <div className='modal-item'>
                            <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}
                                setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} unrestrictWidth={true} messageError={modalMessageError}>
                                <div className='modal-grouping--col-3'>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Incident Date"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                    <DropDown name='FullName' label='User List' options={dropdownData['UserList']} hidden={modalMode === 1 ? null : true} defaultValue={FullName} disabled={modalMode === 1 ? null : true} onChange={UserListChange} required></DropDown>
                                    <DropDown name='NoteTypes' label='Note Types' options={dropdownData['NoteTypes']} defaultValue={noteType} onChange={handleChange} required></DropDown>

                                    {/* <TextField name='Note' label='Note' value={save} onChange={handleNote} required ></TextField> */}
                                </div>
                                <MUIRichTextEditor 
                                    
                                    label="Type something here..."
                                    // onSave={save}
                                    onChange={onRTEChange}
                                    toolbar={false}
                                />
                                <br></br>




                            </Modal>
                        </div>

                        <div>

                        </div>


                    </div>

                </div>

            </div>
        </div>


    )
};

export default UserDiary;