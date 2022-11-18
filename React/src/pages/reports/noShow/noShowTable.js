import React, { useState, useEffect, useRef } from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectDateRange } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter } from '../../../components/table/filters';
// import { colourLostTime } from '../../../components/table/conditionalHighlighting';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import { useHistory } from "react-router-dom";
import {useSelector} from 'react-redux';
import print from '../../../components/icons/Print.png';

const tableTitle = 'No Show Report';

const NoShowReport = () => {
    const [tableData, setTableData] = useState([]);

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    const history = useHistory();
    const user = useSelector(store => store.user); 
    // Parameter handlers for modal
    const [dateRange, setDateRange] = useState(['', '']);
    const currentDateRange = useRef(['', '']);
    const [dateChangeIndicator, setDateChangeIndicator] = useState('');

    const tableColumns = [
        { Header: 'Employee ID', accessor: 'EmployeeID', modalType: 'textbox' },
        { Header: 'First Name', accessor: 'FirstName', modalType: 'textbox' },
        { Header: 'Surname', accessor: 'Surname', modalType: 'textbox' },
        { Header: 'Start Date', accessor: 'Date', Filter: SelectDateRange, filter: 'date', Cell: DateCell, FilterValue: dateRange, SetFilterValues: setDateRange, setExtra: setDateChangeIndicator },
        { Header: 'Expected Start', accessor: 'ExpectedStart', modalType: 'textbox' },
        { Header: 'Actual Start', accessor: 'ActualStart', modalType: 'textbox' },
        { Header: 'Status', accessor: 'Status', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        { Header: 'User Role', accessor: 'UserRole', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'  },
        { Header: 'Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        { Header: 'Shift', accessor: 'Shift', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Shift Type', accessor: 'ShiftType', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: fromDate,
            ToDate: toDate,
            'DCMUser':user
        });
        setTableLoading(true);
        await api.post('/Report/NoShow/GetNoShowReport', body).then(
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
                        console.log(err.response)
                    }
                    else {
                    }
                }
            );
    };

    const OpenReportPrintTab = () => {
        
       
     
            history.push('/Report/NoShowPrint');
            // if (win) {
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     window.alert('Please allow popups for this website');
            // }
       
    };

    const NoShowPrintReportButton = () => {
        return (
            <Tooltip title='Print Report'>
             <IconButton aria-label='PrintReport' onClick={OpenReportPrintTab}>
                    <img width={30} height={30} src ={print}></img>
                </IconButton>
            </Tooltip>
        );
    };

    useEffect(() => { // Update table on date filter change
        
        if (checkValidInput(dateRange[0]) && checkValidInput(dateRange[1])) { // Only update table if valid dates
            const startDateObj = inputToDateObj(dateRange[0]);
            const endDateObj = inputToDateObj(dateRange[1]);
            if (startDateObj < currentDateRange.current[0] || endDateObj > currentDateRange.current[1]) {
                
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
                    AdditionalButtons={NoShowPrintReportButton}
                ></Table>} />
        </div>
    )
};

export default NoShowReport;
