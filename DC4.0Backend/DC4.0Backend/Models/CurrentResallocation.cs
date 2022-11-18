using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class CurrentResallocation
    {
        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public string UserID { get; set; }

        public string FullName { get; set; }

        public string StartTime { get; set; }
        public string Task { get; set; }

        public string Location { get; set; }

        public string ActivityType { get; set; }

        public string StartDate { get; set; }

        public string Agency { get; set; }

        public string ShiftCode { get; set; }

        public string TeamManager { get; set; }
        public string Site { get; set; }

        public string DCMUser { get; set; }

    }
}