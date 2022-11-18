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

namespace DC4._0Backend.Controllers.HomeScreenDashboard
{
    public class HomeScreenProductivityController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_PickandPut_Productivity([FromBody] Dashboard_Productivity dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }

            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");


            string parmvalue = dash.StartDate + dash.EndDate;

            List<DateTime> allDates = new List<DateTime>();
            List<string> datesconverted = new List<string>();
            List<double> PickUnitPerHr = new List<double>();
            List<double> PutawayUnitPerHr = new List<double>();
            List<int> Pickunits = new List<int>();
            List<int> Putawayunits = new List<int>();

            Dashboard_Productivity result = new Dashboard_Productivity();

            //Productivity Pick
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string date = ds.Tables[0].Rows[i]["Dates"].ToString();
                    DateTime dt = DateTime.Parse(date);
                    allDates.Add(dt);

                }

                // Putaway Units
                SqlCommand cmd2 = new SqlCommand("dbo.spDash_PutawayProductivity", sqlConnection);
                cmd2.CommandType = CommandType.StoredProcedure;

                cmd2.Parameters.AddWithValue("@Parm", parmvalue);

                SqlDataAdapter da2 = new SqlDataAdapter(cmd2);
                DataSet ds2 = new DataSet();

                try
                {
                    da2.Fill(ds2);

                   
                    for (int i = 0; i < ds2.Tables[0].Rows.Count; i++)
                    { 
                        string date = ds2.Tables[0].Rows[i]["Dates"].ToString();
                        DateTime dt = DateTime.Parse(date);
                        if (allDates.Contains(dt) == false)
                        {
                            allDates.Add(dt);
                        }

                    }

                   allDates.Sort((a, b) => a.CompareTo(b));
                    DataTable picktable = ds.Tables[0];
                    DataTable putawaytable = ds2.Tables[0];


                    foreach (DateTime date in allDates)
                    {
                        datesconverted.Add(date.ToString("dd MMM"));
                        DataRow[] pickrow = picktable.Select("Dates = '"+date+"'");
                        if (pickrow.Length > 0)
                        {
                            PickUnitPerHr.Add(Convert.ToDouble(pickrow[0].ItemArray[1].ToString()));
                            Pickunits.Add(Convert.ToInt32(pickrow[0].ItemArray[2].ToString()));
                        }
                        else
                        {
                            PickUnitPerHr.Add(0);
                            Pickunits.Add(0);
                        }
                        DataRow[] putawayrow = putawaytable.Select("Dates = '" + date + "'");
                        if (putawayrow.Length > 0)
                        {
                            PutawayUnitPerHr.Add(Convert.ToDouble(putawayrow[0].ItemArray[1].ToString()));
                            Putawayunits.Add(Convert.ToInt32(putawayrow[0].ItemArray[2].ToString()));
                        }
                        else
                        {
                            PutawayUnitPerHr.Add(0);
                            Putawayunits.Add(0);
                        }
                    }

                }
                catch (Exception ex)
                {

                }

            }
            catch (Exception ex)
            {
            }

            result.PutawayUnits = Putawayunits.ToArray();
            result.PutawayPerHr = PutawayUnitPerHr.ToArray();
            result.Dates = datesconverted.ToArray();
            result.Units = Pickunits.ToArray();
            result.UnitsPerHr = PickUnitPerHr.ToArray();

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetHomeScreenRoute([FromBody] Login login)
        {
           
            string sSQL = string.Empty;
            sSQL = "select HomeScreenDashboardRoute from WarehouseSites where Site = '" + login.Site + "'";
            Dictionary<string, string> result = new Dictionary<string, string>();
           
            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString);
            SqlCommand cmd = new SqlCommand(sSQL, sqlconnection);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            try
            {
                da.Fill(ds);

                string route = ds.Tables[0].Rows[0]["HomeScreenDashboardRoute"].ToString();

                result.Add("route", route);
            }
            catch (Exception ex)
            {

            }
            return JsonSerializer.Serialize(result);
        }
    }
        
}
