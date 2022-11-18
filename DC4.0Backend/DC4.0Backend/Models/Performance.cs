using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Performance
    {
        public string UserID { get; set; }

        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string ShiftCode { get; set; }

        public string Shift { get; set; }

        public string Activity { get; set; }

        public string StartDate { get; set; }

        public string StartTime { get; set; }

        public string EndDateTime { get; set; }
        public string EndTime { get; set; }

        public string TotalEstimatedTime { get; set; }
        public string TotalActualTime { get; set; }
        public string PerformancePercantage { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }
        public string Agency { get; set; }
        public string FullName { get; set; }
        public string TeamManager { get; set; }

        public string DCMUser { get; set; }

    }
}