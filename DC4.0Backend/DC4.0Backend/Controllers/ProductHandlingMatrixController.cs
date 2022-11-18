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
    public class ProductHandlingMatrixController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string GetMatrix([FromBody] ProductHandlingMatrix product)
        {
            string sSQL = " Select SmallCube,MediumCube,LargeCube,ExtraLargeCube,SmallWeight,MediumWeight,HeavyWeight,VeryHeavyWeight,SmallLightFirstFull,SmallLightFirstSplit,SmallLightSubsFull,SmallLightSubsSplit,SmallMedFirstFull,SmallMedFirstSplit,SmallMedSubsFull,SmallMedSubsSplit,SmallHeavyFirstFull,SmallHeavyFirstSplit,SmallHeavySubsFull,SmallHeavySubsSplit,SmallVHeavyFirstFull,SmallVHeavyFirstSplit,SmallVHeavySubsFull,SmallVHeavySubsSplit,MedLightFirstFull,MedLightFirstSplit,MedLightSubsFull,MedLightSubsSplit,MedMedFirstFull,MedMedFirstSplit," +
                          " MedMedSubsFull,MedMedSubsSplit,MedHeavyFirstFull,MedHeavyFirstSplit,MedHeavySubsFull,MedHeavySubsSplit,MedVHeavyFirstFull,MedVHeavyFirstSplit,MedVHeavySubsFull,MedVHeavySubsSplit,LargeLightFirstFull,LargeLightFirstSplit,LargeLightSubsFull,LargeLightSubsSplit,LargeMedFirstFull,LargeMedFirstSplit,LargeMedSubsFull,LargeMedSubsSplit,LargeHeavyFirstFull,LargeHeavyFirstSplit,LargeHeavySubsFull,LargeHeavySubsSplit,LargeVHeavyFirstFull,LargeVHeavyFirstSplit,LargeVHeavySubsFull,LargeVHeavySubsSplit,XLLightFirstFull,XLLightFirstSplit," +
                          " XLLightSubsFull,XLLightSubsSplit,XLMedFirstFull,XLMedFirstSplit,XLMedSubsFull,XLMedSubsSplit,XLHeavyFirstFull,XLHeavyFirstSplit,XLHeavySubsFull,XLHeavySubsSplit,XLVHeavyFirstFull,XLVHeavyFirstSplit,XLVHeavySubsFull,XLVHeavySubsSplit From PickingMatrix Where Activity = '" + product.Activity + "' And Zone = '" + product.Zone + "'";

            try
            {
                Logging.WriteLog(product.Site, "Info", "ProductHandlingMatrix", "GetMatrix", sSQL.Replace("'", "''"), 1002, product.DCMUser);
            }
            catch (Exception ex)
            {
            }

            DataTable dt = new DataTable();
            Connection conn = new Connection();
            try
            {
                DataSet ds = conn.ExecuteSelectQuery(sSQL, product.Site);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                Logging.WriteLog(product.Site, "Error", "ProductHandlingMatrix", "GetMatrix", sSQL.Replace("'", "''"), 3002, product.DCMUser);

            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(dt);

        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string AddMatrix([FromBody] ProductHandlingMatrix product)
        {
            string sSQL = " Select count(*) from PickingMatrix Where Activity = '" + product.Activity + "' And Zone = '" + product.Zone + "'";

            DataTable dt = new DataTable();
            Connection conn = new Connection();
            try
            {
                int count = int.Parse(conn.ReturnSingleValue(sSQL, product.Site));

                if (count > 0)
                {
                    try
                    {
                        Logging.WriteLog(product.Site, "Warning", "ProductHandlingMatrix", "InsertProductMatrix", sSQL.Replace("'", "''"), 2008, product.DCMUser);
                    }
                    catch (Exception ex)
                    {

                    }
                    return "Record Already Exist";
                }

                sSQL = "Insert Into PickingMatrix(Activity,Zone,SmallCube, MediumCube, LargeCube, ExtraLargeCube,SmallWeight," +
                    "MediumWeight,HeavyWeight,VeryHeavyWeight,SmallLightFirstFull,SmallLightFirstSplit,SmallLightSubsFull,SmallLightSubsSplit," +
                    "SmallMedFirstFull,SmallMedFirstSplit,SmallMedSubsFull,SmallMedSubsSplit,SmallHeavyFirstFull,SmallHeavyFirstSplit,SmallHeavySubsFull," +
                    "SmallHeavySubsSplit,SmallVHeavyFirstFull,SmallVHeavyFirstSplit,SmallVHeavySubsFull,SmallVHeavySubsSplit,MedLightFirstFull,MedLightFirstSplit," +
                    "MedLightSubsFull,MedLightSubsSplit,MedMedFirstFull,MedMedFirstSplit,MedMedSubsFull,MedMedSubsSplit,MedHeavyFirstFull,MedHeavyFirstSplit,MedHeavySubsFull," +
                    "MedHeavySubsSplit,MedVHeavyFirstFull,MedVHeavyFirstSplit,MedVHeavySubsFull,MedVHeavySubsSplit,LargeLightFirstFull,LargeLightFirstSplit,LargeLightSubsFull," +
                    "LargeLightSubsSplit,LargeMedFirstFull,LargeMedFirstSplit,LargeMedSubsFull,LargeMedSubsSplit,LargeHeavyFirstFull,LargeHeavyFirstSplit,LargeHeavySubsFull," +
                    "LargeHeavySubsSplit,LargeVHeavyFirstFull,LargeVHeavyFirstSplit,LargeVHeavySubsFull,LargeVHeavySubsSplit,XLLightFirstFull,XLLightFirstSplit,XLLightSubsFull," +
                    "XLLightSubsSplit,XLMedFirstFull,XLMedFirstSplit,XLMedSubsFull,XLMedSubsSplit,XLHeavyFirstFull,XLHeavyFirstSplit,XLHeavySubsFull,XLHeavySubsSplit," +
                    "XLVHeavyFirstFull,XLVHeavyFirstSplit,XLVHeavySubsFull,XLVHeavySubsSplit) Values('" + product.Activity + "','" + product.Zone + "'," + product.SmallCube + "," + product.MediumCube + "," + product.LargeCube + "," + product.ExtraLargeCube + "," + product.SmallWeight + "," +
                    "" + product.MediumWeight + "," + product.HeavyWeight + "," + product.VeryHeavyWeight + "," + product.SmallLightFirstFull + "," + product.SmallLightFirstSplit + "," + product.SmallLightSubsFull + "," + product.SmallLightSubsSplit + "," +
                    "" + product.SmallMedFirstFull + "," + product.SmallMedFirstSplit + "," + product.SmallMedSubsFull + "," + product.SmallMedSubsSplit + "," + product.SmallHeavyFirstFull + "," + product.SmallHeavyFirstSplit + "," + product.SmallHeavySubsFull + "," +
                    "" + product.SmallHeavySubsSplit + "," + product.SmallVHeavyFirstFull + "," + product.SmallVHeavyFirstSplit + "," + product.SmallVHeavySubsFull + "," + product.SmallVHeavySubsSplit + "," + product.MedLightFirstFull + "," + product.MedLightFirstSplit + "," +
                    "" + product.MedLightSubsFull + "," + product.MedLightSubsSplit + "," + product.MedMedFirstFull + "," + product.MedMedFirstSplit + "," + product.MedMedSubsFull + "," + product.MedMedSubsSplit + "," + product.MedHeavyFirstFull + "," + product.MedHeavyFirstSplit + "," + product.MedHeavySubsFull + "," +
                    "" + product.MedHeavySubsSplit + "," + product.MedVHeavyFirstFull + "," + product.MedVHeavyFirstSplit + "," + product.MedVHeavySubsFull + "," + product.MedVHeavySubsSplit + "," + product.LargeLightFirstFull + "," + product.LargeLightFirstSplit + "," + product.LargeLightSubsFull + "," +
                    "" + product.LargeLightSubsSplit + "," + product.LargeMedFirstFull + "," + product.LargeMedFirstSplit + "," + product.LargeMedSubsFull + "," + product.LargeMedSubsSplit + "," + product.LargeHeavyFirstFull + "," + product.LargeHeavyFirstSplit + "," + product.LargeHeavySubsFull + "," +
                    "" + product.LargeHeavySubsSplit + "," + product.LargeVHeavyFirstFull + "," + product.LargeVHeavyFirstSplit + "," + product.LargeVHeavySubsFull + "," + product.LargeVHeavySubsSplit + "," + product.XLLightFirstFull + "," + product.XLLightFirstSplit + "," + product.XLLightSubsFull + "," +
                    "" + product.XLLightSubsSplit + "," + product.XLMedFirstFull + "," + product.XLMedFirstSplit + "," + product.XLMedSubsFull + "," + product.XLMedSubsSplit + "," + product.XLHeavyFirstFull + "," + product.XLHeavyFirstSplit + "," + product.XLHeavySubsFull + "," + product.XLHeavySubsSplit + "," + product.XLVHeavyFirstFull + "," + product.XLVHeavyFirstSplit + "," + product.XLVHeavySubsFull + "," + product.XLVHeavySubsSplit + ")";


                try
                {
                    Logging.WriteLog(product.Site, "Info", "ProductHandlingMatrix", "InsertProductMatrix", sSQL.Replace("'", "''"), 1001, product.DCMUser);
                }
                catch (Exception ex)
                {

                }

                 string result = conn.ExecuteInsertQuery(sSQL, product.Site);

                if (result != "Insert SuccessFull")
                {
                    return "Error While Creating the Matrix";
                }

            }
            catch (Exception ex)
            {
                Logging.WriteLog(product.Site, "Error", "ProductHandlingMatrix", "InsertProductMatrix", sSQL.Replace("'", "''"), 3001, product.DCMUser);
            }

            return "New Matrix Created";

        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string DeleteMatrix([FromBody] ProductHandlingMatrix product)
        {
            string sSQL = " delete from PickingMatrix Where Activity = '" + product.Activity + "' And Zone = '" + product.Zone + "'";

            try
            {
                Logging.WriteLog(product.Site, "Info", "ProductHandlingMatrix", "DeleteProductMatrix", sSQL.Replace("'", "''"), 1007, product.DCMUser);
            }
            catch (Exception ex)
            {

            }

            Connection conn = new Connection();
            try
            {
              string result =   conn.ExecuteDeleteQuery(sSQL, product.Site);

                if (result != "Delete SuccessFull")
                {
                    return "Error While Deleting the Matrix";
                }
            }
            catch (Exception ex)
            {
                Logging.WriteLog(product.Site, "Error", "ProductHandlingMatrix", "DeleteMatrix", sSQL.Replace("'", "''"), 3007, product.DCMUser);
                return "Error while deleting the matrix";
            }

            return "Selected Matrix Deleted";
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string UpdateMatrix([FromBody] ProductHandlingMatrix product)
        {
            try
            {
                DeleteMatrix(product);
                AddMatrix(product);


            }
            catch (Exception ex)
            {
                //Logging.WriteLog(product.Site, "Error", "OrderTimeMatrix", "GetAllOrderMatrix", sSQL.Replace("'", "''"), 3002, product.DCMUser);
                return "Error while updating the matrix";
            }

            return "Selected Matrix Updated";
        }
    }
}