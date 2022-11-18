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
using System.Text.Json;
namespace DC4._0Backend.Controllers.Dashboard
{
    public class DashboardTaskTimeController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_TimePerIndirectTasks([FromBody] Dashboard_TimePerIndirects dash)
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
            Dashboard_TimePerIndirects result = new Dashboard_TimePerIndirects();
            //Productivity Pick
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_TimePerIndirect", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.Parameters.AddWithValue("@ClickedCC", dash.ClickedCC);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            try
            {
                da.Fill(ds);
                //string[] CostCentre = new string[ds.Tables[0].Rows.Count];
                string[] TaskName = new string[ds.Tables[0].Rows.Count];
                double[] TotalHrs = new double[ds.Tables[0].Rows.Count];
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    //CostCentre[i] = ds.Tables[0].Rows[i]["CostCentre"].ToString();
                    TaskName[i] = ds.Tables[0].Rows[i]["TaskName"].ToString();
                    TotalHrs[i] = Convert.ToDouble(ds.Tables[0].Rows[i]["TotalHrs"].ToString());
                }
                //result.CostCentre = CostCentre;
                result.TaskName = TaskName;
                result.TotalHrs = TotalHrs;
            }
            catch (Exception ex)
            {
            }
            return JsonSerializer.Serialize(result);
        }
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_TimePerIndirect_CC([FromBody] Dashboard_TimePerIndirects dash)
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
            Dashboard_TimePerIndirects result = new Dashboard_TimePerIndirects();
            //Productivity Pick
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_TimePerIndirect_CC", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            try
            {
                da.Fill(ds);
                //string[] CostCentre = new string[ds.Tables[0].Rows.Count];
                string[] CostCentre = new string[ds.Tables[0].Rows.Count];
                double[] TotalHrs = new double[ds.Tables[0].Rows.Count];
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    //CostCentre[i] = ds.Tables[0].Rows[i]["CostCentre"].ToString();
                    CostCentre[i] = ds.Tables[0].Rows[i]["CostCentre"].ToString();
                    TotalHrs[i] = Convert.ToDouble(ds.Tables[0].Rows[i]["TotalHrs"].ToString());
                }
                //result.CostCentre = CostCentre;
                result.CostCentre = CostCentre;
                result.TotalHrs = TotalHrs;
            }
            catch (Exception ex)
            {
            }
            return JsonSerializer.Serialize(result);
        }
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_TimePerDirectTasks([FromBody] Dashboard_TimePerDirects dash)
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
            Dashboard_TimePerDirects result = new Dashboard_TimePerDirects();
            //Productivity Pick
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_TimePerDirect", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.Parameters.AddWithValue("@ClickedCC", dash.ClickedCC);
            cmd.CommandTimeout = 420;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            try
            {
                da.Fill(ds);
                //string[] CostCentre = new string[ds.Tables[0].Rows.Count];
                string[] TaskName = new string[ds.Tables[0].Rows.Count];
                double[] TotalHrs = new double[ds.Tables[0].Rows.Count];
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    //CostCentre[i] = ds.Tables[0].Rows[i]["CostCentre"].ToString();
                    TaskName[i] = ds.Tables[0].Rows[i]["TaskType"].ToString();
                    TotalHrs[i] = Convert.ToDouble(ds.Tables[0].Rows[i]["TotalHrs"].ToString());
                }
                //result.CostCentre = CostCentre;
                result.TaskName = TaskName;
                result.TotalHrs = TotalHrs;
            }
            catch (Exception ex)
            {
            }
            return JsonSerializer.Serialize(result);
        }
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_TimePerDirect_PerDay([FromBody] Dashboard_TimePerDirect_PerDay dash)
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
            Dashboard_TimePerDirect_PerDay result = new Dashboard_TimePerDirect_PerDay();
            //Productivity Pick
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_TimePerDirect_PerDay", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.Parameters.AddWithValue("@ClickedCC", dash.ClickedCC);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            cmd.CommandTimeout = 420;
            DataSet ds = new DataSet();
            try
            {
                da.Fill(ds);
                //string[] CostCentre = new string[ds.Tables[0].Rows.Count];


                List<string> dates = new List<string>();
                List<double> indirecttimes = new List<double>();
                List<double> directtimes = new List<double>();
                // Direct Activity Date

                foreach (DataRow row in ds.Tables[0].Rows)
                {
                  

                    if (row["DirectActivityDate"].ToString().Length >1)
                    {
                        DateTime datetime3 =   DateTime.Parse(row["DirectActivityDate"].ToString());
                        string date = datetime3.ToString("dd MMM");
                        dates.Add(date);

                        directtimes.Add(Math.Round(Convert.ToDouble(row["DirectActivityTime"].ToString()),1));

                    }
                    else
                    {
                        directtimes.Add(0);

                    }

                    if (row["IndirectActivityDate"].ToString().Length > 1)
                    {
                        DateTime datetime3 = DateTime.Parse(row["IndirectActivityDate"].ToString());
                        string date = datetime3.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }
                        indirecttimes.Add(Math.Round(Convert.ToDouble(row["IndirectActivityTime"].ToString()),1));

                    }
                    else
                    {
                        indirecttimes.Add(0);

                    }



                }

                


                    //Add Indirect Times





               
                //result.CostCentre = CostCentre;
             
                result.Dates = dates.ToArray();
                result.DirectActivityTime = directtimes.ToArray();
                result.IndirectActivityTime = indirecttimes.ToArray();
            }
            catch (Exception ex)
            {
            }
            return JsonSerializer.Serialize(result);
        }
    }
}