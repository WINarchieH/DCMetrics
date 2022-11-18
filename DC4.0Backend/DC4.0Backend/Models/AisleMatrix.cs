using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class AisleMatrix
    {

        public string Site { get; set; }

        public string Zone { get; set; }

        public string Activity { get; set; }

        public string AisleSequence { get; set; }
        public string Aisle { get; set; }

        public double AisleLength { get; set; }

        public double DockToStartTime { get; set; }

        public double EndToDockTime { get; set; }

        public double TimePerMetre { get; set; }

        public double TimePerStop { get; set; }

        public string DCMUser { get; set; }




    }
}