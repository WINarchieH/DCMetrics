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
    public class PayrollRulesController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllPayrollRules([FromBody] PayrollRule rule)
        {
            string sSQL = string.Empty;

            List<PayrollRule> rules = new List<PayrollRule>();
            Connection conn = new Connection();

            try
            {
                sSQL = "Select ID,Category , RuleName, Value , Comment from PayrollRules WHERE 1 = 1";

                try
                {
                    Logging.WriteLog(rule.Site, "INFO", "PayrollRules", "GetAllPayrollRules", sSQL.Replace("'", "''"), 1002, rule.DCMUser);
                }
                catch (Exception ex)
                {
                }

                DataSet ds = conn.ExecuteSelectQuery(sSQL, rule.Site);



                if (ds.Tables[0].Rows.Count > 0)
                {


                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        PayrollRule obj = new PayrollRule();
                        obj.SerialID = ds.Tables[0].Rows[i]["ID"].ToString();
                        obj.Category = ds.Tables[0].Rows[i]["Category"].ToString();
                        obj.Rule = ds.Tables[0].Rows[i]["RuleName"].ToString();
                        obj.Value = ds.Tables[0].Rows[i]["Value"].ToString();
                        obj.Description = ds.Tables[0].Rows[i]["Comment"].ToString();

                        rules.Add(obj);

                    }
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(rule.Site, "Error", "PayrollRules", "GetAllPayrollRules", sSQL.Replace("'", "''"), 3002, rule.DCMUser);
                return "Error Occured:While Fetching the Payroll rules";
            }
            return JsonSerializer.Serialize(rules);
        }

        public string UpdatePayrollRule([FromBody] PayrollRule rule)
        {
            string sSQL = string.Empty;
            
            Connection conn = new Connection();
            try
            {
                // dulplicate values check
        sSQL = "select count(*) from PayrollRules where Category = '" +rule.Category+  "'"
            + " And RuleName = '" + rule.Rule+ "'"
                +" And Value = '" +rule.Value+"'";

                int count = int.Parse(conn.ReturnSingleValue(sSQL,rule.Site));

                if (count > 1)
                {
                    try
                    {
                        Logging.WriteLog(rule.Site, "Warning", "PayrollRules", "UpdatePayrollRule", sSQL.Replace("'", "''"), 2001, rule.DCMUser);
                    }
                    catch (Exception ex)
                    {
                    }
                    return "Duplicate Values of Payroll Rule found";
                }
                else
                {
                    sSQL = "Update PayrollRules Set Value= '" + rule.Value + "' where ID = '" + rule.SerialID + "'  and RuleName = '" + rule.Rule + "'and  Category = '" + rule.Category + "'";
                    try
                    {
                        Logging.WriteLog(rule.Site, "Info", "PayrollRules", "UpdatePayrollRule", sSQL.Replace("'", "''"), 1003, rule.DCMUser);
                    }
                    catch (Exception ex)
                    {
                    }


                    string result = conn.ExecuteUpdateQuery(sSQL, rule.Site);
                   
                        if (result != "Update SuccessFull")
                        {
                            return "Error while Updating the Rule Entry";
                        }
                    
                }
         

            }
            catch (Exception ex)
            {

                Logging.WriteLog(rule.Site, "Error", "PayrollRules", "UpdatePayrollRule", sSQL.Replace("'", "''"), 3003, rule.DCMUser);
                return "Error while Updating the Rule Entry";
            }
            return "Payroll Rule Entry Updated";
        }

    }
}
