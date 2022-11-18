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
    public class OrderTimeMatrixController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetAllOrderMatrix([FromBody] OrderTimeMatrixBase order)
        {

            Connection conn = new Connection();
            string sSQL = string.Empty;
            List<OrderTimeMatrixBase> list = new List<OrderTimeMatrixBase>();
            try
            {
                sSQL = "Select Zone,ActivityName 'Activity',TimePerOrder,TimePerContainer,PersonalFatigueTime 'PF&D Time (%)',ItemsPerContainer , ID as  'SerialID' From MaintainOrderTime";

                try
                {
                    Logging.WriteLog(order.Site, "Info", "OrderTimeMatrix", "GetAllOrderMatrix", sSQL.Replace("'", "''"), 1002, order.DCMUser);
                }
                catch (Exception ex)
                {
                }

                DataSet ds = conn.ExecuteSelectQuery(sSQL, order.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow r in ds.Tables[0].Rows)
                    {
                        OrderTimeMatrixBase obj = new OrderTimeMatrixBase();
                        obj.Zone = r["Zone"].ToString();
                        obj.Activity = r["Activity"].ToString();
                        obj.TimePerOrder = Convert.ToDouble(r["TimePerOrder"].ToString());
                        obj.TimePerContainer = Convert.ToDouble(r["TimePerContainer"].ToString());
                        obj.PFDTime = Convert.ToDouble(r["PF&D Time (%)"].ToString());
                        obj.ItemPerContainer = Convert.ToInt16(r["ItemsPerContainer"].ToString());
                        obj.SerialID = r["SerialID"].ToString();
                        list.Add(obj);
                    }
                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(order.Site, "Error", "OrderTimeMatrix", "GetAllOrderMatrix", sSQL.Replace("'", "''"), 3002, order.DCMUser);
                return "Error while Fetching the List";
            }

            return JsonSerializer.Serialize(list);

        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertNewOrderMatrix([FromBody] OrderTimeMatrixBase order)
        {

            Connection conn = new Connection();
            string sSQL = string.Empty;
            try
            {
                sSQL = "Select COUNT(*) From MaintainOrderTime  Where Zone = '" +order.Zone+ "' And ActivityName = '" +order.Activity+ "'";

                int count = int.Parse(conn.ReturnSingleValue(sSQL, order.Site));

                if (count > 0)
                {
                    try
                    {
                        Logging.WriteLog(order.Site, "Warning", "OrderTimeMatrix", "DeleteOrderMatrix", sSQL.Replace("'", "''"), 2001, order.DCMUser);
                    }
                    catch (Exception ex)
                    {
                    }
                    return "Duplicate record found";
                }

                sSQL = "Insert Into MaintainOrderTime(Zone, ActivityName, TimePerOrder, TimePerContainer, PersonalFatigueTime, ItemsPerContainer)"
        + " Values(' "+order.Zone+ "','" +order.Activity+ "',"+order.TimePerOrder+ "," +order.TimePerContainer+","+order.PFDTime+ "," + order.ItemPerContainer + ")";

                try
                {
                    Logging.WriteLog(order.Site, "Info", "OrderTimeMatrix", "InsertOrderMatrix", sSQL.Replace("'", "''"), 1001, order.DCMUser);
                }
                catch (Exception ex)
                {
                }


               string result  = conn.ExecuteInsertQuery(sSQL, order.Site);

                if (result != "Insert SuccessFull")
                {
                    return "New Time Order Creation Failed";
                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(order.Site, "Error", "OrderTimeMatrix", "InsertNewOrderMatrix", sSQL.Replace("'", "''"), 3001, order.DCMUser);
                return "Error while Creating the New Order Time with Error"+ex.Message;
            }
                

            return "New Time Order Created";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateOrderMatrix([FromBody] OrderTimeMatrixBase order)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;

            try
            {
                sSQL = "Update MaintainOrderTime Set  TimePerOrder = " +order.TimePerOrder+ ", TimePerContainer = " +order.TimePerContainer+ ",PersonalFatigueTime = "+order.PFDTime+ ", ActivityName = '" +order.Activity+"'"

                        + ", Zone = '" +order.Zone+ "', ItemsPerContainer = " +order.ItemPerContainer+ " Where ID =" +order.SerialID ;


                try
                {
                    Logging.WriteLog(order.Site, "Info", "OrderTimeMatrix", "UpdateOrderMatrix", sSQL.Replace("'", "''"), 1003, order.DCMUser);
                }
                catch (Exception ex)
                {
                }

               string result =  conn.ExecuteUpdateQuery(sSQL, order.Site);

                if (result != "Update SuccessFull")
                {
                    return "Time Order Matrix Update Failed";
                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(order.Site, "Error", "OrderTimeMatrix", "UpdateOrderMatrix", sSQL.Replace("'", "''"), 3003, order.DCMUser);
                return "Error while Updating Order Time with Error" + ex.Message;
            }

            return "Time Order Updated";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteOrderMatrix([FromBody] OrderTimeMatrixBase order)
        {
            Connection conn = new Connection();
            string sSQL = string.Empty;

            try
            {
                sSQL = "Delete From MaintainOrderTime Where  ActivityName = '" + order.Activity + "' and Zone = '" + order.Zone + "'";

                try
                {
                    Logging.WriteLog(order.Site, "Info", "OrderTimeMatrix", "DeleteOrderMatrix", sSQL.Replace("'", "''"), 1007, order.DCMUser);
                }
                catch (Exception ex)
                {
                }
                    string result = conn.ExecuteDeleteQuery(sSQL, order.Site);

                if (result != "Delete SuccessFull")
                {
                    return "Error while Deleting Order Time";
                }
        }
            catch (Exception ex)
            {
                Logging.WriteLog(order.Site, "Error", "OrderTimeMatrix", "DeleteOrderMatrix", sSQL.Replace("'", "''"), 3007, order.DCMUser);
                return "Error while Deleting Order Time with Error" + ex.Message;
            }
            return "Order Time Deleted";
            }
    }
}
