using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Graph
    {
        public string Site { get; set; }
        public string DCMUser { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string Date { get; set; }
        public string BatchPick { get; set; }

        public string ChutePick { get; set; }
        public string Pick { get; set; }

    }
}