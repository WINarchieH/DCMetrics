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
    public class IdleReportController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetReport([FromBody] Idle idle)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[idle.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spIdleReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<Idle> reports = new List<Idle>();
            string parmvalue = idle.FromDate + idle.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                Logging.WriteLog(idle.Site, "Info", "TimeSheet", "GetCalenderReport", "spLeaveCalendar", 1002, idle.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    Idle obj = new Idle();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.EmployeeName = ds.Tables[0].Rows[i]["FirstName"].ToString() + " " + ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();

                     
                    DateTime date = DateTime.Parse(ds.Tables[0].Rows[i]["Date"].ToString());
                    obj.Date = date.ToString("dd/MM/yyyy");

                    obj.LogOnTime = ds.Tables[0].Rows[i]["LogOnTime"].ToString();
                    obj.FirstTask = ds.Tables[0].Rows[i]["FirstTask"].ToString();
                    obj.TaskStart = ds.Tables[0].Rows[i]["TaskStart"].ToString();
                    obj.TaskEnd = ds.Tables[0].Rows[i]["TaskEnd"].ToString();
                    obj.Status = ds.Tables[0].Rows[i]["Status"].ToString();
                    obj.TimeGap = ds.Tables[0].Rows[i]["TimeGap"].ToString();
                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(idle.Site, "Error", "TimeSheet", "GetCalenderReport", "spLeaveCalendar", 3002, idle.DCMUser);
            }
            return JsonSerializer.Serialize(reports);
        }
    }
}