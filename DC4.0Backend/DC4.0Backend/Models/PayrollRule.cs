using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class PayrollRule
    {
        public string SerialID { get; set; }

        public string Category { get; set; }

        public string Rule { get; set; }

        public string Value { get; set; }

        public string Description { get; set; }

            public string Site { get; set; }

        public string DCMUser { get; set; }

    }

    public class PayrollCode
    {
        public string SerialID { get; set; }

        public string Category { get; set; }

        public string Code { get; set; }

        public string UDF1 { get; set; }

        public string Description { get; set; }

        public string UDF2 { get; set; }

        public string Site { get; set; }

        public string DCMUser { get; set; }

    }
}