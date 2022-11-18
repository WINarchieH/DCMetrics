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
    public class NoShowController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetNoShowReport([FromBody] NoShow show)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[show.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spNoShowReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<NoShow> reports = new List<NoShow>();
            string parmvalue = show.FromDate + show.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            try
            {

                Logging.WriteLog(show.Site, "Info", "NoshowReport", "NoShowReport", "spNoShowReport", 1002, show.DCMUser);
            }
            catch (Exception ex)
            {

            }
            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    NoShow obj = new NoShow();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.EmployeeName = obj.FirstName + obj.Surname;
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();

                    obj.Date = ds.Tables[0].Rows[i]["StartDate"].ToString();


                    DateTime date = DateTime.ParseExact(obj.Date, "dd/MM/yyyy", null);
                    obj.Date = date.ToString("dd/MM/yyyy");

                    obj.ExpectedStart = ds.Tables[0].Rows[i]["ExpectedStart"].ToString();
                    obj.ActualStart = ds.Tables[0].Rows[i]["ActualStart"].ToString();
                    obj.Status = ds.Tables[0].Rows[i]["Status"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();
                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(show.Site, "Error", "NoshowReport", "NoShowReport", "spNoShowReport", 3002, show.DCMUser);
            }
            return JsonSerializer.Serialize(reports);
        }

    }
}