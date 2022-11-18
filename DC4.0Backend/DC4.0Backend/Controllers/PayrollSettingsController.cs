using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Web.Http;
using DC4._0Backend.Models;

namespace DC4._0Backend.Controllers
{
    public class PayrollSettingsController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetPayrollSettings([FromBody] PermanentPayrollSettings ps)
        {
            string sSQL = string.Empty;

            List<PermanentPayrollSettings> permanentPaySettings = new List<PermanentPayrollSettings>();
            Connection conn = new Connection();

            try
            {
                sSQL = "Select ID, ShiftType,DayInt, NameOfDay, Weekend, SingleTime, TimeAH, DoubleTime,DoubleTimeAH,HoursBeforeLunch, EmpType " +
                    " From PayrollSettings Order by EmpType, ShiftType,DayInt ";

                try
                {
                    Logging.WriteLog(ps.Site, "Info", "PayrollSettings", "GetPayrollSettings", sSQL.Replace("'", "''"), 1002, ps.DCMUser);
                }
                catch (Exception ex) { }


                DataSet ds = conn.ExecuteSelectQuery(sSQL, ps.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {


                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        PermanentPayrollSettings obj = new PermanentPayrollSettings();
                        obj.ID = ds.Tables[0].Rows[i]["ID"].ToString();
                        obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                        obj.NameOfDay = ds.Tables[0].Rows[i]["NameOfDay"].ToString();
                        obj.Weekend = ds.Tables[0].Rows[i]["Weekend"].ToString();
                        obj.SingleTime = ds.Tables[0].Rows[i]["SingleTime"].ToString();
                        obj.TimeAH = ds.Tables[0].Rows[i]["TimeAH"].ToString();
                        obj.DoubleTime = ds.Tables[0].Rows[i]["DoubleTime"].ToString();
                        obj.DoubleTimeAH = ds.Tables[0].Rows[i]["DoubleTimeAH"].ToString();
                        obj.HoursBeforeLunch = ds.Tables[0].Rows[i]["HoursBeforeLunch"].ToString();
                        obj.EmpType = ds.Tables[0].Rows[i]["EmpType"].ToString();

                        permanentPaySettings.Add(obj);

                    }
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(ps.Site, "Error", "PayrollSettings", "GetPayrollSettings", sSQL.Replace("'", "''"), 2002, ps.DCMUser);
                }
                catch (Exception x) { }

                return "Error Occured:While Fetching the Permanent Payroll Settings";
            }
            return JsonSerializer.Serialize(permanentPaySettings);
        }

        [AcceptVerbs("GET","POST")]
        [HttpPost]
        public string UpdatePayrollSettings([FromBody] PermanentPayrollSettings ps)
        {
            string sSQL = string.Empty;
            
            Connection conn = new Connection();
            try
            {
                // check for duplicates
                sSQL = "Select count(*) from PayrollSettings where ShiftType='" + ps.ShiftType + "' And NameOfDay='" + ps.NameOfDay + "' And EmpType='" + ps.EmpType  +"' and ID <> " + ps.ID ;
                int sSQL_Count = int.Parse(conn.ReturnSingleValue(sSQL, ps.Site));

                if (sSQL_Count > 0)
                {
                    try
                    {
                        Logging.WriteLog(ps.Site, "Warning", "PayrollSettings", "UpdatePayrollSettings", sSQL.Replace("'", "''"), 2008, ps.DCMUser);
                    }
                    catch (Exception ex) { }

                    return "Duplicate Records found with Shift Type and Day";
                }
                else
                {
                    sSQL = "Update PayrollSettings Set  DayInt=Case when NameOfDay= 'Saturday'  then 0 When NameOfDay='Sunday' then 1 when NameOfDay='Monday' then 2 when NameOfDay='Tuesday' then 3  " +
                        " when NameOfDay='Wednesday' then 4 when NameOfDay='Thursday' then 5 when NameOfDay='Friday' then 6 end, " +
                        "ShiftType='" + ps.ShiftType + "',  NameOfDay='" + ps.NameOfDay + "', Weekend='" + ps.Weekend + "', SingleTime='" + ps.SingleTime + "', TimeAH='" + ps.TimeAH + "', " +
                        " DoubleTime='" + ps.DoubleTime + "', DoubleTimeAH='" + ps.DoubleTimeAH + "', EmpType='"+ps.EmpType+ "', HoursBeforeLunch='" + ps.HoursBeforeLunch + "' Where ID=" + ps.ID ;

                    try
                    {
                        Logging.WriteLog(ps.Site, "Info", "PayrollSettings", "UpdatePayrollSettings", sSQL.Replace("'", "''"), 1003, ps.DCMUser);
                    }
                    catch (Exception ex) { }

                    string result = conn.ExecuteUpdateQuery(sSQL, ps.Site);

                    if (result != "Update SuccessFull")
                    {
                        return "Error while Updating the Payroll Settings Entry";
                    }
                }



            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(ps.Site, "Error", "PayrollSettings", "UpdatePayrollSettings", sSQL.Replace("'", "''"), 3003, ps.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Updating the Payroll Settings Entry";
            }
            return "Payroll Settings Entry Updated";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AddPayrollSettings([FromBody] PermanentPayrollSettings ps)
        {
            string sSQL = string.Empty;

            Connection conn = new Connection();
            try
            {
                // check for duplicates
                sSQL = "Select count(*) from PayrollSettings where ShiftType='" + ps.ShiftType + "'  And NameOfDay='" + ps.NameOfDay + "' And EmpType='" + ps.EmpType + "'";
                int sSQL_Count = int.Parse(conn.ReturnSingleValue(sSQL, ps.Site));

                if (sSQL_Count > 0)
                {
                    try
                    {
                        Logging.WriteLog(ps.Site, "Warning", "PayrollSettings", "AddPayrollSettings", sSQL.Replace("'", "''"), 2008, ps.DCMUser);
                    }
                    catch (Exception ex) { }

                    return "Duplicate Records found with Shift Type and Day";
                }
                else
                {
                    sSQL = "insert into PayrollSettings(ShiftType, DayInt, NameOfDay, Weekend, SingleTime, TimeAH, DoubleTime,DoubleTimeAH,HoursBeforeLunch,EmpType) " +
                        " (Select '" + ps.ShiftType + "', case '" + ps.NameOfDay + "' when 'Saturday'  then 0 When 'Sunday' then 1 when 'Monday' then 2 when 'Tuesday' then 3  " +
                        " when 'Wednesday' then 4 when 'Thursday' then 5 when 'Friday' then 6 end, " +
                        " '" + ps.NameOfDay + "',  '" + ps.Weekend + "', '" + ps.SingleTime + "', '" + ps.TimeAH + "', '" + ps.DoubleTime + "', '" + ps.DoubleTimeAH + "', '" + ps.HoursBeforeLunch  + "','" + ps.EmpType + "')";

                    try
                    {
                        Logging.WriteLog(ps.Site, "Info", "PayrollSettings", "UpdatePayrollSettings", sSQL.Replace("'", "''"), 1001, ps.DCMUser);
                    }
                    catch (Exception ex) { }

                    string result = conn.ExecuteInsertQuery(sSQL, ps.Site);

                    if (result != "Insert SuccessFull")
                    {
                        return "Error while Inserting the Payroll Settings Entry";
                    }
                }

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(ps.Site, "Error", "PayrollSettings", "UpdatePayrollSettings", sSQL.Replace("'", "''"), 3001, ps.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Updating the Payroll Settings Entry";
            }
            return "New Payroll Settings Added";
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeletePayrollSettings([FromBody] PermanentPayrollSettings ps)
        {
            string sSQL = string.Empty;

            Connection conn = new Connection();
            try
            {

                sSQL = "delete from PayrollSettings WHERE ID = " + ps.ID;

                try
                {
                    Logging.WriteLog(ps.Site, "Info", "PayrollSettings", "DeletePayrollSettings", sSQL.Replace("'", "''"), 1007, ps.DCMUser);
                }
                catch (Exception ex) { }

                string result = conn.ExecuteDeleteQuery(sSQL, ps.Site);

                if (result != "Delete SuccessFull")
                {
                    return "Error while Deleting the Payroll Settings Entry";
                }

                return "Payroll Settings Deleted";

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(ps.Site, "Error", "PayrollSettings", "DeletePayrollSettings", sSQL.Replace("'", "''"), 3007, ps.DCMUser);
                }
                catch (Exception e ) { }

                return "Error while Updating the Payroll Settings Entry";
            }
            
        }

    }
}
