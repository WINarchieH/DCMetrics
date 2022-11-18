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

namespace DC4._0Backend.Controllers.Reports
{
    public class CustomUserReportController : ApiController
    {


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetReport([FromBody] customUserReport  custom)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[custom.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTime_Roster_Discrepancies", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<customUserReport> reports = new List<customUserReport>();
            string parmvalue = custom.FromDate + custom.ToDate;
            
            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(custom.Site, "Info", "CasualReverseBilling", "GetReport", "spTime_Roster_Discrepancies", 1002, custom.DCMUser);
            }
            catch (Exception ex)
            { }

            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;

                for (int i = 0; i < count; i++)
                {
                    customUserReport obj = new customUserReport();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.SurName;

                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");

                    obj.StartTime = ds.Tables[0].Rows[i]["LogOn"].ToString();
                    obj.EndTime = ds.Tables[0].Rows[i]["LogOff"].ToString();

                    obj.RosterStart = ds.Tables[0].Rows[i]["RosterStart"].ToString();
                    obj.RosterEnd = ds.Tables[0].Rows[i]["RosterEnd"].ToString();
                    obj.AllowOTatStart = ds.Tables[0].Rows[i]["AllowOTatStart"].ToString();
                     obj.AllowOTatEnd = ds.Tables[0].Rows[i]["AllowOTatEnd"].ToString();
                    obj.Diff = ds.Tables[0].Rows[i]["diff"].ToString();
                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(custom.Site, "Error", "CasualReverseBilling", "GetReport", "spTime_Roster_Discrepancies", 3002, custom.DCMUser);
                return "Error while Fetching the custom User report";
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }
    }
}
