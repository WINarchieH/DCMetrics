import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectDateRange } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput,inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter, SelectColumnFilter } from '../../../components/table/filters';
import { colourLostTime } from '../../../components/table/conditionalHighlighting';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import {useSelector} from 'react-redux';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { boldRow } from '../../../components/table/conditionalHighlighting';
import gettotal from '../../../components/icons/gettotal.png';
import print from '../../../components/icons/Print.png';
import calculatetotal from '../../../components/icons/generatepayroll.png'

const tableTitle = 'Lost Time Report';

const LostTimeReport = () => {
    const [tableData, setTableData] = useState([]);
    // Parameter for Employee Summary data Table
    const[employeeSummarydata, setUserSummaryData] = useState([]);



    // Parameters for Filters
    const [employeeID, setemployeeID] = useState([]); 
    const [type , settype] = useState([]);
    const [manager, setManager] = useState([]);
    const [showuserSummaryModel, setshowuserSummaryModel] = useState(false);   

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    const history = useHistory();

    // Parameter handlers for modal
    const [dateRange, setDateRange] = useState(['', '']);
    const currentDateRange = useRef(['', '']);
    const [dateChangeIndicator, setDateChangeIndicator] = useState('');
    const user = useSelector(store => store.user); 

    //User Summary Table Columns
    const userSummaryTableColumns = [
        { Header: 'Employee', accessor: 'UserID',ConditionalHighlighting:boldRow },
        { Header: 'Start Lost Time(hrs)', accessor: 'StartLostTime' },
        { Header: 'End Lost Time(hrs)', accessor: 'EndLostTime'},
        { Header: 'Total Lost Time(hrs)', accessor: 'TotalLostTime' }
    ];

    const tableColumns = [
        { Header: 'Employee ID', accessor: 'UserName', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown',FilterValue: employeeID, SetFilterValue: setemployeeID },
        { Header: 'Employee Name', accessor: 'FullName', modalType: 'textbox' },
        
        { Header: 'Start Date', accessor: 'StartDate', Filter: SelectDateRange, filter: 'date', Cell: DateCell, FilterValue: dateRange, SetFilterValues: setDateRange, setExtra: setDateChangeIndicator },
        { Header: 'Type', accessor: 'Type',Filter: SelectMultipleFilter , filter: 'contains', modalType: 'dropdown' , FilterValue:type, SetFilterValue: settype },
        { Header: 'Expected Start Time', accessor: 'ExpectedStart', modalType: 'textbox' },
        { Header: 'Actual Start Time', accessor: 'ActualStart', modalType: 'textbox'},
        { Header: 'Start Lost Time', accessor: 'StartLostTime', modalType: 'textbox',  ConditionalHighlighting: colourLostTime  },
        { Header: 'Actual End Time', accessor: 'ActualEnd', modalType: 'textbox'},
        { Header: 'Expected End Time', accessor: 'ExpectedEnd', modalType: 'textbox' },
        { Header: 'End Lost Time', accessor: 'EndLostTime', modalType: 'textbox',  ConditionalHighlighting: colourLostTime  },
        { Header: 'Shift Code', accessor: 'ShiftCode', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'User Role', accessor: 'UserRole', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'  },
        { Header: 'Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue: manager, SetFilterValue: setManager }

    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: fromDate,
            ToDate: toDate,
            'DCMUser':user
        });
        setTableLoading(true);
        await api.post('/Report/LostTime/GetLostTime', body).then(
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
                        
                    }
                    else {
                    }
                }
            );
    };

    const OpenReportPrintTab = () => {
     
        history.push('/Report/LostTimePrint');
        // if (win) {
        //     //Browser has allowed it to be opened
        //     win.focus();
        // } else {
        //     //Browser has blocked it
        //     window.alert('Please allow popups for this website');
        // }
    };
    
   //Method to calculate the total start and end lost time for each of the users in the tabledata
    const FetchTotalTab = (event) => {

        var UserID =[];
        event.preventDefault();
    
        //creating a unique array of UserIDs when no employee ID filter is selected
           if ( (employeeID.length === 0 ) && (tableData.length >0))
           {
        
               var userIds =  tableData.map(x => x.UserName);
               let unique = [...new Set(userIds)];
               UserID = unique.map(x=>x);
            }
            else
            {
              UserID = employeeID.map(x=>x);
             }
            setshowuserSummaryModel(true);
            
            // parameters for the total start, end and complete lost time
            var totalStartlosttime = 0;
            var TotalLostTime = 0; 
            var totalendlosttime = 0;
            var totalLines = 0;
            var totalUnits_Hr =0;
    
    
            
            var tabledata = [];
            
    
         for (var i = 0; i < UserID.length; i++)  
         {

        var rows = [];
      // parameters for the  row start, end and complete lost time
      
        var rowstartlosttime = 0; 
        var rowendlosttime = 0;
        var rowtotallosttime = 0;
        
    
            for (var j = 0; j < tableData.length; j++)
            {
        
             if (tableData[j]["UserName"] === UserID[i])
             {
             if ( dateObjToInput(tableData[j]["StartDate"]) >= dateRange[0] && ( dateObjToInput(tableData[j]["StartDate"]) <= dateRange[1]) )
                {
                  rows.push(tableData[j]);
                }
         
              }
    
            }
    
             // Lost Time Type Filters Cases
    
             var filteredRows =[];

           //Case 1 When Both lost time type and manager is selected 
            if ((type.length > 0) && (manager.length >0))
           {
             for (var j =0 ; j < rows.length; j ++)
             {
               for (var k = 0; k < type.length; k++)
               {
                  if (type[k] === rows[j]["Type"])
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

            //Case 2  When only lost time type is selected  and no manager is selected from the filters
             else if ((type.length > 0) && (manager.length === 0))
            {
    
              for (var j =0 ; j < rows.length; j ++)
              {
                  for (var k = 0; k < type.length; k++)
                    {
                  if (type[k] === rows[j]["Type"])
                  {
                     
                    filteredRows.push(rows[j]);

                   }
    
                    }
                }
               rows = filteredRows.map(x=>x);
             }

           //Case 3 When only manager is selected  and no lost time type is selected from the filters
              else if ((type.length === 0) && (manager.length > 0))
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
             rowstartlosttime = parseInt(rowstartlosttime) + parseInt(rows[k]["StartLostTime"]);
             rowendlosttime = parseInt(rowendlosttime) + parseInt(rows[k]["EndLostTime"]);
             rowtotallosttime =  parseInt(rowstartlosttime) + parseInt(rowendlosttime)
           }
    
    
    
        //Json Row Object for the employee Summary table row
         var rowdata = 
         {
           'UserID':UserID[i],
           'StartLostTime' : (rowstartlosttime/60).toFixed(2),
           'EndLostTime':(rowendlosttime/60).toFixed(2),
           'TotalLostTime': (rowtotallosttime/60).toFixed(2),
         
        }
    
        //total Start and end lost time caluculations for all the users
         totalStartlosttime =   parseInt(totalStartlosttime) + parseInt(rowstartlosttime);
         totalendlosttime =   parseInt(totalendlosttime) + parseInt(rowendlosttime);
         TotalLostTime =   parseInt(TotalLostTime) + parseInt(rowtotallosttime);
    
    
    
         tabledata.push(rowdata);
    
    
        }
    
   
        
           tabledata.push (
               {
               'UserID':'Total',
               'StartLostTime' : (totalStartlosttime/60).toFixed(2),
               'EndLostTime':(totalendlosttime/60).toFixed(2),
               'TotalLostTime': (TotalLostTime/60).toFixed(2),
               })
       
          var finaldata =[];
    
       // removing the columns with Zero start and end lost time from the table data filter
        
       for (var k = 0; k < tabledata.length; k++)  
        {
           if  ((tabledata[k]["StartLostTime"] === '0.00' ) &&( tabledata[k]["EndLostTime"] === '0.00' ))
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



    const LostTimeReportButton = () => {
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
      
        if (checkValidInput(dateRange[0]) && checkValidInput(dateRange[1])) { // Only update table if valid dates
            const startDateObj = inputToDateObj(dateRange[0]);
            const endDateObj = inputToDateObj(dateRange[1]);
            if (startDateObj < currentDateRange.current[0] || endDateObj > currentDateRange.current[1]) {
                
                //reseting the filter array after a date change
                settype([]);
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
                    AdditionalButtons={LostTimeReportButton}
                ></Table>}
                
                modal={
                    <React.Fragment>
                      <Modal  unrestrictWidth={true} showModal = {showuserSummaryModel} setShowModal={setshowuserSummaryModel}>
                      <Table data={employeeSummarydata}  tableColumns={userSummaryTableColumns}  
                    ></Table>
                      </Modal>
                  </React.Fragment>}
                
                
                />
        </div>
    )
};

export default LostTimeReport;
