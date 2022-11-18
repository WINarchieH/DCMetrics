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
    public class CCAPickDashboardController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_Exp([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_Pickrates_Exp", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();
      
            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
            List<Double> pickrates_Exp_Afternoon = new List<double>();
            List<Double> pickrates_Exp_Day = new List<double>();
            List<Double> pickrates_trainee_Afternoon = new List<double>();
            List<Double> pickrates_trainee_shift = new List<double>();
            List<Double> pickrates_DC = new List<double>();
            List<int> cases_Exp_Afternoon = new List<int>();
            List<int> cases_Exp_Day = new List<int>();
            List<int> Cases_trainee_Day = new List<int>();
            List<int> Cases_trainee_afternoon = new List<int>();



            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates)
                    {

                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                            if (date.Equals(dt.ToString("dd MMM")))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    pickrates_Exp_Afternoon.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]),2));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    pickrates_Exp_Day.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]),2));


                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("DC"))
                                {
                                    pickrates_DC.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));


                                }

                            }


                        }
                        if (pickrates_Exp_Afternoon.Count != dateid) { pickrates_Exp_Afternoon.Add(0); }
                        if (pickrates_Exp_Day.Count != dateid) { pickrates_Exp_Day.Add(0); }
                        if (pickrates_DC.Count != dateid) { pickrates_DC.Add(0); }
                        dateid++;

                    }

                 }
                    
                
            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.dates_Shift = dates.ToArray();
            result.pickrates_Day_Exp = pickrates_Exp_Day.ToArray();
            result.pickrates_Afternoon_Exp = pickrates_Exp_Afternoon.ToArray();
            result.pickrates_DC_daily_Exp = pickrates_DC.ToArray();


            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_Trainee([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_Pickrates_Trainee", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
         
            List<Double> pickrates_trainee_Afternoon = new List<double>();
            List<Double> pickrates_trainee_shift = new List<double>();
            List<double> pickrates_DC = new List<double>();



            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates)
                    {

                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                            if (date.Equals(dt.ToString("dd MMM")))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    pickrates_trainee_Afternoon.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    pickrates_trainee_shift.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));


                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("DC"))
                                {
                                    pickrates_DC.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));


                                }

                            }


                        }
                        if (pickrates_trainee_Afternoon.Count != dateid) { pickrates_trainee_Afternoon.Add(0); }
                        if (pickrates_trainee_shift.Count != dateid) { pickrates_trainee_shift.Add(0); }
                        if (pickrates_DC.Count != dateid) { pickrates_DC.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.dates_Shift = dates.ToArray();
            result.pickrates_Day_Trainee = pickrates_trainee_shift.ToArray();
            result.pickrates_Afternoon_Traineer = pickrates_trainee_Afternoon.ToArray();
            result.pickrates_DC_daily_Trainee = pickrates_DC.ToArray();


            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_DC([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_Pickrates_DC", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<Double> pickrates_DC_trainee = new List<double>();
            List<Double> pickrates_DC_exp = new List<double>();
            List<double> pickrates_DC = new List<double>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates)
                    {

                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                            if (date.Equals(dt.ToString("dd MMM")))
                            {

                                if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                {
                                    pickrates_DC_trainee.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }
                                else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                {
                                    pickrates_DC_exp.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));


                                }
                                else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("DC"))
                                {
                                    pickrates_DC.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));


                                }

                            }


                        }
                        if (pickrates_DC_trainee.Count != dateid) { pickrates_DC_trainee.Add(0); }
                        if (pickrates_DC_exp.Count != dateid) { pickrates_DC_exp.Add(0); }
                        if (pickrates_DC.Count != dateid) { pickrates_DC.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.dates_Shift = dates.ToArray();
            result.pickrates_DC_daily_Trainee = pickrates_DC_trainee.ToArray();
            result.pickrates_DC_daily_Exp = pickrates_DC_exp.ToArray();
            result.pickrates_DC_daily = pickrates_DC.ToArray();

            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickCases_Exp([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PickCases_Exp", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<int> pickcases_Exp_Afternoon = new List<int>();

            List<int> pickcases_Exp_Day = new List<int>();

            List<int> pickcases_DC = new List<int>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates)
                    {

                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                            if (date.Equals(dt.ToString("dd MMM")))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    pickcases_Exp_Afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    pickcases_Exp_Day.Add((Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"])));


                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("DC"))
                                {
                                    pickcases_DC.Add((Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"])));


                                }

                            }


                        }
                        if (pickcases_Exp_Afternoon.Count != dateid) { pickcases_Exp_Afternoon.Add(0); }
                        if (pickcases_Exp_Day.Count != dateid) { pickcases_Exp_Day.Add(0); }
                        if (pickcases_DC.Count != dateid) { pickcases_DC.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.dates_Shift = dates.ToArray();
            result.pickcases_Day_Exp = pickcases_Exp_Day.ToArray();
            result.pickcases_Afternoon_Exp = pickcases_Exp_Afternoon.ToArray();
            result.pickcases_DC_daily_Exp = pickcases_DC.ToArray();


            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickCases_Trainee([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PickCases_Trainee", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<int> pickcases_Trainee_Afternoon = new List<int>();
            List<int> pickcases_Trainee_shift = new List<int>();
            List<int> pickcases_DC = new List<int>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates)
                    {

                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                            if (date.Equals(dt.ToString("dd MMM")))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    pickcases_Trainee_Afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    pickcases_Trainee_shift.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));


                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("DC"))
                                {
                                    pickcases_DC.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));


                                }

                            }


                        }
                        if (pickcases_Trainee_Afternoon.Count != dateid) { pickcases_Trainee_Afternoon.Add(0); }
                        if (pickcases_Trainee_shift.Count != dateid) { pickcases_Trainee_shift.Add(0); }
                        if (pickcases_DC.Count != dateid) { pickcases_DC.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.dates_Shift = dates.ToArray();
            result.pickcases_Day_Trainee = pickcases_Trainee_shift.ToArray();
            result.pickcases_Afternoon_Trainee = pickcases_Trainee_Afternoon.ToArray();
            result.pickcases_DC_daily_Trainee = pickcases_DC.ToArray();



            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickCases_DC([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PickCases_DC", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<int> pickcases_Exp = new List<int>();
            List<int> pickcases_trainee = new List<int>();
            List<int> pickcases_DC = new List<int>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates)
                    {

                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                            if (date.Equals(dt.ToString("dd MMM")))
                            {

                                if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                {
                                    pickcases_Exp.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));

                                }
                                else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                {
                                    pickcases_trainee.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));


                                }
                                else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("DC"))
                                {
                                    pickcases_DC.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));


                                }

                            }


                        }
                        if (pickcases_Exp.Count != dateid) { pickcases_Exp.Add(0); }
                        if (pickcases_trainee.Count != dateid) { pickcases_trainee.Add(0); }
                        if (pickcases_DC.Count != dateid) { pickcases_DC.Add(0); }
                       
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.dates_Shift = dates.ToArray();
            result.pickcases_Day_Exp = pickcases_Exp.ToArray();
            result.pickcases_Day_Trainee = pickcases_trainee.ToArray();
            result.pickcases_DC = pickcases_DC.ToArray();



            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickCases_All([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_All", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
            
            List<int> cases_Exp_Afternoon = new List<int>();
            List<int> cases_Exp_Day = new List<int>();
            List<int> Cases_trainee_Day = new List<int>();
            List<int> Cases_trainee_afternoon = new List<int>();



            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates)
                    {

                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                            if (date.Equals(dt.ToString("dd MMM")))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                    {
                                        Cases_trainee_afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Cases"]));
                                    }
                                    else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                    {
                                        cases_Exp_Afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Cases"]));

                                    }


                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                    {
                                        Cases_trainee_Day.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Cases"]));
                                    }
                                    else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                    {
                                        cases_Exp_Day.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Cases"]));

                                    }

                                }

                            }


                        }
                        if (cases_Exp_Afternoon.Count != dateid) { cases_Exp_Afternoon.Add(0); }
                        if (cases_Exp_Day.Count != dateid) { cases_Exp_Day.Add(0); }
                        if (Cases_trainee_Day.Count != dateid) { Cases_trainee_Day.Add(0); }
                        if (Cases_trainee_afternoon.Count != dateid) { Cases_trainee_afternoon.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.dates_Shift = dates.ToArray();
            result.pickcases_Afternoon_Exp = cases_Exp_Afternoon.ToArray();
            result.pickcases_Afternoon_Trainee = Cases_trainee_afternoon.ToArray();
            result.pickcases_Day_Exp = cases_Exp_Day.ToArray();
            result.pickcases_Day_Trainee = Cases_trainee_Day.ToArray();


            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_User_DayShift([FromBody] Barchartdata dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            Barchartdata result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PerUser_DayShift", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();
            List<string> usernames = new List<string>();
            List<Dashboard_barchartDataset> datasets = new List<Dashboard_barchartDataset>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<int> pickcases_DC_Afternoon = new List<int>();
            List<int> pickcases_DC_shift = new List<int>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {
                    //fetch distinct dates
                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }

                    //fetch distinct usernames
                    for (int i = 0; i < count; i++)
                    {

                        if (usernames.Contains(ds.Tables[0].Rows[i]["Name"].ToString()) == false)
                        {
                            usernames.Add(ds.Tables[0].Rows[i]["Name"].ToString());
                        }

                    }



                    foreach (string date in dates)
                    {
                        int dateid = 1;
                        List<double> pickrates = new List<double>();
                        Dashboard_barchartDataset obj = new Dashboard_barchartDataset();
                        foreach (string name in usernames)
                        {
                            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                            {
                                DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());
                                if ((ds.Tables[0].Rows[i]["Name"].Equals(name)) && (date.Equals(dt.ToString("dd MMM"))))
                                {

                                    pickrates.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }
                            }

                            //if (pickrates.Count != dateid) { pickrates.Add(0); }
                        }

                        obj.data = pickrates.ToArray();
                        obj.name = date;

                        datasets.Add(obj);
                    }
                }
            }
            catch (Exception ex)
            {
            }
            //}


            result = new Barchartdata();
            result.Labels = usernames.ToArray();
            result.Dataset = datasets;



            return JsonSerializer.Serialize(result);
        }






        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_User_AfternoonShift([FromBody] Barchartdata dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            Barchartdata result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PerUser_AfternoonShift", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();
            List<string> usernames = new List<string>();
            List<Dashboard_barchartDataset> datasets = new List<Dashboard_barchartDataset>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<int> pickcases_DC_Afternoon = new List<int>();
            List<int> pickcases_DC_shift = new List<int>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {
                    //fetch distinct dates
                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }

                    //fetch distinct usernames
                    for (int i = 0; i < count; i++)
                    {

                        if (usernames.Contains(ds.Tables[0].Rows[i]["Name"].ToString()) == false)
                        {
                            usernames.Add(ds.Tables[0].Rows[i]["Name"].ToString());
                        }

                    }



                    foreach (string date in dates)
                    {
                        int dateid = 1;
                        List<double> pickrates = new List<double>();
                        Dashboard_barchartDataset obj = new Dashboard_barchartDataset(); 
                        foreach (string name in usernames)
                        {
                            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                            {
                                DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());
                                if ((ds.Tables[0].Rows[i]["Name"].Equals(name)) && (date.Equals(dt.ToString("dd MMM"))))
                                {

                                        pickrates.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));
                                    
                                }
                            }

                            //if (pickrates.Count != dateid) { pickrates.Add(0); }
                        }

                        obj.data = pickrates.ToArray();
                        obj.name = date;

                        datasets.Add(obj);
                    }
                }
            }
            catch (Exception ex)
            {
            }
            //}


            result = new Barchartdata();
            result.Labels = usernames.ToArray();
            result.Dataset = datasets;
            


            return JsonSerializer.Serialize(result);
        }


        // Afternoon Trainee User Pick Rate
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_User_AfternoonShift_Trainee([FromBody] Barchartdata dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            Barchartdata result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PerUser_AfternoonShift_Trainee", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();
            List<string> usernames = new List<string>();
            List<Dashboard_barchartDataset> datasets = new List<Dashboard_barchartDataset>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<int> pickcases_DC_Afternoon = new List<int>();
            List<int> pickcases_DC_shift = new List<int>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {
                    //fetch distinct dates
                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }

                    //fetch distinct usernames
                    for (int i = 0; i < count; i++)
                    {

                        if (usernames.Contains(ds.Tables[0].Rows[i]["Name"].ToString()) == false)
                        {
                            usernames.Add(ds.Tables[0].Rows[i]["Name"].ToString());
                        }

                    }



                    foreach (string date in dates)
                    {
                        int dateid = 1;
                        List<double> pickrates = new List<double>();
                        Dashboard_barchartDataset obj = new Dashboard_barchartDataset();
                        foreach (string name in usernames)
                        {
                            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                            {
                                DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());
                                if ((ds.Tables[0].Rows[i]["Name"].Equals(name)) && (date.Equals(dt.ToString("dd MMM"))))
                                {

                                    pickrates.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }
                            }

                            //if (pickrates.Count != dateid) { pickrates.Add(0); }
                        }

                        obj.data = pickrates.ToArray();
                        obj.name = date;

                        datasets.Add(obj);
                    }
                }
            }
            catch (Exception ex)
            {
            }
            //}


            result = new Barchartdata();
            result.Labels = usernames.ToArray();
            result.Dataset = datasets;



            return JsonSerializer.Serialize(result);
        }

        //Day Shift Trainee User Pick Rate

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_User_DayShift_Trainee([FromBody] Barchartdata dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            Barchartdata result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PerUser_DayShift_Trainee", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();
            List<string> usernames = new List<string>();
            List<Dashboard_barchartDataset> datasets = new List<Dashboard_barchartDataset>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<int> pickcases_DC_Afternoon = new List<int>();
            List<int> pickcases_DC_shift = new List<int>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {
                    //fetch distinct dates
                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }

                    //fetch distinct usernames
                    for (int i = 0; i < count; i++)
                    {

                        if (usernames.Contains(ds.Tables[0].Rows[i]["Name"].ToString()) == false)
                        {
                            usernames.Add(ds.Tables[0].Rows[i]["Name"].ToString());
                        }

                    }



                    foreach (string date in dates)
                    {
                        int dateid = 1;
                        List<double> pickrates = new List<double>();
                        Dashboard_barchartDataset obj = new Dashboard_barchartDataset();
                        foreach (string name in usernames)
                        {
                            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                            {
                                DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());
                                if ((ds.Tables[0].Rows[i]["Name"].Equals(name)) && (date.Equals(dt.ToString("dd MMM"))))
                                {

                                    pickrates.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }
                            }

                            //if (pickrates.Count != dateid) { pickrates.Add(0); }
                        }

                        obj.data = pickrates.ToArray();
                        obj.name = date;

                        datasets.Add(obj);
                    }
                }
            }
            catch (Exception ex)
            {
            }
            //}


            result = new Barchartdata();
            result.Labels = usernames.ToArray();
            result.Dataset = datasets;



            return JsonSerializer.Serialize(result);
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickCases_All_Weekly([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickCases_All_Weekly", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<int> week = new List<int>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<int> cases_Exp_Afternoon = new List<int>();
            List<int> cases_Exp_Day = new List<int>();
            List<int> Cases_trainee_Day = new List<int>();
            List<int> Cases_trainee_afternoon = new List<int>();



            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {


                        if (week.Contains(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"])) == false)
                        {
                            week.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]));
                        }

                    }



                    int dateid = 1;
                    foreach ( int w in week)
                    {

                        for (int i = 0; i < count; i++)
                        {
                           
                            if (w == Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                    {
                                        Cases_trainee_afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Cases"]));
                                    }
                                    else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                    {
                                        cases_Exp_Afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Cases"]));

                                    }


                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                    {
                                        Cases_trainee_Day.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Cases"]));
                                    }
                                    else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                    {
                                        cases_Exp_Day.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Cases"]));

                                    }

                                }

                            }


                        }
                        if (cases_Exp_Afternoon.Count != dateid) { cases_Exp_Afternoon.Add(0); }
                        if (cases_Exp_Day.Count != dateid) { cases_Exp_Day.Add(0); }
                        if (Cases_trainee_Day.Count != dateid) { Cases_trainee_Day.Add(0); }
                        if (Cases_trainee_afternoon.Count != dateid) { Cases_trainee_afternoon.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.weeks = week.ToArray();
            result.pickcases_Afternoon_Exp = cases_Exp_Afternoon.ToArray();
            result.pickcases_Afternoon_Trainee = Cases_trainee_afternoon.ToArray();
            result.pickcases_Day_Exp = cases_Exp_Day.ToArray();
            result.pickcases_Day_Trainee = Cases_trainee_Day.ToArray();


            return JsonSerializer.Serialize(result);
        }


        #region Weekly Dashboard Methods





        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_Exp_Weekly([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_Pickrates_Exp_Weekly", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<int> week = new List<int>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
            List<Double> pickrates_Exp_Afternoon = new List<double>();
            List<Double> pickrates_Exp_Day = new List<double>();
            List<Double> pickrates_trainee_Afternoon = new List<double>();
            List<Double> pickrates_trainee_shift = new List<double>();
            List<double> pickrates_dc = new List<double>();




            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {


                        if (week.Contains(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"])) == false)
                        {
                            week.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]));
                        }

                    }


                    int dateid = 1;
                    foreach (int w in week)
                    {

                        for (int i = 0; i < count; i++)
                        {


                            if (w == Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    pickrates_Exp_Afternoon.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    pickrates_Exp_Day.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));


                                }
                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("DC"))
                                {
                                    pickrates_dc.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }

                            }


                        }
                        if (pickrates_Exp_Afternoon.Count != dateid) { pickrates_Exp_Afternoon.Add(0); }
                        if (pickrates_Exp_Day.Count != dateid) { pickrates_Exp_Day.Add(0); }
                        if (pickrates_dc.Count != dateid) { pickrates_dc.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.weeks = week.ToArray();
            result.pickrates_Day_Exp = pickrates_Exp_Day.ToArray();
            result.pickrates_Afternoon_Exp = pickrates_Exp_Afternoon.ToArray();
            result.pickrates_DC_Weekly_Exp = pickrates_dc.ToArray();


            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_Trainee_Weekly([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_Pickrates_Trainee_Weekly", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<int> week = new List<int>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
            List<Double> pickrates_Exp_Afternoon = new List<double>();
            List<Double> pickrates_Exp_Day = new List<double>();
            List<Double> pickrates_trainee_Afternoon = new List<double>();
            List<Double> pickrates_trainee_shift = new List<double>();
            List<double> pickrates_dc = new List<double>();




            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {


                        if (week.Contains(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"])) == false)
                        {
                            week.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]));
                        }

                    }


                    int dateid = 1;
                    foreach (int w in week)
                    {

                        for (int i = 0; i < count; i++)
                        {


                            if (w == Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    pickrates_trainee_Afternoon.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    pickrates_trainee_shift.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));


                                }
                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("DC"))
                                {
                                    pickrates_dc.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }

                            }


                        }
                        if (pickrates_trainee_Afternoon.Count != dateid) { pickrates_trainee_Afternoon.Add(0); }
                        if (pickrates_trainee_shift.Count != dateid) { pickrates_trainee_shift.Add(0); }
                        if (pickrates_dc.Count != dateid) { pickrates_dc.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.weeks = week.ToArray();
            result.pickrates_Day_Trainee = pickrates_trainee_shift.ToArray();
            result.pickrates_Afternoon_Traineer = pickrates_trainee_Afternoon.ToArray();
            result.pickrates_DC_Weekly_Trainee = pickrates_dc.ToArray();


            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickRates_DC_Weekly([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_Pickrates_DC_Weekly", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<int> week = new List<int>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
            List<Double> pickrates_Exp = new List<double>();
            List<Double> pickrates_trainee = new List<double>();
          
            List<double> pickrates_dc = new List<double>();




            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {


                        if (week.Contains(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"])) == false)
                        {
                            week.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]));
                        }

                    }


                    int dateid = 1;
                    foreach (int w in week)
                    {

                        for (int i = 0; i < count; i++)
                        {


                            if (w == Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]))
                            {

                                if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                {
                                     pickrates_trainee.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }
                                else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                {
                                    pickrates_Exp.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));


                                }
                                if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("DC"))
                                {
                                    pickrates_dc.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"]), 2));

                                }

                            }


                        }
                        if (pickrates_trainee.Count != dateid) { pickrates_trainee.Add(0); }
                        if (pickrates_Exp.Count != dateid) { pickrates_Exp.Add(0); }
                        if (pickrates_dc.Count != dateid) { pickrates_dc.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.weeks = week.ToArray();
            result.pickrates_DC_Weekly_Trainee = pickrates_trainee.ToArray();
            result.pickrates_DC_Weekly_Exp = pickrates_Exp.ToArray();
            result.pickrates_DC_Weekly  = pickrates_dc.ToArray();


            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickCases_Exp_Weekly([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PickCases_Exp_Weekly", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<int> week = new List<int>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
            List<int> pickcases_Exp = new List<int>();
            List<int> pickcases_day = new List<int>();

            List<int> pickcases_afternoon = new List<int>();




            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {


                        if (week.Contains(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"])) == false)
                        {
                            week.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]));
                        }

                    }


                    int dateid = 1;
                    foreach (int w in week)
                    {

                        for (int i = 0; i < count; i++)
                        {


                            if (w == Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    pickcases_afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    pickcases_day.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));


                                }
                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("DC"))
                                {
                                    pickcases_Exp.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));

                                }

                            }


                        }
                        if (pickcases_day.Count != dateid) { pickcases_day.Add(0); }
                        if (pickcases_Exp.Count != dateid) { pickcases_Exp.Add(0); }
                        if (pickcases_afternoon.Count != dateid) { pickcases_afternoon.Add(0); }
                        dateid++;

                    }
                }

            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.weeks = week.ToArray();
            result.pickcases_DC_Weekly_Exp = pickcases_Exp.ToArray();
            result.pickcases_Exp_afternoon_Weekly = pickcases_afternoon.ToArray();
            result.pickcases_Exp_Day_Weekly = pickcases_day.ToArray();


            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickAccuracy_All_Weekly([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickAccuracy_All_Weekly", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<int> week = new List<int>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

            List<double> pickAccuracy_Exp_Afternoon = new List<double>();
            List<double> pickAccuracy_Exp_Day = new List<double>();
            List<double> pickAccuracy_trainee_Day = new List<double>();
            List<double> pickAccuracy_trainee_afternoon = new List<double>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {


                        if (week.Contains(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"])) == false)
                        {
                            week.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]));
                        }

                    }



                    int dateid = 1;
                    foreach (int w in week)
                    {

                        for (int i = 0; i < count; i++)
                        {

                            if (w == Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                    {
                                        pickAccuracy_trainee_afternoon.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["PickAccuracy"]),1));
                                    }
                                    else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                    {
                                        pickAccuracy_Exp_Afternoon.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["PickAccuracy"]), 1));

                                    }


                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                    {
                                        pickAccuracy_trainee_Day.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["PickAccuracy"]), 1));
                                    }
                                    else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                    {
                                        pickAccuracy_Exp_Day.Add(Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["PickAccuracy"]), 1));

                                    }

                                }

                            }

                            
                        }
                        if (pickAccuracy_Exp_Afternoon.Count != dateid) { pickAccuracy_Exp_Afternoon.Add(0); }
                        if (pickAccuracy_Exp_Day.Count != dateid) { pickAccuracy_Exp_Day.Add(0); }
                        if (pickAccuracy_trainee_Day.Count != dateid) { pickAccuracy_trainee_Day.Add(0); }
                        if (pickAccuracy_trainee_afternoon.Count != dateid) { pickAccuracy_trainee_afternoon.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.weeks = week.ToArray();
            result.pickAccuracy_Day_Exp = pickAccuracy_Exp_Day.ToArray();
            result.pickAccuracy_Day_Trainee = pickAccuracy_trainee_Day.ToArray();
            result.pickAccuracy_Afternoon_Trainee = pickAccuracy_trainee_afternoon.ToArray();
            result.pickAccuracy_Afternoon_Exp = pickAccuracy_Exp_Afternoon.ToArray();


            return JsonSerializer.Serialize(result);
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickCases_Trainee_Weekly([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PickCases_Trainee_Weekly", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<int> week = new List<int>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
            List<int> pickcases_trainee = new List<int>();
            List<int> pickcases_day = new List<int>();

            List<int> pickcases_afternoon = new List<int>();




            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {


                        if (week.Contains(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"])) == false)
                        {
                            week.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]));
                        }

                    }


                    int dateid = 1;
                    foreach (int w in week)
                    {

                        for (int i = 0; i < count; i++)
                        {


                            if (w == Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("A"))
                                {
                                    pickcases_afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("D"))
                                {
                                    pickcases_day.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));


                                }
                                if (ds.Tables[0].Rows[i]["ShiftType"].ToString().Equals("DC"))
                                {
                                    pickcases_trainee.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));

                                }

                            }


                        }
                        if (pickcases_day.Count != dateid) { pickcases_day.Add(0); }
                        if (pickcases_trainee.Count != dateid) { pickcases_trainee.Add(0); }
                        if (pickcases_afternoon.Count != dateid) { pickcases_afternoon.Add(0); }
                        dateid++;

                    }
                }

                    }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.weeks = week.ToArray();
            result.pickcases_DC_Weekly_Trainee = pickcases_trainee.ToArray();
            result.pickcases_Trainee_afternoon_Weekly = pickcases_afternoon.ToArray();
            result.pickcases_Trainee_Day_Weekly = pickcases_day.ToArray();


            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickCases_DC_Weekly([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PickCases_DC_Weekly", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<int> week = new List<int>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
            List<int> pickcases_Exp = new List<int>();
            List<int> pickcases_trainee = new List<int>();

            List<int> pickcases_dc = new List<int>();




            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {


                        if (week.Contains(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"])) == false)
                        {
                            week.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]));
                        }

                    }


                    int dateid = 1;
                    foreach (int w in week)
                    {

                        for (int i = 0; i < count; i++)
                        {


                            if (w == Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]))
                            {

                                if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Trainee"))
                                {
                                    pickcases_trainee.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));

                                }
                                else if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("Experienced"))
                                {
                                    pickcases_Exp.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));


                                }
                                if (ds.Tables[0].Rows[i]["Level"].ToString().Equals("DC"))
                                {
                                    pickcases_dc.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));

                                }

                            }


                        }
                        if (pickcases_trainee.Count != dateid) { pickcases_trainee.Add(0); }
                        if (pickcases_Exp.Count != dateid) { pickcases_Exp.Add(0); }
                        if (pickcases_dc.Count != dateid) { pickcases_dc.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.weeks = week.ToArray();
            result.pickcases_DC_Weekly_Exp = pickcases_Exp.ToArray();
            result.pickcases_DC_Weekly_Trainee = pickcases_trainee.ToArray();
            result.pickcases_DC = pickcases_dc.ToArray();


            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_Reworks_Weekly([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_Reworks_Week", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<int> week = new List<int>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift
            
            List<int> reworks_afternoon = new List<int>();

            List<int> reworks_Day = new List<int>();




            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {


                        if (week.Contains(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"])) == false)
                        {
                            week.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]));
                        }

                    }


                    int dateid = 1;
                    foreach (int w in week)
                    {

                        for (int i = 0; i < count; i++)
                        {


                            if (w == Convert.ToInt32(ds.Tables[0].Rows[i]["WeekNumber"]))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftCode"].ToString().Equals("D"))
                                {
                                    reworks_Day.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Errors"]));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftCode"].ToString().Equals("A"))
                                {
                                    reworks_afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Errors"]));


                                }
                               

                            }


                        }
                        if (reworks_Day.Count != dateid) { reworks_Day.Add(0); }
                        if (reworks_afternoon.Count != dateid) { reworks_afternoon.Add(0); }
                     
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.weeks = week.ToArray();
            result.Reworks_Day_Weekly = reworks_Day.ToArray();
            result.Reworks_afternoon_Weekly = reworks_afternoon.ToArray();

            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_Reworks_Daily([FromBody] DashBoard_Putway_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            DashBoard_Putway_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_Reworks_Day", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();


            //Shift

          

            List<int> reworks_Afternoon = new List<int>();

            List<int> reworks_Day = new List<int>();


            try
            {
                da.Fill(ds);
                int count = ds.Tables[0].Rows.Count;
                if (count > 0)
                {

                    for (int i = 0; i < count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates.Contains(date) == false)
                        {
                            dates.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates)
                    {

                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());

                            if (date.Equals(dt.ToString("dd MMM")))
                            {

                                if (ds.Tables[0].Rows[i]["ShiftCode"].ToString().Equals("A"))
                                {
                                    reworks_Afternoon.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["Errors"]));

                                }
                                else if (ds.Tables[0].Rows[i]["ShiftCode"].ToString().Equals("D"))
                                {
                                    reworks_Day.Add((Convert.ToInt32(ds.Tables[0].Rows[i]["Errors"])));


                                }
                               

                            }


                        }
                       
                        if (reworks_Afternoon.Count != dateid) { reworks_Afternoon.Add(0); }
                        if (reworks_Day.Count != dateid) { reworks_Day.Add(0); }
                        dateid++;

                    }

                }


            }
            catch (Exception ex)
            {
            }
            //}


            result = new DashBoard_Putway_split();
            result.dates_Shift = dates.ToArray();
            result.Reworks_Day_Daily = reworks_Day.ToArray();
            result.Reworks_afternoon_Daily = reworks_Afternoon.ToArray();
        

            return JsonSerializer.Serialize(result);
        }








        #endregion
    }
}

