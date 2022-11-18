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

namespace DC4._0Backend.Controllers.Dashboard
{
    public class TMAController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetTMA_Picks_Weekly_DayShift([FromBody] Dash_Pick_Lines dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            Dash_Pick_Lines result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_TMA_DayShift", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift



            List<int> lines_Afternoon = new List<int>();

            List<int> lines_Day = new List<int>();
            List<int> lines_KPI = new List<int>();

            List<string> users_Day = new List<string>();
            List<string> users_Afternoon = new List<string>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {
     
                    for (int i = 0; i < count; i++)
                        {
                        
                               
                                    lines_KPI.Add((Convert.ToInt32(ds.Tables[0].Rows[i]["KPI"])));
                                    lines_Day.Add((Convert.ToInt32(ds.Tables[0].Rows[i]["Picks"])));
                                    users_Day.Add(ds.Tables[0].Rows[i]["UserID"].ToString());
                        }
                    }

                }


            
            catch (Exception ex)
            {
            }
            //}


            result = new Dash_Pick_Lines();
            result.DayShift_users = users_Day.ToArray();
            result.DayShift_lines = lines_Day.ToArray();
            result.DayShift_KPI = lines_KPI.ToArray();
           

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetTMA_Picks_Weekly_afternoonShift([FromBody] Dash_Pick_Lines dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            Dash_Pick_Lines result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_TMA_AfternoonShift", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift



            List<int> lines_Afternoon = new List<int>();

            List<int> lines_Day = new List<int>();
            List<int> lines_KPI = new List<int>();

            List<string> users_Day = new List<string>();
            List<string> users_Afternoon = new List<string>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {

                        if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                        {
                            lines_KPI.Add((Convert.ToInt32(ds.Tables[0].Rows[i]["KPI"])));
                            lines_Afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Picks"]));
                            users_Afternoon.Add(ds.Tables[0].Rows[i]["UserID"].ToString());

                        }
                       
                    }



                }

            }



            catch (Exception ex)
            {
            }
            //}


            result = new Dash_Pick_Lines();
           
            result.AfternoonShift_lines = lines_Afternoon.ToArray();
            result.AfternoonShift_users = users_Afternoon.ToArray();
            result.AfternoonShift_KPI = lines_KPI.ToArray();

            return JsonSerializer.Serialize(result);
        }



    }
}
