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
    public class OverTimeController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetReport([FromBody]  Overtime time)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[time.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spOverTimeReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<Overtime> reports = new List<Overtime>();
            string parmvalue = time.FromDate + time.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(time.Site, "Info", "OverTimeReport", "OverTimeReport", "spOverTimeReport", 1002, time.DCMUser);
            }
            catch (Exception ex)
            { }

            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;

                for (int i = 0; i < count; i++)
                {
                    Overtime obj = new Overtime();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.SurName;
                    obj.Shift = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                   
                   
                    obj.Comment = ds.Tables[0].Rows[i]["Comment"].ToString();

                    obj.StartDate = ds.Tables[0].Rows[i]["Date"].ToString();


                    obj.StartTime = ds.Tables[0].Rows[i]["startdatetime"].ToString();
                    obj.EndTime = ds.Tables[0].Rows[i]["EndDateTime"].ToString();

                    obj.TimeAndHalf = ds.Tables[0].Rows[i]["TimeAndHalf"].ToString();
                    obj.DoubleTime = ds.Tables[0].Rows[i]["DoubleTime"].ToString();
                    obj.DoubleTimeHalf = ds.Tables[0].Rows[i]["DoubleTimeHalf"].ToString();
                 

                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(time.Site, "Error", "OverTimeReport", "OverTimeReport", "spOverTimeReport", 3002, time.DCMUser);
                return "Error while Fetching the Overtime report";
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }
    }
}
