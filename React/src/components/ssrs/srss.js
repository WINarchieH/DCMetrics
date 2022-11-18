/**
 * 
 *  SSRS Webservice URL
 * 
 */

 const ssrs = process.env.REACT_APP_SSRS_URL;

 export const generateURL = function(reportServer, reportURL, parameters, hideParameters) {
     /**
      *  Function for generating an SSRS url using given parameters.
      * 
      *     reportServer - SSRS Server URL
      *     reportURL - Path to report
      *     parameters - Object/Dictionary of (parameter name, value) pairs
      *     hideParameters - Whether SSRS parameter options should be shown
      */

    let url = reportServer + reportURL;
    
    if (hideParameters) {
        url += '&rc:Parameters=false';
    }
    let keys = Object.keys(parameters);

    for (let key in keys) {
        if (typeof(parameters[keys[key]]) === 'object') { // Multiple value parameter
            for (let value in parameters[keys[key]]) {
                if (parameters[keys[key]][value] !== '') {
                    url += '&' + keys[key] + '=' + parameters[keys[key]][value];
                } 
            }
        }
        else {
            if (parameters[keys[key]] !== '') {
                url += '&' + keys[key] + '=' + parameters[keys[key]];
            }
        }
    }

    return url;
 }

 export default ssrs;