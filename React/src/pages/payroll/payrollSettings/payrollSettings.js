import React, {useState, useEffect} from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import DropDown from '../../../components/fields/dropdown';
import {SelectMultipleFilter, } from '../../../components/table/filters';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { useSelector } from 'react-redux';



const tableTitle = 'Payroll Settings';
const tableColumns = [
        {Header: 'Emp Type', accessor: 'EmpType',  Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},  
        {Header: 'Shift Type', accessor: 'ShiftType',  filter: 'text', modalType: 'textbox'},         
        {Header: 'Day', accessor: 'NameOfDay', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},        
        {Header: 'Single Time', accessor: 'SingleTime',filter: 'text', modalType: 'textbox'},
        {Header: 'TimeAH', accessor: 'TimeAH',filter: 'text', modalType: 'textbox'},
        {Header: 'DoubleTime', accessor: 'DoubleTime',filter: 'text', modalType: 'textbox'},
        {Header: 'DH', accessor: 'DoubleTimeAH',filter: 'text', modalType: 'textbox'},
        {Header: 'Weekend', accessor: 'Weekend', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        {Header: 'HrsBeforeLunch', accessor: 'HoursBeforeLunch', filter: 'text', modalType: 'textbox'},
        {Header: 'ID', accessor: 'ID', filter: 'text'}
    ];

const defaultInput = {
    'SerialID':'',
    'ShiftType':'',
    'DayInt':'',
    'NameOfDay':'',
    'Weekend':'',
    'SingleTime':'',
    'TimeAH':'',
    'DoubleTime':'',
    'DoubleTimeAH':'',
    'EmpType': '',
    'HoursBeforeLunch':'',
    'DCMUser':''
    
};
const dropdownData = {
    EmpType:[],
    NameOfDay: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    Weekend: ['Yes','No']
};
const PayrollSettings =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput,, handleInputEvent] = useInputState(defaultInput);
    const user = useSelector(store => store.user); 
    defaultInput.DCMUser = user ; 



    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add New Payroll Settings');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const originalInput = usePrevious(input);

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
        setModalMessage('');
        setModalMessageError('');
    }
    
    
    // Function to send requests to update table
    const getTable = async () => {
        setTableLoading(true);

        let body = new URLSearchParams({
            'DCMUser':user
        })
        await api.post('/DataCapture/PayrollSettings/GetPermanentPaySettings',body).then(
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


    const addHandler = async() => {
        let body = new URLSearchParams(input);

     
        await  api.post('/DataCapture/PayrollSettings/AddPaySettings', body).then( 
            res => {
                let response = res.data;
              
                if (response === 'New Payroll Settings Added') { 
                    
                    // Update table on the frontend                   
                   setModalMessage(`Payroll Settings for ${input.NameOfDay} Shift Type ${input.ShiftType} Created`);
                   getTable();
                }
                else if (response === 'Agency Already Present') { 
                    setModalMessageError(`Error:Agency ${input.AgencyName} already present`);
                }
                else {
                    setModalMessageError(response); 
                }
                setLoadModal(false);
                
            }
        ).catch(
            err => { // TODO: Error handling
                setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                setLoadModal(false);
            }
        );
    };

    const updateHandler = async () => {
  
        if (!checkChange(originalInput, input)) {
            setModalMessageError('Error: No changes have been made to date or description');
            setLoadModal(false);
            return;
        }

        input.DCMUser = user;

        let body = new URLSearchParams(input);
        await api.post('/DataCapture/PayrollSettings/UpdatePaySettings', body).then(
            res => {
                let response = res.data;
              
                if (response === 'Payroll Settings Entry Updated') {
                    setModalMessage(`Payroll Settings with Emp Type ${input.EmpType} is updated for ${input.NameOfDay}`);
                    // Update table on the frontend
                    let data = tableData.slice();
                    let index = data.map(x => x.ID).indexOf(originalInput.ID);
                    data[index] = input;
                    setTableData(data);
                }
                
                else if (response ==="Duplicate Records found with Shift Type and Day")
                {
                    setModalMessageError(`Duplicate Records found with Shift Type and Day`);
                }
                else if (response ==="Error while Updating the Payroll Settings Entry")
                {
                    setModalMessageError(`Error while Updating the Payroll Settings Entry`);
                }
                else {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
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
        let body = new URLSearchParams({
            'ID': rowData.ID,
            'DCMUser':input.DCMUser
        });
        await api.post('DataCapture/PayrollSettings/DeletePaySettings', body).then(
            res => {
               let response = res.data;
               if (response === 'Payroll Settings Deleted')
               {
                data.splice(index, 1);
               }
               else
               {
                   Window.alert("Unexpected Error has Occured. Please try again.");
               }

               setTableData(data);
            }
        ).catch(
            err => { // TODO: Error handling
                Window.alert(err);
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
            setModalTitle('Add Payroll Settings');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Payroll Settings');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => {
        getTable();
        // Retrieve Dropdown Data
        // api.get('/Maintenance/UserInfo/GetAllShiftCodes').then( // Shit Codes List 
        //     res => {
        //         let data = res.data;
        //         dropdownData['Shift Code'] = data.map(x => x['shiftcode']);
        //     });     
        dropdownData['EmpType'] = ['P','C'];        
    }, []);


    return (        
        <TableScreen
            table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
            addHandler={addTableHandler} editHandler={editTableHandler} deleteHandler={deleteHandler}></Table>}
            modal={
                <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} 
                    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError} unrestrictWidth={true}>
                    <div  className='modal-grouping--col-3'>
                        <DropDown name='EmpType' label='EmpType' options={dropdownData['EmpType']} defaultValue={input.EmpType} onChange={handleInputEvent} required></DropDown>                        
                        <TextField name='ShiftType'  label='ShiftType' value={input.ShiftType} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <DropDown  name='NameOfDay' label='NameOfDay' options={dropdownData['NameOfDay']} defaultValue={input.NameOfDay} onChange={handleInputEvent} required></DropDown>                        
                        <TextField name='SingleTime' label='SingleTime' value={input.SingleTime} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <TextField name='TimeAH' label='TimeAH' value={input.TimeAH} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <TextField name='DoubleTime' label='DoubleTime'  value={input.DoubleTime} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <TextField name='DoubleTimeAH' label='DoubleTimeAH' value={input.DoubleTimeAH} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <DropDown name='Weekend' label='Weekend' options={dropdownData['Weekend']} defaultValue={input.Weekend} onChange={handleInputEvent} required></DropDown>                        
                        <TextField name='HoursBeforeLunch' label='HoursBeforeLunch' value={input.HoursBeforeLunch} onChange={handleInputEvent} required restrictions='default'></TextField>
                       
                    </div>
                </Modal>
            }
        />
    )
};

export default PayrollSettings;