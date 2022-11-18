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
    public class SummaryReportController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetSummaryReport([FromBody] Summary summ)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[summ.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spSummaryReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<LostTime> reports = new List<LostTime>();
            string parmvalue = summ.FromDate + summ.Todate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                da.Fill(ds);


                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {

            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(dt) ;
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetUserSummaryReport([FromBody] UserSummary summary)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[summary.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spUserSummaryReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<UserSummary> reports = new List<UserSummary>();
            string parmvalue = summary.FromDate + summary.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    UserSummary obj = new UserSummary();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserName"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.SurName;
                    obj.TaskName = ds.Tables[0].Rows[i]["TaskName"].ToString();
                    obj.Break = ds.Tables[0].Rows[i]["Break"].ToString();
                    obj.Quantity = ds.Tables[0].Rows[i]["Qty"].ToString();
                    obj.NoOfLines = ds.Tables[0].Rows[i]["NoOfLines"].ToString(); 
                    obj.ActualTime = ds.Tables[0].Rows[i]["ActualTime"].ToString();
                    obj.UnitsPerHour = ds.Tables[0].Rows[i]["UnitPerHr"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.LostTime = Convert.ToDouble(ds.Tables[0].Rows[i]["LostTime"]) + Convert.ToDouble(ds.Tables[0].Rows[i]["StartLostTime"]) + Convert.ToDouble(ds.Tables[0].Rows[i]["EndLostTime"]);

                    //Date

                    if ( ! string.IsNullOrEmpty(ds.Tables[0].Rows[i]["date"].ToString()))
                    {
                        obj.Date = Convert.ToDateTime(ds.Tables[0].Rows[i]["date"]).ToString("dd/MM/yyyy");
                    }
                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["TaskStart"].ToString()))
                    {
                        obj.TaskStart = Convert.ToDateTime(ds.Tables[0].Rows[i]["TaskStart"]).ToString("HH:mm:ss");
                    }
                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["TaskEnd"].ToString()))
                    {
                        obj.TaskEnd = Convert.ToDateTime(ds.Tables[0].Rows[i]["TaskEnd"]).ToString("HH:mm:ss");
                    }
                  

                    reports.Add(obj);

                }

            }

            catch (Exception ex)
            {

            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }
    }
}
