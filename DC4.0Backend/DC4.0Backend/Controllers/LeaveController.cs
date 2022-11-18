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
    public class LeaveController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetAllLeave([FromBody] Leave leave)
        {

            string sSQL = String.Empty;

            sSQL = "Select SerialID, LeaveCode ,LeaveDesc ,Paid,EmpType, LeaveColor From Leave";

            Connection connection = new Connection();

            List<Leave> entryList = new List<Leave>();
            try
            {
                DataSet ds = connection.ExecuteSelectQuery(sSQL, leave.Site);

                if (ds.Tables[0].Rows.Count > 0)
                {


                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        Leave obj = new Leave();
                        obj.SerialID = ds.Tables[0].Rows[i]["SerialID"].ToString();
                        obj.LeaveCode = ds.Tables[0].Rows[i]["LeaveCode"].ToString();
                        obj.LeaveDesc = ds.Tables[0].Rows[i]["LeaveDesc"].ToString();
                        obj.EmpType = ds.Tables[0].Rows[i]["EmpType"].ToString();
                        obj.Paid = ds.Tables[0].Rows[i]["Paid"].ToString();
                        obj.LeaveColor = ds.Tables[0].Rows[i]["LeaveColor"].ToString();

                        entryList.Add(obj);

                    }

                }
            }
            catch (Exception ex)
            {
                return "Error Occured:While Fetching the Leave";
            }


            return JsonSerializer.Serialize(entryList);

        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteLeave([FromBody] Leave leave)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
            sSQL = "Select count(*) from Leave  Where SerialID = " + leave.SerialID;

            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, leave.Site));

                if (count == 0)
                {
                    return " Leave Record does not Exist";
                }
                else
                {
                    sSQL = "select count(*) from EmpLeaveDetails where LeaveType='" + leave.LeaveCode + "'";
                    count = int.Parse(conn.ReturnSingleValue(sSQL, leave.Site));

                    if (count > 0)
                    {
                        return leave.LeaveCode + " is currently assigned and cannot be deleted.";
                    }
                    else
                    {
                        sSQL = "Delete from Leave Where SerialID = " + leave.SerialID;
                       string result =  conn.ExecuteDeleteQuery(sSQL, leave.Site);

                        if (result != "Delete SuccessFull")
                        {
                            return "Error While deleting the Record";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                  return "Error while deleting the Record." + ex.Message;
            }


            return "Record deleted";

        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertNewLeave([FromBody] Leave leave)
        {
            string sSQL = string.Empty;
            Connection conn = new Connection();
            sSQL = "";
            try
            {
                
                
                    sSQL = " SELECT count(*) FROM Leave where LeaveCode =  '" + leave.LeaveCode+"' and EmpType = '"+ leave.EmpType +"'  ";
                 int   count = int.Parse(conn.ReturnSingleValue(sSQL, leave.Site));
                    if (count > 0)
                    {
                        return "Dulpicate Record Found";
                    }
                    else
                    {
                        if ((leave.Paid.Equals("1")) || (leave.Paid.Equals("Y")))
                        {
                            leave.Paid = "Y";
                        }
                        else
                        {
                            leave.Paid = "N";
                        }


                        sSQL = "Insert Into Leave Values('" +leave.LeaveCode+"','" + leave.LeaveDesc + "','" + leave.Paid + "','" + leave.EmpType + "','"+leave.LeaveColor+"')";

                        string result =  conn.ExecuteInsertQuery(sSQL, leave.Site);

                        if (result != "Insert SuccessFull")
                        {
                            return "Error Occured while inserting the Leave Record";
                        }
                    }
                
            }
            catch (Exception ex)
            {
               return "Error Occured while inserting the Leave Record";
            }

            return "New Leave Inserted";

        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateLeave([FromBody] Leave leave)
        {

            string sSQL = string.Empty;

            if ((leave.Paid.Equals("1")) || (leave.Paid.Equals("Y")))
            {
                leave.Paid = "Y";
            }
            else if ((leave.Paid.Equals("0") || leave.Paid.Equals("") || leave.Paid.Equals("N")))
            {
                leave.Paid = "N";
            }

            Connection conn = new Connection();
         
            sSQL = "Select count(*) from Leave Where SerialID ='" + leave.SerialID + "'  And LeaveCode = '" + leave.LeaveCode + "' "
              + " And LeaveDesc=  '" + leave.LeaveDesc + "' "
              + " And Paid=  '" + leave.Paid + "' "
              + " And LeaveColor=  '" + leave.LeaveColor+ "' "
            + " And EmpType=  '" + leave.EmpType + "' ";

             
            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, leave.Site));

                if (count > 0)
                {
                    return "No changes Made";
                }
                else
                {
                    sSQL = " SELECT count(*) FROM Leave where LeaveCode =  '" + leave.LeaveCode + "' and EmpType= '"+leave.EmpType+"' ";

                    count = int.Parse(conn.ReturnSingleValue(sSQL, leave.Site));
                    if (count > 1)
                    {
                        return "Dulpicate Record Found";
                    }
                    else
                    {

                        sSQL = "Update Leave Set LeaveCode = '" +leave.LeaveCode+ "', LeaveDesc = '" +leave.LeaveDesc+ "', Paid = '" +leave.Paid+ "', EmpType = '" +leave.EmpType+ "', LeaveColor='"+leave.LeaveColor+"' Where SerialID =" +leave.SerialID ;
                      string result =   conn.ExecuteUpdateQuery(sSQL, leave.Site);

                        if (result != "Update SuccessFull")
                        {
                            return "Error Occured while updating the Leave Record";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
               return "Error Occured while updating the Leave Record";
            }

            return "Leave Updated";

        }


    }
}
