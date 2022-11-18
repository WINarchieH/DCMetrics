import React, {useState, useEffect} from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import {DateCell} from '../../../components/table/tableCells';
import {SelectColumnFilter, SelectMultipleFilter, SelectDateRange} from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate} from '../../../components/fields/dateHelpers';
import DropDown from '../../../components/fields/dropdown';
import Toggle, {booleanToOutput, outputToBoolean} from '../../../components/fields/toggle';
import {useInputState, usePrevious} from '../../../components/hooks/hooks';
import { Tooltip, IconButton } from '@material-ui/core';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

const tableTitle = 'User Time Information'; // TODO: Screen title
const tableColumns = [ // TODO: Add Table columkns
    {Header: 'User ID', accessor: 'UserID', modalType: 'textbox'},
];

const defaultInput = { // TODO: default form values (column names must be same as database)
    'UserID': '',
};

// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = { // TODO: Add dropdown data
    'Employee Category': ['Permanent', 'Casual', 'HeadOffice'],
    'Shift Code': [],
}

// Relabelling Dropdown labels
const dropdownLabels = { // TODO: Add dropdown labels
    'Status': ['Active', 'Inactive']
}

const Template =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

    // Parameter handlers for modal
    // TODO: Add Date conversion handlers
    // TODO: Add boolean toggle handlers

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('User Details'); 
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const originalInput = usePrevious(input);
    
    // Event Handlers for Table
    const addTableHandler = () => {
        setShowModal(true);
        setModalMode(1);
        setInput(defaultInput);
        setModalMessage('');
        setModalMessageError('');
    };

    const editTableHandler = (data) => {
        // TODO: Add type conversion for date objects (otherwise screen will crash on date input change)
        console.log(data);
        setShowModal(true); 
        setModalMode(2);
        setInput(data);
        setModalMessage('');
        setModalMessageError('');
    };
    
    // Component for Conditional Actions
    const conditionalActions = (row) => {
        // TODO: Optional add extra row action button 
        // Returns null or JSX
    }
  
    // Function to send requests to update table
    const getTable = async () => {
        // TODO: Get Api Request
    };

    const addHandler = () => {
        // TODO: Check valid input (eg. start date is before end date)

        // TODO: Add Api Request
    };

    const updateHandler = async () => {
        // TODO: Check valid input (eg. start date is before end date)

        // TODO: Update Api Request
    };

    const deleteHandler = async (rowData) => {
        // Delete row from table
        let data = tableData.slice();
        let index = data.indexOf(rowData);
        data.splice(index, 1);
        setTableData(data);

        // TODO: Add Delete API Request
    };
    
    const onSubmit = (event) => { // Form switchs submit eveent
        event.preventDefault();
        setLoadModal(true);
        setModalMessage('');
        setModalMessageError('');

        if (modalMode === 1) {
            addHandler(event);
        }
        else {
            updateHandler(event);
        }
    };

    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add User');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update User'); 
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Dropdown Data
        getTable();

        // Retrieve Dropdown Data
        // TODO: Add Dropdown data code
        }, []);

        // TODO: Edit TableScreen properties where appropriate
    return (<TableScreen
                table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle}
                    addHandler={addTableHandler} editHandler={editTableHandler} deleteHandler={deleteHandler}
                    conditionalAction={conditionalActions}></Table>}
                modal={
                        <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal}  unrestrictWidth={true}
    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                            {/* TODO: Add Modal Body */}
                        </Modal>                    
                        }/>)
};

export default Template;