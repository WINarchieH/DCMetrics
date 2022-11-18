using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class LostTimeDashboard
    {


            public int[] StartLostTime { get; set; }
            public int[] EndLostTime { get; set; }
            public int[] LongBreakLostTime { get; set; }

            public int[] ShortBreakLostTime { get; set; }

            public string FromDate { get; set; }

            public string ToDate { get; set; }

            public string[] Date { get; set; }

            public string Site { get; set; }

            public string DCMUser { get; set; }
        public string UserName { get; set; }
        public string[] UserID { get; set; }
            public int[] TotalLostTime { get; set; }
        

    }


    public class DashBoard_LostTime_split
    {
        public int[] Manager_FDUnits { get; set; }
        public int[] Manager_JBUnits { get; set; }
        public int[] Manager_TPUnits { get; set; }

        public int[] Manager_PTUnits { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Site { get; set; }
        public string DCMUser { get; set; }
        public string[] dates_Roles { get; set; }
        public string[] dates_Shift { get; set; }
        public string[] dates_Manager { get; set; }
        // Roles
        public double[] ForkliftDriverPutaway { get; set; }
        public int[] ForkliftDriverUnits { get; set; }
        public double[] Role_PickerPutaway { get; set; }
        public int[] Role_PickerUnits { get; set; }
        public int[] Role_cleaner { get; set; }
        public double[] Role_ReworkPutaway { get; set; }
        public int[] Role_ReworkUnits { get; set; }
        public double[] Role_HRDriverPutaway { get; set; }
        public int[] Role_HRDriverUnits { get; set; }
        //Shifts
        public double[] Shift_AO00Putaway { get; set; }
        public int[] shift_AO00Units { get; set; }
        public int[] shift_DT00Units { get; set; }
        public double[] shift_DT00Putaway { get; set; }
        public double[] Shift_DS00Putaway { get; set; }
        public int[] shift_DS00Units { get; set; }
        public double[] Shift_DO00Putaway { get; set; }
        public int[] shift_DO00Units { get; set; }
        public double[] Shift_AS00Putaway { get; set; }
        public int[] shift_AS00Units { get; set; }
        public double[] Shift_DS07Putaway { get; set; }
        public int[] shift_DS07Units { get; set; }
        public double[] Shift_AT00Putaway { get; set; }
        public int[] shift_AT00Units { get; set; }
    }
    public class graphdata
    {
        public string[] dates { get; set; }

        public List<int[]> values { get; set; }
    }
}