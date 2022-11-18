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
using  DC4._0Backend.Models;
using System.Xml;
using Login = DC4._0Backend.Models.Login;

namespace DC4._0Backend.Controllers
{

    public class LoginController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string LoginCheck([FromBody]Login login)
        {

            Dictionary<string, string> result = new Dictionary<string, string>();

            Crypto cryptoobj = new Crypto();
            List<string> sites = new List<string>();
            string sSQL = string.Empty;
            sSQL = "select UserName,Password,Warehouse from UserLoginPermission where username = '" + login.Username + "'";
            string sqlUserName, sqlPassword = string.Empty;
            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString);
            SqlCommand cmd = new SqlCommand(sSQL, sqlconnection);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
                if (ds.Tables[0].Rows.Count == 1)
                {
                    sqlUserName = ds.Tables[0].Rows[0]["UserName"].ToString();
                    sqlPassword = ds.Tables[0].Rows[0]["Password"].ToString();
                    sqlPassword = cryptoobj.psDecrypt(sqlPassword);
                    if ((sqlUserName.Equals(login.Username) && (sqlPassword.Equals(login.Password))))
                    {
                        string[] warehouses = ds.Tables[0].Rows[0]["Warehouse"].ToString().Split('-');

                        foreach (string str in warehouses)
                        {
                            sites.Add(str);
                        }

                        result.Add("output", "OK");
                        result.Add("Sites", JsonSerializer.Serialize(sites));
                    }

                }
            }
            catch (Exception ex)
            {
                return "Error Occured:" + ex.Message;
            }


            return JsonSerializer.Serialize(result);
        }



        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string AssignSite([FromBody] DCMUser DCMUser)
        {
            if (!(string.IsNullOrEmpty(DCMUser.Site)))
            {
                WareHouse.WarehouseSite = DCMUser.Site;

            }

            List<NavBarItem> Report = new List<NavBarItem>();
            List<NavBarItem> Maintenance = new List<NavBarItem>();
            List<NavBarItem> TimeandAttendance = new List<NavBarItem>();
            List<NavBarItem> Benchmark = new List<NavBarItem>();

            List<NavBarItem> Payroll = new List<NavBarItem>();
            List<NavBarItem> Dashboard = new List<NavBarItem>();

            List<NavBarItem> UserManagement = new List<NavBarItem>();
            List<NavBarItem> HomeScreenDashboard = new List<NavBarItem>();

            string UserGroup = GetUserGroup(DCMUser.Username);

            string sSQL = "select Name,URL, Header from DCMScreen where Name in ( select FormObject from DCMScreenAccess where UserGroup = '" + UserGroup + "')  order by URL asc";
            Connection conn = new Connection();
            DataSet ds = conn.ReturnCompleteDataSet(sSQL, DCMUser.Site);
            Dictionary<String, List<NavBarItem>> navbar = new Dictionary<string, List<NavBarItem>>();

            foreach (DataRow row in ds.Tables[0].Rows)
            {
                NavBarItem nav = new NavBarItem();

                if (row["URL"].ToString().Contains("Maintenance"))
                {
                    nav.Name = row["Name"].ToString().Trim();
                    nav.URL = row["URL"].ToString();
                    nav.Header = row["Header"].ToString();
                    Maintenance.Add(nav);
                }
                else if (row["URL"].ToString().Contains("Report"))
                {
                    nav.Name = row["Name"].ToString().Trim();
                    nav.URL = row["URL"].ToString();
                    nav.Header = row["Header"].ToString();
                    Report.Add(nav);
                }
                else if (row["URL"].ToString().Contains("TimeandAttendance"))
                {
                    nav.Name = row["Name"].ToString().Trim();
                    nav.URL = row["URL"].ToString();
                    nav.Header = row["Header"].ToString();
                    TimeandAttendance.Add(nav);
                }
                else if (row["URL"].ToString().Contains("UserManagement"))
                {
                    nav.Name = row["Name"].ToString().Trim();
                    nav.URL = row["URL"].ToString();
                    nav.Header = row["Header"].ToString();
                    UserManagement.Add(nav);
                }
                else if (row["URL"].ToString().Contains("Benchmark"))
                {
                    nav.Name = row["Name"].ToString().Trim();
                    nav.URL = row["URL"].ToString();
                    nav.Header = row["Header"].ToString();
                    Benchmark.Add(nav);
                }
                else if (row["URL"].ToString().Contains("Payroll"))
                {
                    nav.Name = row["Name"].ToString().Trim();
                    nav.URL = row["URL"].ToString();
                    nav.Header = row["Header"].ToString();
                    Payroll.Add(nav);
                }
                else if (row["URL"].ToString().Contains("DashBoard"))
                {
                    nav.Name = row["Name"].ToString().Trim();
                    nav.URL = row["URL"].ToString();
                    nav.Header = row["Header"].ToString();
                    Dashboard.Add(nav);
                }
                else if (row["URL"].ToString().Contains("HomeScreenDashboard"))
                {
                    nav.Name = row["Name"].ToString().Trim();
                    nav.URL = row["URL"].ToString();
                    nav.Header = row["Header"].ToString();
                    Dashboard.Add(nav);
                }

            }

            navbar.Add("Report", Report);
            navbar.Add("Time And Attendance", TimeandAttendance);
            navbar.Add("Maintenance", Maintenance);
            navbar.Add("Benchmark", Benchmark);
            navbar.Add("Payroll", Payroll);
            navbar.Add("Dashboard", Dashboard);
            navbar.Add("User Management", UserManagement);
            navbar.Add("HomeScreenDashboard", HomeScreenDashboard);
            return JsonSerializer.Serialize(navbar);
        }


        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string Dash_PickedUnits([FromBody] Dashboard_PickedUnits  dash )
        {
            if (!(string.IsNullOrEmpty(dash.Site)))
            {
                WareHouse.WarehouseSite = dash.Site;

            }

            DateTime datetime1 = DateTime.Parse(dash.StartDate);
            dash.StartDate = datetime1.ToString("dd/MM/yyyy");
            DateTime datetime2 = DateTime.Parse(dash.EndDate);
            dash.EndDate = datetime2.ToString("dd/MM/yyyy");

            string parmvalue = dash.StartDate + dash.EndDate;

          
            
            List<string> ChutePick = new List<string>();
            List<string> Pick = new List<string>();
            List<string> BatchPick = new List<string>();

            List<string[]> data = new List<string[]>();
            Dictionary<string, string[]> dictionary = new Dictionary<string, string[]>();
          

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[dash.Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spDash_PickedUnits", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Parm", parmvalue);            

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);


                int[] chutepick = new int[ds.Tables[0].Rows.Count];
                int[] pick = new int[ds.Tables[0].Rows.Count];
                int[] batchpick = new int[ds.Tables[0].Rows.Count];
                string[] Dates = new string[ds.Tables[0].Rows.Count];
           string[] headers = { "Date", "Chute Pick", "Batch Pick", "Pick" };

               // string[,] temp = new string[ds.Tables[0].Rows.Count,4 ] ;
               
                data.Add(headers);

                for (int i = 0; i <= ds.Tables[0].Rows.Count; i++)
                {
                    string date = ds.Tables[0].Rows[i]["Dates"].ToString();
                    DateTime dt = DateTime.Parse(date);
                    date = dt.ToString("dd MMM");
                    string[] temparr = { date, ds.Tables[0].Rows[i]["ChutePicks"].ToString(), ds.Tables[0].Rows[i]["BatchPick"].ToString(), ds.Tables[0].Rows[i]["Picks"].ToString() };
                    data.Add(temparr);

                }

            }
            catch (Exception ex)
            {
            }

            
            return JsonSerializer.Serialize(data.ToArray());
        }


        private string GetUserGroup(string UserName)
        {
            string sSQL = "  select UserGroup from UserLoginPermission where UserName = '" + UserName + "' ";
            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString);
            SqlCommand cmd = new SqlCommand(sSQL, sqlconnection);
            string result = string.Empty;
            try
            {
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                da.Fill(ds);

                result = ds.Tables[0].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
            }

            return result;
        }
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string ChangePassword([FromBody]Login login)
        {
            string sSQL = "select count(*) from UserLoginPermission where UserName='" + login.Username + "'";

            Crypto cryptoobj = new Crypto();
            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString);
            SqlCommand cmd = new SqlCommand(sSQL, sqlconnection);
            string result = string.Empty;
            try
            {
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                da.Fill(ds);
                int count = Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString());


                if (count == 1)
                {
                    string encryptedPassword = cryptoobj.psEncrypt(login.Password);

                    sSQL = "Update UserLoginPermission set Password='" + encryptedPassword + "' where UserName = '" + login.Username + "'";
                    SqlCommand cmd2 = new SqlCommand(sSQL, sqlconnection);

                    SqlDataAdapter da2 = new SqlDataAdapter(cmd2);
                    DataSet ds2 = new DataSet();
                    da2.Fill(ds2);
                    result = "Password Updated";
                }
                else
                {
                    return " UserID is not Valid";
                }
            }
            catch (Exception ex)
            {

                throw new Exception("Error Occured while Updating the Password :" + ex.Message);
            }

            return result;
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        public string LogOut([FromBody]Login login)
        {
            try
            {
                WareHouse.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
                WareHouse.WarehouseSite = String.Empty;
            }
            catch (Exception ex)
            {
                return "LogOut Failed";
            }
            return "User Logged Out";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string ForgotPassword([FromBody]Login login)
        {
            string sSQL = "select count(*) from UserLoginPermission where UserName='" + login.Username + "'";
            string result = string.Empty;
            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString);
            try
            {

                SqlCommand cmd = new SqlCommand(sSQL, sqlconnection);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                da.Fill(ds);
                int count = Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString());
                if (count == 1)
                {
                    SqlCommand Sqlcommand = new SqlCommand("spResetPassword", sqlconnection);
                    Sqlcommand.CommandType = CommandType.StoredProcedure;

                    SqlParameter paramUsername = new SqlParameter("@UserName", login.Username);

                    Sqlcommand.Parameters.Add(paramUsername);
                    try
                    {
                        sqlconnection.Open();
                        SqlDataReader rdr = Sqlcommand.ExecuteReader();
                        while (rdr.Read())
                        {
                            if (Convert.ToBoolean(rdr["ReturnCode"]))
                            {
                                //SendPasswordResetEmail(rdr["Email"].ToString(), txtUserName.Text, rdr["UniqueId"].ToString());
                                //lblMessage.Text = "An email with instructions to reset your password is sent to your registered email";
                                SendResetPasswordEmail(rdr["Email"].ToString(), rdr["UniqueId"].ToString(), login.Username);
                            }
                            else
                            {

                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        sqlconnection.Close();
                        return "Error Ocurred." + ex.Message;
                    }

                    result = "EmailSend";
                }
                else
                {
                    return "UserName is not Valid";

                }
            }
            catch (Exception ex)
            {
                return "Forgot Password Failed";
            }
            finally
            {
                sqlconnection.Close();
            }
            return result;
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string ResetPassword([FromBody] Login login)
        {
            string result = string.Empty;
            Crypto cryptoobj = new Crypto();
            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString);

            SqlCommand Sqlcommand = new SqlCommand("spIsPasswordResetLinkValid", sqlconnection);
            Sqlcommand.CommandType = CommandType.StoredProcedure;

            SqlParameter paramUsername = new SqlParameter("@GUID", login.uid);

            Sqlcommand.Parameters.Add(paramUsername);

            try
            {
                sqlconnection.Open();

                if (Convert.ToBoolean(Sqlcommand.ExecuteScalar()))
                {
                    string Encryptedpassword = cryptoobj.psEncrypt(login.Password);
                    SqlCommand Sqlcommand2 = new SqlCommand("spChangePassword", sqlconnection);
                    Sqlcommand2.CommandType = CommandType.StoredProcedure;
                    Sqlcommand2.Parameters.Add(new SqlParameter("@GUID", login.uid));
                    Sqlcommand2.Parameters.Add(new SqlParameter("@Password", Encryptedpassword));

                    bool spresult = Convert.ToBoolean(Sqlcommand2.ExecuteScalar());

                    if (spresult)
                    {
                        result = "Password Updated";
                    }
                    else
                    {
                        result = "Password not Updated";
                    }

                }
                else
                {
                    return "Invalid/Expired Link";

                }
            }
            catch (Exception ex)
            {
                sqlconnection.Close();
                return "Error while Updating the Password" + ex.Message;
            }
            finally
            {
                sqlconnection.Close();
            }


            return result;
        }


        private  async void SendResetPasswordEmail(string Email, string UniqueId, string UserID)
        {

            string smtphost = string.Empty;
            int port = 0;
            string emailAdress = string.Empty;
            string UserId = string.Empty;
            string Password = string.Empty;
            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString);

            try
            {
                string sConfigFile = AppDomain.CurrentDomain.SetupInformation.ApplicationBase + "Resources\\Ipconfig.xml";
                // code to get the Full Name 

                string sSQL = "select FirstName from UserLoginPermission where UserName='" + UserID + "'";
                string result = string.Empty;
                
                SqlCommand cmd = new SqlCommand(sSQL, sqlconnection);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                da.Fill(ds);
                string FirstName = ds.Tables[0].Rows[0][0].ToString();
                StreamReader reader = File.OpenText(AppDomain.CurrentDomain.BaseDirectory + "\\EmailTemplates\\ForgotPassword.html"); // Path to your 
                                                                                                                                      // HTML file
                string Emailbody = reader.ReadToEnd();
                string website = ReadConfig();
                Emailbody = Emailbody.Replace("{FirstName}", FirstName);
                Emailbody = Emailbody.Replace("{WebsiteLink}", website + "/ResetPassword/uid=" + UniqueId);

                //executing the Send Mail Stored Procedure
                SqlCommand cmd2 = new SqlCommand("spSendForgotPasswordEmail", sqlconnection);
                cmd2.CommandType = CommandType.StoredProcedure;

                cmd2.Parameters.AddWithValue("@body", Emailbody);
                cmd2.Parameters.AddWithValue("@To", Email);
                SqlDataAdapter da2 = new SqlDataAdapter(cmd2);

                DataSet ds2 = new DataSet();
                da2.Fill(ds2);
            }

            catch (Exception ex)
            {

            }
             finally
             {
                sqlconnection.Close();
             }

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

                    website = "http://"+wsip+":"+wsport;
                       
                    }

                }
                catch (Exception ex)
                {
                    
                }
            return website;
        }
    }
}
