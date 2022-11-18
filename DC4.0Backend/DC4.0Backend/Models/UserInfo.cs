using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class UserInfo
    {
        public string UserID { get; set; }
        public string Surname { get; set; }
        public string FirstName { get; set; }
        public string Sex { get; set; }
        public string DateJoining { get; set; }
        public string DateLeaving { get; set; }
        public string ShiftCode { get; set; }
        public string TeamManager { get; set; }
        public string EmployeeID { get; set; }
        public string EmployeeCategory { get; set; }
        public string Status { get; set; }
        public string Agency { get; set; }

        public string FirstAid { get; set; }
        public string Level { get; set; }

        public string Role { get; set; }

        public string PartTime { get; set; }

        public string DeptCode { get; set; }
        public string Site { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string TabletID { get; set; }
        public string DCMUser { get; set; }

        public string PayBundyTime { get; set; }
        public string Grade { get; set; }
        public string IsManager { get; set; }
        public string PayCode { get; set; }
    }



    public class UserDiary
    {
        public string Site { get; set; }
        public string DCMUser { get; set; }
        public string UserID { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string FullName { get; set; }
        public string NoteType { get; set; }
        public string Note { get; set; }
        public string IncidentDate { get; set; }
        public string UpdatedBy { get; set; }
        public string SerialID { get; set; }
    }



    public class OnboardingChecklist
    {
        public string Site { get; set; }
        public string DCMUser { get; set; }
        public string UserID { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string ChecklistNumber { get; set; }
        public string Checklist { get; set; }
        public string IsTicked { get; set; }
        public string IsActive { get; set; }
    }

    public class Skills
    {
        public string Site { get; set; }
        public string DCMUser { get; set; }
        public string UserID { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Skill { get; set; }
    }


    public class CertificationsExpiry
    {
        public string Site { get; set; }
        public string DCMUser { get; set; }
        public string UserID { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Certificate { get; set; }
        public string File { get; set; }
        public string Expiry { get; set; }
        public string ImageUploaded { get; set; }
    }
    


    public class ShiftCode
    {
        public string shiftcode { get; set; }
    }

    public class Agency
    {
        public string SerialID { get; set; }
        public string AgencyName { get; set; }

        public string AgencyCode { get; set; }

        public string AgencyClose { get; set; }

        public string Shift { get; set; }
        //1
        public double LevelOneSingleTime { get; set; }

        public double LevelOneTimeAndHalf { get; set; }

        public double LevelOneDoubleTime { get; set; }

        public double LevelOneDoubleTimeAndHalf { get; set; }

        //2
        public double LevelTwoSingleTime { get; set; }

        public double LevelTwoTimeAndHalf { get; set; }

        public double LevelTwoDoubleTime { get; set; }

        public double LevelTwoDoubleTimeAndHalf { get; set; }

        //3
        public double LevelThreeSingleTime { get; set; }

        public double LevelThreeTimeAndHalf { get; set; }

        public double LevelThreeDoubleTime { get; set; }

        public double LevelThreeDoubleTimeAndHalf { get; set; }

        //4
        public double LevelFourSingleTime { get; set; }

        public double LevelFourTimeAndHalf { get; set; }

        public double LevelFourDoubleTime { get; set; }

        public double LevelFourDoubleTimeAndHalf { get; set; }
        //5

        public double LevelFiveSingleTime { get; set; }

        public double LevelFiveTimeAndHalf { get; set; }

        public double LevelFiveDoubleTime { get; set; }

        public double LevelFiveDoubleTimeAndHalf { get; set; }

        //7

        public double LevelSevenSingleTime { get; set; }

        public double LevelSevenTimeAndHalf { get; set; }

        public double LevelSevenDoubleTime { get; set; }

        public double LevelSevenDoubleTimeAndHalf { get; set; }

        //6

        public double LevelSixSingleTime { get; set; }

        public double LevelSixTimeAndHalf { get; set; }

        public double LevelSixDoubleTime { get; set; }

        public double LevelSixDoubleTimeAndHalf { get; set; }

        //8

        public double LevelEightSingleTime { get; set; }

        public double LevelEightTimeAndHalf { get; set; }

        public double LevelEightDoubleTime { get; set; }

        public double LevelEightDoubleTimeAndHalf { get; set; }


        // Other Expenses
        public double TeaMoney { get; set; }

        public double ForkLiftAllowance { get; set; }

        public double FirstAidAllowance { get; set; }
        public double GST { get; set; }

        public double AwardHours { get; set; }

        public string Site { get; set; }

        public string DCMUser { get; set; }
    }

    public class UserRole
    {
        public string Role { get; set; }
    }

    public class IndirectActivity
    {
        public string Activity { get; set; }
        public string User { get; set; }
        public string CostCenter { get; set; }

        public string Site { get; set; }
    }

    public class Usergroup
    {
        public string UserGroup { get; set; }
        public string GroupName { get; set; }

        public string ScreenName { get; set; }

        public string Site { get; set; }
    }

    public class PFDMatrix
    {
        public string Activity { get; set; }

        public double PFDAllowance { get; set; }

        public string Site { get; set; }

        public string DCMUser { get; set; }

    }



}