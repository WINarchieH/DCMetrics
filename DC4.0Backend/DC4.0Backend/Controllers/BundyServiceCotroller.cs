using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DC4._0Backend.Models;
using System.Data;
using System.Text.Json;
using System.Globalization;
//using Newtonsoft.Json;


namespace DC4._0Backend.Controllers
{
    public class BundyServiceController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string DisplayActivity([FromBody]BundyService bundy)
        {


            string sSQL = String.Empty;
            sSQL = "Select Distinct(ActivityName) 'Activities' from AssignIndirectActivity WHERE ActivityName not Like '%- OOS' ";
            sSQL = sSQL + " AND UserID = '" + bundy.UserName + "'";
            Connection connection = new Connection();

            List<string> entryList = new List<string>();

            try
            {
                try
                {
                    Logging.WriteLog(bundy.Site, "Info", "BundyService", "DisplayActivity", sSQL.Replace("'", "''"), 1002, bundy.DCMUser);
                }
                catch (Exception ex)
                {

                }


                DataSet ds = connection.ExecuteSelectQuery(sSQL, bundy.Site);


                if (ds.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        BundyService obj = new BundyService();
                        entryList.Add(ds.Tables[0].Rows[i]["Activities"].ToString());
                    }
                }


            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(bundy.Site, "Error", "BundyService", "DisplayActivity", sSQL.Replace("'", "''"), 3002, bundy.DCMUser);
                }
                catch (Exception e)
                {

                }


                return ex.ToString();
            }

            String retVal = JsonSerializer.Serialize(entryList);
            return retVal;
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string PerformIndirectActivity([FromBody]BundyService bundy)
        {
            TimeSpan startTime = DateTime.Now.TimeOfDay;

            // Check if the user is currently doing this Activity
            string sSQL = String.Empty;
            sSQL = "Select count(*) from IndirectActivityDetails Where UserName = '" + bundy.UserName + "'";
            sSQL += " And TaskName = '" + bundy.Activity + "'";
            sSQL += " And StartDate = Convert(DateTime,Convert(Char(10),getdate(),103),103)";
            sSQL += " And (EndTime is null or EndTime = StartTime)";

            Connection connection = new Connection();


            try
            {
                try
                {
                    Logging.WriteLog(bundy.Site, "Info", "BundyService", "PerformIndirectActivity", sSQL.Replace("'", "''"), 1002, bundy.DCMUser);
                }
                catch (Exception ex)
                {

                }

                DataSet ds = connection.ExecuteSelectQuery(sSQL, bundy.Site);

                int count = int.Parse(connection.ReturnSingleValue(sSQL, bundy.Site).ToString());

                if (count > 0)
                {
                    string ErrMsg = "You are currently working on this Activity. Select different Activity.";
                    return ErrMsg;
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(bundy.Site, "Info", "BundyService", "PerformIndirectActivity", sSQL.Replace("'", "''"), 1003, bundy.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }

                    /*
                    '-------------------------------------------------------------------
                    'Update the EndTime for the Previous IndirectActivity of the same day.
                    'Only update where End Time is blank or same as StartTime, 
                    'selecting the last record inserted for the User.
                    */

                    sSQL = "Update IndirectActivityDetails Set ";
                    sSQL += "EndDate = (Select Convert(DateTime,Convert(Char(10),getdate(),103),103)),";
                    sSQL += "EndTime = Convert(Char(8),'" + startTime + "',103)";
                    sSQL += " Where StartDate = (Select Convert(DateTime,Convert(Char(10),getdate(),103),103))";
                    sSQL += " And (EndTime is null or EndTime = StartTime)";
                    sSQL += " And UserName = '" + bundy.UserName + "'";
                    sSQL += " And CONVERT(DateTime,(StartDate + ' ' + StartTime),103) = ";
                    sSQL += "(Select MAX(CONVERT(DateTime,(StartDate + ' ' + StartTime),103))From IndirectActivityDetails Where UserName = '" + bundy.UserName + "' )";

                    connection.ExecuteUpdateQuery(sSQL, bundy.Site);

                    //-------------------------------------------------------------------
                    //Insert Activity details
                    sSQL = "Insert Into IndirectActivityDetails ";
                    sSQL += "(TaskName,UserName,StartDate,StartTime,EndDate,EndTime,DownTime)";
                    sSQL += " Select '" + bundy.Activity + "','";
                    sSQL += bundy.UserName + "',";
                    sSQL += "(Select Convert(DateTime,Convert(Char(10),getdate(),103),103)),";
                    sSQL += "Convert(char(8),'" + startTime + "'),";
                    sSQL += "NULL,";
                    sSQL += "NULL,";
                    sSQL += "0";
                    connection.ExecuteUpdateQuery(sSQL, bundy.Site);
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(bundy.Site, "Error", "BundyService", "PerformIndirectActivity", sSQL.Replace("'", "''"), 3002, bundy.DCMUser);
                }
                catch (Exception e)
                {

                }


                return ex.ToString();
            }

            return "";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string LoginFromScan([FromBody]BundyService bundy)
        {
            try
            {
                string username = convertID(bundy);
                bundy.UserName = username;
                
                try
                {
                    string loginfo = CheckUser(bundy);
                    try
                    {
                        Dictionary<String, string> dictionary = new Dictionary<String, string>();
                        if(loginfo.Equals("User Logged On."))
                        {
                            dictionary.Add("output", "0" + username);
                        }
                        else if (loginfo.Equals("Option"))
                        {
                            dictionary.Add("output", "1" + username);
                        }
                        else if (loginfo.Contains("_"))
                        {
                            dictionary.Add("output", loginfo + "_" + username);
                        }
                        else
                        {
                            dictionary.Add("output", "failed");
                        }

                        String retVal = JsonSerializer.Serialize(dictionary);
                        return retVal;

                    }
                    catch (Exception e)
                    {
                        Logging.WriteLog(bundy.Site, "Error", "BundyService", "LoginFromScan", "Error may occur in If..ElseIf statement for Username: " + username + " and ID: " + bundy.ID, 3002, bundy.DCMUser);
                    }

                }
                catch (Exception ex)
                {
                    Logging.WriteLog(bundy.Site, "Error", "BundyService", "LoginFromScan", "Failed CheckUser for username: " + username, 3002, bundy.DCMUser);
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(bundy.Site, "Error", "BundyService", "LoginFromScan", "Error in ConvertID function for user: " + bundy.ID, 3002, bundy.DCMUser);
            }


            return "";
        }


        private string Logon(BundyService bundy)
        {
            string sSQL = String.Empty;
            sSQL = " ;WITH leaves AS ";
            sSQL += " (";
            sSQL += " select *,  convert(varchar, getdate(), 108)  as CurrentTime";
            sSQL += " from EmpLeaveDetails ";
            sSQL += " where UserID = '" + bundy.UserName + "' and convert(date, LeaveDate) =  convert(date,GETDATE() )";
            sSQL += " )";
            sSQL += " SELECT count(*) FROM leaves ";
            sSQL += " WHERE convert(datetime, LeaveDate + CurrentTime, 103)";
            sSQL += " between DATEADD(minute, -30, CONVERT(datetime, LeaveDate +' '+ StartTime, 103)) ";
            sSQL += " AND  DATEADD(minute, -30, CONVERT(datetime, LeaveDate +' '+ EndTime, 103))";

            Connection connection = new Connection();

            try
            {

                try
                {
                    Logging.WriteLog(bundy.Site, "Info", "BundyService", "Logon", sSQL.Replace("'", "''"), 1002, bundy.DCMUser);
                }
                catch (Exception e)
                {

                }

                int count = int.Parse(connection.ReturnSingleValue(sSQL, bundy.Site).ToString());
                if(count > 0)
                {
                    string sMsg = "Invalid User.";
                    return sMsg;
                }
                

                sSQL = "Insert Into BundyClock (UserID, DeptCode, ShiftCode, StartDateTime, EndDateTime)";
                sSQL += "Select '" + bundy.UserName + "',(Select DeptCode from UserInfo Where UserID = '" + bundy.UserName + "') ,(Select ShiftCode from UserInfo Where UserID = '" + bundy.UserName + "'),getdate(),NULL";

                try
                {
                    Logging.WriteLog(bundy.Site, "Info", "BundyService", "Logon", sSQL.Replace("'", "''"), 1001, bundy.DCMUser);
                }
                catch (Exception e)
                {

                }

                string strresult = connection.ExecuteInsertQuery(sSQL, bundy.Site);

                string sSQL_CheckPH = String.Empty;
                sSQL_CheckPH = "Select Count(*) From PublicHoliday ";
                sSQL_CheckPH += " Where Convert(DateTime,(Convert(Char(10),[Date],103)),103) = Convert(DateTime,Convert(Char(10),GetDate(),103),103)";

                try
                {
                    Logging.WriteLog(bundy.Site, "Info", "BundyService", "Logon", sSQL_CheckPH.Replace("'", "''"), 1002, bundy.DCMUser);
                }
                catch (Exception e)
                {

                }
                count = int.Parse(connection.ReturnSingleValue(sSQL_CheckPH, bundy.Site).ToString());

                if(count > 0)
                {
                    string sSQL_UpdatePH = String.Empty;
                    sSQL_UpdatePH = "Update BundyClock Set ReasonForUpdate = 'PH'";
                    sSQL_UpdatePH += " Where UserID = '" + bundy.UserName + "'";
                    sSQL_UpdatePH += " And Convert(DateTime,(Convert(Char(10),StartDatetime,103)),103) = Convert(DateTime,Convert(Char(10),GetDate(),103),103)";
                    try
                    {
                        Logging.WriteLog(bundy.Site, "Info", "BundyService", "Logon", sSQL_UpdatePH.Replace("'", "''"), 1003, bundy.DCMUser);
                    }
                    catch (Exception e)
                    {

                    }
                    connection.ExecuteUpdateQuery(sSQL_UpdatePH, bundy.Site);
                }

                /*
                 Changed by Gita on 10/01/2012
                 Auto assign employee to an indirect activity 
                 */
                sSQL = "Select COUNT(*) from AssignIndirectActivity Where UserID = '" + bundy.UserName + "'";
                sSQL += " And PermanentIndirectActivity like '%Y%'";


                try
                {
                    Logging.WriteLog(bundy.Site, "Info", "BundyService", "Logon", sSQL.Replace("'", "''"), 1002, bundy.DCMUser);
                }
                catch (Exception e)
                {

                }

                count = int.Parse(connection.ReturnSingleValue(sSQL, bundy.Site).ToString());


                if(count > 0)
                {
                    sSQL = "  Select ActivityName from AssignIndirectActivity Where UserID = '" + bundy.UserName + "'";
                    sSQL += "And PermanentIndirectActivity like '%Y%'";

                    try
                    {
                        Logging.WriteLog(bundy.Site, "Info", "BundyService", "Logon", sSQL.Replace("'", "''"), 1002, bundy.DCMUser);
                    }
                    catch (Exception e)
                    {
                        
                    }

                    string PermanentIndirectActivity = (connection.ReturnSingleValue(sSQL, bundy.Site).ToString());
                    bundy.Activity = PermanentIndirectActivity;

                    PerformIndirectActivity(bundy);

                    string sMsg = "_" + PermanentIndirectActivity;

                    return sMsg;

                }

                return "User Logged On.";

            }

            catch (Exception e)
            {

            }

            return "User Logged On.";

        }


        private string CheckUser(BundyService bundy)
        {
            string sSQL = String.Empty;
            sSQL = "Select Count(*) from UserInfo Where UserID = '" + bundy.UserName + "'";
            sSQL += " And Status = 'A' ";

            Connection connection = new Connection();

            try
            {
                try
                {
                    Logging.WriteLog(bundy.Site, "Info", "BundyService", "CheckUser", sSQL.Replace("'", "''"), 1002, bundy.DCMUser);

                }
                catch (Exception ex)
                {

                }

                int count = int.Parse(connection.ReturnSingleValue(sSQL, bundy.Site).ToString());

                if(count >0)
                {
                    try
                    {
                        sSQL = "Select count(*) From BundyClock";
                        sSQL += " Where UserID = '" + bundy.UserName + "'";

                        sSQL += " And Convert(DateTime,StartDateTime,103) in  ";

                        sSQL += "(Select max(StartDateTime) from BundyClock where UserID = '" + bundy.UserName + "'";

                        sSQL += " And CONVERT(DateTime,convert(char(10),StartDateTime,103),103)>=";
                        sSQL += " CONVERT(DateTime,convert(char(10),GETDATE()-1,103),103)";
                        sSQL += " And (EndDateTime is null or EndDateTime <= StartDateTime))";

                        count = int.Parse(connection.ReturnSingleValue(sSQL, bundy.Site).ToString());


                        if(!(count>0))
                        {
                            string sMsg = Logon(bundy);
                            return sMsg;
                        }
                        else
                        {
                            try
                            {
                                string currentTime = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss");
                                string hoursDiff = "99";


                                sSQL = ";WITH ShiftStart AS ";
                                sSQL += "( ";
                                sSQL += "Select max(StartDateTime) StartShiftTime ";
                                sSQL += " From BundyClock ";
                                sSQL += " Where UserID = '" + bundy.UserName + "'";
                                sSQL += " AND StartDateTime < GETDATE() ";
                                sSQL += " Group BY UserID";
                                sSQL += " ) ";
                                sSQL += "SELECT DATEDIFF(hh, ss.StartShiftTime, '" + currentTime + "')";
                                sSQL += "From ShiftStart ss";

                                try
                                {
                                    DataSet ds = connection.ExecuteSelectQuery(sSQL, bundy.Site);

                                    for(int i = 0; i < ds.Tables.Count; i++)
                                    {
                                        for (int j = 0; j < ds.Tables[i].Rows.Count; j++)
                                        {
                                            hoursDiff = ds.Tables[i].Rows[j][0].ToString();
                                        }
                                    }
                                }
                                catch (Exception e)
                                {
                                    Logging.WriteLog(bundy.Site, "Error", "BundyService", "CheckUser", "error calculating hours diff for user: " + bundy.UserName, 3002, bundy.DCMUser);
                                }

                                if(int.Parse(hoursDiff) > 14)
                                {
                                    Logging.WriteLog(bundy.Site, "Info", "BundyService", "CheckUser", "Process log on. Last shift start and now duration is " + hoursDiff, 1002, bundy.DCMUser);
                                    string sMsg = Logon(bundy);
                                    return sMsg;
                                }
                                else
                                {
                                    String sMsg = "Option";
                                    return sMsg;
                                }

                            }
                            catch (Exception e)
                            {

                            }
                        }
                        
                    }
                    catch (Exception e)
                    {
                        
                        Logging.WriteLog(bundy.Site, "Error", "BundyService", "CheckUser", "Error occured while processing user check for: " + bundy.UserName, 3002, bundy.DCMUser);
                        
                    }
                }
                else
                {
                    Logging.WriteLog(bundy.Site, "Warning", "BundyService", "CheckUser", "User (" + bundy.UserName + ") does not exist", 3002, bundy.DCMUser);

                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(bundy.Site, "Error", "BundyService", "CheckUser", "Error occured while processing user check for: " + bundy.UserName, 3002, bundy.DCMUser);
            }


            return "Invalid User.";
        }

        private string convertID(BundyService bundy)
        {
            string sSQL = String.Empty;
            sSQL = "Select UserName FROM BundyID where BundyID = '" + bundy.ID + "'";
            Connection connection = new Connection();

            try
            {
                try
                {
                    Logging.WriteLog(bundy.Site, "Info", "BundyService", "convertID", sSQL.Replace("'", "''"), 1003, bundy.DCMUser);
                }
                catch (Exception ex)
                {

                }

                string userName = (connection.ReturnSingleValue(sSQL, bundy.Site));

                if(userName == "")
                {
                    try
                    {
                        Logging.WriteLog(bundy.Site, "Warning", "BundyService", "convertID", sSQL.Replace("'", "''"), 2007, bundy.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }

                    return "ID Not Associated With a Valid User";
                }

                else
                {
                    return userName;
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(bundy.Site, "Error", "BundyService", "convertID", sSQL.Replace("'", "''"), 3002, bundy.DCMUser);
                }
                catch (Exception e)
                {

                }
                return ex.ToString();
            }
        }


        }
    }

