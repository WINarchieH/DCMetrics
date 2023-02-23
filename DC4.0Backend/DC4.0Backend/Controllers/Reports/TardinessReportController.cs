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
    public class TardinessReportController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetReport([FromBody] Tardiness tardiness)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[tardiness.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTardinessReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<Tardiness> reports = new List<Tardiness>();
            string parmvalue = tardiness.FromDate + tardiness.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                Logging.WriteLog(tardiness.Site, "Info", "tardiness", "GetReport", "spTardinessReport", 1002, tardiness.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    Tardiness obj = new Tardiness();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FullName = ds.Tables[0].Rows[i]["FirstName"].ToString() + " " + ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.Comment = ds.Tables[0].Rows[i]["Comment"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();

                    DateTime date = DateTime.Parse(ds.Tables[0].Rows[i]["Date"].ToString());
                    obj.StartDate = date.ToString("dd/MM/yyyy");

                    obj.ScanType = ds.Tables[0].Rows[i]["ScanType"].ToString();
                    obj.ActualStart = ds.Tables[0].Rows[i]["ActualStart"].ToString();
                    obj.ExpectedStart = ds.Tables[0].Rows[i]["ExpectedStart"].ToString();
                    obj.ActualEnd = ds.Tables[0].Rows[i]["ActualEnd"].ToString();
                    obj.ExpectedEnd = ds.Tables[0].Rows[i]["ExpectedEnd"].ToString();
                    obj.duration = Convert.ToInt16(ds.Tables[0].Rows[i]["TotalDuration"]);
                    obj.totalLosttime = Convert.ToInt16(ds.Tables[0].Rows[i]["StartLostTime"]) + Convert.ToInt16(ds.Tables[0].Rows[i]["EndLostTime"]);
                    obj.totalTolerance = Convert.ToInt16(ds.Tables[0].Rows[i]["StartTolerance"]) + Convert.ToInt16(ds.Tables[0].Rows[i]["EndTolerance"]);

                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(tardiness.Site, "Error", "tardiness", "GetReport", "spTardinessReport", 3002, tardiness.DCMUser);
            }
            return JsonSerializer.Serialize(reports);
        }
    }
}
