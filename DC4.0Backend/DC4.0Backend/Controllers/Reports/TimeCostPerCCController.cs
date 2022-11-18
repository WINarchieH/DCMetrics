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
using System.Xml;

namespace DC4._0Backend.Controllers.Reports
{
    public class TimeCostPerCCController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetTimeCostPerCCReport ([FromBody] TimeCostPerCC tcperCC)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[tcperCC.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTimeAndCostPerActivity_Report", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<TimeCostPerCC> reports = new List<TimeCostPerCC>();
            string parmvalue = tcperCC.StartDate + tcperCC.EndDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(tcperCC.Site, "Info", "TimeCostPerCCReport", "GetReport", "TimeAndCostPerActivity_Report", 1002, tcperCC.DCMUser);
            }
            catch (Exception ex)
            { }

            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    TimeCostPerCC obj = new TimeCostPerCC();
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();

                    obj.EndDate = ds.Tables[0].Rows[i]["EndDate"].ToString();
                    obj.CC_Code = ds.Tables[0].Rows[i]["CC_Code"].ToString();

                    //Units
                    string units = ds.Tables[0].Rows[i]["Qty"].ToString();
                    if (units != "")
                    {
                        units = string.Format("{0:F2}", float.Parse(units));
                    }
                    obj.Qty = units;

                    //Actual time
                    string actualTime = ds.Tables[0].Rows[i]["ActualTime"].ToString();
                    if (actualTime != "")
                    {
                        actualTime = string.Format("{0:F3}", float.Parse(actualTime));
                    }
                    obj.ActualTime = actualTime;

                    //Cost
                    string cost = ds.Tables[0].Rows[i]["Cost"].ToString();
                    if (cost != "")
                    {
                        cost = string.Format("{0:F3}", float.Parse(cost));
                    }
                    obj.Cost = cost;


                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {
                Logging.WriteLog(tcperCC.Site, "Error", "TimeCostPerCCReport", "GetReport", "spTimeAndCostPerActivity_Report", 3002, tcperCC.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }





        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetTimeCostPerCCDetail([FromBody] TimeCostPerCC tcperCC)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[tcperCC.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spTimeAndCostPerActivity_Details", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<TimeCostPerCC> reports = new List<TimeCostPerCC>();
            string parmvalue = tcperCC.StartDate + tcperCC.EndDate;
            
            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(tcperCC.Site, "Info", "TimeCostPerCCReport", "GetReport", "TimeAndCostPerActivity_Details", 1002, tcperCC.DCMUser);
            }
            catch (Exception ex)
            { }

            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    TimeCostPerCC obj = new TimeCostPerCC();

                    if (tcperCC.CC_Code != ds.Tables[0].Rows[i]["CC_Code"].ToString())
                    {
                        continue;
                    }

                    //If cost = 0, show only bad data
                    //If cost != 0, show only good data
                    //These are the only 2 allowed configurations

                    if (!(((ds.Tables[0].Rows[i]["goodData"].ToString() == "N") && (Math.Round(float.Parse(tcperCC.Cost)) == 0)) || ((ds.Tables[0].Rows[i]["goodData"].ToString() == "Y") && (Math.Round(float.Parse(tcperCC.Cost)) != 0))))
                    {
                        continue;
                    }

                    obj.TaskType = ds.Tables[0].Rows[i]["TaskType"].ToString();
                    obj.CC_Code = tcperCC.CC_Code;

                    //Dates
                    string startDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                    if(startDate != "")
                    {
                        startDate = Convert.ToDateTime(startDate).ToString("dd/MM/yyyy");
                    }
                    obj.StartDate = startDate;

                    string endDate = ds.Tables[0].Rows[i]["EndDate"].ToString();
                    if (endDate != "")
                    {
                        endDate = Convert.ToDateTime(endDate).ToString("dd/MM/yyyy");
                    }
                    obj.EndDate = endDate;

                    //Units
                    string units = ds.Tables[0].Rows[i]["Qty"].ToString();
                    if (units != "")
                    {
                        units = Math.Round(float.Parse(units)).ToString();
                    }
                    obj.Qty = units;

                    //Actual time
                    string actualTime = ds.Tables[0].Rows[i]["ActualTime"].ToString();
                    if (actualTime != "")
                    {
                        actualTime = string.Format("{0:F1}", float.Parse(actualTime));
                        //actualTime = Math.Round(float.Parse(actualTime)).ToString();
                    }
                    obj.ActualTime = actualTime;

                    //Cost
                    string cost = ds.Tables[0].Rows[i]["Cost"].ToString();
                    if(cost != "")
                    {
                        cost = string.Format("{0:F2}", float.Parse(cost));
                    }
                    obj.Cost = cost;

                    obj.goodData = ds.Tables[0].Rows[i]["goodData"].ToString();
                    
                    
                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {
                Logging.WriteLog(tcperCC.Site, "Error", "TimeCostPerCCReport", "GetReport", "spTimeAndCostPerActivity_Details", 3002, tcperCC.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }




    }
}
