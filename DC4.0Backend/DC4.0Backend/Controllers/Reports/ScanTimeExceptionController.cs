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
    public class ScanTimeExceptionController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetScanTimeExceptionReport([FromBody] ScanTimeException scan)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[scan.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTimeGapReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ScanTimeException> reports = new List<ScanTimeException>();
            string parmvalue = scan.FromDate + scan.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.Parameters.AddWithValue("@GapTime", 1);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {

                Logging.WriteLog(scan.Site, "Info", "ScanTimeException", "GetScanTimeExceptionReport", "spTimeGapReport", 1002, scan.DCMUser);
            }
            catch (Exception ex)
            {

            }

            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ScanTimeException obj = new ScanTimeException();
                    obj.EmployeeID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FullName = ds.Tables[0].Rows[i]["UserName"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["shiftCode"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                    obj.ProductCode = ds.Tables[0].Rows[i]["ProductCode"].ToString();
                    obj.TimeGap = Convert.ToInt32(ds.Tables[0].Rows[i]["TimeGap"]);
                    obj.TaskType = ds.Tables[0].Rows[i]["TaskType"].ToString();
                    obj.StartDate =  Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDatetime"].ToString()).ToString("dd/MM/yyyy");
                    obj.StartTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDatetime"].ToString()).ToString("HH:mm:ss");
                    obj.EndDate = Convert.ToDateTime(ds.Tables[0].Rows[i]["EndDatetime"].ToString()).ToString("dd/MM/yyyy");
                    obj.EndTime = Convert.ToDateTime(ds.Tables[0].Rows[i]["EndDatetime"].ToString()).ToString("HH:mm:ss");
                    obj.PickQuantity = Convert.ToInt32(ds.Tables[0].Rows[i]["PickQuantity"]);
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();


                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {

                Logging.WriteLog(scan.Site, "Error", "ScanTimeException", "GetScanTimeExceptionReport", "spTimeGapReport", 3002, scan.DCMUser);

            }
            return JsonSerializer.Serialize(reports);
        }

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

                    obj.OrderNumber = Convert.ToInt32(ds.Tables[0].Rows[i]["OrderNumber"]);
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
