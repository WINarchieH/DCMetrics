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
    public class SafetyIncidentsController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetSafetyIncidents([FromBody]SafetyIncidents incident)
        {
            List<SafetyIncidents> list = new List<SafetyIncidents>();
            string sSQL = "SELECT i.ID, i.UserID, ui.FirstName + ' ' + ui.Surname FullName, Incident, [Date], cast([File] as varchar(max)) fle" +
                " FROM SafetyIncidents i JOIN UserInfo ui ON i.UserID = ui.UserID" +
                " WHERE CONVERT(Date, Date,103) BETWEEN CONVERT(Date, '"+ incident.fromDate + "',103) AND CONVERT(Date, '" + incident.toDate + "',103)" +
                " UNION ALL " +
                " SELECT i.ID, i.UserID, i.UserID FullName, Incident, [Date], cast([File] as varchar(max)) fle " +
                " FROM SafetyIncidents i " +
                " WHERE i.UserID NOT IN (SELECT UserID FROM UserInfo) " +
                " AND CONVERT(Date, Date,103) BETWEEN CONVERT(Date, '" + incident.fromDate + "',103) AND CONVERT(Date, '" + incident.toDate + "',103) " +
                " ORDER BY [Date] DESC";

            Connection connection = new Connection();
            try
            {
                try
                {
                    Logging.WriteLog(incident.Site, "Info", "SafetyIncidents", "GetSafetyIncidents", sSQL.Replace("'", "''"), 1001, incident.DCMUser);
                }
                catch (Exception e) { }

                DataSet ds = connection.ReturnCompleteDataSet(sSQL, incident.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new SafetyIncidents
                        {
                            ID = dr["ID"].ToString(),
                            UserID = dr["UserID"].ToString(),
                            incident = dr["Incident"].ToString(),
                            fullName = dr["FullName"].ToString(),
                            date = dr["Date"].ToString(),
                            img = dr["fle"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(incident.Site, "Error", "SafetyIncidents", "GetSafetyIncidents", sSQL.Replace("'", "''"), 3001, incident.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Certification Types with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        // Add new incident (with Upload File)
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddNewIncident([FromBody]SafetyIncidents incident)
        {
            string sSQL = "INSERT INTO SafetyIncidents (UserID, Incident, [Date], [File]) VALUES ('" + incident.DCMUser + "','" + incident.incident + "',CONVERT(date,'" + incident.date + "',103),CAST('" + incident.img + "' as varbinary(max)))";

            try
            {
                Connection connection = new Connection();

                try
                {
                    Logging.WriteLog(incident.Site, "INFO", "SafetyIncidents", "AddNewIncident", "Too LONG Script for File", 1001, incident.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, incident.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(incident.Site, "Error", "SafetyIncidents", "AddNewIncident", sSQL.Replace("'", "''"), 3001, incident.DCMUser);
                }
                catch (Exception e) { }

                return "Error while adding new safety incident with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("New safety incident has been recorded.");
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteIncident([FromBody] SafetyIncidents incident)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
            sSQL = "DELETE FROM SafetyIncidents  Where ID = " + incident.ID ;

            try
            {
                try
                {
                    Logging.WriteLog(incident.Site, "INFO", "SafetyIncidents", "DeleteIncident", sSQL, 1007, incident.DCMUser);
                }
                catch (Exception e) { }

                string result = conn.ExecuteDeleteQuery(sSQL, incident.Site);

                if (result != "Delete SuccessFull")
                {
                    try
                    {
                        Logging.WriteLog(incident.Site, "Error", "SafetyIncidents", "DeleteIncident", sSQL.Replace("'", "''"), 3007, incident.DCMUser);
                    }
                    catch (Exception e) { }
                    return "Error While deleting the Record";
                }
            }
            catch (Exception ex)
            {
                  return "Error while deleting the Record." + ex.Message;
            }

            return JsonSerializer.Serialize("Safety Incident has been removed.");

        }


    }


    public class SafetyIncidents
    {
        public string Site { get; set; }
        public string DCMUser { get; set; }
        public string ID { get; set; }

        public string UserID { get; set; }
        public string incident { get; set; }
        public string date { get; set; }
        public string fullName { get; set; }
        public string img { get; set; }
        public string fromDate { get; set; }
        public string toDate { get; set; }
    }

}

