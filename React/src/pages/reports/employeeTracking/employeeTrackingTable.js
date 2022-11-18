import React, { useState, useEffect,useRef } from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter, SelectDate } from '../../../components/table/filters';
// import { colourLostTime } from '../../../components/table/conditionalHighlighting';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import { useHistory } from "react-router-dom";
import {orderDatetime} from '../../../components/table/sortingFunctions';
import {useSelector} from 'react-redux';
import print from '../../../components/icons/Print.png';


const tableTitle = 'Employee Tracking Report';

const EmployeeTrackingReport = () => {
    const [tableData, setTableData] = useState([]);

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    const history = useHistory();
    // Parameter handlers for modal
    const dateRange = useRef(['', '']);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const user = useSelector(store => store.user); 

    const tableColumns = [
        { Header: 'Employee ID', accessor: 'EmployeeID', modalType: 'textbox' },
        { Header: 'Employee Name', accessor: 'FullName', modalType: 'textbox' },
        { Header: 'Task Type', accessor: 'TaskType',Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Start Date', accessor: 'StartDate', Filter: SelectDate, filter: 'dateFrom', modalType: 'textbox', Cell: DateCell, FilterValue: startDate, SetFilterValue: setStartDate, sortType: orderDatetime},
        { Header: 'End Date', accessor: 'EndDate',  Filter: SelectDate, filter: 'dateTo', modalType: 'textbox', Cell: DateCell, FilterValue: endDate, SetFilterValue: setEndDate, sortType: orderDatetime},
        { Header: 'Location', accessor: 'Location', modalType: 'textbox'},
        { Header: 'Actual Time', accessor: 'ActualTime', modalType: 'textbox' },
        { Header: 'Activity Type', accessor: 'ActivityType', modalType: 'textbox' }

    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: fromDate,
            ToDate: toDate,
            'DCMUser':user
        });
        setTableLoading(true);
        await api.post('/Report/EmployeeTracking/GetEmployeeTrackingReport', body).then(
            res => {
                let data = res.data;
                
                // Convert dates to date objects  
             data = data.map(x => {
                 
                if (x.StartDate)
                {
               x.StartDate = dateToDateObj(x.StartDate);
                }
                if (x.EndDate)
                {
               x.EndDate = dateToDateObj(x.EndDate);
                }  
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
            history.push('/Report/EmployeeTrackingPrint');
            // if (win) {
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     window.alert('Please allow popups for this website');
            // }
       
    };

    const PayrollButton = () => {
        return (
            <Tooltip title='Print Report'>
               <IconButton aria-label='PrintReport' onClick={OpenReportPrintTab}>
                    <img width={30} height={30} src ={print}></img>
                </IconButton>
            </Tooltip>
        );
    };

    useEffect(() => { // Update table on date filter change
        if (startDate && endDate) {
            if (checkValidInput(startDate) && checkValidInput(endDate)) { // Only update table if valid dates
                const startDateObj = inputToDateObj(startDate);
                const endDateObj = inputToDateObj(endDate);
                console.log(dateRange);
                if (startDateObj <= dateRange.current[0] || endDateObj > dateRange.current[1]) {
                    getTable(inputToDate(startDate), inputToDate(endDate));
                    dateRange.current = [startDateObj, endDateObj];
                }
            }
        }
    }, [startDate, endDate]);

    useEffect(() => { // Get table and Data
        // Default date range [today,today]
        let today = new Date();
        dateRange.current = [today, today]; // Store current date range
        today = dateObjToDate(today);

        setStartDate(dateToInput(today));
        setEndDate(dateToInput(today));
        }, []);


    return (
        <div>
            <TableScreen
                table={<Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading}
                    AdditionalButtons={PayrollButton}
                ></Table>} />
        </div>
    )
};

export default EmployeeTrackingReport;
