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
    public class UserManagementConfigController : ApiController
    {

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
                    Logging.WriteLog(diaryNote.Site, "Error","UserManagement", "GetNoteTypes", sSQL.Replace("'", "''"), 3001, diaryNote.DCMUser);
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
                    Logging.WriteLog(notes.Site, "Error","UserManagement", "GetUserDiaryNotes", sSQL.Replace("'", "''"), 3001, notes.DCMUser);
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
                    Logging.WriteLog(note.Site, "INFO","UserManagement", "AddUserDiaryNote", sSQL.Replace("'", "''"), 1001, note.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, note.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(note.Site, "Error","UserManagement", "AddUserDiaryNote", sSQL.Replace("'", "''"), 1007, note.DCMUser);
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
                    Logging.WriteLog(note.Site, "INFO","UserManagement", "DeleteUserDiaryNote", sSQL.Replace("'", "''"), 1007, note.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteDeleteQuery(sSQL, note.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(note.Site, "Error","UserManagement", "DeleteUserDiaryNote", sSQL.Replace("'", "''"), 3007, note.DCMUser);
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
                    Logging.WriteLog(checklist.Site, "Error","UserManagement", "GetOnboardingChecklist", sSQL.Replace("'", "''"), 3001, checklist.DCMUser);
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
                    Logging.WriteLog(checklist.Site, "Error","UserManagement", "UpdateUserOnboardingChecklist", sSQL.Replace("'", "''"), 3001, checklist.DCMUser);
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
                    Logging.WriteLog(skills.Site, "Error","UserManagement", "GetUserSkills", sSQL.Replace("'", "''"), 3001, skills.DCMUser);
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
                    Logging.WriteLog(skills.Site, "Error","UserManagement", "GetSkills", sSQL.Replace("'", "''"), 3001, skills.DCMUser);
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
                    Logging.WriteLog(skills.Site, "INFO","UserManagement", "DELETEUserSkills", sSQL.Replace("'", "''"), 1007, skills.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteDeleteQuery(sSQL, skills.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(skills.Site, "Error","UserManagement", "DELETEUserSkills", sSQL.Replace("'", "''"), 3007, skills.DCMUser);
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
                    Logging.WriteLog(skills.Site, "INFO","UserManagement", "AddUserSkill", sSQL.Replace("'", "''"), 1001, skills.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, skills.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(skills.Site, "Error","UserManagement", "AddUserSkills", sSQL.Replace("'", "''"), 1007, skills.DCMUser);
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
                    Logging.WriteLog(cert.Site, "Error","UserManagement", "GetUserCertifications", sSQL.Replace("'", "''"), 3001, cert.DCMUser);
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
                    Logging.WriteLog(cert.Site, "Error","UserManagement", "GetCertificationTypes", sSQL.Replace("'", "''"), 3001, cert.DCMUser);
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
                    Logging.WriteLog(cert.Site, "Error","UserManagement", "GetCertificationTypesForUser", sSQL.Replace("'", "''"), 3001, cert.DCMUser);
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
                    Logging.WriteLog(cert.Site, "INFO","UserManagement", "AddCertExpiry", sSQL.Replace("'", "''"), 1001, cert.DCMUser);
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
                    Logging.WriteLog(cert.Site, "Error","UserManagement", "AddCertExpiry", sSQL.Replace("'", "''"), 1007, cert.DCMUser);
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
                    Logging.WriteLog(fle.Site, "INFO","UserManagement", "UploadFile", "Too LONG Script for File", 1001, fle.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, fle.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(fle.Site, "Error","UserManagement", "UploadFile", sSQL.Replace("'", "''"), 3001, fle.DCMUser);
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
                    Logging.WriteLog(certFile.Site, "Error","UserManagement", "GetCertificationTypes", sSQL.Replace("'", "''"), 3001, certFile.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Certification Types with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }







        // ---------------------------------USER MANAGEMENT CONFIG----------------------------------

        // Checklists Management

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string ConfigureOnboardingChecklist_Get([FromBody]OnboardingChecklist chekclist)
        {
            List<OnboardingChecklist> list = new List<OnboardingChecklist>();
            string sSQL = "select Checklist, IsActive from OnboardingCheckList order by CASE WHEN IsActive = 'Y' THEN ChecklistNumber ELSE 999  END ASC";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, chekclist.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new OnboardingChecklist
                        {
                            Checklist = dr["Checklist"].ToString(),
                            IsActive = dr["IsActive"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(chekclist.Site, "Error", "UserManagement", "ConfigureOnboardingChecklist_Get", sSQL.Replace("'", "''"), 3001, chekclist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Checklists with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string ConfigureOnboardingChecklist_Add([FromBody]OnboardingChecklist checklist)
        {
            List<Skills> list = new List<Skills>();

            string sSQL = "declare @c as int select @c = max(CheckListNumber) FROM OnboardingCheckList WHERE IsActive = 'Y'" +
                " INSERT INTO OnboardingCheckList (ChecklistNumber, Checklist,IsActive) VALUES (@c+1,'" + checklist.Checklist + "','Y')";

            try
            {
                string str = "select count(*) from OnboardingCheckList where Checklist='" + checklist.Checklist + "' AND IsActive = 'Y'";
                Connection connection = new Connection();
                if (Int32.Parse(connection.ReturnSingleValue(str, checklist.Site)) > 0)
                {
                    return JsonSerializer.Serialize("Checklist is already added!");
                }

                try
                {
                    Logging.WriteLog(checklist.Site, "INFO", "UserManagement", "ConfigureOnboardingChecklist_Add", sSQL.Replace("'", "''"), 1001, checklist.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, checklist.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(checklist.Site, "Error", "UserManagement", "ConfigureOnboardingChecklist_Add", sSQL.Replace("'", "''"), 1007, checklist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while adding the Checklist with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("New Checklist has been Added.");
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string ConfigureOnboardingChecklist_MoveUp([FromBody]OnboardingChecklist checklist)
        {

            string sSQL = "declare @num as int " +
                " SELECT @num = ChecklistNumber FROM OnboardingCheckList WHERE CheckList = '" + checklist.Checklist + "' AND IsActive = 'Y' " +
                " IF(@num > 1) " +
                " BEGIN " +
                " UPDATE OnboardingCheckList SET ChecklistNumber = ChecklistNumber + 1 WHERE ChecklistNumber = @num - 1 " +
                " UPDATE OnboardingCheckList SET ChecklistNumber = ChecklistNumber - 1 WHERE CheckList = '" + checklist.Checklist + "' AND IsActive = 'Y' " +
                " END ";

            try
            {
                Connection connection = new Connection();

                try
                {
                    Logging.WriteLog(checklist.Site, "INFO", "UserManagement", "ConfigureOnboardingChecklist_MoveUp", sSQL.Replace("'", "''"), 1001, checklist.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, checklist.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(checklist.Site, "Error", "UserManagement", "ConfigureOnboardingChecklist_MoveUp", sSQL.Replace("'", "''"), 1007, checklist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while moving checklist up:" + ex.Message;
            }

            return JsonSerializer.Serialize("Checklist has been Moved Up.");
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string ConfigureOnboardingChecklist_MoveDown([FromBody]OnboardingChecklist checklist)
        {

            string sSQL = "declare @num as int " +
                " SELECT @num = ChecklistNumber FROM OnboardingCheckList WHERE CheckList = '" + checklist.Checklist + "'  AND IsActive = 'Y' " +
                " declare @numMax as int " +
                " SELECT @numMax = MAX(ChecklistNumber) FROM OnboardingCheckList WHERE IsActive = 'Y' " +
                " IF(@num < @numMax) " +
                " BEGIN " +
                " UPDATE OnboardingCheckList SET ChecklistNumber = ChecklistNumber - 1 WHERE ChecklistNumber = @num+1 " +
                " UPDATE OnboardingCheckList SET ChecklistNumber = ChecklistNumber + 1 WHERE CheckList = '" + checklist.Checklist + "' AND IsActive = 'Y' " +
                " END ";

            try
            {
                Connection connection = new Connection();

                try
                {
                    Logging.WriteLog(checklist.Site, "INFO", "UserManagement", "ConfigureOnboardingChecklist_MoveDown", sSQL.Replace("'", "''"), 1001, checklist.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, checklist.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(checklist.Site, "Error", "UserManagement", "ConfigureOnboardingChecklist_MoveDown", sSQL.Replace("'", "''"), 1007, checklist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while moving checklist down:" + ex.Message;
            }

            return JsonSerializer.Serialize("Checklist has been Moved Down.");
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string ChangeChecklistActivationStatus([FromBody]OnboardingChecklist checklist)
        {

            string sSQL = " UPDATE OnboardingCheckList SET IsActive = IIF(IsActive='Y','N','Y') WHERE CheckList = '" + checklist.Checklist + "'  " +

                " ;with a as ( select MAX(ChecklistNumber) n FROM OnboardingCheckList WHERE IsActive = 'Y' AND CheckList <> '" + checklist.Checklist + "') " +
                " UPDATE OnboardingCheckList SET ChecklistNumber= a.n + 1 from a WHERE CheckList = '" + checklist.Checklist + "' AND IsActive = 'Y' " +

                ";with b as(SELECT Max(ChecklistNumber) ChecklistNumber FROM OnboardingCheckList WHERE CheckList = '" + checklist.Checklist + "' AND IsActive = 'N') " +
                " UPDATE OnboardingCheckList SET ChecklistNumber = OnboardingCheckList.ChecklistNumber - 1 FROM b WHERE OnboardingCheckList.ChecklistNumber > b.ChecklistNumber";

            try
            {
                Connection connection = new Connection();

                try
                {
                    Logging.WriteLog(checklist.Site, "INFO", "UserManagement", "ChangeChecklistActivationStatus", sSQL.Replace("'", "''"), 1001, checklist.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, checklist.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(checklist.Site, "Error", "UserManagement", "ChangeChecklistActivationStatus", sSQL.Replace("'", "''"), 1007, checklist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while changing checklist activation status:" + ex.Message;
            }

            return JsonSerializer.Serialize("Checklist Activation status has been changed.");
        }





        // Skills management 

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string ConfigureSkills_Add([FromBody]Skills skills)
        {
            List<Skills> list = new List<Skills>();

            string sSQL = "INSERT INTO Skills (Skill) VALUES ('" + skills.Skill + "')";

            try
            {
                string str = "select count(*) from Skills where Skill='" + skills.Skill + "'";
                Connection connection = new Connection();
                if (Int32.Parse(connection.ReturnSingleValue(str, skills.Site)) > 0)
                {
                    return JsonSerializer.Serialize("Skill is already added!");
                }

                try
                {
                    Logging.WriteLog(skills.Site, "INFO", "UserManagement", "ConfigureSkills_Add", sSQL.Replace("'", "''"), 1001, skills.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, skills.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(skills.Site, "Error", "UserManagement", "ConfigureSkills_Add", sSQL.Replace("'", "''"), 1007, skills.DCMUser);
                }
                catch (Exception e) { }

                return "Error while adding the Skill with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("New Skill has been Added.");
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string ConfigureSkills_Get([FromBody]Skills skills)
        {
            List<Skills> list = new List<Skills>();
            string sSQL = "SELECT Skill FROM Skills ORDER BY Skill";
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
                    Logging.WriteLog(skills.Site, "Error", "UserManagement", "ConfigureSkills_Get", sSQL.Replace("'", "''"), 3001, skills.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Skills with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }

    }
}