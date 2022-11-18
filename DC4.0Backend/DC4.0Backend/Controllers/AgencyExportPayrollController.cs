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
    public class AgencyExportPayrollController : ApiController
    {

            [AcceptVerbs("GET", "POST")]
            [HttpPost]
            public string SearchPayrollRecord([FromBody]AgencyPayrollExport payroll)
            {
                Connection conn = new Connection();
                DataSet ds = new DataSet();
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

                    SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[payroll.Site].ConnectionString);
                    SqlCommand cmd = new SqlCommand("dbo.spAgencyPayrollCalc_CSL", sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@StartDate", payroll.FromDate);
                    cmd.Parameters.AddWithValue("@EndDate", payroll.ToDate);
                    cmd.Parameters.AddWithValue("@uName", "");
                    cmd.Parameters.AddWithValue("@ShiftCode", "_All");
                 //   cmd.Parameters.AddWithValue("@EmpType", "--All--");
                    cmd.Parameters.AddWithValue("@TeamManager", "_All");
                    cmd.Parameters.AddWithValue("@Agency", "--All Agencies--");


                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(ds);

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
            public string GeneratePayrollFile([FromBody] AgencyPayrollExport export)
            {
                Connection conn = new Connection();

            string  sSql_CheckIfAllApproved = "SELECT COUNT(bc.ID) FROM bundyclock bc JOIN Userinfo ui "
                +" On bc.userid = ui.userid "
                +" where ISNULL(Approve,'') <> 'Y' AND convert(date,startdatetime,103) "
                +" BETWEEN CONVERT(DATE, '" +export.FromDate+ "', 103) AND CONVERT(DATE, '" +export.ToDate+ "', 103)"
                + " AND ui.EmployeeCategory in ('Casual') "
                + " And ui.Agency NOT In ('CSL')";


            int count = int.Parse(conn.ReturnSingleValue(sSql_CheckIfAllApproved, export.Site));

            if (count > 0)
            {
                return "Not all Time & Attendance records were approved, File Generation Aborted!";
            }

                string sql = "Exec filetransfer_Agency";
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



