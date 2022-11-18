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

using System.Globalization;

namespace DC4._0Backend.Controllers
{
    public class UserHistoryController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetUserHistoryAttributes([FromBody]UserHistory_Snackbar_Attributes userAttributes )
        {

            DateTime datetime1 = DateTime.Parse(userAttributes.StartDate);
            userAttributes.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(userAttributes.EndDate);
            userAttributes.EndDate = datetime2.ToString("dd/MM/yyyy");

            string sSQL = "EXEC spUserHistory_Attributes @Parm='" + userAttributes.StartDate + userAttributes.EndDate + "', @UserID='" + userAttributes.UserID + "'";

            Connection connection = new Connection();

            List<UserHistory_Snackbar_Attributes> userAttrList = new List<UserHistory_Snackbar_Attributes>();
            try
            {
                try
                {
                    Logging.WriteLog(userAttributes.Site, "Info", "UserHistory", "GetUserHistoryAttributes", sSQL.Replace("'", "''"), 1002, userAttributes.DCMUser);
                }
                catch (Exception ex) { }

                DataSet ds = connection.ExecuteSelectQuery(sSQL, userAttributes.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    UserHistory_Snackbar_Attributes attr = null;

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        attr = new UserHistory_Snackbar_Attributes();
                        attr.NumOfHRIncidents = ds.Tables[0].Rows[i]["NumOfHRIncidents"].ToString();
                        attr.NumOfDaysLoggedOnLate = ds.Tables[0].Rows[i]["NumOfDaysLoggedOnLate"].ToString();
                        attr.TotalDays = ds.Tables[0].Rows[i]["TotalDays"].ToString(); 
                        attr.NumOfLeaves = ds.Tables[0].Rows[i]["NumOfLeaves"].ToString();
                        attr.TotalLostTime = ds.Tables[0].Rows[i]["TotalLostTime"].ToString();
                        attr.AvgLostTime = ds.Tables[0].Rows[i]["AvgLostTime"].ToString();

                        attr.IncidentsDiff = ds.Tables[0].Rows[i]["IncidentsDiff"].ToString();
                        attr.LoggedOnLateDiff = ds.Tables[0].Rows[i]["LoggedOnLateDiff"].ToString();
                        attr.LeavesDiff = ds.Tables[0].Rows[i]["LeavesDiff"].ToString();
                        attr.AvgLostTimeDiff = ds.Tables[0].Rows[i]["AvgLostTimeDiff"].ToString();
                        userAttrList.Add(attr);
                    }
                } else
                {
                    UserHistory_Snackbar_Attributes attr = new UserHistory_Snackbar_Attributes();
                    attr.NumOfHRIncidents = 0.ToString();
                    attr.NumOfDaysLoggedOnLate = 0.ToString();
                    attr.TotalDays = 0.ToString();
                    attr.NumOfLeaves = 0.ToString();
                    attr.TotalLostTime = 0.ToString();
                    attr.AvgLostTime = 0.ToString();
                    userAttrList.Add(attr);
                }

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(userAttributes.Site, "Error", "UserHistory", "GetUserHistoryAttributes", sSQL.Replace("'", "''"), 3002, userAttributes.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(userAttrList); 
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetUserProductivitySummary([FromBody]User_Productivity_Summary prodSummary)
        {

            DateTime datetime1 = DateTime.Parse(prodSummary.StartDate);
            prodSummary.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(prodSummary.EndDate);
            prodSummary.EndDate = datetime2.ToString("dd/MM/yyyy");

            string sSQL = "EXEC spUserHistory_ProductivitySummary @Parm='" + prodSummary.StartDate + prodSummary.EndDate + "', @UserID='" + prodSummary.UserID + "'";

            Connection connection = new Connection();

            List<User_Productivity_Summary> userAttrList = new List<User_Productivity_Summary>();
            try
            {
                try
                {
                    Logging.WriteLog(prodSummary.Site, "Info", "UserHistory", "GetUserProductivitySummary", sSQL.Replace("'", "''"), 1002, prodSummary.DCMUser);
                }
                catch (Exception ex) { }

                DataSet ds = connection.ExecuteSelectQuery(sSQL, prodSummary.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    User_Productivity_Summary attr = null;

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        attr = new User_Productivity_Summary();
                        attr.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                        attr.TotalUsers = ds.Tables[0].Rows[i]["TotalUsers"].ToString();
                        attr.UserRank = ds.Tables[0].Rows[i]["UserRank"].ToString();
                        attr.AvgRate = ds.Tables[0].Rows[i]["AvgRate"].ToString();
                        attr.TotalUnits = ds.Tables[0].Rows[i]["TotalUnits"].ToString();
                        attr.TotalHrs = ds.Tables[0].Rows[i]["TotalHrs"].ToString();
                        attr.RateChange = ds.Tables[0].Rows[i]["RateChange"].ToString();
                        attr.RankColor = ds.Tables[0].Rows[i]["RankColor"].ToString();
                        userAttrList.Add(attr);
                    }
                }

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(prodSummary.Site, "Error", "UserHistory", "GetUserProductivitySummary", sSQL.Replace("'", "''"), 3002, prodSummary.DCMUser);
                }
                catch (Exception e) { }
                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(userAttrList);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UserProductivityRates([FromBody] Dashboard_Productivity dash)
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;
            }
            Dashboard_Productivity result = null;

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);

            string sSQL = "select [Date] Dates, [Unit/Hr] UnitsPerHr from ProductivityTable " +
                "where [Date] between CONVERT(date,'"+dash.StartDate+ "',103) and CONVERT(date,'" + dash.EndDate + "',103) " +
                "and UserID = '" + dash.UserId + "' and Activity = '"+ dash.TaskType + "' order by  [Date]";

            Connection connection = new Connection();
            DataSet ds = connection.ExecuteSelectQuery(sSQL, dash.Site);

            List<Dashboard_Productivity> userProds = new List<Dashboard_Productivity>();

            try
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    Dashboard_Productivity prod = new Dashboard_Productivity(); ;

                    List<string> dates = new List<string>();
                    List<Double> unitsPerHr = new List<Double>();

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[0].Rows[i]["Dates"].ToString());
                        dates.Add(dt.ToString("dd MMM"));
                        unitsPerHr.Add(Double.Parse(ds.Tables[0].Rows[i]["UnitsPerHr"].ToString()));
                    }

                    result = new Dashboard_Productivity();
                    result.Dates = dates.ToArray();
                    result.UnitsPerHr = unitsPerHr.ToArray();
                }
            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UserHistory_LostTime([FromBody] LostTimeDashboard lt)
        {

            if (!(string.IsNullOrEmpty(lt.Site)))
            {
                WareHouse.WarehouseSite = lt.Site;
            }

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[lt.Site].ConnectionString);

            string sSQL = "declare @parm as varchar(20)  select @parm = convert(varchar,CONVERT(date,'" + lt.FromDate + "',103),103) + convert(varchar,CONVERT(date,'" + lt.ToDate + "',103),103) EXEC dbo.spUserHistory_LostTime @parm, '" + lt.UserName + "' ";                 

            Connection connection = new Connection();
            DataSet ds = connection.ExecuteSelectQuery(sSQL, lt.Site);

            LostTimeDashboard result = new LostTimeDashboard();
            
            try
            {

                int[] StartLostTime = new int[ds.Tables[0].Rows.Count];
                int[] EndLostTime = new int[ds.Tables[0].Rows.Count];
                int[] ShortBreakLostTime = new int[ds.Tables[0].Rows.Count];
                int[] LongBreakLostTime = new int[ds.Tables[0].Rows.Count];
                string[] Date = new string[ds.Tables[0].Rows.Count];


                List<int[]> data = new List<int[]>();

                if (ds.Tables[0].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        StartLostTime[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["StartLostTime"]);
                        EndLostTime[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["EndLostTime"]);
                        ShortBreakLostTime[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["ShortBreakLostTime"]);
                        LongBreakLostTime[i] = Convert.ToInt32(ds.Tables[0].Rows[i]["LongBreakLostTime"]);
                        Date[i] = ds.Tables[0].Rows[i]["StartDate"].ToString();
                        DateTime datetime3 = DateTime.Parse(Date[i]);
                        Date[i] = datetime3.ToString("dd MMM");


                    }

                }

                result.ShortBreakLostTime = ShortBreakLostTime;
                result.LongBreakLostTime = LongBreakLostTime;
                result.StartLostTime = StartLostTime;
                result.EndLostTime = EndLostTime;
                result.Date = Date;

            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(result);
        }



        //get tabs to generate for graphs from backend
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetTabsforGraphs([FromBody] TabsForGraphs tabs)
        {
            if (!(string.IsNullOrEmpty(tabs.Site)))
            {
                WareHouse.WarehouseSite = tabs.Site;
            }           

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[tabs.Site].ConnectionString);

            string sSQL = ";with a as (" +
                "select distinct Activity, count(*) c from ProductivityTable " +
                "WHERE UserID = '"+ tabs.UserID +"' AND [Date] Between CONVERT(Date,'" + tabs.StartDate + "',103) and CONVERT(Date,'" + tabs.EndDate + "',103) group by Activity " +
                " UNION ALL select DISTINCT 'LostTime', 1 FROM DataWarehouse_LostTime where StartDate between  CONVERT(Date,'" + tabs.StartDate + "',103) and CONVERT(Date,'" + tabs.EndDate + "',103) and UserID = '" + tabs.UserID + "'" +
                ") select case when Activity = 'Picks' then 'Pick Rates' when Activity = 'Putaways' then 'Putaway Rates' when Activity = 'LostTime' Then Activity Else Activity + ' Rates' End Label" +
                " , case when Activity = 'Picks' then 'PickProd' when Activity = 'Putaways' then 'PutawayProd' when Activity = 'LostTime' Then Activity Else Activity + 'Prod' End Comp" +
                " , ROW_NUMBER() OVER(ORDER BY c desc) C from a";

            Connection connection = new Connection();
            DataSet ds = connection.ExecuteSelectQuery(sSQL, tabs.Site);

            List<TabsForGraphs> graphTabs = new List<TabsForGraphs>();

            try
            {

                if (ds.Tables[0].Rows.Count > 0)
                {
                    TabsForGraphs tab = new TabsForGraphs();

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        tab = new TabsForGraphs();
                        tab.Label = ds.Tables[0].Rows[i]["Label"].ToString();
                        tab.Comp = ds.Tables[0].Rows[i]["Comp"].ToString();
                        tab.C = (Int32.Parse(ds.Tables[0].Rows[i]["C"].ToString())-1).ToString(); // -1 because tabs start with 0, row number starts with 1

                        graphTabs.Add(tab);
                    }
                }
            }
            catch (Exception ex)
            {
            }

            return JsonSerializer.Serialize(graphTabs);
        }

    }
}
