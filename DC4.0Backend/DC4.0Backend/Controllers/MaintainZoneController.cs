using System;
using System.Collections.Generic;
using System.Data;
using System.Text.Json;
using System.Web.Http;
using DC4._0Backend.Models;

namespace DC4._0Backend.Controllers
{
    public class MaintainZoneController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string MaintainZoneGetAllEntries([FromBody]MaintainZone maintain)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            List<MaintainZone> list = new List<MaintainZone>();
            try
            {

                sSQL = "Select  Zone, isnull(Description,'') as Description,isnull(LocRangeFrom,'') 'Loc Range From',isnull(LocRangeTo,'')'Loc Range To' From Zone Order by LocRangeFrom ";
                try
                {
                    Logging.WriteLog(maintain.Site, "Info", "MaintainZone", "GetAllZones", sSQL.Replace("'", "''"), 1002, maintain.DCMUser);
                }
           catch (Exception ex)
            {

            }

            DataSet ds = conn.ExecuteSelectQuery(sSQL, maintain.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow r in ds.Tables[0].Rows)
                    {
                        MaintainZone obj = new MaintainZone();
                       
                        obj.Zone = r["Zone"].ToString();

                        obj.Description = r["Description"].ToString();
                        obj.LocRangeFrom = r["Loc Range From"].ToString();
                        obj.LocRangeTo = r["Loc Range To"].ToString();
                        list.Add(obj);
                    }
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(maintain.Site, "Error", "MaintainZone", "GetAllZones", sSQL.Replace("'", "''"), 3002, maintain.DCMUser);
                return "Erro while Fetching the Maintain Zone List";
            }

            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AddNewZone([FromBody]MaintainZone maintain)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            try
            {
                sSQL = "Select Count(*) From Zone Where Zone = '" + maintain.Zone + "' And LocRangeFrom = '" + maintain.LocRangeFrom + "' And LocRangeTo = '" + maintain.LocRangeTo + "'";
                int count = int.Parse(conn.ReturnSingleValue(sSQL, maintain.Site));

                if (count > 0)
                {
                    try
                    {
                        Logging.WriteLog(maintain.Site, "Warning", "MaintainZone", "InsertZones", sSQL.Replace("'", "''"), 2001, maintain.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }

                    return "Duplicate Record Found";

                }
                else
                {
                    sSQL = "Insert Into Zone(Zone, Description, LocRangeFrom, LocRangeTo)  Values('" + maintain.Zone.Trim() + "','" + maintain.Description.Trim()+ "','" + maintain.LocRangeFrom.Trim() + "','" + maintain.LocRangeTo.Trim() + "')";
                    try
                    {
                        Logging.WriteLog(maintain.Site, "Info", "MaintainZone", "InsertZones", sSQL.Replace("'", "''"), 1001, maintain.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }

                     string result = conn.ExecuteInsertQuery(sSQL, maintain.Site);

                    if (result != "Insert SuccessFull")
                    {
                        return "Error while Inserting New Zone";
                    }
                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(maintain.Site, "Error", "MaintainZone", "InsertZones", sSQL.Replace("'", "''"), 3001, maintain.DCMUser);
                return "Error while Inserting New Zone";
            }
            return "New Zone Added";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteZone([FromBody]MaintainZone maintain)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            try
            {
                
                    sSQL = "Delete From Zone Where Zone = '" + maintain.Zone + "' And LocRangeFrom = '" +maintain.LocRangeFrom + "' And LocRangeTo = '" +maintain.LocRangeTo+ "'";

                try
                {
                    Logging.WriteLog(maintain.Site, "Info", "MaintainZone", "DeleteZones", sSQL.Replace("'", "''"), 1007, maintain.DCMUser);
                }
                catch (Exception ex)
                {

                }


             string result = conn.ExecuteDeleteQuery(sSQL, maintain.Site);

                if (result != "Delete SuccessFull")
                {
                    return "Error while Deleting Zone";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(maintain.Site, "Delete", "MaintainZone", "DeleteZones", sSQL.Replace("'", "''"), 3007, maintain.DCMUser);
                return "Error while Deleting Zone";
            }
            return "Zone Deleted";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateZone([FromBody]MaintainZone maintain)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            try
            {
                maintain.LocRangeTo = maintain.LocRangeTo.Trim();

                    sSQL = "Update Zone Set  Description = '" +maintain.Description+ "',LocRangeFrom = '" + maintain.LocRangeFrom + "',LocRangeTo = '" + maintain.LocRangeTo + "' where Zone = '"+maintain.Zone+"'" ;
                try
                {
                    Logging.WriteLog(maintain.Site, "Info", "MaintainZone", "InsertZones", sSQL.Replace("'", "''"), 1003, maintain.DCMUser);
                }
                catch ( Exception ex)
                {
                }
              string result =  conn.ExecuteUpdateQuery(sSQL, maintain.Site);
                if (result != "Update SuccessFull")
                {
                    return "Error while updating Zone";
                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(maintain.Site, "Error", "MaintainZone", "UpdateZones", sSQL.Replace("'", "''"), 3003, maintain.DCMUser);
                return "Error while updating Zone";
            }
            return "Update Zone Added";
        }
    }

}
