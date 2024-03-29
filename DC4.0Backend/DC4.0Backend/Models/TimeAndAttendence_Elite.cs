﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class TimeAndAttendence_Elite
    {
        public string UserID { get; set; }
        public string FirstName { get; set; }

        public string SurName { get; set; }

        public string ShiftCode { get; set; }

        public string StartDate { get; set; }

        public string StartTime { get; set;}

        public string EndDate { get; set; }

        public string EndTime { get; set; }

        public string ShiftStart { get; set; }

        public string ShiftEnd { get; set; }

        public string Approved { get; set; }
        
        public string ReasonForUpdate { get; set; }

        public string TH { get; set; }

        public string DBL { get; set; }

        public string UpdateBy { get; set; }

        public string ID { get; set; }

        public string OTException { get; set; }
        public string TotalHrs { get; set; }

        public string OTAtStart { get; set; }

        public string OTAtEnd { get; set; }

        public string Site { get; set; }

        public string MealAllowance { get; set; }


    }

}