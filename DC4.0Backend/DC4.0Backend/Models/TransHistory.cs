using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class TransHistory
    {
        public string BatchNumber { get; set; }
        public string TaskType { get; set; }

        public string FirstName { get; set; }
        public string Surname { get; set; }

        public string FullName { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }
        public string ActualTime { get; set; }

        public string TotalBreak { get; set; }

        public string ToLocation { get; set; }
        public string OrderNumber { get; set; }

        public string FromLocation { get; set; }

        public string ProductCode { get; set; }

        public string ProductWeight { get; set; }

        public string ProductCube { get; set; }

        public string PickQuantity { get; set; }

        public string AddDate { get; set; }
        public string ProductDescription { get; set; }

        public string FullCase_SplitCase { get; set; }
        public string ID { get; set; }

        public string OperatorID { get; set; }

        public string Comment { get; set; }

        public string UpdatedBy { get; set; }

        public string Site { get; set; }

        public string DCMUser { get; set; }

        public string CrushFactor { get; set; }
        public string TeamManager { get; set; }

        public int PalletsHandled { get; set; }
        public int CasesHandled { get; set; }
        public string RepType { get;  set; }
    }
}