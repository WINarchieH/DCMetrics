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
    public class CalendarController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllEvents([FromBody] CalenderEvent calendarEvent)
        {
            string sSQL = string.Empty;

            List<CalenderEvent> events = new List<CalenderEvent>();
            Connection conn = new Connection();
            try
            {
                //sSQL = "Select ID, Title, CAST(CONVERT(date, [Start], 103) as varchar) + 'T' +cast(CONVERT(time,  [Start], 121) as varchar(8)) [Start], CAST(CONVERT(date, [End], 103) as varchar) + 'T' +cast(CONVERT(time, [End], 121) as varchar(8)) [End], AddedBy from  events ORDER BY [Start]";

                sSQL = "Select ID, Title, EventType, CAST(CONVERT(date, [Start], 103) as varchar) + 'T' +cast(CONVERT(time,  [Start], 121) as varchar(8)) [Start], CAST(CONVERT(date, [End], 103) as varchar) + 'T' +cast(CONVERT(time, [End], 121) as varchar(8)) [End], AddedBy from  events"+
                        " UNION ALL " +
                         "SELECT 0, [Description], HolidayType, CAST(CONVERT(date, [date], 103) as varchar) + 'T' +cast(CONVERT(time,  '00:00:00', 121) as varchar(8)) [Start], CAST(CONVERT(date, [date], 103) as varchar) + 'T' +cast(CONVERT(time,  '23:59:59', 121) as varchar(8)) [End], '_ALL' FROM PublicHoliday ORDER BY[Start]";
                try
                {
                    Logging.WriteLog(calendarEvent.Site, "INFO", "Calendar", "GetAllEvents", sSQL.Replace("'", "''"), 1002, calendarEvent.DCMUser);
                }
                catch (Exception ex)
                {
                }

                DataSet ds = conn.ExecuteSelectQuery(sSQL, calendarEvent.Site);

                events = (from DataRow dr in ds.Tables[0].Rows
                        select new CalenderEvent
                        {
                            id = dr["ID"].ToString(),
                            title = dr["Title"].ToString(),
                            start = dr["Start"].ToString(),
                            end = dr["End"].ToString(),
                            addedBy = dr["AddedBy"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                Logging.WriteLog(calendarEvent.Site, "Error", "Calendar", "GetAllEvents", sSQL.Replace("'", "''"), 3002, calendarEvent.DCMUser);
                return "Error Occured:While Fetching the events for calendar.";
            }
            return JsonSerializer.Serialize(events.ToArray());
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string UpdateEvent([FromBody] CalenderEvent calendarEvent)
        {
            string sSQL = string.Empty;

            List<CalenderEvent> events = new List<CalenderEvent>();
            Connection conn = new Connection();
            try
            {
                sSQL = "UPDATE Events SET [Start] = CONVERT(datetime, '" + calendarEvent.start + "',101), [End] = CONVERT(datetime,'" + calendarEvent.end + "',101)  WHERE ID = " + calendarEvent.id;

                try
                {
                    Logging.WriteLog(calendarEvent.Site, "INFO", "Calendar", "UpdateEvents", sSQL.Replace("'", "''"), 1003, calendarEvent.DCMUser);
                }
                catch (Exception ex)
                {
                }
                string result = conn.ExecuteUpdateQuery(sSQL, calendarEvent.Site);
            }
            catch (Exception ex)
            {
                Logging.WriteLog(calendarEvent.Site, "Error", "Calendar", "UpdateEvents", sSQL.Replace("'", "''"), 3003, calendarEvent.DCMUser);
                return "Error Occured:While Updating the event in calendar.";
            }
            return "Event Updated";
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddEvent([FromBody] CalenderEvent calendarEvent)
        {
            string sSQL = string.Empty;

            List<CalenderEvent> events = new List<CalenderEvent>();
            Connection conn = new Connection();
            try
            {
                sSQL = "INSERT INTO Events (Title, [Start], [End], AddedBy) " +
                    "VALUES ('"+ calendarEvent.title + "',CONVERT(datetime,'"+ calendarEvent.start + "',101),CONVERT(datetime,'"+ calendarEvent.end + "',101),'"+ calendarEvent.DCMUser + "')";

                try
                {
                    Logging.WriteLog(calendarEvent.Site, "INFO", "Calendar", "AddEvent", sSQL.Replace("'", "''"), 1001, calendarEvent.DCMUser);
                }
                catch (Exception ex)
                {
                }
                string result = conn.ExecuteInsertQuery(sSQL, calendarEvent.Site);
            }
            catch (Exception ex)
            {
                Logging.WriteLog(calendarEvent.Site, "Error", "Calendar", "AddEvent", sSQL.Replace("'", "''"), 3001, calendarEvent.DCMUser);
                return "Error Occured:While Adding event in calendar.";
            }
            return "Event Added";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string RemoveEvent([FromBody] CalenderEvent calendarEvent)
        {
            string sSQL = string.Empty;

            List<CalenderEvent> events = new List<CalenderEvent>();
            Connection conn = new Connection();
            try
            {
                sSQL = "DELETE FROM Events WHERE ID =  " + calendarEvent.id;

                try
                {
                    Logging.WriteLog(calendarEvent.Site, "INFO", "Calendar", "RemoveEvent", sSQL.Replace("'", "''"), 1007, calendarEvent.DCMUser);
                }
                catch (Exception ex)
                {
                }
                string result = conn.ExecuteInsertQuery(sSQL, calendarEvent.Site);
            }
            catch (Exception ex)
            {
                Logging.WriteLog(calendarEvent.Site, "Error", "Calendar", "RemoveEvent", sSQL.Replace("'", "''"), 3007, calendarEvent.DCMUser);
                return "Error Occured:While removing event in calendar.";
            }
            return "Event Removed";
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddFile([FromBody] CalenderEvent calendarEvent)
        {
            string sSQL = string.Empty;

            List<CalenderEvent> events = new List<CalenderEvent>();
            Connection conn = new Connection();
            try
            {
                sSQL = "DELETE FROM Events_Files WHERE EventID = "+ calendarEvent.id + " INSERT INTO Events_Files (EventID, [File]) VALUES ('" + calendarEvent.id + "',CAST('" + calendarEvent.pdf + "' as varbinary(max)))";

                try
                {
                    Logging.WriteLog(calendarEvent.Site, "INFO", "Calendar", "AddFile", sSQL.Replace("'", "''"), 1001, calendarEvent.DCMUser);
                }
                catch (Exception ex)
                {
                }
                string result = conn.ExecuteInsertQuery(sSQL, calendarEvent.Site);
            }
            catch (Exception ex)
            {
                Logging.WriteLog(calendarEvent.Site, "Error", "Calendar", "AddFile", sSQL.Replace("'", "''"), 3001, calendarEvent.DCMUser);
                return "Error Occured:While uploading event file in calendar.";
            }
            return "Event File has been uploaded.";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetEventPdf([FromBody] CalenderEvent calendarEvent)
        {
            string sSQL = string.Empty;

            List<CalenderEvent> events = new List<CalenderEvent>();
            Connection conn = new Connection();
            try
            {
                sSQL = "SELECT cast([File] as varchar(max)) fle FROM Events_Files WHERE EventID = " + calendarEvent.id;

                try
                {
                    Logging.WriteLog(calendarEvent.Site, "INFO", "Calendar", "GetEventPdf", sSQL.Replace("'", "''"), 1002, calendarEvent.DCMUser);
                }
                catch (Exception ex)
                {
                }

                DataSet ds = conn.ExecuteSelectQuery(sSQL, calendarEvent.Site);

                events = (from DataRow dr in ds.Tables[0].Rows
                          select new CalenderEvent
                          {
                              pdf = dr["fle"].ToString(),

                          }).ToList();
            }
            catch (Exception ex)
            {
                Logging.WriteLog(calendarEvent.Site, "Error", "Calendar", "GetEventPdf", sSQL.Replace("'", "''"), 3002, calendarEvent.DCMUser);
                return "Error Occured:While Fetching the events for calendar.";
            }
            return JsonSerializer.Serialize(events.ToArray());
        }


    }
}
