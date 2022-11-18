using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Timesheet
    {
        public string TeamManager { get; set; }
       public string LogOnTime { get; set; }
        public string UserID { get; set; }

        public string FirstName { get; set; }

        public string Surname { get; set; }
        public string FullName { get; set; }
        public string EmployeeID { get; set; }
        public string ShiftCode { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public double HoursBeforeLunch { get; set; }
        public double TotalHours { get; set; }
        public double SingleTime { get; set; }
        public double TimeAndHalfHrs { get; set; }
        public double DoubleTime { get; set; }
        public double DoubleTimeAndHalf { get; set; }
        public double MealTime { get; set; }
        public string Comment { get; set; }
        public string Agency { get; set; }
        public string Level { get; set; }
        public string Site { get; set; }

        public string AllowOTATEnd { get; set; }
        public string AllowOTATStart { get; set; }

        public string Overtime_1_4x { get; set; }
        public string Overtime_1_8x { get; set; }
        public string DCMUser { get; set; }

        public string BaseHourly { get; set; }

        

    }
   
}