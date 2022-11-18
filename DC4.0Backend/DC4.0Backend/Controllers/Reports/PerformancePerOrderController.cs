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
    public class PerformancePerOrderController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetPerformancePerOrderReport([FromBody] PerformancePerOrder  perf)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[perf.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTimesAndPerformance_PerOrder_SSRS", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<PerformancePerOrder> reports = new List<PerformancePerOrder>();
            string parmvalue = perf.FromDate + perf.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.SelectCommand.CommandTimeout = 150;
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();


            try
            {
                Logging.WriteLog(perf.Site, "Info", "PerformancePerOrderReport", "GetPerformancePerOrderReport", "spTimesAndPerformance_PerOrder_SSRS", 1002, perf.DCMUser);
            }
            catch (Exception ex)
            { }
           

            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    PerformancePerOrder obj = new PerformancePerOrder();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.Employee = ds.Tables[0].Rows[i]["Employee"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                                                            

                    // Start Time
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDateTime"].ToString();
                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.StartTime = date.ToString("hh:mm tt");
                    //End Date Time
                    obj.EndDateTime = ds.Tables[0].Rows[i]["EndDateTime"].ToString();
                    DateTime enddate = DateTime.Parse(obj.EndDateTime);
                    obj.EndTime = enddate.ToString("hh:mm tt");

                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.OrderNumber = ds.Tables[0].Rows[i]["OrderNumber"].ToString();
                    obj.Quantity = ds.Tables[0].Rows[i]["Quantity"].ToString();

                    obj.EstimatedTime = ds.Tables[0].Rows[i]["EstimatedTime"].ToString();
                    obj.ActualTime = ds.Tables[0].Rows[i]["ActualTime"].ToString();
                    obj.TotalBreak = ds.Tables[0].Rows[i]["TotalBreak"].ToString();
                    obj.Performance = ds.Tables[0].Rows[i]["Performance"].ToString();
                    //obj.PerformancePercantage = ds.Tables[0].Rows[i]["Performance"].ToString();
                    obj.Agency = ds.Tables[0].Rows[i]["Agency"].ToString();

                    

                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {
                Logging.WriteLog(perf.Site, "Error", "PerformancePerOrderReport", "GetPerformancePerOrderReport", "spTimesAndPerformance_PerOrder_SSRS", 3002, perf.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }
    }
}
