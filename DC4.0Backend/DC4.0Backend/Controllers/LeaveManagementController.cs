using DC4._0Backend.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Web.Http;

namespace DC4._0Backend.Controllers
{
    public class LeaveManagementController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetallLeaveRequest([FromBody]LeaveManagement leave)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
            List<LeaveManagement> leaveRequest = new List<LeaveManagement>();
            try
            {
                sSQL = "select el.SerialID ID, el.UserID, ui.FirstName, ui.Surname ,ui.TeamManager, Convert(char(10), el.Date, 103) 'Date', ISNULL(el.StartTime, '') StartTime,"
              + "ISNULL(el.EndTime, '') EndTime , el.LeaveCode + ' - ' + el.LeaveDesc 'LeaveType', el.LeaveStatus, ISNULL(CheckedBy, '') CheckedBy ," +
               "ISNULL(Comment, '') Comment, ISNULL(Site, '') Site From[EmployeeLeaveRequest] el JOIN Userinfo ui ON el.UserID = ui.UserID  WHERE 1 = 1"
              + "AND Convert(Date, el.Date,103) between Convert(Date, '" + leave.FromDate + "',103) AND Convert(Date, '" + leave.ToDate + "',103)";


                try
                {
                    Logging.WriteLog(leave.Site, "Info", "LeaveManagment", "GetallLeaveRequest", sSQL.Replace("'", "''"), 1002, leave.DCMUser);
                }
                catch (Exception e) { }

                DataSet ds = conn.ExecuteSelectQuery(sSQL, leave.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    leaveRequest = (from DataRow dr in ds.Tables[0].Rows
                                    select new LeaveManagement
                                    {
                                        SerialID = dr["ID"].ToString(),
                                        UserID = dr["UserID"].ToString(),
                                        FirstName = dr["FirstName"].ToString(),
                                        Surname = dr["Surname"].ToString(),
                                        Date = dr["Date"].ToString(),
                                        StartTime = dr["StartTime"].ToString(),
                                        EndTime = dr["EndTime"].ToString(),
                                        LeaveType = dr["LeaveType"].ToString(),
                                        LeaveStatus = dr["LeaveStatus"].ToString(),
                                        CheckedBy = dr["CheckedBy"].ToString(),
                                        CommentBy = dr["Comment"].ToString(),
                                        Site = dr["Site"].ToString(),
                                        TeamManager = dr["TeamManager"].ToString()

                                    }).ToList();
                }


            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(leave.Site, "Error", "LeaveManagment", "GetallLeaveRequest", sSQL.Replace("'", "''"), 3002, leave.DCMUser);
                }
                catch (Exception e) { }
            }
            return JsonSerializer.Serialize(leaveRequest);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string ApproveSelectedLeave([FromBody]LeaveManagement leave)
        {
            string[] IDs = leave.ApproveID.Split(',');
            Connection conn = new Connection();

            int approvedrecords = 0;
            int totalrecords = IDs.Length;
            string sSQL = string.Empty;
            string approvedrecordsresult = "Approved Records=";
            try
            {
                for (int i = 0; i < IDs.Length; i++)
                {

                    bool FullDayLeave = false;
                    LeaveManagement newLeaveObj = new LeaveManagement();
                    string leavemanagementrow = "select * , Convert(varchar, Date , 103) + ' '+ StartTime as 'StartDateTime', Convert(varchar, Date , 103) + ' '+ EndTime as 'EndDateTime' from EmployeeLeaveRequest where SerialID = " + IDs[i];



                    DataSet ds = conn.ReturnCompleteDataSet(leavemanagementrow, leave.Site);
                    newLeaveObj.Date = ds.Tables[0].Rows[0]["Date"].ToString();
                    newLeaveObj.UserID = ds.Tables[0].Rows[0]["UserID"].ToString();
                    newLeaveObj.StartTime = ds.Tables[0].Rows[0]["StartTime"].ToString();
                    newLeaveObj.leaveCode = ds.Tables[0].Rows[0]["LeaveCode"].ToString();
                    newLeaveObj.EndTime = ds.Tables[0].Rows[0]["EndTIme"].ToString();
                    string StartDateTime = ds.Tables[0].Rows[0]["StartDateTime"].ToString();
                    string EndDateTime = ds.Tables[0].Rows[0]["EndDateTime"].ToString();
                    newLeaveObj.LeaveStatus = ds.Tables[0].Rows[0]["LeaveStatus"].ToString();
                    string StartDate = StartDateTime.Split(' ')[0];


                    sSQL = "select count(*) from bundyclock Where UserID = '" + newLeaveObj.UserID + "' "
                 + " AND ((Convert(DateTime,'" + StartDateTime + "',103) BETWEEN StartDateTime AND EndDateTime) OR (Convert(DateTime,'" + EndDateTime + "',103) BETWEEN StartDateTime AND EndDateTime) " +
                 " OR ( StartDateTime between Convert(DateTime,'" + StartDateTime + "',103) AND Convert(DateTime,'" + EndDateTime + "',103) OR EndDateTime between Convert(DateTime,'" + StartDateTime + "',103) AND Convert(DateTime,'" + EndDateTime + "',103) ))";


                       // sSQL = "select count(*) from bundyclock Where UserID = '" + newLeaveObj.UserID + "'  AND (startdatetime > Convert(DateTime,'" + StartDateTime + "',103) AND StartDateTime < Convert(DateTime,'" + EndDateTime + "',103) OR enddatetime > Convert(DateTime,'" + StartDateTime + "',103) AND enddatetime < Convert(DateTime,'" + EndDateTime + "',103))";

                        int BCRecords = int.Parse(conn.ReturnSingleValue(sSQL, leave.Site));
                        if (BCRecords > 0)
                        {

                        }
                        else
                        {
                            sSQL = "UPDATE EmployeeLeaveRequest Set LeaveStatus = 'A', CheckedBy = '" + leave.CheckedBy + "',  Comment = '"+leave.CommentBy+"' WHERE SerialID = " + IDs[i];

                        try
                        {
                            Logging.WriteLog(leave.Site, "Info", "LeaveManagment", "ApproveSelectedLeave", sSQL.Replace("'", "''"), 1003, leave.DCMUser);
                        }
                        catch (Exception e) { }


                        conn.ExecuteUpdateQuery(sSQL, leave.Site);
                            AddLeave(StartDate, newLeaveObj.UserID, newLeaveObj.leaveCode, newLeaveObj.StartTime, newLeaveObj.EndTime, leave.Site, leave.CheckedBy, FullDayLeave);


                       

                        approvedrecords++;
                        if (i == totalrecords - 1)
                        {
                            approvedrecordsresult = approvedrecordsresult + IDs[i];
                        }
                        else
                        {
                            approvedrecordsresult = approvedrecordsresult + IDs[i] + ",";
                        }
                    }



                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(leave.Site, "Error", "LeaveManagment", "ApproveSelectedLeave", sSQL.Replace("'", "''"), 3003, leave.DCMUser);
                }
                catch (Exception e) { }
            }
            //return approvedrecordsresult;
          return  +approvedrecords+" Records Approved from a total of "+totalrecords +" records ";
        }
    
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string RejectSelectedLeave([FromBody]LeaveManagement leave)
        {
            string sSQL = string.Empty;
            string[] IDs = leave.RejectID.Split(',');
            Connection conn = new Connection();
            try
            {
                for (int i = 0; i < IDs.Length; i++)
                {

                    bool FullDayLeave = false;
                    LeaveManagement newLeaveObj = new LeaveManagement();
                    string leavemanagementrow = "select * , Convert(varchar, Date , 103) + ' '+ StartTime as 'StartDateTime', Convert(varchar, Date , 103) + ' '+ EndTime as 'EndDateTime' from EmployeeLeaveRequest where SerialID = " + IDs[i];
                    DataSet ds = conn.ReturnCompleteDataSet(leavemanagementrow, leave.Site);
                    newLeaveObj.Date = ds.Tables[0].Rows[0]["Date"].ToString();
                    newLeaveObj.UserID = ds.Tables[0].Rows[0]["UserID"].ToString();
                    newLeaveObj.LeaveStatus = ds.Tables[0].Rows[0]["LeaveStatus"].ToString();
                
                    string StartDatetime = ds.Tables[0].Rows[0]["StartDateTime"].ToString();
                    string StartDate = StartDatetime.Split(' ')[0];
                    if (newLeaveObj.LeaveStatus.Equals("P"))
                    {
                        sSQL = "UPDATE EmployeeLeaveRequest SET LeaveStatus = 'R', CheckedBy = '" + leave.CheckedBy + "', Comment = '" + leave.CommentBy + "' WHERE SerialID = " + IDs[i];

                        try
                        {
                            Logging.WriteLog(leave.Site, "Info", "LeaveManagment", "RejectSelectedLeave", sSQL.Replace("'", "''"), 1003, leave.DCMUser);
                        }
                        catch (Exception e) { }

                        conn.ExecuteUpdateQuery(sSQL, leave.Site);

                    }
                    else if (newLeaveObj.LeaveStatus.Equals("A"))
                    {
                        CancelLeave(StartDate, newLeaveObj.UserID, leave.Site,leave.CommentBy);
                    }

                }
                }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(leave.Site, "Error", "LeaveManagment", "RejectSelectedLeave", sSQL.Replace("'", "''"), 3003, leave.DCMUser);
                }
                catch (Exception e) { }
            }
            return "All the Selected Leaves are Rejected";
            }
            private void AddLeave(string DatePicked, string userID, string lvCode, string LeaveStartTime, string LeaveEndTime, string sitecode, string UpdatedBy, bool FullDayLeave)
            {
            string sSQL = string.Empty;
            Connection conn = new Connection();

                try
                {

                    // Creating records if there is not any in TimeInfoByUser table for a partcular user and date
                    sSQL = "Select count(*) from TimeInfoByUser where UserID='" + userID + "' ";
                    sSQL += " and convert(datetime,StartDate,103)=CONVERT(datetime,'" + DatePicked + "',103)";
                    int UTIRecords = int.Parse(conn.ReturnSingleValue(sSQL, sitecode));
                    if (UTIRecords == 0)
                    {
                        string sSQL_CreateRecordsUTI = "Exec spCreateTimeInfoByUserRecords '" + DatePicked + "','" + DatePicked + "','" + userID + "'";
                        conn.ReturnCompleteDataSet(sSQL_CreateRecordsUTI,sitecode);
                    }


                    // ------------------Getting Updated By----------
                    string sSQL_UpdateBy = "Select FirstName + ' '+ Surname From DCMUser Where UserName = '" + UpdatedBy + "'";
                    string UpdateBy = conn.ReturnSingleValue(sSQL_UpdateBy,sitecode);


                    // ------------------Inserting data into EmpLeaveDetails and bundyClock table----------
                    if (FullDayLeave)
                    {
                        string insertStatement = "insert EmpLeaveDetails (UserID, LeaveDate,LeaveType) values";
                        insertStatement += "('" + userID + "',CONVERT(DATE,'" + DatePicked + "', 103),'" + lvCode + "')";
                    conn.ReturnCompleteDataSet(insertStatement,sitecode);

                        string sSQL_UpdateBundyClock = "Exec spLeaveDetails '" + DatePicked + "','" + userID + "','" + UpdateBy + "'";


                    conn.ReturnCompleteDataSet(sSQL_UpdateBundyClock,sitecode);
                    }
                    else
                    {
                        string insertStatement = "insert EmpLeaveDetails (UserID, LeaveDate,LeaveType,StartTime,EndTime) values";
                        insertStatement += "('" + userID + "', CONVERT(DATE,'" + DatePicked + "', 103),'" + lvCode + "','" + LeaveStartTime + "','" + LeaveEndTime + "')";
                    conn.ReturnCompleteDataSet(insertStatement,sitecode);

                        string sSQL_UpdateBundyClock = "Exec spLeaveDetailsHalf '" + DatePicked + "','" + userID + "','" + UpdateBy + "'";
                       

                        conn.ReturnCompleteDataSet(sSQL_UpdateBundyClock,sitecode);
                    }
                }



                // NOTES Need to cater for cancelling leave, 
                // Need to keep original records
                // Need to check if Different leave type exists already before adding

                // Work to be done below
                // Add EmpLeaveDetails
                // Get UPDATED BY
                // Add BundyClock Record

                catch (Exception ex)
                {
                    //moLog.WriteLog("An error occured while creating UTI for leave.Error:" + ex.ToString(), Microsoft.VisualBasic.Logging.LOGLEVEL.LOG_DETAILED, Microsoft.VisualBasic.Logging.LOGTYPE.LOG_ERROR);
                }
            }

        private void CancelLeave(string DatePicked, string userID, string sitecode, string comment)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            try
            {

                // ------------------'Delete all rows with the same LeaveDate in EmpLeaveDetails----------------------------'
                string deleteStatement = "Delete from EmpLeaveDetails where UserID = '" + userID + "'";
                deleteStatement += " And LeaveDate = CONVERT(DATE,'" + DatePicked + "',103)";

             string strresult =    conn.ExecuteDeleteQuery(deleteStatement, sitecode);

              //  moLog.WriteLog("deleting leave record from EmpLeaveDetails : " + sSQL, Microsoft.VisualBasic.Logging.LOGLEVEL.LOG_SUMMARY, Microsoft.VisualBasic.Logging.LOGTYPE.LOG_INFO);

                // ------------------Deleting data from BundyClock----------------------------'
                sSQL = "Delete from BundyClock  where"
             +" UserID='" + userID + "'"
               +" And CONVERT(DATE,StartDateTime,103) = CONVERT(DATE,'" + DatePicked + "',103)"
                + " And  Leave= 'Y'";

                conn.ReturnCompleteDataSet(sSQL, sitecode);

                // ------------------Updating all approved Leaves to Cancelled in EmpLeaveRequest----------------------------'
                sSQL = " UPDATE EmployeeLeaveRequest SET LeaveStatus = 'C', Comment='"+comment+"' WHERE UserID = '" + userID + "' AND Date = CONVERT(DATE,'" + DatePicked + "',103) AND LEAVESTATUS = 'A'";

                //updating UI logs
                try
                {
                    Logging.WriteLog(sitecode, "Info", "LeaveManagment", "CancelLeave", sSQL.Replace("'", "''"), 1002, userID);
                }
                catch (Exception e) { }


                conn.ReturnCompleteDataSet(sSQL, sitecode);

              //  moLog.WriteLog("deleting leave record from bundyclock : " + sSQL, Microsoft.VisualBasic.Logging.LOGLEVEL.LOG_SUMMARY, Microsoft.VisualBasic.Logging.LOGTYPE.LOG_INFO);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(sitecode, "Error", "LeaveManagment", "CancelLeave", sSQL.Replace("'", "''"), 3003, userID);
                }
                catch (Exception e) { }
                //  moLog.WriteLog("An error occured while deleting leave.Error:" + ex.ToString(), Microsoft.VisualBasic.Logging.LOGLEVEL.LOG_DETAILED, Microsoft.VisualBasic.Logging.LOGTYPE.LOG_ERROR);
                //Interaction.MsgBox("An error occured while deleting leave. See log for details.", MsgBoxStyle.Exclamation);
            }
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllApprovedLeaves([FromBody]LeaveManagement leave)
        {
            string sSQL = "select elr.SerialID , ui.FirstName +' '+ui.SurName +'-'+elr.LeaveCode as 'Description' , Convert( varchar,elr.Date,103) as 'Date'," +
                  " convert(varchar, convert(datetime, elr.StartTime, 8), 8) as'StartTime' ,  convert(varchar, convert(datetime, elr.EndTime, 8), 8) as'EndTime', l.LeaveColor from EmployeeLeaveRequest elr inner join UserInfo ui on elr.UserID = ui.UserID inner join  Leave l  on elr.LeaveDesc = l.LeaveDesc  where ui.EmployeeCategory =  l.EmpType and  elr.LeaveStatus = 'A' ";

            //string sSQL = " select elr.SerialID , ui.FirstName + ' ' + ui.SurName + '-' + elr.LeaveCode as 'Description' , Convert(varchar, elr.Date, 23) + 'T' + Convert(varchar, Convert(Datetime, elr.StartTime, 8), 8) as 'StartTime', " +
            //           " Convert(varchar, elr.Date, 23) + 'T' + Convert(varchar, Convert(Datetime, elr.EndTime, 8), 8) as 'EndTime' from EmployeeLeaveRequest elr inner" +
            //           " join UserInfo ui on elr.UserID = ui.UserID where elr.LeaveStatus = 'A'";

            Connection conn = new Connection();
          
            List<LeaveManagement> leaveRequest = new List<LeaveManagement>();

            try
            {
                Logging.WriteLog(leave.Site, "Info", "LeaveManagment", "GetAllApprovedLeaves", sSQL.Replace("'", "''"), 1002, leave.DCMUser);
            }
            catch (Exception e) { }
            try
            {
                DataSet ds = conn.ExecuteSelectQuery(sSQL, leave.Site);

                if (ds.Tables[0].Rows.Count > 0)
              {
                leaveRequest = (from DataRow dr in ds.Tables[0].Rows
                                select new LeaveManagement
                                {
                                    SerialID = dr["SerialID"].ToString(),
                                    Title = dr["Description"].ToString(),
                                    Date = dr["Date"].ToString(),
                                    StartTime = dr["StartTime"].ToString(),
                                    EndTime = dr["EndTime"].ToString(),

                                    LeaveColor = dr["LeaveColor"].ToString(),

                                }).ToList();
                }


              }
                 catch (Exception ex)
                  {

                try
                {
                    Logging.WriteLog(leave.Site, "Error", "LeaveManagment", "GetAllApprovedLeaves", sSQL.Replace("'", "''"), 3002, leave.DCMUser);
                }
                catch (Exception e) { }

            }
                return JsonSerializer.Serialize(leaveRequest);

        }

    }
}
