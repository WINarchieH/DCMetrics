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
    public class payrollHistoryController : ApiController
    {

            [AcceptVerbs("GET", "POST")]
            [HttpGet]
            public string GetAllRecords([FromBody]PayrollHistory man)
            {


                string query = "select p.UserID, ui.FirstName +' '+ ui.Surname 'FullName'," +
                               " Cast(isNUll(p.Salary, 0) as decimal(10, 2)) 'Salary', "+
                                " Cast(isNUll(p.OrdinaryTime, 0) as decimal(10, 2)) 'OrdinaryTime'," +
                                " Cast(isNUll(p.TimeAndHalf, 0) as decimal(10, 2)) 'TimeAndHalf', "+
                                " Cast(isNUll(p.DoubleTime, 0) as decimal(10, 2)) 'DoubleTime', "+
                                " FORMAT(SEffectiveDate, 'dd/MM/yyyy ') 'SalaryEffectiveDate', "+
                                " FORMAT(SIneffectiveDate, 'dd/MM/yyyy ') 'SalaryinEffectiveDate', "+ 
                                " Cast(isNUll(p.LeadingRate, 0) as decimal(10, 1)) 'LeadingRate', "+
                                " Case "+
                                " When p.LeadingRateAllowed = 'Y' then 'Enabled' "+
                                " Else 'Disabled' end as LeadingRateAllowed, "+
                                " Case "+
                                " When p.AfternoonAllowance = 'Y' then 'Enabled' "+
                                 " Else 'Disabled' end as AfternoonAllowance,   Convert(datetime, p.AddDate, 29) 'EditDate' "+
                                 " from PermanentPayrollMakita_webVersion p inner join UserInfo ui on p.UserID = ui.UserID order by FullName, EditDate desc";

                Connection connection = new Connection();

                List<PayrollHistory> List = new List<PayrollHistory>();
                try
                {
                    try
                    {
                        Logging.WriteLog(man.Site, "Info", "PayrollHistory", "GetAllRecords", query.Replace("'", "''"), 1002, man.DCMUser);
                    }
                    catch (Exception ex) { }

                    DataSet ds = connection.ExecuteSelectQuery(query, man.Site);

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        PayrollHistory pay = null;

                        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                        {
                            pay = new PayrollHistory();
                            pay.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                            pay.FullName = ds.Tables[0].Rows[i]["FullName"].ToString();
                            pay.Salary = Convert.ToDouble( ds.Tables[0].Rows[i]["Salary"]);
                            pay.OrdinaryTime = Convert.ToDouble(ds.Tables[0].Rows[i]["OrdinaryTime"]);
                            pay.TimeAndHalf = Convert.ToDouble(ds.Tables[0].Rows[i]["TimeAndHalf"]);
                            pay.DoubleTime = Convert.ToDouble(ds.Tables[0].Rows[i]["DoubleTime"]);
                            pay.SalaryEffectiveDate = ds.Tables[0].Rows[i]["SalaryEffectiveDate"].ToString();
                            pay.SalaryInffectiveDate = ds.Tables[0].Rows[i]["SalaryinEffectiveDate"].ToString();
                            pay.LR = Convert.ToDouble(ds.Tables[0].Rows[i]["LeadingRate"]);
                            pay.LHAllowed = ds.Tables[0].Rows[i]["LeadingRateAllowed"].ToString();
                            pay.AAAllowed = ds.Tables[0].Rows[i]["AfternoonAllowance"].ToString();
                            pay.EditDate = Convert.ToDateTime(ds.Tables[0].Rows[i]["SalaryEffectiveDate"]).ToString("dd/MM/yyyy");

                        List.Add(pay);
                        }
                    }

                }
                catch (Exception ex)
                {
                    try
                    {
                        Logging.WriteLog(man.Site, "Error", "PayrollHistory", "GetAllRecords", query.Replace("'", "''"), 3002, man.DCMUser);
                    }
                    catch (Exception e) { }
                    return "Error Occured:While Fetching the List";
                }


                return JsonSerializer.Serialize(List);
            }

        

    }


}
