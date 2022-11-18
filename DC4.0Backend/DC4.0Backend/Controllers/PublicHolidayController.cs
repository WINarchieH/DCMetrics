using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Web.Http;
using DC4._0Backend.Models;

namespace DC4._0Backend.Controllers
{
    public class PublicHolidayController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllPublicHolidays([FromBody] BasePublicHoliday ph)
        {

            string sSQL = String.Empty;

            sSQL = "Select SerialID, REPLACE(CONVERT(varchar, Date, 103),' ',' / ')  as 'Date',Description,HolidayType From PublicHoliday Order by Convert(Date, Date,103) asc";

            Connection connection = new Connection();

            List<BasePublicHoliday> entryList = new List<BasePublicHoliday>();
            try
            {
                try
                {
                    Logging.WriteLog(ph.Site, "Info", "PublicHoliday", "GetAllPublicHolidays", sSQL.Replace("'", "''"), 1002, ph.DCMUser);
                }
                catch (Exception ex) { }

                DataSet ds = connection.ExecuteSelectQuery(sSQL, ph.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {


                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        BasePublicHoliday obj = new BasePublicHoliday();
                        obj.SerialID = ds.Tables[0].Rows[i]["SerialID"].ToString();
                        obj.Date = ds.Tables[0].Rows[i]["Date"].ToString();
                        obj.Description = ds.Tables[0].Rows[i]["Description"].ToString();
                        obj.HolidayType = ds.Tables[0].Rows[i]["HolidayType"].ToString();

                        entryList.Add(obj);

                    }

                }
            }
            catch (Exception ex)
            {
                return "Error Occured:While Fetching the Public Holiday List";
            }


            return JsonSerializer.Serialize(entryList);

        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string InsertNewPublicHoliday([FromBody] BasePublicHoliday ph)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
          
            try
            {
              
               
                    sSQL = " SELECT count(*) FROM PublicHoliday where Date =  convert(DateTime,'" +ph.Date + "',103) ";
                   int  count= int.Parse(conn.ReturnSingleValue(sSQL, ph.Site));
                    if (count > 0)
                    {
                        try
                        {
                            Logging.WriteLog(ph.Site, "Warning", "PublicHoliday", "GetAllPublicHolidays", sSQL.Replace("'", "''"), 2008, ph.DCMUser);
                        }
                        catch (Exception ex) { }

                        return "Dulpicate Record Found";
                    }
                    else
                    {
                        sSQL = "Insert Into PublicHoliday(Date,Description,HolidayType) Values( Convert(DateTime,'" +ph.Date+ "',103) , '" +ph.Description+ "',  'PH')";
                        try
                        {
                            Logging.WriteLog(ph.Site, "Info", "PublicHoliday", "GetAllPublicHolidays", sSQL.Replace("'", "''"), 1001, ph.DCMUser);
                        }
                        catch (Exception ex) { }

                        string result = conn.ExecuteInsertQuery(sSQL, ph.Site);
                        if (result != "Insert SuccessFull")
                        {
                            try
                            {
                                Logging.WriteLog(ph.Site, "Error", "PublicHoliday", "GetAllPublicHolidays", sSQL.Replace("'", "''"), 3001, ph.DCMUser);
                            }
                            catch (Exception ex) { }

                            return "Error Occured while inserting the Public Holiday";
                        }
                    }
                
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(ph.Site, "Error", "PublicHoliday", "GetAllPublicHolidays", sSQL.Replace("'", "''"), 3001, ph.DCMUser);
                }
                catch (Exception ee ) { }

                return "Error Occured while inserting the Public Holiday";
            }

            return "Public Holiday Inserted";

        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string UpdatePublicHoliday([FromBody] BasePublicHoliday ph)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();

            sSQL = "Select count(*) from PublicHoliday "
          + " Where Date = convert(DateTime,'" +ph.Date+ "',103) "
          + "And SerialID = '" + ph.SerialID+ "' "
            + "And Description=  '" + ph.Description + "' ";

            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, ph.Site));

                if (count > 0)
                {
                    return "No Changes have been made";
                }

            
                    sSQL = " Update PublicHoliday set Date = Convert(DateTime,'" + ph.Date + "',103), Description = '"+ph.Description+"',HolidayType ='"+ph.HolidayType+"' where SerialID = '" + ph.SerialID +"' ";
                    try
                    {
                        Logging.WriteLog(ph.Site, "Info", "PublicHoliday", "UpdatePublicHoliday", sSQL.Replace("'", "''"), 1003, ph.DCMUser);
                    }
                    catch (Exception ex) { }

                    string result = conn.ExecuteUpdateQuery(sSQL, ph.Site);

                    if (result != "Update SuccessFull")
                    {
                        try
                        {
                            Logging.WriteLog(ph.Site, "Error", "PublicHoliday", "UpdatePublicHoliday", sSQL.Replace("'", "''"), 3003, ph.DCMUser);
                        }
                        catch (Exception ex) { }

                        return "Error Occured while Updating the Public Holiday";
                    }
                
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(ph.Site, "Error", "PublicHoliday", "UpdatePublicHoliday", sSQL.Replace("'", "''"), 3003, ph.DCMUser);
                }
                catch (Exception  x) { }

                return "Error Occured while Updating the Public Holiday";
            }

            return "Public Holiday Updated";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeletePublicHoliday([FromBody] BasePublicHoliday ph)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
            sSQL = "Select count(*) from PublicHoliday  Where SerialID = " + ph.SerialID;

            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, ph.Site));

                if (count == 0)
                {
                    try
                    {
                        Logging.WriteLog(ph.Site, "Warning", "PublicHoliday", "DeletePublicHoliday", sSQL.Replace("'", "''"), 2002, ph.DCMUser);
                    }
                    catch (Exception ex) { }

                    return " Public HoliDay Record does not Exist";
                }
                else
                {

                    sSQL = "Delete from PublicHoliday Where SerialID = " + ph.SerialID;
                    try
                    {
                        Logging.WriteLog(ph.Site, "Info", "PublicHoliday", "DeletePublicHoliday", sSQL.Replace("'", "''"), 1007, ph.DCMUser);
                    }
                    catch (Exception ex) { }

            string result =    conn.ExecuteDeleteQuery(sSQL, ph.Site);

                    if (result != "Delete SuccessFull")
                    {
                        try
                        {
                            Logging.WriteLog(ph.Site, "Error", "PublicHoliday", "DeletePublicHoliday", sSQL.Replace("'", "''"), 3007, ph.DCMUser);
                        }
                        catch (Exception ex) { }

                        return "Error Occured while Updating the Public Holiday";
                    }

                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(ph.Site, "Error", "PublicHoliday", "DeletePublicHoliday", sSQL.Replace("'", "''"), 3007, ph.DCMUser);
                }
                catch (Exception e ) { }
                return "Error while deleting the Record:" + ex.Message;
            }


            return "Record deleted";
     
        }

    }
}