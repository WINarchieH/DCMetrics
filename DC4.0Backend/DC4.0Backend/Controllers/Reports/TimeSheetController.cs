using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.UI.WebControls;
using DC4._0Backend.Models;
using System.Text.Json;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Net.Mail;
using System.IO;
using DC4._0Backend.Models;
using System.Xml;


namespace DC4._0Backend.Controllers.Reports
{
    public class TimeSheetController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]

        public string GetTimesheetReport_BRI([FromBody] Timesheet timesheet)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[timesheet.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTimeSheetReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<Timesheet> reports = new List<Timesheet>();
            string parmvalue = timesheet.StartDate + timesheet.EndDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(timesheet.Site, "Info", "TimeSheet", "GetTimesheetReport", "spTimeSheetReport", 1002, timesheet.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    Timesheet obj = new Timesheet();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();


                    obj.StartDate = ds.Tables[0].Rows[i]["Date"].ToString();

                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");

                    obj.EndDate = ds.Tables[0].Rows[i]["Date"].ToString();

                    date = DateTime.Parse(obj.EndDate);
                    obj.EndDate = date.ToString("dd/MM/yyyy");

                    obj.StartTime = ds.Tables[0].Rows[i]["StartDateTime"].ToString();
                    obj.EndTime = ds.Tables[0].Rows[i]["EndDateTime"].ToString();

                  
                    
                    obj.BaseHourly = ds.Tables[0].Rows[i]["Base Hourly"].ToString();
                    obj.Overtime_1_4x = ds.Tables[0].Rows[i]["Overtime (1.4x)"].ToString();
                    obj.Overtime_1_8x = ds.Tables[0].Rows[i]["Overtime (1.8x)"].ToString();
                    obj.AllowOTATStart = ds.Tables[0].Rows[i]["AllowOTAtStart"].ToString();
                    obj.AllowOTATEnd = ds.Tables[0].Rows[i]["AllowOTAtEnd"].ToString();


                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.TotalHours = Convert.ToDouble(ds.Tables[0].Rows[i]["TotalHours"]);
                    obj.Level = ds.Tables[0].Rows[i]["Level"].ToString();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["EmployeeID"].ToString();


                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {
                Logging.WriteLog(timesheet.Site, "Error", "TimeSheet", "GetTimesheetReport", "spTimeSheet", 3002, timesheet.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetTimesheetReport([FromBody] Timesheet timesheet)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[timesheet.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTimeSheetReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<Timesheet> reports = new List<Timesheet>();
            string parmvalue = timesheet.StartDate + timesheet.EndDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(timesheet.Site, "Info", "TimeSheet", "GetTimesheetReport", "spTimeSheetReport", 1002, timesheet.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    Timesheet obj = new Timesheet();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();                    

                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();

                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");

                    obj.EndDate = ds.Tables[0].Rows[i]["EndDate"].ToString();

                    date = DateTime.Parse(obj.EndDate);
                    obj.EndDate = date.ToString("dd/MM/yyyy");

                    obj.StartTime = ds.Tables[0].Rows[i]["StartTime"].ToString();
                    obj.EndTime = ds.Tables[0].Rows[i]["EndTime"].ToString();

                    obj.HoursBeforeLunch =  Convert.ToDouble(ds.Tables[0].Rows[i]["HoursBeforeLunch"]);
                    obj.TotalHours = Convert.ToDouble(ds.Tables[0].Rows[i]["TotalHours"]);
                    obj.SingleTime = Convert.ToDouble(ds.Tables[0].Rows[i]["SingleTime"]);

                    obj.TimeAndHalfHrs = Convert.ToDouble(ds.Tables[0].Rows[i]["TimeAndHalfHrs"]);
                    obj.DoubleTime = Convert.ToDouble(ds.Tables[0].Rows[i]["DoubleTime"]);
                        obj.MealTime = Convert.ToDouble(ds.Tables[0].Rows[i]["MealTime"]);

                    obj.Comment = ds.Tables[0].Rows[i]["Comment"].ToString();
                    obj.Agency = ds.Tables[0].Rows[i]["Agency"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.LogOnTime = ds.Tables[0].Rows[i]["LogOn"].ToString();

                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {
                Logging.WriteLog(timesheet.Site, "Error", "TimeSheet", "GetTimesheetReport", "spTimeSheet", 3002, timesheet.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }
    }
}
