using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DC4._0Backend.Models;
using System.Data;
using System.Text.Json;
using System.Globalization;
//using Newtonsoft.Json;


namespace DC4._0Backend.Controllers
{
    public class ErrorsController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllErrors([FromBody]Errors time)
        {


            string sSQL = String.Empty;

            sSQL = "SELECT ui.ShiftCode, ISNULL(License, '') 'License', ISNULL(SKU, '') 'SKU', ISNULL(PickVar, 0) 'PickVar', ISNULL(Errors, '') 'Errors', ISNULL(Action, '') 'Action',  ISNULL((QAui.FirstName + ' ' + QAui.Surname + ' (' + QAChecked + ')'), '') 'QAChecked', ISNULL(PickVarCase, 0) 'PickVarCases', PickLocation, PickerID, Week, Convert(char(10), Convert(DateTime, Date, 103), 103) Date, SerialID, ui.FirstName 'FirstName', ui.Surname 'Surname'  FROM QA_Audits QA FULL OUTER JOIN UserInfo ui ON ui.UserID = QA.PickerID FULL OUTER JOIN UserInfo QAui ON QAui.UserID = QAChecked WHERE Convert(DateTime, Date, 103)  Between Convert(DateTime, Convert(Char(19),'" + time.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + time.EndDate + "',103),103) Order By PickerID,Date ASC";

            Connection connection = new Connection();

            List<Errors> entryList = new List<Errors>();
            try
            {


                try
                {
                    Logging.WriteLog(time.Site, "Info", "Errors", "GetAllErrors", sSQL.Replace("'", "''"), 1002, time.DCMUser);
                }
                catch (Exception ex)
                {

                }



                DataSet ds = connection.ExecuteSelectQuery(sSQL, time.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {


                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        Errors obj = new Errors();
                        obj.SerialID = ds.Tables[0].Rows[i]["SerialID"].ToString();
                        obj.PickerID = ds.Tables[0].Rows[i]["PickerID"].ToString();
                        obj.StartDate = ds.Tables[0].Rows[i]["Date"].ToString();
                        obj.SKU = ds.Tables[0].Rows[i]["SKU"].ToString();
                        obj.EndDate = ds.Tables[0].Rows[i]["Date"].ToString();
                        obj.License = ds.Tables[0].Rows[i]["License"].ToString();
                        obj.PickLocation = ds.Tables[0].Rows[i]["PickLocation"].ToString();
                        obj.PickVar = Convert.ToInt16(ds.Tables[0].Rows[i]["PickVar"].ToString());
                        obj.Error = ds.Tables[0].Rows[i]["Errors"].ToString();
                        obj.Action = ds.Tables[0].Rows[i]["Action"].ToString();



                        obj.QAChecked = ds.Tables[0].Rows[i]["QAChecked"].ToString();
                        obj.Week = Convert.ToInt16(ds.Tables[0].Rows[i]["Week"].ToString());
                        obj.PickVarCases = Convert.ToInt32(ds.Tables[0].Rows[i]["PickVarCases"].ToString());
                        obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                        obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                        obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                        entryList.Add(obj);
                    }
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "Errors", "GetAllErrors", sSQL.Replace("'", "''"), 3002, time.DCMUser);
                }
                catch (Exception e)
                {

                }


                return ex.ToString();
            }

            //String alternate = JsonConvert.SerializeObject(entryList);
            String retVal = JsonSerializer.Serialize(entryList);
            return retVal;

        }





        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertExcelImportError([FromBody]Errors error)
        {
            string[] names = error.PickerID.Split(' ');

            if (names.Length != 2)
            {
                return "Invalid picker ID format";
            }

            string sSQL = "SELECT * FROM UserInfo where FirstName = '" + names[0] + "' and Surname like '" + names[1] + "%'";

            Connection connection = new Connection();

            DataSet ds = connection.ExecuteSelectQuery(sSQL, error.Site);

            if (ds.Tables[0].Rows.Count == 1)
            {
                error.PickerID = ds.Tables[0].Rows[0]["UserID"].ToString();
                error.FirstName = ds.Tables[0].Rows[0]["FirstName"].ToString();
                error.SurName = ds.Tables[0].Rows[0]["Surname"].ToString();

                //Need checked by and names
                if (error.PickerID.Equals("") || error.FirstName.Equals("") || error.SurName.Equals(""))
                {
                    return "Couldn't find pickerID, first name or last name";
                }

                if (error.QAChecked.Equals(""))
                {
                    return "QA checked is required";
                }


                if (error.StartDate.Equals(""))
                {
                    return "Date required";
                }
                else
                {
                    DateTime test =  new DateTime();
                     bool value =   DateTime.TryParse(error.StartDate, out test);

                    if (value)
                    {
                        sSQL = "INSERT INTO QA_Audits(License, SKU, PickLocation, PickVar, Errors, PickerID, Action, QAChecked, Week, Date, PickVarCase) " +
                      "VALUES('" + error.License + "', '" + error.SKU + "', '" +
                      error.PickLocation + "'," + error.PickVar + ", '" + error.Error + "', '" +
                      error.PickerID + "', '" + error.Action + "', '" + error.QAChecked + "', DATEPART(Week,Convert(DateTime, '" + error.StartDate + "', 103)), Convert(DateTime, '" + error.StartDate + "', 103), " + error.PickVarCases + ")";
                    }

                    else

                    {

                        sSQL = "INSERT INTO QA_Audits(License, SKU, PickLocation, PickVar, Errors, PickerID, Action, QAChecked, Week, Date, PickVarCase) " +
                      "VALUES('" + error.License + "', '" + error.SKU + "', '" +
                      error.PickLocation + "'," + error.PickVar + ", '" + error.Error + "', '" +
                      error.PickerID + "', '" + error.Action + "', '" + error.QAChecked + "', DatePart(Week, dateadd(day, "+error.StartDate+ ", '1899-12-30')), dateadd(day, "+error.StartDate+", '1899-12-30'), " + error.PickVarCases + ")";
                    }
                }


               

                string strresult = connection.ExecuteInsertQuery(sSQL, error.Site);
                try { 
                Logging.WriteLog(error.Site, "Info", "Errors", "InsertExcelImportError", sSQL.Replace("'", "''"), 1001, error.DCMUser);
                  }
                catch (Exception ex)
            {

            }


            if (strresult != "Insert SuccessFull")
                {
                    return "Error Insert Failed";
                }
                else
                {
                    return "Success";
                }

            }
            else
            {
                return "No distinct user found";
            }
            //try
            //{
            //    int count = int.Parse(connection.ReturnSingleValue(sSQL, user.Site).ToString());

            //    if (count == 0)
            //    {
            //        int ShiftCodecount = int.Parse(connection.ReturnSingleValue("select count(*) from ShiftCode where ShiftCode = '" + user.ShiftCode + "'", user.Site).ToString());

            //        if (ShiftCodecount > 0)
            //        {
            //            int teamManagercount = int.Parse(connection.ReturnSingleValue("select count(*) from TeamManager where ManagerName = '" + user.TeamManager + "'", user.Site).ToString());

            //            if (teamManagercount > 0)
            //            {
            //                if (user.EmployeeCategory == "Permanent")
            //                {
            //                    user.Level = "";
            //                    user.Agency = "";
            //                }

            //                // Dept code existence check 
            //                int deptcodecount = int.Parse(connection.ReturnSingleValue("select count(*) from ActivityInfo where CC_Code = '" + user.DeptCode + "' ", user.Site).ToString());

            //                if (deptcodecount <= 0)
            //                {
            //                    user.DeptCode = "Site";
            //                }

            //                // Role existence check
            //                int rolecheck = int.Parse(connection.ReturnSingleValue("select count(*) from UserRole where UserRole = '" + user.Role + "' ", user.Site).ToString());

            //                if (rolecheck <= 0)
            //                {
            //                    user.Role = "Default";
            //                }


            //                if (user.DateLeaving.Equals(""))
            //                {
            //                    sSQL = "Insert Into UserInfo(UserID, Surname, FirstName, Sex, DateJoining, DateLeaving, EmployeeID, EmployeeCategory, Agency, Level, ShiftCode, Status, TeamManager, FirstAid, Role, PartTime, DeptCode)" +
            //                    " Values('" + user.UserID + "', UPPER('" + user.Surname.Replace("'", "''") + "'), UPPER('" + user.FirstName.Replace("'", "''") + "'), '" + user.Sex + "', Convert(Date,'" + user.DateJoining + "',103), null, '" + user.EmployeeID + "', '" + user.EmployeeCategory + "', '" + user.Agency + "', '" + user.Level + "', '" + user.ShiftCode + "', '" + user.Status + "', '" + user.TeamManager + "', '" + user.FirstAid + "', '" + user.Role + "', '" + user.PartTime + "', '" + user.DeptCode + "')";
            //                }
            //                else
            //                {

            //                    sSQL = "Insert Into UserInfo(UserID, Surname, FirstName, Sex, DateJoining, DateLeaving, EmployeeID, EmployeeCategory, Agency, Level, ShiftCode, Status, TeamManager, FirstAid, Role, PartTime, DeptCode)" +
            //                        " Values('" + user.UserID + "', UPPER('" + user.Surname.Replace("'", "''") + "'), UPPER('" + user.FirstName.Replace("'", "''") + "'), '" + user.Sex + "', Convert(Date,'" + user.DateJoining + "',103), Convert(Date,'" + user.DateLeaving + "',103), '" + user.EmployeeID + "', '" + user.EmployeeCategory + "', '" + user.Agency + "', '" + user.Level + "', '" + user.ShiftCode + "', '" + user.Status + "', '" + user.TeamManager + "', '" + user.FirstAid + "', '" + user.Role + "', '" + user.PartTime + "', '" + user.DeptCode + "')";
            //                }

            //                try
            //                {
            //                    Logging.WriteLog(user.Site, "Info", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 1001, user.DCMUser);
            //                }
            //                catch (Exception ex)
            //                {

            //                }
            //                string strresult = connection.ExecuteInsertQuery(sSQL, user.Site);
            //                if (strresult != "Insert SuccessFull")
            //                {
            //                    return "New User Insert Failed";
            //                }

            //                // Adding the Tablet ID to the BundyID Table

            //                sSQL = "select count(*) from BundyID where UserName = '" + user.UserID + "'";

            //                if (int.Parse(connection.ReturnSingleValue(sSQL, user.Site)) == 0)
            //                {
            //                    sSQL = "insert into BundyID(UserName,BundyID) values ('" + user.UserID + "','" + user.TabletID + "')";
            //                    connection.ExecuteInsertQuery(sSQL, user.Site);
            //                }
            //                else
            //                {
            //                    sSQL = "Update BundyID set BundyID = '" + user.TabletID + "' where  UserName = '" + user.UserID + "'";
            //                    connection.ExecuteUpdateQuery(sSQL, user.Site);
            //                }

            //                sSQL = "insert into OnboardingCheckList_Users (UserID,ChecklistNumber, Checklist,IsTicked) select '" + user.UserID + "', ChecklistNumber, Checklist, '' from OnboardingCheckList WHERE IsActive = 'Y'";
            //                connection.ExecuteInsertQuery(sSQL, user.Site);

            //                result = "New User Inserted";

            //                if (result.Equals("New User Inserted"))
            //                {
            //                    UpdateExcelUserRoster(user);
            //                }
            //            }

            //        }

            //    }
            //    else
            //    {
            //        try
            //        {
            //            Logging.WriteLog(user.Site, "Warning", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 2001, user.DCMUser);
            //        }
            //        catch (Exception ex)
            //        {

            //        }
            //        result = "Duplicate entries present for the UserID. Please select another User ID.";
            //    }
            //}
            //catch (Exception ex)
            //{
            //    try
            //    {
            //        Logging.WriteLog(user.Site, "Error", "UserDetails", "InsertUser", sSQL.Replace("'", "''"), 3001, user.DCMUser);
            //    }
            //    catch (Exception e) { }

            //    return "Error Occured while adding new user: " + ex.Message;
            //}

            //return result;
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddError([FromBody] Errors errorRecord)
        {
            string sSQL = String.Empty;

            Connection connection = new Connection();
            string result = string.Empty;

            try
            {
                sSQL = "INSERT INTO QA_Audits(License, SKU, PickLocation, PickVar, Errors, PickerID, Action, QAChecked, Week, Date, PickVarCase) " +
                       "VALUES('" + errorRecord.License + "', '" + errorRecord.SKU + "', '" +
                       errorRecord.PickLocation + "'," + errorRecord.PickVar + ", '" + errorRecord.Error + "', '" +
                       errorRecord.PickerID + "', '" + errorRecord.Action + "', '" + errorRecord.QAChecked + "', DATEPART(Week,Convert(DateTime, '" + errorRecord.StartDate + "', 103)), Convert(DateTime, '" + errorRecord.StartDate + "', 103), " + errorRecord.PickVarCases + ")";

                try
                {
                    Logging.WriteLog(errorRecord.Site, "Info", "Errors", "AddError", sSQL.Replace("'", "''"), 1001, errorRecord.DCMUser);
                }
                catch (Exception ex)
                {

                }

                String strresult = connection.ExecuteInsertQuery(sSQL, errorRecord.Site);

                if (strresult != "Insert SuccessFull")
                {
                    return "Error Occured while Inserting the entry";
                }

                result = "New Error has been added";

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(errorRecord.Site, "Warning", "Errors", "AddError", sSQL.Replace("'", "''"), 3001, errorRecord.DCMUser);
                }
                catch (Exception e)
                {

                }

                return "Error Occured while adding new user: " + ex.Message;
            }

            return result;
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string UpdateError([FromBody] Errors errorRecord)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;

            try
            {
                sSQL = "update QA_Audits Set License = '" + errorRecord.License + "', ShiftCode = '" + errorRecord.ShiftCode + "', SKU = '" + errorRecord.License + "', PickVar = " + errorRecord.PickVar + ", Errors = '" + errorRecord.Error + "', Action = '" + errorRecord.Action + "', QAChecked = '" + errorRecord.QAChecked + "', PickVarCase = " + errorRecord.PickVarCases + ", PickLocation = '" + errorRecord.PickLocation + "', Week = DATEPART(Week,Convert(DateTime, '" + errorRecord.StartDate + "', 103)),  Date = Convert(DateTime, '" + errorRecord.StartDate + "', 103) Where PickerID = '" + errorRecord.PickerID + "' And SerialID = '" + errorRecord.SerialID + "'";


                try
                {
                    Logging.WriteLog(errorRecord.Site, "Info", "Errors", "UpdateError", sSQL.Replace("'", "''"), 1003, errorRecord.DCMUser);
                }
                catch (Exception ex)
                {

                }

                string strresult = conn.ExecuteUpdateQuery(sSQL, errorRecord.Site);

                if (strresult != "Update SuccessFull")
                {
                    return "Error Occurred while updating";
                }

                result = "Error Record is Updated";
            }
            catch (Exception ex)
            {

                try
                {
                    Logging.WriteLog(errorRecord.Site, "Warning", "Errors", "UpdateError", sSQL.Replace("'", "''"), 3003, errorRecord.DCMUser);
                }
                catch (Exception e)
                {

                }
                return "Error Occurred while updating:" + ex.Message;
            }

            return result;
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string DeleteError([FromBody] Errors error)
        {

            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;
            try
            {

                sSQL = "Delete From QA_Audits Where SerialID = " + error.SerialID;

                string strresult = conn.ExecuteDeleteQuery(sSQL, error.Site);

                try
                {
                    Logging.WriteLog(error.Site, "Info", "Errors", "DeleteError", sSQL.Replace("'", "''"), 1007, error.DCMUser);
                }
                catch (Exception ex) { }

                if (strresult != "Delete SuccessFull")
                {
                    return "Error Occured while Deleting the Error Entry";
                }

                result = "Selected Entry Deleted from the Database";
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(error.Site, "Info", "Errors", "DeleteError", sSQL.Replace("'", "''"), 3007, error.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured while Deleting the Error Entry:" + ex.Message;
            }

            return result;
        }

    }
}
