using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.UI.WebControls;
using DC4._0Backend.Models;
using System.Text.Json;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Net.Mail;
using System.IO;
using DC4._0Backend.Models;
using System.Xml;

namespace DC4._0Backend.Controllers
{
    public class PalletHandlingMatrixController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetMatrix([FromBody]PalletHandlingMatrix matrix)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            List<PalletHandlingMatrix> list = new List<PalletHandlingMatrix>();
            try
            {

                sSQL = "Select MovableUnits 'Movable Units',Activity,UnitType 'Unit Type', UnitTime 'Time Per Unit' From PalletHandlingMatrix";
                try
                {
                    Logging.WriteLog(matrix.Site, "Info", "Pallet Handling Matrix", "GetMatrix", sSQL.Replace("'", "''"), 1002, matrix.DCMUser);
                }
                catch (Exception ex)
                {
                }
                DataSet ds = conn.ExecuteSelectQuery(sSQL, matrix.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow r in ds.Tables[0].Rows)
                    {
                        PalletHandlingMatrix obj = new Models.PalletHandlingMatrix();

                        obj.MovableUnits = Convert.ToInt16(r["Movable Units"].ToString());

                        obj.Activity = r["Activity"].ToString();
                        obj.UnitType = r["Unit Type"].ToString();
                        obj.TimePerUnit = Convert.ToDouble(r["Time Per Unit"].ToString());
                        list.Add(obj);
                    }
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(matrix.Site, "Error", "Pallet Handling Matrix", "GetMatrix", sSQL.Replace("'", "''"), 3002, matrix.DCMUser);
                return "Error while Fetching the Pallet Matrix List";
            }

            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AddMatrix([FromBody]PalletHandlingMatrix matrix)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            try
            {
                
            sSQL = "Select Count(*) From PalletHandlingMatrix  Where Activity = '" +matrix.Activity + "' And UnitType = ltrim('" +matrix.UnitType+ "') And MovableUnits = " +matrix.MovableUnits+ " And UnitTime = " +matrix.TimePerUnit;
                int count = int.Parse(conn.ReturnSingleValue(sSQL, matrix.Site));

                if (count > 0)
                {
                    try
                    {
                        Logging.WriteLog(matrix.Site, "Warning", "PalletHandlingMatrix", "InsertNewMatrix", sSQL.Replace("'", "''"), 2001, matrix.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                    return "Duplicate Record Found";
                }
                else
                {
                    sSQL = "Insert Into PalletHandlingMatrix(MovableUnits,Activity,UnitType,UnitTime)  Values("+matrix.MovableUnits+",'" + matrix.Activity + "','" + matrix.UnitType + "',"+matrix.TimePerUnit+")";

                    try
                    {
                        Logging.WriteLog(matrix.Site, "Info", "PalletHandlingMatrix", "AddMatrix", sSQL.Replace("'", "''"), 1001, matrix.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                    string result =  conn.ExecuteInsertQuery(sSQL, matrix.Site);

                    if (result != "Insert SuccessFull")
                    {
                        return "Error while Inserting New Matrix";
                    }
                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(matrix.Site, "Error", "PalletHandlingMatrix", "InsertMatrix", sSQL.Replace("'", "''"), 3001, matrix.DCMUser);
                return "Error while Inserting New Matrix";
            }
            return "New Record Added";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteMatrix([FromBody]PalletHandlingMatrix matrix)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;
            try
            {

                sSQL = "Delete From PalletHandlingMatrix Where  Activity = '" + matrix.Activity + "' And  UnitType = '" + matrix.UnitType + "' And MovableUnits = " + matrix.MovableUnits + "And UnitTime = " + matrix.TimePerUnit;
                try
                {
                    Logging.WriteLog(matrix.Site, "Info", "Pallet Handling Matrix", "DeleteMatrix", sSQL.Replace("'", "''"), 1007, matrix.DCMUser);
                }
                catch (Exception ex)
                {
                }
                string result = conn.ExecuteDeleteQuery(sSQL, matrix.Site);

                if (result != "Delete SuccessFull")
                {
                    return "Error while Deleting Matrix";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(matrix.Site, "Error", "PalletHandlingMatrix", "DeleteMatrix", sSQL.Replace("'", "''"), 3007, matrix.DCMUser);
                
                return "Error while Deleting Matrix";
            }
            return "Matrix Deleted";
        }

    }
}