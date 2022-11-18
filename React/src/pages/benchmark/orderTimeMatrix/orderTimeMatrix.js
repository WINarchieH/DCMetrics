import React, {useState, useEffect} from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import DropDown from '../../../components/fields/dropdown';
import { useSelector } from 'react-redux';

const tableTitle = 'Order Time Matrix';
const tableColumns = [
    {Header: 'Serial ID', accessor: 'SerialID', filter: 'text'}, 
    {Header: 'Activity', accessor: 'Activity', filter: 'text'}, 
    {Header: 'Zone', accessor: 'Zone', filter: 'text'},
    {Header: 'Time Per Order', accessor: 'TimePerOrder', filter: 'text', modalType: 'textbox'}, 
    {Header: 'Time Per Container', accessor: 'TimePerContainer', filter: 'text', modalType: 'textbox'},
    {Header: 'PF&D Time (%)', accessor: 'PFDTime', filter: 'text', modalType: 'textbox'}, 
    {Header: 'Item Per Container', accessor: 'ItemPerContainer', filter: 'text', modalType: 'textbox'}, 
];

const defaultInput = {
    'Activity':'',
    'Zone':'',
    'TimePerOrder':'',
    'TimePerContainer':'',
    'PFDTime':'',
    'ItemPerContainer':'',
    'DCMUser':''
};

const dropdownData = {
    'ActivityName': [],
    'Zone': [],
};


const OrderTimeMatrix =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput, , handleInputEvent] = useInputState(defaultInput);

    const user = useSelector(store => store.user); 
    defaultInput.DCMUser = user ; 

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add New Order Time Matrix');
    const [modalButtonName, setModalButtonName] = useState('Add');
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [originalInput, setOriginalInput] = useInputState(input);

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    
    // Event Handlers for Table
    const addTableHandler = () => {
        setShowModal(true);
        setModalMode(1);
        setInput(defaultInput);
        setModalMessage('');
        setModalMessageError('');
    }

    const editTableHandler = (data) => {
        setShowModal(true); 
        setModalMode(2);
        setInput(data);
        setOriginalInput(data);
        setModalMessage('');
        setModalMessageError('');
    }

    // Function to send requests to update table
    const getOrderTimeEntries = async () => {
        setTableLoading(true);

        let body = new URLSearchParams({
            'DCMUser':user
        })
        await api.post('/Maintenance//OrderTimeMatrix/GetAllOrders',body).then(
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

    // API Handlers
    const addHandler = async () => {    
var value = parseInt(input.ItemPerContainer);
if (!(Number.isInteger(value)))
{
  
    setModalMessageError(`Error:Items Per Container Should be an Integer Value`);
    setLoadModal(false);
    return;
}

        let body = new URLSearchParams(input);
        await api.post('/Maintenance/OrderTimeMatrix/InsertNewOrder', body).then(
            res => {
                let response = res.data;
                if (response === 'New Time Order Created') {
                    getOrderTimeEntries()
                    setModalMessage(`Activity ${input.Activity} with Zone ${input.Zone} successfully added.`);
                }
                else if (response === 'Duplicate record found') {
                    setModalMessageError(`Error: Activity ${input.Activity} with Zone ${input.Zone} already exists.`);
                }
                else {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
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
            setModalMessageError('Error: No changes have been made to Zone or Activity');
            setLoadModal(false);
            return;
        }

        input.DCMUser = user;

        let body = new URLSearchParams(input);
        await api.post('/Maintenance/OrderTimeMatrix/UpdateOrder', body).then(
            res => {
                let response = res.data;
             
                if (response === 'Time Order Updated') {
                    setModalMessage(`Zone ${input.Zone} with Activity ${input.Activity} successfully updated.`);
                    // Update table on the frontend
                    let data = tableData.slice();
                    let index = data.map(x => x.SerialID).indexOf(originalInput.SerialID);
                    data[index] = input;
                    setTableData(data);
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
            'SerialID': rowData.SerialID,
            'Zone':rowData.Zone,
            'Activity':rowData.Activity,
            'DCMUser':input.DCMUser
        });
        await api.post('Maintenance/OrderTimeMatrix/DeleteOrder', body).then(
            res => {
                if (res.data === "Order Time Deleted")
                {
                    data.splice(index, 1);
                }
                else
                {
                    window.alert("Error while deleting the order.Please try again.")
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
            setModalTitle('Add New Order Time Matrix');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Order Time Matrix');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Dropdown Data
        getOrderTimeEntries();

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
            table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
                        addHandler={addTableHandler} editHandler={editTableHandler} deleteHandler={deleteHandler}></Table>}
            modal={
                <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} 
                    setShowModal={setShowModal} unrestrictWidth={true} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                 <div className='modal-grouping--col-2'>
                  <DropDown name='Activity' label='Activity' options={dropdownData['ActivityName']}  defaultValue={input.Activity} onChange={handleInputEvent} required></DropDown>
                  <DropDown name='Zone' label='Zone' options={dropdownData['Zone']}  defaultValue={input.Zone} onChange={handleInputEvent} required></DropDown>
                    <TextField name='TimePerOrder' label='Time Per Order'  type="number"  value={input.TimePerOrder} onChange={handleInputEvent} required restrictions='number' ></TextField>
                    <TextField name='TimePerContainer' label='Time Per Container'  type="number"  value={input.TimePerContainer} onChange={handleInputEvent} required restrictions='number' ></TextField>
                    <TextField name='PFDTime' label='PFD Time (%)'  type="number"  value={input.PFDTime} onChange={handleInputEvent} required restrictions='number' ></TextField>
                    <TextField name='ItemPerContainer' label='Item Per Container'  type="number"  value={input.ItemPerContainer} onChange={handleInputEvent} required restrictions='number' ></TextField>
                    </div>
                </Modal>
            }
        />
    )
};

export default OrderTimeMatrix;