using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Summary
    {
        public string Site { get; set; }
        public string FromDate { get; set; }

        public string Todate { get; set; }
    }

    public class UserSummary
    {
        public string Site { get; set; }
        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public string EmployeeID { get; set; }
        public string FirstName { get; set; }

        public string SurName { get; set; }
        public string FullName { get; set; }
        public string TaskName { get; set; }

        public string Date { get; set; }
        public string TaskStart { get; set; }
        public string TaskEnd { get; set; }

        public string Break { get; set; }
        public string Quantity { get; set; }
        public double LostTime { get; set; }

        public string ActualTime { get; set; }
        public string UnitsPerHour { get; set; }
        public string ShiftCode { get; set; }

        public string TeamManager { get; set; }

        public string NoOfLines { get; set; }
    }

    public class UserTaskSummary
    {

        public string Site { get; set; }
        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public string EmployeeID { get; set; }
        public string FirstName { get; set; }

        public string SurName { get; set; }
        public string FullName { get; set; }

        public string StartDate { get; set; }

        public string ShiftCode { get; set; }

        public string TeamManager { get; set; }

        public string ShiftType { get; set; }

        public string ActivityType { get; set; }
        public string TaskName { get; set; }
        public string TaskTime { get; set; }
        public string TotalTasks { get; set; }

    }
}