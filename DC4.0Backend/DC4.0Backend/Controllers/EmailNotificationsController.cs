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
    public class EmailNotificationsController : ApiController
    {
        // GET: EmailNotifications
     


            [AcceptVerbs("GET", "POST")]
            [HttpGet]
            public string GetAllEntries([FromBody]EmailNotification not)
            {


                string query = "Select SerialID, Email,NotificationType, Name from Notifications_MailList";

                Connection connection = new Connection();

                List<EmailNotification> List = new List<EmailNotification>();
                try
                {
                    try
                    {
                        Logging.WriteLog(not.Site, "Info", "EmailNotifications", "GetAllEntries", query.Replace("'", "''"), 1002, not.DCMUser);
                    }
                    catch (Exception ex) { }

                    DataSet ds = connection.ExecuteSelectQuery(query, not.Site);

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                    EmailNotification email = null;

                        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                        {
                        email = new EmailNotification();
                        email.SerialID = ds.Tables[0].Rows[i]["SerialID"].ToString();
                        email.Email = ds.Tables[0].Rows[i]["Email"].ToString();
                        email.NotificationType = ds.Tables[0].Rows[i]["NotificationType"].ToString();
                        email.Name = ds.Tables[0].Rows[i]["Name"].ToString();
                        List.Add(email);
                        }
                    }

                }
                catch (Exception ex)
                {
                    try
                    {
                        Logging.WriteLog(not.Site, "Error", "EmailNotifications", "GetAllEntries", query.Replace("'", "''"), 3002, not.DCMUser);
                    }
                    catch (Exception e) { }
                    return "Error Occured:While Fetching the List";
                }


                return JsonSerializer.Serialize(List);
            }


            [AcceptVerbs("GET", "POST")]
            [HttpGet]
            public string InsertNewEmailNotification([FromBody] EmailNotification not)
            {
                Connection connection = new Connection();
                string query = "SELECT  count(*) FROM [Notifications_MailList] where Name='"+not.Name+"' and Email = '" + not.Email + "' and NotificationType = '"+not.NotificationType+"' ";

                try
                {
                    int count = Convert.ToInt32(connection.ReturnSingleValue(query, not.Site));

                    if (count == 0)

                    {
                        query = "Insert Into Notifications_MailList(Name,NotificationType,Email) Values('"+not.Name+"','"+not.NotificationType+"','"+not.Email+"')";
                        try
                        {
                            Logging.WriteLog(not.Site, "Info", "TeamManager", "InsertNewManager", query.Replace("'", "''"), 1001, not.DCMUser);
                        }
                        catch (Exception ex) { }
                        string result = connection.ExecuteInsertQuery(query, not.Site);

                        if (result != "Insert SuccessFull")
                        {
                            return "Error Occured while creating new manager";
                        }
                    }
                    else
                    {
                        try
                        {
                            Logging.WriteLog(not.Site, "Warning", "TeamManager", "InsertNewManager", query.Replace("'", "''"), 2008, not.DCMUser);
                        }
                        catch (Exception ex) { }

                        return "Entry already exist in the DC Metrics System";
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        Logging.WriteLog(not.Site, "Error", "TeamManager", "InsertNewManager", query.Replace("'", "''"), 3001, not.DCMUser);
                    }
                    catch (Exception e) { }
                    return "Error Occured while creating new manager:" + ex.Message;
                }

                return "New Email Notification Added into the DCMetrics";
            }

            [AcceptVerbs("GET", "POST")]
            [HttpGet]
            public string UpdateEntry([FromBody] EmailNotification not)
            {
                Connection connection = new Connection();
            string query = "SELECT  count(*) FROM [Notifications_MailList] where Email = '" + not.Email + "' and NotificationType = '" + not.NotificationType + "' and Name = '"+not.Name+"' ";

            try
            {
                int Idcount = Convert.ToInt32(connection.ReturnSingleValue(query, not.Site));

                if (Idcount == 0)
                {


                    try
                    {
                        Logging.WriteLog(not.Site, "Info", "Notifications_MailList", "UpdateEntry", query.Replace("'", "''"), 1003, not.DCMUser);
                    }
                    catch (Exception ex) { }

                    query = "Update Notifications_MailList set Email='"+not.Email+"', Name = '" + not.Name + "' , NotificationType = '" + not.NotificationType + "' where SerialID = " + not.SerialID;
                    string result = connection.ExecuteUpdateQuery(query, not.Site);


                    if (result != "Update SuccessFull")
                    {
                        return "Error Occured while updating entry";
                    }
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(not.Site, "Warning", "Notifications_MailList", "UpdateEntry", query.Replace("'", "''"), 2008, not.DCMUser);
                    }
                    catch (Exception ex) { }
                    return "Dulpicate entries in the DC Metrics System";

                }

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(not.Site, "Error", "Notifications_MailList", "UpdateManager", query.Replace("'", "''"), 3003, not.DCMUser);
                }
                catch (Exception e) { }

                return "Error Occured while creating entry:" + ex.Message;
            }

                return "Entry updated in the DC Metrics";
            }

            [AcceptVerbs("GET", "POST")]
            [HttpGet]
            public string DeleteEntry([FromBody] EmailNotification not)
            {
                Connection connection = new Connection();
                string query = "SELECT  count(*) FROM [Notifications_MailList] where SerialID = " + not.SerialID;

                try
                {
                    int count = Convert.ToInt32(connection.ReturnSingleValue(query, not.Site));

                    if (count > 0)
                    {
                        query = "delete from Notifications_MailList where SerialID = " + not.SerialID;
                        try
                        {
                            Logging.WriteLog(not.Site, "Info", "Notifications_MailList", "DeleteManager", query.Replace("'", "''"), 1007, not.DCMUser);
                        }
                        catch (Exception ex) { }

                        string result = connection.ExecuteDeleteQuery(query, not.Site);

                        if (result != "Delete SuccessFull")
                        {
                            return "Error Occured while deleting the Entry";
                        }
                    }
                    else
                    {
                        return "Entry does not exist in the DC Metrics System";
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        Logging.WriteLog(not.Site, "Error", "Notifications_MailList", "DeleteManager", query.Replace("'", "''"), 3007, not.DCMUser);
                    }
                    catch (Exception e) { }

                    return "Error Occured while deleting the entry:" + ex.Message;
                }

                return "Entry deleted from the DCMetrics";
            }
        }
    }
