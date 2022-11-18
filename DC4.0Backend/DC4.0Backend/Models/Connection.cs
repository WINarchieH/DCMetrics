using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
//using Google.GData.Client;
//using Google.GData.Extensions;
//using Google.GData.Spreadsheets;

namespace DC4._0Backend.Models
{
    public class Connection
    {


        public Connection()
        {

            //if (string.IsNullOrEmpty(Site))
            //{
            //    WareHouse.ConnectionString = ConfigurationManager.ConnectionStrings["DCMAccessDataBase"].ConnectionString;
            //    WareHouse.DefaultSite = ReturnSingleValue("	select site from WarehouseSites where IsDefault = 'Y'");
            //}
            //else
            //{
            //    WareHouse.ConnectionString = ConfigurationManager.ConnectionStrings[Site].ConnectionString;
            //}
        }
        public string ReturnSingleValue(string query, string Site)
        {
            string connectionstroing = String.Empty;


            string result = string.Empty;



            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings[Site].ConnectionString);
            SqlCommand cmd = new SqlCommand(query, sqlconnection);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
                if (ds.Tables[0].Rows.Count == 1)
                {
                    result = ds.Tables[0].Rows[0][0].ToString();
                }
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }


            return result;

        }

        public DataSet ReturnCompleteDataSet(string query, string Site)
        {

            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings[Site].ConnectionString);
            SqlCommand cmd = new SqlCommand(query, sqlconnection);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);

            }
            catch (Exception ex)
            {
                return ds;
            }


            return ds;
        }

        public DataSet ExecuteSelectQuery(string query, string Site)
        {

            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings[Site].ConnectionString);
            SqlCommand cmd = new SqlCommand(query, sqlconnection);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);

            }
            catch (Exception ex)
            {
                return ds;
            }


            return ds;
        }



        public string ExecuteInsertQuery(string query, string Site)
        {

            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings[Site].ConnectionString);
            SqlCommand cmd = new SqlCommand(query, sqlconnection);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            string result = string.Empty;

            try
            {
                sqlconnection.Open();
                int rows = cmd.ExecuteNonQuery();

                if (rows > 0)
                {
                    result = "Insert SuccessFull";
                }
                else
                {
                    result = "Insert Failed";
                }

            }
            catch (Exception ex)
            {
                return "Insert Failed:"+ex.Message;
            }
            finally
            {
                sqlconnection.Close();
            }


            return result;
        }
      
      
        public string ExecuteUpdateQuery(string query, string Site)
        {

            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings[Site].ConnectionString);
            SqlCommand cmd = new SqlCommand(query, sqlconnection);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            string result = string.Empty;

            try
            {
                sqlconnection.Open();
                int rows = cmd.ExecuteNonQuery();

                if (rows > 0)
                {
                    result = "Update SuccessFull";
                }
                else
                {
                    result = "Update Failed";
                }

            }
            catch (Exception ex)
            {
                return "Update Failed:" + ex.Message;
            }
            finally
            {
                sqlconnection.Close();
            }


            return result;
        }

        public string ExecuteDeleteQuery(string query, string Site)
        {

            SqlConnection sqlconnection = new SqlConnection(ConfigurationManager.ConnectionStrings[Site].ConnectionString);
            SqlCommand cmd = new SqlCommand(query, sqlconnection);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            string result = string.Empty;

            try
            {
                sqlconnection.Open();
                int rows = cmd.ExecuteNonQuery();

                if (rows > 0)
                {
                    result = "Delete SuccessFull";
                }
                else
                {
                    result = "Delete Failed";
                }

            }
            catch (Exception ex)
            {
                return "Delete Failed:" + ex.Message;
            }
            finally
            {
                sqlconnection.Close();
            }


            return result;
        }
        public DataSet ExecutePayrollSP(string FromDate, string ToDate, string agency,string Site)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[Site].ConnectionString);
            SqlCommand cmd = new SqlCommand("dbo.spPayrollCalc_BRI", sqlConnection);
            cmd.CommandType = CommandType.StoredProcedure;




            cmd.Parameters.AddWithValue("@StartDate", FromDate);
            cmd.Parameters.AddWithValue("@EndDate", ToDate);
            cmd.Parameters.AddWithValue("@uName", "");
            cmd.Parameters.AddWithValue("@ShiftCode", "_All");
            cmd.Parameters.AddWithValue("@Agency", agency);
            cmd.Parameters.AddWithValue("@TeamManager", "_All");
 

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
            }

            return ds;
        }
    }




    public class NavBarItem
    {

        public string Name { get; set; }
        public string URL { get; set; }

        public string Header { get; set; }
    }

    public class DCMUser
    {
        public string AccessSite { get; set; }

        public string Site { get; set; }

        public string Username { get; set; }

        public string UserGroup { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Email { get; set; }

        public string Addedby { get; set; }

        public string ScreenName { get; set; }

    }
    public class WarehouseSite
    {
        public string value { get; set; }

        public string label { get; set; }
    }

   
    

}



