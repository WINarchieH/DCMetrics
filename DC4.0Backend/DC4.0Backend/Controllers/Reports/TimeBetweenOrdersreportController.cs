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
    public class TimeBetweenOrdersreportController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetReport([FromBody] TimeBetweenOrders idle)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[idle.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTimeBetweenOrdersReports", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<TimeBetweenOrders> reports = new List<TimeBetweenOrders>();
            string parmvalue = idle.FromDate + idle.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                Logging.WriteLog(idle.Site, "Info", "TimeBetweenOrders", "GetTimeBetweenOrders", "spTimeBetweenOrdersReports", 1002, idle.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    TimeBetweenOrders obj = new TimeBetweenOrders();
                    obj.OperatorID = ds.Tables[0].Rows[i]["OperatorID"].ToString();
                    obj.FullName = ds.Tables[0].Rows[i]["FirstName"].ToString() + " " + ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.OrderType = ds.Tables[0].Rows[i]["OrderType"].ToString();


                    DateTime date = DateTime.Parse(ds.Tables[0].Rows[i]["Date"].ToString());
                    obj.Date = date.ToString("dd/MM/yyyy");

                    obj.OrderNumber =  Convert.ToInt32(ds.Tables[0].Rows[i]["OrderNumber"]);
                    obj.timebetweenOrders = Convert.ToDouble(ds.Tables[0].Rows[i]["TimeBetweenOrders"]);
                    obj.LastPickOrderTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["LastTaskOfOrder"]).ToString("HH:mm:ss");
                    obj.NextRFScanTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["NextTaskStart"]).ToString("HH:mm:ss");
                  
                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(idle.Site, "Error", "TimeBetweenOrdersReports", "GetTimeBetweenOrdersReports", "spTimeBetweenOrdersReports", 3002, idle.DCMUser);
            }
            return JsonSerializer.Serialize(reports);
        }
    }
}
