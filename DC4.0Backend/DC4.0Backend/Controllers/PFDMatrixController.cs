using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DC4._0Backend.Models;
using System.Data;
using System.Text.Json;

namespace DC4._0Backend.Controllers
{
    public class PFDMatrixController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetpfdMatrix([FromBody] PFDMatrix matrix)
        {

            string sSQL = "Select Activity,PFDAllowance From PFDMatrix";

            Connection conn = new Connection();
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                ds = conn.ExecuteSelectQuery(sSQL, matrix.Site);
                dt = ds.Tables[0];
                try
                {

                    Logging.WriteLog(matrix.Site, "Info", "PFDMatrix", "GetPFDMatrix", sSQL.Replace("'", "''"), 1002, matrix.DCMUser);
                }
                catch (Exception ex)
                {
                }
                }


            catch (Exception ex)
            {
                Logging.WriteLog(matrix.Site, "Error", "PFDMatrix", "GetPFDMatrix", sSQL.Replace("'", "''"), 3002, matrix.DCMUser);
                return "Error While Fetching the PFD Matrix";
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteMatrix([FromBody] PFDMatrix matrix)
        {
            string sSQL = "Delete From PFDMatrix Where Activity = '" + matrix.Activity+ "'";
            Connection conn = new Connection();

            DataSet ds = new DataSet();

            try
            {
                Logging.WriteLog(matrix.Site, "Info", "PFDMatrix", "DeleteMatrix", sSQL.Replace("'", "''"), 1007, matrix.DCMUser);
            }
            catch (Exception ex)
            {

            }
            try
            {
             string result = conn.ExecuteDeleteQuery(sSQL, matrix.Site);

                if (result != "Delete SuccessFull")
                {
                    return "Error While Deleting the Matrix";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(matrix.Site, "Error", "PFDMatrix", "DeleteMatrix", sSQL.Replace("'", "''"), 3007, matrix.DCMUser);
                return "Error While Deleting the  Matrix";
            }
            return "PFD Matrix deleted";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertNewMatrix([FromBody] PFDMatrix matrix)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
            sSQL = "Select Count(*) From PFDMatrix Where Activity = '" + matrix.Activity+ "' ";

            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, matrix.Site));

                if (count > 0)
                {

                    try
                    {
                        Logging.WriteLog(matrix.Site, "Warning", "PFDMatrix", "InsertNewMatrix", sSQL.Replace("'", "''"), 2008, matrix.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                    return "Duplicate record found for Aisle";
                }
                if (matrix.Activity.Length > 50)
                {
                    try
                    {
                        Logging.WriteLog(matrix.Site, "Warning", "PFDMatrix", "InsertNewMatrix", sSQL.Replace("'", "''"), 2009, matrix.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                    return "Activity Name is off Excessive Length";
                }
                sSQL = "Insert Into PFDMatrix(Activity,PFDAllowance) Values('" + matrix.Activity + "'," + matrix.PFDAllowance + ")";

                try
                {
                    Logging.WriteLog(matrix.Site, "Info", "PFDMatrix", "InsertNewMatrix", sSQL.Replace("'", "''"), 1001, matrix.DCMUser);
                }
                catch (Exception ex)
                {

                }



                string result = conn.ExecuteInsertQuery(sSQL, matrix.Site);

                if (result != "Insert SuccessFull")
                {
                    return "Error While Creating the Matrix";
                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(matrix.Site, "Error", "PFDMatrix", "InsertMatrix", sSQL.Replace("'", "''"), 3001, matrix.DCMUser);
                return "Error While inserting the PFD Matrix";
            }
            return "New PFD Inserted";
        }
    }
}
