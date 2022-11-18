import React, {useState, useEffect} from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { useSelector } from 'react-redux';

const tableTitle = 'Maintain Zone';
const tableColumns = [
    {Header: 'Zone', accessor: 'Zone', filter: 'text'},
    {Header: 'Description', accessor: 'Description', filter: 'text', modalType: 'textbox'}, 
    {Header: 'Loc Range From', accessor: 'LocRangeFrom', filter: 'text', modalType: 'textbox'}, 
    {Header: 'Loc Range To  ', accessor: 'LocRangeTo', filter: 'text', modalType: 'textbox'},   
];

const defaultInput = {
    'Zone':'',
    'Description':'',
    'LocRangeFrom':'',
    'LocRangeTo':'',
    'DCMUser':''
};

const MaintainZone =  () => {
    const [tableData, setTableData] = useState([]);
    const [input, setInput, , handleInputEvent] = useInputState(defaultInput);
    const user = useSelector(store => store.user); 
    
    defaultInput.DCMUser = user ;

    // Parameters for modal
    const [modalMode, setModalMode] = useState(1);
    const [modalTitle, setModalTitle] = useState('Add New Zone');
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
    const getAllZones = async () => {
        setTableLoading(true);

        let body = new URLSearchParams({
            'DCMUser':user
        });
        await api.post('/Maintenance/MaintainZone/GetAllZones',body).then(
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
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/MaintainZone/AddZone', body).then(
            res => {
                let response = res.data;
                if (response === 'New Zone Added') {
                    getAllZones();
                    setModalMessage(`Zone ${input.Zone} successfully added.`);
                }
                else if (response === 'Duplicate Record Found') {
                    setModalMessageError(`Error: Zone ${input.Zone}  already exists.`);
                }
                else {
                    setModalMessageError(res.data);
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
            setModalMessageError('Error: No changes have been made to Zone or Location.');
            setLoadModal(false);
            return;
        }
        input.DCMUser = user;
        let body = new URLSearchParams(input);
        await api.post('/Maintenance/MaintainZone/UpdateZone', body).then(
            res => {
                let response = res.data;
              
                if (response === 'Update Zone Added') {
                    setModalMessage(`Zone ${input.Zone} successfully updated.`);
                    // Update table on the frontend
                  
                    let data = tableData.slice();
                    let index = data.map(x => x.Zone).indexOf(originalInput.Zone);
                    data[index] = input;
                    setTableData(data);
                }
                else {
                    setModalMessageError(res.data);
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
            'Zone': rowData.Zone,
            'LocRangeTo': rowData.LocRangeTo,
            'LocRangeFrom':rowData.LocRangeFrom,
            'DCMUser':input.DCMUser

        });
        await api.post('Maintenance/MaintainZone/DeleteZone', body).then(
            res => {
               let response = res.data;
               if (response === 'Zone Deleted')
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
            setModalTitle('Add New Zone');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Zone');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Dropdown Data
        getAllZones();
    }, []);

    return (        
        <TableScreen
            table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
                        addHandler={addTableHandler} editHandler={editTableHandler} deleteHandler={deleteHandler}></Table>}
            modal={
                <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} 
                   unrestrictWidth={true}  setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                        <div className='modal-grouping--col-2'>
                   <TextField name='Zone' label='Zone'  disabled={modalMode != 1 ? true : null} value={input.Zone.trim()} onChange={handleInputEvent} required restrictions='default' ></TextField>
                  <TextField name='Description' label='Description' value={input.Description.trim()} onChange={handleInputEvent} required restrictions='default' ></TextField>
                  <TextField name='LocRangeFrom' label='Loc Range From' value={input.LocRangeFrom.trim()} onChange={handleInputEvent} required restrictions='default' ></TextField>
                    <TextField name='LocRangeTo' label='Loc Range To' value={input.LocRangeTo.trim()} onChange={handleInputEvent} required restrictions='default' ></TextField>
                    </div>
                </Modal>
            }
        />
    )
};

export default MaintainZone;