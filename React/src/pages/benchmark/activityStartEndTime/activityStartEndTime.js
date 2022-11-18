import React, {useState, useEffect} from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import {SelectMultipleFilter} from '../../../components/table/filters';
import DropDown from '../../../components/fields/dropdown';
import { useSelector } from 'react-redux';

const tableTitle = 'Activity Start End Time Matrix';
const tableColumns = [
        {Header: 'Activity', accessor: 'Activity', filter: 'text'}, 
        {Header: 'Zone', accessor: 'Zone', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        {Header: 'Start End Time', accessor: 'StartEndTime', filter: 'text', modalType: 'textbox'}, 
    ];

const defaultInput = {
    'Activity':'',
    'Zone':'',
    'StartEndTime':'',
    'DCMUser':''
};

const dropdownData = {
    'ActivityName': [],
    'Zone': [],
};

const ActivityStartEndTime =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput, , handleInputEvent] = useInputState(defaultInput);
    const user = useSelector(store => store.user); 
    defaultInput.DCMUser = user ; 

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add New Start End Time');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
     const [originalInput, setOriginalInput] = useInputState(input);
    
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
    }
    // Function to send requests to update table
    const getActivityStartEndtimeEntries = async () => {

        let body = new URLSearchParams({
            'DCMUser': input.DCMUser
        })

        await api.post('/Benchmark/ActivityStartEndTime/GetAllEntries',body).then(
            res => {
                let data = res.data;  
                setTableData(data);  
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

    // API Handlers
    const addHandler = async () => {
        let body = new URLSearchParams(input);
        await api.post('/Benchmark/ActivityStartEndTime/InsertRecord', body).then(
            res => {
                let response = res.data;
                if (response === 'New Record Inserted') {
                    getActivityStartEndtimeEntries();
                    setModalMessage(`Record successfully added.`);
                }
                else if (response === 'Duplicate record found.Try different Activity or Zone.') {
                    setModalMessageError(`Error:Duplicate record found.Try different Activity or Zone.`);
                }
                else {
                    setModalMessageError(res.data.response);
                }
                setLoadModal(false);
            }
        ).catch(
            err => { // TODO: Error handling
                console.log(err);
                setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                setLoadModal(false);
            }
        );
    }

    const updateHandler = async () => {
        if (!checkChange(originalInput, input)) {
            setModalMessageError('Error: No changes have been made to manager name or position.');
            setLoadModal(false);
            return;
        }

        input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/TeamManager/UpdateManager', body).then(
            res => {
                let response = res.data.response;
              //  console.log(response);

                if (response === 'Manager updated in the DC Metrics') 
                {
                    setModalMessage(`Manager ${input.ManagerName} with position ${input.Position} successfully updated.`);
                    // Update table on the frontend
                    let data = tableData.slice();
                    let index = data.map(x => x.SerialID).indexOf(originalInput.SerialID);
                    data[index] = input;
                    setTableData(data);
                }
                else if (response === 'Dulpicate entries in the DC Metrics System') {
                    setModalMessageError(`Error: Manager ${input.ManagerName} with position ${input.Position} already exists. Please change manager name or position.`);
                }
                else {
                    setModalMessageError(res.data.response);
                }
                setLoadModal(false);
            }).catch(
                err => { // TODO: Error handling
                    console.log(err);
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                    setLoadModal(false);
                }
            );
    };  

    const deleteHandler = async (rowData) => {
        let data = tableData.slice();
        let index = data.indexOf(rowData);
        data.splice(index, 1);
        setTableData(data);

        let body = new URLSearchParams({
            'Activity': rowData.Activity,
            'Zone':rowData.Zone,
            'DCMUser':input.DCMUser
        });
        await api.post('/Benchmark/ActivityStartEndTime/DeleteMatrix', body).then(
            res => {
                let response = res.data;

               if (response === 'Selected Record Deleted')
               {
                data.splice(index, 1);
               }
               else
               {
                   window.alert(response);
               }

               setTableData(data);
            }
        ).catch(
            err => { // TODO: Error handling
                console.log(err);
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
        }
        else {
            updateHandler(event);
        }
    };


    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add New Start End Time');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Manager');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Dropdown Data
        

        getActivityStartEndtimeEntries();
        // Retrieve Dropdown Data
        api.post('/Maintenance/Pickers/GetAllActivities').then( // Team Manager List
            res => {
                let data = res.data;    
                dropdownData['ActivityName'] = data.map(x => x['ActivityName']);

            });
        api.post('/Maintenance/Pickers/GetAllZone').then( // Agencies List
            res => {
                let data = res.data;
                dropdownData['Zone'] = data.map(x => x['ZoneNumber']);
              
            });
        
       
        }, []);

    return (        
        <TableScreen
            table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle}
                        addHandler={addTableHandler} deleteHandler={deleteHandler}></Table>}
            modal={
                <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} 
                    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                  
                 
                  <DropDown name='Zone' label='Zone' options={dropdownData['Zone']}  defaultValue={input.Zone} onChange={handleInputEvent} required></DropDown>
                  <DropDown name='Activity' label='Activity' options={dropdownData['ActivityName']}  defaultValue={input.Activity} onChange={handleInputEvent} required></DropDown>
                  <TextField name='StartEndTime' label='Start End Time'  type="number"  value={input.StartEndTime} onChange={handleInputEvent} required restrictions='number' ></TextField>
         
                </Modal>
            }
        />
    )
};

export default ActivityStartEndTime;