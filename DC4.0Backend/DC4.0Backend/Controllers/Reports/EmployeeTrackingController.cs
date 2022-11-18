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
    public class EmployeeTrackingController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetEmployeeTrackingReport([FromBody] EmployeeTracking emp)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[emp.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spEmployeeTracking_SSRS", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<EmployeeTracking> reports = new List<EmployeeTracking>();
            string parmvalue = emp.FromDate + emp.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(emp.Site, "Info", "EmployeeTrackingReport", "GetReport", "spEmployeeTracking_SSRS", 1002, emp.DCMUser);
            }
            catch (Exception ex)
            { }

            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    EmployeeTracking obj = new EmployeeTracking();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();

                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.SurName;
                    obj.TaskType = ds.Tables[0].Rows[i]["TaskType"].ToString();
                    obj.Location = ds.Tables[0].Rows[i]["Location"].ToString();

                    if (!(string.IsNullOrEmpty(ds.Tables[0].Rows[i]["StartDate"].ToString())))
                    {

                        obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();



                        obj.StartDate = Convert.ToDateTime(obj.StartDate).ToString("dd/MM/yyyy");
                    }
                     

                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["EndDate"].ToString()))
                    {
                        obj.EndDate = ds.Tables[0].Rows[i]["EndDate"].ToString();
                        obj.EndDate = Convert.ToDateTime(obj.EndDate).ToString("dd/MM/yyyy");
                      
                    }
                    obj.ActivityType = ds.Tables[0].Rows[i]["ActivityType"].ToString();

                    obj.ActualTime = ds.Tables[0].Rows[i]["ActualTime"].ToString();

                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {
                Logging.WriteLog(emp.Site, "Error", "EmployeeTrackingReport", "GetReport", "spEmployeeTracking_SSRS", 3002, emp.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }

    }
}
