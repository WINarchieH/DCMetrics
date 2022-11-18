using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class DailyScanReport
    {

        public string FullName { get; set; }
        public string UserID { get; set; }
        public string FirstName { get; set; }

        public string SurName { get; set; }

        public string ScannedTask { get; set; }
        public string ScannedType  { get; set; }

        public string StartDate { get; set; }

        public string StartTime { get; set; }

        public string EndDate { get; set; }

        public string EndTime { get; set; }

        public string ShiftCode { get; set; }

        public string TeamManager { get; set; }

        public string Duration { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public string Site { get; set; }

        public string DCMUser { get; set; }

    }
}