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
using DC4._0Backend.Models;

namespace DC4._0Backend.Controllers
{
    public class NotificationsController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllUserNotifications([FromBody]Notification not)
        {

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[not.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spNotifications_DCM", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<Notification> reports = new List<Notification>();

            cmd.Parameters.AddWithValue("@DCMUser", not.UserID);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(not.Site, "Info", "Notifications", "GetAllNotifications", "spNotifications_DCM", 1002, not.UserID);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    Notification obj = new Notification();
                    obj.id = i;
                    obj.title = ds.Tables[0].Rows[i]["Module"].ToString();

                    if (obj.title.Equals("Daily View"))
                    {
                        obj.description = ds.Tables[0].Rows[i]["T"].ToString() + " users did not logout yesterday";
                    }
                    else
                    {
                        obj.description = ds.Tables[0].Rows[i]["T"].ToString();

                    }
                    obj.Type = obj.title;
                    obj.Avatar = null;
                    obj.IsUnRead = true;
                    obj.createdAt = DateTime.Today.ToString();
                    obj.URL = ds.Tables[0].Rows[i]["URL"].ToString();


                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {
                Logging.WriteLog(not.Site, "Error", "Notifications", "GetAllNotifications", "spNotifications_DCM", 3002, not.UserID);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);

        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateUserNotificationSettings([FromBody]Notification not)
        {
            string[] modules = not.Module.Split(',');

            Connection conn = new Connection();
            string sSql = string.Empty;
            try
            {
                sSql = "Select count(*) from NotificationModule where UserID = '" + not.UserID + "'";

                int count = Convert.ToInt16(conn.ReturnSingleValue(sSql, not.Site));

                if (count > 0)
                {
                    sSql = "delete from NotificationModule where UserID = '" + not.UserID + "'";

                    string delresult = conn.ExecuteDeleteQuery(sSql, not.Site);
                }

                

                    for (int i = 0; i < modules.Length; i++)
                    {
                        // sSql = "delete from from NotificationModule where UserID = '"+not.UserID+"' and Module='" + modules[i]+"'";

                        sSql = "  insert into NotificationModule values ('" + modules[i] + "' , '" + not.UserID + "','Y')";

                        conn.ExecuteInsertQuery(sSql, not.Site);
                    }

                
            }
            catch (Exception ex)
            {
                return "Error Ocurred while Saving notification settings";
            }
            return "Setting Saved";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetUserSelectedNotificationModules([FromBody]Notification not)
        {
            List<string> modules = new List<string>();

            Connection conn = new Connection();
            string sSql = string.Empty;
            try
            {

                sSql = "Select Module from NotificationModule where UserID = '" + not.UserID + "' and Enabled = 'Y'";

            DataSet ds  = conn.ExecuteSelectQuery(sSql, not.Site);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    modules.Add(ds.Tables[0].Rows[i]["Module"].ToString());
                }
               
            }
            catch (Exception ex)
            {
                return "Error Ocurred while Saving notification settings";
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(modules);
        }
    }
}
