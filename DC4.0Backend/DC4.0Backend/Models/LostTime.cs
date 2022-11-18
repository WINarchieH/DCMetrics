using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class LostTime
    {
        public string UserRole { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string SurName { get; set; }

        public string FullName { get; set; }
        public string ShiftCode { get; set; }

        public string ShiftType { get; set; }
        public string StartDate { get; set; }
        public string Type { get; set; }

        public string ExpectedStart { get; set; }

        public string ActualStart { get; set; }
        public string ActualEnd { get; set; }

        public int StartLostTime { get; set; }

        public string ExpectedEnd { get; set; }

        public int EndLostTime { get; set; }

        public int Tolerance { get; set; }

        public string Site { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public string TeamManager { get; set; }

        public string DCMUser { get; set; }
    }
}