using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class Notification
    {

        public int id { get; set; }
        public string UserID { get; set; }

        public string Module { get; set; }

        public string description { get; set; }
        public string title { get; set; }
        public string Message { get; set; }

        public string Site { get; set; }

        public string insert { get; set; }

        public string container { get; set; }

        public string Type { get; set; }

        public string Avatar { get; set; }

        public string createdAt { get; set; }

        public string URL { get; set; }

        public Boolean IsUnRead { get; set; }


    }
}