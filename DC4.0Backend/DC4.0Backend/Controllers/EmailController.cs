using DC4._0Backend.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Web.Http;


namespace DC4._0Backend.Controllers
{
    public class EmailController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertNewSubscription([FromBody]Email email)
        {
            string sSQL = string.Empty;
            string[] list = email.ReportName.Split(',');

            Connection connection = new Connection();
            try
            {
                for (int i = 0; i < list.Length; i++)
                {
                    sSQL = "insert into ReportsSchedules(DCMUserName,ReportName,ScheduledTime,Email,Format,Active) values ('" + email.DCMUserName + "','" + list[i] + "','" + email.ScheduledTime + "','" + email.EmailAddress + "','" + email.Format + "','Y')";
               string result =  connection.ExecuteInsertQuery(sSQL, email.Site);

                    if (result != "Insert SuccessFull")
                    {
                        return "Error while Creating the Report Subscription";
                    }
                }
            }
            catch (Exception ex)
            {

                return "Error while Creating the Report Subscription with error:" + ex.Message;
            }

            return "Report Subscription Created";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSubscription([FromBody]Email email)
        {
            string sSQL = string.Empty;
           
            List<Email> list = new List<Email>();
            DataTable dt = new DataTable();
            Connection connection = new Connection();
            try
            {
              
                    sSQL = "select RC.SerialID, RC.ReportName, RC.ScheduledTime, RC.Format, RC.Email from ReportsSchedules  RC where DCMUserName = '"+email.DCMUserName+"' and Active ='Y' ";
                     DataSet ds = connection.ExecuteSelectQuery(sSQL, email.Site);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    dt = ds.Tables[0];
                }

                
            }
            catch (Exception ex)
            {

                return "Error while Fetching the User Roles with error:" + ex.Message;
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateSubscription([FromBody]Email email)
        {
            string sSQL = string.Empty;

            List<Email> list = new List<Email>();
            DataTable dt = new DataTable();
            Connection connection = new Connection();
            try
            {
                sSQL = "Update ReportsSchedules  set Active = 'N' where SerialID = " + email.SerialID;
                string result = connection.ExecuteUpdateQuery(sSQL, email.Site);

                if (result != "Update SuccessFull")
                {
                    return "Error while updating the Report Subscription";
                }
            }
            catch (Exception ex)
            {

                return "Error while Fetching the User Roles with error:" + ex.Message;
            }

            return "Subscription Updated";
        }
    }

}
