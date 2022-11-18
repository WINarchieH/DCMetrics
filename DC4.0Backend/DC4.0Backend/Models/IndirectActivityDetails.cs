using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class IndirectActivityDetails
    {
        public string SerialID { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }

        public string SurName { get; set; }

        public string TaskName { get; set; }

        public string StartDate { get; set; }

        public string StartTime { get; set;}

        public string EndDate { get; set; }

        public string EndTime { get; set; }

        public double DownTime { get; set; }

        public string TotalTime { get; set; }

        public string Approved { get; set; }

        public string Site { get; set; }

        public string notes { get; set; }

        public string DCMUser { get; set; }
    }

    public class IndirectTaskName
    {
        public string taskName { get; set; }
    }

    public class IndirectActivityReport
    {
        public string UserRole { get; set; }
        public string Site { get;set;}
        public string FromDate { get; set; }
        public string ToDate { get; set; }
       
        public string EmployeeID { get; set; }
        public string FirstName { get; set; }

        public string FullName { get; set; }

        public string SurName { get; set; }

        public string TaskName { get; set; }

        public string StartDate { get; set; }

        public string StartTime { get; set; }

        public string EndDate { get; set; }

        public string EndTime { get; set; }

        public string DownTime { get; set; }

        public string TotalTime { get; set; }

        public string Teammanager { get; set; }
        public string TotalBreak { get;  set; }

        public DateTime StartDateTime { get; set; }

        public DateTime EndDateTime { get; set; }

        public string DCMUser { get; set; }
    }

    public class EmployeeTracking
    {
        public string Site { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string EmployeeID { get; set; }
        public string FirstName { get; set; }

        public string FullName { get; set; }

        public string SurName { get; set; }

        public string TaskType { get; set; }
       
        public string ActualTime { get; set; }

        public string Location { get; set; }
        public string ActivityType { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string DCMUser { get; set; }

    }


    public class Dashboard_TimePerDirect_PerDay
    {
        public string Site { get;  set; }
        public string StartDate { get;  set; }
        public string EndDate { get;  set; }
        public object ClickedCC { get;  set; }
        public string[] Dates { get;  set; }
        public string[] TaskType { get;  set; }
        public double[] IndirectActivityTime { get;  set; }
        public double[] DirectActivityTime { get;  set; }

        public string[] TaskName { get; set; }
    }




    public class Dashboard_TimePerDirects
    {
        public string Site { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public object ClickedCC { get; set; }
        public string[] TaskName { get; set; }
        public double[] TotalHrs { get; set; }
    }

}

