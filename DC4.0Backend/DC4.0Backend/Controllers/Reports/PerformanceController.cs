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
    public class PerformanceController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetPerformanceReport([FromBody] Performance  perf)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[perf.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spLMReport001", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<Performance> reports = new List<Performance>();
            string parmvalue = perf.FromDate + perf.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.SelectCommand.CommandTimeout = 150;
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();


            try
            {
                Logging.WriteLog(perf.Site, "Info", "PerformanceReport", "GetPerformanceReport", "spLMReport001", 1002, perf.DCMUser);
            }
            catch (Exception ex)
            { }
           

            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    Performance obj = new Performance();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["ActivityName"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["ShiftType"].ToString();

                    // Start Time
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDateTime"].ToString();
                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.StartTime = date.ToString("hh:mm tt");
                    //End Date Time
                    obj.EndDateTime = ds.Tables[0].Rows[i]["EndDateTime"].ToString();
                    DateTime enddate = DateTime.Parse(obj.EndDateTime);
                    obj.EndTime = enddate.ToString("hh:mm tt");

                    obj.TotalEstimatedTime = ds.Tables[0].Rows[i]["TotalEstimatedTime"].ToString();
                    obj.TotalActualTime = ds.Tables[0].Rows[i]["TotalActualTime"].ToString();
                    obj.PerformancePercantage = ds.Tables[0].Rows[i]["Performance"].ToString();
                    obj.Agency = ds.Tables[0].Rows[i]["Agency"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();

                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {
                Logging.WriteLog(perf.Site, "Error", "PerformanceReport", "GetPerformanceReport", "spLMReport001", 3002, perf.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }
    }
}
