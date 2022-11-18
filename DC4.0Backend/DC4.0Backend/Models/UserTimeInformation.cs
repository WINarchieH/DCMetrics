using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class UserTimeInformation
    {
        public string UserID { get; set; }

        public string FirstName { get; set; }
        public string Surname { get; set; }

        public string StartDate { get;set; }

        public string EndDate { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public string ShortBreakStart { get; set; }

        public string ShortBreakEnd { get; set; }

        public string ShortBreak { get; set; }

        public string LongBreakStart { get; set; }

        public string LongBreakEnd { get; set; }

        public string LongBreak { get; set; }
        public string OtherBreakStart { get; set; }

        public string OtherBreakEnd { get; set; }

        public string OtherBreak { get; set; }

        public string Allowance { get; set; }

        public string Site { get; set; }

        public string UpdatedBy { get; set; }
        public string DCMUser { get; set; }
    }
}