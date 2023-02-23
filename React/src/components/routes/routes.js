import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './privateRoute';

import Login from '../../pages/login/login';
import ForgotPassword from '../../pages/login/forgotPassword';
import ResetPassword from '../../pages/login/ResetPassword';
import Dashboard from '../../pages/dashboard/dashboard';
import UserSettings from '../../pages/settings/userSettings/userSettings';
import AddUser from '../../pages/settings/addUser/addUser';
import emailSubscription from '../../pages/settings/emailSubcription/emailSubscription'
import FeedBack from '../../pages/settings/FeedBack/feedback';

// Home Screen Dashboard
import AsicsHomeScreenDashboard from '../../pages/HomeScreenDashboard/Asics/HomeScreen';
import DubboHomeScreenDashboard from '../../pages/HomeScreenDashboard/Dubbo/HomeScreen';
import BrandServicesHomeScreenDashboard from '../../pages/HomeScreenDashboard/brandServices/HomeScreen';
import CCAServicesHomeScreenDashboard from '../../pages/HomeScreenDashboard/CCA/HomeScreen';
import BRIServicesHomeScreenDashboard from '../../pages/HomeScreenDashboard/BRi/HomeScreen';
import EliteHomeScreenDashboard from '../../pages/HomeScreenDashboard/elite/HomeScreen';
import SydneyToolshomeScreenDashboard from '../../pages/HomeScreenDashboard/sydneyTools/HomeScreen';
import ABhomeScreenDashboard from '../../pages/HomeScreenDashboard/academybrand/HomeScreen';
import TMAhomeScreenDashboard from '../../pages/HomeScreenDashboard/TMA/HomeScreen';
import MakitahomeScreenDashboard from '../../pages/HomeScreenDashboard/Makita/HomeScreen';
//Forgot Password

import EmailAlert from '../../pages/maintenance/emailAlert/emailAlert';
import TeamManager from '../../pages/maintenance/teamManager/teamManager';
import UserDetails from '../../pages/maintenance/userDetails/userDetails';
import TimeAttendance from '../../pages/timeAndAttendance/timeAttendance/timeAttendance';
import TimeAttendanceElite from '../../pages/timeAndAttendance/timeAttendanceElite/timeAttendanceElite';
import PublicHoliday from '../../pages/maintenance/PublicHoliday/publicHoliday';
import Leave from '../../pages/maintenance/Leave/Leave';
import TransactionHistory from '../../pages/maintenance/transactionhistory/transactionHistory';
import PayrollRule from '../../pages/payroll/payrollRules/payrollRules';
import PayrollCode from '../../pages/payroll/payrollCodes/payrollCodes';
import PayrollSettings from '../../pages/payroll/payrollSettings/payrollSettings';
import LeaveManagement from '../../pages/maintenance/leaveManagement/leaveManagement';
import UserTimeInformation from '../../pages/timeAndAttendance/userTimeInformation/userTimeInformation';
import Agency from '../../pages/payroll/agency/agency';
import ProductHandlingMatrix from '../../pages/benchmark/productHandlingMatrix/productHandlingMatrix';
import ShiftDetails from '../../pages/maintenance/shiftDetails/shiftDetails'
import ActivityStartEndTime from '../../pages/benchmark/activityStartEndTime/activityStartEndTime';
import DCMCalendar from '../../pages/maintenance/calendar/calendar';
import SafetyIncidents from '../../pages/maintenance/SafetyIncidents/safetyIncidents';
import SafetyCommitteeInspectionChecklist from '../../pages/maintenance/SafetyIncidents/safetyCommitteeInspectionChecklist';
import LeaveManagementCalenderView from '../../pages/maintenance/leaveManagement/leaveManagementCalendarView';
import  CCATransactionHistory from '../../pages/maintenance/transactionhistory/transactionHistory_CCA';
import MakitaCasualReverseBilling from '../../pages/reports/MakitaCasualReverseBilling/casualReverseBillingTable';
//Dashboards
import Dashboardasics from '../../pages/dashboard/dashboard_asics';
import DashboardDubbo from '../../pages/dashboard/dashboard_Dubbo';
import DashboardAsicsProd from '../../pages/dashboard/dashboard_Productivity_Asics';
import LostTimeDashboard from '../../pages/dashboard/LostTimeDashboard';
import TaskTimeDashboard from '../../pages/dashboard/taskTimeDashboard';
import ShippedUnitsDashboard from '../../pages/dashboard/dashboard_ShippedQty';

// CCA Dashboard
import CCADashboardProd from '../../pages/dashboard/CCA/Proddashboard';
import CCALostTimeDashboard from '../../pages/dashboard/CCA/LostTimeDashboard';
import CCATaskTimeDashboard from '../../pages/dashboard/CCA/taskTimeDashboard';
import CCAPickDashboard from '../../pages/dashboard/CCA/Prodpickdashboard';
import CCAPutawayDashboard from '../../pages/dashboard/CCA/Prodputawaydashboard';
import CCAMoveDashboard from '../../pages/dashboard/CCA/Prodmovedashboard';
import CCARepDashboard from '../../pages/dashboard/CCA/Prodrepdashboard';
import CCADailyPickDashboard from '../../pages/dashboard/CCA/DailyPickDashboard';
import CCAWeeklyPickDashboard from '../../pages/dashboard/CCA/WeeklyPickDashboard';
import CCAUserPickDashboard from '../../pages/dashboard/CCA/DailyPickUserDashboard';


// Reports
//Cost per unit report
import CostPerUnitreport from '../../pages/reports/ST/CostPerUnitReport/CostperUnitTable'; 
import CostPerUnitreportPrint  from '../../pages/reports/ST/CostPerUnitReport/CostperunitPrint'; 


import LostTimeReports from '../../pages/reports/lostTime/LostTimeTable';
import LostTimeReportPrint from '../../pages/reports/lostTime/lostTimePrint';
import ProductivityPickReport from '../../pages/reports/productivityPick/productivityPickTable';
import ProductivityPickReportPrint from '../../pages/reports/productivityPick/productivityPickPrint';
import ProductivityPickReport_HR from '../../pages/reports/productivityPick/productivityPickTable_HR';
import ProductivityPickReportPrint_HR from '../../pages/reports/productivityPick/productivityPickPrint_HR';
import ProductivityPutawayReport from '../../pages/reports/productivityPutaway/productivityPutawayTable';
import ProductivityPutawayReportPrint from '../../pages/reports/productivityPutaway/productivityPutawayPrint';
import ProductivityMoveReport from '../../pages/reports/productivityMove/productivityMoveTable';
import ProductivityMovePrint from '../../pages/reports/productivityMove/productivityMovePrint';

import ProductivityPackReport from '../../pages/reports/productivityPack/productivityPackTable';
import ProductivityPackPrint from '../../pages/reports/productivityPack/productivityPackPrint';

import ProductivityRepReport from '../../pages/reports/productivityRep/productivityRepTable';
import AsicsProductivityRepReport from '../../pages/reports/productivityRep/Asics/productivityRepTable';
import ProductivityRepPrint from '../../pages/reports/productivityRep/productivityRepPrint';

import CalenderReport from '../../pages/reports/calendarReport/calendarTable';
import CalenderReportPrint from '../../pages/reports/calendarReport/calendarPrint';
import NoShowReport from '../../pages/reports/noShow/noShowTable';
import NoShowReportPrint from '../../pages/reports/noShow/noShowPrint';
import IndirectActivityTable from '../../pages/reports/indirectActivityReport/indirectActivityTable';
import IndirectActivityPrint from '../../pages/reports/indirectActivityReport/indirectActivityPrint';
import PerformanceTable from '../../pages/reports/performanceReport/performanceTable';
import PerformancePrint from '../../pages/reports/performanceReport/performancePrint';
import PerformancePerOrderReport from '../../pages/reports/PerformancePerOrderReport/performancePerOrderTable';

import SummaryTable from '../../pages/reports/Summary/summaryTable';
import SummaryPrint from '../../pages/reports/Summary/summaryPrint';
import CasualReverseBillingTable from '../../pages/reports/casualReverseBilling/casualReverseBillingTable';
import CasualReverseBillingPrint from '../../pages/reports/casualReverseBilling/casualReverseBillingPrint';
import ManagementAuditTrail from '../../pages/reports/managementAuditTrail/managementAuditTrail';
import ManagementAuditTrailPrint from '../../pages/reports/managementAuditTrail/managementAuditTrailPrint';
import Overtime from '../../pages/reports/overtime/overtimeTable';
import OvertimePrint from '../../pages/reports/overtime/overtimePrint';
import userSummaryTable from '../../pages/reports/userSummaryReport/userSummaryTable';
import userSummaryPrint from '../../pages/reports/userSummaryReport/userSummaryPrint';

import CustomUserReportTable from '../../pages/reports/customUserReport/customUserReportTable';

import CustomUserReportPrint from '../../pages/reports/customUserReport/customUserReportPrint';

import EmployeeTracking from '../../pages/reports/employeeTracking/employeeTrackingTable';
import EmployeeTrackingPrint from '../../pages/reports/employeeTracking/employeeTrackingPrint';
import AsicsCasualReverseBilling from '../../pages/reports/AsicscasualReverseBilling/AsicscasualReverseBillingTable';
import AsicsCasualReverseBillingPrint from '../../pages/reports/AsicscasualReverseBilling/AsicscasualReverseBillingPrint';
import ScanTimeException  from '../../pages/reports/scanTimeException/scanTimeExceptionTable';
import ScanTimeExceptionPrint from '../../pages/reports/scanTimeException/scanTimeExceptionPrint';
import IdleReport  from '../../pages/reports/idleReport/idleTable';
import IdleReportPrint from '../../pages/reports/idleReport/idlePrint';
import ChutePickTable from '../../pages/reports/Asicschutepick/chutePickTable';
import ChutePickPrint from '../../pages/reports/Asicschutepick/chutePickPrint';
import TimeCostPerCCTable from '../../pages/reports/TimeCostPerCC/timeCostPerCCTable';
import TimeCostPerCCTablePrint from '../../pages/reports/TimeCostPerCC/timeCostPerCCPrint';
import TimesheetTable from '../../pages/reports/timesheet/timesheet';
import TimesheetPrint from '../../pages/reports/timesheet/timesheetPrint';

import BRITimesheetTable from '../../pages/reports/timesheet/BRI/timesheet';
import BRITimesheetPrint from '../../pages/reports/timesheet/BRI/timesheetPrint';

import UserTaskSummaryTable from '../../pages/reports/userTaskSummaryReport/userTaskSummaryTable';
import UserTaskSummaryPrint from '../../pages/reports/userTaskSummaryReport/userTaskSummaryPrint';

import DailyScanTable from '../../pages/reports/dailyScanReport/dailyScanTable';
import DailyScanPrint from '../../pages/reports/dailyScanReport/dailyScanPrint';


import prodLoadTable from '../../pages/reports/productivityLoad/productivityLoadTable';
import prodLoadPrint from '../../pages/reports/productivityLoad/productivityLoadPrint';

import CCADailyPick from '../../pages/reports/dailyPickPerformance/dailyPickPerformance';
import CCAWeeklyPerformance from '../../pages/reports/weeklyPerformance/weeklyPerformance';
import CCATraineePick from '../../pages/reports/pickPerformance/TraineePickPerformance';

//RpFC Productivity Pick Report
import RPFCProdPickTable from '../../pages/reports/productivityPick/productivityPickTable_OtherSites';


//Current Resource Allocation

import CurrentResourceAllocationTable from '../../pages/reports/currentResAllocation/currentResallocationtable';
import CurrentResourceAllocationPrint from '../../pages/reports/currentResAllocation/currentResallocationPrint';

//ProductivityRework
import ProductivityReworkTable from '../../pages/reports/productivityRework/productivityRework';
import ProductivityReworkPrint from '../../pages/reports/productivityRework/productivityReworkPrint';

//TimeBetweenOrders
import TimeBetweenOrdersPrint from '../../pages/reports/timebetweenorders/timebetweenorderprint';
import TimeBetweenOrders from '../../pages/reports/timebetweenorders/timebetweenorders';

//TadinessReport

import TardinessReportTable from '../../pages/reports/tardinessReport/tardiness';
import TardinessReportPrint from '../../pages/reports/tardinessReport/tardinessReportPrint';
//PermanentPayrollReport

import PermanentPayrollPrint from '../../pages/reports/PermanentPayrollReport/permanentPayroll';




//TimeAttendence
import timeattendencegrid from '../../pages/timeAndAttendance/timeAttendance_Gridtest/timeAttendance';

//User Management
import UserOnboarding from '../../pages/userManagement/userOnboarding/userOnboarding';
import UserDiary from '../../pages/userManagement/userDiary/userDiary';
import UserHistory from '../../pages/userManagement/userHistory/userHistory';
import MakUserHistory from '../../pages/userManagement/userHistory/Mak/userHistory';
import UserManagementConfig from '../../pages/userManagement/userManagementConfig/userManagementConfig';

//BenchMark

import OrderTimeMatrix from '../../pages/benchmark/orderTimeMatrix/orderTimeMatrix';
import MaintainZone from '../../pages/benchmark/maintainZone/maintainZone';
import PalletHandlingMatrix from '../../pages/benchmark/palletHandlingMatrix/palletHandlingMatrix';
import AssignIndirect from '../../pages/maintenance/AssignIndirect/AssignIndirect';
import AisleMatrix from '../../pages/benchmark/aisleMatrix/aisleMatrix';
import PFDMatrix from '../../pages/benchmark/pfdMatrix/pfdMatrix';
import MapLocationForAisle from '../../pages/benchmark/mapLocationForAisle/mapLocationForAisle';
import AgencyPayrollExportFile from '../../pages/payroll/AgencyPayrollExportFile/agencyPayrollExportFile';
import ElitePayrollExportFile from '../../pages/payroll/payrollExportFile_Elite/payrollExportFile_Elite';


import PayrollExportFile from '../../pages/payroll/payrollExportFile/payrollExportFile';
import IndirectActivityDetails from '../../pages/timeAndAttendance/indirectActivityDetails/indirectActivityDetails';
import MaintainIndirectActivity from '../../pages/maintenance/maintainIndirectActivity/maintainIndirectActivity';
import MaintainDirectActivity from '../../pages/maintenance/maintainDirectActivity/maintainDirectActivity';

//Error
import errors from '../../pages/maintenance/errors/errors';
//TMA Reports
import TMACostPerUnitreport  from '../../pages/reports/TMA/CostPerUnitReport/CostperunitPrint'; 
import TMACasualReverseBillingPrint from '../../pages/reports/TMAcasualReverseBilling/TMAcasualReverseBillingPrint';

import ReasonCode from '../../pages/maintenance/codes/reasoncode';
import UserGroupManagement from '../../pages/maintenance/userGroupManagement/userGroupManagement'
//Makita
import MakitaProductivityPicktable from '../../pages/reports/productivityPick/productivityPickMakitaTable';
import MakitaUserDetails from '../../pages/maintenance/userDetails/Makita/userDetails';
import PayrollHistory from '../../pages/maintenance/payrollchangesHistory/payrollChangesHistory';
import payrollChangesHistory from '../../pages/maintenance/payrollchangesHistory/payrollChangesHistory';
import MakitaPickDashboard from '../../pages/dashboard/Makita/DailyPickDashboard';
import MakitaPutawayDashboard from '../../pages/dashboard/Makita/Putaway/DailyPutawayDashboard';
import MakitaTimeandAttendence from '../../pages/timeAndAttendance/timeAttendance_Gridtest/Makita/timeAttendance';
import MakitaUserTaskSummary from  '../../pages/reports/MakitaUserTaskSummaryReport/userTaskSummaryPrint';
import CostPerLine from '../../pages/reports/costPerLine/costPerLine';
import UserInformation from '../../pages/maintenance/userDetails/Makita/userInformation';
import UserRoleScreen from '../../pages/maintenance/userRole/userRole';





const Routes = () => {
    return (
      <Switch>
        <Route path='/' exact component={Login}></Route>
        <Route path='/ForgotPassword' exact component={ForgotPassword}></Route>
        <Route path='/ResetPassword/:uid' exact component={ResetPassword}></Route>

        <PrivateRoute path='/HomeScreenDashboard' name ="RPFCHomeScreenDashboard" exact component={DubboHomeScreenDashboard}></PrivateRoute>
        <PrivateRoute path='/Settings' exact component={UserSettings}></PrivateRoute>
        <PrivateRoute path='/AddUser' exact component={AddUser}></PrivateRoute>
        <PrivateRoute path='/emailSubscription' exact component={emailSubscription}></PrivateRoute>
        <PrivateRoute path='/FeedBack' exact component={FeedBack}></PrivateRoute>
        <PrivateRoute path='/AsicsHomeScreenDashboard' name ="AsicsHomeScreenDashboard" exact component={AsicsHomeScreenDashboard}></PrivateRoute>
        <PrivateRoute path='/BSHomeScreenDashboard' exact component={BrandServicesHomeScreenDashboard}></PrivateRoute>
        <PrivateRoute path='/CCAHomeScreenDashboard' exact component={CCAServicesHomeScreenDashboard}></PrivateRoute>
        <PrivateRoute path='/EliteHomeScreenDashboard' exact component={EliteHomeScreenDashboard}></PrivateRoute>
        <PrivateRoute path='/SydneyToolsHomeScreen' exact component={SydneyToolshomeScreenDashboard}></PrivateRoute>
        <PrivateRoute path='/BRIHomeScreenDashboard' name ="BRIHomeScreenDashboard" exact component={BRIServicesHomeScreenDashboard}></PrivateRoute>
        <PrivateRoute path='/Dashboard' exact component={Dashboard}></PrivateRoute>
        <PrivateRoute path='/ABHomeScreenDashboard' name ="ABHomeScreenDashboard" exact component={ABhomeScreenDashboard}></PrivateRoute>
        <PrivateRoute path='/TMAHomeScreenDashboard' name ="TMAHomeScreenDashboard" exact component={TMAhomeScreenDashboard}></PrivateRoute>
        <PrivateRoute path='/MakitaHomeScreenDashboard' name ="MakitaHomeScreenDashboard" exact component={MakitahomeScreenDashboard}></PrivateRoute>
        
        {/** Data Capture Routes */}


        {/* Maintenance Menu */}
        
        <PrivateRoute path='/Maintenance/ReasonCode' name='Reason Code' exact component={ReasonCode}>  </PrivateRoute>
        <PrivateRoute path='/Maintenance/EmailAlert' name='Email Notifications' exact component={EmailAlert}>  </PrivateRoute>
        <PrivateRoute path='/Maintenance/MaintainIndirectActivity' name='Maintain Indirect Activity' exact component={MaintainIndirectActivity}>  </PrivateRoute>   
        <PrivateRoute path='/Maintenance/MaintainDirectActivity' name='Maintain Direct Activity' exact component={MaintainDirectActivity}>  </PrivateRoute>   
        <PrivateRoute path='/Maintenance/TeamManager' name='Team Manager' exact component={TeamManager}></PrivateRoute>
        <PrivateRoute path='/Maintenance/Leave' name='Leave' exact component={Leave}></PrivateRoute>
        <PrivateRoute path='/Maintenance/PublicHoliday' name='Public Holiday' exact component={PublicHoliday}></PrivateRoute>
        <PrivateRoute path='/Maintenance/UserDetails' name='User Details' exact component={UserDetails}></PrivateRoute>
        <PrivateRoute path='/Maintenance/MakUserDetails' name='User Details' exact component={MakitaUserDetails}></PrivateRoute>
        <PrivateRoute path ='/Maintenance/ShiftDetails' name ="Shift Details" exact component={ShiftDetails}></PrivateRoute>
        <PrivateRoute path='/Maintenance/LeaveManagement' name='Leave Management' exact component={LeaveManagement}></PrivateRoute>
        <PrivateRoute path ='/Maintenance/LeaveCalenderView' name='ApprovedLeaveCalender' exact component={LeaveManagementCalenderView}></PrivateRoute>
        <PrivateRoute path='/Maintenance/TransactionHistory' name='Transaction History' exact component={TransactionHistory}></PrivateRoute>
        <PrivateRoute path='/Maintenance/CCATransactionHistory' name='Transaction History' exact component={CCATransactionHistory}></PrivateRoute>
        <PrivateRoute path ='/Maintenance/AssignIndirect' name='Assign Indirect' exact component={AssignIndirect}></PrivateRoute>
        <PrivateRoute path ='/Maintenance/Calendar' name='Calendar' exact component={DCMCalendar}></PrivateRoute>
        <PrivateRoute path ='/Maintenance/SafetyIncidents' name='Safety Incidents' exact component={SafetyIncidents}></PrivateRoute>
        <PrivateRoute path ='/Maintenance/safetyCommitteeInspectionChecklist' name='Safety Inspection Checklist' exact component={SafetyCommitteeInspectionChecklist}></PrivateRoute>
        <PrivateRoute path='/Maintenance/Errors' name='Errors' exact component={errors}></PrivateRoute>
        <PrivateRoute path='/Maintenance/UsergroupManagement' name='User Group Management' exact component={UserGroupManagement}></PrivateRoute>
        <PrivateRoute path='/Maintenance/UserInformation' name='User Information' exact component={UserInformation}></PrivateRoute>
        <PrivateRoute path='/Maintenance/UserRole' name='User Role' exact component={UserRoleScreen}></PrivateRoute>
        {/* User Management Menu */}
        <PrivateRoute path='/UserManagement/UserOnboarding' name='User Onboarding' exact component={UserOnboarding}></PrivateRoute>
        <PrivateRoute path='/UserManagement/UserDiary' name='User Diary' exact component={UserDiary}></PrivateRoute>
        <PrivateRoute path='/UserManagement/UserHistory' name='User History' exact component={UserHistory}></PrivateRoute>
        <PrivateRoute path='/UserManagement/MakUserHistory' name='User History' exact component={MakUserHistory}></PrivateRoute>
        <PrivateRoute path='/UserManagement/userManagementConfig' name='User Management Config' exact component={UserManagementConfig}></PrivateRoute>

        {/** Dasboard Menu */}
        <PrivateRoute path ='/DashBoard/AsicsDashboardPickProductivity' name='Productivity Pick Dashboard' exact component={Dashboardasics}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/AsicsDashboardProductivity' name='Productivity Dashboard' exact component={DashboardAsicsProd}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/DashboardPickProductivity' name='Productivity Dashboard' exact component={DashboardDubbo}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/DashboardLostTime' name='LostTime Dashboard' exact component={LostTimeDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/DashboardTaskTime' name='TaskTime Dashboard' exact component={TaskTimeDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/DashboardTotalShipped' name='TaskTime Dashboard' exact component={ShippedUnitsDashboard}></PrivateRoute>
         {/** Makita Dashboard */}
         <PrivateRoute path ='/DashBoard/MakPickDashboard' name='Daily User Pick Dashboard' exact component={MakitaPickDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/MakPutDashboard' name='Daily User Putaway Dashboard' exact component={MakitaPutawayDashboard}></PrivateRoute>
         {/** CCA Dasboard Menu */}
        <PrivateRoute path ='/DashBoard/CCADashboardLostTime' name='LostTime Dashboard' exact component={CCALostTimeDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/CCADashboardTaskTime' name='TaskTime Dashboard' exact component={CCATaskTimeDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/CCADashboardProductivity' name='Productivity Dashboard' exact component={CCADashboardProd}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/CCADashboardProductivityPick' name='Productivity Pick Dashboard' exact component={CCAPickDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/CCADashboardProductivityPutaway' name='Putaway Dashboard' exact component={CCAPutawayDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/CCADashboardProductivityRep' name='Replenishment Dashboard' exact component={CCARepDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/CCADashboardProductivityMove' name='Move Dashboard' exact component={CCAMoveDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/CCAPickDashBoardWeekly' name='Weekly Pick Dashboard' exact component={CCAWeeklyPickDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/CCADailyPickDashboard' name='Daily Pick Dashboard' exact component={CCADailyPickDashboard}></PrivateRoute>
        <PrivateRoute path ='/DashBoard/CCADailyPickUserDashboard' name='Daily User Pick Dashboard' exact component={CCAUserPickDashboard}></PrivateRoute>
 

        {/** BenChMark Menu */}

        <PrivateRoute path='/Benchmark/OrderTimeMatrix' name='Order Time Matrix' exact component={OrderTimeMatrix}></PrivateRoute>
        <PrivateRoute path='/Benchmark/MaintainZone' name='Maintain Zone' exact component={MaintainZone}></PrivateRoute>
        <PrivateRoute path='/Benchmark/ProductHandlingMatrix' name='Product Handling Matrix' exact component={ProductHandlingMatrix}/>
        <PrivateRoute path='/Benchmark/ActivityStartEndTime' name='Activity Start EndTime' exact component={ActivityStartEndTime}/>
        <PrivateRoute path ='/Benchmark/PalletHandlingMatrix' name ='Pallet Handling Matrix' exact component={PalletHandlingMatrix}/>
        <PrivateRoute path ='/Benchmark/AisleMatrix' name ='Aisle Matrix' exact component={AisleMatrix}/>
        <PrivateRoute path ='/Benchmark/PFDMatrix' name ='PFD Matrix' exact component={PFDMatrix}/>
        <PrivateRoute path = '/Benchmark/MapLocationforAisle' name ='Map Location for Aisle' exact component ={MapLocationForAisle}/>

        {/** Time and Attendence Menu */}

        <PrivateRoute path ='/TimeandAttendance/IndirectActivityDetails' name='Indirect Activity Details' exact component={IndirectActivityDetails}></PrivateRoute> 
        <PrivateRoute path ='/TimeandAttendance/DailyRosters' name='Daily Rosters' exact component={UserTimeInformation}></PrivateRoute>
        <PrivateRoute path ='/TimeandAttendance/DailyView' name='Daily View' exact component={TimeAttendance}></PrivateRoute>
        <PrivateRoute path ='/TimeandAttendance/DailyViewGrid' name='Daily View' exact component={timeattendencegrid}></PrivateRoute>
        <PrivateRoute path ='/TimeandAttendance/MakDailyViewGrid' name='Daily View' exact component={MakitaTimeandAttendence}></PrivateRoute>
        <PrivateRoute path ='/TimeandAttendance/DailyViewElite' name='Daily View ELITE' exact component={TimeAttendanceElite}></PrivateRoute>
        
        {/*Payroll Menu*/}

        <PrivateRoute path='/Payroll/Agency' name='Agency' exact component={Agency}></PrivateRoute>
        <PrivateRoute path='/Payroll/PayrollRules' name='Payroll Rules' exact component={PayrollRule}></PrivateRoute>
        <PrivateRoute path='/Payroll/PayrollCodes' name='Payroll Codes' exact component={PayrollCode}></PrivateRoute>
        <PrivateRoute path ='/Payroll/PayrollExportFile' name = 'Payroll Export File' exact component ={PayrollExportFile} ></PrivateRoute> 
        <PrivateRoute path ='/Payroll/PayrollSettings' name = 'Payroll Settings' exact component ={PayrollSettings} ></PrivateRoute>
        <PrivateRoute path ='/Payroll/AgencyPayrollExport' name = 'Agency Payroll Export' exact component ={AgencyPayrollExportFile} ></PrivateRoute>
        <PrivateRoute path ='/Payroll/ElitePayrollExportFile' name = 'Payroll Export File' exact component ={ElitePayrollExportFile} ></PrivateRoute>
        <PrivateRoute path='/Payroll/PayrollHistory' name='Payroll History' exact component={payrollChangesHistory}></PrivateRoute>

        {/* Reports Menu */}
        <PrivateRoute path='/Report/CostPerLine' name='Cost Per Line' type='Report' exact component={CostPerLine}></PrivateRoute>
        <PrivateRoute path='/Report/TraineePickPerformance' name='Trainee Pick Performance' type='Report' exact component={CCATraineePick}></PrivateRoute>
        <PrivateRoute path='/Report/DailyPickDashboard' name='Daily Pick Performance' type='Report' exact component={ CCADailyPick}></PrivateRoute>

        <PrivateRoute path='/Report/WeeklyPerformance' name='Weekly Performance Report' type='Report' exact component={CCAWeeklyPerformance}></PrivateRoute>

        <PrivateRoute path='/Report/CurrentResAllocation' name='Current Resource Allocation' type='Report' exact component={CurrentResourceAllocationTable}></PrivateRoute>
        <PrivateRoute path='/Report/CurrentResAllocationPrint' name='CurrentResourceAllocationPrint' type='Report' exact component={CurrentResourceAllocationPrint}></PrivateRoute>

        <PrivateRoute path='/Report/LostTimeReport' name='Lost Time' type='Report' exact component={LostTimeReports}></PrivateRoute>
        <PrivateRoute path='/Report/LostTimePrint' name='Lost Time Report Print' type='Report' exact component={LostTimeReportPrint}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityPickReport' name='Productivity Pick' type='Report' exact component={ProductivityPickReport}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityPickPrint' name='Productivity Pick Report Print' type='Report' exact component={ProductivityPickReportPrint}></PrivateRoute>
        
        <PrivateRoute path='/Report/ProductivityPickReport_HR' name='Productivity Pick High Raise' type='Report' exact component={ProductivityPickReport_HR}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityPickPrint_HR' name='Productivity Pick HR Print' type='Report' exact component={ProductivityPickReportPrint_HR}></PrivateRoute>

        <PrivateRoute path='/Report/Calendar' name='Calendar' type='Report' exact component={CalenderReport}></PrivateRoute>
        <PrivateRoute path='/Report/CalendarPrint' name='Calendar Report Print' type='Report' exact component={CalenderReportPrint}></PrivateRoute>
        
        <PrivateRoute path='/Report/NoShow' name='No Show' type='Report' exact component={NoShowReport}></PrivateRoute>
        <PrivateRoute path='/Report/NoShowPrint' name='NoShow Report Print' type='Report' exact component={NoShowReportPrint}></PrivateRoute>
        <PrivateRoute path='/Report/IndirectActivity' name='Indirect Activity Report' type='Report' exact component={IndirectActivityTable}></PrivateRoute>
        <PrivateRoute path='/Report/IndirectActivityPrint' name='Indirect Activity Report Print' type='Report' exact component={IndirectActivityPrint}></PrivateRoute>
        <PrivateRoute path='/Report/Performance' name='Performance' type='Report' exact component={PerformanceTable}></PrivateRoute>
        <PrivateRoute path='/Report/PerformancePrint' name='Performance Report Print' type='Report' exact component={PerformancePrint}></PrivateRoute>
        <PrivateRoute path='/Report/PerformancePerOrder' name='Performance Per Order Report' type='Report' exact component={PerformancePerOrderReport}></PrivateRoute>
        <PrivateRoute path='/Report/Summary' name='Summary' type='Report' exact component={SummaryTable}></PrivateRoute>
        <PrivateRoute path='/Report/SummaryPrint' name='Summary Print' type='Report' exact component={SummaryPrint}></PrivateRoute>
        <PrivateRoute path='/Report/MakitaCasualReverseBilling' name='Casual Reverse Billing' type='Report' exact component={MakitaCasualReverseBilling}></PrivateRoute>
        <PrivateRoute path='/Report/CasualReverseBilling' name='Casual Reverse Billing' type='Report' exact component={CasualReverseBillingTable}></PrivateRoute>
        <PrivateRoute path='/Report/CasualReverseBillingPrint' name='CasualReverseBillingPrint' type='Report' exact component={CasualReverseBillingPrint}></PrivateRoute>
        <PrivateRoute path='/Report/ManagementAuditTrail' name='Management Audit Trail' type='Report' exact component={ManagementAuditTrail}></PrivateRoute>
        <PrivateRoute path='/Report/ManagementAuditTrailPrint' name='ManagementAuditTrailPrint' type='Report' exact component={ManagementAuditTrailPrint}></PrivateRoute>
        <PrivateRoute path='/Report/OverTime' name='Overtime' type='Report' exact component={Overtime}></PrivateRoute>
        <PrivateRoute path='/Report/OverTimePrint' name='OverTimePrint' type='Report' exact component={OvertimePrint}></PrivateRoute>
        <PrivateRoute path='/Report/CustomUserReport' name='Custom User Report' type='Report' exact component={CustomUserReportTable}></PrivateRoute>
        <PrivateRoute path='/Report/CustomUserReportPrint' name='CustomUserReportPrint' type='Report' exact component={CustomUserReportPrint}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityPutaway' name='Productivity Putaway' type='Report' exact component={ProductivityPutawayReport}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityPutawayPrint' name='ProductivityPutawayPrint' type='Report' exact component={ProductivityPutawayReportPrint}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityPack' name='Productivity Pack' type='Report' exact component={ProductivityPackReport}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityPackPrint' name='ProductivityPackPrint' type='Report' exact component={ProductivityPackPrint}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityMove' name='Productivity Move' type='Report' exact component={ProductivityMoveReport}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityMovePrint' name='ProductivityMovePrint' type='Report' exact component={ProductivityMovePrint}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityReplenishment' name='Productivity Replenishment' type='Report' exact component={ProductivityRepReport}></PrivateRoute>
        <PrivateRoute path='/Report/AsicsProductivityReplenishment' name='Productivity Replenishment' type='Report' exact component={AsicsProductivityRepReport}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityRepPrint' name='ProductivityRepPrint' type='Report' exact component={ProductivityRepPrint}></PrivateRoute>
        <PrivateRoute path='/Report/UserSummaryReport' name='User Summary' type='Report' exact component={userSummaryTable}></PrivateRoute>
        <PrivateRoute path='/Report/UserSummaryReportPrint' name='UserSummaryReportPrint' type='Report' exact component={userSummaryPrint}></PrivateRoute>
        <PrivateRoute path='/Report/EmployeeTracking' name='Employee Tracking' type='Report' exact component={EmployeeTracking}></PrivateRoute>
        <PrivateRoute path='/Report/EmployeeTrackingPrint' name='EmployeeTrackingPrint' type='Report' exact component={EmployeeTrackingPrint}></PrivateRoute>
        <PrivateRoute path='/Report/AsicsCasualReverseBillingPrint' name='Casual Reverse Billing' type='Report' exact component={AsicsCasualReverseBillingPrint}></PrivateRoute>
        <PrivateRoute path='/Report/AsicsCasualReverseBilling' name='CasualReverseBillingPrint' type='Report' exact component={AsicsCasualReverseBilling}></PrivateRoute>
        <PrivateRoute path='/Report/ScantimeExceptionPrint' name='ScantimeExceptionPrint' type='Report' exact component={ScanTimeExceptionPrint}></PrivateRoute>
        <PrivateRoute path='/Report/ScanTimeException' name='Scan Time Exception' type='Report' exact component={ScanTimeException}></PrivateRoute>
        <PrivateRoute path='/Report/IdleReport' name='Idle Report' type='Report' exact component={IdleReport}></PrivateRoute>
        <PrivateRoute path='/Report/IdleReportPrint' name='IdleReportPrint' type='Report' exact component={IdleReportPrint}></PrivateRoute>
        <PrivateRoute path='/Report/AsicsChutePickReasonablePerformance' name='Chute Picking Performance' type='Report' exact component={ChutePickTable}></PrivateRoute>
        <PrivateRoute path='/Report/AsicsChutePickReasonablePerformancePrint' name='ChutePickPrint' type='Report' exact component={ChutePickPrint}></PrivateRoute>
        <PrivateRoute path='/Report/TimeCostPerCC' name='TimeCostPerCC' type='Report' exact component={TimeCostPerCCTable}></PrivateRoute>
        <PrivateRoute path='/Report/TimeCostPerCCPrint' name='TimeCostPerCCPrint' type='Report' exact component={TimeCostPerCCTablePrint}></PrivateRoute>
        
        <PrivateRoute path='/Report/BRITimesheet' name='Timesheet' type='Report' exact component={BRITimesheetTable}></PrivateRoute>
        <PrivateRoute path='/Report/BRIimesheetPrint' name='TimesheetPrint' type='Report' exact component={BRITimesheetPrint}></PrivateRoute>
        
        <PrivateRoute path='/Report/Timesheet' name='Timesheet' type='Report' exact component={TimesheetTable}></PrivateRoute>
        <PrivateRoute path='/Report/TimesheetPrint' name='TimesheetPrint' type='Report' exact component={TimesheetPrint}></PrivateRoute>
        <PrivateRoute path='/Report/UserTaskSummary' name='User Task Summary' type='Report' exact component={UserTaskSummaryTable}></PrivateRoute>
        <PrivateRoute path='/Report/UserTaskSummaryPrint' name='UserTaskSummaryPrint' type='Report' exact component={UserTaskSummaryPrint}></PrivateRoute>
        <PrivateRoute path='/Report/DailyScanReport' name='Daily Scan Report' type='Report' exact component={DailyScanTable}></PrivateRoute>
        <PrivateRoute path='/Report/DailyScanReportPrint' name='DailyScanReportPrint' type='Report' exact component={DailyScanPrint}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityLoad' name='Productivity Load' type='Report' exact component={prodLoadTable}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityLoadPrint' name='ProductivityLoadPrin' type='Report' exact component={prodLoadPrint}></PrivateRoute>
        <PrivateRoute path='/Report/CostPerUnit' name='Cost Per Unit' type='Report' exact component={CostPerUnitreport}></PrivateRoute>
        <PrivateRoute path='/Report/CostPerUnitPrint' name='CostPerUnitPrint' type='Report' exact component={CostPerUnitreportPrint}></PrivateRoute>
        <PrivateRoute path='/Report/TMACasualReverseBilling' name='Casual Reverse Billing' type='Report' exact component={TMACasualReverseBillingPrint}></PrivateRoute>
        <PrivateRoute path='/Report/TMACostPerLinePrint' name='Cost Per Line' type='Report' exact component={TMACostPerUnitreport}></PrivateRoute>
        {/** Makita Specific Reports */}

        <PrivateRoute path='/Report/PermanentPayrollReport' name='Permanent Payroll Report' type='Report' exact component={PermanentPayrollPrint}></PrivateRoute>

        <PrivateRoute path='/Report/ProductivityReworkPrint' name='ProductivityReworkPrint' type='Report' exact component={ProductivityReworkPrint}></PrivateRoute>
        <PrivateRoute path='/Report/ProductivityRework' name='Productivity Rework' type='Report' exact component={ProductivityReworkTable}></PrivateRoute>
        
        <PrivateRoute path='/Report/TimeBetweenOrdersReportPrint' name='TimeBetweenOrdersPrint' type='Report' exact component={TimeBetweenOrdersPrint}></PrivateRoute>
        <PrivateRoute path='/Report/TimeBetweenOrdersReport' name='Time Between Orders' type='Report' exact component={TimeBetweenOrders}></PrivateRoute>

        <PrivateRoute path='/Report/TardinessReportPrint' name='TardinessReportPrint' type='Report' exact component={TardinessReportPrint}></PrivateRoute>
        <PrivateRoute path='/Report/TardinessReport' name='Tardiness Report' type='Report' exact component={TardinessReportTable}></PrivateRoute>
        <PrivateRoute path='/Report/MakProductivityPickReport' name='Productivity Pick' type='Report' exact component={MakitaProductivityPicktable}></PrivateRoute>
        <PrivateRoute path='/Report/MakUserTaskSummary' name='User Task Summary Report' type='Report' exact component={MakitaUserTaskSummary}></PrivateRoute>
        {/** RPFC Productivity Pick Report */}
        <PrivateRoute path='/Report/RPFCProductivityPickReport' name='Productivity Pick' type='Report' exact component={RPFCProdPickTable}></PrivateRoute>


        <Route component={Login}></Route>
      </Switch>
    )
  };

  export default Routes;