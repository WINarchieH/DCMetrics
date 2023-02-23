using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class ScanTimeException
    {
        public string Site { get; set; }
        public string UserRole { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string EmployeeID { get; set; }
      
        public string FullName { get; set; }
        public string TaskType { get; set; }
        public string ShiftType { get; set; }

        public string ShiftCode { get; set; }

        public string StartDate { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public string EndDate { get; set; }

        public int TimeGap { get; set; }
        public int PickQuantity { get; set; }
        public string ProductCode { get; set; }

        public string TeamManager { get; set; }

        public string DCMUser { get; set; }
        public string FromLocation { get; set; }

        public string ToLocation { get; set; }
        
    }
}