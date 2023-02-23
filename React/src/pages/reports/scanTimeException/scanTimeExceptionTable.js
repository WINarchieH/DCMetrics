import React, { useState, useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter,SelectColumnFilter, SelectDate } from '../../../components/table/filters';
// import { colourLostTime } from '../../../components/table/conditionalHighlighting';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import { useHistory } from "react-router-dom";
import {orderDatetime} from '../../../components/table/sortingFunctions';
import print from '../../../components/icons/Print.png';

const tableTitle = 'Scan Time Exception';

const ScanTimeExceptionReport = () => {
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
        { Header: 'Time Gap', accessor: 'TimeGap',Filter: SelectColumnFilter, filter: 'greaterthan', modalType: 'dropdown' },
        { Header: 'Start Date', accessor: 'StartDate', Filter: SelectDate, filter: 'dateFrom', modalType: 'textbox', Cell: DateCell, FilterValue: startDate, SetFilterValue: setStartDate, sortType: orderDatetime},
        { Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox' },
        { Header: 'End Date', accessor: 'EndDate',  Filter: SelectDate, filter: 'dateTo', modalType: 'textbox', Cell: DateCell, FilterValue: endDate, SetFilterValue: setEndDate, sortType: orderDatetime},
        { Header: 'End Time', accessor: 'EndTime', modalType: 'textbox' },  
        { Header: 'From Location', accessor: 'FromLocation', modalType: 'textbox' },
        { Header: 'To Location', accessor: 'ToLocation', modalType: 'textbox' },
        { Header: 'Product Code', accessor: 'ProductCode', modalType: 'textbox'},
        { Header: 'Pick Quantity', accessor: 'PickQuantity', modalType: 'textbox'},
        { Header: 'Manager', accessor: 'TeamManager',Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Shift Code', accessor: 'ShiftCode',Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: fromDate,
            ToDate: toDate,
            'DCMUser':user

        });
        setTableLoading(true);
        await api.post('/Report/ScanTimeException/GetScanTimeExceptionReport', body).then(
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
            history.push('/Report/ScantimeExceptionPrint');
            // if (win) {
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     window.alert('Please allow popups for this website');
            // }
       
    };

    const ScanTimeExceptionPrintButton = () => {
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
                    AdditionalButtons={ScanTimeExceptionPrintButton}
                ></Table>} />
        </div>
    )
};

export default ScanTimeExceptionReport;
