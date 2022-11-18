import React, { useState, useEffect,useRef } from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput ,inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter, SelectDate } from '../../../components/table/filters';
// import { colourLostTime } from '../../../components/table/conditionalHighlighting';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import { useHistory } from "react-router-dom";
import {orderDatetime} from '../../../components/table/sortingFunctions';
import {useSelector} from 'react-redux';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { boldRow } from '../../../components/table/conditionalHighlighting';
import print from '../../../components/icons/Print.png';
const tableTitle = 'Daily Clock Scan Report';

const DailyScanReport = () => {
    const [tableData, setTableData] = useState([]);
      // Parameter for Employee Summary data Table
     const[employeeSummarydata, setUserSummaryData] = useState([]);
     // Parameters for Filters
     const [employeeID, setemployeeID] = useState([]); 
     const [task , settask] = useState([]);
     const [manager, setManager] = useState([]);
     const [showuserSummaryModel, setshowuserSummaryModel] = useState(false);   

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    const history = useHistory();
    // Parameter handlers for modal
    const dateRange = useRef(['', '']);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const user = useSelector(store => store.user); 
   
      //User Summary Table Columns
      const userSummaryTableColumns = [
        { Header: 'Employee', accessor: 'UserID',ConditionalHighlighting:boldRow },
        { Header: 'Total Time(hrs)', accessor: 'TotalTime' },
     ]

    const tableColumns = [
        { Header: 'Employee ID', accessor: 'UserID',Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue: employeeID, SetFilterValue: setemployeeID },
        
        { Header: 'Employee Name', accessor: 'FullName', modalType: 'textbox', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
       
        { Header: 'Scanned Task', accessor: 'ScannedTask', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue: task , SetFilterValue: settask },
        { Header: 'Start Date', accessor: 'StartDate', Filter: SelectDate, filter: 'dateFrom', modalType: 'textbox', Cell: DateCell, FilterValue: startDate, SetFilterValue: setStartDate, sortType: orderDatetime},
        { Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox' },
        { Header: 'End Date', accessor: 'EndDate',  Filter: SelectDate, filter: 'dateTo', modalType: 'textbox', Cell: DateCell, FilterValue: endDate, SetFilterValue: setEndDate, sortType: orderDatetime},
        { Header: 'End Time', accessor: 'EndTime', modalType: 'textbox'},
        { Header: 'Duration', accessor: 'Duration', modalType: 'textbox' },
        { Header: 'Scan Type', accessor: 'ScanType', modalType: 'textbox', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Shift Code', accessor: 'ShiftCode', modalType: 'textbox', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue: manager, SetFilterValue: setManager },

    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: fromDate,
            ToDate: toDate,
            'DCMUser':user
        });
        setTableLoading(true);
        await api.post('/Report/DailyScanReport/GetAllTransactions', body).then(
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

    //Method to calculate the total start and end lost time for each of the users in the tabledata
    const FetchTotalTab = (event) => {

        var UserID =[];
        event.preventDefault();
    
         //creating a unique array of UserIDs when no employee ID filter is selected
           if ( (employeeID.length === 0 ) && (tableData.length >0))
           {
        
               var userIds =  tableData.map(x => x.EmployeeID);
               let unique = [...new Set(userIds)];
               UserID = unique.map(x=>x);
            }
            else
            {
              UserID = employeeID.map(x=>x);
            }
            setshowuserSummaryModel(true);
            
            // parameters for the total indirect Activity time
           
            var totaltime = 0;
           
            var tabledata = [];
            
    
         for (var i = 0; i < UserID.length; i++)  
         {

          var rows = [];
          // parameters for the  row start, end and complete lost time
      
           var rowtotaltime = 0; 

            for (var j = 0; j < tableData.length; j++)
            {
        
             if (tableData[j]["EmployeeID"] === UserID[i])
             {

                 const rowStartDate = dateObjToInput(dateRange.current[0]);
                 const rowenddate = dateObjToInput(dateRange.current[1]);

               if ( dateObjToInput(tableData[j]["StartDate"]) >= rowStartDate && ( dateObjToInput(tableData[j]["EndDate"]) <= rowenddate) )
               
                  {
                   rows.push(tableData[j]);
                  }
         
              }
    
            }
    
             // Indirect Activity Task type Filters Cases
    
             var filteredRows =[];

           //Case 1 When Both task and manager is selected 
            if ((task.length > 0) && (manager.length >0))
            {
             for (var j =0 ; j < rows.length; j ++)
             {
               for (var k = 0; k < task.length; k++)
               {
                  if (task[k] === rows[j]["TaskName"])
                  {
                     
                        for (var n = 0; n < manager.length; n++)
                        {
                            if (manager[n] === rows[j]["Teammanager"])
                            {
                                filteredRows.push(rows[j]);
                            }
                        }
                  }
    
               }
             }
    
             rows = filteredRows.map(x=>x);
    
             }

            //Case 2  When only task is selected  and no manager is selected from the filters
             else if ((task.length > 0) && (manager.length === 0))
            {
    
              for (var j =0 ; j < rows.length; j ++)
              {
                  for (var k = 0; k < task.length; k++)
                    {
                  if (task[k] === rows[j]["TaskName"])
                   {
                     
                    filteredRows.push(rows[j]);

                   }
    
                   }
              }
               rows = filteredRows.map(x=>x);
            }

           //Case 3 When only manager is selected  and task is selected from the filters
              else if ((task.length === 0) && (manager.length > 0))
              {
                for (var j =0 ; j < rows.length; j ++)
                {
                 for (var k = 0; k < manager.length; k++)
                   {
                  if (manager[k] === rows[j]["Teammanager"])
                    {
                     
                            filteredRows.push(rows[j]);

                    }  
    
                  }
                 }
                rows = filteredRows.map(x=>x);
               }
    
         // row wise total time calculation
    
          for (var k = 0; k < rows.length; k++)  
          {
             rowtotaltime = parseFloat(rowtotaltime) + parseFloat(rows[k]["TotalTime"]);
            
           }
    
    
    
         //Json Row Object for the employee Summary table row
         var rowdata = 
         {
           'UserID':UserID[i],
           'TotalTime' : (rowtotaltime/60).toFixed(2),
          
         }
    
         //total Start and end lost time caluculations for all the users
         totaltime =   parseFloat(totaltime) + parseFloat(rowtotaltime);

         tabledata.push(rowdata);
    
    
        }
    
   
        
           tabledata.push (
               {
               'UserID':'Total',
               'TotalTime' : (totaltime/60).toFixed(2),
               })
       
           var finaldata =[];
    
       // removing the columns with Zero total time from the table data filter
        
          for (var k = 0; k < tabledata.length; k++)  
         {
             if  (tabledata[k]["TotalTime"] !== '0.00')
           {
            finaldata.push(tabledata[k]);
           }
          }
    
        // Allocating the values to the employee summary table based on the finaldata array 
       if (finaldata.length > 0)
        {
        setUserSummaryData(finaldata);
        }
         else
        {
        setUserSummaryData(tabledata);
        }
    
    };



    const OpenReportPrintTab = () => {
            history.push('/Report/DailyScanReportPrint');
            // if (win) {
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     window.alert('Please allow popups for this website');
            // }
       
    };

    const DailyClockScanReportButton = () => {
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
        if (startDate && endDate) {
            if (checkValidInput(startDate) && checkValidInput(endDate)) { // Only update table if valid dates
                const startDateObj = inputToDateObj(startDate);
                const endDateObj = inputToDateObj(endDate);
                //reseting the filter array after a date change
                settask([]);
                setemployeeID([]);
                setManager([]);

                if (startDateObj <= dateRange.current[0] || endDateObj >= dateRange.current[1]) {
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
                    AdditionalButtons={DailyClockScanReportButton}
                ></Table>}
                
                modal={
                    <React.Fragment>
                      <Modal  unrestrictWidth={true} showModal = {showuserSummaryModel} setShowModal={setshowuserSummaryModel}>
                      <Table data={employeeSummarydata}  tableColumns={userSummaryTableColumns}  
                    ></Table>
                      </Modal>
                  </React.Fragment>
                }

                />
        </div>
    )
};

export default DailyScanReport;
