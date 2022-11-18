using System;
using System.Collections.Generic;

using System.Web.Http;
using System.Web.UI.WebControls;
using DC4._0Backend.Models;

using System.Data;
using System.Data.SqlClient;
using System.Configuration;

using  DC4._0Backend.Models;
using System.Xml;

namespace DC4._0Backend.Controllers.Reports
{
    public class ProductivityController : ApiController
    {
        
            [AcceptVerbs("GET", "POST")]
            [HttpPost]
            public string GetProductivityPickReport([FromBody] ProductivityPick pick)
            {
                SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[pick.Site].ConnectionString);
                SqlCommand cmd = new SqlCommand("spProductivityReport_Picks", sqlConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                List<ProductivityPick> reports = new List<ProductivityPick>();
                string parmvalue = pick.FromDate + pick.ToDate;

                cmd.Parameters.AddWithValue("@Parm", parmvalue);
               cmd.CommandTimeout = 420;

            SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();

            try
            {

                Logging.WriteLog(pick.Site, "Info", "ProductivityPick", "GetProductivityPickReport", "spProductivityReport_Picks", 1002, pick.DCMUser);
            }
            catch (Exception ex)    
            { }
                try
                {
                    da.Fill(ds);

                    dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityPick obj = new ProductivityPick();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.RFLogin = ds.Tables[0].Rows[i]["RFLogin"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                  
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();


                  DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.TotalHrs = ds.Tables[0].Rows[i]["TotalHrs"].ToString();
                    obj.NoOfOrders = ds.Tables[0].Rows[i]["NoOfOrders"].ToString();
                    obj.NoOfUnits = decimal.ToInt32(Convert.ToDecimal(ds.Tables[0].Rows[i]["NoOfUnits"].ToString())).ToString();
                    obj.NoOfLines = ds.Tables[0].Rows[i]["NoOfLines"].ToString();
                    obj.Units_Hr = Math.Round( Convert.ToDouble(ds.Tables[0].Rows[i]["Units/Hr"].ToString()), 2); 
                    obj.WH = ds.Tables[0].Rows[i]["WH"].ToString();
                    
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();

                    reports.Add(obj);

                }
            

                }

                catch (Exception ex)
                {

                Logging.WriteLog(pick.Site, "Error", "ProductivityPick", "GetProductivityPickReport", "spProductivityReport_Picks", 3002, pick.DCMUser);
            }
                return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
            }


        //Method for Productivity Rework
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetProductivitReworkReport([FromBody] ProductivityRework rework)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[rework.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spProductivityReport_Rework", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ProductivityRework> reports = new List<ProductivityRework>();
            string parmvalue = rework.FromDate + rework.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.CommandTimeout = 420;

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {

                Logging.WriteLog(rework.Site, "Info", "ProductivityRework", "GetProductivityreworkReport", "spProductivityReport_Rework", 1002, rework.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityRework obj = new ProductivityRework();
                

                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();


                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TaskTime = Convert.ToDouble(ds.Tables[0].Rows[i]["TaskTime"]);
                    obj.ToolsBuilt = Convert.ToInt32(ds.Tables[0].Rows[i]["ToolsBuilt"]);
                    obj.ComponentsPutTogether = Convert.ToDouble(ds.Tables[0].Rows[i]["ComponentsPutTogether"]);
                    obj.ToolsBuiltPerHr = Convert.ToDouble(ds.Tables[0].Rows[i]["ToolsBuiltPerHr"]);
                    obj.ComponentsPutTogetherPerHr = Convert.ToDouble(ds.Tables[0].Rows[i]["ComponentsPutTogetherPerHr"]);
                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {

                Logging.WriteLog(rework.Site, "Error", "ProductivityPick", "GetProductivityReworkReport", "spProductivityReport_Rework", 3002, rework.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }


        // Method for RPFC Ingleburn
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetProductivityPickReport_RPFC([FromBody] ProductivityPick pick)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[pick.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spProductivityReport_Picks", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ProductivityPick> reports = new List<ProductivityPick>();
            string parmvalue = pick.FromDate + pick.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.CommandTimeout = 420;

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {

                Logging.WriteLog(pick.Site, "Info", "ProductivityPick", "GetProductivityPickReport", "spProductivityReport_Picks", 1002, pick.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityPick obj = new ProductivityPick();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.RFLogin = ds.Tables[0].Rows[i]["RFLogin"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();

                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();


                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.TotalHrs = ds.Tables[0].Rows[i]["TotalHrs"].ToString();
                    obj.NoOfOrders = ds.Tables[0].Rows[i]["NoOfOrders"].ToString();
                    obj.NoOfUnits = decimal.ToInt32(Convert.ToDecimal(ds.Tables[0].Rows[i]["NoOfUnits"].ToString())).ToString();
                    obj.NoOfLines = ds.Tables[0].Rows[i]["NoOfLines"].ToString();
                    obj.Units_Hr = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["Units/Hr"].ToString()), 2);
                    obj.WH = ds.Tables[0].Rows[i]["WH"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();
                    obj.PalletsHandled = (Convert.ToInt32(ds.Tables[0].Rows[i]["PalletsHandled"]));
                    obj.PartPalletHandled = (Convert.ToInt32(ds.Tables[0].Rows[i]["PartPalletHandled"]));

                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {

                Logging.WriteLog(pick.Site, "Error", "ProductivityPick", "GetProductivityPickReport", "spProductivityReport_Picks", 3002, pick.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }
        
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetProductivityPutawayReport([FromBody] ProductivityPutaway putaway)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[putaway.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spProductivityReport_Putaway", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ProductivityPutaway> reports = new List<ProductivityPutaway>();
            string parmvalue = putaway.FromDate + putaway.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(putaway.Site, "Info", "ProductivityPutaway", "GetProductivityPutawayReport", "spProductivityReport_Putaway", 1002, putaway.DCMUser);
            }
            catch (Exception ex)
            { }

            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityPutaway obj = new ProductivityPutaway();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.RFLogin = ds.Tables[0].Rows[i]["RFLogin"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.TotalHrs = ds.Tables[0].Rows[i]["TotalHrs"].ToString();
                    obj.NoOfUnits = decimal.ToInt32(Convert.ToDecimal(ds.Tables[0].Rows[i]["NoOfUnits"].ToString())).ToString();
                    obj.NoOfPutaway = ds.Tables[0].Rows[i]["NoOfPutaway"].ToString();
                    obj.Units_Hr = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["Units/Hr"].ToString()), 2);
                    obj.WH = ds.Tables[0].Rows[i]["WH"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();

                    reports.Add(obj);

                }

            }

            catch (Exception ex)
            {
                Logging.WriteLog(putaway.Site, "Error", "ProductivityPutaway", "GetProductivityPutawayReport", "spProductivityReport_Putaway", 3002, putaway.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }


       

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetProductivityPackReport([FromBody] ProductivityPack pack)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[pack.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spProductivityReport_pack", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ProductivityPack> reports = new List<ProductivityPack>();
            string parmvalue = pack.FromDate + pack.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(pack.Site, "Info", "ProductivityPack", "GetProductivityPackReport", "spProductivityReport_pack", 1002, pack.DCMUser);
            }
            catch (Exception ex)
            {

            }

            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityPack obj = new ProductivityPack();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.RFLogin = ds.Tables[0].Rows[i]["RFLogin"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.TotalHrs = Convert.ToDouble(ds.Tables[0].Rows[i]["TotalHrs"]);
                    obj.NoOfUnits = Convert.ToInt32(ds.Tables[0].Rows[i]["NoOfUnits"]);
                    obj.NoOfPack = Convert.ToInt32(ds.Tables[0].Rows[i]["NoOfPack"]);
                    obj.Units_Hr = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["Units/Hr"]), 2);
                    
                    obj.WH = ds.Tables[0].Rows[i]["WH"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();

                    reports.Add(obj);

                }

            }

            catch (Exception ex)
            {
                Logging.WriteLog(pack.Site, "Error", "ProductivityPack", "GetProductivityPackReport", "spProductivityReport_pack", 3002, pack.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetProductivityMoveReport([FromBody] ProductivityMove move)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[move.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spProductivityReport_Move", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ProductivityMove> reports = new List<ProductivityMove>();
            string parmvalue = move.FromDate + move.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            try
            {
                Logging.WriteLog(move.Site, "Info", "ProductivityMove", "GetProductivityMoveReport", "spProductivityReport_Move", 1002, move.DCMUser);
            }
            catch (Exception ex)
            {
            }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityMove obj = new ProductivityMove();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.RFLogin = ds.Tables[0].Rows[i]["RFLogin"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.TotalHrs = ds.Tables[0].Rows[i]["TotalHrs"].ToString();
                    obj.NoOfMove = ds.Tables[0].Rows[i]["NoOfMove"].ToString();
                    
                    obj.NoOfUnits = decimal.ToInt32(Convert.ToDecimal(ds.Tables[0].Rows[i]["NoOfUnits"].ToString())).ToString();
                    obj.Units_Hr = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["Units/Hr"].ToString()), 2);
                    
                    obj.WH = ds.Tables[0].Rows[i]["WH"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();

                    reports.Add(obj);

                }

            }

            catch (Exception ex)
            {
                Logging.WriteLog(move.Site, "Error", "ProductivityMove", "GetProductivityMoveReport", "spProductivityReport_Move", 3002, move.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetProductivityRepReport([FromBody] ProductivityReplishment rep)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[rep.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spProductivityReport_Rep", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ProductivityReplishment> reports = new List<ProductivityReplishment>();
            string parmvalue = rep.FromDate + rep.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(rep.Site, "Info", "Productivityrep", "GetProductivityrepReport", "spProductivityReport_Rep", 1002, rep.DCMUser);
            }
            catch (Exception ex)
            { }


            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityReplishment obj = new ProductivityReplishment();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.RFLogin = ds.Tables[0].Rows[i]["RFLogin"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.TotalHrs = ds.Tables[0].Rows[i]["TotalHrs"].ToString();
                    obj.NoOfReplenishment = ds.Tables[0].Rows[i]["NoOfReplenishment"].ToString();
                    obj.NoOfUnits = decimal.ToInt32(Convert.ToDecimal(ds.Tables[0].Rows[i]["NoOfUnit"].ToString())).ToString();
                    obj.NoOfLines_Hr = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["NoOfLines/Hr"].ToString()), 2);
                    
                    obj.WH = ds.Tables[0].Rows[i]["WH"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();

                    reports.Add(obj);

                }

            }

            catch (Exception ex)
            {

                Logging.WriteLog(rep.Site, "Error", "Productivityrep", "GetProductivityrepReport", "spProductivityReport_Rep", 3002, rep.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetProductivityRepReport_Asics([FromBody] ProductivityReplishment rep)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[rep.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spProductivityReport_Rep_Split", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ProductivityReplishment> reports = new List<ProductivityReplishment>();
            string parmvalue = rep.FromDate + rep.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                Logging.WriteLog(rep.Site, "Info", "Productivityrep", "GetProductivityrepReport", "spProductivityReport_Rep_Split", 1002, rep.DCMUser);
            }
            catch (Exception ex)
            { }


            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityReplishment obj = new ProductivityReplishment();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.RFLogin = ds.Tables[0].Rows[i]["RFLogin"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();
                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.TotalHrs = ds.Tables[0].Rows[i]["TotalHrs"].ToString();
                    obj.NoOfReplenishment = ds.Tables[0].Rows[i]["NoOfReplenishment"].ToString();
                    obj.NoOfUnits = decimal.ToInt32(Convert.ToDecimal(ds.Tables[0].Rows[i]["NoOfUnit"].ToString())).ToString();
                    obj.NoOfLines_Hr = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["NoOfLines/Hr"].ToString()), 2);

                    obj.WH = ds.Tables[0].Rows[i]["WH"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();
                    obj.RepType = ds.Tables[0].Rows[i]["RepType"].ToString();

                    reports.Add(obj);

                }

            }

            catch (Exception ex)
            {

                Logging.WriteLog(rep.Site, "Error", "Productivityrep", "GetProductivityrepReport", "spProductivityReport_Rep", 3002, rep.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetProductivityPickReport_HR([FromBody] ProductivityPick_HR pick) //for CCA
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[pick.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spProductivityReport_Picks_HR", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ProductivityPick_HR> reports = new List<ProductivityPick_HR>();
            string parmvalue = pick.FromDate + pick.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.CommandTimeout = 420;

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {

                Logging.WriteLog(pick.Site, "Info", "ProductivityPick_HR", "GetProductivityPickReport", "spProductivityReport_Picks_HR", 1002, pick.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityPick_HR obj = new ProductivityPick_HR();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.RFLogin = ds.Tables[0].Rows[i]["RFLogin"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();

                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();


                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.TotalHrs = ds.Tables[0].Rows[i]["TotalHrs"].ToString();
                    obj.NoOfOrders = ds.Tables[0].Rows[i]["NoOfOrders"].ToString();
                    obj.NoOfUnits = decimal.ToInt32(Convert.ToDecimal(ds.Tables[0].Rows[i]["NoOfUnits"].ToString())).ToString();
                    obj.NoOfLines = ds.Tables[0].Rows[i]["NoOfLines"].ToString();
                    obj.Units_Hr = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["Units/Hr"].ToString()), 2);
                    obj.WH = ds.Tables[0].Rows[i]["WH"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();

                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {

                Logging.WriteLog(pick.Site, "Error", "ProductivityPick", "GetProductivityPickReport", "spProductivityReport_Picks", 3002, pick.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetProductivityLoadReport([FromBody] ProductivityPick_HR pick) //for CCA
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[pick.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spProductivityReport_Load", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<ProductivityPick_HR> reports = new List<ProductivityPick_HR>();
            string parmvalue = pick.FromDate + pick.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);
            cmd.CommandTimeout = 420;

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {

                Logging.WriteLog(pick.Site, "Info", "Productivityload", "GetProductivityLoadReport", "spProductivityReport_Load", 1002, pick.DCMUser);
            }
            catch (Exception ex)
            { }
            try
            {
                da.Fill(ds);

                dt = ds.Tables[0];

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    ProductivityPick_HR obj = new ProductivityPick_HR();
                    obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.RFLogin = ds.Tables[0].Rows[i]["RFLogin"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.Surname = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.FullName = obj.FirstName + " " + obj.Surname;
                    obj.Activity = ds.Tables[0].Rows[i]["Activity"].ToString();
                    obj.Shift = ds.Tables[0].Rows[i]["Shift"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();

                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();


                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");
                    obj.TotalTime = ds.Tables[0].Rows[i]["TotalTime"].ToString();
                    obj.TotalHrs = ds.Tables[0].Rows[i]["TotalHrs"].ToString();
                    obj.NoOfOrders = ds.Tables[0].Rows[i]["NoOfOrders"].ToString();
                    obj.NoOfUnits = decimal.ToInt32(Convert.ToDecimal(ds.Tables[0].Rows[i]["NoOfUnits"].ToString())).ToString();
                    obj.NoOfLines = ds.Tables[0].Rows[i]["NoOfLines"].ToString();
                    obj.Units_Hr = Math.Round(Convert.ToDouble(ds.Tables[0].Rows[i]["Units/Hr"].ToString()), 2);
                    obj.WH = ds.Tables[0].Rows[i]["WH"].ToString();

                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();

                    reports.Add(obj);

                }


            }

            catch (Exception ex)
            {

                Logging.WriteLog(pick.Site, "Error", "ProductivityLoad", "GetProductivityLoadReport", "spProductivityReport_Load", 3002, pick.DCMUser);
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSelectedUserTransactionProdRep_Asics([FromBody]TransHistory trans)
        {
            string sSQL = string.Empty;

            List<TransHistory> historylist = new List<TransHistory>();


            //switch (trans.TaskType)
            //{
            //    case "Picking":
            //        trans.TaskType = "picks";
            //        trans.OrderNumber = "not like " + "'B%'";
            //        break;

            //    case "ChutePick":
            //        trans.TaskType = "CHUTEPICKING";
            //        trans.OrderNumber = "not like " + "'B%'";
            //        break;

            //    case "BatchPick":
            //        trans.TaskType = "picks";
            //        trans.OrderNumber = " like " + "'B%'";
            //        break;
            //}

            sSQL = "Select di.TaskType,di.OrderNumber,Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime',di.ActualTime,"+
                   "IsNull(di.TotalBreak, 0)'TotalBreak', di.PickQuantity,di.OperatorID, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube ,"+
		           "Case When SUBSTRING(ToLocation, 0, 5) Between 'BZ00' and 'BZ86' then 'Apparel'   When SUBSTRING(ToLocation , 0, 5 ) Between 'CA09' and 'CA88' then 'Apparel' When SUBSTRING(ToLocation , 0, 5 ) Between 'CB01' and 'CB80' then 'Apparel'"+
                   " When SUBSTRING(ToLocation , 0, 5 ) Between 'CC01' and 'CC55' then 'Apparel'"+
                  " When ToLocation Between 'AP00001' and 'AP00656' then 'Apparel'"+
		           " else 'Footwear' end as 'RepType'"+
                   "From DCMImport di left join UserInfo ui on di.OperatorID = ui.UserID Where di.OperatorID = '"+trans.OperatorID+"' and di.TaskType = 'Replenishment' and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103) "+
	                " Between Convert(DateTime, Convert(Char(19),'"+trans.StartDate+"',103),103) And Convert(DateTime, Convert(Char(19),'"+ trans.EndDate+"',103),103)  Order by di.OperatorID,di.StartDateTime";

            Connection conn = new Connection();
            DataTable dt = new DataTable();
            try
            {
                try
                {
                    Logging.WriteLog(trans.Site, "Info", "TransactionHistory", "GetAllTransaction", sSQL.Replace("'", "''"), 1002, trans.DCMUser);
                }
                catch (Exception ex)
                {

                }
                DataSet ds = conn.ExecuteSelectQuery(sSQL, trans.Site);

                dt = ds.Tables[0];

                foreach (DataRow row in ds.Tables[0].Rows)
                {

                    TransHistory obj = new TransHistory();

                    obj.TaskType = row["TaskType"].ToString();



                    if (!(string.IsNullOrEmpty(row["StartDateTime"].ToString())))
                    {

                        obj.StartTime = Convert.ToDateTime(row["StartDateTime"]).ToString("HH:mm:ss");

                    }

                    if (!(string.IsNullOrEmpty(row["EndDateTime"].ToString())))
                    {

                        obj.EndTime = Convert.ToDateTime(row["EndDateTime"]).ToString("HH:mm:ss");

                    }
                    obj.ActualTime = row["ActualTime"].ToString();
                    obj.TotalBreak = row["TotalBreak"].ToString();

                    obj.OrderNumber = row["OrderNumber"].ToString();
                    obj.PickQuantity = row["PickQuantity"].ToString();
                    obj.OperatorID = row["OperatorID"].ToString();
                    obj.FromLocation = row["FromLocation"].ToString();
                    obj.ToLocation = row["ToLocation"].ToString();
                    obj.ProductCode = row["ProductCode"].ToString();
                    obj.ProductWeight = row["ProductWeight"].ToString();
                    obj.ProductCube = row["ProductCube"].ToString();
                    obj.RepType = row["RepType"].ToString();

                    if (obj.RepType.Equals(trans.RepType))
                    {
                        historylist.Add(obj);
                    }
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(trans.Site, "Error", "TransactionHistory", "GetAllTransaction", sSQL.Replace("'", "''"), 3002, trans.DCMUser);
                }
                catch (Exception e) { }

                return "Error Occured:While Fetching the List";
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(historylist);
        }

        //[AcceptVerbs("GET", "POST")]
        //[HttpPost]
        //public string GetProductivityReworkReport([FromBody] ProductivityRework tardiness)
        //{
        //    SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[tardiness.Site].ConnectionString);
        //    SqlCommand cmd = new SqlCommand("spProductivityReport_Rework", sqlConnection);
        //    cmd.CommandType = CommandType.StoredProcedure;
        //    List<Tardiness> reports = new List<Tardiness>();
        //    string parmvalue = tardiness.FromDate + tardiness.ToDate;

        //    cmd.Parameters.AddWithValue("@Parm", parmvalue);

        //    SqlDataAdapter da = new SqlDataAdapter(cmd);
        //    DataSet ds = new DataSet();

        //    try
        //    {
        //        Logging.WriteLog(tardiness.Site, "Info", "tardiness", "GetReport", "spTardinessReport", 1002, tardiness.DCMUser);
        //    }
        //    catch (Exception ex)
        //    { }
        //    try
        //    {
        //        da.Fill(ds);

        //        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        //        {
        //            ProductivityRework obj = new ProductivityRework();
        //            obj.UserID = ds.Tables[0].Rows[i]["UserID"].ToString();
        //            obj.FullName = ds.Tables[0].Rows[i]["FirstName"].ToString() + " " + ds.Tables[0].Rows[i]["Surname"].ToString();
        //            obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
        //            obj.Comment = ds.Tables[0].Rows[i]["Comment"].ToString();


        //            DateTime date = DateTime.Parse(ds.Tables[0].Rows[i]["Date"].ToString());
        //            obj.StartDate = date.ToString("dd/MM/yyyy");

        //            obj.ScanType = ds.Tables[0].Rows[i]["ScanType"].ToString();
        //            obj.ActualStart = ds.Tables[0].Rows[i]["ActualStart"].ToString();
        //            obj.ExpectedStart = ds.Tables[0].Rows[i]["ExpectedStart"].ToString();
        //            obj.ActualEnd = ds.Tables[0].Rows[i]["ActualEnd"].ToString();
        //            obj.ExpectedEnd = ds.Tables[0].Rows[i]["ExpectedEnd"].ToString();
        //            obj.totalLosttime = Convert.ToInt16(ds.Tables[0].Rows[i]["StartLostTime"].ToString()) + Convert.ToInt16(ds.Tables[0].Rows[i]["EndLostTime"].ToString());
        //            obj.totalTolerance = Convert.ToInt16(ds.Tables[0].Rows[i]["StartTolerance"].ToString()) + Convert.ToInt16(ds.Tables[0].Rows[i]["EndTolerance"].ToString());
        //            reports.Add(obj);

        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Logging.WriteLog(tardiness.Site, "Error", "tardiness", "GetReport", "spTardinessReport", 3002, tardiness.DCMUser);
        //    }
        //    return JsonSerializer.Serialize(reports);
        //}



    }
}