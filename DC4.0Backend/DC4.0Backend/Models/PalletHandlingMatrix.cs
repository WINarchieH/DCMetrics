using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class PalletHandlingMatrix
    {
        public string Site { get; set; }

        public int MovableUnits { get; set; }

        public string Activity { get; set; }

        public string UnitType { get; set; }

        public double TimePerUnit { get; set; }

        public string DCMUser { get; set; }

    }
}