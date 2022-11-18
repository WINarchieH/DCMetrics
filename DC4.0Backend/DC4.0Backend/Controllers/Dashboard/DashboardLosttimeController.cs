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
    public class DashboardLosttimeController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DashBoardGetLostTime([FromBody] LostTimeDashboard lt)
        {
            if (!(string.IsNullOrEmpty(lt.Site)))
            {
                WareHouse.WarehouseSite = lt.Site;

            }

            DateTime datetime1 = DateTime.Parse(lt.FromDate);
            lt.FromDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(lt.ToDate);
            lt.ToDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = lt.FromDate + lt.ToDate;

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[lt.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_LostTime", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.CommandTimeout = 420;

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            LostTimeDashboard result = new LostTimeDashboard();
            
            try
            {
                da.Fill(ds);

                int[] StartLostTime = new int[ds.Tables[0].Rows.Count];
                int[] EndLostTime = new int[ds.Tables[0].Rows.Count];
                int[] ShortBreakLostTime = new int[ds.Tables[0].Rows.Count];
                int[] LongBreakLostTime = new int[ds.Tables[0].Rows.Count];
                string[] Date = new string[ds.Tables[0].Rows.Count];


                List<int[]> data = new List<int[]>();

                if (ds.Tables[0].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {



                        StartLostTime[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["StartLostTime"]);
                        EndLostTime[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["EndLostTime"]);
                        ShortBreakLostTime[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["ShortBreakLostTime"]);
                        LongBreakLostTime[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["LongBreakLostTime"]);
                        Date[i] = ds.Tables[0].Rows[i]["StartDate"].ToString();
                        DateTime datetime3 = DateTime.Parse(Date[i]);
                        Date[i] = datetime3.ToString("dd MMM");


                    }

                }


                result.ShortBreakLostTime = ShortBreakLostTime;
                result.LongBreakLostTime = LongBreakLostTime;
                result.StartLostTime = StartLostTime;
                result.EndLostTime = EndLostTime;
                result.Date = Date;

            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DashBoardGetLostTime_PerUser([FromBody] LostTimeDashboard lt)
        {
            if (!(string.IsNullOrEmpty(lt.Site)))
            {
                WareHouse.WarehouseSite = lt.Site;

            }

            DateTime datetime1 = DateTime.Parse(lt.FromDate);
            lt.FromDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(lt.ToDate);
            lt.ToDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = lt.FromDate + lt.ToDate;

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[lt.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_LostTime_PerUser", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 420;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            LostTimeDashboard result = new LostTimeDashboard();

            try
            {
                da.Fill(ds);


                int[] totalLostTime = new int[ds.Tables[0].Rows.Count];
                string[] UserID = new string[ds.Tables[0].Rows.Count];



                if (ds.Tables[0].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {



                        totalLostTime[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["TotalLostTime"]);

                        UserID[i] = ds.Tables[0].Rows[i]["UserID"].ToString();


                    }

                }


                result.UserID = UserID;
                result.TotalLostTime= totalLostTime;

            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DashBoardGetLostTimeAll([FromBody] DashBoard_LostTime_split dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;
            }
            DashBoard_LostTime_split result = null;
            DateTime datetime1 = DateTime.Parse(dash.FromDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.ToDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");
            string parmvalue = dash.StartDate + dash.EndDate;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_LostTime_CCA_Dashboard", sqlConnection);
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
            List<int> role_cleanerUnits = new List<int>();
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
                                if (ds.Tables[0].Rows[i]["UserRole"].ToString().Equals("Forklift Driver"))
                                {
                                    role_ForLiftDriverLines.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalLostTime"]));
                                    // role_ForLiftDriverprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["UserRole"].ToString().Equals("Picker"))
                                {
                                    role_PickerUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalLostTime"]));
                                    // role_Pickerprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["UserRole"].ToString().Equals("Rework"))
                                {
                                    role_ReworkUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalLostTime"]));
                                    // role_Reworkprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["UserRole"].ToString().Equals("Hireach Driver"))
                                {
                                    role_HRUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalLostTime"]));
                                    // role_HRprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[0].Rows[i]["UserRole"].ToString().Equals("CLEANER"))
                                {
                                    role_cleanerUnits.Add(Convert.ToInt32(ds.Tables[0].Rows[i]["TotalLostTime"]));
                                    //       role_HRprod.Add(Convert.ToDouble(ds.Tables[0].Rows[i]["MovePerhr"].ToString()));
                                }
                            }
                        }
                        if (role_ForLiftDriverLines.Count != dateid) { role_ForLiftDriverLines.Add(0); }
                        // if (role_ForLiftDriverprod.Count != dateid) { role_ForLiftDriverprod.Add(0); }
                        if (role_PickerUnits.Count != dateid) { role_PickerUnits.Add(0); }
                        // if (role_Pickerprod.Count != dateid) { role_Pickerprod.Add(0); }
                        if (role_ReworkUnits.Count != dateid) { role_ReworkUnits.Add(0); }
                        // if (role_Reworkprod.Count != dateid) { role_Reworkprod.Add(0); }
                        if (role_HRUnits.Count != dateid) { role_HRUnits.Add(0); }
                        if (role_cleanerUnits.Count != dateid) { role_cleanerUnits.Add(0); }
                        // if (role_HRprod.Count != dateid) { role_HRprod.Add(0); }
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
                                    shift_AS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalLostTime"]));
                                    //           shift_AS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AO00"))
                                {
                                    shift_AO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalLostTime"]));
                                    //         shift_AO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DT00"))
                                {
                                    shift_DT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalLostTime"]));
                                    //       shift_DT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS07"))
                                {
                                    shift_DS07Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalLostTime"]));
                                    //     shift_DS07prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DO00"))
                                {
                                    shift_DO00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalLostTime"]));
                                    //   shift_DO00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("DS00"))
                                {
                                    shift_DS00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalLostTime"]));
                                    // shift_DS00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[1].Rows[i]["ShiftCode"].ToString().Equals("AT00"))
                                {
                                    shift_AT00Units.Add(Convert.ToInt32(ds.Tables[1].Rows[i]["TotalLostTime"]));
                                    //    shift_AT00prod.Add(Convert.ToDouble(ds.Tables[1].Rows[i]["MovePerhr"].ToString()));
                                }
                            }
                        }
                        //  if (shift_AO00prod.Count != dateid) { shift_AO00prod.Add(0); }
                        if (shift_AO00Units.Count != dateid) { shift_AO00Units.Add(0); }
                        //if (shift_AS00prod.Count != dateid) { shift_AS00prod.Add(0); }
                        if (shift_AS00Units.Count != dateid) { shift_AS00Units.Add(0); }
                        if (shift_DO00Units.Count != dateid) { shift_DO00Units.Add(0); }
                        //if (shift_DO00prod.Count != dateid) { shift_DO00prod.Add(0); }
                        if (shift_DS07Units.Count != dateid) { shift_DS07Units.Add(0); }
                        //if (shift_DS07prod.Count != dateid) { shift_DS07prod.Add(0); }
                        if (shift_DT00Units.Count != dateid) { shift_DT00Units.Add(0); }
                        //if (shift_DT00prod.Count != dateid) { shift_DT00prod.Add(0); }
                        if (shift_DS00Units.Count != dateid) { shift_DS00Units.Add(0); }
                        // if (shift_DS00prod.Count != dateid) { shift_DS00prod.Add(0); }
                        if (shift_AT00Units.Count != dateid) { shift_AT00Units.Add(0); }
                        // if (shift_AT00prod.Count != dateid) { shift_AT00prod.Add(0); }
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
                                    manager_JBunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalLostTime"]));
                                    //           manager_JBprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("TUPOU PEAUA"))
                                {
                                    manager_TPunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalLostTime"]));
                                    //         manager_TPprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("PETER TURNER"))
                                {
                                    manager_PTunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalLostTime"]));
                                    //       manager_PTprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["MovePerhr"].ToString()));
                                }
                                else if (ds.Tables[2].Rows[i]["TeamManager"].ToString().Equals("FRANS DEKKER"))
                                {
                                    manager_FRunits.Add(Convert.ToInt32(ds.Tables[2].Rows[i]["TotalLostTime"]));
                                    //     manager_FRprod.Add(Convert.ToDouble(ds.Tables[2].Rows[i]["MovePerhr"].ToString()));
                                }
                            }
                        }
                        if (manager_JBunits.Count != dateid) { manager_JBunits.Add(0); }
                        // if (manager_JBunits.Count != dateid) { manager_JBunits.Add(0); }
                        if (manager_TPunits.Count != dateid) { manager_TPunits.Add(0); }
                        //                if (manager_TPprod.Count != dateid) { manager_TPprod.Add(0); }
                        if (manager_PTunits.Count != dateid) { manager_PTunits.Add(0); }
                        //              if (manager_PTprod.Count != dateid) { manager_PTprod.Add(0); }
                        if (manager_FRunits.Count != dateid) { manager_FRunits.Add(0); }
                        //            if (manager_FRprod.Count != dateid) { manager_FRprod.Add(0); }
                        dateid++;
                    }
                }
                result = new DashBoard_LostTime_split();
                result.dates_Roles = dates.ToArray();
                result.dates_Shift = dates2.ToArray();
                result.dates_Manager = dates3.ToArray();
                // result.ForkliftDriverPutaway = role_ForLiftDriverprod.ToArray();
                result.ForkliftDriverUnits = role_ForLiftDriverLines.ToArray();
                result.Role_ReworkUnits = role_ReworkUnits.ToArray();
                //  result.Role_ReworkPutaway = role_Reworkprod.ToArray();
                result.Role_PickerUnits = role_PickerUnits.ToArray();
                //     result.Role_PickerPutaway = role_Pickerprod.ToArray();
                result.Role_HRDriverUnits = role_HRUnits.ToArray();
                result.Role_cleaner = role_cleanerUnits.ToArray();
                //        result.Role_HRDriverPutaway = role_HRprod.ToArray();
                //shift
                //  result.Shift_AO00Putaway = shift_AO00prod.ToArray();
                result.shift_AO00Units = shift_AO00Units.ToArray();
                //    result.shift_DT00Putaway = shift_DT00prod.ToArray();
                result.shift_DT00Units = shift_DT00Units.ToArray();
                //      result.Shift_DO00Putaway = shift_DO00prod.ToArray();
                result.shift_DO00Units = shift_DO00Units.ToArray();
                //      result.Shift_DS07Putaway = shift_DS07prod.ToArray();
                result.shift_DS07Units = shift_DS07Units.ToArray();
                // result.Shift_DS00Putaway = shift_DS00prod.ToArray();
                result.shift_DS00Units = shift_DS00Units.ToArray();
                // result.Shift_AS00Putaway = shift_AS00prod.ToArray();
                result.shift_AS00Units = shift_AS00Units.ToArray();
                // result.Shift_AT00Putaway = shift_AT00prod.ToArray();
                result.shift_AT00Units = shift_AT00Units.ToArray();
                //TeaM
                result.Manager_FDUnits = manager_FRunits.ToArray();
                //  result.Manager_FDPutaway = manager_FRprod.ToArray();
                result.Manager_JBUnits = manager_JBunits.ToArray();
                // result.Manager_JBPutaway = manager_JBprod.ToArray();
                result.Manager_TPUnits = manager_TPunits.ToArray();
                // result.Manager_TPPutaway = manager_TPprod.ToArray();
                result.Manager_PTUnits = manager_PTunits.ToArray();
                // result.Manager_PtPutaway = manager_PTprod.ToArray();
            }
            catch (Exception ex)
            {
            }
            //}
            return JsonSerializer.Serialize(result);
        }


    }
}
