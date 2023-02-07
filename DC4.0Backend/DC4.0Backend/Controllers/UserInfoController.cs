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
    public class UserInfoController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllUsers([FromBody] UserInfo userobject)
        {
            string sSQL = String.Empty;

            sSQL = "Select UserID 'User Name' ,FirstName 'First Name',Surname, EmployeeId, IsNull(EmployeeCategory,'') 'Emp Category', ShiftCode,isnull(TeamManager,'') 'Team Manager', Status,IsNull(Agency,'')'Agency',IsNull(Level,'')'Level',"+
             "IsNull(FirstAid, '')'FirstAid' , IsNull(Role, '') 'Role' , IsNull(PartTime, '')'PartTime', IsNull(DeptCode, '') 'Dept Code',"+
             "Sex, REPLACE(CONVERT(varchar, DateJoining, 103), ' ', ' / ') 'Date Joining',REPLACE(CONVERT(varchar, DateLeaving, 103), ' ', ' / ')  'Date Leaving', isnull(bi.BundyID, '') 'TabletID' "+
            "from userinfo ui left join BundyID bi on ui.UserID = bi.UserName order by ui.FirstName , ui.SurName ";

            try
            {
                Logging.WriteLog(userobject.Site, "Info", "UserDetails", "GetAllUsers", sSQL.Replace("'", "''"), 1002, userobject.DCMUser);
            }
            catch (Exception ex)
            {

            }
            

            Connection connection = new Connection();

            List<UserInfo> users = new List<UserInfo>();
            try
            {
                DataSet ds = connection.ExecuteSelectQuery(sSQL, userobject.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {


                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        UserInfo user = new UserInfo();
                        user.UserID = ds.Tables[0].Rows[i]["User Name"].ToString();
                        user.FirstName = ds.Tables[0].Rows[i]["First Name"].ToString();
                        user.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                        user.EmployeeID = ds.Tables[0].Rows[i]["EmployeeId"].ToString();
                        user.EmployeeCategory = ds.Tables[0].Rows[i]["Emp Category"].ToString();
                        user.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                        user.TeamManager = ds.Tables[0].Rows[i]["Team Manager"].ToString();
                        user.Status = ds.Tables[0].Rows[i]["Status"].ToString();
                        user.Agency = ds.Tables[0].Rows[i]["Agency"].ToString();
                        user.Level = ds.Tables[0].Rows[i]["Level"].ToString();
                        user.FirstAid = ds.Tables[0].Rows[i]["FirstAid"].ToString();
                        user.Role = ds.Tables[0].Rows[i]["Role"].ToString();
                        user.PartTime = ds.Tables[0].Rows[i]["PartTime"].ToString();
                        user.Sex = ds.Tables[0].Rows[i]["Sex"].ToString();
                        user.DeptCode = ds.Tables[0].Rows[i]["Dept Code"].ToString();
                        user.DateJoining = ds.Tables[0].Rows[i]["Date Joining"].ToString();
                        user.DateLeaving = ds.Tables[0].Rows[i]["Date Leaving"].ToString();
                        user.TabletID = ds.Tables[0].Rows[i]["TabletID"].ToString();
                        users.Add(user);

                    }

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(userobject.Site, "Error", "UserDetails", "GetAllUsers", sSQL.Replace("'", "''"), 3002, userobject.DCMUser);
                }
                catch (Exception e)
                {

                }
                
                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(users);
        }

        //Makita
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllMakitaUsers([FromBody] UserInfo userobject)
        {
            string sSQL = String.Empty;

            sSQL = "Select UserID 'User Name' ,FirstName 'First Name',Surname  ,Sex, REPLACE(CONVERT(varchar, DateJoining, 103),' ',' / ') 'Date Joining'," +
                  "REPLACE(CONVERT(varchar, DateLeaving, 103),' ',' / ')  'Date Leaving', EmployeeId,IsNull(EmployeeCategory,'') 'Emp Category', ShiftCode,isnull(TeamManager,'') 'Team Manager', Status,IsNull(Agency,'')'Agency'," +
                  "IsNull(Level,'')'Level', IsNull(FirstAid,'')'FirstAid' , IsNull(Role,'') 'Role', IsNull(Grade,'') 'Grade' , IsNull(PayBundyTime,'')'PayBundyTime', IsNull(DeptCode,'') 'Dept Code', " +
                  " IsNull(PayCode,'') 'Pay Code', IsNull(PartTime,'') 'PartTime',isManager from userinfo Where 1=1 and Status = 'A' Order By LTRIM(FirstName)";

            try
            {
                Logging.WriteLog(userobject.Site, "Info", "UserDetails", "GetAllUsers", sSQL.Replace("'", "''"), 1002, userobject.DCMUser);
            }
            catch (Exception ex)
            {

            }


            Connection connection = new Connection();

            List<UserInfo> users = new List<UserInfo>();
            try
            {
                DataSet ds = connection.ExecuteSelectQuery(sSQL, userobject.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {


                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        UserInfo user = new UserInfo();
                        user.UserID = ds.Tables[0].Rows[i]["User Name"].ToString();
                        user.FirstName = ds.Tables[0].Rows[i]["First Name"].ToString();
                        user.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                        user.EmployeeID = ds.Tables[0].Rows[i]["EmployeeId"].ToString();
                        user.EmployeeCategory = ds.Tables[0].Rows[i]["Emp Category"].ToString();
                        user.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                        user.TeamManager = ds.Tables[0].Rows[i]["Team Manager"].ToString();
                        user.Status = ds.Tables[0].Rows[i]["Status"].ToString();
                        user.Agency = ds.Tables[0].Rows[i]["Agency"].ToString();
                        user.Level = ds.Tables[0].Rows[i]["Level"].ToString();
                        user.FirstAid = ds.Tables[0].Rows[i]["FirstAid"].ToString();
                        user.Role = ds.Tables[0].Rows[i]["Role"].ToString();
                        user.PartTime = ds.Tables[0].Rows[i]["PartTime"].ToString();
                        user.Sex = ds.Tables[0].Rows[i]["Sex"].ToString();
                        user.DeptCode = ds.Tables[0].Rows[i]["Dept Code"].ToString();
                        user.DateJoining = ds.Tables[0].Rows[i]["Date Joining"].ToString();
                        user.DateLeaving = ds.Tables[0].Rows[i]["Date Leaving"].ToString();
                        user.Grade = ds.Tables[0].Rows[i]["Grade"].ToString();
                        user.PayBundyTime = ds.Tables[0].Rows[i]["PayBundyTime"].ToString();
                        user.IsManager = ds.Tables[0].Rows[i]["IsManager"].ToString();
                        user.PayCode = ds.Tables[0].Rows[i]["Pay Code"].ToString();
                        users.Add(user);

                    }

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(userobject.Site, "Error", "UserDetails", "GetAllUsers", sSQL.Replace("'", "''"), 3002, userobject.DCMUser);
                }
                catch (Exception e)
                {

                }

                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(users);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string updateUser([FromBody] UserInfo user)
        {
            string sSQL = String.Empty;
            sSQL = "select count(*) from Userinfo where UserID = '" + user.UserID + "'";

            Connection connection = new Connection();
            string result = string.Empty;


            try
            {
                int count = int.Parse(connection.ReturnSingleValue(sSQL, user.Site).ToString());

                if (count == 1)
                {
                    if (user.EmployeeCategory == "Permanent")
                    {
                        user.Level = "";
                        user.Agency = "";
                    }
                    if (user.DateLeaving.Equals(""))
                    {
                        sSQL = "update userinfo set surname = UPPER('" + user.Surname + "'), firstname = UPPER('" + user.FirstName + "'),sex='" + user.Sex + "',datejoining=  Convert(date,'" + user.DateJoining + "',103),dateleaving= null,Level = '" + user.Level + "',employeeid = '" + user.EmployeeID + "',Agency = '" + user.Agency + "'," +
                      "shiftcode = '" + user.ShiftCode + "',status = '" + user.Status + "',TeamManager = '" + user.TeamManager + "',FirstAid = '" + user.FirstAid + "', Role= '" + user.Role + "',PartTime = '" + user.PartTime + "',DeptCode = '" + user.DeptCode + "',EmployeeCategory = '" + user.EmployeeCategory + "' where userid = '" + user.UserID + "'";
                    }
                    else
                    {
                        sSQL = "update userinfo set surname = UPPER('" + user.Surname + "'), firstname = UPPER('" + user.FirstName + "'),sex='" + user.Sex + "',datejoining=  Convert(date,'" + user.DateJoining + "',103),dateleaving=Convert(date,'" + user.DateLeaving + "',103),Level = '" + user.Level + "',employeeid = '" + user.EmployeeID + "',Agency = '" + user.Agency + "'," +
                      "shiftcode = '" + user.ShiftCode + "',status = '" + user.Status + "',TeamManager = '" + user.TeamManager + "',FirstAid = '" + user.FirstAid + "', Role= '" + user.Role + "',PartTime = '" + user.PartTime + "',DeptCode = '" + user.DeptCode + "',EmployeeCategory = '" + user.EmployeeCategory + "' where userid = '" + user.UserID + "'";

                    }
                  

                    try
                    {
                        Logging.WriteLog(user.Site, "Info", "UserDetails", "updateUser", sSQL.Replace("'", "''"), 1003, user.DCMUser);
                    } catch (Exception ex)
                    {

                    }

                  string strresult =   connection.ExecuteUpdateQuery(sSQL, user.Site);

                    if (strresult != "Update SuccessFull")
                    {
                        return "Update for the Record Failed";
                    }

                    //Updating the User Value in the BundyID Table as well 

                    sSQL = "Update BundyID set BundyID = '" + user.TabletID + "' where  UserName = '" + user.UserID + "'";
                    connection.ExecuteUpdateQuery(sSQL, user.Site);

                    result = "Selected User Updated";
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(user.Site, "Warning", "UserDetails", "updateUser", sSQL.Replace("'", "''"), 2001, user.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }

                    return "Update Failed. Multiple records or no records are present in the system.";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "UserDetails", "GetAllUsers", sSQL.Replace("'", "''"), 3003, user.DCMUser);
                }
                catch (Exception e){}
                
                return "Error Occured while updating: " + ex.Message;
            }

            return result;
        }

        //Makita
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string updateMakitaUser([FromBody] UserInfo user)
        {
            string sSQL = String.Empty;
            sSQL = "select count(*) from Userinfo where UserID = '" + user.UserID + "'";

            Connection connection = new Connection();
            string result = string.Empty;


            try
            {
                int count = int.Parse(connection.ReturnSingleValue(sSQL, user.Site).ToString());

                if (count == 1)
                {
                    if (user.EmployeeCategory == "Permanent")
                    {
                        user.Level = "";
                        user.Agency = "";
                    }
                    if (user.DateLeaving.Equals(""))
                    {
                        sSQL = "update userinfo set surname = UPPER('" + user.Surname + "'), firstname = UPPER('" + user.FirstName + "'),sex='" + user.Sex + "',datejoining=  Convert(date,'" + user.DateJoining + "',103),dateleaving= null,Level = '" + user.Level + "',employeeid = '" + user.EmployeeID + "',Agency = '" + user.Agency + "'," +
                      "shiftcode = '" + user.ShiftCode + "',status = '" + user.Status + "',TeamManager = '" + user.TeamManager + "',FirstAid = '" + user.FirstAid + "', Role= '" + user.Role + "',PartTime = '" + user.PartTime + "',DeptCode = '" + user.DeptCode + "',EmployeeCategory = '" + user.EmployeeCategory + "', IsManager= '"+user.IsManager+"',  PayBundyTime = '"+user.PayBundyTime+"'  where userid = '" + user.UserID + "'";
                    }
                    else
                    {
                        sSQL = "update userinfo set surname = UPPER('" + user.Surname + "'), firstname = UPPER('" + user.FirstName + "'),sex='" + user.Sex + "',datejoining=  Convert(date,'" + user.DateJoining + "',103),dateleaving=Convert(date,'" + user.DateLeaving + "',103),Level = '" + user.Level + "',employeeid = '" + user.EmployeeID + "',Agency = '" + user.Agency + "'," +
                      "shiftcode = '" + user.ShiftCode + "',status = '" + user.Status + "',TeamManager = '" + user.TeamManager + "',FirstAid = '" + user.FirstAid + "', Role= '" + user.Role + "',PartTime = '" + user.PartTime + "',DeptCode = '" + user.DeptCode + "',EmployeeCategory = '" + user.EmployeeCategory + "', IsManager= '" + user.IsManager + "',  PayBundyTime = '" + user.PayBundyTime + "' where userid = '" + user.UserID + "'";

                    }


                    try
                    {
                        Logging.WriteLog(user.Site, "Info", "UserDetails", "updateUser", sSQL.Replace("'", "''"), 1003, user.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }

                    string strresult = connection.ExecuteUpdateQuery(sSQL, user.Site);

                    if (strresult != "Update SuccessFull")
                    {
                        return "Update for the Record Failed";
                    }

                    //Updating the User Value in the BundyID Table as well 

                    sSQL = "Update BundyID set BundyID = '" + user.TabletID + "' where  UserName = '" + user.UserID + "'";
                    connection.ExecuteUpdateQuery(sSQL, user.Site);

                    result = "Selected User Updated";
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(user.Site, "Warning", "UserDetails", "updateUser", sSQL.Replace("'", "''"), 2001, user.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }

                    return "Update Failed. Multiple records or no records are present in the system.";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "UserDetails", "GetAllUsers", sSQL.Replace("'", "''"), 3003, user.DCMUser);
                }
                catch (Exception e) { }

                return "Error Occured while updating: " + ex.Message;
            }

            return result;
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string InsertUser([FromBody] UserInfo user)
        {
            string sSQL = String.Empty;
            sSQL = "select count(*) from Userinfo where UserID = '" + user.UserID + "'";


            Connection connection = new Connection();
            string result = string.Empty;

            try
            {
                int count = int.Parse(connection.ReturnSingleValue(sSQL, user.Site).ToString());

                if (count == 0)
                {
                    

                    if (user.EmployeeCategory == "Permanent")
                    {
                        user.Level = "";
                        user.Agency = "";
                    }

                    if (user.DateLeaving.Equals(""))
                    {
                        sSQL = "Insert Into UserInfo(UserID, Surname, FirstName, Sex, DateJoining, DateLeaving, EmployeeID, EmployeeCategory, Agency, Level, ShiftCode, Status, TeamManager, FirstAid, Role, PartTime, DeptCode)" +
                        " Values('" + user.UserID + "', UPPER('" + user.Surname.Replace("'", "''") + "'), UPPER('" + user.FirstName.Replace("'", "''") + "'), '" + user.Sex + "', Convert(Date,'" + user.DateJoining + "',103), null, '" + user.EmployeeID + "', '" + user.EmployeeCategory + "', '" + user.Agency + "', '" + user.Level + "', '" + user.ShiftCode + "', '" + user.Status + "', '" + user.TeamManager + "', '" + user.FirstAid + "', '" + user.Role + "', '" + user.PartTime + "', '" + user.DeptCode + "')";
                    }
                    else
                    {

                        sSQL = "Insert Into UserInfo(UserID, Surname, FirstName, Sex, DateJoining, DateLeaving, EmployeeID, EmployeeCategory, Agency, Level, ShiftCode, Status, TeamManager, FirstAid, Role, PartTime, DeptCode)" +
                            " Values('" + user.UserID + "', UPPER('" + user.Surname.Replace("'", "''") + "'), UPPER('" + user.FirstName.Replace("'", "''") + "'), '" + user.Sex + "', Convert(Date,'" + user.DateJoining + "',103), Convert(Date,'" + user.DateLeaving + "',103), '" + user.EmployeeID + "', '" + user.EmployeeCategory + "', '" + user.Agency + "', '" + user.Level + "', '" + user.ShiftCode + "', '" + user.Status + "', '" + user.TeamManager + "', '" + user.FirstAid + "', '" + user.Role + "', '" + user.PartTime + "', '" + user.DeptCode + "')";
                    }
                    
                    try
                    {
                        Logging.WriteLog(user.Site, "Info", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 1001, user.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                     string strresult = connection.ExecuteInsertQuery(sSQL, user.Site);
                    if (strresult != "Insert SuccessFull")
                    {
                        return "New User Insert Failed";
                    }

                   // Adding the Tablet ID to the BundyID Table

                    sSQL = "select count(*) from BundyID where UserName = '"+user.UserID+"'";

                    if (int.Parse(connection.ReturnSingleValue(sSQL, user.Site)) == 0)
                    {
                        sSQL = "insert into BundyID(UserName,BundyID) values ('" + user.UserID + "','" + user.TabletID + "')";
                        connection.ExecuteInsertQuery(sSQL, user.Site);
                    }
                    else
                    {
                        sSQL = "Update BundyID set BundyID = '" + user.TabletID + "' where  UserName = '"+user.UserID+"'";
                        connection.ExecuteUpdateQuery(sSQL, user.Site);
                    }

                    sSQL = "insert into OnboardingCheckList_Users (UserID,ChecklistNumber, Checklist,IsTicked) select '" + user.UserID + "', ChecklistNumber, Checklist, '' from OnboardingCheckList WHERE IsActive = 'Y'";
                    connection.ExecuteInsertQuery(sSQL, user.Site);

                    result = "New User Inserted";
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(user.Site, "Warning", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 2001, user.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                    result = "Duplicate entries present for the UserID. Please select another User ID.";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 3001, user.DCMUser);
                }
                catch (Exception e) { }
                
                return "Error Occured while adding new user: " + ex.Message;
            }

            return result;
        }


        //Makita
        
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string InsertMakitaUser([FromBody] UserInfo user)
        {
            string sSQL = String.Empty;
            sSQL = "select count(*) from Userinfo where UserID = '" + user.UserID + "'";


            Connection connection = new Connection();
            string result = string.Empty;

            try
            {
                int count = int.Parse(connection.ReturnSingleValue(sSQL, user.Site).ToString());

                if (count == 0)
                {


                    if (user.EmployeeCategory == "Permanent")
                    {
                        user.Level = "";
                        user.Agency = "";
                    }

                    if (user.DateLeaving.Equals(""))
                    {
                        sSQL = "Insert Into UserInfo(UserID, Surname, FirstName, Sex, DateJoining, DateLeaving, EmployeeID, EmployeeCategory, Agency, Level, ShiftCode, Status, TeamManager, FirstAid, Role, PartTime, DeptCode, PayBundyTime,IsManager)" +
                        " Values('" + user.UserID + "', UPPER('" + user.Surname.Replace("'", "''") + "'), UPPER('" + user.FirstName.Replace("'", "''") + "'), '" + user.Sex + "', Convert(Date,'" + user.DateJoining + "',103), null, '" + user.EmployeeID + "', '" + user.EmployeeCategory + "', '" + user.Agency + "', '" + user.Level + "', '" + user.ShiftCode + "', '" + user.Status + "', '" + user.TeamManager + "', '" + user.FirstAid + "', '" + user.Role + "', '" + user.PartTime + "', '" + user.DeptCode + "', '"+user.PayBundyTime+"','"+user.IsManager+"')";
                    }
                    else
                    {

                        sSQL = "Insert Into UserInfo(UserID, Surname, FirstName, Sex, DateJoining, DateLeaving, EmployeeID, EmployeeCategory, Agency, Level, ShiftCode, Status, TeamManager, FirstAid, Role, PartTime, DeptCode, PayBundyTime,IsManager)" +
                            " Values('" + user.UserID + "', UPPER('" + user.Surname.Replace("'", "''") + "'), UPPER('" + user.FirstName.Replace("'", "''") + "'), '" + user.Sex + "', Convert(Date,'" + user.DateJoining + "',103), Convert(Date,'" + user.DateLeaving + "',103), '" + user.EmployeeID + "', '" + user.EmployeeCategory + "', '" + user.Agency + "', '" + user.Level + "', '" + user.ShiftCode + "', '" + user.Status + "', '" + user.TeamManager + "', '" + user.FirstAid + "', '" + user.Role + "', '" + user.PartTime + "', '" + user.DeptCode + "', '" + user.PayBundyTime + "','" + user.IsManager + "')";
                    }

                    try
                    {
                        Logging.WriteLog(user.Site, "Info", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 1001, user.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                    string strresult = connection.ExecuteInsertQuery(sSQL, user.Site);
                    if (strresult != "Insert SuccessFull")
                    {
                        return "New User Insert Failed";
                    }

                    // Adding the Tablet ID to the BundyID Table

                    sSQL = "select count(*) from BundyID where UserName = '" + user.UserID + "'";

                    if (int.Parse(connection.ReturnSingleValue(sSQL, user.Site)) == 0)
                    {
                        sSQL = "insert into BundyID(UserName,BundyID) values ('" + user.UserID + "','" + user.TabletID + "')";
                        connection.ExecuteInsertQuery(sSQL, user.Site);
                    }
                    else
                    {
                        sSQL = "Update BundyID set BundyID = '" + user.TabletID + "' where  UserName = '" + user.UserID + "'";
                        connection.ExecuteUpdateQuery(sSQL, user.Site);
                    }

                    sSQL = "insert into OnboardingCheckList_Users (UserID,ChecklistNumber, Checklist,IsTicked) select '" + user.UserID + "', ChecklistNumber, Checklist, '' from OnboardingCheckList WHERE IsActive = 'Y'";
                    connection.ExecuteInsertQuery(sSQL, user.Site);

                    result = "New User Inserted";
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(user.Site, "Warning", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 2001, user.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                    result = "Duplicate entries present for the UserID. Please select another User ID.";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 3001, user.DCMUser);
                }
                catch (Exception e) { }

                return "Error Occured while adding new user: " + ex.Message;
            }

            return result;
        }




        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string getAllShiftCodes([FromBody] UserInfo user)
        {
            List<ShiftCode> Allshiftcodes = new List<ShiftCode>();
            string sSQL = "select ShiftCode from ShiftCode order by ShiftCode asc";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                Allshiftcodes = (from DataRow dr in ds.Tables[0].Rows
                                 select new ShiftCode
                                 {

                                     shiftcode = dr["ShiftCode"].ToString()
                                 }).ToList();

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "getAllShiftCodes", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                
                return "Error while Fetching the Shift Codes with error:" + ex.Message;
            }


            return JsonSerializer.Serialize(Allshiftcodes);

        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string getAllAgencies([FromBody] UserInfo user)
        {
            List<Agency> agencynames = new List<Agency>();
            string sSQL = "Select Distinct(Rtrim(AgencyName)) 'AgencyName' from Agency Order By AgencyName";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                agencynames = (from DataRow dr in ds.Tables[0].Rows
                               select new Agency
                               {

                                   AgencyName = dr["AgencyName"].ToString()
                               }).ToList();

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "getAllAgencies", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                
                return "Error while Fetching the User Roles with error:" + ex.Message;
            }


            return JsonSerializer.Serialize(agencynames);


        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetUserRole([FromBody] UserInfo user)
        {
            List<UserRole> userroles = new List<UserRole>();
            string sSQL = "select UserRole FROM UserRole ORDER BY UserRole";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                userroles = (from DataRow dr in ds.Tables[0].Rows
                             select new UserRole
                             {

                                 Role = dr["UserRole"].ToString()
                             }).ToList();

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetUserRole", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                
                return "Error while Fetching the User Roles with error:" + ex.Message;
            }


            return JsonSerializer.Serialize(userroles);


        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetUnassignedIndirectActivities([FromBody]UserInfo user)
        {
            List<IndirectActivity> unassignedactivities = new List<IndirectActivity>();
            string sSQL = "Select ActivityName From ActivityInfo Where ActivityType = 'Indirect'"
           + " And ActivityName not in(Select ActivityName From AssignIndirectActivity"
            + " Where UserID = '" + user.UserID + "')"
         + " ORDER BY substring(ActivityName, (charindex('-', ActivityName) ), LEN(activityName)),ActivityName";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                unassignedactivities = (from DataRow dr in ds.Tables[0].Rows
                                        select new IndirectActivity
                                        {

                                            Activity = dr["ActivityName"].ToString()
                                        }).ToList();

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetUnassignedIndirectActivities", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                
                return "Error while Fetching the inassigned indirect with error:" + ex.Message;
            }


            return JsonSerializer.Serialize(unassignedactivities);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAssignedIndirectActivities([FromBody]UserInfo user)
        {
            List<IndirectActivity> assignedact = new List<IndirectActivity>();

            string sSQL = "Select ActivityName From ActivityInfo"
                + " Where ActivityType = 'Indirect'"
                 + " And ActivityName in(Select ActivityName From AssignIndirectActivity"
                 + " Where UserID = '" + user.UserID + "')"
                 + " ORDER BY substring(ActivityName, (charindex('-', ActivityName) ), LEN(activityName)),ActivityName";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                assignedact = (from DataRow dr in ds.Tables[0].Rows
                               select new IndirectActivity
                               {

                                   Activity = dr["ActivityName"].ToString()
                               }).ToList();

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetAssignedIndirectActivities", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                
                return "Error while Fetching the assigned indirect with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(assignedact);
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllManagersName([FromBody]UserInfo user)
        {
            List<TeamManager> teamamanagers = new List<TeamManager>();
            string sSQL = "Select ManagerName from TeamManager Order by ManagerName Asc";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

                teamamanagers = (from DataRow dr in ds.Tables[0].Rows
                                 select new TeamManager
                                 {

                                     ManagerName = dr["ManagerName"].ToString()
                                 }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "Dropdowns", "GetAllManagersName", sSQL.Replace("'", "''"), 3004, user.DCMUser);
                }
                catch (Exception e) { }
                
                return "Error while Fetching the User Roles with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(teamamanagers);
        }


        

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateUserRoster([FromBody]UserInfo user)
        {
            DateTime dt = DateTime.ParseExact(user.StartDate, "yyyy-mm-dd", CultureInfo.InvariantCulture);
            user.StartDate = dt.ToString("dd/mm/yyyy");

         dt = DateTime.ParseExact(user.EndDate, "yyyy-mm-dd", CultureInfo.InvariantCulture);
            user.EndDate = dt.ToString("dd/mm/yyyy");

            string sSQL = "EXEC spCreateTimeInfoByUserRecords @sStartDate='" +user.StartDate+ "', @sEndDate='" +user.EndDate+ "', @sUserID='" +user.UserID+ "'";
            Connection connection = new Connection();
            try
            {
                try
                {
                    Logging.WriteLog(user.Site, "Info", "UserDetails", "UpdateUserRoster", sSQL.Replace("'", "''"), 1005, user.DCMUser);
                }
                catch (Exception ex)
                {

                }
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "UserDetails", "UpdateUserRoster", sSQL.Replace("'", "''"), 3005, user.DCMUser);
                }
                catch (Exception e) { }
                
                return "Error while Fetching Creating the User Roster" + ex.Message;
            }

            return "User Roster Created";

        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string ChangePayroll([FromBody]PayrollChange payrollChange)
        {
            payrollChange.Salary = Convert.ToDecimal(payrollChange.Salary);
            payrollChange.OrdinaryTime = Convert.ToDecimal(payrollChange.OrdinaryTime);
            payrollChange.TimeAndHalf = Convert.ToDecimal(payrollChange.TimeAndHalf);
            payrollChange.DoubleTime = Convert.ToDecimal(payrollChange.DoubleTime);
            payrollChange.DoubleAndHalf = Convert.ToDecimal(payrollChange.DoubleAndHalf);
            payrollChange.LeadingRate = Convert.ToDouble(payrollChange.LeadingRate);

            String sSQL = "INSERT INTO PermanentPayrollMakita_webversion(" +
            "UserID," +
            "Salary," +
            "OvertimeAllowed," +
            "OrdinaryTime," +
            "TimeAndHalf," +
            "DoubleTime," +
            "DoubleAndHalf," +
            "SEffectiveDate," +
            "SIneffectiveDate," +
            "LeadingRate," +
            "LeadingRateAllowed," +
            "LREffectiveDate," +
            "LRIneffectiveDate," +
            "AfternoonAllowance," +
            "AEffectiveDate," +
            "AIneffectiveDate) VALUES(" +
            "'" + payrollChange.UserID + "'," +
            payrollChange.Salary + "," +
            "'" + payrollChange.OvertimeAllowed + "'," +
            payrollChange.OrdinaryTime+ "," +
            payrollChange.TimeAndHalf+ "," +
            payrollChange.DoubleTime+ "," +
            payrollChange.DoubleTime+ "," +
            "'" + payrollChange.SEffectiveDate.ToString("yyyy-MM-dd") + "'," +
            "'" + payrollChange.SIneffectiveDate.ToString("yyyy-MM-dd") + "'," +
            payrollChange.LeadingRate + "," +
            "'" + payrollChange.LeadingRateAllowed + "'," +
            "'" + payrollChange.LREffectiveDate.ToString("yyyy-MM-dd") + "'," +
            "'" + payrollChange.LRIneffectiveDate.ToString("yyyy-MM-dd") + "'," +
            "'" + payrollChange.AfternoonAllowance + "'," +
            "'" + payrollChange.AEffectiveDate.ToString("yyyy-MM-dd") + "'," +
            "'" + payrollChange.AIneffectiveDate.ToString("yyyy-MM-dd") + "')";


            Connection conn = new Connection();


            try
            {
                try
                {
                    Logging.WriteLog(payrollChange.Site, "Info", "UserDetails", "ChangePayroll", sSQL.Replace("'", "''"), 1006, payrollChange.DCMUser);
                }
                catch (Exception ex)
                {

                }
                DataSet ds = conn.ReturnCompleteDataSet(sSQL, payrollChange.Site);

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(payrollChange.Site, "Error", "UserDetails", "ChangePayroll", sSQL.Replace("'", "''"), 3005, payrollChange.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Creating the Date Effective Payroll Entry" + ex.Message;
            }

            return "Date Effective Payroll Entry Created";    
        }




        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetPayroll([FromBody]PayrollChange payrollChange)
        {
            string result = "";
            string sSQL = "SELECT TOP 1 * FROM PermanentPayrollMakita_webversion WHERE UserID = '" + payrollChange.UserID + "' ORDER BY AddDate DESC";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, payrollChange.Site);
                if(ds.Tables[0].Rows.Count != 1)
                {
                    return "";
                }


                DataRow row = ds.Tables[0].Rows[0];


                PayrollChange obj = new PayrollChange();
                obj.UserID = row["UserID"].ToString();
                obj.Salary = Convert.ToDecimal(row["Salary"]);
                obj.OvertimeAllowed = row["OvertimeAllowed"].ToString();
                obj.OrdinaryTime = Convert.ToDecimal(row["OrdinaryTime"]);
                obj.TimeAndHalf = Convert.ToDecimal(row["TimeAndHalf"]);
                obj.DoubleTime = Convert.ToDecimal(row["DoubleTime"]);
                obj.DoubleAndHalf = Convert.ToDecimal(row["DoubleAndHalf"]);
                obj.SEffectiveDate = Convert.ToDateTime(row["SEffectiveDate"]);
                obj.SIneffectiveDate = Convert.ToDateTime(row["SIneffectiveDate"]);
                obj.LeadingRate = Double.Parse(row["LeadingRate"].ToString());
                obj.LeadingRateAllowed = row["LeadingRateAllowed"].ToString();
                obj.LREffectiveDate = Convert.ToDateTime(row["LREffectiveDate"]);
                obj.LRIneffectiveDate = Convert.ToDateTime(row["LRIneffectiveDate"]);
                obj.AfternoonAllowance = row["AfternoonAllowance"].ToString();
                obj.AEffectiveDate = Convert.ToDateTime(row["AEffectiveDate"]);
                obj.AIneffectiveDate = Convert.ToDateTime(row["AIneffectiveDate"]);
                
                result = JsonSerializer.Serialize(obj);


            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(payrollChange.Site, "Error", "Modal", "GetPayroll", sSQL.Replace("'", "''"), 3004, payrollChange.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Payroll Changes with error:" + ex.Message;
            }

            return result;
        }




        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AssignLeave([FromBody]AssignLeave leave)
        {

            Connection conn = new Connection();
            string UserStartTime = string.Empty;
            string UserEndTime = string.Empty;

          
            leave.FromDate = leave.EffectiveDate;
            leave.ToDate = leave.IneffectiveDate;

            int approvedrecords = 0;
            int totalrecords = 0;
           
            string sSQL = "Declare @MinDate varchar(10) = replace('"+leave.FromDate.ToString("yyyy-MM-dd")+"','-','')" +
                           "Declare @MaxDate varchar(10) = replace('"+leave.ToDate.ToString("yyyy-MM-dd")+"', '-', '')" +
                      "   ; with a as" +
                     "( SELECT TOP (DATEDIFF(DAY, @MinDate, @MaxDate) + 1) Date = DATEADD(DAY, ROW_NUMBER() OVER(ORDER BY a.object_id) - 1, @MinDate)" +
                     "  FROM sys.all_objects a CROSS JOIN sys.all_objects b) " +
                     " SELECT * FROM a WHERE Date not in (Select date from PublicHoliday)  AND DATEPART(DW, Date) not in (1, 7)";

            try
            {

                DataSet ds = conn.ReturnCompleteDataSet(sSQL, leave.Site);
                totalrecords = ds.Tables[0].Rows.Count;

                try
                {
                    Logging.WriteLog(leave.Site, "Info", "UserDetails", "AssignLeave", sSQL.Replace("'", "''"), 1006, leave.DCMUser);
                }
                catch (Exception ex)
                {

                }

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string DatePicked = Convert.ToDateTime(ds.Tables[0].Rows[i][0].ToString()).ToString("dd/MM/yyyy");

                    try
                    {
                        //'Creating records if there is not any in TimeInfoByUser table for a partcular user and date

                        sSQL = "Select count(*) from TimeInfoByUser where UserID='" + leave.UserID + "'  and convert(datetime,StartDate,103)=CONVERT(datetime,'" + DatePicked + "',103)";
                        int UTIRecords = int.Parse(conn.ReturnSingleValue(sSQL, leave.Site));
                        if (UTIRecords == 0)
                        {                            
                            string sSQL_CreateRecordsUTI = "Exec spCreateTimeInfoByUserRecords '" + DatePicked + "','" + DatePicked + "','" + leave.UserID + "'";
                            try
                            {
                                Logging.WriteLog(leave.Site, "Info", "UserDetails", "AssignLeave", sSQL_CreateRecordsUTI.Replace("'", "''"), 1005, leave.DCMUser);
                            }
                            catch (Exception ex)
                            {

                            }
                            conn.ReturnCompleteDataSet(sSQL_CreateRecordsUTI, leave.Site);
                        }
                    }

                    catch (Exception ex)
                    {
                        try
                        {
                            Logging.WriteLog(leave.Site, "Error", "UserDetails", "AssignLeave", sSQL.Replace("'", "''"), 3005, leave.DCMUser);
                        }
                        catch (Exception exx) { }
                        
                        return "An error occured while creating UTI for leave Error:" + ex.Message;
                    }



                    //get the Leave Code
                    sSQL = "select LeaveCode from Leave where LeaveDesc = '" + leave.LeaveDesc + "' AND EmpType = '" + leave.EmployeeCategory +"'";
                    leave.LeaveCode = conn.ReturnSingleValue(sSQL, leave.Site);


                    // ------------------Getting Updated By----------

                    string UpdateBy = GetName(leave.UpdateBy);

                    if (UpdateBy.Equals("Error Occured"))
                    {
                        return "Unable to Fetch the User Details from the Database.Please try again";
                    }

                    //Getting Shift Start And EndTime 
                    if ((leave.LessThanOneDay.Equals("Y")))
                    {

                        UserStartTime = leave.StartTime;
                        UserEndTime = leave.EndTime;
                    }
                    else
                    {

                        sSQL = " Select ManualUserClockInTime, ManualUserClockOutTime from TimeInfoByUser where UserID = '" + leave.UserID + "'  and convert(datetime, StartDate,103)= CONVERT(datetime, '" + DatePicked + "', 103)";
                        DataSet resultdataset = conn.ReturnCompleteDataSet(sSQL, leave.Site);

                        UserStartTime = resultdataset.Tables[0].Rows[0][0].ToString();
                        UserEndTime = resultdataset.Tables[0].Rows[0][1].ToString();

                    }

                    DateTime d = Convert.ToDateTime(DatePicked);
                    DateTime t = Convert.ToDateTime(UserStartTime);
                    DateTime dtCombined = new DateTime(d.Year, d.Month, d.Day, t.Hour, t.Minute, t.Second);

                    DateTime d1 = Convert.ToDateTime(DatePicked);
                    DateTime t1 = Convert.ToDateTime(UserEndTime);
                    DateTime dtCombined2 = new DateTime(d1.Year, d1.Month, d1.Day, t1.Hour, t1.Minute, t1.Second);

                    sSQL = "select count(*) from bundyclock Where UserID = '" +leave.UserID+ "' "    
                    + " AND ((Convert(DateTime,'" + dtCombined + "',103) BETWEEN StartDateTime AND EndDateTime) OR (Convert(DateTime,'" + dtCombined2 + "',103) BETWEEN StartDateTime AND EndDateTime) " +
                    " OR ( StartDateTime between Convert(DateTime,'" + dtCombined + "',103) AND Convert(DateTime,'" + dtCombined2 + "',103) OR EndDateTime between Convert(DateTime,'" + dtCombined + "',103) AND Convert(DateTime,'" + dtCombined2 + "',103) )) ";

                    int BCRecords = int.Parse(conn.ReturnSingleValue(sSQL, leave.Site));
                    if (BCRecords > 0)
                    {

                    }
                    else
                    {

                        // ------------------Inserting data into EmpLeaveDetails and bundyClock table----------
                        if (!(leave.LessThanOneDay.Equals("Y")))
                        {
                            string insertStatement = "insert EmpLeaveDetails (UserID, LeaveDate,LeaveType) values";
                            insertStatement += "('" + leave.UserID + "',CONVERT(DATE,'" + DatePicked + "', 103),'" + leave.LeaveCode + "')";

                            try
                            {
                                Logging.WriteLog(leave.Site, "Info", "UserDetails", "AssignLeave", insertStatement.Replace("'", "''"), 1001, leave.DCMUser);
                            }
                            catch (Exception ex)
                            {

                            }

                            conn.ReturnCompleteDataSet(insertStatement, leave.Site);

                            string sSQL_UpdateBundyClock = "Exec spLeaveDetails '" + DatePicked + "','" + leave.UserID + "','" + UpdateBy + "'";

                            try
                            {
                                Logging.WriteLog(leave.Site, "Info", "UserDetails", "AssignLeave", sSQL_UpdateBundyClock.Replace("'", "''"), 1005, leave.DCMUser);
                            }
                            catch (Exception ex)
                            {

                            }

                            conn.ReturnCompleteDataSet(sSQL_UpdateBundyClock, leave.Site);
                        }
                        else
                        {
                            string insertStatement = "insert EmpLeaveDetails (UserID, LeaveDate,LeaveType,StartTime,EndTime) values";
                            insertStatement += "('" + leave.UserID + "', CONVERT(DATE,'" + DatePicked + "', 103),'" + leave.LeaveCode + "','" + leave.StartTime + "','" + leave.EndTime + "')";
                            try
                            {
                                Logging.WriteLog(leave.Site, "Info", "UserDetails", "AssignLeave", insertStatement.Replace("'", "''"), 1001, leave.DCMUser);
                            }
                            catch (Exception ex)
                            {

                            }
                            conn.ReturnCompleteDataSet(insertStatement, leave.Site);

                            string sSQL_UpdateBundyClock = "Exec spLeaveDetailsHalf '" + DatePicked + "','" + leave.UserID + "','" + UpdateBy + "'";
                            try
                            {
                                Logging.WriteLog(leave.Site, "Info", "UserDetails", "AssignLeave", sSQL_UpdateBundyClock.Replace("'", "''"), 1005, leave.DCMUser);
                            }
                            catch (Exception ex)
                            {

                            }

                            conn.ReturnCompleteDataSet(sSQL_UpdateBundyClock, leave.Site);
                        }

                       
                        string insertLeaverequestable = "insert into EmployeeLeaveRequest(UserID,Date,StartTime,EndTime,LeaveDesc,LeaveCode,LeaveStatus,CheckedBy,Comment) values('" + leave.UserID + "',Convert(datetime,'"+DatePicked+"',103),'" + UserStartTime + "','" + UserEndTime + "','" + leave.LeaveDesc + "','" + leave.LeaveCode + "','A','" + leave.UpdateBy + "','Assigned By Supervisor')";
                        try
                        {
                            Logging.WriteLog(leave.Site, "Info", "UserDetails", "AssignLeave", insertLeaverequestable.Replace("'", "''"), 1001, leave.DCMUser);
                        }
                        catch (Exception ex)
                        {

                        }
                        conn.ReturnCompleteDataSet(insertLeaverequestable, leave.Site);
                        approvedrecords++;
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return approvedrecords + " Records Approved from a total of " + totalrecords + " records ";
        }

        private string GetName(string UserID)
        {
            string sSQL = "Select FirstName +' ' + Surname From UserLoginPermission Where UserName = '"+UserID+"'";
            string result = string.Empty;



            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString);
            SqlCommand cmd = new SqlCommand(sSQL, sqlconnection);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
                if (ds.Tables[0].Rows.Count == 1)
                {
                    result = ds.Tables[0].Rows[0][0].ToString();
                }
            }
            catch (Exception ex)
            {
                result = "Error Occured";
            }
            finally
            {
                sqlconnection.Close();
            }


            return result;
        }

        private void AddLeave(string DatePicked, string userID, string lvCode, string LeaveStartTime, string LeaveEndTime, string sitecode, string UpdatedBy, bool FullDayLeave)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();

            try
            {

                // Creating records if there is not any in TimeInfoByUser table for a partcular user and date
                sSQL = "Select count(*) from TimeInfoByUser where UserID='" + userID + "' ";
                sSQL += " and convert(datetime,StartDate,103)=CONVERT(datetime,'" + DatePicked + "',103)";
                int UTIRecords = int.Parse(conn.ReturnSingleValue(sSQL, sitecode));
                if (UTIRecords == 0)
                {
                    string sSQL_CreateRecordsUTI = "Exec spCreateTimeInfoByUserRecords '" + DatePicked + "','" + DatePicked + "','" + userID + "'";
                    conn.ReturnCompleteDataSet(sSQL_CreateRecordsUTI, sitecode);
                }


                // ------------------Getting Updated By----------
                string sSQL_UpdateBy = "Select FirstName + ' '+ Surname From DCMUser Where UserName = '" + UpdatedBy + "'";
                string UpdateBy = conn.ReturnSingleValue(sSQL_UpdateBy, sitecode);


                // ------------------Inserting data into EmpLeaveDetails and bundyClock table----------
                if (FullDayLeave)
                {
                    string insertStatement = "insert EmpLeaveDetails (UserID, LeaveDate,LeaveType) values";
                    insertStatement += "('" + userID + "',CONVERT(DATE,'" + DatePicked + "', 103),'" + lvCode + "')";
                    conn.ReturnCompleteDataSet(insertStatement, sitecode);

                    string sSQL_UpdateBundyClock = "Exec spLeaveDetails '" + DatePicked + "','" + userID + "','" + UpdateBy + "'";


                    conn.ReturnCompleteDataSet(sSQL_UpdateBundyClock, sitecode);
                }
                else
                {
                    string insertStatement = "insert EmpLeaveDetails (UserID, LeaveDate,LeaveType,StartTime,EndTime) values";
                    insertStatement += "('" + userID + "', CONVERT(DATE,'" + DatePicked + "', 103),'" + lvCode + "','" + LeaveStartTime + "','" + LeaveEndTime + "')";
                    conn.ReturnCompleteDataSet(insertStatement, sitecode);

                    string sSQL_UpdateBundyClock = "Exec spLeaveDetailsHalf '" + DatePicked + "','" + userID + "','" + UpdateBy + "'";


                    conn.ReturnCompleteDataSet(sSQL_UpdateBundyClock, sitecode);
                }
            }



            // NOTES Need to cater for cancelling leave, 
            // Need to keep original records
            // Need to check if Different leave type exists already before adding

            // Work to be done below
            // Add EmpLeaveDetails
            // Get UPDATED BY
            // Add BundyClock Record

            catch (Exception ex)
            {
                //moLog.WriteLog("An error occured while creating UTI for leave.Error:" + ex.ToString(), Microsoft.VisualBasic.Logging.LOGLEVEL.LOG_DETAILED, Microsoft.VisualBasic.Logging.LOGTYPE.LOG_ERROR);
            }
        }




        // USER DIARY
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetNoteTypes([FromBody]UserDiary diaryNote)
        {
            List<UserDiary> list = new List<UserDiary>();
            string sSQL = "SELECT NoteType FROM DiaryNote_Types ORDER BY NoteType";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, diaryNote.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new UserDiary
                        {
                            NoteType = dr["NoteType"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(diaryNote.Site, "Error", "UserDetails", "GetNoteTypes", sSQL.Replace("'", "''"), 3001, diaryNote.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Note Types with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetUserDiaryNotes([FromBody]UserDiary notes)
        {
            List<UserDiary> list = new List<UserDiary>();

            string userID_str = "";

            if(notes.UserID == "")
            {
                userID_str = "%%";
            } else
            {
                userID_str = notes.UserID;
            }

            string sSQL = "select d.UserID, ui.FirstName + ' ' + ui.Surname FullName, ui.Surname, d.IncidentDate, d.NoteType,UpdatedBy, d.Comment, d.ID " +
                " from Diary d JOIN UserInfo ui ON d.UserID = ui.UserID " +
                " WHERE d.UserID LIKE '" + userID_str + "' ORDER BY CONVERT(date,incidentdate,103) desc ";
            
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, notes.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new UserDiary
                        {
                            UserID = dr["UserID"].ToString(),
                            FullName = dr["FullName"].ToString(),
                            IncidentDate = dr["IncidentDate"].ToString(),
                            NoteType = dr["NoteType"].ToString(),
                            Note = dr["Comment"].ToString(),
                            UpdatedBy = dr["UpdatedBy"].ToString(),
                            SerialID = dr["ID"].ToString(),
                            
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(notes.Site, "Error", "UserDetails", "GetUserDiaryNotes", sSQL.Replace("'", "''"), 3001, notes.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the User Diary Notes with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        // Add diary note for user
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddUserDiaryNote([FromBody]UserDiary note)
        {
            List<UserDiary> list = new List<UserDiary>();

            string sSQL = "INSERT INTO Diary (UserID, NoteType, Comment, UpdatedBy, IncidentDate) VALUES ('" + note.UserID + "','" + note.NoteType + "','" + note.Note + "','" + note.DCMUser + "',convert(varchar,convert(date,'" + note.IncidentDate + "',103),103) )";

            try
            {
                Connection connection = new Connection();
                try
                {
                    Logging.WriteLog(note.Site, "INFO", "UserDetails", "AddUserDiaryNote", sSQL.Replace("'", "''"), 1001, note.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, note.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(note.Site, "Error", "UserDetails", "AddUserDiaryNote", sSQL.Replace("'", "''"), 1007, note.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Adding new note for user with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("New Note has been Added for user.");
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string DeleteUserDiaryNote([FromBody]UserDiary note)
        {
            string sSQL = "DELETE FROM Diary WHERE ID = " + note.SerialID;
            Connection connection = new Connection();
            try
            {
                try
                {
                    Logging.WriteLog(note.Site, "INFO", "UserDetails", "DeleteUserDiaryNote", sSQL.Replace("'", "''"), 1007, note.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteDeleteQuery(sSQL, note.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(note.Site, "Error", "UserDetails", "DeleteUserDiaryNote", sSQL.Replace("'", "''"), 3007, note.DCMUser);
                }
                catch (Exception e) { }

                return "Error while deleting the User Diary Note with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("Note has been removed for user.");
        }




        // Onboarding Checklist

        

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetOnboardingChecklist([FromBody]OnboardingChecklist checklist)
        {
            List<OnboardingChecklist> list = new List<OnboardingChecklist>();
            string sSQL = "select o.ChecklistNumber, o.UserID, ui.FirstName, ui.Surname, o.Checklist,o.IsTicked " +
                " FROM OnboardingCheckList_Users o join userinfo ui on o.UserID = ui.UserID " +
                " WHERE o.UserID = '" + checklist.UserID + "' ORDER BY o.ChecklistNumber";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, checklist.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new OnboardingChecklist
                        {
                            ChecklistNumber = dr["ChecklistNumber"].ToString(),
                            UserID = dr["UserID"].ToString(),
                            FirstName = dr["FirstName"].ToString(),
                            Surname = dr["Surname"].ToString(),
                            Checklist = dr["Checklist"].ToString(),
                            IsTicked = dr["IsTicked"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(checklist.Site, "Error", "UserDetails", "GetOnboardingChecklist", sSQL.Replace("'", "''"), 3001, checklist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the User Onboarding Checklists with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string UpdateUserOnboardingChecklist([FromBody]OnboardingChecklist checklist)
        {
            List<OnboardingChecklist> list = new List<OnboardingChecklist>();


            string sSQL = "UPDATE OnboardingCheckList_Users SET IsTicked = IIF(IsTicked <> 'Y', 'Y','') " +
                " WHERE UserID = '" + checklist.UserID + "' AND ChecklistNumber = " + checklist.ChecklistNumber;
            Connection connection = new Connection();
            try
            {
                string result = connection.ExecuteUpdateQuery(sSQL, checklist.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(checklist.Site, "Error", "UserDetails", "UpdateUserOnboardingChecklist", sSQL.Replace("'", "''"), 3001, checklist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while updating user onboarding checklist with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        // User Skills

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetUserSkills([FromBody]Skills skills)
        {
            List<Skills> list = new List<Skills>();
            string sSQL = "select s.UserID, ui.FirstName, ui.Surname, s.Skill " +
                " FROM Skills_Users s join userinfo ui on s.UserID = ui.UserID " +
                " WHERE s.UserID = '" + skills.UserID + "' ORDER BY s.Skill";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, skills.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new Skills
                        {
                            UserID = dr["UserID"].ToString(),
                            FirstName = dr["FirstName"].ToString(),
                            Surname = dr["Surname"].ToString(),
                            Skill = dr["Skill"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(skills.Site, "Error", "UserDetails", "GetUserSkills", sSQL.Replace("'", "''"), 3001, skills.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the User Skills with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }

        // get list of skills from system (dropdown)
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetSkills([FromBody]Skills skills)
        {
            List<Skills> list = new List<Skills>();
            string sSQL = "select Skill FROM Skills ORDER BY Skill";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, skills.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new Skills
                        {
                            Skill = dr["Skill"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(skills.Site, "Error", "UserDetails", "GetSkills", sSQL.Replace("'", "''"), 3001, skills.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Skills with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string DeleteUserSkills([FromBody]Skills skills)
        {
            string sSQL = "DELETE FROM Skills_Users WHERE UserID = '" + skills.UserID + "' AND Skill = '" + skills.Skill + "'";
            Connection connection = new Connection();
            try
            {
                try
                {
                    Logging.WriteLog(skills.Site, "INFO", "UserDetails", "DELETEUserSkills", sSQL.Replace("'", "''"), 1007, skills.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteDeleteQuery(sSQL, skills.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(skills.Site, "Error", "UserDetails", "DELETEUserSkills", sSQL.Replace("'", "''"), 3007, skills.DCMUser);
                }
                catch (Exception e) { }

                return "Error while deleting the User Skill with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("Skill has been removed for user.");
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddUserSkill([FromBody]Skills skills)
        {
            List<Skills> list = new List<Skills>();

            string sSQL = "INSERT INTO Skills_Users (UserID,Skill) VALUES ('" + skills.UserID + "','" + skills.Skill + "')";

            try
            {
                string str = "select count(*) from Skills_Users where UserID='" + skills.UserID + "' AND Skill = '" + skills.Skill + "'";
                Connection connection = new Connection();
                if (Int32.Parse(connection.ReturnSingleValue(str, skills.Site)) > 0)
                {
                    return JsonSerializer.Serialize("Skill already exists for this user.");
                }

                try
                {
                    Logging.WriteLog(skills.Site, "INFO", "UserDetails", "AddUserSkill", sSQL.Replace("'", "''"), 1001, skills.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, skills.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(skills.Site, "Error", "UserDetails", "AddUserSkills", sSQL.Replace("'", "''"), 1007, skills.DCMUser);
                }
                catch (Exception e) { }

                return "Error while adding the User Skill with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("New Skill Added for user.");
        }



        //User Certifications
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetUserCertifications([FromBody]CertificationsExpiry cert)
        {
            List<CertificationsExpiry> list = new List<CertificationsExpiry>();
            string sSQL = "select c.UserID, ui.FirstName, ui.Surname, c.Certificate,  REPLACE(CONVERT(varchar, c.Expiry, 103), ' ', ' / ') Expiry , IIF(f.UserID is not NULL, 'Y', '') ImageUploaded " +
                " FROM Certifications_Expiry_Users c join userinfo ui on c.UserID = ui.UserID  LEFT JOIN Certifications_Expiry_User_Files f on c.UserID = f.UserID and c.Certificate = f.Certificate and f.Status = 'Y' " +
                " WHERE c.UserID = '" + cert.UserID + "' AND c.Status = 'Y' ORDER BY c.Expiry";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ExecuteSelectQuery(sSQL, cert.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    CertificationsExpiry item = null;

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        item = new CertificationsExpiry();
                        item.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                        item.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                        item.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                        item.Certificate = ds.Tables[0].Rows[i]["Certificate"].ToString();
                        item.Expiry = ds.Tables[0].Rows[i]["Expiry"].ToString();
                        item.ImageUploaded = ds.Tables[0].Rows[i]["ImageUploaded"].ToString();
                        list.Add(item);
                    }
                }

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(cert.Site, "Error", "UserDetails", "GetUserCertifications", sSQL.Replace("'", "''"), 3001, cert.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the User Certifications with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetCertificationTypes([FromBody]CertificationsExpiry cert)
        {
            List<CertificationsExpiry> list = new List<CertificationsExpiry>();
            string sSQL = "select Certificate FROM Certifications ORDER BY Certificate";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, cert.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CertificationsExpiry
                        {
                            Certificate = dr["Certificate"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(cert.Site, "Error", "UserDetails", "GetCertificationTypes", sSQL.Replace("'", "''"), 3001, cert.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Certification Types with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetCertificationTypesForUser([FromBody]CertificationsExpiry cert)
        {
            List<CertificationsExpiry> list = new List<CertificationsExpiry>();
            string sSQL = "select Certificate from Certifications_Expiry_Users WHERE Status = 'Y' AND UserID = '" + cert.UserID + "' ORDER BY Certificate";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, cert.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CertificationsExpiry
                        {
                            Certificate = dr["Certificate"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(cert.Site, "Error", "UserDetails", "GetCertificationTypesForUser", sSQL.Replace("'", "''"), 3001, cert.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Certification Types for User with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddCertExpiry([FromBody]CertificationsExpiry cert)
        {
            List<Skills> list = new List<Skills>();

            string sSQL = "INSERT INTO Certifications_Expiry_Users (UserID,Certificate,Expiry,Status) VALUES ('" + cert.UserID + "','" + cert.Certificate + "',CONVERT(date,'" + cert.Expiry + "',103), 'Y')";
            string updateQuery = "UPDATE Certifications_Expiry_Users SET Status = 'N' WHERE UserID = '" + cert.UserID + "' AND Certificate = '" + cert.Certificate + "' AND Status = 'Y'";
            string updateSQL2 = "UPDATE Certifications_Expiry_User_Files SET Status = 'N' WHERE UserID = '" + cert.UserID + "' AND Certificate = '" + cert.Certificate + "' AND Status = 'Y' ";
            try
            {
                Connection connection = new Connection();
                try
                {
                    Logging.WriteLog(cert.Site, "INFO", "UserDetails", "AddCertExpiry", sSQL.Replace("'", "''"), 1001, cert.DCMUser);
                }
                catch (Exception e) { }

                string s = connection.ExecuteUpdateQuery(updateQuery, cert.Site);
                string result = connection.ExecuteInsertQuery(sSQL, cert.Site);
                string result2 = connection.ExecuteInsertQuery(updateSQL2, cert.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(cert.Site, "Error", "UserDetails", "AddCertExpiry", sSQL.Replace("'", "''"), 1007, cert.DCMUser);
                }
                catch (Exception e) { }

                return "Error while adding certificate expiry with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("Certification expiry date has been saved for user.");
        }

        // Upload Files
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string UploadFile([FromBody]CertificationsExpiry fle)
        {
            List<CertificationsExpiry> list = new List<CertificationsExpiry>();
            string updateSQL = "UPDATE Certifications_Expiry_User_Files SET Status = 'N' WHERE UserID ='" + fle.UserID + "' AND Certificate = '" + fle.Certificate + "' AND Status = 'Y'";
            try
            {
                Connection connection = new Connection();
                string result = connection.ExecuteUpdateQuery(updateSQL, fle.Site);
            }
            catch (Exception ee)
            {

            }
            string sSQL = "INSERT INTO Certifications_Expiry_User_Files (UserID,Certificate,[File],Status) values ('" + fle.UserID + "','" + fle.Certificate + "',CAST('" + fle.File + "' as varbinary(max)),'Y')";

            try
            {
                Connection connection = new Connection();

                try
                {
                    Logging.WriteLog(fle.Site, "INFO", "UserDetails", "UploadFile", "Too LONG Script for File", 1001, fle.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, fle.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(fle.Site, "Error", "UserDetails", "UploadFile", sSQL.Replace("'", "''"), 1007, fle.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Uploading certificate for user with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("New Certificate has been uploaded for user.");
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string RetrieveFile([FromBody]CertificationsExpiry certFile)
        {
            List<CertificationsExpiry> list = new List<CertificationsExpiry>();
            string sSQL = "select cast([File] as varchar(max)) fle FROM Certifications_Expiry_User_Files WHERE UserID = '" + certFile.UserID + "' AND Status = 'Y' AND Certificate = '" + certFile.Certificate + "'";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, certFile.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new CertificationsExpiry
                        {
                            File = dr["fle"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(certFile.Site, "Error", "UserDetails", "GetCertificationTypes", sSQL.Replace("'", "''"), 3001, certFile.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Certification Types with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string InsertExcelImportUser([FromBody] UserInfo user)
        {
            string sSQL = String.Empty;
            sSQL = "select count(*) from Userinfo where UserID = '" + user.UserID + "'";


            Connection connection = new Connection();
            string result = string.Empty;

            try
            {
                int count = int.Parse(connection.ReturnSingleValue(sSQL, user.Site).ToString());

                if (count == 0)
                {
                    int ShiftCodecount = int.Parse(connection.ReturnSingleValue("select count(*) from ShiftCode where ShiftCode = '" + user.ShiftCode + "'", user.Site).ToString()) ;

                    if (ShiftCodecount > 0)
                    {
                        int teamManagercount = int.Parse(connection.ReturnSingleValue("select count(*) from TeamManager where ManagerName = '"+user.TeamManager+"'", user.Site).ToString());

                        if (teamManagercount > 0)
                        {
                            if (user.EmployeeCategory == "Permanent")
                            {
                                user.Level = "";
                                user.Agency = "";
                            }

                            // Dept code existence check 
                            int deptcodecount = int.Parse(connection.ReturnSingleValue("select count(*) from ActivityInfo where CC_Code = '" + user.DeptCode + "' ", user.Site).ToString());

                            if (deptcodecount <= 0)
                            {
                                user.DeptCode = "Site";
                            }

                            // Role existence check
                            int rolecheck = int.Parse(connection.ReturnSingleValue("select count(*) from UserRole where UserRole = '" + user.Role + "' ", user.Site).ToString());

                            if (rolecheck <= 0)
                            {
                                user.Role = "Default";
                            }


                            if (user.DateLeaving.Equals(""))
                            {
                                sSQL = "Insert Into UserInfo(UserID, Surname, FirstName, Sex, DateJoining, DateLeaving, EmployeeID, EmployeeCategory, Agency, Level, ShiftCode, Status, TeamManager, FirstAid, Role, PartTime, DeptCode)" +
                                " Values('" + user.UserID + "', UPPER('" + user.Surname.Replace("'", "''") + "'), UPPER('" + user.FirstName.Replace("'", "''") + "'), '" + user.Sex + "', Convert(Date,'" + user.DateJoining + "',103), null, '" + user.EmployeeID + "', '" + user.EmployeeCategory + "', '" + user.Agency + "', '" + user.Level + "', '" + user.ShiftCode + "', '" + user.Status + "', '" + user.TeamManager + "', '" + user.FirstAid + "', '" + user.Role + "', '" + user.PartTime + "', '" + user.DeptCode + "')";
                            }
                            else
                            {

                                sSQL = "Insert Into UserInfo(UserID, Surname, FirstName, Sex, DateJoining, DateLeaving, EmployeeID, EmployeeCategory, Agency, Level, ShiftCode, Status, TeamManager, FirstAid, Role, PartTime, DeptCode)" +
                                    " Values('" + user.UserID + "', UPPER('" + user.Surname.Replace("'", "''") + "'), UPPER('" + user.FirstName.Replace("'", "''") + "'), '" + user.Sex + "', Convert(Date,'" + user.DateJoining + "',103), Convert(Date,'" + user.DateLeaving + "',103), '" + user.EmployeeID + "', '" + user.EmployeeCategory + "', '" + user.Agency + "', '" + user.Level + "', '" + user.ShiftCode + "', '" + user.Status + "', '" + user.TeamManager + "', '" + user.FirstAid + "', '" + user.Role + "', '" + user.PartTime + "', '" + user.DeptCode + "')";
                            }

                            try
                            {
                                Logging.WriteLog(user.Site, "Info", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 1001, user.DCMUser);
                            }
                            catch (Exception ex)
                            {

                            }
                            string strresult = connection.ExecuteInsertQuery(sSQL, user.Site);
                            if (strresult != "Insert SuccessFull")
                            {
                                return "New User Insert Failed";
                            }

                            // Adding the Tablet ID to the BundyID Table

                            sSQL = "select count(*) from BundyID where UserName = '" + user.UserID + "'";

                            if (int.Parse(connection.ReturnSingleValue(sSQL, user.Site)) == 0)
                            {
                                sSQL = "insert into BundyID(UserName,BundyID) values ('" + user.UserID + "','" + user.TabletID + "')";
                                connection.ExecuteInsertQuery(sSQL, user.Site);
                            }
                            else
                            {
                                sSQL = "Update BundyID set BundyID = '" + user.TabletID + "' where  UserName = '" + user.UserID + "'";
                                connection.ExecuteUpdateQuery(sSQL, user.Site);
                            }

                            sSQL = "insert into OnboardingCheckList_Users (UserID,ChecklistNumber, Checklist,IsTicked) select '" + user.UserID + "', ChecklistNumber, Checklist, '' from OnboardingCheckList WHERE IsActive = 'Y'";
                            connection.ExecuteInsertQuery(sSQL, user.Site);

                            result = "New User Inserted";

                            if (result.Equals("New User Inserted"))
                            {
                                UpdateExcelUserRoster(user);
                            }
                        }

                    }
                   
                }
                else
                {
                    try
                    {
                        Logging.WriteLog(user.Site, "Warning", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 2001, user.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                    result = "Duplicate entries present for the UserID. Please select another User ID.";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 3001, user.DCMUser);
                }
                catch (Exception e) { }

                return "Error Occured while adding new user: " + ex.Message;
            }

            return result;
        }

        public void UpdateExcelUserRoster([FromBody]UserInfo user)
        {
          
            string sSQL = "EXEC spCreateTimeInfoByUserRecords @sStartDate='" + user.DateJoining + "', @sEndDate='" + user.DateJoining + "', @sUserID='" + user.UserID + "'";
            Connection connection = new Connection();
            try
            {
                try
                {
                    Logging.WriteLog(user.Site, "Info", "UserDetails", "UpdateUserRoster", sSQL.Replace("'", "''"), 1005, user.DCMUser);
                }
                catch (Exception ex)
                {

                }
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, user.Site);

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(user.Site, "Error", "UserDetails", "UpdateUserRoster", sSQL.Replace("'", "''"), 3005, user.DCMUser);
                }
                catch (Exception e) { }
   
            }
        }

    }
}