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
    public class CurrentResAllocationController : ApiController
    {


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string getCurrentResAllocation([FromBody] CurrentResallocation lt)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[lt.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spCurrentResAllocation", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<CurrentResallocation> reports = new List<CurrentResallocation>();
        //    string parmvalue = lt.FromDate + lt.ToDate;

          //  cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.SelectCommand.CommandTimeout = 150;
            DataSet ds = new DataSet();
            try
            {
                Logging.WriteLog(lt.Site, "Info", "CurrentResAllocation", "CurrentResAllocation", "spCurrentResAllocation", 1002, lt.DCMUser);
            }
            catch (Exception ex)
            {

            }
            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    CurrentResallocation obj = new CurrentResallocation();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FullName = ds.Tables[0].Rows[i]["FullName"].ToString();
                    obj.Task = ds.Tables[0].Rows[i]["Task"].ToString();
                    obj.Location = ds.Tables[0].Rows[i]["Location"].ToString();
                    obj.ActivityType = ds.Tables[0].Rows[i]["ActivityType"].ToString();
           //         obj.StartDate = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDate"]).ToString("dd/MM/yyyy");
                    obj.StartTime = ds.Tables[0].Rows[i]["StartTime"].ToString();
                    obj.Agency = ds.Tables[0].Rows[i]["Agency"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
  
                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(lt.Site, "Error", "CurrentResAllocation", "getCurrentResAllocation", "spCurrentResAllocation", 3002, lt.DCMUser);

            }
            return JsonSerializer.Serialize(reports);
        }
    }
}
