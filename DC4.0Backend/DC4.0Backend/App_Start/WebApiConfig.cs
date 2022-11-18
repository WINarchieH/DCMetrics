using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace DC4._0Backend
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.EnableCors();


            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();



            config.Routes.MapHttpRoute(
     name: "DefaultApi",
     routeTemplate: "api/{controller}/{action}/{input}",
     defaults: new { input = RouteParameter.Optional }
 );

            var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);
        }
    }
}
