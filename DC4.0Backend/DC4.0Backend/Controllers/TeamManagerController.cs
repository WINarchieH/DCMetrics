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
    public class TeamManagerController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllManager([FromBody]TeamManager man )
        {


            string query = "SELECT [ManagerID],[ManagerName],[Position] FROM [TeamManager]";

            Connection connection = new Connection();

            List<TeamManager> managerList = new List<TeamManager>();
            try
            {
                try
                {
                    Logging.WriteLog(man.Site, "Info", "TeamManager", "GetAllManager", query.Replace("'", "''"), 1002, man.DCMUser);
                }
                catch (Exception ex) { }

                DataSet ds = connection.ExecuteSelectQuery(query,man.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    TeamManager manager = null;

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        manager = new TeamManager();
                        manager.SerialID = ds.Tables[0].Rows[i]["ManagerID"].ToString();
                        manager.ManagerName = ds.Tables[0].Rows[i]["ManagerName"].ToString();
                        manager.Position = ds.Tables[0].Rows[i]["Position"].ToString();
                        managerList.Add(manager);
                    }
                }

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(man.Site, "Error", "TeamManager", "GetAllManager", query.Replace("'", "''"), 3002, man.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(managerList); 
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string InsertNewManager([FromBody] TeamManager manager)
        {
            Connection connection = new Connection();
            string query = "SELECT  count(*) FROM [TeamManager] where ManagerName = '" + manager.ManagerName + "' ";

            try
            {
                int count = Convert.ToInt32(connection.ReturnSingleValue(query,manager.Site));

                if (count == 0)

                {                   
                    query = "Insert Into TeamManager(ManagerName,Position) Values('" + manager.ManagerName + "','" + manager.Position + "')";
                    try
                    {
                        Logging.WriteLog(manager.Site, "Info", "TeamManager", "InsertNewManager", query.Replace("'", "''"), 1001, manager.DCMUser);
                    }
                    catch (Exception ex) { }
                    string result =  connection.ExecuteInsertQuery(query,manager.Site);

                    if (result != "Insert SuccessFull")
                    {
                      return "Error Occured while creating new manager";  
                    }
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(manager.Site, "Warning", "TeamManager", "InsertNewManager", query.Replace("'", "''"), 2008, manager.DCMUser);
                    }
                    catch (Exception ex) { }

                    return "Manager already exist in the DC Metrics System";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(manager.Site, "Error", "TeamManager", "InsertNewManager", query.Replace("'", "''"), 3001, manager.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured while creating new manager:" + ex.Message;
            }

            return "New Manager Added into the DCMetrics";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string UpdateManager([FromBody] TeamManager manager)
        {
            Connection connection = new Connection();
            string query = "SELECT  count(*) FROM [TeamManager] where ManagerID = "+manager.SerialID;

            try
            {
                int Idcount = Convert.ToInt32(connection.ReturnSingleValue(query, manager.Site));

                if (Idcount == 1)
                {

                    query = "SELECT  count(*) FROM [TeamManager] where ManagerName = '"+ manager.ManagerName + "' and Position ='"+manager.Position+"' ";

                    int namecount = Convert.ToInt32(connection.ReturnSingleValue(query, manager.Site));

                    if (namecount == 0)
                    {
                        try
                        {
                            Logging.WriteLog(manager.Site, "Info", "TeamManager", "UpdateManager", query.Replace("'", "''"), 1003, manager.DCMUser);
                        }
                        catch (Exception ex) { }

                        query = "Update TeamManager set ManagerName = '" + manager.ManagerName + "' , Position = '"+manager.Position+"' where ManagerID = " + manager.SerialID;
                     string result = connection.ExecuteUpdateQuery(query, manager.Site);


                        if (result != "Update SuccessFull")
                        {
                            return "Error Occured while updating new manager";
                        }
                    }
                    else
                    {
                        try
                        {
                            Logging.WriteLog(manager.Site, "Warning", "TeamManager", "UpdateManager", query.Replace("'", "''"), 2008, manager.DCMUser);
                        }
                        catch (Exception ex) { }
                        return "Dulpicate entries in the DC Metrics System";
                    }
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(manager.Site, "Warning", "TeamManager", "UpdateManager", query.Replace("'", "''"), 2008, manager.DCMUser);
                    }
                    catch (Exception ex) { }
                    
                    return "Dulpicate entries in the DC Metrics System";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(manager.Site, "Error", "TeamManager", "UpdateManager", query.Replace("'", "''"), 3003, manager.DCMUser);
                }
                catch (Exception e) { }

                return "Error Occured while creating new manager:" + ex.Message;
            }

            return "Manager updated in the DC Metrics";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string DeleteManager([FromBody] TeamManager manager)
        {
            Connection connection = new Connection();
            string query = "SELECT  count(*) FROM [TeamManager] where ManagerID = "+manager.SerialID ;

            try
            {
                int count = Convert.ToInt32(connection.ReturnSingleValue(query, manager.Site));

                if (count > 0)
                {
                    query = "delete from TeamManager where ManagerID = " + manager.SerialID;
                    try
                    {
                        Logging.WriteLog(manager.Site, "Info", "TeamManager", "DeleteManager", query.Replace("'", "''"), 1007, manager.DCMUser);
                    }
                    catch (Exception ex) { }

                   string result =  connection.ExecuteDeleteQuery(query, manager.Site);

                    if (result !=  "Delete SuccessFull")
                    {
                        return "Error Occured while deleting the manager";
                    }
                }
                else
                {
                    return "Manager does not exist in the DC Metrics System";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(manager.Site, "Error", "TeamManager", "DeleteManager", query.Replace("'", "''"), 3007, manager.DCMUser);
                }
                catch (Exception e) { }

                return "Error Occured while deleting the manager:" + ex.Message;
            }

            return "Manager deleted from the DCMetrics";
        }
    }


}
