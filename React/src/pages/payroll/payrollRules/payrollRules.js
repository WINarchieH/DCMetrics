import React, {useState, useEffect} from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { useSelector } from 'react-redux';

const tableTitle = 'Payroll Rules';
const tableColumns = [
        {Header: 'Serial ID', accessor: 'SerialID', filter: 'text'}, 
        {Header: 'Category', accessor: 'Category',  filter: 'text', modalType: 'textbox'}, 
        {Header: 'Rule Name', accessor: 'Rule', filter: 'text', modalType: 'textbox'},
        {Header: 'Value', accessor: 'Value', filter: 'text', modalType: 'textbox'},
        {Header: 'Description', accessor: 'Description',filter: 'text', modalType: 'textbox'},
    ];

const defaultInput = {
    'SerialID':'',
    'Category':'',
    'Rule':'',
    'Value':'',
    'Description':'',
    'DCMUser':''
};

const PayrollRules =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput, , handleInputEvent] = useInputState(defaultInput);

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add New Payroll Rule');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);

    // Current State
    const [tableLoading, setTableLoading] = useState(true);

    const user = useSelector(store => store.user); 
    defaultInput.DCMUser = user ; 

    
    // Event Handlers for Table
    // const addTableHandler = () => {
    //     setShowModal(true);
    //     setModalMode(1);
    //     setInput(defaultInput);
    //     setModalMessage('');
    //     setModalMessageError('');
    // }

    const editTableHandler = (data) => {
        setShowModal(true); 
        setModalMode(2);
        setInput(data);
        setOriginalInput(data);
        setModalMessage('');
        setModalMessageError('');
    }
    // Function to send requests to update table
    const getPayrollRules = async () => {
        setTableLoading(true);


        let body = new URLSearchParams({
            'DCMUser':input.DCMUser
        });
        await api.post('/Maintenance/PayrollRule/GetAllRules',body).then(
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
            setModalMessageError('Error: No changes have been made to Value');
            setLoadModal(false);
            return;
        }
        input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/PayrollRule/UpdatePayrollRule', body).then(
            res => {
                let response = res.data.response;
               

                if (response === 'Payroll Rule Entry Updated') {
                    setModalMessage(`Payroll Rule with Name ${input.Rule} and Value ${input.Value} successfully updated.`);
                    // Update table on the frontend
                    let data = tableData.slice();
                    let index = data.map(x => x.SerialID).indexOf(originalInput.SerialID);
                    data[index] = input;
                    setTableData(data);
                }
                else if (response === 'Duplicate Values of Payroll Rule found') {
                    setModalMessageError(`Error: Payroll Rule With Value ${input.value} already exists. Please change the value.`);
                }
                else if (response ==="No changes Made")
                {
                    setModalMessageError(`No changes Made. Please change the Rule Value`);
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

    const onSubmit = (event) => { // Form switchs submit eveent
        event.preventDefault();
        setLoadModal(true);
        setModalMessage('');
        setModalMessageError('');

        updateHandler(event);
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
        getPayrollRules();
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
                        <TextField name='Rule' disabled label='Rule' value={input.Rule} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <TextField type = 'text' name='Value' label='Value' value={input.Value} onChange={handleInputEvent} required restrictions='default'></TextField>
                        <TextField name='Description'  disabled label='Rule Description' value={input.Description} onChange={handleInputEvent} required restrictions='default'></TextField>
                    </div>
                </Modal>
            }
        />
    )
};

export default PayrollRules;