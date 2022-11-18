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
import print from '../../../components/icons/Print.png';

const tableTitle = 'Summary Report';

const SummaryReport = () => {
    const [tableData, setTableData] = useState([]);

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    const history = useHistory();
    // Parameter handlers for modal
    const [dateRange, setDateRange] = useState(['', '']);
    const currentDateRange = useRef(['', '']);
    const [dateChangeIndicator, setDateChangeIndicator] = useState('');

    const tableColumns = [
        { Header: 'Date', accessor: 'Date', Filter: SelectDateRange, filter: 'date', Cell: DateCell, FilterValue: dateRange, SetFilterValues: setDateRange, setExtra: setDateChangeIndicator },
        { Header: 'Team Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        { Header: 'Total Hours', accessor: 'TotalHours', modalType: 'textbox' },
        { Header: 'Ordinary Hours', accessor: 'OrdinaryHours', modalType: 'textbox' },
        { Header: 'Time and Half', accessor: 'TimeandHalf', modalType: 'textbox' },
        { Header: 'Double Time', accessor: 'DoubleTime', modalType :'textbox' },
        { Header: 'Leave Hours', accessor: 'LeaveHours', modalType: 'textbox' },
        { Header: 'Total Indirect Hours', accessor: 'TotalIndirectHrs', modalType: 'textbox' },
        { Header: 'Total Indirect Cleaning Hours', accessor: 'TotalIndirectCleaningHrs', modalType :'textbox' },
        { Header: 'Sum Of Pallet Dispatched', accessor: 'SumOfPalletDispatched', modalType: 'textbox' }
    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: fromDate,
            Todate: toDate
        });
        setTableLoading(true);
        await api.post('/Report/Summary/GetSummaryReport', body).then(
            res => {
                let data = res.data;

            //     // Convert dates to date objects  
            //  data = data.map(x => {

                
            //    x.Date = dateToDateObj(x.Date);
            //         return x;
            //      });
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
        
       
     
            history.push('/Report/SummaryPrint');
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

export default SummaryReport;
