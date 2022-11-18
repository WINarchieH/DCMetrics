import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectDateRange } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter } from '../../../components/table/filters';
import {orderDatetime} from '../../../components/table/sortingFunctions';


//leave check box
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EventIcon from '@mui/icons-material/Event';


const tableTitle = 'Leave Management';

const dropdownData = {
    'Shift Code': []
};

const LeaveManagement = () => {
    const [tableData, setTableData] = useState([]);
    const user = useSelector(store => store.user); // update by will be dcm user 
    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    const [isTableError, setIsTableError] = useState(false);

    // Parameter handlers for modal
    const [dateRange, setDateRange] = useState(['', '']);
    const currentDateRange = useRef(['', '']);
    const [dateChangeIndicator, setDateChangeIndicator] = useState('');

    const tableColumns = [
        { Header: 'Serial ID', accessor: 'SerialID', modalType: 'textbox' },
        { Header: 'User ID', accessor: 'UserID', modalType: 'textbox' },
        { Header: 'FirstName', accessor: 'FirstName', modalType: 'textbox' },
        { Header: 'LastName', accessor: 'Surname', modalType: 'textbox' },
        { Header: 'Date', accessor: 'Date', Filter: SelectDateRange, filter: 'date', Cell: DateCell, FilterValue: dateRange, SetFilterValues: setDateRange, setExtra: setDateChangeIndicator, sortType: orderDatetime },
        { Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox' },
        { Header: 'End Time', accessor: 'EndTime', modalType: 'textbox' },
        { Header: 'Leave Type', accessor: 'LeaveType', modalType: 'textbox' },
        { Header: 'Leave Status', accessor: 'LeaveStatus', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Checked By', accessor: 'CheckedBy', modalType: 'textbox' },
        { Header: 'Team Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Comment', accessor: 'CommentBy', modalType: 'textbox' },
        { Header: 'Site', accessor: 'Site', modalType: 'textbox' },

    ];

    const getTable = async (startDate, endDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: startDate,
            ToDate: endDate
        });
        setTableLoading(true);
        await api.post('/Maintenance/LeaveManagement/GetAllLeaveRequest', body).then(
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
                    setIsTableError(true);
                    // TODO: Error handling
                    if (err.response) {
                        console.log(err.response)
                    }
                    else {
                    }
                }
            );
    };

    const CheckBoxComponent = ({ data }) => {
        const approveHandler = () => {
            setTableLoading(true);
            let checkedIndex = Object.keys(data).map((x) => Number(x));
            let checked = tableData.filter((row, idx) => (checkedIndex.includes(idx)));
            let checkedID = checked.map((row) => (row.SerialID));

            let comment =  window.prompt("Please Enter a Comment");
            let body = new URLSearchParams({
                'ApproveID': checkedID,
                'CheckedBy': user,
                'CommentBy':comment
            });
            if (checkedID) {
                api.post('/Maintenance/LeaveManagement/ApproveLeave', body).then(
                    res => {
                        if (res.data) {
                           
                            if (res.data.includes("Records Approved from a total of")) 
                             {
                                // if (res.data.includes("Approved Records=")) {
                                   
                                // // Update on frontend
                                // //Approved Records=
                                // var approvedUserIDs = res.data.replace("Approved Records=","").split(',');
                                // // window.alert(res.data);
                                // // window.location.reload();
                                window.alert(res.data);

                                let newTable = tableData.slice();
                                // if (approvedUserIDs.length > 0)
                                //  {
                                     
                                    // for (var i = 0;i < approvedUserIDs.length ; i++)
                                    // {

                                     
                                      
                                       newTable.forEach((row, idx) => {
                                    if (checkedIndex.includes(idx)) {
                                        
                                       
                                        row.CheckedBy = user;
                                        row.LeaveStatus = 'A'
                                        
                        
                                         return row;
                                         
                                    }
                                    return row;
                                   });
                                   ;
                                 
                              
                             
                               setTableData(newTable);
                                setTableLoading(false);
                            }
                            else { // TODO: Error handling when records aren't approved.

                            }
                        }
                        else {
                            window.alert(res.data);
                        }
                    }

                ).catch(
                    err => { // TODO: Error handling
                        window.alert("Error: Failed to connect to server. Please try again.");
                    }
                );
            }
        };

        const rejectHandler = () => {
            setTableLoading(true);
            let checkedIndex = Object.keys(data).map((x) => Number(x));
            let checked = tableData.filter((row, idx) => (checkedIndex.includes(idx)));
            let checkedID = checked.map((row) => (row.SerialID));
            let comment =  window.prompt("Please Enter a Comment");


            let body = new URLSearchParams({
                'RejectID': checkedID,
                'CheckedBy': user,
                'CommentBy':comment
            });
            if (checkedID) {
                api.post('/Maintenance/LeaveManagement/RejectSelectedLeave', body).then(
                    res => {
                        if (res.data) {
                            if (res.data === "All the Selected Leaves are Rejected") {
                                // Update on frontend
                                let newTable = tableData.slice()
                                newTable.forEach((row, idx) => {
                                    if (checkedIndex.includes(idx)) {
                                        row.CheckedBy = user;
                                        row.LeaveStatus = 'R'
                                        return row;
                                    }
                                    return row;
                                });
                                setTableData(newTable);
                                setTableLoading(false);
                            }
                        }
                        else {
                            window.alert(res.data);
                        }
                    }

                ).catch(
                    err => { // TODO: Error handling
                        window.alert("Error: Failed to connect to server. Please try again.");
                    }
                );
            }
        }

        return (
            <div className='set-div--row'>
                <Tooltip title='Approve'>
                    <IconButton aria-label='Approve' onClick={approveHandler}>
                        <CheckIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Reject'>
                    <IconButton aria-label='Reject' onClick={rejectHandler}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                </Tooltip>

            </div>
        )
    }


    const OpenCalenderView = () => {
        
       const url ='/Maintenance/LeaveCalenderView';
        window.open(url);
       
   
};



         const calenderViewButton = () => {
               return (
                 <Tooltip title='Calender View'>
                      <IconButton  onClick={OpenCalenderView}>
                        <EventIcon />
                       </IconButton>
                    </Tooltip>
        );
    };

    useEffect(() => { // Update table on date filter change
        console.log(dateRange);
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

        // Retrieve Dropdown Data
        api.get('/Maintenance/UserInfo/GetAllShiftCodes').then( // Shit Codes List 
            res => {
                let data = res.data;
                dropdownData['Shift Code'] = data.map(x => x['shiftcode']);
            });
    }, []);

    // TODO: Add Modal fields
    return (
        <div>
            <TableScreen
                table={
                    <Table data={tableData} tableColumns={tableColumns} title={tableTitle} isLoading={tableLoading} isError={isTableError}
                        CheckBoxComponent={CheckBoxComponent}   AdditionalButtons={calenderViewButton} ></Table>}
            />
        </div>

    )
};

export default LeaveManagement;