using System;
using System.Collections.Generic;

using System.Web.Http;
using System.Web.UI.WebControls;
using DC4._0Backend.Models;

using System.Data;
using System.Data.SqlClient;
using System.Configuration;

using DC4._0Backend.Models;
using System.Xml;


namespace DC4._0Backend.Controllers
{
    public class AisleMatrixController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAisle([FromBody] AisleMatrix aisle)
        {

            string sSQL = "Select ID ,Isnull(Zone,'')'Zone', IsNull(ActivityName,'') 'Activity',IsNull(AisleSequence,'')'AisleSequence', Aisle,Convert(Decimal(8,5),IsNull(AisleLength,0))'AisleLength'," +
                           "Convert(Decimal(8, 5), IsNull(DockToStartTime, 0)) 'DockToStartTime',Convert(Decimal(8, 5), IsNull(EndToDockTime, 0)) 'EndToDockTime',Convert(Decimal(8, 5), IsNull(TimePerMetre, 0)) 'TimePerMetre', Convert(Decimal(8, 5), IsNull(TimePerStop, 0)) 'TimePerStop'From MaintainAisle";

            try
            {
                Logging.WriteLog(aisle.Site, "Info", "AisleMatrix", "GetAisleMatrix", sSQL.Replace("'", "''"), 1002, aisle.DCMUser);
            }
            catch (Exception ex)
            {
            }

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[aisle.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand(sSQL, sqlConnection);



            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                Logging.WriteLog(aisle.Site, "Error", "AisleMatrix", "UpdateAisleMatrix", sSQL.Replace("'", "''"), 3002, aisle.DCMUser);
                return "Error While Fetching the Aisle Matrix";
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateAisle([FromBody] AisleMatrix aisle)
        {
            string sSQL = "Update MaintainAisle Set  Zone = '" + aisle.Zone + "',ActivityName = '" + aisle.Activity + "',AisleSequence = '" + aisle.AisleSequence + "', AisleLength = " + aisle.AisleLength + ",TimePerMetre = " + aisle.TimePerMetre + "," +
            "TimePerStop = " + aisle.TimePerStop + ",DockToStartTime = " + aisle.DockToStartTime + ", EndToDockTime = " + aisle.EndToDockTime + " Where Aisle= '" + aisle.Aisle + "'";
            Connection conn = new Connection();
            try
            {
                Logging.WriteLog(aisle.Site, "Update", "AisleMatrix", "UpdateAisleMatrix", sSQL.Replace("'", "''"), 1003, aisle.DCMUser);
            }
            catch (Exception ex)
            {
            }



            DataSet ds = new DataSet();

            try
            {
                string result =  conn.ExecuteUpdateQuery(sSQL, aisle.Site);

                if (result != "Update SuccessFull")
                {
                    return "Error While Updating the Matrix";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(aisle.Site, "Error", "AisleMatrix", "UpdateAisleMatrix", sSQL.Replace("'", "''"), 3003, aisle.DCMUser);
                return "Error While updating the Aisle Matrix";
            }
            return "Aisle Updated";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteAisle([FromBody] AisleMatrix aisle)
        {
            string sSQL = "Delete From MaintainAisle Where Aisle = '" + aisle.Aisle + "'";
            Connection conn = new Connection();

            DataSet ds = new DataSet();
            try
            {
                Logging.WriteLog(aisle.Site, "Delete", "AisleMatrix", "DeleteAisleMatrix", sSQL.Replace("'", "''"), 1007, aisle.DCMUser);
            }
            catch (Exception ex)
            {
            }


            try
            {
                string result = conn.ExecuteDeleteQuery(sSQL, aisle.Site);

                if (result != "Delete SuccessFull")
                {
                    return "Error While Deleting the Matrix";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(aisle.Site, "Error", "AisleMatrix", "DeleteAisleMatrix", sSQL.Replace("'", "''"), 3007, aisle.DCMUser);
                return "Error While Deleting the Aisle Matrix";
            }
            return "Selected Aisle Matrix";
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertNewAisle([FromBody] AisleMatrix aisle)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
            sSQL =  "Select Count(*) From MaintainAisle Where AisleSequence = '" +aisle.AisleSequence+ "' And Aisle = '" +aisle.Aisle+ "' And ActivityName = '" + aisle.Activity + "'";


            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, aisle.Site));

                if (count > 0)
                {
                    try
                    {
                        Logging.WriteLog(aisle.Site, "Warning", "AisleMatrix", "InsertAisleMatrix", sSQL.Replace("'", "''"), 2001, aisle.DCMUser);
                    }
                    catch (Exception ex)
                    {
                    }


                    return "Duplicate record found for Aisle";
                }
                if (aisle.Activity.Length > 20)
                {
                    return "Activity Name is off Excessive Length";
                }
                sSQL = "Insert Into MaintainAisle (Zone,ActivityName,AisleSequence,Aisle,AisleLength,TimePerMetre,TimePerStop,DockToStartTime,EndToDockTime)"+
                               "Values ('"+aisle.Zone+"','"+aisle.Activity+"',isnull('" +aisle.AisleSequence+ "','0'),isnull('" +aisle.Aisle+ "', '0') ,"+aisle.AisleLength+" ," +aisle.TimePerMetre+ "," +aisle.TimePerStop+ ","+aisle.DockToStartTime+ ","+aisle.EndToDockTime+")";

                try
                {
                    Logging.WriteLog(aisle.Site, "Insert", "AisleMatrix", "InsertAisleMatrix", sSQL.Replace("'", "''"), 1001, aisle.DCMUser);
                }
                catch (Exception ex)
                {
                }

                string result =  conn.ExecuteInsertQuery(sSQL, aisle.Site);

                if (result != "Insert SuccessFull")
                {
                    return "Error While Inserting the Matrix";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(aisle.Site, "Error", "AisleMatrix", "InsertAisleMatrix", sSQL.Replace("'", "''"), 3001, aisle.DCMUser);
                return "Error While inserting the Aisle Matrix";
            }
            return "New Aisle Inserted";
        }

    }
}
