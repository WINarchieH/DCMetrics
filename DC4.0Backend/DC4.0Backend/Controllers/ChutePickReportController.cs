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

namespace DC4._0Backend.Controllers
{
    public class ChutePickReportController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetChutePickReport([FromBody] ChutePick chute)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[chute.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spChutePicking_ReasonableExpectancy_Report", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ChutePick> reports = new List<ChutePick>();
            string parmvalue = chute.FromDate + chute.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {

                Logging.WriteLog(chute.Site, "Info", "ChutePick", "GetChutePickExpectancyReport", "spChutePicking_ReasonableExpectancy_Report", 1002, chute.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ChutePick obj = new ChutePick();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FullName = ds.Tables[0].Rows[i]["FullName"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                   

                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();


                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");

                    obj.EndDate = ds.Tables[0].Rows[i]["EndDate"].ToString();


                    DateTime date2 = DateTime.Parse(obj.EndDate);
                    obj.EndDate = date2.ToString("dd/MM/yyyy");

                    obj.PickQuantity = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["PickQuantity"].ToString()), 2);
                    obj.OrderNumber = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["OrderNumber"].ToString()), 2);
                    obj.Performance = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["Performance"].ToString()), 2);
                    obj.ActualTime = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["ActualTime"].ToString()), 2);
                    obj.EstimatedTime = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["EstimatedTime"].ToString()), 2);


                    reports.Add(obj);

                }

            }

            catch (Exception ex)
            {

                Logging.WriteLog(chute.Site, "Error", "ChutePick", "GetChutepickReport", "spChutePicking_ReasonableExpectancy_Report", 3002, chute.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetSelectedUserChutePickReport([FromBody]ChutePick chute)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[chute.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spChutePicking_ReasonableExpectancy_Details", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ChutePick> reports = new List<ChutePick>();
            string parmvalue = chute.FromDate + chute.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.Parameters.AddWithValue("@UserName", chute.UserID);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {

                Logging.WriteLog(chute.Site, "Info", "ChutePick", "GetselectedUserChutePickExpectancyReport", "spChutePicking_ReasonableExpectancy_Details", 1002, chute.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ChutePick obj = new ChutePick();
                    obj.Location = ds.Tables[0].Rows[i]["Location"].ToString();
                    obj.NextChute = ds.Tables[0].Rows[i]["NextChute"].ToString();
                    obj.StartTime = ds.Tables[0].Rows[i]["StartTime"].ToString();
                    obj.EndTime = ds.Tables[0].Rows[i]["EndTime"].ToString();


                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();


                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");

                    obj.PickQuantity = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["PickQuantity"].ToString()), 2);
                    obj.OrderNumber = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["OrderNumber"].ToString()), 2);
                    obj.PickTime = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["PickTime"].ToString()), 2);
                    obj.ActualTime = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["ActualTime"].ToString()), 2);
                    obj.EstimatedTime = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["EstimatedTime"].ToString()), 2);
                    obj.ChuteChangeTime = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["ChuteChangeTime"].ToString()), 2);
                    obj.CloseCaseTime = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["CloseCaseTime"].ToString()), 2);


                    reports.Add(obj);

                }

            }

            catch (Exception ex)
            {

                Logging.WriteLog(chute.Site, "Error", "ChutePick", "GetselectedUserChutepickReport", "spChutePicking_ReasonableExpectancy_Details", 3002, chute.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }
    }
}
