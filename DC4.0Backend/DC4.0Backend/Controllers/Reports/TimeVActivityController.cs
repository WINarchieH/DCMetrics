using System;
using System.Collections.Generic;

using System.Web.Http;
using System.Web.UI.WebControls;
using DC4._0Backend.Models;

using System.Data;
using System.Data.SqlClient;
using System.Configuration;

using DC4._0Backend.Models;
using System.Xml;
namespace DC4._0Backend.Controllers.Reports
{
    public class TimeVActivityController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCostPerUnitReport([FromBody] TimeActivity ta)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[ta.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTimeVsActivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<TimeActivity> reports = new List<TimeActivity>();
            string parmvalue = ta.FromDate + ta.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.CommandTimeout = 120;

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {

                Logging.WriteLog(ta.Site, "Info", "CostPerUnit", "GetCostPerUnitReport", "spTimeVsActivity", 1002, ta.DCMUser);
            }
            catch (Exception ex)
            {

            }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    TimeActivity obj = new TimeActivity();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
           
                    obj.FullName = ds.Tables[0].Rows[i]["FullName"].ToString();
        
           
                    obj.TaskType = ds.Tables[0].Rows[i]["TaskType"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                   

                    obj.StartDate = ds.Tables[0].Rows[i]["ShiftDate"].ToString();


                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["OrdinaryTime"].ToString();
                    obj.SingleTimeActivityCost = ds.Tables[0].Rows[i]["SingleTimeActivityCost"].ToString();
                  
                    obj.TotalBilled = ds.Tables[0].Rows[i]["TotalBilled"].ToString();
                    obj.Quantity = ds.Tables[0].Rows[i]["Quantity"].ToString();
                    obj.CostPerUnit = ds.Tables[0].Rows[i]["CostPerActivity"].ToString();
               

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.Agency = ds.Tables[0].Rows[i]["Agency"].ToString();
                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {

                Logging.WriteLog(ta.Site, "Error", "Costperunit", "GetCostPerUnitReport", "spProductivityReport_Picks", 3002, ta.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }

    }
}
