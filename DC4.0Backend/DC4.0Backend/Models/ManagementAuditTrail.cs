using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class ManagementAuditTrail
    {
        public string Site { get; set; }

        public string UserRole { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string EmployeeID { get; set; }
        public string FirstName { get; set; }
        public string SurName { get; set; }
        public string FullName { get; set; }
        public string Shift { get; set; }
        public string ShiftType { get; set; }

        public string TeamManager { get; set; }
        public DateTime StartDateTime { get; set; }

        public DateTime EditDateTime { get; set; }

        public string StartDate { get; set; }

        public string StartTime { get; set; }

        public string EndDate { get; set; }

        public string EndTime { get; set; }

        public string Before_After { get; set; }

        public string EditDate { get; set; }
        public string EditTime { get; set; }

        public string UpdateBy { get; set; }
        public string Module { get; set; }

        public string Comment { get; set; }

        public string AllowOTAtStart { get; set; }

        public string AllowOTAtEnd { get; set; }

        public string AfternoonAllowance { get; set; }

        public string MealBreak { get; set; }

        public string OvertimeException { get; set; }
    }
}