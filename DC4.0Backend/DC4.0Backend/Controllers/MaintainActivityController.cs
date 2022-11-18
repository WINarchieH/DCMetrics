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
    public class MaintainActivityController : ApiController
    {

        [AcceptVerbs("POST")]
        [HttpPost]
        public string AddNewActivity([FromBody]CostCenters cc)
        {
            Connection connection = new Connection();
            string sSQL = "";
            try
            {
                sSQL = "Select Count(*) from ActivityInfo Where ActivityName = '" + cc.ActivityName.TrimStart().TrimEnd() + " - " + cc.CostCenter + "'";
                int count = int.Parse(connection.ReturnSingleValue(sSQL, cc.Site));
                if (count > 0)
                {
                    return "Duplicate Activity is already there";
                }

                string task = cc.ActivityName.Substring(0, 3);

                string sSQL_TaskID = "Select '" + task + "' + convert(varchar,max(SerialID + 1)) from ActivityInfo";

                string TaskID = connection.ReturnSingleValue(sSQL_TaskID, cc.Site);

                string activity = cc.ActivityName + " - " + cc.CostCenter.TrimStart().TrimEnd();

                sSQL = "Insert Into ActivityInfo (TaskID, ActivityName, ActivityType)  Values('" + TaskID + "','" + activity + "','" + cc.ActivityType + "')";

               string result =  connection.ExecuteInsertQuery(sSQL, cc.Site);

                if (result != "Insert SuccessFull")
                {
                    return "New Activity Addition Failed";
                }

            }
            catch (Exception ex)
            {
                return "Error while adding new activity";
            }

            return "New Activity Added";

        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AddNewCostCenter([FromBody]CostCenters cc)
        {
            Connection connection = new Connection();
            string sSQL = "";
            try
            {
                sSQL = "Select Count(*) from ActivityInfo Where CC_Code = '" + cc.NewCostCenter + "' AND ActivityType='INDIRECT'";
                int count = int.Parse(connection.ReturnSingleValue(sSQL, cc.Site));
                if (count > 0)
                {
                    return "Cost Center already there";
                }

                string task = cc.NewCostCenter.Substring(0, 3);

                string sSQL_TaskID = "Select '" + task + "' + convert(varchar,max(SerialID + 1)) from ActivityInfo";

                string TaskID = connection.ReturnSingleValue(sSQL_TaskID, cc.Site);

                string activity = "Test" + " - " + cc.NewCostCenter.TrimStart().TrimEnd();

                sSQL = "Insert Into ActivityInfo (TaskID, ActivityName,ActivityGroup,ActivityType)  Values('" + TaskID + "','" + activity + "','_ALL', 'INDIRECT' )";

                string result = connection.ExecuteInsertQuery(sSQL, cc.Site);

                if (result != "Insert SuccessFull")
                {
                    return "New Cost Center Addition Failed";
                }
               

            }
            catch (Exception ex)
            {
                return "Error while adding new cost center";
            }

            return "New Cost Center Added";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AddNewDirectCCCode([FromBody]CostCenters cc)
        {
            Connection connection = new Connection();
            string sSQL = "";
            try
            {
                sSQL = "Select Count(*) from ActivityInfo Where CC_Code = '" + cc.NewCostCenter + "' AND ActivityType='DIRECT'";
                int count = int.Parse(connection.ReturnSingleValue(sSQL, cc.Site));
                if (count > 0)
                {
                    return "Cost Center already there";
                }

                string task = cc.NewCostCenter.Substring(0, 3);

                string sSQL_TaskID = "Select '" + task + "' + convert(varchar,max(SerialID + 1)) from ActivityInfo";

                string TaskID = connection.ReturnSingleValue(sSQL_TaskID, cc.Site);

                string activity = "Test" + " - " + cc.NewCostCenter.TrimStart().TrimEnd();

                sSQL = "Insert Into ActivityInfo (TaskID, ActivityName,ActivityGroup,ActivityType)  Values('" + TaskID + "','" + activity + "','_ALL', 'DIRECT' )";

                string result = connection.ExecuteInsertQuery(sSQL, cc.Site);

                if (result != "Insert SuccessFull")
                {
                    return "New Cost Center Addition Failed";
                }

            }
            catch (Exception ex)
            {
                return "Error while adding new cost center";
            }

            return "New Cost Center Added";
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteIndirectActivity([FromBody]CostCenters cc)
        {
            Connection connection = new Connection();
            string sSQL = "";

            try
            {
                if (cc.DeleteActivity.Contains(","))
                {
                    string[] activities = cc.DeleteActivity.Split(',');

                    for (int i = 0; i < activities.Length; i++)
                    {
                        sSQL = "Select Count (*) from IndirectActivityDetails Where TaskName = '" + activities[i] + "'";
                        int count = int.Parse(connection.ReturnSingleValue(sSQL, cc.Site));
                        if (count == 0)
                        {
                            sSQL = "Delete from ActivityInfo Where ActivityName = '" + activities[i] + "'";
                            connection.ReturnCompleteDataSet(sSQL, cc.Site);
                        }

                    }
                }
                else
                {

                    sSQL = "Select Count (*) from IndirectActivityDetails Where TaskName = '" + cc.DeleteActivity + "'";
                    int count = int.Parse(connection.ReturnSingleValue(sSQL, cc.Site));
                    if (count == 0)
                    {
                        sSQL = "Delete from ActivityInfo Where ActivityName = '" + cc.DeleteActivity + "'";
                        connection.ReturnCompleteDataSet(sSQL, cc.Site);
                    }
                    else
                    {
                        return "Activity Already assigned to User";
                    }
                }

            }
            catch (Exception ex)
            {
                return "Error while deleting Activity";
            }

            return "Selected Activity Deleted";
        }



        //Direct Activity
        [AcceptVerbs("POST")]
        [HttpPost]
        public string AddNewDirectActivity([FromBody]DirectActivity direct)
        {
            Connection connection = new Connection();
            string sSQL = "";
            try
            {
                sSQL = "Select Count(*) from ActivityInfo Where Activity = '" + direct.Activity.TrimStart().TrimEnd() + "'";
                int count = int.Parse(connection.ReturnSingleValue(sSQL, direct.Site));
                if (count > 0)
                {
                    return "Duplicate Activity is already there";
                }

                string task = direct.Activity.Substring(0, 3);

                string sSQL_TaskID = "Select '" + task + "' + convert(varchar,max(SerialID + 1)) from ActivityInfo";

                string TaskID = connection.ReturnSingleValue(sSQL_TaskID, direct.Site);

                string activity = direct.Activity.TrimStart().TrimEnd() + " - " + "Direct";

                sSQL = "Insert Into ActivityInfo (TaskID,ActivityName,ActivityType,ActivityGroup)  Values('" + TaskID + "','" + activity + "','" + direct.ActivityType + "','" + direct.ActivityGroup + "')";

                string result = connection.ExecuteInsertQuery(sSQL, direct.Site);

                if (result != "Insert SuccessFull")
                {
                    return "New Activity Addition Failed";
                }

            }
            catch (Exception ex)
            {
                return "Error while adding new activity";
            }

            return "New Task Created";

        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteDirectActivity([FromBody]DirectActivity direct)
        {
            Connection connection = new Connection();
            string sSQL = "";

            try
            {
                if (direct.DeleteActivity.Contains(","))
                {
                    string[] activities = direct.DeleteActivity.Split(',');

                    for (int i = 0; i < activities.Length; i++)
                    {

                        sSQL = "Delete from ActivityInfo Where ActivityName = '" + activities[i] + "'";
                        connection.ReturnCompleteDataSet(sSQL, direct.Site);
                    }
                }
                else
                {


                    sSQL = "Delete from ActivityInfo Where ActivityName = '" + direct.DeleteActivity + "'";
                    connection.ReturnCompleteDataSet(sSQL, direct.Site);

                }

            }
            catch (Exception ex)
            {
                return "Error while deleting Activity";
            }

            return "Selected Activity Deleted";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AssignIndirectActivities([FromBody]IndirectActivity indirect)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();

            try
            {
                string[] users = indirect.User.Split(',');
                for (int i = 0; i < users.Length; i++)
                {
                    int firstIndex = users[i].IndexOf('(');
                    int lastIndex = users[i].IndexOf(')');

                    string UserID = users[i].Substring(firstIndex+1, lastIndex - firstIndex-1);
                    string[] activities = indirect.Activity.Split(',');
                    foreach (string activity in activities)
                    {
                        // checking whether activity is already assigned to user for not
                        string activityname = activity + " - " + indirect.CostCenter;
                        sSQL = "select count(*) from AssignIndirectActivity where UserID = '" + UserID + "'  and ActivityName = '" + activityname + "' ";
                        int count = int.Parse(conn.ReturnSingleValue(sSQL, indirect.Site));
                        if (count == 0)
                        {
                            sSQL = "Insert Into AssignIndirectActivity (UserID,ActivityName) Values('" + UserID + "','" + activityname + "')";
                            conn.ReturnCompleteDataSet(sSQL, indirect.Site);
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return "Activities Assigned";

        }




        // This function is to delete selected indirect activity assignments for the selected user 

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteIndirectActivities([FromBody]IndirectActivity indirect)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();

            try
            {
                string[] activities = indirect.Activity.Split(',');
                foreach (string activity in activities)
                {
                    
                    sSQL = "DELETE FROM AssignIndirectActivity WHERE UserID = '" + indirect.User.Split('(', ')')[1] + "' AND ActivityName = '" + activity + "'";
                    conn.ReturnCompleteDataSet(sSQL, indirect.Site);
                }

            }
            catch (Exception ex)
            {

            }

            return "Activities Removed";

        }



        // This function is to delete  indirect activity assignments for the selected cc 

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UnassignCostCentres([FromBody]IndirectActivity indirect)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();

            try
            {
                string[] ccs = indirect.CostCenter.Split(',');
                foreach (string cc in ccs)
                {

                    sSQL = ";with a as ( select ai.ID from AssignIndirectActivity ai join ActivityInfo ainfo on ai.ActivityName = ainfo.ActivityName WHERE ainfo.CC_Code = '" + cc + "') delete from AssignIndirectActivity where id in (select id from a)";
                    conn.ReturnCompleteDataSet(sSQL, indirect.Site);
                    return "All tasks under the cost centeres have been un-assigned";
                }

            }
            catch (Exception ex)
            {

            }

            return "Error";

        }        


    }
}