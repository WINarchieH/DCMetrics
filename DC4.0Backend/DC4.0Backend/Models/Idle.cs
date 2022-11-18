using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Idle
    {
        public string Site { get; set; }
        public string EmployeeID { get; set; }
        public string EmployeeName { get; set; }
        public string TeamManager { get; set; }

        public string Date { get; set; }

        public string ShiftCode { get; set; }

        public string LogOnTime { get; set; }

        public string FirstTask { get; set; }

        public string TaskStart { get; set; }

        public string TaskEnd { get; set; }
        public string Status { get; set; }
        public string TimeGap { get; set; }

        public string DCMUser { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }


    public class TimeBetweenOrders
    {
        public string DCMUser { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }

        public string OperatorID { get; set; }
        public string FullName { get; set; }

        public   Int32 OrderNumber { get; set; }

        public string LastPickOrderTime { get; set; }

        public string NextRFScanTime { get; set; }

        public double timebetweenOrders { get; set; }

         public string TeamManager { get; set; }


        public string OrderType { get; set; }

        public string Date { get; set; }

    }

    public class Tardiness
    {
        public string DCMUser { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string ShiftCode { get; set; }


        public string Site { get; set; }

        public string UserID { get; set; }
        public string FullName { get; set; }

      
        public string ScanType { get; set; }
        //start
        public string ActualStart { get; set; }

        public string ExpectedStart { get; set; }

      //end
        public string ActualEnd { get; set; }

        public string ExpectedEnd { get; set; }
        //lost time

        public int StartLostTime { get; set; }

        public int EndLostTime { get; set; }

        public int totalLosttime { get; set; }

        //Tolerance

        public int StartTolerance { get; set; }

        public int EndTolerance { get; set; }

        public int totalTolerance { get; set; }
        public string TeamManager { get; set; }


        public string Comment { get; set; }

        public string StartDate { get; set; }


    }
}