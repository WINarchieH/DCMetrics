import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import DropDown from '../../../components/fields/dropdown';


const tableTitle = 'Pallet Handling Matrix';
const tableColumns = [
    {Header: 'Movable Units', accessor: 'MovableUnits', filter: 'text'},
    {Header: 'Activity', accessor: 'Activity', filter: 'text', modalType: 'textbox'}, 
    {Header: 'Unit Type', accessor: 'UnitType', filter: 'text', modalType: 'textbox'}, 
    {Header: 'Time Per Unit', accessor: 'TimePerUnit', filter: 'text', modalType: 'textbox'},   
];

const defaultInput = {
    'MovableUnits':'',
    'Activity':'',
    'UnitType':'',
    'TimePerUnit':''
};

const dropdownData = {
    'ActivityName': [],
    'Zone': [],
};

const PalletHandlingMatrix =  () => {
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
    const getAllMatrix = async () => {
        setTableLoading(true);

        input.DCMUser = user;

        let body = new URLSearchParams({
            'DCMUser':input.DCMUser
        });

        await api.post('/Benchmark/PalletHandlingMatrix/GetMatrix',body).then(
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
        await api.post('/Benchmark/PalletHandlingMatrix/AddMatrix', body).then(
            res => {
                let response = res.data;
                if (response === 'New Record Added') {
                    getAllMatrix();
                    setModalMessage(`Record successfully added.`);
                }
                else if (response === 'Duplicate Record Found') {
                    setModalMessageError(`Error: Record already exists.`);
                }
                else {
                    setModalMessageError(response);
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

;  

    const deleteHandler = async (rowData) => {
        let data = tableData.slice();
        let index = data.indexOf(rowData);
        let body = new URLSearchParams({
            'MovableUnits':rowData.MovableUnits,
             'Activity':rowData.Activity,
             'UnitType': rowData.UnitType,
            'TimePerUnit':rowData.TimePerUnit,
            'DCMUser':user

        });
        await api.post('/Benchmark/PalletHandlingMatrix/DeleteMatrix', body).then(
            res => {
               let response = res.data;
               if (response === 'Matrix Deleted')
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
        getAllMatrix();

        api.post('/Maintenance/Pickers/GetAllActivities').then( // Team Manager List
            res => {
                let data = res.data;    
                dropdownData['ActivityName'] = data.map(x => x['ActivityName']);

            });
    }, []);

    return (        
        <TableScreen
            table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
                        addHandler={addTableHandler}  deleteHandler={deleteHandler}></Table>}
            modal={
                <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} 
                   unrestrictWidth={true}  setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                        <div className='modal-grouping--col-2'>
                   <TextField name='MovableUnits' type="number" label='Movable Units' value={input.MovableUnits} onChange={handleInputEvent} required restrictions='number' ></TextField>
                   <DropDown name='Activity' label='Activity' options={dropdownData['ActivityName']}  defaultValue={input.Activity} onChange={handleInputEvent} required></DropDown>
                  <TextField name='UnitType' label='Unit Type' value={input.UnitType} onChange={handleInputEvent} required restrictions='default' ></TextField>
                    <TextField name='TimePerUnit' type = "number" label='Time Per Unit' value={input.TimePerUnit} onChange={handleInputEvent} required restrictions='number' ></TextField>
                    </div>
                </Modal>
            }
        />
    )
};

export default PalletHandlingMatrix;