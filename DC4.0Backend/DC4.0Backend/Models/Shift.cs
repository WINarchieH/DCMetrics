using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Shift
    {
        public string ShiftCode { get; set; }
        public string MondayClockIn { get; set; }
        public string MondayClockOut { get; set; }
        public string TuesdayClockIn { get; set; }
        public string TuesdayClockOut { get; set; }
        public string WednesdayClockIn { get; set; }
        public string WednesdayClockOut { get; set; }
        public string ThursdayClockIn { get; set; }

        public string ThursdayClockOut { get; set; }

        public string FridayClockIn { get; set; }

        public string FridayClockOut { get; set; }

        public string SaturdayClockIn { get; set; }

        public string SaturdayClockOut { get; set; }

        public string SundayClockIn { get; set; }

        public string SundayClockOut { get; set; }

        public double ShortBreak { get; set; }

        public double LongBreak { get; set; }

        public double OtherBreak { get; set; }

        public string ShortBreakStart { get; set; }

        public string ShortBreakEnd { get; set; }

        public string LongBreakStart { get; set; }

        public string LongBreakEnd { get; set; }

        public string OtherBreakStart { get; set; }

        public string OtherBreakEnd { get; set; }

        public double StartTolerance { get; set; }

        public double EndTolerance { get; set; }

        public double BreakTolerance { get; set; }

        public string ShiftType { get; set; }

        public double StartOverTime { get; set; }

        public double EndOvertTime { get; set; }

        public string WeekStart { get; set; }

        public double WeekendHours { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }


    }
}