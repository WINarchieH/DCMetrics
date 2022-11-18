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
    public class IndirectActivityReportController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetIndirectActivityReport([FromBody] IndirectActivityReport indirect)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[indirect.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spIndirectActivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<IndirectActivityReport> reports = new List<IndirectActivityReport>();
            string parmvalue = indirect.FromDate + indirect.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(indirect.Site, "Info", "IndirectActivityReport", "GetReport", "spIndirectActivity", 1002, indirect.DCMUser);
            }
            catch (Exception ex)
            {
               
            }
            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    IndirectActivityReport obj = new IndirectActivityReport();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserName"].ToString();

                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.SurName;
                    obj.TaskName = ds.Tables[0].Rows[i]["TaskName"].ToString();
                    obj.Teammanager = ds.Tables[0].Rows[i]["TeamManager"].ToString();

                    if (!(string.IsNullOrEmpty(ds.Tables[0].Rows[i]["StartDateTime"].ToString())))
                    {

                        obj.StartDateTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDateTime"].ToString());



                        obj.StartDate = obj.StartDateTime.ToString("dd/MM/yyyy");
                        obj.StartTime = obj.StartDateTime.ToString("HH:mm:ss");
                    }

                    if (! string.IsNullOrEmpty(ds.Tables[0].Rows[i]["EndDateTime"].ToString() ))
                    { 
                    obj.EndDateTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["EndDateTime"].ToString());
                    obj.EndDate = obj.EndDateTime.ToString("dd/MM/yyyy");
                    obj.EndTime = obj.EndDateTime.ToString("HH:mm:ss");
                }
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                  
                    obj.DownTime = ds.Tables[0].Rows[i]["DownTime"].ToString();
                    obj.TotalBreak = ds.Tables[0].Rows[i]["TotalBreak"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();


                    reports.Add(obj);

                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(indirect.Site, "Error", "IndirectActivityReport", "GetReport", "spIndirectActivity", 3002, indirect.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }

    }
}