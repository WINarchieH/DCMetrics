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
    public class DCMUserController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string Add([FromBody] DCMUser user)
        {
            Crypto crypto = new Crypto();

            if (user.AccessSite.Contains(","))
            {
                user.AccessSite= user.AccessSite.Replace(",", "-");
            }
            string randompassword = string.Empty;
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            string sSQL = "Select count(*) from UserLoginPermission where UserName = '" + user.Username + "'";
            try
            {
                SqlCommand command = new SqlCommand(sSQL, conn);
                SqlDataAdapter da = new SqlDataAdapter(command);
                DataSet data = new DataSet();
                da.Fill(data);
                if (int.Parse(data.Tables[0].Rows[0][0].ToString()) == 0)
                {
                    randompassword = PasswordGenerator();
                    string EncryptedPassword = crypto.psEncrypt(randompassword);

                    sSQL = "Insert into UserLoginPermission(UserName,Password,Warehouse,UserGroup,FirstName,SurName,Email, AddedBy) values('" + user.Username + "','" + EncryptedPassword + "','" + user.AccessSite + "','" + user.UserGroup + "','"+user.FirstName+"','"+user.LastName+"','"+user.Email+"','"+user.Addedby+"')";

                    SqlCommand sqlCommand = new SqlCommand(sSQL, conn);

                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                    DataSet ds = new DataSet();
                    sqlDataAdapter.Fill(ds);
                }
                else
                {
                    return "Invalid or Duplicate UserID";
                }

            }
            catch (Exception ex)
            {

                sSQL = "delete from UserLoginPermission where UserName =  '" + user.Username + "'";

                SqlCommand command4 = new SqlCommand(sSQL, conn);
                SqlDataAdapter da4 = new SqlDataAdapter(command4);
                DataSet data4 = new DataSet();
                da4.Fill(data4);


                return "Error Occured while Entering the User:" + ex.Message;

            }

            SendMail(user, randompassword);
            return "User is added into the database";
        }

        public async void SendMail(DCMUser user, string randomPassword)
        {
            
            string emailAdress = string.Empty;
            string UserId = string.Empty;
            string Password = string.Empty;


            string sConfigFile = AppDomain.CurrentDomain.SetupInformation.ApplicationBase + "Resources\\Ipconfig.xml";


            StreamReader reader = File.OpenText(AppDomain.CurrentDomain.BaseDirectory + "\\EmailTemplates\\EMAILTEST.html"); // Path to your 
                                                                                                                             // HTML file
            string Emailbody = reader.ReadToEnd();
            string website = ReadConfig();
            Emailbody = Emailbody.Replace("{FirstName}", user.FirstName);
            Emailbody = Emailbody.Replace("{Website}", website);
            Emailbody = Emailbody.Replace("{UserName}", user.Username);
            Emailbody = Emailbody.Replace("{Password}", randomPassword);
            Emailbody = Emailbody.Replace("'", "''");


            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString);
            SqlCommand cmd = new SqlCommand("spSendWelcomeEmail", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@body", Emailbody);
            cmd.Parameters.AddWithValue("@To", user.Email);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
           
            DataSet ds = new DataSet();
            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {

            }
            finally
            {
                sqlConnection.Close();
            }
        }
           

        private static string PasswordGenerator()
        {
            string result = string.Empty;

            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (res.Length <= 8)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }

            return res.ToString();
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetUserGroup([FromBody] DCMUser user)
        {
           
            List<Usergroup> UserGroup = new List<Usergroup>();

            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            string sSQL = "select Usergroup from Usergroup where AccessLevel <= (Select AccessLevel  from Usergroup where Usergroup  = (Select UserGroup from UserLoginPermission where UserName ='" + user.Addedby + "' ))";
            try
            {
                SqlCommand command = new SqlCommand(sSQL, conn); 
                SqlDataAdapter da = new SqlDataAdapter(command);
                DataSet ds = new DataSet();
                da.Fill(ds);

                if (ds.Tables[0].Rows.Count >0 )
                        {

                    UserGroup = (from DataRow dr in ds.Tables[0].Rows
                                 select new Usergroup
                                 {

                                     UserGroup = dr["Usergroup"].ToString()
                                 }).ToList();


                }

            }
            catch (Exception ex)
            {

            }

            return JsonSerializer.Serialize(UserGroup);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string GetWarehosueSites()
        {

            List<WarehouseSite> WarehouseSites = new List<WarehouseSite>();
    
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            string sSQL = "Select [Site] from WarehouseSites order by Site ";
            try
            {
                SqlCommand command = new SqlCommand(sSQL, conn);
                SqlDataAdapter da = new SqlDataAdapter(command);
                DataSet ds = new DataSet();
                da.Fill(ds);


                if (ds.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {

                    
                        WarehouseSite site = new WarehouseSite();
                        
                        site.value = ds.Tables[0].Rows[i]["Site"].ToString();
                        WarehouseSites.Add(site);
                    }
                }

            }
            catch (Exception ex)
            {

            }

           

            return JsonSerializer.Serialize(WarehouseSites);
        }

        private string ReadConfig()
        {
            string sConfigFile = string.Empty;


            string website = string.Empty;
            string wsip = string.Empty;
            string wsport = string.Empty;

            try
            {
                sConfigFile = AppDomain.CurrentDomain.SetupInformation.ApplicationBase + "Resources\\Ipconfig.xml";


                if (System.IO.File.Exists(sConfigFile))
                {

                    XmlDocument oXML = new XmlDocument();
                    oXML.Load(sConfigFile);
                    //Read File Settings
                    wsip = oXML.DocumentElement.SelectSingleNode("/DCMetrics/wsip").InnerText;
                    wsport = oXML.DocumentElement.SelectSingleNode("/DCMetrics/wsport").InnerText;

                    website = "http://" + wsip + ":" + wsport;

                }

            }
            catch (Exception ex)
            {

            }
            return website;
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string CreateUserGroup(Usergroup usergroup)
        {
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            string sSQL = " insert into UserGroup(UserGroup, AccessLevel) values ('" + usergroup.GroupName + "',0)";

            SqlCommand command = new SqlCommand(sSQL, conn);

            SqlDataAdapter da = new SqlDataAdapter(command);
            string result = string.Empty;

            try
            {
                conn.Open();
                int rows = command.ExecuteNonQuery();

                if (rows > 0)
                {
                    conn.Close();

                    string[] ScreenNames = usergroup.ScreenName.Split(',');
                    DataTable tbl = new DataTable();
                    tbl.Columns.Add(new DataColumn("FormObject", typeof(string)));
                    tbl.Columns.Add(new DataColumn("UserGroup", typeof(string)));

                    for (int i = 0; i < ScreenNames.Length; i++)
                    {
                        DataRow dr = tbl.NewRow();

                        dr["FormObject"] = ScreenNames[i];  
                        dr["UserGroup"] = usergroup.GroupName;



                        tbl.Rows.Add(dr);

                    }

                    string connection = ConfigurationManager.ConnectionStrings[usergroup.Site].ConnectionString;
                    SqlConnection con = new SqlConnection(connection);
                    //create object of SqlBulkCopy which help to insert  
                    SqlBulkCopy objbulk = new SqlBulkCopy(con);

                    //assign Destination table name  
                    objbulk.DestinationTableName = "DCMScreenAccess";
                    objbulk.ColumnMappings.Add("FormObject", "FormObject");
                    objbulk.ColumnMappings.Add("UserGroup", "UserGroup");
              

                    try
                    {
                        con.Open();

                        //insert bulk Records into DataBase.  
                        objbulk.WriteToServer(tbl);

                        result = " New UserGroup Created";
                    }
                    catch (Exception ex)
                    {


                    }
                    finally
                    {
                        con.Close();
                    }
                }
                else
                {
                   
                }


            }
            catch (Exception ex)
            {

            }


            return result;
        }


        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateDCMUser([FromBody] DCMUser user)
        {
            

            if (user.AccessSite.Contains(","))
            {
                user.AccessSite = user.AccessSite.Replace(",", "-");
            }
           
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            string sSQL = "update UserLoginPermission set FirstName= '" + user.FirstName + "',SurName='" + user.LastName + "', Email='" + user.Email + "',UserGroup='" + user.UserGroup + "', Warehouse='" + user.AccessSite + "' where UserName = '" + user.Username+"' ";
            try
            {
                SqlCommand command = new SqlCommand(sSQL, conn);
                SqlDataAdapter da = new SqlDataAdapter(command);
                DataSet data = new DataSet();
                da.Fill(data);
                
              

            }
            catch (Exception ex)
            {

                sSQL = "delete from UserLoginPermission where UserName =  '" + user.Username + "'";

                SqlCommand command4 = new SqlCommand(sSQL, conn);
                SqlDataAdapter da4 = new SqlDataAdapter(command4);
                DataSet data4 = new DataSet();
                da4.Fill(data4);


                return "Error Occured while Entering the User:" + ex.Message;

            }

            
            return "User is Updated in the DC Metrics";
        }



        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteDCMUser([FromBody] DCMUser user)
        {



            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            string sSQL = "delete from UserLoginPermission where UserName = '"+user.Username+"'";
           try {
                SqlCommand command = new SqlCommand(sSQL, conn);
                SqlDataAdapter da = new SqlDataAdapter(command);
                DataSet data = new DataSet();
                da.Fill(data);



            }
            catch (Exception ex)
            {

               


                return "Error Occured while Entering the User:" + ex.Message;

            }


            return "User is deleted in the DC Metrics";
        }



    }

}

