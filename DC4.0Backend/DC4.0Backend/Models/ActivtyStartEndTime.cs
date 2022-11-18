using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class ActivtyStartEndTime
    {
        public string Activity { get; set; }

        public string Zone { get; set; }

        public double StartEndTime { get; set; }

        public string Site { get; set; }

        public string DCMUser { get; set; }
    }
}