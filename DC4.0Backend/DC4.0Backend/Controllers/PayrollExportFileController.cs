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

namespace DC4._0Backend.Controllers
{
    public class PayrollExportFileController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string SearchRecord([FromBody]PayrollExport payroll)
        {
            Connection conn = new Connection();
            DataSet ds = null;
            DataTable dt = new DataTable();
            try
            {

                if (payroll.FromDate == null)
                {
                    payroll.FromDate = conn.ReturnSingleValue("SELECT CONVERT(Date, DATEADD(wk, DATEDIFF(wk,0,GETDATE()), 0))", payroll.Site);
                }

                if (payroll.ToDate == null)
                {
                    payroll.ToDate = conn.ReturnSingleValue("SELECT CONVERT(Date, DATEADD(wk, DATEDIFF(wk,0,GETDATE()), 6))", payroll.Site);
                }

                if (!string.IsNullOrEmpty(payroll.FromDate))
                {
                    DateTime date = DateTime.Parse(payroll.FromDate);
                    payroll.FromDate = date.ToString("dd/MM/yyyy");
                }


                if (!string.IsNullOrEmpty(payroll.ToDate))
                {
                    DateTime date = DateTime.Parse(payroll.ToDate);
                    payroll.ToDate = date.ToString("dd/MM/yyyy");

                }
                try
                {
                    Logging.WriteLog(payroll.Site, "Info", "PayrollExport", "SearchRecord", "Execute Payroll SP".Replace("'", "''"), 1002, payroll.DCMUser);
                }
                catch (Exception ex)
                { }

                if ( (payroll.Agency == "undefined") ||(payroll.Agency == null))
               {
                    payroll.Agency = "_All";
                }
                ds = conn.ExecutePayrollSP(payroll.FromDate, payroll.ToDate,  payroll.Agency, payroll.Site);

                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                Logging.WriteLog(payroll.Site, "Error", "PayrollExport", "SearchRecord", "Execute Payroll SP".Replace("'", "''"), 3002, payroll.DCMUser);
                return "Unable to fetch the payroll Records";
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GeneratePayrollFile([FromBody] PayrollExport export)
        {
            Connection conn = new Connection();
            string sql = "Exec filetransfer";
            string result = string.Empty;
            try
            {
                try
                {
                    Logging.WriteLog(export.Site, "Info", "PayrollExport", "SearchRecord", sql.Replace("'", "''"), 1002, export.DCMUser);
                }
                catch (Exception ex)
                { }
                conn.ReturnSingleValue(sql, export.Site);
                result = "payroll File Generated";
            }
            catch (Exception ex)
            {
                Logging.WriteLog(export.Site, "Error", "PayrollExport", "GeneratePayrollFile", sql.Replace("'", "''"), 3002, export.DCMUser);
                return "Payroll File Generation Failed With Error Message:" + ex.Message;
            }

            return result;
        }
    }
}
