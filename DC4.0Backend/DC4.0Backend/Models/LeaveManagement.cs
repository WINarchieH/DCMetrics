using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class LeaveManagement
    {

        public string SerialID { get; set; }
        public string UserID { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Date { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string LeaveType { get; set; }
        public string LeaveStatus { get; set; }

        public string leaveCode { get; set; }
        public string CheckedBy { get; set; }
        public string CommentBy { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public string Site { get; set; }

        public string ApproveID { get; set; }

        public string RejectID { get; set; }

        public string UpdatedBy { get; set; }

        public string TeamManager { get; set; }

        public string Title { get; set; }

        public string DCMUser { get; set; }
        public string LeaveColor { get; set; }

    }

    public class AssignLeave
    {
        public string UpdateBy { get; set; }
        public string Site { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        public DateTime LeaveStartDate { get; set; }
        public DateTime LeaveEndDate { get; set; }

        public DateTime EffectiveDate { get; set; }
        public DateTime IneffectiveDate { get; set; }

        public string StartTime { get; set; }
        public string EndTime { get; set; }

        public string LeaveCode { get; set; }

        public string LeaveDesc { get; set; }

        public string LessThanOneDay { get; set; }

        public string UserID { get; set; }
        public string DCMUser { get; set; }
        public string EmployeeCategory { get; set; }

    }
}