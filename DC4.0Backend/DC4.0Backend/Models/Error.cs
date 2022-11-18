using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace DC4._0Backend.Models
{
  

        public class Errors
        {
            public string ShiftCode { get; set; }

            public string FirstName { get; set; }

            public string SurName { get; set; }

            public string SerialID { get; set; }
            public string PickerID { get; set; }

            public string License { get; set; }

            public string StartDate { get; set; }

            public string SKU { get; set; }

            public string EndDate { get; set; }

            public string PickLocation { get; set; }

            public int PickVar { get; set; }

            public string Error { get; set; }

            public string Action { get; set; }

            public string QAChecked { get; set; }

            public int Week { get; set; }

            public int PickVarCases { get; set; }

            public string Site { get; set; }
            public string DCMUser { get; set; }

        }
    }
