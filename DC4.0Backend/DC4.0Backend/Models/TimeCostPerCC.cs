using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class TimeCostPerCC
    {
        public string Site { get; set; }
        public string DCMUser { get; set; }
        public string StartDate  { get; set; }
        public string EndDate { get; set; }
        public string CC_Code { get; set; }
        public string Qty { get; set; }
        public string ActualTime { get; set; }
        public string Cost { get; set; }

        public string goodData  { get; set; }
        public string TaskType  { get; set; }
    }
}



