import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import DropDown from '../../../components/fields/dropdown';


const tableTitle = 'PFD Matrix';
const tableColumns = [
   
    {Header: 'Activity', accessor: 'Activity', filter: 'text'},
    {Header: 'PFD Allowance', accessor: 'PFDAllowance', filter: 'text'}
];

const defaultInput = {
    'Activity':'',
    'PFDAllowance':'',
    'DCMUser':''
};

const dropdownData = {
    'ActivityName': [],
    'Zone': [],
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
    const getAisle = async () => {
        setTableLoading(true);

let body = new URLSearchParams({
    'DCMUser':input.DCMUser
})

        await api.post('/Benchmark/PFDMatrix/GetpfdMatrix',body).then(
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
        await api.post('/Benchmark/PFDMatrix/InsertNewMatrix', body).then(
            res => {
                let response = res.data;
                if (response === 'New PFD Inserted') {
                    getAisle();
                    setModalMessage(`New PFD Inserted`);
                }
                else if (response === 'Duplicate record found') {
                    setModalMessageError(`Error:Duplicate record found`);
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

    const updateHandler = async () => {
        if (!checkChange(originalInput, input)) {
            setModalMessageError('Error: No changes have been made to aisle or Location.');
            setLoadModal(false);
            return;
        }

        input.DCMUser = user;
        
        let body = new URLSearchParams(input);
        await api.post('/Benchmark/AisleMatrix/UpdateAisle', body).then(
            res => {
                let response = res.data;
              
                if (response === 'Aisle Updated') {
                    setModalMessage(`Aisle ${input.Aisle} successfully updated.`);
                    // Update table on the frontend
                  
                    let data = tableData.slice();
                    let index = data.map(x => x.ID).indexOf(originalInput.ID);
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
            'Activity': rowData.Activity,
            'DCMUser':input.DCMUser
        });
        await api.post('/Benchmark/PFDMatrix/DeleteMatrix', body).then(
            res => {
               let response = res.data;
               if (response === 'PFD Matrix deleted')
               {
                data.splice(index, 1);
               }
               else
               {
                   window.alert("Unexpected Error has Occured. Please try again.");
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
            setModalTitle('Add New Aisle');
            setModalButtonName('Add');
        }
        else {
            setModalTitle('Update Aisle');
            setModalButtonName('Update');
        }
    }, [modalMode]);

    useEffect(() => { // Get table and Dropdown Data
        getAisle();

        api.post('/Maintenance/Pickers/GetAllActivities').then( // Team Manager List
            res => {
                
                let data = res.data;    
                dropdownData['ActivityName'] = data.map(x => x['ActivityName']);
               
            });
      
        }, []);
 

    return (        
        <TableScreen
            table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
                        addHandler={addTableHandler} deleteHandler={deleteHandler}></Table>}
            modal={
                <Modal title={modalTitle} buttonName={modalButtonName} onSubmit={onSubmit} showModal={showModal} 
                   unrestrictWidth={true}  setShowModal={setShowModal} loadModal={loadModal} message={modalMessage} messageError={modalMessageError}>
                        <div>
                 

                  <DropDown name='Activity' label='Activity' options={dropdownData['ActivityName']}  defaultValue={input.Activity} onChange={handleInputEvent} required></DropDown>
                   <TextField name='PFDAllowance' label='PFD Allowance(%)' type="number" value={input.PFDAllowance} onChange={handleInputEvent} required restrictions='number' ></TextField>
            
                    </div>
                </Modal>
            }
        />
    )
};

export default MaintainZone;