import React, {useState, useEffect} from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import { useSelector } from 'react-redux';
import { SelectMultipleFilter } from '../../../components/table/filters';
import print from '../../../components/icons/Print.png';
import { useHistory } from "react-router-dom";

const tableTitle = 'Current Resource Allocation';
const tableColumns = [
    {Header: 'Employee ID', accessor: 'UserID', filter: 'text'}, 
    {Header: 'Employee Name', accessor: 'FullName', filter: 'text'}, 
    {Header: 'Task Name', accessor: 'Task', filter: 'text'},
    {Header: 'Activity Type', accessor: 'ActivityType', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'}, 
    {Header: 'Start Time', accessor: 'StartTime', filter: 'text', modalType: 'textbox'},
    {Header: 'Location', accessor: 'Location', filter: 'text', modalType: 'textbox'},
    {Header: 'Agency', accessor: 'Agency', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'}, 
    {Header: 'Team Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'}, 
    { Header: 'Shift', accessor: 'ShiftCode', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' }
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



const CurrentResAllocation =  () => {
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
    const history = useHistory();

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



    const ProductivityPackPrintButton = () => {
      return (
          <React.Fragment> 
              <Tooltip title='Print Report'>
                  <IconButton aria-label='PrintReport' onClick={OpenReportPrintTab}>
                  <img width={30} height={30} src ={print}></img>
                  </IconButton>
              </Tooltip>
          </React.Fragment>
          
      );
  };


  const OpenReportPrintTab = () => {
        
       
     
    history.push('/Report/CurrentResAllocationPrint');
    // if (win) {
    //     //Browser has allowed it to be opened
    //     win.focus();
    // } else {
    //     //Browser has blocked it
    //     window.alert('Please allow popups for this website');
    // }

};



    // Function to send requests to update table
    const getOrderTimeEntries = async () => {
        setTableLoading(true);

        let body = new URLSearchParams({
            'DCMUser':user
        })
        await api.post('/Report/CurrentResAllocation/getCurrentResAllocation',body).then(
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

      
        }, []);

    return (        
        <TableScreen
            table={showModal ? null : <Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
            AdditionalButtons={ProductivityPackPrintButton}     ></Table>}
         
        />
    )
};

export default CurrentResAllocation;