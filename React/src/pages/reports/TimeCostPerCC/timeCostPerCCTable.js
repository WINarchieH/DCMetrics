import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectDateRange } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter, SelectDate } from '../../../components/table/filters';
import { colorPerformanceReport } from '../../../components/table/conditionalHighlighting';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import { useHistory } from "react-router-dom";
import ListAltIcon from '@material-ui/icons/ListAlt';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import {orderDatetime} from '../../../components/table/sortingFunctions';
import print from '../../../components/icons/Print.png';
import Usertransactions from '../../../components/icons/Usertransactions.png';

const tableTitle = 'Time And Cost Per Cost Centre';

const TimeCostPerCCReport = () => {
    const [tableData, setTableData] = useState([]);
    const[timeCostPerCCDetailsdata, settimeCostPerCCDetailsdata] = useState([]);

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    const history = useHistory();
    const user = useSelector(store => store.user); 
    // Parameter handlers for modal
    const [dateRange, setDateRange] = useState(['', '']);
    const currentDateRange = useRef(['', '']);
    const [dateChangeIndicator, setDateChangeIndicator] = useState('');
    const [showUsertransactionModal, setshowUsertransactionModal] = useState(false);   
    const [filterName, setfiltername] = useState('');   
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
 

    const tableColumns = [
        { Header: 'Start Date', accessor: 'StartDate', Filter: SelectDate, filter: 'StartDate', modalType: 'textbox', Cell: DateCell, FilterValue: startDate, SetFilterValue: setStartDate, sortType: orderDatetime},
        { Header: 'End Date', accessor: 'EndDate',  Filter: SelectDate, filter: 'EndDate', modalType: 'textbox', Cell: DateCell, FilterValue: endDate, SetFilterValue: setEndDate, sortType: orderDatetime},
        { Header: 'Cost Centre', accessor: 'CC_Code', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        { Header: 'Units', accessor: 'Qty',  modalType: 'textbox'},
        { Header: 'Actual Time', accessor: 'ActualTime', modalType: 'textbox' },
        { Header: 'Cost', accessor: 'Cost', modalType: 'textbox'},
        
    ];

    // const initialTableFilters =[
    //     {id: 'StartDate', value: dateRange},
    //     {id:'FullName', value:filterName}
        
    // ];

    const CostPerActivitydetailsTableColumns=[
        { Header: 'TaskType', accessor: 'TaskType', modalType: 'textbox' },
        { Header: 'Cost Centre', accessor: 'CC_Code', modalType:'textbox' },
        { Header: 'Start Date', accessor: 'StartDate', modalType: 'textbox' },
        { Header: 'End Date', accessor: 'EndDate', modalType: 'textbox' },
        { Header: 'Units', accessor: 'Qty', modalType: 'textbox'},
        { Header: 'Actual Time', accessor: 'ActualTime', modalType: 'textbox'},        
        { Header: 'Cost', accessor: 'Cost', modalType: 'textbox' },
        { Header: 'Good Data', accessor: 'goodData', modalType: 'textbox'},
    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table

        debugger;
        let body = new URLSearchParams({
            StartDate: fromDate,
            EndDate: toDate
        });
        setTableLoading(true);
        await api.post('/Report/TimeCostPerCC/GetTimeCostPerCCReport', body).then(
            res => {
                let data = res.data;

                // Convert dates to date objects  
             data = data.map(x => {

               
               x.StartDate = dateToDateObj(x.StartDate);
               x.EndDate = dateToDateObj(x.EndDate);
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


    const fetchTimeCostPerCCDetail = async (data)=>
    {
        let body = new URLSearchParams({
            'StartDate': dateObjToDate(data.StartDate),
            'EndDate': dateObjToDate(data.EndDate),
            'CC_Code': (data.CC_Code),
            'Cost': (data.Cost)
        });
        setTableLoading(true);
        await api.post('/Report/TimeCostPerCC/GetTimeCostPerCCDetail', body).then(
            res => {
                let tabledata = res.data;
                
                // Convert dates to date objects  
                settimeCostPerCCDetailsdata(tabledata);
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

     
        setshowUsertransactionModal(true);
    }



    const conditionalActions = (row) => {


        if (row) {
    return (
               
                <React.Fragment>
                <Tooltip title="Time Cost Per Activity Details">
                <IconButton  onClick={() => {fetchTimeCostPerCCDetail (row.original)}} >
                  <img width={30} height={30} src ={Usertransactions}></img>
                  </IconButton>
              </Tooltip>
             
              
            </React.Fragment>
              
               
            );
        }
       
    }
    const OpenReportPrintTab = () => {
        
       
     
            history.push('/Report/TimeCostPerCCPrint');
            // if (win) {
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     window.alert('Please allow popups for this website');
            // }
       
    };

    const chutePickPrintButton = () => {
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
                AdditionalButtons={chutePickPrintButton} conditionalAction={conditionalActions} 
                ></Table>}
                
                modal={
                    <React.Fragment>
                    <Modal  style={{   overflowX: 'scroll'}} showModal={showUsertransactionModal} unrestrictWidth={true} setShowModal={setshowUsertransactionModal} >
                    
            <Table data={timeCostPerCCDetailsdata} title="User Transaction" tableColumns={CostPerActivitydetailsTableColumns}  isLoading={tableLoading}
                ></Table>
                
                      </Modal>
                  </React.Fragment>}/>

        </div>
    )
};

export default TimeCostPerCCReport;
