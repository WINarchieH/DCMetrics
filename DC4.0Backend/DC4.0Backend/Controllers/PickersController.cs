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
    public class PickersController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllLeavesTypes([FromBody]Leave leave)
        {
            List<Leave> leaves = new List<Leave>();
            string sSQL = " select LeaveCode , LeaveDesc from Leave where EmpType = '"+leave.EmpType+"' order by LeaveDesc";
            Connection connection = new Connection();
            try
            {


                DataSet ds = connection.ReturnCompleteDataSet(sSQL, leave.Site);

                leaves = (from DataRow dr in ds.Tables[0].Rows
                          select new Leave
                          {

                              LeaveCode = dr["LeaveCode"].ToString(),
                              LeaveDesc = dr["LeaveDesc"].ToString()
                          }).ToList();

            }

            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(leave.Site, "Error", "Dropdowns", "GetAllLeavesTypes", sSQL.Replace("'", "''"), 3004, leave.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching the Leave Types" + ex.Message;
            }
            return JsonSerializer.Serialize(leaves);

        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]

        public string GetAllActivities([FromBody]Activity activity)
        {
            List<Activity> activities = new List<Activity>();
            string sSQL = " select ActivityName from ActivityInfo where ActivityType = 'Direct' Order by ActivityName Asc";
            Connection connection = new Connection();
            try
            {


                DataSet ds = connection.ReturnCompleteDataSet(sSQL, activity.Site);

                activities = (from DataRow dr in ds.Tables[0].Rows
                              select new Activity
                              {

                                  ActivityName = dr["ActivityName"].ToString()

                              }).ToList();

            }

            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(activity.Site, "Error", "Dropdowns", "GetAllActivities", sSQL.Replace("'", "''"), 3004, activity.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching Activities" + ex.Message;
            }
            return JsonSerializer.Serialize(activities);
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllZone([FromBody]Zone zone)
        {
            List<Zone> Zone = new List<Zone>();
            string sSQL = "Select Distinct(RTRIM(Zone))as Zone, Zone as ZoneValue From Zone   Union Select 'Default Zone','Default' Order By ZoneValue";
            Connection connection = new Connection();
            try
            {


                DataSet ds = connection.ReturnCompleteDataSet(sSQL, zone.Site);

                Zone = (from DataRow dr in ds.Tables[0].Rows
                        select new Zone
                        {

                            ZoneNumber = dr["Zone"].ToString()

                        }).ToList();

            }

            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(zone.Site, "Error", "Dropdowns", "GetAllZone", sSQL.Replace("'", "''"), 3004, zone.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching Zones" + ex.Message;
            }
            return JsonSerializer.Serialize(Zone);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllCostCenters([FromBody]CostCenters cc)
        {
            List<CostCenters> list = new List<CostCenters>();
            string sSQL = " select distinct  CC_Code from ActivityInfo  where ActivityType = 'INDIRECT'  order by CC_Code";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, cc.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CostCenters
                        {

                            CostCenter = dr["CC_Code"].ToString()

                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(cc.Site, "Error", "Dropdowns", "GetAllCostCenters", sSQL.Replace("'", "''"), 3004, cc.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching Cost Center" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }

        
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllCostCentersWithAssignments([FromBody]CostCenters cc)
        {
            List<CostCenters> list = new List<CostCenters>();
            string sSQL = " select distinct ainfo.CC_Code from AssignIndirectActivity ai join ActivityInfo ainfo on ai.ActivityName = ainfo.ActivityName order by ainfo.CC_Code";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, cc.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CostCenters
                        {

                            CostCenter = dr["CC_Code"].ToString()

                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(cc.Site, "Error", "Dropdowns", "GetAllCostCentersWithAssignments", sSQL.Replace("'", "''"), 3004, cc.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching Cost Center" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }




        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllActivityGroup([FromBody]DirectActivity direct)
        {
            List<DirectActivity> list = new List<DirectActivity>();
            string sSQL = "select Distinct CC_Code ActivityGroup ,CC_Code ActivityGroupValue from ActivityInfo WHERE ActivityType = 'DIRECT'    Union  Select 'Others','Others' Order By ActivityGroup";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, direct.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new DirectActivity
                        {

                            ActivityGroup = dr["ActivityGroup"].ToString()

                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(direct.Site, "Error", "Dropdowns", "GetAllActivityGroup", sSQL.Replace("'", "''"), 3004, direct.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching ActivityGroup" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllDirectActivity([FromBody]DirectActivity direct)
        {
            List<DirectActivity> list = new List<DirectActivity>();
            string sSQL = "select ActivityName Activity from ActivityInfo where ActivityType in ('Direct','direct','DIRECT')";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, direct.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new DirectActivity
                        {

                            Activity = dr["Activity"].ToString()

                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(direct.Site, "Error", "Dropdowns", "GetAllDirectActivity", sSQL.Replace("'", "''"), 3004, direct.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching ActivityGroup" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllIndirectActivity([FromBody]CostCenters cc)
        {
            List<CostCenters> list = new List<CostCenters>();
            string sSQL = "select ActivityName from ActivityInfo where ActivityType in ('INDIRECT','indirect','Indirect')  ";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, cc.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CostCenters
                        {

                            ActivityName = dr["ActivityName"].ToString()

                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(cc.Site, "Error", "Dropdowns", "GetAllIndirectActivity", sSQL.Replace("'", "''"), 3004, cc.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching ActivityGroup" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]

        public string GetAllUserNames([FromBody] UserInfo user)
        {

            List<string> list = new List<string>();
            string sSQL = "Select FirstName, Surname, UserID from UserInfo where Status = 'A' Order by FirstName Asc ";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {


                    string FirstName = dr["FirstName"].ToString();
                    string Surname = dr["Surname"].ToString();
                    string UserID = dr["UserID"].ToString();

                    string FullName = FirstName + " " + Surname + " (" + UserID + ")";

                    list.Add(FullName);

                    }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetAllUserNames", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching UserList" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetIndirectActivityOnCCbased([FromBody]CostCenters cc)
        {
            List<CostCenters> list = new List<CostCenters>();
            string sSQL = "select Activity from ActivityInfo where CC_Code = '"+cc.assignedActivityCostCenter + "'  and ActivityType in ('INDIRECT','indirect','Indirect')  ";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, cc.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CostCenters
                        {

                            ActivityName = dr["Activity"].ToString()

                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(cc.Site, "Error", "Dropdowns", "GetIndirectActivityOnCCbased", sSQL.Replace("'", "''"), 3004, cc.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching ActivityGroup" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllCCforUser([FromBody]UserInfo user)
        {

            List<CostCenters> list = new List<CostCenters>();

            string sSQL = "select distinct (reverse(isnull(rtrim(ltrim(left(reverse([ActivityName]),case when (charindex('-',reverse([ActivityName]))-(1))<=(0) then NULL else charindex('-',reverse([ActivityName]))-(1) end))),''))) CostCentre from AssignIndirectActivity WHERE userid = '" + user.UserID.Split('(', ')')[1] + "' ";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CostCenters
                        {
                            CostCenter = dr["CostCentre"].ToString()
                        }).ToList();
                
            }

            

            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetAllCCforUser", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching CostCentre for a user" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllAssignedIndirectsForUser([FromBody]UserInfo ui)
        {
            List<CostCenters> list = new List<CostCenters>();

            string sSQL = "select ActivityName from AssignIndirectActivity where userid = '" + ui.UserID.Split('(', ')')[1] + "' and (reverse(isnull(rtrim(ltrim(left(reverse([ActivityName]),case when (charindex('-',reverse([ActivityName]))-(1))<=(0) then NULL else charindex('-',reverse([ActivityName]))-(1) end))),''))) = '" + ui.DeptCode + "'";

            Connection connection = new Connection();

            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, ui.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CostCenters
                        {

                            ActivityName = dr["ActivityName"].ToString()

                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(ui.Site, "Error", "Dropdowns", "GetAllAssignedIndirectsForUser", sSQL.Replace("'", "''"), 3004, ui.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching all assigned activities for a user " + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetReportsList([FromBody]DCMUser user)
        {
            List<CostCenters> list = new List<CostCenters>();
            string sSQL = string.Empty; // "select FormObject from DCMScreenAccess where UserGroup in (Select UserGroup from DCMUser where UserName = '"+user.Username+"'  ) and FormObject in (select Name from DCMScreen where Parent = 'Report' and Header = 'Y') ";

         
            sSQL = " select distinct ReportName as 'FormObject' from Report_SSRS_SubscriptionIDs WHERE Reportname in (select FormObject from DCMScreenAccess where UserGroup collate database_default in (Select UserGroup from DCM_Access.dbo.UserLoginPermission where UserName = '" + user.Username + "' ) and FormObject in (select Name from DCMScreen where Parent = 'Report' and Header = 'Y'))";
            Connection connection = new Connection();
            DataTable dt = new DataTable();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                if (ds != null)
                {
                  dt  = ds.Tables[0];
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetReportsList", sSQL.Replace("'", "''"), 3004, user.Username);
                }
                catch (Exception e) { }
                return "Error while Fetching List of Reports" + ex.Message;
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(dt);

        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllIndirectActivities([FromBody]CostCenters cc)
        {
            List<CostCenters> list = new List<CostCenters>();
            string sSQL = "select distinct Activity from ActivityInfo where ActivityType in ('Indirect')";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, cc.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CostCenters
                        {
                            ActivityName = dr["Activity"].ToString()

                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(cc.Site, "Error", "Dropdowns", "GetAllIndirectActivities", sSQL.Replace("'", "''"), 3004, cc.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching ActivityGroup" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]

        public string GetAllLoggedUsers([FromBody] UserInfo user)
        {

            List<string> list = new List<string>();
            string sSQL = " Select ui.FirstName +' '+ ui.Surname+' (' + ui.UserID +')' as 'FullName'"+
                           "from UserInfo ui, BundyClock bc  LEFT join TimeInfoByUser tiu  ON bc.UserID = tiu.UserID  AND convert(date, bc.StartDateTime,103) = convert(date, tiu.StartDate, 103)   Where bc.UserID = ui.UserID And Convert(DateTime, Convert(Char(19),bc.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'"+user.StartDate+"',103),103)" +
                           "And Convert(DateTime, Convert(Char(19),'"+user.EndDate+"',103),103)  Order by ui.FirstName,ui.Surname,bc.StartDateTime";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {

                    string FullName = dr["FullName"].ToString();
           

                    list.Add(FullName);

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetAllLoggedUsers", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching UserList" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllUserGroups([FromBody] UserInfo user)
        {
            List<string> list = new List<string>();
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            string sSQL = "select Usergroup from UserGroup order by Usergroup";
            SqlCommand cmd = new SqlCommand(sSQL, conn);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            try
            {

                DataSet ds = new DataSet() ;
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {

                   list.Add(dr["UserGroup"].ToString());

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetAlluserGroups", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                return "Error while Fetching UserList" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllDCMUsers([FromBody] DCMUser user)
        {
            List<DCMUser> list = new List<DCMUser>();
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            string sSQL = "select FirstName, Surname, UserName, Email, Warehouse, UserGroup from UserLoginPermission order by FirstName, Surname";
            SqlCommand cmd = new SqlCommand(sSQL, conn);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            try
            {

                DataSet ds = new DataSet();
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {

                    DCMUser dcm = new DCMUser();

                   dcm.Username= dr["UserName"].ToString();
                   dcm.FirstName = dr["FirstName"].ToString();
                   dcm.LastName = dr["Surname"].ToString();
                   dcm.Email = dr["Email"].ToString();
                    dcm.UserGroup = dr["UserGroup"].ToString();
                    dcm.AccessSite = dr["Warehouse"].ToString();


                    list.Add(dcm);

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetAllDCMUsers", sSQL.Replace("'", "''"), 3004, "");
                }
                catch (Exception e) { }
                return "Error while Fetching UserList" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }


        
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSelectedGroupDCMUsers([FromBody] DCMUser user)
        {
            List<string> list = new List<string>();
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            string sSQL = "select FirstName + ' '+Surname+ ' ('+UserName+')'  as FullName from UserLoginPermission where  UserGroup = '"+user.UserGroup+"'";
            SqlCommand cmd = new SqlCommand(sSQL, conn);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            string fullnames = "";
            try
            {

                DataSet ds = new DataSet();
                da.Fill(ds);
             
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {

                    //if (i == 0)
                    //{
                    //    fullnames = fullnames + ds.Tables[0].Rows[i]["FullName"].ToString();
                    //}
                    //else
                    //{
                    //    fullnames = fullnames + "," + ds.Tables[0].Rows[i]["FullName"].ToString();
                    //}

                    list.Add(ds.Tables[0].Rows[i]["FullName"].ToString());

                }


                 

                
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetAllSelectedGroupDCMUsers", sSQL.Replace("'", "''"), 3004, "");
                }
                catch (Exception e) { }
                return "Error while Fetching UserList" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllUserGroupScreens([FromBody] DCMUser user)
        {

            List<string> list = new List<string>();
            string sSQL = "select distinct  Name from dcmscreen where Name in (select Distinct FormObject from DCMScreenAccess where Usergroup='"+user.UserGroup+"') and Header = 'Y'"  ;
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {

                    string screenname = dr["Name"].ToString();


                    list.Add(screenname);

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetAllUserGroupScreens", sSQL.Replace("'", "''"), 3004,"");
                }
                catch (Exception e) { }
                return "Error while Fetching UserList" + ex.Message;
            }
            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateUserGroup([FromBody] DCMUser user)
        {
            Connection connection = new Connection();

            try
            {
                string sSQL = "";
                if (user.ScreenName.Length > 1)
                {
                    string[] screens = user.ScreenName.Split(',');
                    sSQL = " delete from DCMScreenAccess where  FormObject in (Select Name from DCMScreen where Header = 'Y')  and UserGroup = '" + user.UserGroup + "'";
                    string result = connection.ExecuteDeleteQuery(sSQL, user.Site);

                    if (result.Equals("Delete SuccessFull"))
                    {
                        foreach (string screen in screens)
                        {
                            sSQL = "insert into DCMScreenAccess (Formobject,UserGroup) values ('" + screen + "','" + user.UserGroup + "')";
                            connection.ExecuteDeleteQuery(sSQL, user.Site);
                        }
                    }
                    
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Pickers", "UpdateUserGroup", ex.Message.Replace("'", "''"), 3004, "");
                }
                catch (Exception e) { }
                return "Error Occured while updating the user group";

            }
          
           
           
            return "User group updated";
          
        }

      

    }
}
