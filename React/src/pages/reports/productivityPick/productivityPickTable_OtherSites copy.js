import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Table from '../../../components/table/table';
import { DateCell } from '../../../components/table/tableCells';
import { SelectDateRange } from '../../../components/table/filters';
import TableScreen from '../../../components/screen/tableScreen';
import { inputToDate, dateToInput, dateObjToInput,dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput } from '../../../components/fields/dateHelpers';
import { SelectMultipleFilter } from '../../../components/table/filters';
import { boldRow } from '../../../components/table/conditionalHighlighting';
// import { colourLostTime } from '../../../components/table/conditionalHighlighting';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import { useHistory } from "react-router-dom";
import ListAltIcon from '@material-ui/icons/ListAlt';
import Modal, {checkChange} from '../../../components/containers/modal/modal';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import gettotal from '../../../components/icons/gettotal.png';
import print from '../../../components/icons/Print.png';
import Usertransactions from '../../../components/icons/Usertransactions.png';
import calculatetotal from '../../../components/icons/generatepayroll.png'

const tableTitle = 'Productivity Pick Report';

const ProductivityPickReport = () => {
    const [tableData, setTableData] = useState([]);
    const[employeetabledata, setEmployeeTableData] = useState([]);
    const[employeeSummarydata, setUserSummaryData] = useState([]);

    // Current State
    const [tableLoading, setTableLoading] = useState(true);
    const history = useHistory();
    const user = useSelector(store => store.user); 
    // Parameter handlers for modal
    const [dateRange, setDateRange] = useState(['', '']);
    const currentDateRange = useRef(['', '']);
    const [dateChangeIndicator, setDateChangeIndicator] = useState('');
    const [showUsertransactionModal, setshowUsertransactionModal] = useState(false);   

    const [employeeID, setemployeeID] = useState([]); 
    const [activity , setActivity] = useState([]);
    const [manager, setManager] = useState([]);
    const [showuserSummaryModel, setshowuserSummaryModel] = useState(false);   
 



    const tableColumns = [
        { Header: 'Employee ID', accessor: 'UserID', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue :employeeID, SetFilterValue : setemployeeID },
        { Header: 'Employee Name', accessor: 'FullName', modalType: 'textbox'},
        { Header: 'Activity', accessor: 'Activity', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown', FilterValue :activity, SetFilterValue : setActivity },
        { Header: 'Start Date', accessor: 'StartDate', Filter: SelectDateRange, filter: 'date', Cell: DateCell, FilterValue: dateRange, SetFilterValues: setDateRange, setExtra: setDateChangeIndicator },
        { Header: 'Total Time', accessor: 'TotalTime', modalType: 'textbox' },
        { Header: 'Total Hours', accessor: 'TotalHrs', modalType: 'textbox'},
        { Header: 'No Of Orders', accessor: 'NoOfOrders', modalType: 'textbox' },
        { Header: 'No Of Units', accessor: 'NoOfUnits', modalType: 'textbox'},
        { Header: 'No Of Lines', accessor: 'NoOfLines', modalType: 'textbox' },
        { Header: 'Lines Per hour', accessor: 'Units_Hr', modalType: 'textbox' },
        { Header: 'Pallets Handled', accessor: 'PalletsHandled', modalType: 'textbox' },
        { Header: 'Part Pallet Handled', accessor: 'PartPalletHandled', modalType: 'textbox' },
        { Header: 'User Role', accessor: 'UserRole', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown'  },
        { Header: 'Manager', accessor: 'TeamManager', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' ,  FilterValue :manager, SetFilterValue : setManager },
        { Header: 'WH', accessor: 'WH',Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Shift', accessor: 'Shift', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Shift Type', accessor: 'ShiftType', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'RF Login', accessor: 'RFLogin', modalType: 'textbox'  }
    ];

    // const initialTableFilters =[
    //     {id: 'StartDate', value: dateRange},
    //     {id:'FullName', value:filterName}
        
    // ];

    const userdetailsTableColumns=[
        { Header: 'Employee ID', accessor: 'OperatorID', modalType: 'textbox' },
        { Header: 'Activity', accessor: 'TaskType', Filter: SelectMultipleFilter, filter: 'contains', modalType: 'dropdown' },
        { Header: 'Order Number', accessor: 'OrderNumber', modalType: 'textbox' },
        { Header: 'Start Time', accessor: 'StartTime', modalType: 'textbox' },
        { Header: 'End Time', accessor: 'EndTime', modalType: 'textbox' },
        { Header: 'Actual Time', accessor: 'ActualTime', modalType: 'textbox' },
        { Header: 'Total Break', accessor: 'TotalBreak', modalType: 'textbox' },
        { Header: 'Pick Quantity', accessor: 'PickQuantity', modalType: 'textbox'  },
        { Header: 'Pallets Handled', accessor: 'PalletsHandled', modalType: 'textbox' },
        { Header: 'Part Pallets Handled', accessor: 'CasesHandled', modalType: 'textbox' },
        { Header: 'From Location', accessor: 'FromLocation', modalType: 'textbox'  },
        { Header: 'To Location', accessor: 'ToLocation', modalType: 'textbox'  },
        { Header: 'Product Code', accessor: 'ProductCode', modalType: 'textbox'  },
        { Header: 'Product Weight', accessor: 'ProductWeight', modalType: 'textbox'  },
        { Header: 'Product Cube', accessor: 'ProductCube', modalType: 'textbox'  }
    ];

    const getTable = async (fromDate, toDate) => { // TODO: API Request for table
        let body = new URLSearchParams({
            FromDate: fromDate,
            ToDate: toDate,
            'DCMUser':user
        });
        setTableLoading(true);
        await api.post('/Report/ProductivityPick/GetRPFCProductivityReport', body).then(
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

    const userSummaryTableColumns = [
        { Header: 'Employee', accessor: 'UserID',ConditionalHighlighting:boldRow },
        { Header: 'Orders', accessor: 'NoOfOrders' },
        { Header: 'Units', accessor: 'NoOfUnits'},
        { Header: 'Lines', accessor: 'NoOfLines' },
        { Header: 'Units/Hr', accessor: 'Units_Hr' },
        { Header: 'Time(hrs)', accessor: 'TotalTime' },

    ];



    const fetchtransactionButtonHandler = async (data)=>
    {
        let body = new URLSearchParams({
            'StartDate': dateObjToDate(data.StartDate),
            'EndDate': dateObjToDate(data.StartDate),
            'OperatorID':data.UserID,
            'TaskType': data.Activity
        });
        setTableLoading(true);
        await api.post('/Maintenance/TransactionHistory/GetAllSelectedUserTransactionProd_RPFC', body).then(
            res => {
                let tabledata = res.data;

                // Convert dates to date objects  
                setEmployeeTableData(tabledata);
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
                <Tooltip title="User Transactions">
                <IconButton  onClick={() => {fetchtransactionButtonHandler(row.original)}} >
                  <img width={30} height={30} src ={Usertransactions}></img>
                  </IconButton>
              </Tooltip>
             
              
            </React.Fragment>
              
               
            );
        }
       
    }
    const OpenReportPrintTab = () => {
        
       
     
            history.push('/Report/ProductivityPickPrint');
            // if (win) {
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     window.alert('Please allow popups for this website');
            // }
       
    };
 const FetchTotalTab = (event) => {

    var UserID =[];
    event.preventDefault();

       if ( (employeeID.length === 0 ) && (tableData.length >0))
       {
    
           var userIds =  tableData.map(x => x.UserID);
           let unique = [...new Set(userIds)];
           UserID = unique.map(x=>x);
        }
        else
        {
          UserID = employeeID.map(x=>x);
         }
    setshowuserSummaryModel(true);
    var totalunits = 0;
    var totaltime = 0; 
    var totalorders = 0;
    var totalLines = 0;
    var totalUnits_Hr =0;


        
var tabledata = [];
        

for (var i = 0; i < UserID.length; i++)  
{
var rows = [];
var units = 0;
var time = 0; 
var orders = 0;
var Lines = 0;
var Units_Hr =0;

for (var j = 0; j < tableData.length; j++)
 {
    
if (tableData[j]["UserID"] === UserID[i])
{
    if ( dateObjToInput(tableData[j]["StartDate"]) >= dateRange[0] && ( dateObjToInput(tableData[j]["StartDate"]) <= dateRange[1]) )
     {
        rows.push(tableData[j]);
     }
     
}

}

// Activity Filters Cases

var filteredRows =[];
//Case 1
if ((activity.length > 0) && (manager.length >0))
{
    for (var j =0 ; j < rows.length; j ++)
    {
        for (var k = 0; k < activity.length; k++)
          {
              if (activity[k] === rows[j]["Activity"])
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
//Case 2
else if ((activity.length > 0) && (manager.length === 0))
{

    for (var j =0 ; j < rows.length; j ++)
    {
        for (var k = 0; k < activity.length; k++)
          {
              if (activity[k] === rows[j]["Activity"])
              {
                 
             filteredRows.push(rows[j]);
                        
                    
              }

          }
    }
    rows = filteredRows.map(x=>x);
}
//Case 3
else if ((activity.length === 0) && (manager.length > 0))
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



for (var k = 0; k < rows.length; k++)  
{
    units = parseInt(units) + parseInt(rows[k]["NoOfUnits"]);
    Lines = parseInt(Lines) + parseInt(rows[k]["NoOfLines"]);
    time = parseFloat(time) + parseFloat(rows[k]["TotalHrs"]);
    orders = parseInt(orders) + parseInt(rows[k]["NoOfOrders"]);
}

//  var hours = Math.round(time/60);
//  var minutes =  Math.round((hours - Math.floor(time/60)) * 60);

var rowdata = 
{
'UserID':UserID[i],
 'TotalTime' :(time).toFixed(2),
'NoOfOrders':orders,
'NoOfUnits': units,
 'NoOfLines':Lines,
'Units_Hr' :  (units/time).toFixed(2)
}

totalunits =   parseInt(totalunits) + parseInt(units);
totalLines =   parseInt(totalLines) + parseInt(Lines);
totalorders =   parseInt(totalorders) + parseInt(orders);
totaltime =   parseFloat(totaltime) + parseFloat(time);



tabledata.push(rowdata);


}

// var thours = Math.round(totaltime/60);
//  var tminutes =  Math.round((thours - Math.floor(totaltime/60)) * 60);
    
       tabledata.push (
           {
           'UserID':'Total',
           'TotalTime' :(totaltime).toFixed(2),
           'NoOfOrders':totalorders, 
           'NoOfUnits': totalunits,
           'NoOfLines':totalLines,
           'Units_Hr' : (totalunits/totaltime).toFixed(2)
           })
   
   var finaldata =[];

   for (var k = 0; k < tabledata.length; k++)  
{
    if (tabledata[k]["NoOfOrders"] != 0)
    {
        finaldata.push(tabledata[k]);
    }
}

if (finaldata.length > 0)
 {
    setUserSummaryData(finaldata);
 }
 else
 {
    setUserSummaryData(tabledata);
 }
    

};

    const ProductivityPickPrintButton = () => {
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
                
                setActivity([]);
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
            AdditionalButtons={ProductivityPickPrintButton} conditionalAction={conditionalActions} 
            ></Table>}
            
            modal={
                <React.Fragment>
                <Modal showModal={showUsertransactionModal} unrestrictWidth={true} setShowModal={setshowUsertransactionModal} >
                
        <Table data={employeetabledata} title="User Transaction" tableColumns={userdetailsTableColumns}  isLoading={tableLoading}
            ></Table>
            
                  </Modal>

                  <Modal  unrestrictWidth={true} showModal = {showuserSummaryModel} setShowModal={setshowuserSummaryModel}>
                  <Table data={employeeSummarydata}  tableColumns={userSummaryTableColumns}  
                ></Table>
                  </Modal>
              </React.Fragment>}/>

    </div>
    )
};

export default ProductivityPickReport;
