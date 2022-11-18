using DC4._0Backend.Models;
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

namespace DC4._0Backend.Controllers.Reports
{
    public class LostTimeController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetLostTime([FromBody] LostTime lt)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[lt.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("spLostTimeReport", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            List<LostTime> reports = new List<LostTime>();
            string parmvalue = lt.FromDate + lt.ToDate;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);
           
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.SelectCommand.CommandTimeout = 150;
            DataSet ds = new DataSet();
            try
            {
                Logging.WriteLog(lt.Site, "Info", "LostTimeReport", "GetLostTime", "spLostTimeReport", 1002, lt.DCMUser);
            }
            catch (Exception ex)
            {

            }
            try
            {
                da.Fill(ds);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    LostTime obj = new LostTime();
                    obj.UserName = ds.Tables[0].Rows[i]["UserID"].ToString();
                    obj.FirstName = ds.Tables[0].Rows[i]["FirstName"].ToString();
                    obj.SurName = ds.Tables[0].Rows[i]["Surname"].ToString();
                    obj.TeamManager = ds.Tables[0].Rows[i]["TeamManager"].ToString();
                    obj.ShiftCode = ds.Tables[0].Rows[i]["ShiftCode"].ToString();
                    obj.ShiftType = ds.Tables[0].Rows[i]["ShiftType"].ToString();
                    obj.Type = ds.Tables[0].Rows[i]["Type"].ToString();


                    obj.FullName = obj.FirstName + " " + obj.SurName;
                    obj.StartDate = ds.Tables[0].Rows[i]["StartDate"].ToString();


                    DateTime date = DateTime.Parse(obj.StartDate);
                    obj.StartDate = date.ToString("dd/MM/yyyy");

                    obj.ExpectedStart = ds.Tables[0].Rows[i]["ExpectedStart"].ToString();
                    obj.ActualStart = ds.Tables[0].Rows[i]["ActualStart"].ToString();
                    obj.StartLostTime = ds.Tables[0].Rows[i]["StartLostTime"].ToString();
                    obj.ExpectedEnd = ds.Tables[0].Rows[i]["ExpectedEnd"].ToString();
                    obj.ActualEnd = ds.Tables[0].Rows[i]["ActualEnd"].ToString();
                    obj.EndLostTime = ds.Tables[0].Rows[i]["EndLostTime"].ToString();
                    obj.Tolerance = ds.Tables[0].Rows[i]["Tolerance"].ToString();
                    obj.UserRole = ds.Tables[0].Rows[i]["UserRole"].ToString();

                    reports.Add(obj);

                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(lt.Site, "Error", "LostTimeReport", "GetLostTime", "spLostTimeReport", 3002, lt.DCMUser);

            }
            return JsonSerializer.Serialize(reports);
        }
        
    }
}
