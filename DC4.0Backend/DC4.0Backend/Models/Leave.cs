using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Leave
    {
        public string SerialID { get; set; }
        public string LeaveCode { get; set; }
        public string LeaveDesc { get; set; }
        public string Paid { get; set; }
        public string EmpType { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }
        public string CurrentLeaveCode { get; set; }

        public string LeaveColor { get; set; }

    }

    public class Activity
    {
        public string ActivityName { get; set; }
        public string DCMUser { get; set; }
        public string Site { get; set; }


    }

    public class Zone
    {
        public string ZoneNumber { get; set; }
        public string DCMUser  { get; set; }

        public string Site { get; set; }
    }

    public class CostCenters
    {
         public string DeleteActivity { get; set; }
        public string CostCenter { get; set; }

        public string Site { get; set; }

        public string ActivityName { get; set; }

        public string ActivityType { get; set; }

        public string NewCostCenter { get; set; }
        public string assignedActivityCostCenter { get; set; }
        public string DCMUser { get; set; }

    }

    public class DirectActivity
    {

        public string DeleteActivity { get; set; }
        public string Site { get; set; }

        public string Activity { get; set; }

        public string ActivityType { get; set; }
        public string DCMUser { get; set; }
        public string ActivityGroup { get; set; }

    }
}