using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Dashboards
    {
    }

    public class Dashboard_Productivity
    {
        public string UserId { get; set; }
        public string TaskType { get; set; }

        public string[] Dates { get; set; }
       
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string name { get; set; }

  

        public int[] Units { get; set; }
        public int[] KPI { get; set; }
        public double[] UnitsPerHr { get; set; }

        public int[] PutawayUnits { get; set; }

        public double[] PutawayPerHr { get; set; }

        public string[] PutawayUnitdates { get; set; }

        public int[] palletshandled { get; set; }

        public int[] caseshandled { get; set; }

        public string[] AllUsers { get; set; }


    }

    public class Asics_Dashboard_PickedUnits
    {

        public string[] Dates { get; set; }
        public string[] singleDaytimes { get; set; }



        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public int[] chutepicks { get; set; }
        public int[] BatchPicks { get; set; }
        public int[] Picks { get; set; }

        public int[] totalunits { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string name { get; set; }



        public int[] Units { get; set; }

        public double[] UnitsPerHr { get; set; }

        public int[] PutawayUnits { get; set; }

        public double[] PutawayPerHr { get; set; }

        public double[] ChutepickProductivity { get; set; }
        public double[] batchpickProductivity { get; set; }
        public double[] pickProductivity { get; set; }

        public string[] BatchPickDates { get; set; }

        public string[] PickDates { get; set; }

        public string[] chutePickDates { get; set; }


    }



    public class CCA_Dashboard_PickedUnits
    {

        public string[] Dates { get; set; }
        public string[] singleDaytimes { get; set; }



        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public int[] normalpicks { get; set; }
        public int[] voicepicks { get; set; }
        public int[] hrpicks  { get; set; }

        public int[] totalunits { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string name { get; set; }



        public int[] Units { get; set; }

        public double[] UnitsPerHr { get; set; }

      

        public double[] normalpickProductivity { get; set; }
        public double[] voicpickProductivity { get; set; }
        public double[] hrProductivity { get; set; }

        public string[] BatchPickDates { get; set; }

        public string[] PickDates { get; set; }

        public string[] chutePickDates { get; set; }


    }
    public class Dashboard_PickedUnits
    {
        public string[] Dates { get; set; }


        
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string name { get; set; }



        public int[] Units { get; set; }

        public double[] UnitsPerHr { get; set; }

        public int[] PutawayUnits { get; set; }

        public double[] PutawayPerHr { get; set; }

        public int[] TotalTimes { get; set; }

        public int[] PickTimes { get; set; }


    }

    public class DashBoard_Putway_split
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }

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

        public double[] pickrates_DC_Weekly_Exp { get; set; }

        public double[] pickrates_DC_Weekly_Trainee { get; set; }

        public int[] pickcases_DC_Weekly_Exp { get; set; }

        public int[] pickcases_DC_Weekly_Trainee { get; set; }

        public double[] pickrates_DC_daily_Exp { get; set; }

        public double[] pickrates_DC_daily_Trainee { get; set; }

        public int[] pickcases_DC_daily_Exp { get; set; }

        public int[] pickcases_DC_daily_Trainee { get; set; }

        public double[] pickrates_DC_Exp { get; set; }

        public double[] pickrates_DC_Trainee { get; set; }

        public double[] pickrates_DC_daily { get; set; }

        public double[] pickrates_DC_Weekly { get; set; }
        
        //Pick Accuracy
        public double[] pickAccuracy_Afternoon_Trainee { get; set; }

        public double[] pickAccuracy_Afternoon_Exp { get; set; }

        public double[] pickAccuracy_Day_Trainee { get; set; }

        public double[] pickAccuracy_Day_Exp { get; set; }

        // TeamManager
        // Roles
        public double[] Manager_JBPutaway { get; set; }

        public int[] Manager_JBUnits { get; set; }

        public double[] Manager_TPPutaway { get; set; }

        public int[] Manager_TPUnits { get; set; }

        public double[] Manager_PtPutaway { get; set; }

        public int[] Manager_PTUnits { get; set; }


        public double[] Manager_FDPutaway { get; set; }

        public int[] Manager_FDUnits { get; set; }

        public int[] lines { get; set; }

        public string[] Names { get; set; }

        public double[] pickrates_Afternoon_Exp { get; set; }
        public double[] pickrates_Afternoon_Traineer { get; set; }
        public double[] pickrates_Day_Exp { get; set; }
        public double[] pickrates_Day_Trainee { get; set; }

        public int[] pickcases_Afternoon_Trainee { get; set; }
        public int[] pickcases_Afternoon_Exp { get; set; }
        public int[] pickcases_Day_Exp { get; set; }
        public int[] pickcases_Day_Trainee { get; set; }

        public int[] pickcases_Day_DC { get; set; }
        public int[] pickcases_afternoon_DC { get; set; }

        public double[] pickrates_Day_DC { get; set; }
        public double[] pickrates_afternoon_DC { get; set; }

        public int[] pickcases_DC { get; set; }
        public int[] weeks { get; set; }

        public int[] pickcases_Trainee_afternoon_Weekly { get; set; }

        public int[] pickcases_Trainee_Day_Weekly { get; set; }


        public int[] pickcases_Exp_afternoon_Weekly { get; set; }

        public int[] pickcases_Exp_Day_Weekly { get; set; }

        public int[] Reworks_afternoon_Weekly { get; set; }

        public int[] Reworks_afternoon_Daily { get; set; }

        public int[] Reworks_Day_Weekly { get; set; }

        public int[] Reworks_Day_Daily { get; set; }


    }


    public class Dashboard_PutawayUnits
    {
        public string[] Dates { get; set; }
   
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string name { get; set; }

      
        public int[] Units { get; set; }

        public double[] PutawayPerHr { get; set; }

    }

    public class Dashboard_MoveUnits
    {
        public string[] Dates { get; set; }

        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string name { get; set; }


        public int[] Units { get; set; }

        public double[] MovePerHr { get; set; }

    }


    public class Dashboard_RepUnits
    {
        public string[] Dates { get; set; }

        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string name { get; set; }


        public int[] Units { get; set; }

        public double[] RepPerHr { get; set; }

    }

    public class Dashboard_PackUnits
    {
        public string[] Dates { get; set; }

        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string name { get; set; }


        public int[] Units { get; set; }

        public double[] PackPerHr { get; set; }

    }

    public class Dashboard_CycleCounts
    {
        public string[] Dates { get; set; }

        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }


        public int[] TotalCounts { get; set; }

        public double[] CountsPerHr { get; set; }

    }


    public class Dashboard_TimePerIndirects
    {
        public string[] CostCentre { get; set; }

        public string[] TaskName { get; set; }

        public double[] TotalHrs { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string ClickedCC { get; set; }
        public string Site { get; set; }
        public string DCMUser { get; set; }
    }


    public class Dashboard_ShippedUnits //RPF
    {
        public string[] Dates { get; set; }

        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public int[] Units { get; set; }
        public int[] Pallets { get; set; }
        public int[] PartPallets { get; set; }
    }

    public class Dashboard_PalletPicks //CCA
    {
        public string[] Dates { get; set; }

        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public int[] TotalPicks { get; set; }
        public string DCMUser { get; set; }

        public int[] PalletPicks { get; set; }

        public string Site { get; set; }
    }


    public class Dashboard_barchartDataset //CCA
    {
        public double[] data { get; set; }

        public string name { get; set; }

    }

    public class Barchartdata
    {

        public List<Dashboard_barchartDataset> Dataset { get; set; }

        public string[] Labels { get; set; }

        public string Site { get; set; }

      

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string Role { get; set; }
    }

    public class Dash_Pick_Lines
    {

       

        public string Site { get; set; }
        public string Role { get; set; }

        public string[] DayShift_users { get; set; }

        public int[] DayShift_lines { get; set; }
        public int[] DayShift_KPI { get; set; }

        public string[] AfternoonShift_users { get; set; }

        public int[] AfternoonShift_lines { get; set; }

        public int[] AfternoonShift_KPI { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string FullName { get; set; }
    }
}