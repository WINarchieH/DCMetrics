using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class TeamManager
    {

        public string SerialID { get; set; }

        public string ManagerName { get; set; }

        public string Position { get; set; }
        public string Site { get; set; }
        public string DCMUser { get; set; }
    }

    public class Reasons
    {

      

        public string Reason { get; set; }
        public string Site { get; set; }
        public string DCMUser { get; set; }
    }



    public class EmailNotification
    {

        public string SerialID { get; set; }

        public string NotificationType { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string DCMUser { get; set; }
        public string Site { get; set; }
    }

}