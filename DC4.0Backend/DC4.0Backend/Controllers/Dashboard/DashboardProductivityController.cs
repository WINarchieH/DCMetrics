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
    public class DashboardProductivityController : ApiController
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


            Dashboard_Productivity result = new Dashboard_Productivity();

            //Productivity Pick
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandTimeout = 420;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);


                int[] Units = new int[ds.Tables[0].Rows.Count];
                double[] UnitsPerHr = new double[ds.Tables[0].Rows.Count];

                string[] Dates = new string[ds.Tables[0].Rows.Count];




                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string date = ds.Tables[0].Rows[i]["Dates"].ToString();
                    DateTime dt = DateTime.Parse(date);
                    Dates[i] = dt.ToString("dd MMM");
                    Units[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]);
                    UnitsPerHr[i] = Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString());

                }

                result.Dates = Dates;
                result.Units = Units;
                result.UnitsPerHr = UnitsPerHr;

                // Putaway Units
                SqlCommand cmd2 = new SqlCommand("dbo.spDash_PutawayProductivity", sqlConnection);
                cmd2.CommandType = CommandType.StoredProcedure;

                cmd2.Parameters.AddWithValue("@Parm", parmvalue);

                SqlDataAdapter da2 = new SqlDataAdapter(cmd2);
                DataSet ds2 = new DataSet();

                try
                {
                    da2.Fill(ds2);
                    string[] PutawayUnitDates = new string[ds2.Tables[0].Rows.Count];


                    int[] PutawayUnits = new int[ds2.Tables[0].Rows.Count];
                    double[] PutawayPerhr = new double[ds2.Tables[0].Rows.Count];


                    for (int i = 0; i < ds2.Tables[0].Rows.Count; i++)
                    {

                        PutawayUnits[i] = Convert.ToInt32(ds2.Tables[0].Rows[i]["TotalUnits"]);
                        PutawayPerhr[i] = Convert.ToDouble(ds2.Tables[0].Rows[i]["PutAwayPerHr"].ToString());
                        string date = ds2.Tables[0].Rows[i]["Dates"].ToString();
                        DateTime dt = DateTime.Parse(date);
                        PutawayUnitDates[i] = dt.ToString("dd MMM");

                    }


                    result.PutawayUnitdates = PutawayUnitDates;
                    result.PutawayPerHr = PutawayPerhr;
                    result.PutawayUnits = PutawayUnits;
                }
                catch (Exception ex)
                {

                }

            }
            catch (Exception ex)
            {
            }


            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_RepProductivity([FromBody] Dashboard_RepUnits dash)
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


            Dashboard_RepUnits result = new Dashboard_RepUnits();

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_RepProductivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 420;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);


                int[] Units = new int[ds.Tables[0].Rows.Count];
                double[] repPerHr = new double[ds.Tables[0].Rows.Count];

                string[] Dates = new string[ds.Tables[0].Rows.Count];




                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string date = ds.Tables[0].Rows[i]["Dates"].ToString();
                    DateTime dt = DateTime.Parse(date);
                    Dates[i] = dt.ToString("dd MMM");
                    Units[i] = int.Parse(ds.Tables[0].Rows[i]["TotalUnits"].ToString());
                    repPerHr[i] = Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString());

                }

                result.Dates = Dates;
                result.Units = Units;
                result.RepPerHr = repPerHr;

            }
            catch (Exception ex)
            {
            }


            return JsonSerializer.Serialize(result);
        }

        //Dashboard Move Methods
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_MoveProductivity([FromBody] Dashboard_MoveUnits dash)
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


            Dashboard_MoveUnits result = new Dashboard_MoveUnits();

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_MoveProductivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 420;
            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);


                int[] Units = new int[ds.Tables[0].Rows.Count];
                double[] MovePerHr = new double[ds.Tables[0].Rows.Count];

                string[] Dates = new string[ds.Tables[0].Rows.Count];




                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string date = ds.Tables[0].Rows[i]["Dates"].ToString();
                    DateTime dt = DateTime.Parse(date);
                    Dates[i] = dt.ToString("dd MMM");
                    Units[i] = int.Parse(ds.Tables[0].Rows[i]["TotalUnits"].ToString());
                    MovePerHr[i] = Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString());

                }

                result.Dates = Dates;
                result.Units = Units;
                result.MovePerHr = MovePerHr;

            }
            catch (Exception ex)
            {
            }


            return JsonSerializer.Serialize(result);
        }





        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_PutawayProductivity([FromBody] Dashboard_PutawayUnits dash)
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


            Dashboard_PutawayUnits result = new Dashboard_PutawayUnits();

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PutawayProductivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 120;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);


                int[] Units = new int[ds.Tables[0].Rows.Count];
                double[] PutawayPerHr = new double[ds.Tables[0].Rows.Count];

                string[] Dates = new string[ds.Tables[0].Rows.Count];




                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string date = ds.Tables[0].Rows[i]["Dates"].ToString();
                    DateTime dt = DateTime.Parse(date);
                    Dates[i] = dt.ToString("dd MMM");
                    Units[i] = int.Parse(ds.Tables[0].Rows[i]["TotalUnits"].ToString());
                    PutawayPerHr[i] = Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString());

                }

                result.Dates = Dates;
                result.Units = Units;
                result.PutawayPerHr = PutawayPerHr;

            }
            catch (Exception ex)
            {
            }


            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_PackProductivity([FromBody] Dashboard_PackUnits dash)
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


            Dashboard_PackUnits result = new Dashboard_PackUnits();

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PackProductivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);


                int[] Units = new int[ds.Tables[0].Rows.Count];
                double[] PackPerHr = new double[ds.Tables[0].Rows.Count];

                string[] Dates = new string[ds.Tables[0].Rows.Count];




                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string date = ds.Tables[0].Rows[i]["Dates"].ToString();
                    DateTime dt = DateTime.Parse(date);
                    Dates[i] = dt.ToString("dd MMM");
                    Units[i] = int.Parse(ds.Tables[0].Rows[i]["TotalUnits"].ToString());
                    PackPerHr[i] = Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString());

                }

                result.Dates = Dates;
                result.Units = Units;
                result.PackPerHr = PackPerHr;

            }
            catch (Exception ex)
            {
            }


            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_CycleCountProductivity([FromBody] Dashboard_CycleCounts dash)
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


            Dashboard_CycleCounts result = new Dashboard_CycleCounts();

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_CycleCountProductivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);

                int[] TotalCounts = new int[ds.Tables[0].Rows.Count];
                double[] CountsPerHr = new double[ds.Tables[0].Rows.Count];

                string[] Dates = new string[ds.Tables[0].Rows.Count];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string date = ds.Tables[0].Rows[i]["Dates"].ToString();
                    DateTime dt = DateTime.Parse(date);
                    Dates[i] = dt.ToString("dd MMM");
                    TotalCounts[i] = int.Parse(ds.Tables[0].Rows[i]["TotalCounts"].ToString());
                    CountsPerHr[i] = Convert.ToDouble(ds.Tables[0].Rows[i]["CountsPerHr"].ToString());

                }

                result.Dates = Dates;
                result.TotalCounts = TotalCounts;
                result.CountsPerHr = CountsPerHr;

            }
            catch (Exception ex)
            {
            }


            return JsonSerializer.Serialize(result);
        }




        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Asics_Dash_PickedUnits([FromBody] Asics_Dashboard_PickedUnits dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            Asics_Dashboard_PickedUnits result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            //if (dash.StartDate.Equals(dash.EndDate))
            //{


            //    SqlCommand cmd = new SqlCommand("dbo.spProductivityReport_Picks_Hourly_OneDay", sqlConnection);
            //    cmd.CommandType = CommandType.StoredProcedure;

            //    cmd.Parameters.AddWithValue("@Parm", parmvalue);

            //    SqlDataAdapter da = new SqlDataAdapter(cmd);
            //    DataSet ds = new DataSet();


            //    try
            //    {
            //        da.Fill(ds);


            //        List<string> times = new List<string>();



            //        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            //        {
            //            string time = ds.Tables[0].Rows[i]["FromTime"].ToString();
            //            DateTime dt = DateTime.Parse(time);

            //            if (times.Contains(dt.ToString("HH:mm")) == false)
            //            {
            //                times.Add(dt.ToString("HH:mm"));
            //            }

            //        }

            //        if (times.Count > 0)
            //        {
            //            int totalbatchpick = 0;
            //            int totalpick = 0;
            //            int totalchutepick = 0;

            //            Dictionary<string,int> chutepick = new Dictionary<string, int>();
            //            Dictionary<string, int> pick = new Dictionary<string, int>();
            //            Dictionary<string, int> batchpick = new Dictionary<string, int>();
            //            string[] dates = new string[times.Count];
            //            int[] totalunits = new int[times.Count];


            //          foreach( string time in times)
            //           { 
            //                for (int j = 0; j < ds.Tables[0].Rows.Count; j++)
            //                {

            //                    DateTime dt = DateTime.Parse(ds.Tables[0].Rows[j]["FromTime"].ToString());

            //                    if (time.Equals(dt.ToString("HH:mm")))
            //                    {
            //                        if (ds.Tables[0].Rows[j]["Activity"].ToString().Equals("BatchPick"))
            //                        {
            //                            batchpick.Add(time,int.Parse(ds.Tables[0].Rows[j]["NoOfUnits"].ToString()));
            //                        }
            //                        else if (ds.Tables[0].Rows[j]["Activity"].ToString().Equals("Picks"))
            //                        {
            //                            pick.Add(time, int.Parse(ds.Tables[0].Rows[j]["NoOfUnits"].ToString()));
            //                        }
            //                        else if (ds.Tables[0].Rows[j]["Activity"].ToString().Equals("ChutePick"))
            //                        {
            //                            chutepick.Add(time,int.Parse(ds.Tables[0].Rows[j]["NoOfUnits"].ToString()));
            //                        }

            //                    }
            //                }

            //            }

            //            for (int i = 0; i < times.Count; i++)
            //            {


            //                totalbatchpick = totalbatchpick + batchpick[times[i]];
            //                totalpick = totalpick + pick[times[i]];
            //                totalchutepick = totalchutepick + chutepick[times[i]];

            //                totalunits[i] = batchpick[times[i]] + pick[times[i]] + chutepick[times[i]];

            //            }


            //            result = new Asics_Dashboard_PickedUnits();
            //            result.Dates = times.ToArray();
            //            result.chutepicks = new int[] { totalchutepick};
            //            result.BatchPicks = new int[] { totalbatchpick };
            //            result.Picks = new int[] { totalpick };
            //            result.totalunits = totalunits;

            //        }

            //    }
            //    catch (Exception ex)
            //    {

            //    }
            //}
            //else
            //{


            SqlCommand cmd = new SqlCommand("dbo.spDash_PickedUnits", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);


                int[] chutepick = new int[ds.Tables[0].Rows.Count];
                int[] pick = new int[ds.Tables[0].Rows.Count];
                int[] batchpick = new int[ds.Tables[0].Rows.Count];
                string[] Dates = new string[ds.Tables[0].Rows.Count];
                int[] totalunits = new int[ds.Tables[0].Rows.Count];




                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string date = ds.Tables[0].Rows[i]["Dates"].ToString();
                    DateTime dt = DateTime.Parse(date);

                    Dates[i] = dt.ToString("dd MMM");

                    chutepick[i] = int.Parse(ds.Tables[0].Rows[i]["ChutePicks"].ToString());
                    pick[i] = int.Parse(ds.Tables[0].Rows[i]["Picks"].ToString());
                    batchpick[i] = int.Parse(ds.Tables[0].Rows[i]["BatchPick"].ToString());

                    totalunits[i] = chutepick[i] + batchpick[i] + pick[i];

                }


                result = new Asics_Dashboard_PickedUnits();
                result.Dates = Dates;
                result.chutepicks = chutepick;
                result.BatchPicks = batchpick;
                result.Picks = pick;
                result.totalunits = totalunits;


            }
            catch (Exception ex)
            {
            }
            //}

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Asics_Dash_PickedProductivity([FromBody] Asics_Dashboard_PickedUnits dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            Asics_Dashboard_PickedUnits result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

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

                    List<int> chutepicks = new List<int>();
                    List<int> batchpicks = new List<int>();
                    List<int> picks = new List<int>();

                    List<double> prodpicks = new List<double>();
                    List<double> prodchutepicks = new List<double>();
                    List<double> prodbatchpicks = new List<double>();


                    foreach (string date in dates)
                    {
                  
                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM"))) 
                            {
                                if (ds.Tables[0].Rows[i]["Activity"].ToString().Equals("Picks"))
                                {
                                    picks.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    prodpicks.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Activity"].ToString().Equals("ChutePick"))
                                {
                                    chutepicks.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    prodchutepicks.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Activity"].ToString().Equals("BatchPick"))
                                {
                                    batchpicks.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    prodbatchpicks.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString()));
                                }

                            }

                        }

                    }

                    result = new Asics_Dashboard_PickedUnits();
                    result.Dates = dates.ToArray();
                    result.BatchPicks = batchpicks.ToArray();
                    result.batchpickProductivity = prodbatchpicks.ToArray();

                    result.Picks = picks.ToArray();
                    result.pickProductivity = prodpicks.ToArray();

                    result.chutepicks = chutepicks.ToArray();
                    result.ChutepickProductivity = prodchutepicks.ToArray();
                }


            }
            catch (Exception ex)
            {
            }
            //}

            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string ShippedUnits([FromBody] Dashboard_ShippedUnits dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;
            }
            Dashboard_ShippedUnits result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);

            SqlCommand cmd = new SqlCommand("dbo.spDash_ShippedPerDay", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);

                List<string> dates = new List<string>();

                List<int> shippedQty = new List<int>();

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());
                    dates.Add(dt.ToString("dd MMM"));
                    shippedQty.Add(int.Parse(ds.Tables[0].Rows[i]["Qty"].ToString()));
                }

                result = new Dashboard_ShippedUnits();
                result.Dates = dates.ToArray();

                result.Units = shippedQty.ToArray();

            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_TotalPalletPicks([FromBody] Dashboard_PalletPicks dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;
            }
            Dashboard_PalletPicks result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);

            SqlCommand cmd = new SqlCommand("dbo.spProductivityReport_Picks_GetPLPicks", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);

                List<string> dates = new List<string>();

                List<int> PalletPicks = new List<int>();

                List<int> TotalPicks = new List<int>();

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Date"].ToString());
                    dates.Add(dt.ToString("dd MMM"));
                    PalletPicks.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["PalletPicks"]));
                    TotalPicks.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalPicks"]));
                }

                result = new Dashboard_PalletPicks();
                result.Dates = dates.ToArray();

                result.PalletPicks = PalletPicks.ToArray();
                result.TotalPicks = TotalPicks.ToArray();

            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string  GetCCA_BlendedPickRates([FromBody] CCA_Dashboard_PickedUnits dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }
            CCA_Dashboard_PickedUnits result = null;
            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_CCA_PickProductivity", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

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

                    List<int> voicepicks = new List<int>();
                    List<int> HRpicks = new List<int>();
                    List<int> Normalpicks = new List<int>();

                    List<double> prodnormalpicks = new List<double>();
                    List<double> prodVoicpicks = new List<double>();
                    List<double> prodHRpicks = new List<double>();


                    foreach (string date in dates)
                    {

                        for (int i = 0; i < count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM")))
                            {
                                if (ds.Tables[0].Rows[i]["Activity"].ToString().Equals("NormalPicks"))
                                {
                                    Normalpicks.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    prodnormalpicks.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Activity"].ToString().Equals("VPPicks"))
                                {
                                    voicepicks.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    prodVoicpicks.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Activity"].ToString().Equals("HRPicks"))
                                {
                                    HRpicks.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    prodHRpicks.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString()));
                                }

                            }

                        }

                    }

                    result = new CCA_Dashboard_PickedUnits();
                    result.Dates = dates.ToArray();
                    result.normalpicks = Normalpicks.ToArray();
                    result.normalpickProductivity = prodnormalpicks.ToArray();

                    result.voicepicks = voicepicks.ToArray();
                    result.voicpickProductivity = prodVoicpicks.ToArray();

                    result.hrpicks = HRpicks.ToArray();
                    result.hrProductivity = prodHRpicks.ToArray();
                }


            }
            catch (Exception ex)
            {
            }
            //}

            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Dash_CCA_PickTimes([FromBody] Dashboard_PickedUnits dash)
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
            Dashboard_PickedUnits result = new Dashboard_PickedUnits();
            //Productivity Pick
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_CCA_TotalPickTimes", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Parm", parmvalue);
        
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            cmd.CommandTimeout = 120;
            DataSet ds = new DataSet();
            try
            {
                da.Fill(ds);
                //string[] CostCentre = new string[ds.Tables[0].Rows.Count];


                List<string> dates = new List<string>();
                List<int> picktimes = new List<int>();
                List<int> totalTimes = new List<int>();
                // Direct Activity Date

                foreach (DataRow row in ds.Tables[0].Rows)
                {

                    DateTime dt = DateTime.Parse(row["PickDate"].ToString());

                    dates.Add(dt.ToString("dd MMM"));

                    picktimes.Add(Convert.ToInt32(row["PickHrs"]));
                    totalTimes.Add(Convert.ToInt32(row["TotalTime"]));

                }


                //result.CostCentre = CostCentre;

                result.Dates = dates.ToArray();
                result.PickTimes = picktimes.ToArray();
                result.TotalTimes = totalTimes.ToArray();
            }
            catch (Exception ex)
            {
            }
            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PutawayProd_Split([FromBody] DashBoard_Putway_split dash)
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
            SqlCommand cmd = new SqlCommand("dbo.spDash_PutawayProductivity_Split", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();
            List<string> dates2 = new List<string>();

            List<string> dates3= new List<string>();


            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            List<int> role_ForLiftDriverLines = new List<int>();
            List<int> role_PickerUnits = new List<int>();
            List<int> role_HRUnits = new List<int>();
            List<int> role_ReworkUnits = new List<int>();

            //Shift
            List<int> shift_AS00Units = new List<int>();
            List<int> shift_AT00Units = new List<int>();
            List<int> shift_AO00Units = new List<int>();
            List<int> shift_DS07Units = new List<int>();
            List<int> shift_DT00Units = new List<int>();
            List<int> shift_DS00Units = new List<int>();
            List<int> shift_DO00Units = new List<int>();



            // Team Manager
            List<int> manager_JBunits = new List<int>();
            List<int> manager_FRunits = new List<int>();
            List<int> manager_PTunits = new List<int>();
            List<int> manager_TPunits = new List<int>();

            List<double> role_ForLiftDriverprod = new List<double>();
            List<double> role_Pickerprod = new List<double>();
            List<double> role_HRprod = new List<double>();
            List<double> role_Reworkprod = new List<double>();

            //Shift
            List<double> shift_AS00prod = new List<double>();
            List<double> shift_AT00prod = new List<double>();
            List<double> shift_AO00prod = new List<double>();
            List<double> shift_DS07prod = new List<double>();
            List<double> shift_DT00prod = new List<double>();
            List<double> shift_DS00prod = new List<double>();
            List<double> shift_DO00prod = new List<double>();


            // Team Manager
            List<double> manager_JBprod = new List<double>();
            List<double> manager_FRprod = new List<double>();
            List<double> manager_PTprod = new List<double>();
            List<double> manager_TPprod = new List<double>();



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
                                if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Forklift Driver"))
                                {
                                    role_ForLiftDriverLines.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_ForLiftDriverprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["PutawayPerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Picker"))
                                {
                                    role_PickerUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_Pickerprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["PutawayPerhr"].ToString()));
                                }

                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Rework"))
                                {
                                    role_ReworkUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_Reworkprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["PutawayPerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Hireach Driver"))
                                {
                                    role_HRUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_HRprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["PutawayPerhr"].ToString()));
                                }
                            }

                        }

                        if (role_ForLiftDriverLines.Count != dateid) { role_ForLiftDriverLines.Add(0); }
                        if (role_ForLiftDriverprod.Count != dateid) { role_ForLiftDriverprod.Add(0); }
                        if (role_PickerUnits.Count != dateid) { role_PickerUnits.Add(0); }
                        if (role_Pickerprod.Count != dateid) { role_Pickerprod.Add(0); }
                        if (role_ReworkUnits.Count != dateid) { role_ReworkUnits.Add(0); }
                        if (role_Reworkprod.Count != dateid) { role_Reworkprod.Add(0); }

                        if (role_HRUnits.Count != dateid) { role_HRUnits.Add(0); }
                        if (role_HRprod.Count != dateid) { role_HRprod.Add(0); }


                        dateid++;
                    }
                    // Table 1
                }

                    if (ds.Tables[1].Rows.Count > 0)
                    {

                        for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[1].Rows[i]["Dates"].ToString());

                            string date = dt.ToString("dd MMM");

                            if (dates2.Contains(date) == false)
                            {
                                dates2.Add(date);
                            }

                        }


                                  int    dateid = 1;
                        foreach (string date in dates2)
                        {

                            for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
                            {
                                DateTime dt = DateTime.Parse(ds.Tables[1].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM")))
                            {
                                if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AS00"))
                                {
                                    shift_AS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PutawayPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AO00"))
                                {
                                    shift_AO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PutawayPerhr"].ToString()));
                                }

                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DT00"))
                                {
                                    shift_DT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PutawayPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS07"))
                                {
                                    shift_DS07Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DS07prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PutawayPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DO00"))
                                {
                                    shift_DO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PutawayPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS00"))
                                {
                                    shift_DS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PutawayPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AT00"))
                                {
                                    shift_AT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PutawayPerhr"].ToString()));
                                }
                             }

                            }

                        if (shift_AO00prod.Count != dateid) { shift_AO00prod.Add(0); }
                        if (shift_AO00Units.Count != dateid) { shift_AO00Units.Add(0); }

                        if (shift_AS00prod.Count != dateid) { shift_AS00prod.Add(0); }
                        if (shift_AS00Units.Count != dateid) { shift_AS00Units.Add(0); }

                        if (shift_DO00Units.Count != dateid) { shift_DO00Units.Add(0); }
                        if (shift_DO00prod.Count != dateid) { shift_DO00prod.Add(0); }

                        if (shift_DS07Units.Count != dateid) { shift_DS07Units.Add(0); }
                        if (shift_DS07prod.Count != dateid) { shift_DS07prod.Add(0); }


                        if (shift_DT00Units.Count != dateid) { shift_DT00Units.Add(0); }
                        if (shift_DT00prod.Count != dateid) { shift_DT00prod.Add(0); }

                        if (shift_DS00Units.Count != dateid) { shift_DS00Units.Add(0); }
                        if (shift_DS00prod.Count != dateid) { shift_DS00prod.Add(0); }

                        if (shift_AT00Units.Count != dateid) { shift_AT00Units.Add(0); }
                        if (shift_AT00prod.Count != dateid) { shift_AT00prod.Add(0); }


                        dateid++;
                     }

                    

                    }
                    // table 2
                    if (ds.Tables[2].Rows.Count > 0)
                    {

                        for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[2].Rows[i]["Dates"].ToString());

                            string date = dt.ToString("dd MMM");

                            if (dates3.Contains(date) == false)
                            {
                                dates3.Add(date);
                            }

                        }


                    int dateid = 1;
                        foreach (string date in dates3)
                        {

                        for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[2].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM")))
                            {
                                if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("JAYMEELEE BROWN"))
                                {
                                    manager_JBunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_JBprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["PutawayPerhr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("TUPOU PEAUA"))
                                {
                                    manager_TPunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_TPprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["PutawayPerhr"].ToString()));
                                }

                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("PETER TURNER"))
                                {
                                    manager_PTunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_PTprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["PutawayPerhr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("FRANS DEKKER"))
                                {
                                    manager_FRunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_FRprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["PutawayPerhr"].ToString()));
                                }
                            }
                        }

                        if (manager_JBunits.Count != dateid) { manager_JBunits.Add(0); }
                        if (manager_JBprod.Count != dateid) { manager_JBprod.Add(0); }

                        if (manager_TPunits.Count != dateid) { manager_TPunits.Add(0); }
                        if (manager_TPprod.Count != dateid) { manager_TPprod.Add(0); }

                        if (manager_PTunits.Count != dateid) { manager_PTunits.Add(0); }
                        if (manager_PTprod.Count != dateid) { manager_PTprod.Add(0); }

                        if (manager_FRunits.Count != dateid) { manager_FRunits.Add(0); }
                        if (manager_FRprod.Count != dateid) { manager_FRprod.Add(0); }
                        dateid++;

                        }



                    }

                    result = new DashBoard_Putway_split();
                    result.dates_Roles = dates.ToArray();
                    result.dates_Shift = dates2.ToArray();
                    result.dates_Manager = dates3.ToArray();

                    result.ForkliftDriverPutaway = role_ForLiftDriverprod.ToArray();
                    result.ForkliftDriverUnits = role_ForLiftDriverLines.ToArray();

                    result.Role_ReworkUnits = role_ReworkUnits.ToArray();
                    result.Role_ReworkPutaway = role_Reworkprod.ToArray();


                    result.Role_PickerUnits = role_PickerUnits.ToArray();
                    result.Role_PickerPutaway = role_Pickerprod.ToArray();

                    result.Role_HRDriverUnits = role_HRUnits.ToArray();
                    result.Role_HRDriverPutaway = role_HRprod.ToArray();
                    //shift

                    result.Shift_AO00Putaway = shift_AO00prod.ToArray();
                    result.shift_AO00Units = shift_AO00Units.ToArray();

                    result.shift_DT00Putaway = shift_DT00prod.ToArray();
                    result.shift_DT00Units = shift_DT00Units.ToArray();

                    result.Shift_DO00Putaway = shift_DO00prod.ToArray();
                    result.shift_DO00Units = shift_DO00Units.ToArray();

                    result.Shift_DS07Putaway = shift_DS07prod.ToArray();
                    result.shift_DS07Units = shift_DS07Units.ToArray();

                    result.Shift_DS00Putaway = shift_DS00prod.ToArray();
                    result.shift_DS00Units = shift_DS00Units.ToArray();

                    result.Shift_AS00Putaway = shift_AS00prod.ToArray();
                    result.shift_AS00Units = shift_AS00Units.ToArray();

                    result.Shift_AT00Putaway = shift_AT00prod.ToArray();
                    result.shift_AT00Units = shift_AT00Units.ToArray();

                    //TeaM
                    result.Manager_FDUnits = manager_FRunits.ToArray();
                    result.Manager_FDPutaway = manager_FRprod.ToArray();

                    result.Manager_JBUnits = manager_JBunits.ToArray();
                    result.Manager_JBPutaway = manager_JBprod.ToArray();


                    result.Manager_TPUnits = manager_TPunits.ToArray();
                    result.Manager_TPPutaway = manager_TPprod.ToArray();

                    result.Manager_PTUnits = manager_PTunits.ToArray();
                    result.Manager_PtPutaway = manager_PTprod.ToArray();


                
            }
            catch (Exception ex)
            {
            }
            //}

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_MoveProd_Split([FromBody] DashBoard_Putway_split dash)
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
            SqlCommand cmd = new SqlCommand("dbo.spDash_MoveProductivity_Split", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();
            List<string> dates2 = new List<string>();

            List<string> dates3 = new List<string>();


            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            List<int> role_ForLiftDriverLines = new List<int>();
            List<int> role_PickerUnits = new List<int>();
            List<int> role_HRUnits = new List<int>();
            List<int> role_ReworkUnits = new List<int>();

            //Shift
            List<int> shift_AS00Units = new List<int>();
            List<int> shift_AT00Units = new List<int>();
            List<int> shift_AO00Units = new List<int>();
            List<int> shift_DS07Units = new List<int>();
            List<int> shift_DT00Units = new List<int>();
            List<int> shift_DS00Units = new List<int>();
            List<int> shift_DO00Units = new List<int>();



            // Team Manager
            List<int> manager_JBunits = new List<int>();
            List<int> manager_FRunits = new List<int>();
            List<int> manager_PTunits = new List<int>();
            List<int> manager_TPunits = new List<int>();

            List<double> role_ForLiftDriverprod = new List<double>();
            List<double> role_Pickerprod = new List<double>();
            List<double> role_HRprod = new List<double>();
            List<double> role_Reworkprod = new List<double>();

            //Shift
            List<double> shift_AS00prod = new List<double>();
            List<double> shift_AT00prod = new List<double>();
            List<double> shift_AO00prod = new List<double>();
            List<double> shift_DS07prod = new List<double>();
            List<double> shift_DT00prod = new List<double>();
            List<double> shift_DS00prod = new List<double>();
            List<double> shift_DO00prod = new List<double>();


            // Team Manager
            List<double> manager_JBprod = new List<double>();
            List<double> manager_FRprod = new List<double>();
            List<double> manager_PTprod = new List<double>();
            List<double> manager_TPprod = new List<double>();



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
                                if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Forklift Driver"))
                                {
                                    role_ForLiftDriverLines.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_ForLiftDriverprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Picker"))
                                {
                                    role_PickerUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_Pickerprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["MovePerhr"].ToString()));
                                }

                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Rework"))
                                {
                                    role_ReworkUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_Reworkprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Hireach Driver"))
                                {
                                    role_HRUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_HRprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["MovePerhr"].ToString()));
                                }
                            }

                        }

                        if (role_ForLiftDriverLines.Count != dateid) { role_ForLiftDriverLines.Add(0); }
                        if (role_ForLiftDriverprod.Count != dateid) { role_ForLiftDriverprod.Add(0); }
                        if (role_PickerUnits.Count != dateid) { role_PickerUnits.Add(0); }
                        if (role_Pickerprod.Count != dateid) { role_Pickerprod.Add(0); }
                        if (role_ReworkUnits.Count != dateid) { role_ReworkUnits.Add(0); }
                        if (role_Reworkprod.Count != dateid) { role_Reworkprod.Add(0); }

                        if (role_HRUnits.Count != dateid) { role_HRUnits.Add(0); }
                        if (role_HRprod.Count != dateid) { role_HRprod.Add(0); }


                        dateid++;
                    }
                    // Table 1
                }

                if (ds.Tables[1].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[1].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates2.Contains(date) == false)
                        {
                            dates2.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates2)
                    {

                        for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[1].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM")))
                            {
                                if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AS00"))
                                {
                                    shift_AS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AO00"))
                                {
                                    shift_AO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }

                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DT00"))
                                {
                                    shift_DT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS07"))
                                {
                                    shift_DS07Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DS07prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DO00"))
                                {
                                    shift_DO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS00"))
                                {
                                    shift_DS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AT00"))
                                {
                                    shift_AT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                            }

                        }

                        if (shift_AO00prod.Count != dateid) { shift_AO00prod.Add(0); }
                        if (shift_AO00Units.Count != dateid) { shift_AO00Units.Add(0); }

                        if (shift_AS00prod.Count != dateid) { shift_AS00prod.Add(0); }
                        if (shift_AS00Units.Count != dateid) { shift_AS00Units.Add(0); }

                        if (shift_DO00Units.Count != dateid) { shift_DO00Units.Add(0); }
                        if (shift_DO00prod.Count != dateid) { shift_DO00prod.Add(0); }

                        if (shift_DS07Units.Count != dateid) { shift_DS07Units.Add(0); }
                        if (shift_DS07prod.Count != dateid) { shift_DS07prod.Add(0); }


                        if (shift_DT00Units.Count != dateid) { shift_DT00Units.Add(0); }
                        if (shift_DT00prod.Count != dateid) { shift_DT00prod.Add(0); }

                        if (shift_DS00Units.Count != dateid) { shift_DS00Units.Add(0); }
                        if (shift_DS00prod.Count != dateid) { shift_DS00prod.Add(0); }

                        if (shift_AT00Units.Count != dateid) { shift_AT00Units.Add(0); }
                        if (shift_AT00prod.Count != dateid) { shift_AT00prod.Add(0); }


                        dateid++;
                    }



                }
                // table 2
                if (ds.Tables[2].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[2].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates3.Contains(date) == false)
                        {
                            dates3.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates3)
                    {

                        for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[2].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM")))
                            {
                                if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("JAYMEELEE BROWN"))
                                {
                                    manager_JBunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_JBprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("TUPOU PEAUA"))
                                {
                                    manager_TPunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_TPprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["MovePerhr"].ToString()));
                                }

                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("PETER TURNER"))
                                {
                                    manager_PTunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_PTprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("FRANS DEKKER"))
                                {
                                    manager_FRunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_FRprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["MovePerhr"].ToString()));
                                }
                            }
                        }

                        if (manager_JBunits.Count != dateid) { manager_JBunits.Add(0); }
                        if (manager_JBprod.Count != dateid) { manager_JBprod.Add(0); }

                        if (manager_TPunits.Count != dateid) { manager_TPunits.Add(0); }
                        if (manager_TPprod.Count != dateid) { manager_TPprod.Add(0); }

                        if (manager_PTunits.Count != dateid) { manager_PTunits.Add(0); }
                        if (manager_PTprod.Count != dateid) { manager_PTprod.Add(0); }

                        if (manager_FRunits.Count != dateid) { manager_FRunits.Add(0); }
                        if (manager_FRprod.Count != dateid) { manager_FRprod.Add(0); }
                        dateid++;

                    }



                }

                result = new DashBoard_Putway_split();
                result.dates_Roles = dates.ToArray();
                result.dates_Shift = dates2.ToArray();
                result.dates_Manager = dates3.ToArray();

                result.ForkliftDriverPutaway = role_ForLiftDriverprod.ToArray();
                result.ForkliftDriverUnits = role_ForLiftDriverLines.ToArray();

                result.Role_ReworkUnits = role_ReworkUnits.ToArray();
                result.Role_ReworkPutaway = role_Reworkprod.ToArray();


                result.Role_PickerUnits = role_PickerUnits.ToArray();
                result.Role_PickerPutaway = role_Pickerprod.ToArray();

                result.Role_HRDriverUnits = role_HRUnits.ToArray();
                result.Role_HRDriverPutaway = role_HRprod.ToArray();
                //shift

                result.Shift_AO00Putaway = shift_AO00prod.ToArray();
                result.shift_AO00Units = shift_AO00Units.ToArray();

                result.shift_DT00Putaway = shift_DT00prod.ToArray();
                result.shift_DT00Units = shift_DT00Units.ToArray();

                result.Shift_DO00Putaway = shift_DO00prod.ToArray();
                result.shift_DO00Units = shift_DO00Units.ToArray();

                result.Shift_DS07Putaway = shift_DS07prod.ToArray();
                result.shift_DS07Units = shift_DS07Units.ToArray();

                result.Shift_DS00Putaway = shift_DS00prod.ToArray();
                result.shift_DS00Units = shift_DS00Units.ToArray();

                result.Shift_AS00Putaway = shift_AS00prod.ToArray();
                result.shift_AS00Units = shift_AS00Units.ToArray();

                result.Shift_AT00Putaway = shift_AT00prod.ToArray();
                result.shift_AT00Units = shift_AT00Units.ToArray();

                //TeaM
                result.Manager_FDUnits = manager_FRunits.ToArray();
                result.Manager_FDPutaway = manager_FRprod.ToArray();

                result.Manager_JBUnits = manager_JBunits.ToArray();
                result.Manager_JBPutaway = manager_JBprod.ToArray();


                result.Manager_TPUnits = manager_TPunits.ToArray();
                result.Manager_TPPutaway = manager_TPprod.ToArray();

                result.Manager_PTUnits = manager_PTunits.ToArray();
                result.Manager_PtPutaway = manager_PTprod.ToArray();



            }
            catch (Exception ex)
            {
            }
            //}

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_RepProd_Split([FromBody] DashBoard_Putway_split dash)
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
            SqlCommand cmd = new SqlCommand("dbo.spDash_RepProductivity_Split", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();
            List<string> dates2 = new List<string>();

            List<string> dates3 = new List<string>();


            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            List<int> role_ForLiftDriverLines = new List<int>();
            List<int> role_PickerUnits = new List<int>();
            List<int> role_HRUnits = new List<int>();
            List<int> role_ReworkUnits = new List<int>();

            //Shift
            List<int> shift_AS00Units = new List<int>();
            List<int> shift_AT00Units = new List<int>();
            List<int> shift_AO00Units = new List<int>();
            List<int> shift_DS07Units = new List<int>();
            List<int> shift_DT00Units = new List<int>();
            List<int> shift_DS00Units = new List<int>();
            List<int> shift_DO00Units = new List<int>();



            // Team Manager
            List<int> manager_JBunits = new List<int>();
            List<int> manager_FRunits = new List<int>();
            List<int> manager_PTunits = new List<int>();
            List<int> manager_TPunits = new List<int>();

            List<double> role_ForLiftDriverprod = new List<double>();
            List<double> role_Pickerprod = new List<double>();
            List<double> role_HRprod = new List<double>();
            List<double> role_Reworkprod = new List<double>();

            //Shift
            List<double> shift_AS00prod = new List<double>();
            List<double> shift_AT00prod = new List<double>();
            List<double> shift_AO00prod = new List<double>();
            List<double> shift_DS07prod = new List<double>();
            List<double> shift_DT00prod = new List<double>();
            List<double> shift_DS00prod = new List<double>();
            List<double> shift_DO00prod = new List<double>();


            // Team Manager
            List<double> manager_JBprod = new List<double>();
            List<double> manager_FRprod = new List<double>();
            List<double> manager_PTprod = new List<double>();
            List<double> manager_TPprod = new List<double>();



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
                                if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Forklift Driver"))
                                {
                                    role_ForLiftDriverLines.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_ForLiftDriverprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["RepPerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Picker"))
                                {
                                    role_PickerUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_Pickerprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["RepPerhr"].ToString()));
                                }

                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Rework"))
                                {
                                    role_ReworkUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_Reworkprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["RepPerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Hireach Driver"))
                                {
                                    role_HRUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_HRprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["RepPerhr"].ToString()));
                                }
                            }

                        }

                        if (role_ForLiftDriverLines.Count != dateid) { role_ForLiftDriverLines.Add(0); }
                        if (role_ForLiftDriverprod.Count != dateid) { role_ForLiftDriverprod.Add(0); }
                        if (role_PickerUnits.Count != dateid) { role_PickerUnits.Add(0); }
                        if (role_Pickerprod.Count != dateid) { role_Pickerprod.Add(0); }
                        if (role_ReworkUnits.Count != dateid) { role_ReworkUnits.Add(0); }
                        if (role_Reworkprod.Count != dateid) { role_Reworkprod.Add(0); }

                        if (role_HRUnits.Count != dateid) { role_HRUnits.Add(0); }
                        if (role_HRprod.Count != dateid) { role_HRprod.Add(0); }


                        dateid++;
                    }
                    // Table 1
                }

                if (ds.Tables[1].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[1].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates2.Contains(date) == false)
                        {
                            dates2.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates2)
                    {

                        for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[1].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM")))
                            {
                                if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AS00"))
                                {
                                    shift_AS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["RepPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AO00"))
                                {
                                    shift_AO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["RepPerhr"].ToString()));
                                }

                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DT00"))
                                {
                                    shift_DT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["RepPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS07"))
                                {
                                    shift_DS07Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DS07prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["RepPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DO00"))
                                {
                                    shift_DO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["RepPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS00"))
                                {
                                    shift_DS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["RepPerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AT00"))
                                {
                                    shift_AT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["RepPerhr"].ToString()));
                                }
                            }

                        }

                        if (shift_AO00prod.Count != dateid) { shift_AO00prod.Add(0); }
                        if (shift_AO00Units.Count != dateid) { shift_AO00Units.Add(0); }

                        if (shift_AS00prod.Count != dateid) { shift_AS00prod.Add(0); }
                        if (shift_AS00Units.Count != dateid) { shift_AS00Units.Add(0); }

                        if (shift_DO00Units.Count != dateid) { shift_DO00Units.Add(0); }
                        if (shift_DO00prod.Count != dateid) { shift_DO00prod.Add(0); }

                        if (shift_DS07Units.Count != dateid) { shift_DS07Units.Add(0); }
                        if (shift_DS07prod.Count != dateid) { shift_DS07prod.Add(0); }


                        if (shift_DT00Units.Count != dateid) { shift_DT00Units.Add(0); }
                        if (shift_DT00prod.Count != dateid) { shift_DT00prod.Add(0); }

                        if (shift_DS00Units.Count != dateid) { shift_DS00Units.Add(0); }
                        if (shift_DS00prod.Count != dateid) { shift_DS00prod.Add(0); }

                        if (shift_AT00Units.Count != dateid) { shift_AT00Units.Add(0); }
                        if (shift_AT00prod.Count != dateid) { shift_AT00prod.Add(0); }


                        dateid++;
                    }



                }
                // table 2
                if (ds.Tables[2].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[2].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates3.Contains(date) == false)
                        {
                            dates3.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates3)
                    {

                        for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[2].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM")))
                            {
                                if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("JAYMEELEE BROWN"))
                                {
                                    manager_JBunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_JBprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["RepPerhr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("TUPOU PEAUA"))
                                {
                                    manager_TPunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_TPprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["RepPerhr"].ToString()));
                                }

                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("PETER TURNER"))
                                {
                                    manager_PTunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_PTprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["RepPerhr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("FRANS DEKKER"))
                                {
                                    manager_FRunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_FRprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["RepPerhr"].ToString()));
                                }
                            }
                        }

                        if (manager_JBunits.Count != dateid) { manager_JBunits.Add(0); }
                        if (manager_JBprod.Count != dateid) { manager_JBprod.Add(0); }

                        if (manager_TPunits.Count != dateid) { manager_TPunits.Add(0); }
                        if (manager_TPprod.Count != dateid) { manager_TPprod.Add(0); }

                        if (manager_PTunits.Count != dateid) { manager_PTunits.Add(0); }
                        if (manager_PTprod.Count != dateid) { manager_PTprod.Add(0); }

                        if (manager_FRunits.Count != dateid) { manager_FRunits.Add(0); }
                        if (manager_FRprod.Count != dateid) { manager_FRprod.Add(0); }
                        dateid++;

                    }



                }

                result = new DashBoard_Putway_split();
                result.dates_Roles = dates.ToArray();
                result.dates_Shift = dates2.ToArray();
                result.dates_Manager = dates3.ToArray();

                result.ForkliftDriverPutaway = role_ForLiftDriverprod.ToArray();
                result.ForkliftDriverUnits = role_ForLiftDriverLines.ToArray();

                result.Role_ReworkUnits = role_ReworkUnits.ToArray();
                result.Role_ReworkPutaway = role_Reworkprod.ToArray();


                result.Role_PickerUnits = role_PickerUnits.ToArray();
                result.Role_PickerPutaway = role_Pickerprod.ToArray();

                result.Role_HRDriverUnits = role_HRUnits.ToArray();
                result.Role_HRDriverPutaway = role_HRprod.ToArray();
                //shift

                result.Shift_AO00Putaway = shift_AO00prod.ToArray();
                result.shift_AO00Units = shift_AO00Units.ToArray();

                result.shift_DT00Putaway = shift_DT00prod.ToArray();
                result.shift_DT00Units = shift_DT00Units.ToArray();

                result.Shift_DO00Putaway = shift_DO00prod.ToArray();
                result.shift_DO00Units = shift_DO00Units.ToArray();

                result.Shift_DS07Putaway = shift_DS07prod.ToArray();
                result.shift_DS07Units = shift_DS07Units.ToArray();

                result.Shift_DS00Putaway = shift_DS00prod.ToArray();
                result.shift_DS00Units = shift_DS00Units.ToArray();

                result.Shift_AS00Putaway = shift_AS00prod.ToArray();
                result.shift_AS00Units = shift_AS00Units.ToArray();

                result.Shift_AT00Putaway = shift_AT00prod.ToArray();
                result.shift_AT00Units = shift_AT00Units.ToArray();

                //TeaM
                result.Manager_FDUnits = manager_FRunits.ToArray();
                result.Manager_FDPutaway = manager_FRprod.ToArray();

                result.Manager_JBUnits = manager_JBunits.ToArray();
                result.Manager_JBPutaway = manager_JBprod.ToArray();


                result.Manager_TPUnits = manager_TPunits.ToArray();
                result.Manager_TPPutaway = manager_TPprod.ToArray();

                result.Manager_PTUnits = manager_PTunits.ToArray();
                result.Manager_PtPutaway = manager_PTprod.ToArray();



            }
            catch (Exception ex)
            {
            }
            //}

            return JsonSerializer.Serialize(result);
        }
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCCA_PickProd_Split([FromBody] DashBoard_Putway_split dash)
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
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_Split", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> dates = new List<string>();
            List<string> dates2 = new List<string>();

            List<string> dates3 = new List<string>();


            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            List<int> role_ForLiftDriverLines = new List<int>();
            List<int> role_PickerUnits = new List<int>();
            List<int> role_HRUnits = new List<int>();
            List<int> role_ReworkUnits = new List<int>();

            //Shift
            List<int> shift_AS00Units = new List<int>();
            List<int> shift_AT00Units = new List<int>();
            List<int> shift_AO00Units = new List<int>();
            List<int> shift_DS07Units = new List<int>();
            List<int> shift_DT00Units = new List<int>();
            List<int> shift_DS00Units = new List<int>();
            List<int> shift_DO00Units = new List<int>();



            // Team Manager
            List<int> manager_JBunits = new List<int>();
            List<int> manager_FRunits = new List<int>();
            List<int> manager_PTunits = new List<int>();
            List<int> manager_TPunits = new List<int>();

            List<double> role_ForLiftDriverprod = new List<double>();
            List<double> role_Pickerprod = new List<double>();
            List<double> role_HRprod = new List<double>();
            List<double> role_Reworkprod = new List<double>();

            //Shift
            List<double> shift_AS00prod = new List<double>();
            List<double> shift_AT00prod = new List<double>();
            List<double> shift_AO00prod = new List<double>();
            List<double> shift_DS07prod = new List<double>();
            List<double> shift_DT00prod = new List<double>();
            List<double> shift_DS00prod = new List<double>();
            List<double> shift_DO00prod = new List<double>();


            // Team Manager
            List<double> manager_JBprod = new List<double>();
            List<double> manager_FRprod = new List<double>();
            List<double> manager_PTprod = new List<double>();
            List<double> manager_TPprod = new List<double>();



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
                                if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Forklift Driver"))
                                {
                                    role_ForLiftDriverLines.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_ForLiftDriverprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["PickPerHr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Picker"))
                                {
                                    role_PickerUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_Pickerprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["PickPerHr"].ToString()));
                                }

                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Rework"))
                                {
                                    role_ReworkUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_Reworkprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["PickPerHr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["Role"].ToString().Equals("Hireach Driver"))
                                {
                                    role_HRUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalUnits"]));
                                    role_HRprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["PickPerHr"].ToString()));
                                }
                            }

                        }

                        if (role_ForLiftDriverLines.Count != dateid) { role_ForLiftDriverLines.Add(0); }
                        if (role_ForLiftDriverprod.Count != dateid) { role_ForLiftDriverprod.Add(0); }
                        if (role_PickerUnits.Count != dateid) { role_PickerUnits.Add(0); }
                        if (role_Pickerprod.Count != dateid) { role_Pickerprod.Add(0); }
                        if (role_ReworkUnits.Count != dateid) { role_ReworkUnits.Add(0); }
                        if (role_Reworkprod.Count != dateid) { role_Reworkprod.Add(0); }

                        if (role_HRUnits.Count != dateid) { role_HRUnits.Add(0); }
                        if (role_HRprod.Count != dateid) { role_HRprod.Add(0); }


                        dateid++;
                    }
                    // Table 1
                }

                if (ds.Tables[1].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[1].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates2.Contains(date) == false)
                        {
                            dates2.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates2)
                    {

                        for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[1].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM")))
                            {
                                if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AS00"))
                                {
                                    shift_AS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PickPerHr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AO00"))
                                {
                                    shift_AO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PickPerHr"].ToString()));
                                }

                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DT00"))
                                {
                                    shift_DT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PickPerHr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS07"))
                                {
                                    shift_DS07Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DS07prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PickPerHr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DO00"))
                                {
                                    shift_DO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PickPerHr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS00"))
                                {
                                    shift_DS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_DS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PickPerHr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AT00"))
                                {
                                    shift_AT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalUnits"]));
                                    shift_AT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["PickPerHr"].ToString()));
                                }
                            }

                        }

                        if (shift_AO00prod.Count != dateid) { shift_AO00prod.Add(0); }
                        if (shift_AO00Units.Count != dateid) { shift_AO00Units.Add(0); }

                        if (shift_AS00prod.Count != dateid) { shift_AS00prod.Add(0); }
                        if (shift_AS00Units.Count != dateid) { shift_AS00Units.Add(0); }

                        if (shift_DO00Units.Count != dateid) { shift_DO00Units.Add(0); }
                        if (shift_DO00prod.Count != dateid) { shift_DO00prod.Add(0); }

                        if (shift_DS07Units.Count != dateid) { shift_DS07Units.Add(0); }
                        if (shift_DS07prod.Count != dateid) { shift_DS07prod.Add(0); }


                        if (shift_DT00Units.Count != dateid) { shift_DT00Units.Add(0); }
                        if (shift_DT00prod.Count != dateid) { shift_DT00prod.Add(0); }

                        if (shift_DS00Units.Count != dateid) { shift_DS00Units.Add(0); }
                        if (shift_DS00prod.Count != dateid) { shift_DS00prod.Add(0); }

                        if (shift_AT00Units.Count != dateid) { shift_AT00Units.Add(0); }
                        if (shift_AT00prod.Count != dateid) { shift_AT00prod.Add(0); }


                        dateid++;
                    }



                }
                // table 2
                if (ds.Tables[2].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[2].Rows[i]["Dates"].ToString());

                        string date = dt.ToString("dd MMM");

                        if (dates3.Contains(date) == false)
                        {
                            dates3.Add(date);
                        }

                    }


                    int dateid = 1;
                    foreach (string date in dates3)
                    {

                        for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                        {
                            DateTime dt = DateTime.Parse(ds.Tables[2].Rows[i]["Dates"].ToString());



                            if (date.Equals(dt.ToString("dd MMM")))
                            {
                                if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("JAYMEELEE BROWN"))
                                {
                                    manager_JBunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_JBprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["PickPerHr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("TUPOU PEAUA"))
                                {
                                    manager_TPunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_TPprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["PickPerHr"].ToString()));
                                }

                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("PETER TURNER"))
                                {
                                    manager_PTunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_PTprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["PickPerHr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("FRANS DEKKER"))
                                {
                                    manager_FRunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalUnits"]));
                                    manager_FRprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["PickPerHr"].ToString()));
                                }
                            }
                        }

                        if (manager_JBunits.Count != dateid) { manager_JBunits.Add(0); }
                        if ( manager_JBprod.Count != dateid) { manager_JBprod.Add(0); }

                        if (manager_TPunits.Count != dateid) { manager_TPunits.Add(0); }
                        if (manager_TPprod.Count != dateid) { manager_TPprod.Add(0); }

                        if (manager_PTunits.Count != dateid) { manager_PTunits.Add(0); }
                        if (manager_PTprod.Count != dateid) { manager_PTprod.Add(0); }

                        if (manager_FRunits.Count != dateid) { manager_FRunits.Add(0); }
                        if (manager_FRprod.Count != dateid) { manager_FRprod.Add(0); }
                        dateid++;

                    }



                }

                result = new DashBoard_Putway_split();
                result.dates_Roles = dates.ToArray();
                result.dates_Shift = dates2.ToArray();
                result.dates_Manager = dates3.ToArray();

                result.ForkliftDriverPutaway = role_ForLiftDriverprod.ToArray();
                result.ForkliftDriverUnits = role_ForLiftDriverLines.ToArray();

                result.Role_ReworkUnits = role_ReworkUnits.ToArray();
                result.Role_ReworkPutaway = role_Reworkprod.ToArray();


                result.Role_PickerUnits = role_PickerUnits.ToArray();
                result.Role_PickerPutaway = role_Pickerprod.ToArray();

                result.Role_HRDriverUnits = role_HRUnits.ToArray();
                result.Role_HRDriverPutaway = role_HRprod.ToArray();
                //shift

                result.Shift_AO00Putaway = shift_AO00prod.ToArray();
                result.shift_AO00Units = shift_AO00Units.ToArray();

                result.shift_DT00Putaway = shift_DT00prod.ToArray();
                result.shift_DT00Units = shift_DT00Units.ToArray();

                result.Shift_DO00Putaway = shift_DO00prod.ToArray();
                result.shift_DO00Units = shift_DO00Units.ToArray();

                result.Shift_DS07Putaway = shift_DS07prod.ToArray();
                result.shift_DS07Units = shift_DS07Units.ToArray();

                result.Shift_DS00Putaway = shift_DS00prod.ToArray();
                result.shift_DS00Units = shift_DS00Units.ToArray();

                result.Shift_AS00Putaway = shift_AS00prod.ToArray();
                result.shift_AS00Units = shift_AS00Units.ToArray();

                result.Shift_AT00Putaway = shift_AT00prod.ToArray();
                result.shift_AT00Units = shift_AT00Units.ToArray();

                //TeaM
                result.Manager_FDUnits = manager_FRunits.ToArray();
                result.Manager_FDPutaway = manager_FRprod.ToArray();

                result.Manager_JBUnits = manager_JBunits.ToArray();
                result.Manager_JBPutaway = manager_JBprod.ToArray();


                result.Manager_TPUnits = manager_TPunits.ToArray();
                result.Manager_TPPutaway = manager_TPprod.ToArray();

                result.Manager_PTUnits = manager_PTunits.ToArray();
                result.Manager_PtPutaway = manager_PTprod.ToArray();



            }
            catch (Exception ex)
            {
            }
            //}

            return JsonSerializer.Serialize(result);
        }




        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DashBoardGetPutaway_PerUser([FromBody] DashBoard_Putway_split lt)
        {
            if (!(string.IsNullOrEmpty(lt.Site)))
            {
                WareHouse.WarehouseSite = lt.Site;

            }

            DateTime datetime1 = DateTime.Parse(lt.StartDate);
            lt.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(lt.EndDate);
            lt.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = lt.StartDate + lt.EndDate;

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[lt.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PutawayProductivity_PerUser", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 420;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DashBoard_Putway_split result = new DashBoard_Putway_split();

            try
            {
                da.Fill(ds);


                int[] totallines = new int[ds.Tables[0].Rows.Count];
                string[] names = new string[ds.Tables[0].Rows.Count];



                if (ds.Tables[0].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {

                        totallines[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["TotalPutaways"]);

                        names[i] = ds.Tables[0].Rows[i]["Name"].ToString();


                    }

                }


                result.Names = names;
                result.lines = totallines;

            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DashBoardGetMove_PerUser([FromBody] DashBoard_Putway_split lt)
        {
            if (!(string.IsNullOrEmpty(lt.Site)))
            {
                WareHouse.WarehouseSite = lt.Site;

            }

            DateTime datetime1 = DateTime.Parse(lt.StartDate);
            lt.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(lt.EndDate);
            lt.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = lt.StartDate + lt.EndDate;

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[lt.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_MoveProductivity_PerUser", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 420;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DashBoard_Putway_split result = new DashBoard_Putway_split();

            try
            {
                da.Fill(ds);


                int[] totallines = new int[ds.Tables[0].Rows.Count];
                string[] names = new string[ds.Tables[0].Rows.Count];



                if (ds.Tables[0].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {

                        totallines[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["TotalMoves"]);

                        names[i] = ds.Tables[0].Rows[i]["Name"].ToString();


                    }

                }


                result.Names = names;
                result.lines = totallines;

            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DashBoardGetRep_PerUser([FromBody] DashBoard_Putway_split lt)
        {
            if (!(string.IsNullOrEmpty(lt.Site)))
            {
                WareHouse.WarehouseSite = lt.Site;

            }

            DateTime datetime1 = DateTime.Parse(lt.StartDate);
            lt.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(lt.EndDate);
            lt.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = lt.StartDate + lt.EndDate;

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[lt.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_RepProductivity_PerUser", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 420;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DashBoard_Putway_split result = new DashBoard_Putway_split();

            try
            {
                da.Fill(ds);


                int[] totallines = new int[ds.Tables[0].Rows.Count];
                string[] names = new string[ds.Tables[0].Rows.Count];



                if (ds.Tables[0].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {

                        totallines[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["TotalRep"]);

                        names[i] = ds.Tables[0].Rows[i]["Name"].ToString();


                    }

                }


                result.Names = names;
                result.lines = totallines;

            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DashBoardGetPick_PerUser([FromBody] DashBoard_Putway_split lt)
        {
            if (!(string.IsNullOrEmpty(lt.Site)))
            {
                WareHouse.WarehouseSite = lt.Site;

            }

            DateTime datetime1 = DateTime.Parse(lt.StartDate);
            lt.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(lt.EndDate);
            lt.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = lt.StartDate + lt.EndDate;

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[lt.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickProductivity_PerUser", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 420;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DashBoard_Putway_split result = new DashBoard_Putway_split();

            try
            {
                da.Fill(ds);


                int[] totallines = new int[ds.Tables[0].Rows.Count];
                string[] names = new string[ds.Tables[0].Rows.Count];



                if (ds.Tables[0].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {

                        totallines[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["TotalPick"]);

                        names[i] = ds.Tables[0].Rows[i]["Name"].ToString();


                    }

                }


                result.Names = names;
                result.lines = totallines;

            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }






    }
}
