using System;
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
    public class RolesController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllRoles([FromBody]Roles role)
        {


            string query = "select UserRole FROM UserRole ORDER BY UserRole";

            Connection connection = new Connection();

            List<Roles> rolesList = new List<Roles>();
            try
            {
                try
                {
                    Logging.WriteLog(role.Site, "Info", "UserRoles", "GetAllRUserRolesoles", query.Replace("'", "''"), 1002, role.DCMUser);
                }
                catch (Exception ex) { }

                DataSet ds = connection.ExecuteSelectQuery(query, role.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    Roles obj = null;

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        obj = new Roles();
                        obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();
                        rolesList.Add(obj);
                    }
                }

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(role.Site, "Error", "UserRoles", "UserRoles", query.Replace("'", "''"), 3002, role.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(rolesList);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string InsertNewUserRole([FromBody] Roles role)
        {
            Connection connection = new Connection();
            string query = "SELECT  count(*) FROM [UserRole] where UserRole = '" + role.UserRole + "' ";

            try
            {
                int count = Convert.ToInt32(connection.ReturnSingleValue(query, role.Site));

                if (count == 0)

                {
                    query = "Insert Into UserRole(UserRole) Values('" + role.UserRole + "')";
                    try
                    {
                        Logging.WriteLog(role.Site, "Info", "UserRole", "InsertNewUserRole", query.Replace("'", "''"), 1001, role.DCMUser);
                    }
                    catch (Exception ex) { }
                    string result = connection.ExecuteInsertQuery(query, role.Site);

                    if (result != "Insert SuccessFull")
                    {
                        return "Error Occured while adding new User Role";
                    }
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(role.Site, "Warning", "UserRole", "InsertNewUserRole", query.Replace("'", "''"), 2008, role.DCMUser);
                    }
                    catch (Exception ex) { }

                    return "UserRole already exist in the DC Metrics System";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(role.Site, "Error", "UserRole", "InsertNewUserRole", query.Replace("'", "''"), 3001, role.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured while creating new UserRole:" + ex.Message;
            }

            return "New UserRole Added into the DCMetrics";
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string DeleteUserRole([FromBody] Roles role)
        {
            Connection connection = new Connection();
            string query = "SELECT  count(*) FROM [UserRole] where UserRole = '" + role.UserRole + "' ";


            try
            {
                int count = Convert.ToInt32(connection.ReturnSingleValue(query, role.Site));

                if (count > 0)
                {
                    query = "delete from UserRole where UserRole =  '" + role.UserRole + "' ";
                    try
                    {
                        Logging.WriteLog(role.Site, "Info", "UserRole", "DeleteUserRole", query.Replace("'", "''"), 1007, role.DCMUser);
                    }
                    catch (Exception ex) { }

                    string result = connection.ExecuteDeleteQuery(query, role.Site);

                    if (result != "Delete SuccessFull")
                    {
                        return "Error Occured while deleting the UserRole";
                    }
                }
                else
                {
                    return "UserRole does not exist in the DC Metrics System";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(role.Site, "Error", "UserRole", "DeleteUserRole", query.Replace("'", "''"), 3007, role.DCMUser);
                }
                catch (Exception e) { }

                return "Error Occured while deleting the UserRole:" + ex.Message;
            }

            return "UserRole deleted from the DCMetrics";
        }
    }
}

