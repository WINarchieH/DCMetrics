import React, { useState, useEffect,useRef } from 'react';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToInput,dateObjToDate, inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
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
import gettotal from '../../../components/icons/gettotal.png';
import print from '../../../components/icons/Print.png';
import calculatetotal from '../../../components/icons/generatepayroll.png'



const tableTitle = 'Timesheet Report';

const TimesheetTable = () => {
      const [tableData, setTableData] = useState([]);
      // Parameter for Employee Summary data Table
      const[employeeSummarydata, setUserSummaryData] = useState([]);

       // Parameters for Filters
       const [employeeID, setemployeeID] = useState([]); 
     
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
        { Header: 'Total Hours(hrs)', accessor: 'TotalHours' },
        { Header: 'Single Time(hrs)', accessor: 'SingleTime'},
        { Header: 'TH(hrs)', accessor: 'TimeAndHalfHrs' },
        { Header: 'DBl(hrs)', accessor: 'DoubleTime' }
      
    ]

    const tableColumns = [
        { Header: 'Employee ID', accessor: 'EmployeeID', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue: employeeID, SetFilterValue : setemployeeID },        
        { Header: 'Employee Name', accessor: 'FullName', modalType: 'textbox' },        
        { Header: 'Start Date', accessor: 'StartDate', Filter: SelectDate, filter: 'dateFrom', modalType: 'textbox', Cell: DateCell, FilterValue: startDate, SetFilterValue: setStartDate, sortType: orderDatetime},
        { Header: 'End Date', accessor: 'EndDate',  Filter: SelectDate, filter: 'dateTo', modalType: 'textbox', Cell: DateCell, FilterValue: endDate, SetFilterValue: setEndDate, sortType: orderDatetime},
        { Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox' },
        { Header: 'Actual Log On', accessor: 'LogOnTime', modalType: 'textbox' },
        { Header: 'End Time', accessor: 'EndTime', modalType: 'textbox'},
        { Header: 'Total Hours', accessor: 'TotalHours', modalType: 'textbox' },
        { Header: 'Single Time', accessor: 'SingleTime', modalType: 'textbox'},
        { Header: 'TH', accessor: 'TimeAndHalfHrs', modalType: 'textbox'},
        { Header: 'Dbl', accessor: 'DoubleTime', modalType: 'textbox'},
        { Header: 'MealTime', accessor: 'MealTime', modalType: 'textbox' },
        { Header: 'Agency', accessor: 'Agency', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},
        { Header: 'Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue: manager, SetFilterValue : setManager},
        { Header: 'ShiftCode', accessor: 'ShiftCode', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'},

    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            StartDate: fromDate,
            EndDate: toDate,
            'DCMUser':user
        });
        setTableLoading(true);
        await api.post('/Report/TimeSheet/GetTimesheetReport', body).then(
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
                
                // parameters for the total hrs, singletime , dbl and th
                
                var totalhrs = 0; 
                var totalsingletime = 0;
                var totaldoubletime = 0;
                var totaltimeandhalf =0;

                var tabledata = [];
                
        
             for (var i = 0; i < UserID.length; i++)  
             {
    
              var rows = [];
          // parameters for the  row start, end and complete lost time
            
              var rowtotalhrs = 0; 
              var rowsingletime = 0;
              var rowdoubletime = 0;
              var rowtimeandhalf =0;

            
        
                for (var j = 0; j < tableData.length; j++)
                {
            
                 if (tableData[j]["EmployeeID"] === UserID[i])
                 {
                    const rowstartdate = dateObjToInput(dateRange.current[0]);
                    const rowenddate = dateObjToInput(dateRange.current[1]);
                 if (( dateObjToInput(tableData[j]["StartDate"]) >= rowstartdate )&& ( dateObjToInput(tableData[j]["StartDate"]) <=  rowenddate) )
                    {
                      rows.push(tableData[j]);
                    }
             
                  }
        
                }
        
                 // LManager Filter Case
        
                 var filteredRows =[];
    
               //Case 1 When  manager is selected 
               
               //Case 3 When only manager is selected  and no lost time type is selected from the filters
                  if  (manager.length > 0)
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
        
               // row wise lost time calculation
        
              for (var k = 0; k < rows.length; k++)  
              {
                
                 rowtotalhrs = parseFloat(rowtotalhrs)+ parseFloat(rows[k]["TotalHours"]);
                 rowsingletime = parseFloat(rowsingletime) + parseFloat(rows[k]["SingleTime"]);
                 rowtimeandhalf = parseFloat(rowtimeandhalf) + parseFloat(rows[k]["TimeAndHalfHrs"]);
                 rowdoubletime = parseFloat(rowdoubletime)+ parseFloat(rows[k]["DoubleTime"]);
               }
        
        
        
            //Json Row Object for the employee Summary table row
            var rowdata = 
             {
               'UserID':UserID[i],
               'TotalHours':rowtotalhrs.toFixed(2),
               'TimeAndHalfHrs' : rowtimeandhalf.toFixed(2),
               'SingleTime':rowsingletime.toFixed(2),
               'DoubleTime': rowdoubletime.toFixed(2),
            }

              totalhrs =   parseFloat(totalhrs)+ parseFloat(rowtotalhrs);
              totalsingletime =   parseFloat(totalsingletime) + parseFloat(rowsingletime);
              totaltimeandhalf =  parseFloat(totaltimeandhalf) + parseFloat(rowtimeandhalf);
              totaldoubletime =  parseFloat(totaldoubletime) + parseFloat(rowdoubletime);

              tabledata.push(rowdata);
        
            }
        

               tabledata.push (
                {
                    'UserID':'Total',
                    'TotalHours':totalhrs.toFixed(2),
                    'TimeAndHalfHrs' : totaltimeandhalf.toFixed(2),
                    'SingleTime':totalsingletime.toFixed(2),
                    'DoubleTime': totaldoubletime.toFixed(2),
                })

               var finaldata =[];
        
           // removing the columns with Zero start and end lost time from the table data filter
            
           for (var k = 0; k < tabledata.length; k++)  
            {
               if  ((tabledata[k]["TotalHours"] === '0.00' ) &&( tabledata[k]["DoubleTime"] === '0.00' ) &&( tabledata[k]["SingleTime"] === '0.00' ) &&( tabledata[k]["TimeAndHalfHrs"] === '0.00' ))
               {
                
               }
               else
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
            history.push('/Report/TimesheetPrint');
            // if (win) {
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     window.alert('Please allow popups for this website');
            // }
       
    };

    const TimesheetReportButton = () => {
        return (

            <React.Fragment>

            <Tooltip title='Get Total'>
            <IconButton aria-label='getTotalLabel' onClick={FetchTotalTab}>
                    <img width={30} height={30} src ={calculatetotal}></img>
            </IconButton>
            </Tooltip>  

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
                
                setemployeeID([]);
                setManager([]);

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
                    AdditionalButtons={TimesheetReportButton}
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

export default TimesheetTable;
