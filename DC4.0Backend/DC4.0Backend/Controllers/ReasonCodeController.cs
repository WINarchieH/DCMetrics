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
    public class ReasonCodeController : ApiController
    {
        


            [AcceptVerbs("GET", "POST")]
            [HttpGet]
            public string GetAllReasons([FromBody]Reasons man)
            {


                string query = "Select Reason from ReasonCode_TA";

                Connection connection = new Connection();

                List<Reasons> reasonsList = new List<Reasons>();
                try
                {
                    try
                    {
                        Logging.WriteLog(man.Site, "Info", "ReasonCode", "GetAllReaons", query.Replace("'", "''"), 1002, man.DCMUser);
                    }
                    catch (Exception ex) { }

                    DataSet ds = connection.ExecuteSelectQuery(query, man.Site);

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Reasons obj = null;

                        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                        {
                            obj = new Reasons();
                        obj.Reason = ds.Tables[0].Rows[i]["Reason"].ToString();
                        reasonsList.Add(obj);
                        }
                    }

                }
                catch (Exception ex)
                {
                    try
                    {
                        Logging.WriteLog(man.Site, "Error", "ReasonCode", "GetAllReaons", query.Replace("'", "''"), 3002, man.DCMUser);
                    }
                    catch (Exception e) { }
                    return "Error Occured:While Fetching the List";
                }


                return JsonSerializer.Serialize(reasonsList);
            }


            [AcceptVerbs("GET", "POST")]
            [HttpGet]
            public string InsertNewReason([FromBody] Reasons reason)
            {
                Connection connection = new Connection();
                string query = "SELECT  count(*) FROM [ReasonCode_TA] where Reason = '" + reason.Reason + "' ";

                try
                {
                    int count = Convert.ToInt32(connection.ReturnSingleValue(query, reason.Site));

                    if (count == 0)

                    {
                        query = "Insert Into ReasonCode_TA(Reason) Values('"+reason.Reason+"')";
                        try
                        {
                            Logging.WriteLog(reason.Site, "Info", "Reason", "InsertNewReason", query.Replace("'", "''"), 1001, reason.DCMUser);
                        }
                        catch (Exception ex) { }
                        string result = connection.ExecuteInsertQuery(query, reason.Site);

                        if (result != "Insert SuccessFull")
                        {
                            return "Error Occured while creating new reason";
                        }
                    }
                    else
                    {
                        try
                        {
                            Logging.WriteLog(reason.Site, "Warning", "Reason", "InsertNewReason", query.Replace("'", "''"), 2008, reason.DCMUser);
                        }
                        catch (Exception ex) { }

                        return "Reason already exist in the DC Metrics System";
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        Logging.WriteLog(reason.Site, "Error", "Reason", "InsertNewReason", query.Replace("'", "''"), 3001, reason.DCMUser);
                    }
                    catch (Exception e) { }
                    return "Error Occured while creating new reason code:" + ex.Message;
                }

                return "New Reason Added into the DCMetrics";
            }

          

            [AcceptVerbs("GET", "POST")]
            [HttpGet]
            public string Deletereason([FromBody] Reasons reason)
            {
                Connection connection = new Connection();
                string query = "SELECT  count(*) FROM [ReasonCode_TA] where Reason = '" + reason.Reason + "' ";


            try
            {
                    int count = Convert.ToInt32(connection.ReturnSingleValue(query, reason.Site));

                    if (count > 0)
                    {
                        query = "delete from ReasonCode_TA where Reason =  '"+ reason.Reason + "' ";
                        try
                        {
                            Logging.WriteLog(reason.Site, "Info", "Reason", "DeleteReason", query.Replace("'", "''"), 1007, reason.DCMUser);
                        }
                        catch (Exception ex) { }

                        string result = connection.ExecuteDeleteQuery(query, reason.Site);

                        if (result != "Delete SuccessFull")
                        {
                            return "Error Occured while deleting the reason";
                        }
                    }
                    else
                    {
                        return "Reason does not exist in the DC Metrics System";
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        Logging.WriteLog(reason.Site, "Error", "Reason", "DeleteReason", query.Replace("'", "''"), 3007, reason.DCMUser);
                    }
                    catch (Exception e) { }

                    return "Error Occured while deleting the reason code:" + ex.Message;
                }

                return "Reason deleted from the DCMetrics";
            }
        }


    }

