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

namespace DC4._0Backend.Controllers
{
    public class IndirectActivityDetailsController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllIndirectTransactions([FromBody]IndirectActivityDetails time)
        {


            string sSQL = String.Empty;

            sSQL = " With a As ( Select  id.SerialID,id.UserName,ui.FirstName,ui.Surname,id.TaskName,  Convert(Char(10), id.StartDate, 103) 'StartDate',id.StartTime" +
                ",  IIF(id.EndDate is not null, Convert(Char(10), id.EndDate, 103), '') 'EndDate', IsNull(id.EndTime,'') 'EndTime',  id.DownTime" +
                ",  cast((DateDiff(s, (Convert(DateTime, id.StartDate, 103) + id.StartTime),(Convert(DateTime,id.EndDate,103) + id.EndTime))) /60 - id.DownTime as varchar) 'TotalTime' " +
                "From IndirectActivityDetails id, UserInfo ui Where (ui.UserID = id.UserName) " +
                ")  select SerialID,UserName,FirstName,Surname,TaskName,StartDate,StartTime,EndDate,EndTime,DownTime  " +
                ",cast(TotalTime/60 as varchar) + ':' + IIF(TotalTime % 60 >9,cast(TotalTime % 60 as varchar), '0'+cast(TotalTime % 60 as varchar) ) 'TotalTime' " +
                "from a  WHERE 1=1 AND Convert(date,StartDate,103)  Between Convert(DateTime, Convert(Char(19),'" + time.StartDate + "',103),103) " + "" +
                   " And Convert(DateTime, Convert(Char(19),'" + time.EndDate + "',103),103)   Order By UserName,StartDate, StartTime ASC ";

            Connection connection = new Connection();

            List<IndirectActivityDetails> entryList = new List<IndirectActivityDetails>();
            try
            {


                try
                {
                    Logging.WriteLog(time.Site, "Info", "IndirectActivityDetails", "GetAllIndirectTransactions", sSQL.Replace("'", "''"), 1002, time.DCMUser);
                }
                catch (Exception ex)
                {

                }



                DataSet ds = connection.ExecuteSelectQuery(sSQL, time.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {


                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        IndirectActivityDetails obj = new IndirectActivityDetails();
                        obj.SerialID = ds.Tables[0].Rows[i]["SerialID"].ToString();
                        obj.UserName = ds.Tables[0].Rows[i]["UserName"].ToString();
                        obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                        obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                        obj.TaskName = ds.Tables[0].Rows[i]["TaskName"].ToString();
                        obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                        obj.StartTime = ds.Tables[0].Rows[i]["StartTime"].ToString();
                        obj.EndDate = ds.Tables[0].Rows[i]["EndDate"].ToString();
                        obj.EndTime = ds.Tables[0].Rows[i]["EndTime"].ToString();
                        obj.DownTime = Convert.ToDouble(ds.Tables[0].Rows[i]["DownTime"].ToString());
                        obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();

                        entryList.Add(obj);

                    }

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(time.Site, "Error", "IndirectActivityDetails", "GetAllIndirectTransactions", sSQL.Replace("'", "''"), 3002, time.DCMUser);
                }
                catch (Exception e)
                {

                }


                return "Error Occured:While Fetching the List of indirect tasks";
            }


            return JsonSerializer.Serialize(entryList);

        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AddGroupIndirectTransaction([FromBody] IndirectActivityDetails indirectRecord)
        {

            string[] userlist = indirectRecord.UserName.Split(',');

            for (int i = 0; i < userlist.Length; i++)
            {
                string[] names = userlist[i].Split(' ');
                string FirstName = names[0];
                 string SurName = names[names.Length - 2];

                names[names.Length - 1] = names[names.Length - 1].Replace("(","").Replace(")","");
                string UserID = names[names.Length - 1];

                IndirectActivityDetails newobj = new IndirectActivityDetails();
                newobj.TaskName = indirectRecord.TaskName;
                newobj.UserName = UserID;
                newobj.FirstName = FirstName;
                newobj.SurName = SurName;
                newobj.StartDate = DateTime.ParseExact(indirectRecord.StartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture).ToString("dd/MM/yyyy");
                newobj.EndDate = DateTime.ParseExact(indirectRecord.EndDate, "yyyy-MM-dd", CultureInfo.InvariantCulture).ToString("dd/MM/yyyy");
                newobj.StartTime = indirectRecord.StartTime;
                newobj.EndTime = indirectRecord.EndTime;
                newobj.Site = indirectRecord.Site;

                AddIndirectTransaction(newobj);


            }


            return "Transaction Completed";
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AddIndirectTransaction([FromBody] IndirectActivityDetails indirectRecord)
        {
            string sSQL = String.Empty;

            Connection connection = new Connection();
            string result = string.Empty;

            if (indirectRecord.EndTime.Equals(""))
            {
                indirectRecord.EndTime = "00:00:00";
            }

            try
            {
                //Check if User has already performed Indirect Activity on the Same Date/Time
                sSQL = "Select count(*) from InDirectActivityDetails Where UserName = '" + indirectRecord.UserName + "' and Convert(DateTime, StartDate,103) = Convert(DateTime, '" + indirectRecord.StartDate + "', 103)  And('" + indirectRecord.StartTime + "' >= StartTime and '" + indirectRecord.StartTime + "' <= Endtime)";

                int count = int.Parse(connection.ReturnSingleValue(sSQL, indirectRecord.Site).ToString());

                if (count > 0)
                {
                    sSQL = "Select count(*) from InDirectActivityDetails  Where UserName = '" + indirectRecord.UserName + "' and Convert(DateTime,StartDate,103) = Convert(DateTime,'" + indirectRecord.StartDate + "',103)  And ('" + indirectRecord.StartTime + "' >= StartTime and '" + indirectRecord.StartTime + "'<= Endtime) And '" + indirectRecord.StartTime + "' between StartTime and Endtime";
                    string ActivityName = connection.ReturnSingleValue(sSQL, indirectRecord.Site);

                    result = "Overlapped Time with Indirect Activity";
                    return result;
                }

                //Check if User has already performed Direct Activity on the Same Date/Time
                sSQL = "Select count(*) from DCMImport Where OperatorID = '" + indirectRecord.UserName + "'  And Convert(DateTime,EndDateTime,103)Between  Convert(DateTime,'" + indirectRecord.StartDate + " " + indirectRecord.StartTime + "',103) And Convert(DateTime,'" + indirectRecord.EndDate + " " + indirectRecord.EndTime + "',103)";

                int countDirects = int.Parse(connection.ReturnSingleValue(sSQL, indirectRecord.Site).ToString());

                if (countDirects > 0)
                {
                    result = "Overlapped Time with Direct Activity";
                    return result;
                }

                // Check if the Start Date/ Time overlaped when EndTime is null
                // This may happen just in IndirectActivity When ever data is entered by Superviser manually
                sSQL = "select Count(*) from IndirectActivityDetails where  StartDate=convert(DateTime,'" + indirectRecord.StartDate + "',103) and UserName='" + indirectRecord.UserName + "'  and StartTime = convert(char(8),'" + indirectRecord.StartTime + "',114) and EndDate IS NULL and EndTime IS NULL";

                int countIndirects2 = int.Parse(connection.ReturnSingleValue(sSQL, indirectRecord.Site).ToString());

                if (countIndirects2 > 0)
                {
                    sSQL = "Select TaskName From IndirectActivityDetails where StartDate=convert(DateTime,'" + indirectRecord.StartDate + "',103) and UserName='" + indirectRecord.UserName + "' and StartTime=convert(char(8),'" + indirectRecord.StartTime + "',114) and EndDate IS NULL and EndTime IS NULL";

                    string ActivityName = connection.ReturnSingleValue(sSQL, indirectRecord.Site);

                    result = "Overlapped Time with Indirect Activity";
                    return result;
                }


                //if another activity will be asigning to the user and EndTime for this user for previus activity was null
                //The EndTime should be filled by StartTime of new Activity

                sSQL = "Update IndirectActivityDetails  Set EndDate=convert(DateTime,'" + indirectRecord.StartDate + "',103),EndTime=convert(char(8),'" + indirectRecord.StartTime + "',114)" +
                        " Where SerialID in (Select Max(SerialID) from IndirectActivityDetails  Where UserName='" + indirectRecord.UserName + "' And((Convert(DateTime,(EndDate + ''+ EndTime),103) is NULL   and  StartDate = convert(DateTime,'" + indirectRecord.StartDate + "',103) and StartTime <=  convert(char(8),'" + indirectRecord.StartTime + "',114))))";
                //" Where SerialID in (Select Max(SerialID) from IndirectActivityDetails  Where UserName='" + indirectRecord.UserName + "' And((Convert(DateTime,(EndDate + ''+ EndTime),103) is NULL or (Convert(DateTime,(EndDate + ''+ EndTime),103) = Convert(DateTime,(StartDate + ''+ StartTime),103)))))";


                string strresult = connection.ExecuteUpdateQuery(sSQL, indirectRecord.Site);

                //Double dTime = 0;
                //if (indirectRecord.DownTime != "")
                //{
                //    dTime = Double.Parse(indirectRecord.DownTime);
                //}
                //prepare insert statement

                sSQL = "Insert Into IndirectActivityDetails " +
                       "(TaskName, UserName, StartDate,StartTime,EndDate,EndTime,DownTime,TotalTime)" +
                       " Select'" + indirectRecord.TaskName + "'," +
                       "'" + indirectRecord.UserName + "'," +
                       "Convert(DateTime,'" +indirectRecord.StartDate + "',103)," +
                       "'"+indirectRecord.StartTime+"',";

                  
                 if (indirectRecord.EndTime.Equals("00:00:00"))
                    {
                    sSQL += "NULL,";
                    sSQL += "NULL,";
                      }
                    else
                      {
                       sSQL += "Convert(DateTime,'" + indirectRecord.EndDate + "',103),";
                       sSQL += "'" +indirectRecord.EndTime+ "',";
                       }


                sSQL += ""+indirectRecord.DownTime+ ",";

      //   'sSQL &= "Convert(Decimal(8,3),DateDiff(minute,(Convert(DateTime,'" & StartDate & "',103) + '" & StartTime & "'),(Convert(DateTime,'" & EndDate & "',103) + '" & EndTime & "'))) - " & downtime.Text & ")"

                sSQL += "Case When ";

                sSQL += "DateDiff(minute,Convert(DateTime,(Convert(Char(10),'" + indirectRecord.StartDate + "',103) + ' ' + Convert(Char(10),'" + indirectRecord.StartTime + "',103)),103),";
                sSQL += "Convert(DateTime,(Convert(Char(10),'" + indirectRecord.EndDate+  "',103)+ ' ' + Convert(Char(10),'" + indirectRecord.EndTime + "',103)),103))";
                sSQL += "<= 0 ";
                sSQL += "Then 0  Else ";
                sSQL += "Convert(Decimal(8,3),DateDiff(minute,Convert(DateTime,(Convert(Char(10),'" + indirectRecord.StartDate + "',103) + ' ' + Convert(Char(10),'" + indirectRecord.StartTime + "',103)),103),";
                sSQL += "Convert(DateTime,(Convert(Char(10),'" + indirectRecord.EndDate + "',103)+ ' ' + Convert(Char(10),'" +indirectRecord.EndTime + "',103)),103)))/60 - " + indirectRecord.DownTime+ "";
                sSQL += " End";


                try
                {
                    Logging.WriteLog(indirectRecord.Site, "Info", "IndirectActivityDetails", "AddIndirectTransaction", sSQL.Replace("'", "''"), 1001, indirectRecord.DCMUser);
                }
                catch (Exception ex)
                {

                }

                strresult = connection.ExecuteInsertQuery(sSQL, indirectRecord.Site);

                if (strresult != "Insert SuccessFull")
                {
                    return "Error Occured while Inserting the entry";
                }

                result = "New Indirect Transaction has been added";

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(indirectRecord.Site, "Warning", "IndirectActivityDetails", "AddIndirectTransaction", sSQL.Replace("'", "''"), 3001, indirectRecord.DCMUser);
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
        public string UpdateIndirectTransaction([FromBody] IndirectActivityDetails indirectRecord)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;


            try
            {
                sSQL = "Select count(*)from DCMImport  Where OperatorID = '" + indirectRecord.UserName + "'  and " +
                    "StartDateTime >= Convert(DateTime,(Convert(Char(10),'" + indirectRecord.StartDate + "',103) + ' ' + Convert(Char(10),'" + indirectRecord.StartTime + "',103)),103) " +
                    "And EndDatetime <= Convert(DateTime,(Convert(Char(10),'" + indirectRecord.EndDate + "',103) + ' ' + Convert(Char(10),'" + indirectRecord.EndTime + "',103)),103)";




                if (int.Parse(conn.ReturnSingleValue(sSQL, indirectRecord.Site)) > 0)
                {
                    return "Duplicate record found from import file for the day for User " + indirectRecord.UserName;
                }
            }
            catch (Exception ex)
            {
                return "Error Occurred while updating:" + ex.Message;
            }

            //Double dTime = 0;
            //if (indirectRecord.DownTime != "")
            //{
            //    dTime = Double.Parse(indirectRecord.DownTime);
            //}

            try
            {
                sSQL = "Update IndirectActivityDetails Set  TaskName = '" + indirectRecord.TaskName + "', StartDate = Convert(DateTime,'" + indirectRecord.StartDate + "',103)," +
                    "StartTime = '" + indirectRecord.StartTime + "',  EndDate = Convert(DateTime,'" + indirectRecord.EndDate + "',103),EndTime = '" + indirectRecord.EndTime + "'," +
                    "TotalTime =Case When DateDiff(minute,Convert(DateTime,(Convert(Char(10),'" + indirectRecord.StartDate + "',103) + ' ' + Convert(Char(10),'" + indirectRecord.StartTime + "',103)),103)," +
                    "Convert(DateTime,(Convert(Char(10),'" + indirectRecord.EndDate + "',103)+ ' ' + Convert(Char(10),'" + indirectRecord.EndTime + "',103)),103))<= 0 Then 0 " +
                    " Else Convert(Decimal(8,3),DateDiff(minute,Convert(DateTime,(Convert(Char(10),'" + indirectRecord.EndDate + "',103) + ' ' +  Convert(Char(10),'" + indirectRecord.StartTime + "',103)),103), " +
                    "Convert(DateTime,(Convert(Char(10),'" + indirectRecord.EndDate + "',103)+ ' ' + Convert(Char(10),'" + indirectRecord.EndTime + "',103)),103)))/60 - '0' End," +
                    "DownTime = " + indirectRecord.DownTime + " Where UserName = '" + indirectRecord.UserName + "' And SerialID = '" + indirectRecord.SerialID + "'";


                try
                {
                    Logging.WriteLog(indirectRecord.Site, "Info", "IndirectActivityDetails", "UpdateIndirectTransaction", sSQL.Replace("'", "''"), 1003, indirectRecord.DCMUser);
                }
                catch (Exception ex)
                {

                }

                string strresult = conn.ExecuteUpdateQuery(sSQL, indirectRecord.Site);

                if (strresult != "Update SuccessFull")
                {
                    return "Error Occurred while updating";
                }

                result = "Indirect Activity Record is Updated";
            }
            catch (Exception ex)
            {

                try
                {
                    Logging.WriteLog(indirectRecord.Site, "Warning", "IndirectActivityDetails", "UpdateIndirectTransaction", sSQL.Replace("'", "''"), 3003, indirectRecord.DCMUser);
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
        public string DeleteIndirectTransaction([FromBody] IndirectActivityDetails indirectTask)
        {

            Connection conn = new Connection();
            string sSQL = string.Empty;
            string result = string.Empty;
            try
            {

                sSQL = "Delete From IndirectActivityDetails Where SerialID = " + indirectTask.SerialID;

                string strresult = conn.ExecuteDeleteQuery(sSQL, indirectTask.Site);

                try
                {
                    Logging.WriteLog(indirectTask.Site, "Info", "IndirecyActivityDetails", "DeleteIndirectTransaction", sSQL.Replace("'", "''"), 1007, indirectTask.DCMUser);
                }
                catch (Exception ex) { }

                if (strresult != "Delete SuccessFull")
                {
                    return "Error Occured while Deleting the indirect Entry";
                }

                result = "Selected Entry Deleted from the Database";
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(indirectTask.Site, "Info", "IndirecyActivityDetails", "DeleteIndirectTransaction", sSQL.Replace("'", "''"), 3007, indirectTask.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured while Deleting the indirect Entry:" + ex.Message;
            }

            return result;
        }




        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllTaskNames([FromBody] IndirectActivityDetails indirectTask)
        {
            List<IndirectTaskName> AllIndirectTaskNames = new List<IndirectTaskName>();
            string sSQL = "select distinct ActivityName TaskName from ActivityInfo where ActivityType = 'Indirect' order by ActivityName";
            Connection connection = new Connection();
            try
            {
                DataSet ds = connection.ExecuteSelectQuery(sSQL, indirectTask.Site);

                AllIndirectTaskNames = (from DataRow dr in ds.Tables[0].Rows
                                        select new IndirectTaskName
                                        {

                                            taskName = dr["TaskName"].ToString()
                                        }).ToList();
            }
            catch (Exception ex)
            {
                return "Error while Fetching the indirect ActivityNames with error:" + ex.Message;
            }
            return JsonSerializer.Serialize(AllIndirectTaskNames);
        }
    }
}
