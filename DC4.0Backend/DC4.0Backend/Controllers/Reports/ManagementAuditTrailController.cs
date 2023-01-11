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
    public class ManagementAuditTrailController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetReport([FromBody]  ManagementAuditTrail trail)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[trail.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spManagementAuditTrailReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ManagementAuditTrail> reports = new List<ManagementAuditTrail>();
            string parmvalue = trail.FromDate + trail.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;

                for (int i = 0; i < count; i++)
                {
                    ManagementAuditTrail obj = new ManagementAuditTrail();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["firstname"].ToString();
                    obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.SurName;
                    obj.Shift = ds.Tables[0].Rows[i]["shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.UpdateBy = ds.Tables[0].Rows[i]["UpdateBy"].ToString();
                    obj.Module = ds.Tables[0].Rows[i]["Module"].ToString();
                    obj.Comment = ds.Tables[0].Rows[i]["comment"].ToString();


                    obj.EditDateTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["EditDate"].ToString());
                    obj.StartDateTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDateTime"].ToString());
                   

                    obj.StartDate = obj.StartDateTime.ToString("dd/MM/yyyy");
                    obj.StartTime = obj.StartDateTime.ToString("HH:mm");

                    obj.EndDate = Convert.ToDateTime(ds.Tables[0].Rows[i]["EndDatetime"]).ToString("dd/MM/yyyy");
                    obj.EndTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["EndDatetime"]).ToString("HH:mm");

                    obj.Before_After = ds.Tables[0].Rows[i]["BeforeAfter"].ToString();


                    obj.EditDate = obj.EditDateTime.ToString("dd/MM/yyyy");
                    obj.EditTime = obj.EditDateTime.ToString("HH:mm");
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();
                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                return "Error while Fetching the Management Audit Trail";
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }

    }
}
