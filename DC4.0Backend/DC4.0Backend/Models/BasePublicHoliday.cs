using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class BasePublicHoliday
    {

        public string Date { get; set; }

        public string SerialID { get; set; }

        public string Description { get; set; }

        public string HolidayType { get; set; }
        public string DCMUser { get; set; }

        public string Site { get; set; }
    }
}