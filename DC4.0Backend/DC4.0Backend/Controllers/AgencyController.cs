using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DC4._0Backend.Models;
using System.Data;
using System.Text.Json;

namespace DC4._0Backend.Controllers
{
    public class AgencyController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllAgencies([FromBody]Agency agency)
        {
            string sSQL = string.Empty;
            List<Agency> agencies = new List<Agency>();
            Connection connection = new Connection();
            DataTable dt = new DataTable();
            try
            {
        sSQL = "Select ID 'SerialID',  AgencyName 'AgencyName',AgencyCode,AgencyClose,Shift,IsNull(LevelOneSingleTime, 0) 'LevelOneSingleTime',IsNull(LevelOneTimeAndHalf, 0) 'LevelOneTimeAndHalf',IsNull(LevelOneDoubleTime, 0) 'LevelOneDoubleTime',IsNull(LevelOneDoubleTimeAndHalf,0) 'LevelOneDoubleTimeAndHalf',IsNull(LevelTwoSingletime, 0) 'LevelTwoSingleTime',IsNull(LevelTwoTimeAndHalf, 0) 'LevelTwoTimeAndHalf',IsNull(LevelTwoDoubleTime, 0) 'LevelTwoDoubleTime',IsNull(LevelTwoDoubleTimeAndHalf,0) 'LevelTwoDoubleTimeAndHalf',IsNull(LevelThreeSingleTime, 0) 'LevelThreeSingleTime',IsNull(LevelThreeTimeAndHalf, 0) 'LevelThreeTimeAndHalf',IsNull(LevelThreeDoubleTime, 0) 'LevelThreeDoubleTime',IsNull(LevelThreeDoubleTimeAndHalf,0) 'LevelThreeDoubleTimeAndHalf',IsNull(LevelFourSingletime, 0)'LevelFourSingleTime',IsNull(LevelFourTimeAndHalf, 0)'LevelFourTimeAndHalf',IsNull(LevelFourDoubleTime, 0)'LevelFourDoubleTime',IsNull(LevelFourDoubleTimeAndHalf,0) 'LevelFourDoubleTimeAndHalf'," +
                    "IsNull(LevelFiveSingleTime, 0)'LevelFiveSingleTime',IsNull(LevelFiveTimeAndHalf, 0)'LevelFiveTimeAndHalf',IsNull(LevelFiveDoubleTime, 0)'LevelFiveDoubleTime',IsNull(LevelFiveDoubleTimeAndHalf,0) 'LevelFiveDoubleTimeAndHalf' ," +
                    "IsNull(LevelSixSingleTime, 0)'LevelSixSingleTime',IsNull(LevelSixTimeAndHalf, 0)'LevelSixTimeAndHalf',IsNull(LevelSixDoubleTime, 0)'LevelSixDoubleTime',IsNull(LevelSixDoubleTimeAndHalf,0) 'LevelSixDoubleTimeAndHalf' ," +
                    "IsNull(LevelSevenSingleTime, 0)'LevelSevenSingleTime',IsNull(LevelSevenTimeAndHalf, 0)'LevelSevenTimeAndHalf',IsNull(LevelSevenDoubleTime, 0)'LevelSevenDoubleTime',IsNull(LevelSevenDoubleTimeAndHalf,0) 'LevelSevenDoubleTimeAndHalf' ," +
                    "IsNull(LevelEightSingleTime, 0)'LevelEightSingleTime',IsNull(LevelEightTimeAndHalf, 0)'LevelEightTimeAndHalf',IsNull(LevelEightDoubleTime, 0)'LevelEightDoubleTime',IsNull(LevelEightDoubleTimeAndHalf,0) 'LevelEightDoubleTimeAndHalf' ," +
                    "IsNull(TeaMoney, 0)'TeaMoney',IsNull(ForkLiftAllowance, 0)'ForkliftAllowance',IsNull(FirstAidAllowance, 0)'FirstAidAllowance',IsNull(AwardHours, 0)'AwardHours',IsNull(GST, 0)'GST' From Agency Order by AgencyName, Shift ";

                try
                {
                    Logging.WriteLog(agency.Site, "Info", "Agency", "GetAllAgency", sSQL.Replace("'", "''"), 1002, agency.DCMUser);
                }
                catch (Exception ex)
                {
                }
                DataSet ds = connection.ExecuteSelectQuery(sSQL, agency.Site);

                //agencies = (from DataRow dr in ds.Tables[0].Rows
                //            select new Agency
                //            {
                //                AgencyName = dr["Agency"].ToString(),
                //                AgencyCode = dr["AgencyCode"].ToString(),
                //                AgencyClose = dr["AgencyClose"].ToString(),
                //                Shift = dr["Shift"].ToString(),
                //                //1
                //                LevelOneSingleTime = int.Parse(dr["LevelOneSingleTime"].ToString()),
                //                LevelOneTimeAndHalf = int.Parse(dr["LevelOneTimeAndHalf"].ToString()),
                //               LevelOneDoubleTime = int.Parse(dr["LevelOneDoubleTime"].ToString()),
                //               LevelOneDoubleTimeAndHalf = int.Parse(dr["LevelOneDoubleTimeAndHalf"].ToString()),

                //                LevelTwoTimeAndHalf = int.Parse(dr["LevelTwoTimeAndHalf"].ToString()),
                //                LevelTwoDoubleTime = int.Parse(dr["LevelTwoDoubleTime"].ToString()),
                //                LevelTwoDoubleTimeAndHalf = int.Parse(dr["LevelTwoDoubleTimeAndHalf"].ToString()),

                //                //3

                //                LevelThreeSingleTime = int.Parse(dr["LevelThreeSingleTime"].ToString()),
                //                LevelThreeTimeAndHalf = int.Parse(dr["LevelThreeTimeAndHalf"].ToString()),
                //                LevelThreeDoubleTime = int.Parse(dr["LevelThreeDoubleTime"].ToString()),
                //                LevelThreeDoubleTimeAndHalf = int.Parse(dr["LevelThreeDoubleTimeAndHalf"].ToString()),
                //                //4

                //                LevelFourSingleTime = int.Parse(dr["LevelFourSingletime"].ToString()),
                //                LevelFourTimeAndHalf = int.Parse(dr["LevelFourTimeAndHalf"].ToString()),
                //                LevelFourDoubleTime = int.Parse(dr["LevelFourDoubleTime"].ToString()),
                //                LevelFourDoubleTimeAndHalf = int.Parse(dr["LevelFourDoubleTimeAndHalf"].ToString()),
                //                //5
                //                LevelFiveSingleTime = int.Parse(dr["LevelFiveSingletime"].ToString()),
                //                LevelFiveTimeAndHalf = int.Parse(dr["LevelFiveTimeAndHalf"].ToString()),
                //                LevelFiveDoubleTime = int.Parse(dr["LevelFiveDoubleTime"].ToString()),
                //                LevelFiveDoubleTimeAndHalf = int.Parse(dr["LevelFiveDoubleTimeAndHalf"].ToString()),

                //                //other expenses
                //                Meal = int.Parse(dr["TeaMoney"].ToString()),
                //                ForkLift= int.Parse(dr["ForkliftAllowance"].ToString()),
                //                FirstAid = int.Parse(dr["FirstAidAllowance"].ToString()),
                //                AwardHours = int.Parse(dr["AwardHours"].ToString()),
                //                GST= int.Parse(dr["GST"].ToString())

                //          }).ToList();

                dt = ds.Tables[0];

            }

            catch (Exception ex)
            {
                Logging.WriteLog(agency.Site, "Error", "Agency", "GetAgency", sSQL.Replace("'", "''"), 3003, agency.DCMUser);
                return "Error while Fetching the agencies " + ex.Message;

            }
           
            return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertAgency([FromBody] Agency agency)
        {
            string sSQL = string.Empty;
            Connection connection = new Connection();
            try
            {
                sSQL = "Select count(*) from Agency Where AgencyName = '" + agency.AgencyName + "' And Shift = '" + agency.Shift + "'";
                int count = int.Parse(connection.ReturnSingleValue(sSQL, agency.Site));
                if (count == 0)
                {
                    sSQL = " Insert Into Agency(AgencyName,AgencyCode,AgencyClose,Shift,LevelOneSingleTime,LevelOneTimeAndHalf,LevelOneDoubleTime, LevelOneDoubleTimeAndHalf," +
                        "LevelTwoSingletime,LevelTwoTimeAndHalf,LevelTwoDoubleTime,LevelTwoDoubleTimeAndHalf,LevelThreeSingleTime,LevelThreeTimeAndHalf,LevelThreeDoubleTime,LevelThreeDoubleTimeAndHalf," +
                        "LevelFourSingletime,LevelFourTimeAndHalf,LevelFourDoubleTime,LevelFourDoubleTimeAndHalf,LevelFiveSingletime,LevelFiveTimeAndHalf,LevelFiveDoubleTime,LevelFiveDoubleTimeAndHalf,LevelSixSingletime,LevelSixTimeAndHalf,LevelSixDoubleTime,LevelSixDoubleTimeAndHalf,LevelSevenSingletime,LevelSevenTimeAndHalf,LevelSevenDoubleTime,LevelSevenDoubleTimeAndHalf,LevelEightSingletime,LevelEightTimeAndHalf,LevelEightDoubleTime,LevelEightDoubleTimeAndHalf,TeaMoney,ForkLiftAllowance,FirstAidAllowance,AwardHours,GST)" +
                        " Values('" + agency.AgencyName + "','" + agency.AgencyCode + "','" + agency.AgencyClose + "','" + agency.Shift + "'," + agency.LevelOneSingleTime + "," + agency.LevelOneTimeAndHalf + "," + agency.LevelOneDoubleTime + "," + agency.LevelOneDoubleTimeAndHalf + "," + agency.LevelTwoSingleTime + "," + agency.LevelTwoTimeAndHalf + "," + agency.LevelTwoDoubleTime + "," + agency.LevelTwoDoubleTimeAndHalf + "," +
                        "" + agency.LevelThreeSingleTime + "," + agency.LevelThreeTimeAndHalf + "," + agency.LevelThreeDoubleTime + "," + agency.LevelThreeDoubleTimeAndHalf + "," + agency.LevelFourSingleTime + "," + agency.LevelFourTimeAndHalf + "," + agency.LevelFourDoubleTime + "," + agency.LevelFourDoubleTimeAndHalf + "," +
                        "" + agency.LevelFiveSingleTime + "," + agency.LevelFiveTimeAndHalf + "," + agency.LevelFiveDoubleTime + "," + agency.LevelFiveDoubleTimeAndHalf + "," +
                         "" + agency.LevelSixSingleTime + "," + agency.LevelSixTimeAndHalf + "," + agency.LevelSixDoubleTime + "," + agency.LevelSixDoubleTimeAndHalf + ","+
                          "" + agency.LevelSevenSingleTime + "," + agency.LevelSevenTimeAndHalf + "," + agency.LevelSevenDoubleTime + "," + agency.LevelSevenDoubleTimeAndHalf + ","+
                           "" + agency.LevelEightSingleTime + "," + agency.LevelEightTimeAndHalf + "," + agency.LevelEightDoubleTime + "," + agency.LevelEightDoubleTimeAndHalf + ","+
                        ""+agency.TeaMoney + "," + agency.ForkLiftAllowance + "," + agency.FirstAidAllowance + "," + agency.AwardHours + "," + agency.GST + ")";

                    try
                    {
                        Logging.WriteLog(agency.Site, "Info", "Agency", "InsertAgency", sSQL.Replace("'", "''"), 1001, agency.DCMUser);
                    }
                    catch (Exception ex)
                    {
                    }

                string result = connection.ExecuteInsertQuery(sSQL, agency.Site);

                    if (result != "Insert SuccessFull")
                    {
                        return "Creation of New Agency Failed";
                    }


                }
                else
                {
                    try
                    {
                        Logging.WriteLog(agency.Site, "Warning", "Agency", "InsertAgency", sSQL.Replace("'", "''"), 2001, agency.DCMUser);
                    }
                    catch (Exception ex)
                    {
                    }
                    return "Agency Already Present";
                }
            }

            catch (Exception ex)
            {
                Logging.WriteLog(agency.Site, "Error", "Agency", "AddAgency", sSQL.Replace("'", "''"), 3001, agency.DCMUser);
                return "Creation of New Agency Failed With Error:"+ex.Message;
            }
            return "Agency Created";
            }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateAgency([FromBody] Agency agency)
        {
            string sSQL = string.Empty;
            Connection connection = new Connection();
            try
            {
                sSQL = "Select count(*) from Agency Where AgencyName = '" + agency.AgencyName + "' And Shift = '" + agency.Shift + "'";
                int count = int.Parse(connection.ReturnSingleValue(sSQL, agency.Site));
                if (count == 0)
                {
                    try
                    {
                        Logging.WriteLog(agency.Site, "Warning", "Agency", "UpdateAgency", sSQL.Replace("'", "''"), 2002, agency.DCMUser);
                    }
                    catch (Exception ex)
                    {
                    }
                    return "Agency cannot be Updated";
                }

                sSQL = "Update Agency Set AgencyCode = '"+agency.AgencyCode.Trim()+"',AgencyClose = '"+agency.AgencyClose+"',Shift = '"+agency.Shift+"',LevelOneSingleTime = "+agency.LevelOneSingleTime+",LevelOneTimeAndHalf = "+agency.LevelOneTimeAndHalf+",LevelOneDoubleTime = "+agency.LevelOneDoubleTime+ ", LevelOneDoubleTimeAndHalf = " + agency.LevelOneDoubleTimeAndHalf+","+
                       "LevelTwoSingleTime = "+agency.LevelTwoSingleTime+",LevelTwoTimeAndHalf = "+agency.LevelTwoTimeAndHalf+",LevelTwoDoubleTime = "+agency.LevelTwoDoubleTime+ ",LevelTwoDoubleTimeAndHalf = " + agency.LevelTwoDoubleTimeAndHalf + "," +
                       "LevelThreeSingleTime = " + agency.LevelThreeSingleTime+",LevelThreeTimeAndHalf = "+agency.LevelThreeTimeAndHalf+ ",LevelThreeDoubleTime = "+agency.LevelThreeDoubleTime+ ",LevelThreeDoubleTimeAndHalf = "+agency.LevelThreeDoubleTimeAndHalf+"," +
                       "LevelFourSingleTime = "+agency.LevelFourSingleTime+",LevelFourTimeAndHalf = "+agency.LevelFourTimeAndHalf+",LevelFourDoubleTime = "+agency.LevelFourDoubleTime+ ",LevelFourDoubleTimeAndHalf = "+agency.LevelFourDoubleTimeAndHalf+"," +
                       "LevelFiveSingleTime = "+agency.LevelFiveSingleTime+",LevelFiveTimeAndHalf = "+agency.LevelFiveTimeAndHalf+"," +
                       "LevelFiveDoubleTime = "+agency.LevelFiveDoubleTime+ ",LevelFiveDoubleTimeAndHalf = "+agency.LevelFiveDoubleTimeAndHalf+" ," +
                        "LevelSixSingleTime = " + agency.LevelSixSingleTime + ",LevelSixTimeAndHalf = " + agency.LevelSixTimeAndHalf + " ,LevelSixDoubleTime = " + agency.LevelSixDoubleTime + ",LevelSixDoubleTimeAndHalf = " + agency.LevelSixDoubleTimeAndHalf + " ," +
                        "LevelSevenSingleTime = " + agency.LevelSevenSingleTime + ",LevelSevenTimeAndHalf = " + agency.LevelSevenTimeAndHalf + " ,LevelSevenDoubleTime = " + agency.LevelSevenDoubleTime + ",LevelSevenDoubleTimeAndHalf = " + agency.LevelSevenDoubleTimeAndHalf + " ," +
                        "LevelEightSingleTime = " + agency.LevelEightSingleTime + ",LevelEightTimeAndHalf = " + agency.LevelEightTimeAndHalf + " ,LevelEightDoubleTime = " + agency.LevelEightDoubleTime + ",LevelEightDoubleTimeAndHalf = " + agency.LevelEightDoubleTimeAndHalf + " ," +
                       "TeaMoney = " + agency.TeaMoney+",ForkliftAllowance = "+agency.ForkLiftAllowance+",FirstAidAllowance = "+agency.FirstAidAllowance+",AwardHours = "+agency.AwardHours+",GST = "+agency.GST+" Where AgencyName = '"+agency.AgencyName + "' And Shift = '"+agency.Shift+"'";

                try
                {
                    Logging.WriteLog(agency.Site, "Info", "Agency", "UpdateAgency", sSQL.Replace("'", "''"), 1003, agency.DCMUser);
                }
                catch (Exception ex)
                {
                }


                string result = connection.ExecuteUpdateQuery(sSQL, agency.Site);

                if (result != "Update SuccessFull")
                {
                    return "Update of Agency Failed";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(agency.Site, "Error", "Agency", "UpdateAgency", sSQL.Replace("'", "''"), 3003, agency.DCMUser);
                return "Error While Updating the Agency" + ex.Message;
            }

            return "Agency Updated";
         }
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteAgency([FromBody]Agency agency)
        {

            string sSQL = string.Empty;
            Connection connection = new Connection();
            try
            {
                sSQL = " Select Count(*) from UserInfo where Agency = '" + agency.AgencyName + "' and ShiftCode = '"+agency.Shift+"'";
                int count = int.Parse(connection.ReturnSingleValue(sSQL, agency.Site));
                if (count > 0)
                {
                    try
                    {
                        Logging.WriteLog(agency.Site, "Warning", "Agency", "DeleteAgency", sSQL.Replace("'", "''"), 2007, agency.DCMUser);
                    }
                    catch (Exception ex)
                    {
                    }
                    return "Agency Still Assigned to users";
                }

                sSQL = "Delete From Agency Where AgencyName = '" + agency.AgencyName + "' And Shift = '" + agency.Shift + "'";

                try
                {
                    Logging.WriteLog(agency.Site, "Info", "Agency", "DeleteAgency", sSQL.Replace("'", "''"), 1007, agency.DCMUser);
                }
                catch (Exception ex)
                {
                }

              string result = connection.ExecuteDeleteQuery(sSQL, agency.Site);

                if (result != "Delete SuccessFull")
                {
                    return "Removal of Agency Failed";
                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(agency.Site, "Error", "Agency", "DeleteAgency", sSQL.Replace("'", "''"), 3007, agency.DCMUser);
                return " Error While Deleting the Agency";
            }

            return "Agency Deleted";
        }
    }
}
