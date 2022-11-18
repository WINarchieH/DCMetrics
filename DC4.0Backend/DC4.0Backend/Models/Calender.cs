using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Calender
    {
        public string Site { get; set; }
        public string EmployeeID { get; set; }
        public string EmployeeName { get; set; }
        public string TeamManager { get; set; }

        public string Date { get; set; }

        public string Shift { get; set; }

        public string ShiftType { get; set; }

        public string LeaveType { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string DCMUser { get; set; }

    }


    public class CalenderEvent
    {
        public string Site { get; set; }
        public string id { get; set; }
        public string start { get; set; }
        public string title { get; set; }
        public string end { get; set; }
        public string addedBy { get; set; }
        public string DCMUser { get; set; }
        public string pdf { get; set; }

    }



}