using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DC4._0Backend.Models;
using System.Data;
using System.Text.Json;

namespace DC4._0Backend.Controllers
{
    public class MapLocationController : ApiController
    {
        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string SearchRecord([FromBody]MapLocationForAisle map)
        {
            string sSQL = "Select  StartOfAisle,LengthOfAisle From LocationMappingForAisle";
            List<MapLocationForAisle> list = new List<MapLocationForAisle>();
            Connection conn = new Connection();
            DataSet ds = null;
            try
            {
                ds = conn.ExecuteSelectQuery(sSQL, map.Site);


                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    MapLocationForAisle obj = new MapLocationForAisle();
                    obj.StartPosition = int.Parse(ds.Tables[0].Rows[i]["StartOfAisle"].ToString());
                    obj.Length = int.Parse(ds.Tables[0].Rows[i]["LengthOfAisle"].ToString());
                    list.Add(obj);
                }
            }
            catch (Exception ex)
            {
                return "Error Occured:While Fetching the List";
            }


            return JsonSerializer.Serialize(list);
        }

        [AcceptVerbs("GET", "POST")]
        [HttpPost]
        public string InsertRecord([FromBody]MapLocationForAisle map)
        {
            //Delete the Aisle Record
            DeleteRecord(map);

            string sSQL = "Insert Into LocationMappingForAisle (StartOfAisle,LengthOfAisle) Values(" + map.StartPosition + "," + map.Length + ")";

            Connection conn = new Connection();
            DataSet ds = null;
            try
            {
              string result =   conn.ExecuteInsertQuery(sSQL, map.Site);
                if (result != "Insert SuccessFull")
                {
                    return "Error Occured:while inserting the map loaction";
                }
            }
            catch (Exception ex)
            {
                return "Error Occured:while inserting the map loaction";
            }


            return "Record Created";
        }

        private void DeleteRecord(MapLocationForAisle map)
        {
            string sSQL = "Delete from LocationMappingForAisle";

            Connection conn = new Connection();
            DataSet ds = null;
            try
            {
                string result = conn.ExecuteDeleteQuery(sSQL, map.Site);
               
            }
            catch (Exception ex)
            {

            }
        }
    }
}
