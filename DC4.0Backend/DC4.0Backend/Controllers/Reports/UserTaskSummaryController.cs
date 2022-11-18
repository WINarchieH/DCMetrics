using System;
using System;
using System.Collections.Generic;

using System.Web.Http;
using System.Web.UI.WebControls;
using DC4._0Backend.Models;

using System.Data;
using System.Data.SqlClient;
using System.Configuration;

using DC4._0Backend.Models;

namespace DC4._0Backend.Controllers.Reports
{
    public class UserTaskSummaryController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetUserTaskSummaryReport([FromBody] UserTaskSummary task)
        {

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[task.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spUserTaskTypeSummaryReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<UserTaskSummary> reports = new List<UserTaskSummary>();
            string parmvalue = task.FromDate + task.ToDate;

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
                    UserTaskSummary obj = new UserTaskSummary();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserName"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.SurName;
                    obj.TaskName = ds.Tables[0].Rows[i]["TaskName"].ToString();
                    obj.TaskTime = ds.Tables[0].Rows[i]["TaskTime"].ToString();
                    obj.TotalTasks = ds.Tables[0].Rows[i]["TotalTasks"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.ActivityType = ds.Tables[0].Rows[i]["ActivityType"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();


                    //Date

                    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["StartDate"].ToString()))
                    {
                        obj.StartDate = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDate"]).ToString("dd/MM/yyyy");
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