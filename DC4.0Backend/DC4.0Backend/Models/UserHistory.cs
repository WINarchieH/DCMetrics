using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class UserHistory_Snackbar_Attributes 
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string UserID { get; set; }
        public string NumOfHRIncidents { get; set; }
        public string NumOfDaysLoggedOnLate { get; set; }
        public string TotalDays { get; set; }
        public string NumOfLeaves { get; set; }
        public string TotalLostTime { get; set; }
        public string AvgLostTime { get; set; }

        public string IncidentsDiff { get; set; }
        public string LoggedOnLateDiff { get; set; }
        public string LeavesDiff { get; set; }
        public string AvgLostTimeDiff { get; set; }


        public string Site { get; set; }
        public string DCMUser { get; set; }
    }

    public class User_Productivity_Summary 
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string UserID { get; set; }
        public string Activity { get; set; }
        public string TotalUsers { get; set; }
        public string UserRank { get; set; }
        public string AvgRate { get; set; }
        public string TotalUnits { get; set; }
        public string TotalHrs { get; set; }
        public string RateChange { get; set; }
        public string RankColor { get; set; }


        public string Site { get; set; }
        public string DCMUser { get; set; }
    }

    public class TabsForGraphs
    {
        public string UserID { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Label { get; set; }
        public string Comp { get; set; }
        public string C { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }
    }

}