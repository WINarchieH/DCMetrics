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
    public class ActivityStartEndTimeController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string SearchZone([FromBody] ActivtyStartEndTime activty)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
            List<ActivtyStartEndTime> list = new List<ActivtyStartEndTime>();
            try
            {
                sSQL = "Select Activity,Zone,StartEndTime From ActivityStartEndTimeMatrix Order by Activity";
                try
                {
                    Logging.WriteLog(activty.Site, "Info", "ActivityStartEndTime", "SearchZone", sSQL.Replace("'", "''"), 1002, activty.DCMUser);
                }
                catch (Exception ex)
                {

                }
              
                DataSet ds = conn.ExecuteSelectQuery(sSQL, activty.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        ActivtyStartEndTime obj = new ActivtyStartEndTime();
                        obj.Activity = dr["Activity"].ToString();
                        obj.Zone = dr["Zone"].ToString();
                        obj.StartEndTime = Convert.ToDouble( dr["StartEndTime"].ToString());
                        list.Add(obj);
                    }
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(activty.Site, "Error", "ActivityStartEndTime", "SearchZone", sSQL.Replace("'", "''"), 3002, activty.DCMUser);
                return "Unable to fetch the records";
            }
            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertRecord([FromBody] ActivtyStartEndTime activty)
        {
            string sSQL =  "Select Count(*) From ActivityStartEndTimeMatrix Where Activity = '" +activty.Activity+ "' And Zone = '" +activty.Zone+ "'";
            Connection conn = new Connection();
            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, activty.Site));

                if (count > 0)
                {
                    try
                    {
                        Logging.WriteLog(activty.Site, "Warning", "ActivityStartEndTime", "InsertRecord", sSQL.Replace("'", "''"), 2001, activty.DCMUser);
                    }
                    catch (Exception ex)
                    {
                    }

                        return "Duplicate record found.Try different Activity or Zone.";
                }

                try
                {
                    Logging.WriteLog(activty.Site, "Info", "ActivityStartEndTime", "InsertRecord", sSQL.Replace("'", "''"), 1001, activty.DCMUser);
                }
                catch (Exception ex)
                {
                }

              
                sSQL = "Insert Into ActivityStartEndTimeMatrix  Values('" + activty.Activity + "','" + activty.Zone + "'," + activty.StartEndTime + ")";

                string result = conn.ExecuteInsertQuery(sSQL, activty.Site);
                if (result != "Insert SuccessFull")
                {
                    return "Error : While inserting a new record";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(activty.Site, "Error", "ActivityStartEndTime", "InsertRecord", sSQL.Replace("'", "''"), 3001, activty.DCMUser);
                return "Error : While inserting a new record";
            }
            return "New Record Inserted";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteMatrix([FromBody] ActivtyStartEndTime activty)
        {

            string sSQL = "Delete From ActivityStartEndTimeMatrix Where Activity = '" + activty.Activity + "' And Zone = '" + activty.Zone + "'";

            try
            {
                Logging.WriteLog(activty.Site, "Info", "ActivityStartEndTime", "DeleteMatrix", sSQL.Replace("'", "''"), 1007, activty.DCMUser);
            }
            catch (Exception ex)
            {
            }

          
            Connection conn = new Connection();
            try
            {
                string result =  conn.ExecuteDeleteQuery(sSQL, activty.Site);
            
                if (result != "Delete SuccessFull")
                {
                    return "Error:While Deleting a matrix";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(activty.Site, "Error", "ActivityStartEndTime", "DeleteMatrix", sSQL.Replace("'", "''"), 3007, activty.DCMUser);
                return "Error While Deleting the Matrix";
            }
            return "Selected Record Deleted";
        }
    }
}