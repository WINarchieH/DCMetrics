using DC4._0Backend.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Web.Http;

namespace DC4._0Backend.Controllers
{
    public class TimeInfoByUserController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllEntries([FromBody] UserTimeInformation usertime)
        {

            string sSQL = String.Empty;

            sSQL = " Select UserID, FirstName 'FirstName',Surname,Convert(char(10),ManualStartDate,103)'StartDate', Convert(char(10),ManualEndDate,103)'EndDate',ManualUserClockInTime 'StartTime',ManualUserClockOutTime 'EndTime',ManualShortBreakStart 'ShortBreakStart'," +
                "IsNull(ShortBreakEnd,0)'ShortBreakEnd',IsNull(ShortBreakTime,0) 'ShortBreak',ManualLongBreakStart 'LongBreakStart',IsNull(LongBreakEnd,0)'LongBreakEnd',IsNull(LongBreakTime, 0) 'LongBreak',IsNull(ManualOvertimeStart,'') 'OtherBreakStart', " +
                "IsNull(OtherBreakEnd,0)'OtherBreakEnd',IsNull(OtherBreakTime,0) 'OtherBreak',IsNull(Allowance,'') 'Allowance' From TimeInfoByUser WHERE Convert(datetime, TimeInfoByUser.StartDate, 103) Between Convert(datetime, '" + usertime.StartDate + "', 103)  AND Convert(datetime, '" + usertime.EndDate + "', 103) ";

            Connection connection = new Connection();

            List<UserTimeInformation> entryList = new List<UserTimeInformation>();
            try
            {
                try
                {
                    Logging.WriteLog(usertime.Site, "Info", "TimeInfoByUser", "GetAllEntries", sSQL.Replace("'", "''"), 1002, usertime.DCMUser);
                }
                catch (Exception ex){}

                DataSet ds = connection.ExecuteSelectQuery(sSQL, usertime.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {


                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        UserTimeInformation obj = new UserTimeInformation();
                        obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                        obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                        obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                        obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                        obj.EndDate = ds.Tables[0].Rows[i]["EndDate"].ToString();
                        obj.StartTime = ds.Tables[0].Rows[i]["StartTime"].ToString();
                        obj.EndTime = ds.Tables[0].Rows[i]["EndTime"].ToString();
                        obj.ShortBreakStart = ds.Tables[0].Rows[i]["ShortBreakStart"].ToString();
                        obj.ShortBreakEnd = ds.Tables[0].Rows[i]["ShortBreakEnd"].ToString();
                        obj.ShortBreak = ds.Tables[0].Rows[i]["ShortBreak"].ToString();
                        obj.LongBreakStart = ds.Tables[0].Rows[i]["LongBreakStart"].ToString();
                        obj.LongBreakEnd = ds.Tables[0].Rows[i]["LongBreakEnd"].ToString();
                        obj.LongBreak = ds.Tables[0].Rows[i]["LongBreak"].ToString();
                        obj.OtherBreakStart = ds.Tables[0].Rows[i]["OtherBreakStart"].ToString();
                        obj.OtherBreakEnd = ds.Tables[0].Rows[i]["OtherBreakEnd"].ToString();
                        obj.OtherBreak = ds.Tables[0].Rows[i]["OtherBreak"].ToString();
                        obj.Allowance = ds.Tables[0].Rows[i]["Allowance"].ToString();

                        entryList.Add(obj);

                    }

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(usertime.Site, "Error", "TimeInfoByUser", "GetAllEntries", sSQL.Replace("'", "''"), 3002, usertime.DCMUser);
                }
                catch (Exception e ) { }
                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(entryList);

        }
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateUserTimeEntry([FromBody] UserTimeInformation user)
        {

            string sSQL = String.Empty;
            string result = string.Empty;
            Connection conn = new Connection();

            // checking the Payroll Locking 
            // sSQL = "select count(*) from PayrollLocking where LockedDate = CONVERT(date, '" + user.StartDate + "',103)";
            try
            {
                //int count = int.Parse(conn.ReturnSingleValue(sSQL, user.Site));

                //if (count > 0)
                //{
                //    return "Changes are locked by payroll for this date. Please contact payroll supervisor.";
                //}
                //else
                //{

                sSQL = "Update TimeInfoByUser Set ManualUserClockInTime = '" + user.StartTime + "',ManualUserClockOutTime = '" + user.EndTime + "',ManualShortBreakStart = '" + user.ShortBreakStart + "',ShortBreakEnd = '" + user.ShortBreakEnd + "',ManualLongBreakStart = '" + user.LongBreakStart + "',LongBreakEnd = '" + user.LongBreakEnd + "',ManualOvertimeStart = '" + user.OtherBreakStart + "',OtherBreakEnd = '" + user.OtherBreakEnd + "',ShortBreakTime = DateDiff(minute,'" + user.ShortBreakStart + "','" + user.ShortBreakEnd + "'),LongBreakTime = DateDiff(minute,'" + user.LongBreakStart + "','" + user.LongBreakEnd + "'), " +
                       "OtherBreakTime = DateDiff(minute,'" + user.OtherBreakStart + "','" + user.OtherBreakEnd + "'),ManualEndDate = '" + user.EndDate + "',Allowance = '" + user.Allowance + "' Where UserID = '" + user.UserID + "' And Convert(DateTime,StartDate,103) = Convert(DateTime,'" + user.StartDate + "',103)";
                // Wrtring the entry into TimeInfoByUser Audit Table
                WriteAudit(user, "BEFORE");

                try
                {
                    Logging.WriteLog(user.Site, "Info", "TimeInfoByUser", "UpdateUserTimeEntry", sSQL.Replace("'", "''"), 1003, user.DCMUser);
                }
                catch (Exception ex) { }

                //Execcuting the update Query
                string strresult = conn.ExecuteUpdateQuery(sSQL, user.Site);

                if (strresult != "Update SuccessFull")
                {
                    return "User Time Entry Update Failed";
                }
                    // Wrtring the entry into TimeInfoByUser Audit Table
                    WriteAudit(user, "AFTER");
                    result = "User Time Entry Updated";
                
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "TimeInfoByUser", "GetAllEntries", sSQL.Replace("'", "''"), 3003, user.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured:While Fetching the List:" + ex.Message;

            }

            return result;

        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string CreateRoster([FromBody] UserTimeInformation user)
        {
            string sSQL = "";
           Connection conn = new Connection();
            
            try
            {
                
                sSQL = "EXEC spCreateTimeInfoByUserRecords @sStartDate='" + user.StartDate + "', @sEndDate='" + user.EndDate + "', @sUserID='" + user.UserID + "'";
                try
                {
                    Logging.WriteLog(user.Site, "Info", "TimeInfoByUser", "CreateRoster", sSQL.Replace("'", "''"), 1005, user.DCMUser);
                }
                catch (Exception e) { }
                
                conn.ReturnCompleteDataSet(sSQL, user.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "TimeInfoByUser", "CreateRoster", sSQL.Replace("'", "''"), 3005, user.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured while creating the Roster for the user:" + ex.Message;
            }

            return "Roster created for the User";
        }


        private void WriteAudit(UserTimeInformation user, string BeforeAfter)
        {
            Connection conn = new Connection();
            string sSql_Audit = "";
            try
            {
                

                 sSql_Audit = "";
                sSql_Audit += " INSERT INTO Timeinfobyuser_Audit (UserID, SurName,FirstName,StartDate,ManualEndDate,ManualUserClockInTime,ManualUserClockOutTime ";
                sSql_Audit += " ,ManualShortBreakStart,ShortBreakEnd,ManualLongBreakStart,LongBreakEnd,ManualOvertimeStart,OtherBreakEnd ";
                sSql_Audit += " ,ShortBreakTime,LongBreakTime,OtherBreakTime,Allowance,AddDate,BeforeAfter,UpdatedBy)";
                sSql_Audit += " SELECT UserID, SurName,FirstName,StartDate,ManualEndDate,ManualUserClockInTime,ManualUserClockOutTime ";
                sSql_Audit += " ,ManualShortBreakStart,ShortBreakEnd,ManualLongBreakStart,LongBreakEnd,ManualOvertimeStart,OtherBreakEnd ";
                sSql_Audit += " ,ShortBreakTime,LongBreakTime,OtherBreakTime,Allowance,GETDATE() ";
                sSql_Audit += " ,'" + BeforeAfter + "','" + user.UpdatedBy + "'";
                sSql_Audit += " FROM Timeinfobyuser ";
                sSql_Audit += " WHERE UserID = '" + user.UserID + "' AND Convert(DateTime,StartDate,103) = Convert(DateTime,'" + user.StartDate + "',103)";

             string result =   conn.ExecuteInsertQuery(sSql_Audit, user.Site);

            }
            catch (Exception ex)
            {


            }
        }
    }
}
