import React, { useState, useEffect, useRef } from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectDateRange } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter } from '../../../components/table/filters';
import {orderDatetime} from '../../../components/table/sortingFunctions';
import calculatetotal from '../../../components/icons/generatepayroll.png'

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { useSelector } from 'react-redux';

const tableTitle = ' Agency Payroll Export File';

const PayrollExportFile = () => {
    const [tableData, setTableData] = useState([]);

    // Current State
    const [tableLoading, setTableLoading] = useState(true);

    // Parameter handlers for modal
    const [dateRange, setDateRange] = useState(['', '']);
    const currentDateRange = useRef(['', '']);
    const [dateChangeIndicator, setDateChangeIndicator] = useState('');
    const user = useSelector(store => store.user); 
   


    const tableColumns = [
        { Header: 'Employee ID', accessor: 'EmployeeID', modalType: 'textbox' },
        { Header: 'User ID', accessor: 'UserID', modalType: 'textbox' },
        { Header: 'First Name', accessor: 'FirstName', modalType: 'textbox' },
        { Header: 'Last Name', accessor: 'Surname', modalType: 'textbox' },
        { Header: 'Date', accessor: 'Date', Filter: SelectDateRange, filter: 'date', Cell: DateCell, FilterValue: dateRange, SetFilterValues: setDateRange, setExtra: setDateChangeIndicator, sortType: orderDatetime },
        { Header: 'Day', accessor: 'Day', modalType: 'textbox' },
        { Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox' },
        { Header: 'End Time', accessor: 'EndTime', modalType: 'textbox' },
        { Header: 'Total Hours', accessor: 'TotalHours', modalType: 'textbox' },
        { Header: 'Reason', accessor: 'Reason', modalType: 'textbox' },
        { Header: 'Meal Allowance', accessor: 'MealAllowance', modalType: 'textbox' },
        { Header: 'Payroll Category', accessor: 'PayrollCategory', modalType: 'textbox' },
        { Header: 'Team Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Shift Code', accessor: 'ShiftCode', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Shift Start', accessor: 'ShiftStart', modalType: 'textbox' },
        { Header: 'Shift End', accessor: 'ShiftEnd', modalType: 'textbox' },
    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            'FromDate': fromDate,
            'ToDate': toDate,
            'DCMUser':user
        });
        setTableLoading(true);
        await api.post('/Benchmark/AgencyExportPayroll/SearchPayrollRecord', body).then(
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

    const generatePayroll = async (fromDate,toDate) => {
        setTableLoading(true);
        console.log(dateRange);
        let body = new URLSearchParams({
            'FromDate': inputToDate(dateRange[0]),
            'ToDate': inputToDate(dateRange[1]),
            'DCMUser':user
        })
        await api.post('/Benchmark/AgencyExportPayroll/GeneratePayrollFile',body).then(
            res => {

                let data = res.data;
                if (data === "payroll File Generated") {
                    window.alert(data);
                }
                else {
                    window.alert(data);
                }
                setTableLoading(false);

            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {
                        console.log(err.response)
                    }
                    else {
                    }
                });
    };

    const PayrollButton = () => {
        return (
            <Tooltip title='Generate Payroll'>
                <IconButton aria-label='GeneratePayroll' onClick={generatePayroll}>
                <img width={30} height={30} src ={calculatetotal}></img>
                </IconButton>
            </Tooltip>
        );
    };

    useEffect(() => { // Update table on date filter change
       
        if (checkValidInput(dateRange[0]) && checkValidInput(dateRange[1])) { // Only update table if valid dates
            const startDateObj = inputToDateObj(dateRange[0]);
            const endDateObj = inputToDateObj(dateRange[1]);
           
                getTable(inputToDate(dateRange[0]), inputToDate(dateRange[1]));
                currentDateRange.current = [startDateObj, endDateObj];
            
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
                    AdditionalButtons={PayrollButton}
                ></Table>} />
        </div>

    )
};

export default PayrollExportFile;
