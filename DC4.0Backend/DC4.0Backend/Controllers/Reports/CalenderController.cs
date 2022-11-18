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
using DC4._0Backend.Models;

namespace DC4._0Backend.Controllers.Reports
{
    public class CalenderController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCalenderReport([FromBody] Calender cal)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[cal.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spLeaveCalendar", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<Calender> reports = new List<Calender>();
            string parmvalue = cal.FromDate + cal.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                Logging.WriteLog(cal.Site, "Info", "TimeSheet", "GetCalenderReport", "spLeaveCalendar", 1002, cal.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    Calender obj = new Calender();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.EmployeeName = ds.Tables[0].Rows[i]["UserName"].ToString();
                  
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                
                    obj.Date = ds.Tables[0].Rows[i]["Date"].ToString();


                    DateTime date = DateTime.Parse(obj.Date);
                    obj.Date = date.ToString("dd/MM/yyyy");

                    obj.LeaveType = ds.Tables[0].Rows[i]["LeaveType"].ToString();
                    obj.StartTime = ds.Tables[0].Rows[i]["StartTime"].ToString();
                    obj.EndTime = ds.Tables[0].Rows[i]["EndTime"].ToString();
                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(cal.Site, "Error", "TimeSheet", "GetCalenderReport", "spLeaveCalendar", 3002, cal.DCMUser);
            }
            return JsonSerializer.Serialize(reports);
        }

    }
}