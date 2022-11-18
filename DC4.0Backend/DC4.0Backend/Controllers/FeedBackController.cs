using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Web.Http;
using System.Data.SqlClient;
using System.Data;
using DC4._0Backend.Models;
using System.Configuration;
using System.Text.Json;
using System.Xml;


namespace DC4._0Backend.Controllers
{
    public class FeedBackController : ApiController
    {

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertFeedback([FromBody] FeedBack feedBack)
        {
            Crypto crypto = new Crypto();

            string sSQL = string.Empty;
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;

            try
            {


                sSQL = "Insert into Feedback(UserName,Module,Description) values('" + feedBack.UserName + "','" + feedBack.Module + "','" + feedBack.Description + "')";

                SqlCommand sqlCommand = new SqlCommand(sSQL, conn);

                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                DataSet ds = new DataSet();
                sqlDataAdapter.Fill(ds);

            }
            catch (Exception ex)
            {
                return "Error Occured while Entering the User:" + ex.Message;

            }


            return "FeedBack is added into the database";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetFullName([FromBody] FeedBack feedBack)
        {
            string sSQL = "Select FirstName +' ' + SurName as 'FullName' from UserLoginPermission where UserName = '" + feedBack.UserName + "'";
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            List<string> FullName = new List<string>();

            try
            {
                SqlCommand command = new SqlCommand(sSQL, conn);
                SqlDataAdapter da = new SqlDataAdapter(command);
                DataSet data = new DataSet();
                da.Fill(data);

                if (data.Tables[0].Rows.Count > 0)
                {
                    FullName.Add(data.Tables[0].Rows[0][0].ToString());
                    
                }
              

            }
            catch (Exception ex)
            {
                return "Error Occured while Entering the User:" + ex.Message;

            }


            return JsonSerializer.Serialize(FullName);

        }
    }
}