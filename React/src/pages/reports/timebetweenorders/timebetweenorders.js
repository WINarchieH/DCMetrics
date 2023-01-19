import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectDateRange } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput,inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter, SelectColumnFilter } from '../../../components/table/filters';
import { colourLostTime } from '../../../components/table/conditionalHighlighting';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import {useSelector} from 'react-redux';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { boldRow } from '../../../components/table/conditionalHighlighting';
import gettotal from '../../../components/icons/gettotal.png';
import print from '../../../components/icons/Print.png';
import calculatetotal from '../../../components/icons/generatepayroll.png'

const tableTitle = 'Time Between Orders';

const TimeBetweenOrders = () => {
    const [tableData, setTableData] = useState([]);
    // Parameter for Employee Summary data Table
    const[employeeSummarydata, setUserSummaryData] = useState([]);



    // Parameters for Filters
    const [employeeID, setemployeeID] = useState([]); 
    const [type , settype] = useState([]);
    const [manager, setManager] = useState([]);
    const [showuserSummaryModel, setshowuserSummaryModel] = useState(false);   

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    const history = useHistory();

    // Parameter handlers for modal
    const [dateRange, setDateRange] = useState(['', '']);
    const currentDateRange = useRef(['', '']);
    const [dateChangeIndicator, setDateChangeIndicator] = useState('');
    const user = useSelector(store => store.user); 

    //User Summary Table Columns
    const userSummaryTableColumns = [
        { Header: 'Employee', accessor: 'UserID',ConditionalHighlighting:boldRow },
        { Header: 'Start Lost Time(hrs)', accessor: 'StartLostTime' },
        { Header: 'End Lost Time(hrs)', accessor: 'EndLostTime'},
        { Header: 'Total Lost Time(hrs)', accessor: 'TotalLostTime' }
    ];

    const tableColumns = [
        { Header: 'OperatorID', accessor: 'OperatorID', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown',FilterValue: employeeID, SetFilterValue: setemployeeID },
        { Header: 'Employee Name', accessor: 'FullName', modalType: 'textbox', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Date', accessor: 'Date', Filter: SelectDateRange, filter: 'date', Cell: DateCell, FilterValue: dateRange, SetFilterValues: setDateRange, setExtra: setDateChangeIndicator },
        { Header: 'Order Key', accessor: 'OrderNumber', modalType: 'textbox'  },
        { Header: 'Last Pick of Order', accessor: 'LastPickOrderTime', modalType: 'textbox' },
        { Header: 'Next RF Scan', accessor: 'NextRFScanTime', modalType: 'textbox'  },
        { Header: 'Time Between Orders', accessor: 'timebetweenOrders', modalType: 'textbox'},
        { Header: 'Order Type', accessor: 'OrderType', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'  },
        { Header: 'Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' }

    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: fromDate,
            ToDate: toDate,
            'DCMUser':user
        });
        setTableLoading(true);
        await api.post('/Report/TimeBetweenOrdersreport/GetReport', body).then(
            res => {
                let data = res.data;

                // Convert dates to date objects  
                data = data.map(x => {

                    x.Date = dateToDateObj(x.Date);
                    return x;
                });
                setTableData(data);
                setTableLoading(false);
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {
                        
                    }
                    else {
                    }
                }
            );
    };

    const OpenReportPrintTab = () => {
     
        history.push('/Report/TimeBetweenOrdersReportPrint');
        // if (win) {
        //     //Browser has allowed it to be opened
        //     win.focus();
        // } else {
        //     //Browser has blocked it
        //     window.alert('Please allow popups for this website');
        // }
    };
    
   //Method to calculate the total start and end lost time for each of the users in the tabledata
    



    const AdditionalReportButton = () => {
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

    useEffect(() => { // Update table on date filter change
      
        if (checkValidInput(dateRange[0]) && checkValidInput(dateRange[1])) { // Only update table if valid dates
            const startDateObj = inputToDateObj(dateRange[0]);
            const endDateObj = inputToDateObj(dateRange[1]);
            if (startDateObj < currentDateRange.current[0] || endDateObj > currentDateRange.current[1]) {
                
                //reseting the filter array after a date change
                settype([]);
                setemployeeID([]);
                setManager([]);

                getTable(inputToDate(dateRange[0]), inputToDate(dateRange[1]));
                currentDateRange.current = [startDateObj, endDateObj];
            }
        }
    }, [dateRange, dateChangeIndicator]);

    useEffect(() => { // Get table and Data
        // Default date range [today,today]
        let today = new Date();
        currentDateRange.current = [today, today];
        today = dateObjToDate(today);

        getTable(today, today);
        setDateRange([dateToInput(today), dateToInput(today)]); // Store current date range
    }, []);

    return (
        <div>
            <TableScreen
                table={<Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
                   AdditionalButtons={AdditionalReportButton}
                ></Table>}
                
                modal={
                    <React.Fragment>
                      <Modal  unrestrictWidth={true} showModal = {showuserSummaryModel} setShowModal={setshowuserSummaryModel}>
                      <Table data={employeeSummarydata}  tableColumns={userSummaryTableColumns}  
                    ></Table>
                      </Modal>
                  </React.Fragment>}
                
                
                />
        </div>
    )
};

export default TimeBetweenOrders;
