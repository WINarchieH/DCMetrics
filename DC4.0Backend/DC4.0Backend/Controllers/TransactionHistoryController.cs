using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Web.Http;
using DC4._0Backend.Models;

namespace DC4._0Backend.Controllers
{
    public class TransactionHistoryController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllTransaction([FromBody]TransHistory trans)
        {
            string sSQL = string.Empty;

            List<TransHistory> historylist = new List<TransHistory>();


            sSQL = "Select  di.BatchNumber,di.TaskType,concat(ui.FirstName,' ',ui.Surname) as 'FullName',Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime'," +
                  "di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak',di.OrderNumber,IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube, di.PickQuantity,di.AddDate," +
                  "di.ProductDescription,di.[FullCase/SplitCase],di.ID,di.OperatorID,di.UpdatedBy,di.Comment ,  ui.TeamManager From DCMImport di left join  UserInfo ui on di.OperatorID = ui.UserID Where Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103) " +
                  " Between Convert(DateTime, Convert(Char(19),'" + trans.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + trans.EndDate + "',103),103) And di.TaskType like '%%'  Order by di.OperatorID,di.StartDateTime";

            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings[trans.Site].ConnectionString);
            SqlCommand  sqlCommand = new SqlCommand(sSQL, sqlconnection);
            sqlCommand.CommandTimeout = 420; 
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter(sqlCommand);

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

                da.Fill(ds);

                dt = ds.Tables[0];

                foreach (DataRow row in ds.Tables[0].Rows)
                {

                    TransHistory obj = new TransHistory();
                    obj.BatchNumber = row["BatchNumber"].ToString();
                    obj.TaskType = row["TaskType"].ToString();
                
                    obj.FullName = row["FullName"].ToString();

                    if ( !( string.IsNullOrEmpty(row["StartDateTime"].ToString())))
                    {
                        obj.StartDate = Convert.ToDateTime(row["StartDateTime"]).ToString("dd/MM/yyyy");
                        obj.StartTime = Convert.ToDateTime(row["StartDateTime"]).ToString("HH:mm:ss");

                    }

                    if (!(string.IsNullOrEmpty(row["EndDateTime"].ToString())))
                    {
                        obj.EndDate = Convert.ToDateTime(row["EndDateTime"]).ToString("dd/MM/yyyy");
                        obj.EndTime = Convert.ToDateTime(row["EndDateTime"]).ToString("HH:mm:ss");

                    }
                    obj.ActualTime = row["ActualTime"].ToString();
                    obj.TotalBreak = row["TotalBreak"].ToString();
                    obj.FromLocation = row["FromLocation"].ToString();
                    obj.ToLocation = row["ToLocation"].ToString();
                    obj.ProductCode = row["ProductCode"].ToString();
                    obj.ProductWeight = row["ProductWeight"].ToString();
                    obj.ProductCube = row["ProductCube"].ToString();

                    obj.PickQuantity = row["PickQuantity"].ToString();
                    obj.AddDate = row["AddDate"].ToString();
                    obj.ProductDescription = row["ProductDescription"].ToString();
                    obj.FullCase_SplitCase = row["FullCase/SplitCase"].ToString();
                    obj.ID = row["ID"].ToString();
                    obj.OperatorID = row["OperatorID"].ToString();
                    obj.UpdatedBy = row["UpdatedBy"].ToString();
                    obj.Comment = row["Comment"].ToString();
                    obj.TeamManager = row["TeamManager"].ToString();


                    historylist.Add(obj);

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

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllTransaction_CCA([FromBody]TransHistory trans)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[trans.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spGetTransactionHistoryRecords", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 300;
            List<TransHistory> reports = new List<TransHistory>();
            string parmvalue = trans.StartDate + trans.EndDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {

                Logging.WriteLog(trans.Site, "Info", "TransactionHistory", "GetAllTransaction_CCA", "spGetTransactionHistoryRecords", 1002, trans.DCMUser);
            }
            catch (Exception ex)
            {

            }

            try
            {

                da.Fill(ds); 

                foreach (DataRow row in ds.Tables[0].Rows)
                {

                    TransHistory obj = new TransHistory();
                    obj.BatchNumber = row["BatchNumber"].ToString();
                    obj.TaskType = row["TaskType"].ToString();

                    obj.FullName = row["FullName"].ToString();

                    if (!(string.IsNullOrEmpty(row["StartDateTime"].ToString())))
                    {
                        obj.StartDate = Convert.ToDateTime(row["StartDateTime"]).ToString("dd/MM/yyyy");
                        obj.StartTime = Convert.ToDateTime(row["StartDateTime"]).ToString("HH:mm:ss");

                    }

                    if (!(string.IsNullOrEmpty(row["EndDateTime"].ToString())))
                    {
                        obj.EndDate = Convert.ToDateTime(row["EndDateTime"]).ToString("dd/MM/yyyy");
                        obj.EndTime = Convert.ToDateTime(row["EndDateTime"]).ToString("HH:mm:ss");

                    }
                    obj.ActualTime = row["ActualTime"].ToString();
                    obj.TotalBreak = row["TotalBreak"].ToString();
                    obj.FromLocation = row["FromLocation"].ToString();
                    obj.ToLocation = row["ToLocation"].ToString();
                    obj.ProductCode = row["ProductCode"].ToString();
                    obj.ProductWeight = row["ProductWeight"].ToString();
                    obj.ProductCube = row["ProductCube"].ToString();

                    obj.PickQuantity = row["PickQuantity"].ToString();
                    obj.AddDate = row["AddDate"].ToString();
                    obj.ProductDescription = row["ProductDescription"].ToString();
                    obj.FullCase_SplitCase = row["FullCase/SplitCase"].ToString();
                    obj.ID = row["ID"].ToString();
                    obj.OperatorID = row["OperatorID"].ToString();
                    obj.UpdatedBy = row["UpdatedBy"].ToString();
                    obj.Comment = row["Comment"].ToString();
                    obj.TeamManager = row["TeamManager"].ToString();


                    reports.Add(obj);

                }

            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(trans.Site, "Error", "TransactionHistory", "GetAllTransaction","",  3002, trans.DCMUser);
                }
                catch (Exception e) { }

                return "Error Occured:While Fetching the List";
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(reports);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateTransaction([FromBody]TransHistory trans)
        {
            string sSQL = string.Empty;

            string taskenddate = trans.EndDate + " " + trans.EndTime;

            sSQL = "update DCMImport set TaskEndDateTime  = Convert(DateTime,'" + taskenddate + "',103) , UpdatedBy = '"+trans.UpdatedBy+"', Comment = '"+trans.Comment+"' where  BatchNumber ='"+trans.BatchNumber+"' and ID = " +trans.ID;
            Connection conn = new Connection();
          
            try
            {
                try
                {
                    Logging.WriteLog(trans.Site, "Info", "TransactionHistory", "UpdateTransaction", sSQL.Replace("'", "''"), 1003, trans.DCMUser);
                }
                catch (Exception ex)
                {

                }
               string result = conn.ExecuteUpdateQuery(sSQL, trans.Site);

                if (result != "Update SuccessFull")
                {
                    return "Error Occured while updating the transaction";
                }
            }
            catch (Exception ex)
            {
                try
                {
                    Logging.WriteLog(trans.Site, "Error", "TransactionHistory", "UpdateTransaction", sSQL.Replace("'", "''"), 3002, trans.DCMUser);
                }
                catch (Exception e) { }
                
                return "Error Occured while updating the transaction";
            }

            return "Transaction Updated";
        }




        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSelectedUserTransaction([FromBody]TransHistory trans)
        {
            string sSQL = string.Empty;

            List<TransHistory> historylist = new List<TransHistory>();

            string tasktype = trans.TaskType;

            switch (trans.TaskType)
            {
                case "Picks":
                    trans.TaskType = "Picks";
                    trans.OrderNumber =  "not like "+"'B%'";
                    break;
                case "B2C Picks":
                    trans.TaskType = "Picks";
                    trans.OrderNumber = "not like " + "'B%'";
                    break;
                case "ChutePick":
                    trans.TaskType = "CHUTEPICKING";
                    trans.OrderNumber = "not like " + "'B%'";
                    break;

                case "BatchPick":
                    trans.TaskType = "picks";
                    trans.OrderNumber = " like " + "'B%'";
                    break;

            }

            if (tasktype.Equals("B2C Picks"))
            {
                sSQL = "Select di.TaskType,di.CrushFactor,di.OrderNumber,Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime',di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak'," +
                       " di.PickQuantity,di.OperatorID, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube From DCMImport di left join  UserInfo ui on di.OperatorID = ui.UserID Where di.OperatorID = '" + trans.OperatorID + "' and " + " di.TaskType= '" + trans.TaskType + "'" + "and di.OrderNumber " + trans.OrderNumber +
                       " and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + trans.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + trans.EndDate + "',103),103) and di.CrushFactor = 'ZB2C' Order by di.OperatorID,di.StartDateTime";

            }
            else if (tasktype.Equals("Picks"))
            {
                sSQL = "Select di.TaskType,di.CrushFactor,ci.OrderNumber , Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime', "+
                        "di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak', di.PickQuantity,di.OperatorID, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube "+ 
                        "From DCMImport di inner join CalcEstimatedPickTime ci on di.OperatorID = ci.UserID and di.StartDateTime = ci.StartDateTime " +
                        " Where di.OperatorID = '"+trans.OperatorID+"' and di.TaskType = 'Picks'and di.OrderNumber not like 'B%' and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103) " +
                        " Between Convert(DateTime, Convert(Char(19),'"+trans.StartDate+"',103),103) And Convert(DateTime, Convert(Char(19),'"+trans.EndDate+"',103),103) and di.CrushFactor <> 'ZB2C' Order by di.OperatorID,di.StartDateTime";

            }
            else
            {
                sSQL = "Select di.TaskType,di.CrushFactor,di.OrderNumber,Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime',di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak'," +
                       " di.PickQuantity,di.OperatorID, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube From DCMImport di left join  UserInfo ui on di.OperatorID = ui.UserID Where di.OperatorID = '" + trans.OperatorID + "' and " + " di.TaskType= '" + trans.TaskType + "'" + "and di.OrderNumber " + trans.OrderNumber +
                       " and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + trans.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + trans.EndDate + "',103),103)  Order by di.OperatorID,di.StartDateTime";
            }
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
                    obj.CrushFactor = row["CrushFactor"].ToString();
                    obj.FromLocation = row["FromLocation"].ToString();
                    obj.ToLocation = row["ToLocation"].ToString();
                    obj.ProductCode = row["ProductCode"].ToString();
                    obj.ProductWeight = row["ProductWeight"].ToString();
                    obj.ProductCube = row["ProductCube"].ToString();



                    historylist.Add(obj);
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


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSelectedUserTransactionProdRep([FromBody]TransHistory trans)
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

            sSQL = "Select di.TaskType,di.OrderNumber,Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime',di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak'," +
                   " di.PickQuantity,di.OperatorID, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube From DCMImport di left join  UserInfo ui on di.OperatorID = ui.UserID Where di.OperatorID = '" + trans.OperatorID + "' and " + " di.TaskType= 'Replenishment'" + 
                   " and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + trans.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + trans.EndDate + "',103),103)  Order by di.OperatorID,di.StartDateTime";

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


                    historylist.Add(obj);
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


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSelectedUserTransactionProd_RPFC([FromBody]TransHistory trans)
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

            sSQL = "Select di.TaskType,di.OrderNumber,Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime',di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak'," +
                   " di.PickQuantity,di.OperatorID, di.PalletsHandled,di.CasesHandled, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube  From DCMImport di left join  UserInfo ui on di.OperatorID = ui.UserID Where di.OperatorID = '" + trans.OperatorID + "' and " + " di.TaskType= 'Dynamic Picks'" +
                   " and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + trans.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + trans.EndDate + "',103),103)  Order by di.OperatorID,di.StartDateTime";

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
                    obj.PalletsHandled = Convert.ToInt32(row["PalletsHandled"]);
                    obj.CasesHandled = Convert.ToInt32(row["CasesHandled"].ToString());
                    obj.OperatorID = row["OperatorID"].ToString();
                    obj.FromLocation = row["FromLocation"].ToString();
                    obj.ToLocation = row["ToLocation"].ToString();
                    obj.ProductCode = row["ProductCode"].ToString();
                    obj.ProductWeight = row["ProductWeight"].ToString();
                    obj.ProductCube = row["ProductCube"].ToString();


                    historylist.Add(obj);
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


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSelectedUserTransactionProd_Dubbo([FromBody]TransHistory trans)
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

            sSQL = "Select di.TaskType,di.OrderNumber,Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime',di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak'," +
                   " di.PickQuantity,di.OperatorID, di.PalletsHandled,di.CasesHandled, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube  From DCMImport di left join  UserInfo ui on di.OperatorID = ui.UserID Where di.OperatorID = '" + trans.OperatorID + "' and " + " di.TaskType= 'Dynamic Picks'" +
                   " and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + trans.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + trans.EndDate + "',103),103)  Order by di.OperatorID,di.StartDateTime";

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
                    //obj.PalletsHandled = Convert.ToInt32(row["PalletsHandled"]);
                    //obj.CasesHandled = Convert.ToInt32(row["CasesHandled"].ToString());
                    obj.OperatorID = row["OperatorID"].ToString();
                    obj.FromLocation = row["FromLocation"].ToString();
                    obj.ToLocation = row["ToLocation"].ToString();
                    obj.ProductCode = row["ProductCode"].ToString();
                    obj.ProductWeight = row["ProductWeight"].ToString();
                    obj.ProductCube = row["ProductCube"].ToString();


                    historylist.Add(obj);
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









        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSelectedUserTransactionProdMove([FromBody]TransHistory trans)
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

            sSQL = "Select di.TaskType,di.OrderNumber,Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime',di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak'," +
                   " di.PickQuantity,di.OperatorID, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube From DCMImport di left join  UserInfo ui on di.OperatorID = ui.UserID Where di.OperatorID = '" + trans.OperatorID + "' and " + " di.TaskType= 'Move'" +
                   " and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + trans.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + trans.EndDate + "',103),103)  Order by di.OperatorID,di.StartDateTime";

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

                    historylist.Add(obj);
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


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSelectedUserTransactionProdPack([FromBody]TransHistory trans)
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

            sSQL = "Select di.TaskType,di.OrderNumber,Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime',di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak'," +
                   " di.PickQuantity,di.OperatorID, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube From DCMImport di left join  UserInfo ui on di.OperatorID = ui.UserID Where di.OperatorID = '" + trans.OperatorID + "' and " + " di.TaskType= 'Pack'" +
                   " and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + trans.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + trans.EndDate + "',103),103)  Order by di.OperatorID,di.StartDateTime";

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


                    historylist.Add(obj);
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


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllSelectedUserTransactionProdPutaways([FromBody]TransHistory trans)
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

            sSQL = "Select di.TaskType,di.OrderNumber,Convert(DateTime,di.StartDateTime,103) 'StartDateTime',Convert(DateTime,IsNull(di.TaskEndDateTime,di.EndDateTime),103)'EndDateTime',di.ActualTime,IsNull(di.TotalBreak, 0)'TotalBreak'," +
                   " di.PickQuantity,di.OperatorID, IsNull(di.FromLocation, '')'FromLocation',IsNull(di.ToLocation, '')'ToLocation', di.ProductCode, di.ProductWeight, di.ProductCube From DCMImport di left join  UserInfo ui on di.OperatorID = ui.UserID Where di.OperatorID = '" + trans.OperatorID + "' and " + " di.TaskType= 'Putaways'" +
                   " and Convert(DateTime, Convert(Char(19),di.StartDateTime,103),103)  Between Convert(DateTime, Convert(Char(19),'" + trans.StartDate + "',103),103) And Convert(DateTime, Convert(Char(19),'" + trans.EndDate + "',103),103)  Order by di.OperatorID,di.StartDateTime";

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

                    historylist.Add(obj);
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
    }
}
