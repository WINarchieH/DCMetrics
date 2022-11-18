using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Web.Http;
using DC4._0Backend.Models;

namespace DC4._0Backend.Controllers
{
    public class PayrollCodeController : ApiController
    {

            [AcceptVerbs("GET", "POST")]
            [HttpGet]
            public string GetAllPayrollCodes([FromBody] PayrollCode payrollCode)
            {
                string sSQL = string.Empty;

                List<PayrollCode> codeslist = new List<PayrollCode>();
                Connection conn = new Connection();

                try
                {
                    sSQL = "select ID, Category, Code, CodeDesc, UDF1, UDF2 from PayrollCodes WHERE 1 = 1";
                try
                {
                    Logging.WriteLog(payrollCode.Site, "Info", "PayrollCode", "GetAllPayrollCodes", sSQL.Replace("'", "''"), 1002, payrollCode.DCMUser);

                }
                catch (Exception ex)
                {

                }



                DataSet ds = conn.ReturnCompleteDataSet(sSQL, payrollCode.Site);

                    if (ds.Tables[0].Rows.Count > 0)
                    {

                        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                        {
                            PayrollCode obj = new PayrollCode();
                            obj.SerialID = ds.Tables[0].Rows[i]["ID"].ToString();
                            obj.Category = ds.Tables[0].Rows[i]["Category"].ToString();
                            obj.Code = ds.Tables[0].Rows[i]["Code"].ToString();
                            obj.Description = ds.Tables[0].Rows[i]["CodeDesc"].ToString();
                            obj.UDF1 = ds.Tables[0].Rows[i]["UDF1"].ToString();
                            obj.UDF2 = ds.Tables[0].Rows[i]["UDF2"].ToString();

                        codeslist.Add(obj);

                        }
                    }
                }
                catch (Exception ex)
                {
                Logging.WriteLog(payrollCode.Site, "Error", "PayrollCode", "GetAllPayrollCodes", sSQL.Replace("'", "''"), 3002, payrollCode.DCMUser);
                return "Error Occured:While Fetching the Payroll Code";
                }
                return JsonSerializer.Serialize(codeslist);
            }

            public string UpdatePayrollCode([FromBody] PayrollCode payrollCode)
            {
                string sSQL = string.Empty;

                Connection conn = new Connection();
                try
                {
                // dulplicate values check
                sSQL = "select count(*) from PayrollCodes where Category = '" + payrollCode.Category + "'"
            + " And Code = '" + payrollCode.Code + "'";

                    int count = int.Parse(conn.ReturnSingleValue(sSQL, payrollCode.Site));

                    if (count > 1)
                    {
                    try
                    {
                        Logging.WriteLog(payrollCode.Site, "Warning", "PayrollCode", "UpdatePayrollCodes", sSQL.Replace("'", "''"), 2001, payrollCode.DCMUser);

                    }
                    catch (Exception ex)
                    {

                    }
                    return "Duplicate Values of Payroll Code Found";
                    }
                    else
                    {
                    try
                    {
                        Logging.WriteLog(payrollCode.Site, "Info", "PayrollCode", "UpdatePayrollCodes", sSQL.Replace("'", "''"), 1003, payrollCode.DCMUser);

                    }
                    catch (Exception ex)
                    {

                    }
                    sSQL = "Update PayrollCodes Set Code = '" + payrollCode.Code + "' where ID = '" + payrollCode.SerialID + "'";

                    conn.ReturnCompleteDataSet(sSQL, payrollCode.Site);
                    }
            }
                catch (Exception ex)
                {

                Logging.WriteLog(payrollCode.Site, "Error", "PayrollCode", "UpdatePayrollCode", sSQL.Replace("'", "''"), 3003, payrollCode.DCMUser);
                return "Error while Updating the code Entry";
                }

                return "Payroll Code Entry Updated";
            }

        }
    }



