using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class FeedBack
    {

        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Description { get; set; }

        public string Module { get; set; }
    }

    public class Email
    {
        public string EmailAddress { get; set; }

        public string ScheduledTime { get; set; }

        public string DCMUserName { get; set; }

        public string ReportName { get; set; }

        public string Format { get; set; }

        public string Active { get; set; }

        public string Site { get; set; }

        public string SerialID { get; set; }
    }
}