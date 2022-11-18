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
    public class CasualReverseBillingController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetCasualReverseBillingReport([FromBody]PayrollExport payroll)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[payroll.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spCasualReverseBilling", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            //List<LostTime> reports = new List<LostTime>();
            string parmvalue = payroll.FromDate + payroll.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(payroll.Site, "Info", "CasualReverseBilling", "GetCasualReverseBillingReport", "spCasualReverseBilling", 1002, payroll.DCMUser);
            }
            catch (Exception ex)
            { }


            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                Logging.WriteLog(payroll.Site, "Error", "CasualReverseBilling", "GetCasualReverseBillingReport", "spCasualReverseBilling", 3002, payroll.DCMUser);
                return "Unable to Fetch Casual Reverse Billing Records";
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        }
    }
}
