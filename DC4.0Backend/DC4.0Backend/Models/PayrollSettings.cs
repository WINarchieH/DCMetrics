using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class PayrollSettings
    {
        public string SerialID { get; set; }

        public string Category { get; set; }

        public string Rule { get; set; }

        public string Value { get; set; }

        public string Description { get; set; }
        public string DCMUser { get; set; }
        public string Site { get; set; }

    }

    public class PermanentPayrollSettings
    {
        public string ID { get; set; }

        public string ShiftType { get; set; }

        public string NameOfDay { get; set; }

        public string Weekend { get; set; }

        public string SingleTime { get; set; }

        public string TimeAH { get; set; }

        public string DoubleTime { get; set; }
        public string DoubleTimeAH { get; set; }

        public string HoursBeforeLunch { get; set; }
        public string EmpType { get; set; }
        public string Site { get; set; }
        public string DCMUser { get; set; }

    }

    public class CasualPayrollSettings
    {
        public string ID { get; set; }

        public string ShiftType { get; set; }

        public string NameOfDay { get; set; }

        public string Weekend { get; set; }

        public string SingleTime { get; set; }

        public string TimeAH { get; set; }

        public string DoubleTime { get; set; }
        public string DoubleTimeAH { get; set; }

        public string HoursBeforeLunch { get; set; }
        public string Site { get; set; }

    }
}