using System;
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
    public class DailyScanReportController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllTransactions([FromBody]DailyScanReport scan)
        {


            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[scan.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spDailyClockScansReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<DailyScanReport> reports = new List<DailyScanReport>();
            string parmvalue = scan.FromDate + scan.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(scan.Site, "Info", "DailyScanReport", "GetReport", "spDailyClockScansReport", 1002, scan.DCMUser);
            }
            catch (Exception ex)
            {

            }
            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    DailyScanReport obj = new DailyScanReport();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();

                    obj.FirstName = ds.Tables[0].Rows[i]["firstName"].ToString();
                    obj.SurName = ds.Tables[0].Rows[i]["SurName"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.SurName;
                    obj.ScannedTask = ds.Tables[0].Rows[i]["ScannedTask"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();


                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["StartDate"].ToString()))
                    {


                        obj.StartDate = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDate"].ToString()).ToString("dd/MM/yyyy");
                        obj.StartTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartTime"].ToString()).ToString("HH:mm:ss");
                   }

                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["EndDate"].ToString()))
                    {
                        obj.EndDate = Convert.ToDateTime(ds.Tables[0].Rows[i]["EndDate"].ToString()).ToString("dd/MM/yyyy");
                       
                        obj.EndTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["EndTime"].ToString()).ToString("HH:mm:ss");
                    }
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();

                    obj.ScannedType = ds.Tables[0].Rows[i]["ScanType"].ToString();

                    obj.Duration = ds.Tables[0].Rows[i]["Duration"].ToString();


                    reports.Add(obj);

                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(scan.Site, "Error", "DailyScanReport", "GetReport", "spDailyClockScansReport", 3002, scan.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);

        }

    }
}
