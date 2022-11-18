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
    public class SafetyInspectionChecklistController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetInspectionTemplateComponents([FromBody]SafetyInspectionChecklist template)
        {
            List<SafetyInspectionChecklist> list = new List<SafetyInspectionChecklist>();
            string sSQL = "SELECT * FROM SafetyModule_FormTemplate WHERE IsActive = 'Y' ORDER BY [Sequence]";

            Connection connection = new Connection();
            try
            {
                try
                {
                    Logging.WriteLog(template.Site, "Info", "SafetyInspectionChecklist", "GetInspectionTemplateComponents", sSQL.Replace("'", "''"), 1001, template.DCMUser);
                }
                catch (Exception e) { }

                String sSQL_getNewChecklistID = "SELECT ISNULL(MAX(ChecklistID),0)+1 FROM SafetyModule_Checklists";
                try
                {
                    Logging.WriteLog(template.Site, "INFO", "SafetyInspectionChecklist", "AddNewSafetyChecklist", sSQL_getNewChecklistID, 1001, template.DCMUser);
                }
                catch (Exception e) { }

                string templateID = connection.ReturnSingleValue(sSQL_getNewChecklistID, template.Site);

                DataSet ds = connection.ReturnCompleteDataSet(sSQL, template.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new SafetyInspectionChecklist
                        {
                            ID = dr["ID"].ToString(),
                            ChecklistID = templateID,
                            Sequence = dr["Sequence"].ToString(),
                            Label = dr["Label"].ToString(),
                            InputFieldType = dr["InputFieldType"].ToString(),
                            IsActive = dr["IsActive"].ToString(),
                            CheckboxRequired = dr["CheckboxRequired"].ToString(),
                            UDF1 = dr["UDF1"].ToString(),
                            UDF2 = dr["UDF2"].ToString(),
                            UDF3 = dr["UDF3"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(template.Site, "Error", "SafetyInspectionChecklist", "GetInspectionTemplateComponents", sSQL.Replace("'", "''"), 3001, template.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the SafetyInspectionChecklist with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        // Add new checklist
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddNewSafetyChecklist([FromBody] SafetyInspectionChecklist checklist)
        {
            string sSQL_getNewChecklistID = "";
            try
            {
                Connection connection = new Connection();
                
                String chkVal = "N";
                if(checklist.SelectedCheckBoxItem == true)
                {
                    chkVal = "Y";
                }
                    string sSQL = "INSERT INTO SafetyModule_Checklists (ChecklistID, Sequence, InputFieldType, Label, TextFieldValue, CheckboxValue, RadioButtonValue,AddedBy,Adddate) " +
                                        " VALUES (" + checklist.ChecklistID + ", " + checklist.Sequence + ", '" + checklist.InputFieldType + "', '" + checklist.Label + "','" + checklist.TextFieldValue + "','" + chkVal+ "','" + checklist.SelectedRadioButtonItem + "','" + checklist.DCMUser + "',getdate()) ";
                try
                {
                    Logging.WriteLog(checklist.Site, "INFO", "SafetyInspectionChecklist", "AddNewSafetyChecklist", sSQL, 1001, checklist.DCMUser);
                    connection.ExecuteInsertQuery(sSQL, checklist.Site);
                }
                catch
                {
                    Logging.WriteLog(checklist.Site, "Error", "SafetyInspectionChecklist", "AddNewSafetyChecklist", sSQL.Replace("'", "''"), 3001, checklist.DCMUser);
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(checklist.Site, "Error", "SafetyInspectionChecklist", "AddNewSafetyChecklist", sSQL_getNewChecklistID.Replace("'", "''"), 3001, checklist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while adding new safety incident with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("New safety incident has been recorded.");
        }



        // Add new checklist
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddNewComponentToSafetyChecklistTemplate([FromBody] SafetyInspectionChecklist checklist)
        {
            string sSQL_getNewChecklistID = "";
            try
            {
                Connection connection = new Connection();
                
                string sSQL = "INSERT INTO SafetyModule_FormTemplate (Label, [Sequence], InputFieldType, IsActive, CheckboxRequired, UDF1, UDF2, UDF3) " +
                    " VALUES ('"+ checklist.Label + "', (SELECT ISNULL(Max([Sequence]),0) + 1 FROM SafetyModule_FormTemplate WHERE IsActive = 'Y'), '" + checklist.InputFieldType + "','Y','" + checklist.CheckboxRequired + "','" + checklist.UDF1 + "','" + checklist.UDF2 + "','" + checklist.UDF3 + "')";
                try
                {
                    Logging.WriteLog(checklist.Site, "INFO", "SafetyInspectionChecklist", "AddComponentToFormTemplate", sSQL, 1001, checklist.DCMUser);
                    connection.ExecuteInsertQuery(sSQL, checklist.Site);
                }
                catch
                {
                    Logging.WriteLog(checklist.Site, "Error", "SafetyInspectionChecklist", "AddComponentToFormTemplate", sSQL.Replace("'", "''"), 3001, checklist.DCMUser);
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(checklist.Site, "Error", "SafetyInspectionChecklist", "AddComponentToFormTemplate", sSQL_getNewChecklistID.Replace("'", "''"), 3001, checklist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while adding new component to Safety Checklist Template with error:" + ex.Message;
            }

            return JsonSerializer.Serialize("New component has been added to safety checklist template.");
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string LoadSafetyChecklistTable([FromBody]SafetyInspectionChecklist chekclist)
        {
            List<SafetyInspectionChecklist> list = new List<SafetyInspectionChecklist>();
            string sSQL = "select Label, InputFieldType, CheckboxRequired, UDF1, UDF2, UDF3, IsActive, ID from SafetyModule_FormTemplate order by CASE WHEN IsActive = 'Y' THEN [Sequence] ELSE 999  END ASC";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ReturnCompleteDataSet(sSQL, chekclist.Site);

                list = (from DataRow dr in ds.Tables[0].Rows
                        select new SafetyInspectionChecklist
                        {
                            Label = dr["Label"].ToString(),
                            InputFieldType = dr["InputFieldType"].ToString(),
                            CheckboxRequired = dr["CheckboxRequired"].ToString(),
                            UDF1 = dr["UDF1"].ToString(),
                            UDF2 = dr["UDF2"].ToString(),
                            UDF3 = dr["UDF3"].ToString(),
                            IsActive = dr["IsActive"].ToString(),
                            ID = dr["ID"].ToString(),
                        }).ToList();
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(chekclist.Site, "Error", "SafetyInspectionChecklist", "LoadSafetyChecklistTable", sSQL.Replace("'", "''"), 3001, chekclist.DCMUser);
                }
                catch (Exception e) { }

                return "Error while Fetching the Checklists with error:" + ex.Message;
            }

            return JsonSerializer.Serialize(list);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string SafetyTemplate_ChangeActiveStatus([FromBody]SafetyInspectionChecklist template)
        {

            string sSQL = " UPDATE SafetyModule_FormTemplate SET IsActive = IIF(IsActive = 'Y', 'N', 'Y') WHERE ID = '" + template.ID + "' " +

                    " ; with a as (select MAX([Sequence]) n FROM SafetyModule_FormTemplate WHERE IsActive = 'Y' AND ID<> '" + template.ID + "')  " +
                " UPDATE SafetyModule_FormTemplate SET[Sequence] = a.n + 1 from a WHERE ID = '" + template.ID + "' AND IsActive = 'Y' " +

                " ; with b as (SELECT Max([Sequence])[Sequence] FROM SafetyModule_FormTemplate WHERE ID = '" + template.ID + "' AND IsActive = 'N')  " +
                " UPDATE SafetyModule_FormTemplate SET[Sequence] = SafetyModule_FormTemplate.[Sequence] - 1 FROM b WHERE SafetyModule_FormTemplate.[Sequence] > b.[Sequence] ";

            try
            {
                Connection connection = new Connection();

                try
                {
                    Logging.WriteLog(template.Site, "INFO", "SafetyInspectionChecklist", "SafetyTemplate_ChangeActiveStatus", sSQL.Replace("'", "''"), 1001, template.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, template.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(template.Site, "Error", "SafetyInspectionChecklist", "SafetyTemplate_ChangeActiveStatus", sSQL.Replace("'", "''"), 1007, template.DCMUser);
                }
                catch (Exception e) { }

                return "Error while changing safety checklist template activation status:" + ex.Message;
            }

            return JsonSerializer.Serialize("Safety chekclist template Activation status has been changed.");
        }




        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string SafetyTemplateSequence_MoveUp([FromBody]SafetyInspectionChecklist templateItem)
        {

            string sSQL = "declare @num as int " +
                " SELECT @num = [Sequence] FROM SafetyModule_FormTemplate WHERE ID = '" + templateItem.ID + "' AND IsActive = 'Y' " +
                " IF(@num > 1) " +
                " BEGIN " +
                " UPDATE SafetyModule_FormTemplate SET[Sequence] = [Sequence] + 1 WHERE[Sequence] = @num - 1 " +
                " UPDATE SafetyModule_FormTemplate SET[Sequence] = [Sequence] - 1 WHERE ID = '" + templateItem.ID + "' AND IsActive = 'Y' " +
                " END ";

            try
            {
                Connection connection = new Connection();

                try
                {
                    Logging.WriteLog(templateItem.Site, "INFO", "SafetyInspectionChecklist", "SafetyTemplateSequence_MoveUp", sSQL.Replace("'", "''"), 1001, templateItem.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, templateItem.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(templateItem.Site, "Error", "SafetyInspectionChecklist", "SafetyTemplateSequence_MoveUp", sSQL.Replace("'", "''"), 1007, templateItem.DCMUser);
                }
                catch (Exception e) { }

                return "Error while moving checklist up:" + ex.Message;
            }

            return JsonSerializer.Serialize("Safety chekclist template item has been Moved Up.");
        }






        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string SafetyTemplateSequence_MoveDown([FromBody]SafetyInspectionChecklist template)
        {

            string sSQL = "declare @num as int " +
              " SELECT @num = [Sequence] FROM SafetyModule_FormTemplate WHERE ID = '" + template.ID + "'  AND IsActive = 'Y' " +
              " declare @numMax as int " +
              " SELECT @numMax = MAX([Sequence]) FROM SafetyModule_FormTemplate WHERE IsActive = 'Y' " +
              " IF(@num < @numMax) " +
              " BEGIN " +
              " UPDATE SafetyModule_FormTemplate SET[Sequence] = [Sequence] - 1 WHERE[Sequence] = @num + 1 AND IsActive = 'Y' " +
              " UPDATE SafetyModule_FormTemplate SET[Sequence] = [Sequence] + 1 WHERE ID = '" + template.ID + "' AND IsActive = 'Y' " +
              " END "; 

            try
            {
                Connection connection = new Connection();

                try
                {
                    Logging.WriteLog(template.Site, "INFO", "SafetyInspectionChecklist", "SafetyTemplateSequence_MoveDown", sSQL.Replace("'", "''"), 1001, template.DCMUser);
                }
                catch (Exception e) { }

                string result = connection.ExecuteInsertQuery(sSQL, template.Site);
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(template.Site, "Error", "SafetyInspectionChecklist", "SafetyTemplateSequence_MoveDown", sSQL.Replace("'", "''"), 1007, template.DCMUser);
                }
                catch (Exception e) { }

                return "Error while moving checklist up:" + ex.Message;
            }

            return JsonSerializer.Serialize("Template item sequence has been Moved Down.");
        }
        



    }


    public class SafetyInspectionChecklist
    {
        public string Site { get; set; }
        public string DCMUser { get; set; }
        public string ID { get; set; }
        public string ChecklistID { get; set; }
        public string Label { get; set; }
        public string InputFieldType { get; set; }
        public string IsActive { get; set; }
        public string Sequence { get; set; }
        public string CheckboxRequired { get; set; }
        public string UDF1 { get; set; }
        public string UDF2 { get; set; }
        public string UDF3 { get; set; }
        public string TextFieldValue { get; set; }
        public bool SelectedCheckBoxItem { get; set; }
        public string SelectedRadioButtonItem { get; set; }
    }

}

