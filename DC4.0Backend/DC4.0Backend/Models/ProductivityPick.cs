using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class ProductivityPick
    {
        public string UserID { get; set; }
        public string UserRole { get; set; }
        public string RFLogin { get; set; }
        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string Shift { get; set; }

        public string ShiftType { get; set; }
        public string Activity { get; set; }

        public string StartDate { get; set; }

        public string TotalTime { get; set; }
        public string TotalHrs { get; set; }

        public string NoOfOrders { get; set; }
        public string NoOfUnits { get; set; }
        public string NoOfLines { get; set; }
        public string TeamManager { get; set; }

        public double Units_Hr { get; set; }

        public string WH { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }
        
        public string FullName { get; set; }
        public string DCMUser { get; set; }

        public int PalletsHandled { get; set; }
        public int PartPalletHandled { get; set; }

    }

    public class Rework
    {
        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public string Site { get; set; }

        public string StartDate { get; set; }

        public double TaskTime { get; set; }

        public int ToolsBuilt { get; set; }

        public int ComponentsPutTogether { get; set; }

        public double ToolsBuiltPerHr { get; set; }

        public double ComponentsPutTogetherPerHr { get; set; }

    }
    public class ChutePick
    {

        public string Location { get; set; }

        public string NextChute { get; set; }
        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public double PickTime { get; set; }
        public double ChuteChangeTime { get; set; }

        public double CloseCaseTime { get; set; }
        public string UserID { get; set; }

        public string FullName { get; set; }
        public string TeamManager { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string ShiftCode { get; set; }
        public double PickQuantity { get; set; }

        public double OrderNumber { get; set; }
        public double Performance { get; set; }
        public double ActualTime { get; set; }
        public double EstimatedTime { get; set; }
      
        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }

        public string DCMUser { get; set; }

    }




    public class ProductivityPutaway
    {
        public string UserRole { get; set; }
        public string UserID { get; set; }

        public string RFLogin { get; set; }
        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string Shift { get; set; }

        public string ShiftType { get; set; }
        public string Activity { get; set; }

        public string StartDate { get; set; }

        public string TotalTime { get; set; }
        public string TotalHrs { get; set; }

        public string NoOfOrders { get; set; }
        public string NoOfUnits { get; set; }
        public string NoOfPutaway { get; set; }
        public string TeamManager { get; set; }

        public double Units_Hr { get; set; }

        public string WH { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }

        public string FullName { get; set; }

        public string DCMUser { get; set; }

    }

    public class ProductivityMove
    {
        public string UserRole { get; set; }
       
        public string UserID { get; set; }

        public string RFLogin { get; set; }
        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string Shift { get; set; }

        public string ShiftType { get; set; }
        public string Activity { get; set; }

        public string StartDate { get; set; }

        public string TotalTime { get; set; }
        public string TotalHrs { get; set; }

        
        public string NoOfUnits { get; set; }
        public string NoOfMove { get; set; }
        public string TeamManager { get; set; }

        public double Units_Hr { get; set; }

        public string WH { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }

        public string FullName { get; set; }

        public string DCMUser { get; set; }

    }

    public class ProductivityReplishment
    {
        public string UserRole { get; set; }
        public string UserID { get; set; }

        public string RFLogin { get; set; }
        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string Shift { get; set; }

        public string ShiftType { get; set; }
        public string Activity { get; set; }

        public string StartDate { get; set; }

        public string TotalTime { get; set; }
        public string TotalHrs { get; set; }

        public string NoOfReplenishment { get; set; }
        public string NoOfUnits { get; set; }
        public double NoOfLines_Hr { get; set; }
        public string TeamManager { get; set; }

     

        public string WH { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }

        public string FullName { get; set; }

        public string DCMUser { get; set; }

        public string RepType { get; set; }

    }

    public class ProductivityPack
    {
        public string UserID { get; set; }

        public string RFLogin { get; set; }
        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string Shift { get; set; }

        public string ShiftType { get; set; }
        public string Activity { get; set; }

        public string StartDate { get; set; }

        public string TotalTime { get; set; }
        public double TotalHrs { get; set; }

        public int NoOfPack { get; set; }
        public int NoOfUnits { get; set; }
        
        public string TeamManager { get; set; }

        public double Units_Hr { get; set; }

        public string WH { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }

        public string FullName { get; set; }

        public string DCMUser { get; set; }
    }



    public class ProductivityPick_HR //for CCA
    {
        public string UserRole { get; set; }
        public string UserID { get; set; }

        public string RFLogin { get; set; }
        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string Shift { get; set; }

        public string ShiftType { get; set; }
        public string Activity { get; set; }

        public string StartDate { get; set; }

        public string TotalTime { get; set; }
        public string TotalHrs { get; set; }

        public string NoOfOrders { get; set; }
        public string NoOfUnits { get; set; }
        public string NoOfLines { get; set; }
        public string TeamManager { get; set; }

        public double Units_Hr { get; set; }

        public string WH { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }

        public string FullName { get; set; }
        public string DCMUser { get; set; }

    }


    public class TimeActivity 
    {
        public string UserID { get; set; }

        public string RFLogin { get; set; }
        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string Shift { get; set; }

        public string FullName { get; set; }




        public string ShiftType { get; set; }
      
        public string StartDate { get; set; }

        public string TotalTime { get; set; }
        public string TotalHrs { get; set; }

  
        public string Quantity { get; set; }

      

        public string Agency { get; set; }
        
        public string TeamManager { get; set; }

        public string CostPerUnit { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }

     
        public string DCMUser { get; set; }


        public string TotalBilled { get; set; }

        public string SingleTimeActivityCost { get; set; }


        public string TaskType { get; set; }
    }

    public class ProductivityRework
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string StartDate { get; set; }

        public double TaskTime { get; set; }

        public int ToolsBuilt { get; set; }
        public double ComponentsPutTogether { get; set; }

        public double ToolsBuiltPerHr { get; set; }

        public double ComponentsPutTogetherPerHr { get; set; }

    }

}