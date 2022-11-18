using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class PerformancePerOrder
    {
        public string UserID { get; set; }

        public string Employee { get; set; }

        public string StartDate { get; set; }

        public string StartTime { get; set; }
        public string EndDateTime { get; set; }
        

        public string EndTime { get; set; }


        public string Activity { get; set; }

        public string OrderNumber { get; set; }

        public string EstimatedTime { get; set; }



        public string ActualTime { get; set; }
        public string TotalBreak { get; set; }
        public string Quantity { get; set; }

        public string ShiftCode { get; set; }
        public string TeamManager { get; set; }
        public string Agency { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Performance { get; set; }

        public string Site { get; set; }              
        

        public string DCMUser { get; set; }

    }
}