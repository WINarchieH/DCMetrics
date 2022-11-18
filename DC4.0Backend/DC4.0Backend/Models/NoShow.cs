using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class NoShow
    {
        public string UserRole { get; set; }
        public string Site { get; set; }
        public string EmployeeID { get; set; }
        public string EmployeeName { get; set; }

        public string FirstName { get; set; }

        public string Surname { get; set; }


        public string TeamManager { get; set; }

        public string Date { get; set; }

        public string Shift { get; set; }

        public string ShiftType { get; set; }

        public string ExpectedStart { get; set; }

        public string ActualStart { get; set; }

        public string Status { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string DCMUser { get; set; }
    }
}