using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class PayrollExport
    {
        public string FromDate { get; set; }
        public string Agency { get; set; }
       public string ToDate { get; set; }
        public string Site { get; set; }
        public string EmployeeID { get; set; }

        public string UserID { get; set; }

        public string Surname { get; set; }

        public string Day { get; set; }
        public string Date { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }

        public string TotalHours{ get; set; }

        public string Reason { get; set; }

        public string ShiftStart { get; set; }

        public string ShiftEnd { get; set; }

        public string PayrollCategory { get; set; }

        public string Mealallowance { get; set; }

        public string ShiftCode { get; set; }


        public string TeamManager { get; set; }
        public string DCMUser { get; set; }
    }



    public class AgencyPayrollExport
    {
        public string FromDate { get; set; }

        public string ToDate { get; set; }
        public string Site { get; set; }
        public string EmployeeID { get; set; }

        public string UserID { get; set; }

        public string Surname { get; set; }

        public string Day { get; set; }
        public string Date { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }

        public string TotalHours { get; set; }

        public string Reason { get; set; }

        public string ShiftStart { get; set; }

        public string ShiftEnd { get; set; }

        public string PayrollCategory { get; set; }

        public string Mealallowance { get; set; }

        public string ShiftCode { get; set; }


        public string TeamManager { get; set; }
        public string DCMUser { get; set; }
    }
    public class CasualReverseBilling
    {
        public string FromDate { get; set; }

        public string ToDate { get; set; }
        public string Site { get; set; }
        public string UserID { get; set; }

        public string Firstname { get; set; }
        public string Surname { get; set; }

        public string FullName { get; set; }

        public string Level { get; set; }

        public string Agency { get; set; }

        public string TotalTime { get; set; }

        public string SingleTime { get; set; }

        public double TotalSingleAmount { get; set; }

        public string TimeAndHalf { get; set; }

        public double TotalTimeAndHalfAmount { get; set; }
        public string Date { get; set; }
        public string DoubleTime { get; set; }
        public double TotalDoubleTimeAmount { get; set; }

        public string MealTime { get; set; }

        public double MealAllowance { get; set; }

        public double ForkLiftAllowance { get; set; }

        public double TeaMoney { get; set; }

        public double GST { get; set; }

        public double FirstAidAllowance { get; set; }

        public double SatBalance { get; set; }

     

        public string Shift { get; set; }

        public string TeamManager { get; set; }

        public double TotalPay { get; set; }
    }
}