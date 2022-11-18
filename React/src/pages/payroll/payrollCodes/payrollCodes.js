import React, {useState, useEffect} from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';



const tableTitle = 'Payroll Codes';
const tableColumns = [
        {Header: 'Serial ID', accessor: 'SerialID', filter: 'text'}, 
        {Header: 'Category', accessor: 'Category',  filter: 'text', modalType: 'textbox'}, 
        {Header: 'Code', accessor: 'Code', filter: 'text', modalType: 'textbox'},
        {Header: 'Description', accessor: 'Description', filter: 'text', modalType: 'textbox'},
        {Header: 'UDF1', accessor: 'UDF1',filter: 'text', modalType: 'textbox'},
        {Header: 'UDF2', accessor: 'UDF2',filter: 'text', modalType: 'textbox'}
    ];

const defaultInput = {
    'SerialID':'',
    'Category':'',
    'Code':'',
    'Description':'',
    'UDF1':'',
    'UDF2':'',
    'DCMUser':''
   
};

const PayrollCodes =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput,, handleInputEvent] = useInputState(defaultInput);

    const user = useSelector(store => store.user); 
    defaultInput.DCMUser = user ; 



    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add New Payroll Code');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);
    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    
    // Event Handlers for Table
    const editTableHandler = (data) => {
        setShowModal(true); 
        setModalMode(2);
        setInput(data);
        setOriginalInput(data);
        setModalMessage('');
        setModalMessageError('');
    }
    // Function to send requests to update table
    const getpayrollCodes = async () => {
        setTableLoading(true);

        let body = new URLSearchParams({
            'DCMUser':input.DCMUser
        })
        await api.post('/Maintenance/PayrollCode/GetAllPayrollCode',body).then(
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

    const updateHandler = async () => {
        if (!checkChange(originalInput, input)) {
            setModalMessageError('Error: No changes have been made to Payroll Codes');
            setLoadModal(false);
            return;
        }
        input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/PayrollCode/UpdatePayrollCode', body).then(
            res => {
                let response = res.data.response;
             

                if (response === 'Payroll Code Entry Updated') {
                    setModalMessage(`Payroll Code ${input.Code} and Category ${input.Category} successfully updated.`);
                    // Update table on the frontend
                    let data = tableData.slice();
                    let index = data.map(x => x.SerialID).indexOf(originalInput.SerialID);
                    data[index] = input;
                    setTableData(data);
                }
                else if (response === 'Duplicate Values of Payroll Code Found') {
                    setModalMessageError(`Error: Payroll Code ${input.Code} and Category ${input.Category} already exists. Please change the value.`);
                }
                else if (response ==="No changes Made")
                {
                    setModalMessageError(`No changes Made. Please change the Rule Value`);
                }
                else {
                    setModalMessageError(response);
                }
                setLoadModal(false);
            }).catch(
                err => { // TODO: Error handling
                   
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                    setLoadModal(false);
                }
            );
    };  

    const onSubmit = (event) => { // Form switchs submit eveent
        event.preventDefault();
        setLoadModal(true);
        setModalMessage('');
        setModalMessageError('');

        if (modalMode === 1) {
           // addHandler(event);
        }
        else {
            updateHandler(event);
        }
    };


    useEffect(() => { // Updates Modal title and button name
        if (modalMode === 1) {
            setModalTitle('Add Leave');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Payroll Rule');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => {
        getpayrollCodes();
    }, []);


    return (        
        <TableScreen
            table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
                          editHandler={editTableHandler} ></Table>}
            modal={
                <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} 
                    setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError} unrestrictWidth={true}>
                    <div  className='modal-grouping--col-2'>
                        <TextField name='Category' disabled label='Category' value={input.Category} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <TextField name='Code'  label='Code' value={input.Code} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <TextField  name='Description' disabled label='Code Description' value={input.Description} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <TextField name='UDF1' disabled label='UDF1' value={input.UDF1} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <TextField name='UDF2' disabled label='UDF2' value={input.UDF2} onChange={handleInputEvent} required restrictions='default'></TextField>
                    </div>
                </Modal>
            }
        />
    )
};

export default PayrollCodes;