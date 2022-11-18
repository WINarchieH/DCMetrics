using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DC4._0Backend.Models;

namespace DC4._0Backend.Controllers
{
    public class Logging
    {
        public static void WriteLog(string Site, string LogType, string Source, string Function, string Script, int MID, string DCMUser)
        {
            try
            {
                Connection connection = new Connection();
                string result = string.Empty;
                string sSQL = String.Empty;
                sSQL = "INSERT INTO UILogs (LogType,Source,[Function],Script,MID,Message,DCMUser) VALUES ('" + LogType + "','" + Source + "','" + Function + "','" + Script + "', " + MID + ", (SELECT Message FROM UILogsMessages WHERE MID = " + MID + "),'" + DCMUser + "')";
                connection.ReturnSingleValue(sSQL, Site);
            }
            catch (Exception ex)
            {

            }
            

        }
    }
}