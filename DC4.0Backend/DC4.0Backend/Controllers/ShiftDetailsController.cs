using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Web.Http;
using DC4._0Backend.Models;
using Newtonsoft.Json;

namespace DC4._0Backend.Controllers
{
    public class ShiftDetailsController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllShifts([FromBody] Shift shift)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
            List<Shift> shifts = new List<Shift>();
            DataSet ds = null;
            try
            {
                sSQL = "Select ShiftCode, AutoClockInTimeMonday 'MondayClockIn',AutoClockOutTimeMonday 'MondayClockOut',AutoClockInTimeTuesday 'TuesdayClockIn',AutoClockOutTimeTuesday 'TuesdayClockOut',AutoClockInTimeWednesday 'WednesdayClockIn', AutoClockOutTimeWednesday 'WednesdayClockOut',AutoClockInTimeThursday 'ThursdayClockIn',AutoClockOutTimeThursday 'ThursdayClockOut',AutoClockInTimeFriday 'FridayClockIn',AutoClockOutTimeFriday 'FridayClockOut',"
                    + "AutoClockInTimeSaturday as 'SaturdayClockIn', AutoClockOutTimeSaturday 'SaturdayClockOut',AutoClockInTimeSunday 'SundayClockIn',AutoClockOutTimeSunday 'SundayClockOut',IsNull(ShortBreakTime,0) 'ShortBreak',IsNull(LongBreakTime,0) 'LongBreak',IsNull(OtherBreakTime,0) 'OtherBreak', ShortBreakStartTime 'ShortBreakStart',IsNull(ShortBreakEnd,'00:00')'ShortBreakEnd',LongBreakStartTime 'LongBreakStart',LongBreakEnd,OtherBreakStartTime 'OtherBreakStart', "
                    + "OtherBreakEnd,StartTolerance,EndTolerance,BreakTolerance,ShiftType,ISNull(StartOvertime,0)'StartOverTime',IsNull(EndOvertime,0)'EndOverTime',IsNull(WeekStart,0)'WeekStart',IsNull(WeekendHours,0)'WeekendHours' from ShiftCode Where 1=1";


                try
                {
                    Logging.WriteLog(shift.Site, "Info", "ShiftDetails", "GetAllShifts", sSQL.Replace("'", "''"), 1002, shift.DCMUser);
                }
                catch (Exception ex) { }

                ds = conn.ExecuteSelectQuery(sSQL, shift.Site);

                if (ds.Tables[0].Rows.Count > 0)

                {
                    foreach (DataRow r in ds.Tables[0].Rows)
                    {
                        Shift obj = new Shift();
                        obj.ShiftCode = r["ShiftCode"].ToString();
                        obj.MondayClockIn = r["MondayClockIn"].ToString();
                        obj.MondayClockOut = r["MondayClockOut"].ToString();
                        obj.TuesdayClockIn = r["TuesdayClockIn"].ToString();
                        obj.TuesdayClockOut = r["TuesdayClockOut"].ToString();
                        obj.WednesdayClockIn = r["WednesdayClockIn"].ToString();
                        obj.WednesdayClockOut = r["WednesdayClockOut"].ToString();
                        obj.ThursdayClockIn = r["ThursdayClockIn"].ToString();
                        obj.ThursdayClockOut = r["ThursdayClockOut"].ToString();
                        obj.FridayClockIn = r["FridayClockIn"].ToString();
                        obj.FridayClockOut = r["FridayClockOut"].ToString();
                        obj.SaturdayClockIn = r["SaturdayClockIn"].ToString();
                        obj.SaturdayClockOut = r["SaturdayClockOut"].ToString();
                        obj.SundayClockIn = r["SundayClockIn"].ToString();
                        obj.SundayClockOut = r["SundayClockOut"].ToString();

                        obj.ShortBreak = int.Parse(r["ShortBreak"].ToString());
                        obj.LongBreak = int.Parse(r["LongBreak"].ToString());
                        obj.OtherBreak = int.Parse(r["OtherBreak"].ToString());

                        obj.ShortBreakStart = r["ShortBreakStart"].ToString();
                        obj.ShortBreakEnd = r["ShortBreakEnd"].ToString();
                        obj.LongBreakStart = r["LongBreakStart"].ToString();
                        obj.LongBreakEnd = r["LongBreakEnd"].ToString();
                        obj.OtherBreakStart = r["OtherBreakStart"].ToString();
                        obj.OtherBreakEnd = r["OtherBreakEnd"].ToString();
                        obj.ShiftType = r["ShiftType"].ToString();
                        obj.StartTolerance = int.Parse(r["StartTolerance"].ToString());
                        obj.EndTolerance = int.Parse(r["EndTolerance"].ToString());
                        obj.BreakTolerance = int.Parse(r["BreakTolerance"].ToString());
                        obj.StartOverTime = int.Parse(r["StartOverTime"].ToString());
                        obj.EndOvertTime = int.Parse(r["EndOverTime"].ToString());
                        obj.WeekStart = r["WeekStart"].ToString();
                        obj.WeekendHours = int.Parse(r["WeekendHours"].ToString());

                        shifts.Add(obj);

                    }

                }




            }
            catch (Exception ex)
            {
                return "Unable to Fetch the Shift records";
            }

            return JsonConvert.SerializeObject(shifts);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AddNewShift([FromBody] Shift shift)
        {
            string sSQL = "Select Count(*) from ShiftCode Where ShiftCode = '" + shift.ShiftCode + "'";
            Connection conn = new Connection();
            string result = string.Empty;
            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, shift.Site));

                if (count == 0)
                {
                    sSQL = "INSERT INTO ShiftCode ([ShiftCode],[ShortBreakTime] ,[LongBreakTime],[OtherBreakTime],[ShortBreakStartTime],[ShortBreakEnd],[LongBreakStartTime],[LongBreakEnd],[OtherBreakStartTime]," +
                   "[OtherBreakEnd],[AutoClockInTimeMonday],[AutoClockOutTimeMonday],[AutoClockInTimeTuesday] ,[AutoClockOutTimeTuesday],[AutoClockInTimeWednesday] ,[AutoClockOutTimeWednesday],[AutoClockInTimeThursday],[AutoClockOutTimeThursday],[AutoClockInTimeFriday]  ,[AutoClockOutTimeFriday]," +
                   "[AutoClockInTimeSaturday],[AutoClockOutTimeSaturday] ,[AutoClockInTimeSunday],[AutoClockOutTimeSunday],[StartTolerance]  ,[EndTolerance] ,[BreakTolerance] ,[ShiftType],[StartOverTime] ,[EndOverTime] ,[WeekStart] ,[WeekendHours])" +
             "VALUES('" + shift.ShiftCode + "'," + shift.ShortBreak + "," + shift.LongBreak + "," + shift.OtherBreak + ",'" + shift.ShortBreakStart + "','" + shift.ShortBreakEnd + "','" + shift.LongBreakStart + "','" + shift.LongBreakEnd + "','" + shift.OtherBreakStart + "','" + shift.OtherBreakEnd + "'," +
             " '" + shift.MondayClockIn + "','" + shift.MondayClockOut + "','" + shift.TuesdayClockIn + "','" + shift.TuesdayClockOut + "','" + shift.WednesdayClockIn + "','" + shift.WednesdayClockOut + "','" + shift.ThursdayClockIn + "','" + shift.ThursdayClockOut + "','" + shift.FridayClockIn + "','" + shift.FridayClockOut + "','" + shift.SaturdayClockIn + "','" + shift.SaturdayClockOut + "','" + shift.SundayClockIn + "','" + shift.SundayClockOut + "'," +
             "" + shift.StartTolerance + "," + shift.EndTolerance + "," + shift.BreakTolerance + ",'" + shift.ShiftType + "'," + shift.StartOverTime + "," + shift.EndOvertTime + ",'" + shift.WeekStart + "'," + shift.WeekendHours + ")";

                    try
                    {
                        Logging.WriteLog(shift.Site, "Info", "ShiftDetails", "AddNewShift", sSQL.Replace("'", "''"), 1001, shift.DCMUser);
                    }
                    catch (Exception ex) { }

                string strresult =    conn.ExecuteInsertQuery(sSQL, shift.Site);
                    if (strresult != "Insert SuccessFull")
                    {
                        return "Shift Creation Failed";
                    }

                    // update Shift Break Times
                    sSQL = "Update ShiftCode Set ShortBreakTime = DateDiff(minute,ShortBreakStartTime,ShortBreakEnd),LongBreakTime = DateDiff(minute,LongBreakStartTime,LongBreakEnd),OtherBreakTime = DateDiff(minute,OtherBreakStartTime,OtherBreakEnd) From ShiftCode  Where ShiftCode = '" + shift.ShiftCode + "'";

                    try
                    {
                        Logging.WriteLog(shift.Site, "Info", "ShiftDetails", "AddNewShift", sSQL.Replace("'", "''"), 1003, shift.DCMUser);
                    }
                    catch (Exception ex) { }

                    conn.ReturnCompleteDataSet(sSQL, shift.Site);
                    result = "New Shift Created";
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(shift.Site, "Warning", "ShiftDetails", "AddNewShift", sSQL.Replace("'", "''"), 2008, shift.DCMUser);
                    }
                    catch (Exception ex) { }

                    return "Shift Already Exist";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(shift.Site, "Error", "ShiftDetails", "AddNewShift", sSQL.Replace("'", "''"), 3001, shift.DCMUser);
                }
                catch (Exception ee) { }
                return "Shift Creation Failed With Error:" + ex.Message;
            }

            return result;
        }




        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateShift([FromBody] Shift Shift)
        {
            string sSQL = "Update ShiftCode set ShortBreakStartTime = '" + Shift.ShortBreakStart + "',ShortBreakEnd = '" + Shift.ShortBreakEnd + "',LongBreakStartTime = '" + Shift.LongBreakStart + "',LongBreakEnd = '" + Shift.LongBreakEnd + "'," +
                "OtherBreakStartTime = '" + Shift.OtherBreakStart + "',OtherBreakEnd = '" + Shift.OtherBreakEnd + "',AutoClockInTimeMonday = '" + Shift.MondayClockIn + "',AutoClockOutTimeMonday = '" + Shift.MondayClockOut + "',AutoClockInTimeTuesday = '" + Shift.TuesdayClockIn + "'," +
                "AutoClockOutTimeTuesday = '" + Shift.TuesdayClockOut + "',AutoClockInTimeWednesday = '" + Shift.WednesdayClockIn + "',AutoClockOutTimeWednesday = '" + Shift.WednesdayClockOut + "',AutoClockInTimeThursday = '" + Shift.ThursdayClockIn + "',AutoClockOutTimeThursday = '" + Shift.ThursdayClockOut + "'," +
                "AutoClockInTimeFriday = '" + Shift.FridayClockIn + "',AutoClockOutTimeFriday = '" + Shift.FridayClockOut + "',AutoClockInTimeSaturday = '" + Shift.SaturdayClockIn + "',AutoClockOutTimeSaturday = '" + Shift.SaturdayClockOut + "',AutoClockInTimeSunday = '" + Shift.SundayClockIn + "',AutoClockOutTimeSunday = '" + Shift.SundayClockOut + "'," +
                "StartTolerance = '" + Shift.StartTolerance + "',EndTolerance = '" + Shift.EndTolerance + "',BreakTolerance = '" + Shift.BreakTolerance + "',StartOvertime = '" + Shift.StartOverTime + "',EndOvertime = '" + Shift.EndOvertTime + "',WeekStart = '" + Shift.WeekStart + "',WeekendHours = '" + Shift.WeekendHours + "' Where ShiftCode = '" + Shift.ShiftCode + "' And ShiftType = '" + Shift.ShiftType + "'";

            Connection conn = new Connection();
            string result = string.Empty;
            try
            {
                conn.ReturnCompleteDataSet(sSQL, Shift.Site);

                // update Shift Break Times
                sSQL = "Update ShiftCode Set ShortBreakTime = DateDiff(minute,ShortBreakStartTime,ShortBreakEnd),LongBreakTime = DateDiff(minute,LongBreakStartTime,LongBreakEnd),OtherBreakTime = DateDiff(minute,OtherBreakStartTime,OtherBreakEnd) From ShiftCode  Where ShiftCode = '" + Shift.ShiftCode + "'";

                try
                {
                    Logging.WriteLog(Shift.Site, "Info", "ShiftDetails", "AddNewShift", sSQL.Replace("'", "''"), 1003, Shift.DCMUser);
                }
                catch (Exception ex) { }

                string strresult = conn.ExecuteUpdateQuery(sSQL, Shift.Site);
                if (strresult != "Update SuccessFull")
                {
                    return "Shift Update Failed";
                }
                result = "Selected Shift Updated";

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(Shift.Site, "Error", "ShiftDetails", "AddNewShift", sSQL.Replace("'", "''"), 3003, Shift.DCMUser);
                }
                catch (Exception ee ) { }

                return "Shift Update Failed With Error:" + ex.Message;
            }

            return result;

        }




        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteShift([FromBody] Shift shift)
        {
            string sSQL = "select count(*) from userInfo where shiftcode = '" + shift.ShiftCode + "'";
            Connection conn = new Connection();
            string result = "";
            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, shift.Site));
                if (count > 0)
                {
                    try
                    {
                        Logging.WriteLog(shift.Site, "Warning", "ShiftDetails", "AddNewShift", sSQL.Replace("'", "''"), 3003, shift.DCMUser);
                    }
                    catch (Exception ee) { }

                    return "Shift Already assigned to Users.";
                }
                else
                {
                    sSQL = "Delete from ShiftCode Where ShiftCode = '" + shift.ShiftCode + "'";
                    string strresult = conn.ExecuteDeleteQuery(sSQL, shift.Site);
                    if (strresult != "Delete SuccessFull")
                    {
                        return "Shift Deletion Failed";
                    }
                    result = "Shift Deleted";
                }
            }
            catch (Exception ex)
            {
                return "Error while deleting the ShiftCode" + ex.Message;
            }

            return result;
        }
    }
}
