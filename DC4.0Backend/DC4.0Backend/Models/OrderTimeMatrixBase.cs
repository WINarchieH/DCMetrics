using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class OrderTimeMatrixBase
    {

        public string Zone { get; set; }

        public double TimePerContainer { get; set; }

        public double TimePerOrder { get; set; }

        public string Activity { get; set; }

        public string Site { get; set; }

        public double PFDTime { get; set; }

        public int ItemPerContainer { get; set; }

        public string SerialID { get; set; }
        public string DCMUser { get; set; }
    }
}