using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DC4._0Backend.Models;
using System.Data;
using System.Text.Json;
using System.Data.SqlClient;
using System.Configuration;

namespace DC4._0Backend.Controllers
{
    public class TimeAndAttendenceController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllTimeandAttendenceEntries([FromBody]TimeAndAttendence time)
        {


            string sSQL = String.Empty;

            sSQL = " Select bc.UserID, ui.FirstName, ui.Surname,ui.TeamManager, bc.ShiftCode,Convert(char(10), bc.StartDateTime, 103)'StartDate'," +
                   "Convert(char(8), Convert(varchar, bc.StartDateTime, 114), 103)'StartTime',Convert(char(10), bc.EndDateTime, 103)'EndDate',Convert(char(8)," +
                   "Convert(varchar, bc.EndDateTime, 114), 103)'EndTime',ISNULL(tiu.ManualUserClockInTime, '') 'ShiftStart', ISNULL(tiu.ManualUserClockOutTime, '')" +
                   "'ShiftEnd',IsNull(bc.Approve, '') 'Approved', IIF(bc.ReasonForUpdate in (Select LeaveCode FROM Leave), (SELECT DISTINCT top 1 LeaveDesc FROM Leave Where bc.ReasonForUpdate = LeaveCode)," +
                   "IsNull(bc.ReasonForUpdate, '')) 'ReasonForUpdate', IsNull(bc.UpdateBy, '')'UpdateBy',bc.ID,IsNull(bc.OvertimeException, '') 'OTException', IsNull(bc.MealAllowance, '') 'MealAllowance',IsNull(bc.AllowOTatStart, '') 'OTAtStart', IsNull(bc.AllowOTatEnd, '') 'OTAtEnd' from UserInfo ui, BundyClock bc " +
                   " LEFT join TimeInfoByUser tiu  ON bc.UserID = tiu.UserID  AND convert(date, bc.StartDateTime,103) = convert(date, tiu.StartDate, 103) " + "" +
                   "  Where bc.UserID = ui.UserID And Convert(DateTime, Convert(Char(19),bc.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + time.StartDate + "',103),103) " + "" +
                   " And Convert(DateTime, Convert(Char(19),'" + time.EndDate + "',103),103)  Order by ui.FirstName,ui.Surname,bc.StartDateTime";

            Connection connection = new Connection();

            List<TimeAndAttendence> entryList = new List<TimeAndAttendence>();
            try
            {
                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 1002, time.UpdateBy);
                }
                catch (Exception ex) { }

                DataSet ds = connection.ExecuteSelectQuery(sSQL, time.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        TimeAndAttendence obj = new TimeAndAttendence();
                        obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                        obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                        obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                        obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                        obj.ShiftType = ds.Tables[0].Rows[i]["ShiftCode"].ToString().Substring(0,1);
                        obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                        obj.StartTime = ds.Tables[0].Rows[i]["StartTime"].ToString();
                        obj.EndDate = ds.Tables[0].Rows[i]["EndDate"].ToString();
                        obj.EndTime = ds.Tables[0].Rows[i]["EndTime"].ToString();
                        obj.ShiftStart = ds.Tables[0].Rows[i]["ShiftStart"].ToString();
                        obj.ShiftEnd = ds.Tables[0].Rows[i]["ShiftEnd"].ToString();
                        obj.Approved = ds.Tables[0].Rows[i]["Approved"].ToString();
                        obj.ReasonForUpdate = ds.Tables[0].Rows[i]["ReasonForUpdate"].ToString();
                        obj.UpdateBy = ds.Tables[0].Rows[i]["UpdateBy"].ToString();
                        obj.ID = ds.Tables[0].Rows[i]["ID"].ToString();
                        obj.OTException = ds.Tables[0].Rows[i]["OTException"].ToString();
                        obj.MealAllowance = ds.Tables[0].Rows[i]["MealAllowance"].ToString();
                        obj.OTAtStart = ds.Tables[0].Rows[i]["OTAtStart"].ToString();
                        obj.OTAtEnd = ds.Tables[0].Rows[i]["OTAtEnd"].ToString();
                        obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();

                        entryList.Add(obj);

                    }

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 3002, time.UpdateBy);
                }
                catch (Exception e) { }
                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(entryList);

        }





        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string UpdateTimeandAttendenceEntry([FromBody] TimeAndAttendence time)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;
            try
            {
                //checking for the Leave first
                sSQL = "Select ISNULL(Leave,'') From BundyClock Where ID = '" + time.ID + "'";

                if (conn.ReturnSingleValue(sSQL, time.Site).Equals("Y"))
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 2003, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    return "Please update this record through the LeaveDetails";
                }

                // Checking from the Assigned Leave Section

                sSQL = "select count(*) from Leave where LeaveCode like '%" + time.ReasonForUpdate + "%' or LeaveDesc like '%" + time.ReasonForUpdate + "%'";

                if (int.Parse(conn.ReturnSingleValue(sSQL, time.Site)) > 0)
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 2003, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    return "Leave must be assigned from UserDetails window";
                }

                string StartDateTime = time.StartDate + " " + time.StartTime;
                string EndDateTime = time.EndDate + " " + time.EndTime;


                if (!(time.OTAtStart.Equals("Y")))
                {
                    time.OTAtStart = "";
                }

                if (!(time.OTAtEnd.Equals("Y")))
                {
                    time.OTAtEnd = "";
                }

                //string UpdateByName = conn.ReturnSingleValue("Select FirstName+' '+ Surname from UserInfo where UserID = '" + time.UpdateBy + "' ", time.Site);
                WriteAudit(time, "Before_Update");

                sSQL = "Update BundyClock Set  StartDateTime = Convert(DateTime,'" + StartDateTime + "',103), EndDateTime = Convert(DateTime,'" + EndDateTime + "',103), MealAllowance = '" + time.MealAllowance + "', CalledBack = '" + time.CallBack + "',"
                       + "ReasonForUpdate = '" + time.ReasonForUpdate + "', UpdateBy = '" + time.UpdateBy + "', EditDate = GetDate(), OvertimeException = '" + time.OTException + "' ,AllowOTatStart = '"+time.OTAtStart+"', AllowOTatEnd = '"+time.OTAtEnd+"' Where ID = " + time.ID + " And UserID = '" + time.UserID + "'";

                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "UpdateTimeandAttendenceEntry", sSQL.Replace("'", "''"), 1003, time.UpdateBy);
                }
                catch (Exception ex) { }

             string strresult =   conn.ExecuteUpdateQuery(sSQL, time.Site);

                if (strresult != "Update SuccessFull")
                {
                    return "Time and Attendence Entry Update Failed";
                }
                WriteAudit( time,"After_Update");
                result = "Time and Attendence Entry Updated";
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "UpdateTimeandAttendenceEntry", sSQL.Replace("'", "''"), 3003, time.UpdateBy);
                }
                catch (Exception e)
                {

                }
                return "Error Occurred while updating" + ex.Message;
            }

            return result;
        }

     
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string EditTimeandAttendenceEntry_Grid([FromBody] TimeAndAttendence time)
        {

            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;
            try
            { 

                //checking for the Leave first
                sSQL = "Select ISNULL(Leave,'') From BundyClock Where ID = '" + time.ID + "'";

                if (conn.ReturnSingleValue(sSQL, time.Site).Equals("Y"))
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 2003, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    return "Please update this record through the LeaveDetails";
                }

                // Checking from the Assigned Leave Section

                sSQL = "select count(*) from Leave where LeaveCode like '%" + time.ReasonForUpdate + "%' or LeaveDesc like '%" + time.ReasonForUpdate + "%'";

                if (int.Parse(conn.ReturnSingleValue(sSQL, time.Site)) > 0)
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 2003, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    return "Leave must be assigned from UserDetails window";
                }

                string StartDateTime = time.StartDate + " " + time.StartTime;
                string EndDateTime = time.EndDate + " " + time.EndTime;



                if (!(time.OTAtStart.Equals("Y")))
                {
                    time.OTAtStart = "";
                }

                if (!(time.OTAtEnd.Equals("Y")))
                {
                    time.OTAtEnd = "";
                }

                string rostersql = "select  ManualUserClockInTime, ManualUserClockOutTime from TimeInfoByUser where UserID = '" + time.UserID + "'and StartDate = '" + time.StartDate + "' and EndDate = '" + time.EndDate + "'";

                DataSet rosterds = conn.ReturnCompleteDataSet(rostersql, time.Site);
                if (rosterds.Tables[0].Rows.Count == 1)
                {

                    if ((rosterds.Tables[0].Rows[0]["ManualUserClockInTime"].ToString() != (time.StartTime)) || ((rosterds.Tables[0].Rows[0]["ManualUserClockOutTime"].ToString() != (time.EndTime))))
                    {
                        if ((time.ShiftStart != "") && (time.ShiftEnd != ""))
                       {

                            UpdateRoster(time);
                        }
                    }
                }
                else
                {
                    if ((time.ShiftStart != "") && (time.ShiftEnd != ""))
                    {

                        UpdateRoster(time);
                    }
                }

                //string UpdateByName = conn.ReturnSingleValue("Select FirstName+' '+ Surname from UserInfo where UserID = '" + time.UpdateBy + "' ", time.Site);
                WriteAudit(time, "Before_Update");

                if (EndDateTime.Equals(" "))
                {
                    sSQL = "Update BundyClock Set  StartDateTime = Convert(DateTime,'" + StartDateTime + "',103), EndDateTime = Convert(DateTime,null,103), MealAllowance = '" + time.MealAllowance + "', CalledBack = '" + time.CallBack + "',"
                          + "ReasonForUpdate = '" + time.ReasonForUpdate + "', UpdateBy = '" + time.UpdateBy + "', EditDate = GetDate(), OvertimeException = '" + time.OTException + "' ,AllowOTatStart = '" + time.OTAtStart + "', AllowOTatEnd = '" + time.OTAtEnd + "' Where ID = " + time.ID + " And UserID = '" + time.UserID + "'";
                }
                else
                {
                    sSQL = "Update BundyClock Set  StartDateTime = Convert(DateTime,'" + StartDateTime + "',103), EndDateTime = Convert(DateTime,'" + EndDateTime + "',103), MealAllowance = '" + time.MealAllowance + "', CalledBack = '" + time.CallBack + "',"
                           + "ReasonForUpdate = '" + time.ReasonForUpdate + "', UpdateBy = '" + time.UpdateBy + "', EditDate = GetDate(), OvertimeException = '" + time.OTException + "' ,AllowOTatStart = '" + time.OTAtStart + "', AllowOTatEnd = '" + time.OTAtEnd + "' Where ID = " + time.ID + " And UserID = '" + time.UserID + "'";
                }
                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "UpdateTimeandAttendenceEntry", sSQL.Replace("'", "''"), 1003, time.UpdateBy);
                }
                catch (Exception ex) { }

                string strresult = conn.ExecuteUpdateQuery(sSQL, time.Site);

                if (strresult != "Update SuccessFull")
                {
                    return "Time and Attendence Entry Update Failed";
                }
                WriteAudit(time, "After_Update");
                result = "Time and Attendence Entry Updated";
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "UpdateTimeandAttendenceEntry", sSQL.Replace("'", "''"), 3003, time.UpdateBy);
                }
                catch (Exception e)
                {

                }
                return "Error Occurred while updating" + ex.Message;
            }

            return result;
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddAttendance([FromBody] TimeAndAttendence time)
        {
            string sSQL = String.Empty;           

            Connection connection = new Connection();
            string result = string.Empty;

            try
            {
                //check for duplicate entry
                sSQL = "Select Count (*) From BundyClock Where UserID = '" + time.UserID + "' And Convert(DateTime,StartDateTime,103) = Convert(DateTime,'" + time.StartDate + " " + time.StartTime + "',103) And Convert(DateTime,EndDateTime,103) = Convert(DateTime,'" + time.EndDate + " " + time.EndTime + "',103)";


                if (int.Parse(connection.ReturnSingleValue(sSQL, time.Site).ToString()) > 0)
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "AddAttendance", sSQL.Replace("'", "''"), 2001, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    return "Duplicate record found. Try another record.";
                }

                //check if reason for update matches leave code/desc
                sSQL = "select count(*) from Leave where LeaveCode like '%" + time.ReasonForUpdate + "%' or LeaveDesc like '%" + time.ReasonForUpdate + "%'";

                if (int.Parse(connection.ReturnSingleValue(sSQL, time.Site).ToString()) > 0)
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "AddAttendance", sSQL.Replace("'", "''"), 2003, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    result = "Leave must be assigned from UserDetails window.";
                }

                if (!(time.OTAtStart.Equals("Y")))
                {
                    time.OTAtStart = "";
                }

                if (!(time.OTAtEnd.Equals("Y")))
                {
                    time.OTAtEnd = "";
                }
                //WriteAudit(time, "Before_Insert");
                // insert time and attendance record
                sSQL = "Insert Into BundyClock (UserID,ShiftCode,DeptCode,StartDateTime,EndDateTime,MealAllowance,CalledBack,ReasonForUpdate,UpdateBy,OvertimeException,AllowOTatStart,AllowOTatEnd) Select '" + time.UserID + "',(Select ShiftCode from UserInfo Where UserID = '" + time.UserID + "'),(Select DeptCode from UserInfo Where UserID = '" + time.UserID + "'),Convert(DateTime,'" + time.StartDate + " " + time.StartTime + "',103),Convert(DateTime,'" + time.EndDate + " " + time.EndTime + "',103),'"+ time.MealAllowance +"','"+ time.CallBack +"','"+ time.ReasonForUpdate+"','"+ time.UpdateBy +"','"+time.OTException+"','"+time.OTAtStart+"','"+time.OTAtEnd+"'";
                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "AddAttendance", sSQL.Replace("'", "''"), 1001, time.UpdateBy);
                }
                catch (Exception ex) { }
              string strresult = connection.ExecuteInsertQuery(sSQL, time.Site);

                if (strresult != "Insert SuccessFull")
                {
                    return "Time and Attendence Entry Insertion Failed";
                }
                //WriteAudit(time, "After_Insert");
                result = "Time and Attendance Transaction has been added successfully!";
                
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "AddAttendance", sSQL.Replace("'", "''"), 3001, time.UpdateBy);
                }
                catch (Exception e) { }
                return "Error Occured while adding new entry: " + ex.Message;
            }

            return result;
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string DeleteTimeAndAttendenceEntry([FromBody] TimeAndAttendence time)
        {        
            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;
            try
            {
                //checking for the Leave first
                sSQL = "Select Leave From BundyClock Where ID = '"+time.ID+ "'";

                string queryresult =  conn.ReturnSingleValue(sSQL, time.Site);
                if (queryresult.Equals("Y"))
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "DeleteTimeAndAttendenceEntry", sSQL.Replace("'", "''"), 2003, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    return "Please delete this record through the Leave Management screen";
                }
                WriteAudit(time, "Delete");
                sSQL = "Delete From BundyClock Where ID = " + time.ID + " And UserID = '" + time.UserID + "'";

                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "DeleteTimeAndAttendenceEntry", sSQL.Replace("'", "''"), 1007, time.UpdateBy);
                }
                catch (Exception ex) { }

              string strresult =  conn.ExecuteDeleteQuery(sSQL, time.Site);

                if (strresult != "Delete SuccessFull")
                {
                    return "Error Occured while Deleting the Entry";
                }
                result = "Selected Entry Deleted from the Database";
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "DeleteTimeAndAttendenceEntry", sSQL.Replace("'", "''"), 3007, time.UpdateBy);
                }
                catch (Exception e) { }

                return "Error Occured while Deleting the Entry:" + ex.Message;
            }

            return result;
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string ApproveAllEntries([FromBody] TimeAndAttendence time)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;

            try
            {               
                sSQL = "UPDATE BundyClock SET Approve = 'Y', ApprovedDate = getdate(), ApprovedBy = '" + time.UpdateBy + "' WHERE ID IN ("+time.Approve+") ";
                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "ApproveAllEntries", sSQL.Replace("'", "''"), 1008, time.UpdateBy);
                }
                catch (Exception ex) { }
               string strresult =  conn.ExecuteUpdateQuery(sSQL, time.Site);

                if (strresult != "Update SuccessFull")
                {
                    return "Update Failed.";
                }
              

            }
            catch (Exception ex)
            {
                return "Update Failed due to " + ex.Message;
            }
            return "Entries Approved";
            }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string UpdateRoster([FromBody] TimeAndAttendence time)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;
            try
            {
                //Check if roster was created or not
                sSQL = "select count(*)  from TimeInfoByUser where UserID = '"+ time.UserID + "' AND convert(date,StartDate,103) = (select convert(date,startdatetime,103) from BundyClock where id = "+ time.ID +")";

                if (int.Parse(conn.ReturnSingleValue(sSQL, time.Site)) == 0) //roster was not created before
                {
                    // get the date
                    sSQL = "select convert(varchar,startdatetime,103) from BundyClock where id = " + time.ID;
                    string rosterDate = conn.ReturnSingleValue(sSQL, time.Site);

                    try
                    {
                        sSQL = "EXEC spCreateTimeInfoByUserRecords @sStartDate='" + rosterDate + "', @sEndDate='" + rosterDate + "', @sUserID='" + time.UserID + "'";

                        try
                        {
                            Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "UpdateRoster", sSQL.Replace("'", "''"), 1005, time.UpdateBy);
                        }
                        catch (Exception ex) {}

                        conn.ReturnCompleteDataSet(sSQL, time.Site);

                    }
                    catch (Exception e)
                    {
                        try
                        {
                            Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "UpdateRoster", sSQL.Replace("'", "''"), 3005, time.UpdateBy);
                        }
                        catch (Exception ex ) { }
                    }
                   
                }
                WriteAudit(time, "Before_RosterUpdate");

                // update roster shift times
                sSQL = "UPDATE TimeInfoByUser SET ManualUserClockInTime = '" + time.ShiftStart + "', ManualUserClockOutTime = '" + time.ShiftEnd + "'  WHERE UserID = '" + time.UserID + "'  And CONVERT(date, startdate,103) = (select convert(date,startdatetime,103) from BundyClock where id = " + time.ID + ")";

                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "UpdateRoster", sSQL.Replace("'", "''"), 1003, time.UpdateBy);
                }
                catch (Exception ex) { }

                WriteAudit(time, "After_RosterUpdate");

                string strresult =  conn.ExecuteUpdateQuery(sSQL, time.Site);

                if (strresult != "Update SuccessFull")
                {
                    return "Error Occurred while update User Roster";
                }

                result = "Roster is updated for the user.";
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "UpdateRoster", sSQL.Replace("'", "''"), 3003, time.UpdateBy);
                }
                catch (Exception e ) { }
                return "Error Occurred while updating:" + ex.Message;
            }

            return result;
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string getAllReasons([FromBody] TimeAndAttendence time)
        {
            List<ReasonForUpdates> AllReasonCodes = new List<ReasonForUpdates>();
            string sSQL = ";WITH a AS ( SELECT distinct Reason, '' IsLeave FROM ReasonCode_TA   UNION ALL   Select distinct LeaveDesc, 'Y' from Leave )  SELECT Reason FROM a ORDER BY IsLeave,Reason ";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ExecuteSelectQuery(sSQL, time.Site);

                AllReasonCodes = (from DataRow dr in ds.Tables[0].Rows
                                 select new ReasonForUpdates
                                 {
                                     reasonCodes = dr["Reason"].ToString()
                                 }).ToList();

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "Dropdowns", "getAllReasons", sSQL.Replace("'", "''"), 3004, time.UpdateBy);
                }
                catch (Exception e) { }
                return "Error while Fetching the Reason Codes with error:" + ex.Message;
            }


            return JsonSerializer.Serialize(AllReasonCodes);

        }

        private void WriteAudit(TimeAndAttendence user, string BeforeAfter)
        {
            Connection conn = new Connection();
            string sSql_Audit = "";
            try
            {

                sSql_Audit = " INSERT INTO BundyClock_Audit (UserID, ShiftCode,DeptCode,StartDateTime,EndDateTime,MealAllowance,ReasonForUpdate,UpdateBy " +
          " , AddDate, CalledBack,OverTimeException,Leave,Approve,Decline,AllowOTatStart,AllowOTatEnd,BeforeAfter,UpdatedBy_Audit) " +
            " SELECT UserID, ShiftCode,DeptCode,StartDateTime,EndDateTime,MealAllowance,ReasonForUpdate,UpdateBy " +
             " , GETDATE(), CalledBack,OverTimeException,Leave,Approve,Decline,AllowOTatStart,AllowOTatEnd " +
           " ,'" + BeforeAfter + "','" + user.UpdateBy + "'" +
             " FROM BundyClock " +
          " WHERE ID = '" +user.ID+ "' ";

               string result =  conn.ExecuteInsertQuery(sSql_Audit, user.Site);

            }
            catch (Exception ex)
            {


            }
        }


       


        // ELITE TIME AND ATTENDANCE FUNCTIONS START HERE


        // ELITE TIME AND ATTENDANCE FUNCTIONS END HERE


        //Makita Time and Attendence entries
        [AcceptVerbs("GET", "POST")]
        [HttpGet]

        public string GetAllTimeandAttendenceEntries_Makita([FromBody]TimeAndAttendence time)
        {


            string sSQL = String.Empty;

            sSQL = " Select bc.UserID, ui.FirstName, ui.Surname,ui.TeamManager, bc.ShiftCode,Convert(char(10), bc.StartDateTime, 103)'StartDate'," +
                   "Convert(char(8), Convert(varchar, bc.StartDateTime, 114), 103)'StartTime',Convert(char(10), bc.EndDateTime, 103)'EndDate',Convert(char(8)," +
                   "Convert(varchar, bc.EndDateTime, 114), 103)'EndTime',ISNULL(tiu.ManualUserClockInTime, '') 'ShiftStart', ISNULL(tiu.ManualUserClockOutTime, '')" +
                   "'ShiftEnd',IsNull(bc.Approve, '') 'Approved', IIF(bc.ReasonForUpdate in (Select LeaveCode FROM Leave), (SELECT DISTINCT top 1 LeaveDesc FROM Leave Where bc.ReasonForUpdate = LeaveCode)," +
                   "IsNull(bc.ReasonForUpdate, '')) 'ReasonForUpdate', IsNull(bc.UpdateBy, '')'UpdateBy',bc.ID,IsNull(bc.OvertimeException, '') 'OTException', IsNull(bc.MealAllowance, '') 'MealAllowance',IsNull(bc.AllowOTatStart, '') 'OTAtStart', IsNull(bc.AllowOTatEnd, '') 'OTAtEnd'" +
                   " , IsNull(bc.forceAddMealBreak, '') 'ForceAddMealBreak', IsNull(bc.AfternoonAllowance, '') 'AfternoonAllowance'  from UserInfo ui, BundyClock bc " +
                   " LEFT join TimeInfoByUser tiu  ON bc.UserID = tiu.UserID  AND convert(date, bc.StartDateTime,103) = convert(date, tiu.StartDate, 103) " + "" +
                   "  Where bc.UserID = ui.UserID And Convert(DateTime, Convert(Char(19),bc.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + time.StartDate + "',103),103) " + "" +
                   " And Convert(DateTime, Convert(Char(19),'" + time.EndDate + "',103),103)  Order by ui.FirstName,ui.Surname,bc.StartDateTime";


            //   sSQL = "Select	bc.UserID, ui.FirstName, ui.Surname, bc.ShiftCode," +

            //"Convert(char(10),bc.StartDateTime,103)'StartDate'," +
            //"Convert(char(8),Convert(varchar,bc.StartDateTime,114),103)'StartTime'," +
            //"Convert(char(10),bc.EndDateTime,103)'EndDate'," +
            //"Convert(char(8),Convert(varchar,bc.EndDateTime,114),103)'EndTime'," +

            //"IsNull(bc.MealAllowance,'') 'Meal'," +

            //"IsNull(bc.CalledBack,'') 'CalledBack'," +

            //" IIF(bc.ReasonForUpdate in (Select LeaveCode FROM Leave), (SELECT LeaveDesc FROM Leave Where bc.ReasonForUpdate = LeaveCode), IsNull(bc.ReasonForUpdate,'')) 'ReasonForUpdate', " +

            //"IsNull(bc.UpdateBy,'')'UpdateBy'," +

            //"bc.ID," +

            //"IsNull(bc.AllOTasNormal,'') 'OT as Normal Time'," +

            //"IsNull(bc.NoOvertime,'') 'No OT'," +

            //"IsNull(bc.forceAddMealBreak,'') 'Manual Add Break'" +



            //" from BundyClock bc, UserInfo ui" +
            //" Where bc.UserID = ui.UserID" +
            //" And Convert(DateTime,Convert(Char(19),bc.StartDateTime,103),103) " +
            //" Between  Convert(DateTime,Convert(Char(19),'"  +time.StartDate +  "',103),103) " +
            //" And Convert(DateTime,Convert(Char(19),'" + time.EndDate + "',103),103) ";

            Connection connection = new Connection();

            List<TimeAndAttendence> entryList = new List<TimeAndAttendence>();
            try
            {
                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 1002, time.UpdateBy);
                }
                catch (Exception ex) { }

                DataSet ds = connection.ExecuteSelectQuery(sSQL, time.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        TimeAndAttendence obj = new TimeAndAttendence();
                        obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                        obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                        obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                        obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                       obj.ShiftType = ds.Tables[0].Rows[i]["ShiftCode"].ToString().Substring(0, 1);
                        obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                        obj.StartTime = ds.Tables[0].Rows[i]["StartTime"].ToString();
                        obj.EndDate = ds.Tables[0].Rows[i]["EndDate"].ToString();
                        obj.EndTime = ds.Tables[0].Rows[i]["EndTime"].ToString();
                        obj.ShiftStart = ds.Tables[0].Rows[i]["ShiftStart"].ToString();
                        obj.ShiftEnd = ds.Tables[0].Rows[i]["ShiftEnd"].ToString();
                        obj.Approved = ds.Tables[0].Rows[i]["Approved"].ToString();
                        obj.ReasonForUpdate = ds.Tables[0].Rows[i]["ReasonForUpdate"].ToString();
                        obj.UpdateBy = ds.Tables[0].Rows[i]["UpdateBy"].ToString();
                        obj.ID = ds.Tables[0].Rows[i]["ID"].ToString();
                        obj.OTException = ds.Tables[0].Rows[i]["OTException"].ToString();
                        obj.MealAllowance = ds.Tables[0].Rows[i]["MealAllowance"].ToString();
                        obj.OTAtStart = ds.Tables[0].Rows[i]["OTAtStart"].ToString();
                        obj.OTAtEnd = ds.Tables[0].Rows[i]["OTAtEnd"].ToString();
                        obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                        obj.ForceAddMealBreak = ds.Tables[0].Rows[i]["ForceAddMealBreak"].ToString();
                        obj.AfternoonAllowance = ds.Tables[0].Rows[i]["AfternoonAllowance"].ToString();

                        entryList.Add(obj);

                    }

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 3002, time.UpdateBy);
                }
                catch (Exception e) { }
                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(entryList);

        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddAttendance_Makita([FromBody] TimeAndAttendence time)
        {
            string sSQL = String.Empty;

            Connection connection = new Connection();
            string result = string.Empty;

            try
            {
                //check for duplicate entry
                sSQL = "Select Count (*) From BundyClock Where UserID = '" + time.UserID + "' And Convert(DateTime,StartDateTime,103) = Convert(DateTime,'" + time.StartDate + " " + time.StartTime + "',103) And Convert(DateTime,EndDateTime,103) = Convert(DateTime,'" + time.EndDate + " " + time.EndTime + "',103)";


                if (int.Parse(connection.ReturnSingleValue(sSQL, time.Site).ToString()) > 0)
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "AddAttendance", sSQL.Replace("'", "''"), 2001, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    return "Duplicate record found. Try another record.";
                }

                //check if reason for update matches leave code/desc
                sSQL = "select count(*) from Leave where LeaveCode like '%" + time.ReasonForUpdate + "%' or LeaveDesc like '%" + time.ReasonForUpdate + "%'";

                if (int.Parse(connection.ReturnSingleValue(sSQL, time.Site).ToString()) > 0)
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "AddAttendance", sSQL.Replace("'", "''"), 2003, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    result = "Leave must be assigned from UserDetails window.";
                }

                if (!(time.OTAtStart.Equals("Y")))
                {
                    time.OTAtStart = "";
                }

                if (!(time.OTAtEnd.Equals("Y")))
                {
                    time.OTAtEnd = "";
                }

                if (!(time.OTException.Equals("Y")))
                {
                    time.OTException = "";
                }
                if (!(time.AfternoonAllowance.Equals("Y")))
                {
                    time.AfternoonAllowance = "";
                }
                if (!(time.ForceAddMealBreak.Equals("Y")))
                {
                    time.ForceAddMealBreak = "";
                }

                // Check for  Manual Add Break

                if (time.ForceAddMealBreak.Equals("Y"))


                {


                    sSQL = "select ManualLongBreakStart from TimeInfoByUser where UserID  = '" + time.UserID + "' " +
                           "and CONVERT(date, StartDate, 103) = Convert(Date,'" + time.StartDate + "',103) and ManualLongBreakStart = '00:00'";


                    if (connection.ReturnSingleValue(sSQL, time.Site).Equals("00:00"))
                    {
                        return "User has scanned for long break already. Please Uncheck Add Break CheckBox.";
                    }

                }

                //Check for NO OT and OT at the same time 
                if (time.OTException.Equals("Y"))
                {
                    if ((time.OTAtStart.Equals("Y")) || (time.OTAtEnd.Equals("Y")))
                    {
                        return "User can either be given No OverTime OR All Overtime as per decided rules - not both together!";
                    }
                }

                //WriteAudit(time, "Before_Insert");
                // insert time and attendance record
                sSQL = "Insert Into BundyClock (UserID,ShiftCode,DeptCode,StartDateTime,EndDateTime,MealAllowance,CalledBack,ReasonForUpdate,UpdateBy,OvertimeException,AllowOTatStart,AllowOTatEnd, ForceAddMealBreak ) Select '" + time.UserID + "',(Select ShiftCode from UserInfo Where UserID = '" + time.UserID + "'),(Select DeptCode from UserInfo Where UserID = '" + time.UserID + "'),Convert(DateTime,'" + time.StartDate + " " + time.StartTime + "',103),Convert(DateTime,'" + time.EndDate + " " + time.EndTime + "',103),'" + time.MealAllowance + "','" + time.CallBack + "','" + time.ReasonForUpdate + "','" + time.UpdateBy + "','" + time.OTException + "','" + time.OTAtStart + "','" + time.OTAtEnd + "', '"+time.ForceAddMealBreak+"'";
                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "AddAttendance", sSQL.Replace("'", "''"), 1001, time.UpdateBy);
                }
                catch (Exception ex) { }
                string strresult = connection.ExecuteInsertQuery(sSQL, time.Site);

                if (strresult != "Insert SuccessFull")
                {
                    return "Time and Attendence Entry Insertion Failed";
                }
                //WriteAudit(time, "After_Insert");
                result = "Time and Attendance Transaction has been added successfully!";

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "AddAttendance", sSQL.Replace("'", "''"), 3001, time.UpdateBy);
                }
                catch (Exception e) { }
                return "Error Occured while adding new entry: " + ex.Message;
            }

            return result;
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string UpdateTimeandAttendenceEntry_Makita([FromBody] TimeAndAttendence time)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;
            try
            {
                //checking for the Leave first
                sSQL = "Select ISNULL(Leave,'') From BundyClock Where ID = '" + time.ID + "'";

                if (conn.ReturnSingleValue(sSQL, time.Site).Equals("Y"))
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 2003, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    return "Please update this record through the LeaveDetails";
                }

                // Checking from the Assigned Leave Section

                sSQL = "select count(*) from Leave where LeaveCode like '%" + time.ReasonForUpdate + "%' or LeaveDesc like '%" + time.ReasonForUpdate + "%'";

                if (int.Parse(conn.ReturnSingleValue(sSQL, time.Site)) > 0)
                {
                    try
                    {
                        Logging.WriteLog(time.Site, "Warning", "TimeAndAttendence", "GetAllTimeandAttendenceEntries", sSQL.Replace("'", "''"), 2003, time.UpdateBy);
                    }
                    catch (Exception ex) { }
                    return "Leave must be assigned from UserDetails window";
                }

                string StartDateTime = time.StartDate + " " + time.StartTime;
                string EndDateTime = time.EndDate + " " + time.EndTime;


                if (!(time.OTAtStart.Equals("Y")))
                {
                    time.OTAtStart = "";
                }

                if (!(time.OTAtEnd.Equals("Y")))
                {
                    time.OTAtEnd = "";
                }

                if (!(time.OTException.Equals("Y")))
                {
                    time.OTException = "";
                }
                if (!(time.AfternoonAllowance.Equals("Y")))
                {
                    time.AfternoonAllowance = "";
                }
                if (!(time.ForceAddMealBreak.Equals("Y")))
                {
                    time.ForceAddMealBreak = "";
                }

                // Check for  Manual Add Break

                if (time.ForceAddMealBreak.Equals("Y"))


                {


                    sSQL = "select ManualLongBreakStart from TimeInfoByUser where UserID  = '" + time.UserID + "' " +
                           "and CONVERT(date, StartDate, 103) = Convert(Date,'" + time.StartDate + "',103) and ManualLongBreakStart = '00:00'";


                    if (conn.ReturnSingleValue(sSQL, time.Site).Equals("00:00"))
                    {
                        return "User has scanned for long break already. Please Uncheck Add Break CheckBox.";
                    }

                }

                //Check for NO OT and OT at the same time 
                if (time.OTException.Equals("Y"))
                {
                    if ((time.OTAtStart.Equals("Y")) || (time.OTAtEnd.Equals("Y")))
                    {
                        return "User can either be given No OverTime OR All Overtime as per decided rules - not both together!";
                    }
                }

                //string UpdateByName = conn.ReturnSingleValue("Select FirstName+' '+ Surname from UserInfo where UserID = '" + time.UpdateBy + "' ", time.Site);
                WriteAudit_Makita(time, "Before_Update");

                sSQL = "Update BundyClock Set  StartDateTime = Convert(DateTime,'" + StartDateTime + "',103), EndDateTime = Convert(DateTime,'" + EndDateTime + "',103), MealAllowance = '" + time.MealAllowance + "', CalledBack = '" + time.CallBack + "',"
                       + "ReasonForUpdate = '" + time.ReasonForUpdate + "', UpdateBy = '" + time.UpdateBy + "', EditDate = GetDate(), OvertimeException = '" + time.OTException + "' ,AllowOTatStart = '" + time.OTAtStart + "', AllowOTatEnd = '" + time.OTAtEnd + "', AfternoonAllowance = '"+time.AfternoonAllowance+"', ForceAddMealBreak = '"+time.ForceAddMealBreak+"' Where ID = " + time.ID + " And UserID = '" + time.UserID + "'";

                try
                {
                    Logging.WriteLog(time.Site, "Info", "TimeAndAttendence", "UpdateTimeandAttendenceEntry", sSQL.Replace("'", "''"), 1003, time.UpdateBy);
                }
                catch (Exception ex) { }

                string strresult = conn.ExecuteUpdateQuery(sSQL, time.Site);

                if (strresult != "Update SuccessFull")
                {
                    return "Time and Attendence Entry Update Failed";
                }
                WriteAudit_Makita(time, "After_Update");
                result = "Time and Attendence Entry Updated";
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "TimeAndAttendence", "UpdateTimeandAttendenceEntry", sSQL.Replace("'", "''"), 3003, time.UpdateBy);
                }
                catch (Exception e)
                {

                }
                return "Error Occurred while updating" + ex.Message;
            }

            return result;
        }

        // Makita // Write Audit

        private void WriteAudit_Makita(TimeAndAttendence user, string BeforeAfter)
        {
            Connection conn = new Connection();
            string sSql_Audit = "";
            try
            {

                sSql_Audit = " INSERT INTO BundyClock_Audit (UserID, ShiftCode,DeptCode,StartDateTime,EndDateTime,MealAllowance,ReasonForUpdate,UpdateBy " +
          " , AddDate, CalledBack,OverTimeException,Leave,Approve,Decline,AllowOTatStart,AllowOTatEnd,ForceAddMealBreak, AfternoonAllowance,BeforeAfter,UpdatedBy_Audit) " +
            " SELECT UserID, ShiftCode,DeptCode,StartDateTime,EndDateTime,MealAllowance,ReasonForUpdate,UpdateBy " +
             " , GETDATE(), CalledBack,OverTimeException,Leave,Approve,Decline,AllowOTatStart,AllowOTatEnd, ForceAddMealBreak, AfternoonAllowance " +
           " ,'" + BeforeAfter + "','" + user.UpdateBy + "'" +
             " FROM BundyClock " +
          " WHERE ID = '" + user.ID + "' ";

                string result = conn.ExecuteInsertQuery(sSql_Audit, user.Site);

            }
            catch (Exception ex)
            {


            }
        }

    }
}
