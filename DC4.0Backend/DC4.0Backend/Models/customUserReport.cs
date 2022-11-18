using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class customUserReport
    {
        public string Site { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string EmployeeID { get; set; }
        public string FirstName { get; set; }
        public string SurName { get; set; }
        public string FullName { get; set; }
        public string Shift { get; set; }
        public string ShiftType { get; set; }

        public string StartDate { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public string StartDateTime { get; set; }

        public string RosterStart { get; set; }
        public string RosterEnd { get; set; }
        public string Diff { get; set; }
        public string AllowOTatStart { get; set; }
    
        public string AllowOTatEnd { get; set; }
        public string DCMUser { get; set; }

    }
}