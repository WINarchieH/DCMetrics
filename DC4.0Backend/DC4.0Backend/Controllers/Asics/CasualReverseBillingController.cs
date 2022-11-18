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
    public class AsicsCasualReverseBillingController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCasualReverseBillingReport([FromBody]CasualReverseBilling casual)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[casual.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spCasualReverseBilling", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<CasualReverseBilling> reports = new List<CasualReverseBilling>();
            string parmvalue = casual.FromDate + casual.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                da.Fill(ds);


                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    CasualReverseBilling obj = new CasualReverseBilling();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();

                    obj.Firstname = ds.Tables[0].Rows[i]["Firstname"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.Firstname + " " + obj.Surname;
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.Agency = ds.Tables[0].Rows[i]["Agency"].ToString();
                    obj.Level = ds.Tables[0].Rows[i]["Level"].ToString();

                    obj.Date = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDate"].ToString()).ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.SingleTime = ds.Tables[0].Rows[i]["SingleTime"].ToString();
                    obj.TotalSingleAmount = Convert.ToDouble(ds.Tables[0].Rows[i]["TotalSingleAmount"].ToString());
                    obj.TimeAndHalf = ds.Tables[0].Rows[i]["TimeAndHalf"].ToString();
                    obj.TotalTimeAndHalfAmount = Convert.ToDouble(ds.Tables[0].Rows[i]["TotalTimeAndHalfAmount"].ToString());
                    obj.DoubleTime = ds.Tables[0].Rows[i]["DoubleTime"].ToString();
                    obj.TotalDoubleTimeAmount = Convert.ToDouble(ds.Tables[0].Rows[i]["DoubleTime"].ToString());

                    obj.MealTime = ds.Tables[0].Rows[i]["MealTime"].ToString();
                    obj.MealAllowance = Convert.ToDouble(ds.Tables[0].Rows[i]["MealAllowance"].ToString());
                    obj.TeaMoney = Convert.ToDouble(ds.Tables[0].Rows[i]["TeaMoney"].ToString());
                    obj.ForkLiftAllowance = Convert.ToDouble(ds.Tables[0].Rows[i]["ForkLiftAllowance"].ToString());
                    obj.GST = Convert.ToDouble(ds.Tables[0].Rows[i]["GST"].ToString());
                    obj.FirstAidAllowance = Convert.ToDouble(ds.Tables[0].Rows[i]["FirstAidAllowance"].ToString());
                    obj.SatBalance = Convert.ToDouble(ds.Tables[0].Rows[i]["Sat_Balance"].ToString());
                    double SubPay = obj.TotalSingleAmount + obj.TotalTimeAndHalfAmount + obj.TotalDoubleTimeAmount + obj.MealAllowance + obj.ForkLiftAllowance + obj.FirstAidAllowance;
                    obj.TotalPay = SubPay + SubPay * (obj.GST / 100);
                    obj.TotalPay = Math.Round(obj.TotalPay, 2);
                    reports.Add(obj);

                }
              
            }
            catch (Exception ex)
            {
                return "Unable to Fetch Casual Reverse Billing Records";
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }
    }
}
