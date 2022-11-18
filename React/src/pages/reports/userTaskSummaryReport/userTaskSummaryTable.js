import React, { useState, useEffect, useRef } from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectDateRange } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter } from '../../../components/table/filters';
// import { colourLostTime } from '../../../components/table/conditionalHighlighting';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import { useHistory } from "react-router-dom";
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { boldRow } from '../../../components/table/conditionalHighlighting';
import zIndex from '@material-ui/core/styles/zIndex';
import print from '../../../components/icons/Print.png';
const tableTitle = ' User Task Summary Report';

const UserTaskSummaryReport = () => {
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
    const [dateRange, setDateRange] = useState(['', '']);
    const currentDateRange = useRef(['', '']);
    const [dateChangeIndicator, setDateChangeIndicator] = useState('');

    const tableColumns = [
        { Header: 'Employee ID', accessor: 'EmployeeID', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown',  FilterValue: employeeID , SetFilterValue: setemployeeID  },
        { Header: 'Employee Name', accessor: 'FullName', modalType: 'textbox' },
        { Header: 'Date', accessor: 'StartDate', Filter: SelectDateRange, filter: 'date', Cell: DateCell, FilterValue: dateRange, SetFilterValues: setDateRange, setExtra: setDateChangeIndicator },
        { Header: 'Activity Type', accessor: 'ActivityType', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        { Header: 'Task', accessor: 'TaskName', modalType: 'dropdown', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue: task , SetFilterValue : settask },
        { Header: 'Task Time', accessor: 'TaskTime', modalType :'textbox' },
        { Header: 'Total Tasks', accessor: 'TotalTasks', modalType :'textbox' },
        { Header: 'Shift', accessor: 'ShiftCode', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        { Header: 'Team Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue: manager , SetFilterValue : setManager }
    ];


     //User Summary Table Columns
     const userSummaryTableColumns = [
        { Header: 'Employee', accessor: 'UserID',ConditionalHighlighting:boldRow },
        { Header: 'Lost Time(hrs)', accessor: 'LostTime' },
        { Header: 'Actual Time(hrs)', accessor: 'ActualTime' },
        { Header: 'Lines', accessor: 'NoOfLines' },
        { Header: 'Break(hrs)', accessor: 'Break' },
        
     ]


    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: fromDate,
            Todate: toDate
        });
        setTableLoading(true);
        await api.post('/Report/UserTaskSummary/GetUserTaskSummaryReport', body).then(
            res => {
                let data = res.data;

                // Convert dates to date objects  
                data = data.map(x => {
               x.StartDate = dateToDateObj(x.StartDate); 
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
           
            var totalactualtime = 0;
            var totallosttime = 0;
            var totalbreak = 0;
            var totallines = 0;
            var totalUnits_Hr= 0;

           
            var tabledata = [];
            
    
         for (var i = 0; i < UserID.length; i++)  
         {

          var rows = [];
          // parameters for the  row start, end and complete lost time
      
           
          var rowactualtime = 0;
          var rowlosttime = 0;
          var rowbreak = 0;
          var rowlines = 0;
          var rowUnits_Hr= 0;

            for (var j = 0; j < tableData.length; j++)
            {
        
             if (tableData[j]["EmployeeID"] === UserID[i])
             {

                if ( dateObjToInput(tableData[j]["Date"]) >= dateRange[0] && ( dateObjToInput(tableData[j]["Date"]) <= dateRange[1]) )
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
                            if (manager[n] === rows[j]["TeamManager"])
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
                  if (manager[k] === rows[j]["TeamManager"])
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
             rowbreak = parseInt(rowbreak) + parseInt(rows[k]["Break"]);
             rowUnits_Hr = parseFloat(rowUnits_Hr) + parseFloat(rows[k]["UnitsPerHour"]);
             rowlines = parseInt(rowlines) + parseInt(rows[k]["NoOfLines"]);

             if (rows[k]["ActualTime"])
             {
             rowactualtime = parseFloat(rowactualtime) + parseFloat(rows[k]["ActualTime"]);
             }
             rowlosttime = parseFloat(rowlosttime) + parseFloat(rows[k]["LostTime"]);
            
           }
    
    
    
         //Json Row Object for the employee Summary table row
         var rowdata = 
         {
           'UserID':UserID[i],
           'NoOfLines': rowlines,
           'LostTime' : (rowlosttime/60).toFixed(2),
           'ActualTime' : (rowactualtime/60).toFixed(2),
           'Break': (rowbreak/60).toFixed(2)
         }
    
         //total Start and end lost time caluculations for all the users
         totalUnits_Hr =   parseFloat(totalUnits_Hr) + parseFloat(rowUnits_Hr);
         totallosttime =   parseFloat(totallosttime) + parseFloat(rowlosttime);
         totalactualtime = parseFloat(totalactualtime) + parseFloat(rowactualtime);
         totallines =      parseInt(totallines) + parseInt(rowlines);
         totalbreak =      parseInt(totalbreak) + parseInt(rowbreak);
         tabledata.push(rowdata);

        }
    
   
        
           tabledata.push (
               {
               'UserID':'Total',
               'NoOfLines': totallines,
               'LostTime' : (totallosttime/60).toFixed(2),
               'ActualTime' : (totalactualtime/60).toFixed(2),
               'Break': (totalbreak/60).toFixed(2)
               })
       
           var finaldata =[];
    
       // removing the columns with Zero total time from the table data filter
        
          for (var k = 0; k < tabledata.length; k++)  
         {
             if ((tabledata[k]["LostTime"] !== '0.00') && (tabledata[k]["ActualTime"] !== '0.00')  && (tabledata[k]["NoOfLines"] !== '0'))
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
        
       
     
            history.push('/Report/UserTaskSummaryPrint');
            // if (win) {
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     window.alert('Please allow popups for this website');
            // }
       
    };

    const UserTaskSummaryReportButton = () => {
        return (

            <React.Fragment>
{/* 
            <Tooltip title='Get Total'>
            <IconButton aria-label='test' onClick={FetchTotalTab}>
            <ZoomInIcon></ZoomInIcon>
            </IconButton>
            </Tooltip>     */}


            <Tooltip title='Print Report'>
                <IconButton aria-label='GeneratePayroll' onClick={OpenReportPrintTab}>
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
                 settask([]);
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
                    AdditionalButtons={UserTaskSummaryReportButton}
                ></Table>}
                
                modal={
                    <React.Fragment>
                      <Modal  unrestrictWidth={true} showModal = {showuserSummaryModel} setShowModal={setshowuserSummaryModel}>
                      <Table data={employeeSummarydata}  tableColumns={userSummaryTableColumns}  
                    ></Table>
                      </Modal>
                  </React.Fragment>
                }/>
        </div>
    )
};

export default UserTaskSummaryReport;
