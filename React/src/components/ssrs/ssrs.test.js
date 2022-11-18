import {generateURL} from './srss';

describe('Test URL generation output', () => {
    it('Show Parameters', () => {
        expect(generateURL('http://winpc1012/ReportServer_MSSQLSERVER2016?/','Reports/Lost%20Time', {}, false)).
            toEqual('http://winpc1012/ReportServer_MSSQLSERVER2016?/Reports/Lost%20Time')
    });

    it('Hide Parameters', () => {
        expect(generateURL('http://winpc1012/ReportServer_MSSQLSERVER2016?/','Reports/Lost%20Time', {}, true)).
            toEqual('http://winpc1012/ReportServer_MSSQLSERVER2016?/Reports/Lost%20Time&rc:Parameters=false')
    });

    it('Single Value Parameter', () => {
        expect(generateURL('http://winpc1012/ReportServer_MSSQLSERVER2016?/','Reports/Lost%20Time', {'Parameter1':'Value'}, true)).
            toEqual('http://winpc1012/ReportServer_MSSQLSERVER2016?/Reports/Lost%20Time&rc:Parameters=false&Parameter1=Value')
    });

    it('Single Parameter with Array', () => {
        expect(generateURL('http://winpc1012/ReportServer_MSSQLSERVER2016?/','Reports/Lost%20Time', 
            {'Parameter1':['Value1', 'Value2']}, true)).
            toEqual('http://winpc1012/ReportServer_MSSQLSERVER2016?/Reports/Lost%20Time&rc:Parameters=false&Parameter1=Value1&Parameter1=Value2')
    });
   
    it('Parameter with Array and Parameter with Single Value', () => {
        expect(generateURL('http://winpc1012/ReportServer_MSSQLSERVER2016?/','Reports/Lost%20Time', 
            {'Parameter1':['Value1', 'Value2'], 'Parameter2':'Value'}, true)).
            toEqual('http://winpc1012/ReportServer_MSSQLSERVER2016?/Reports/Lost%20Time&rc:Parameters=false&Parameter1=Value1&Parameter1=Value2&Parameter2=Value')
    });

    it('Empty Field parameter', () => {
        expect(generateURL('http://winpc1012/ReportServer_MSSQLSERVER2016?/','Reports/Lost%20Time', 
            {'Parameter1':['', 'Value2'], 'Parameter2':''}, true)).
            toEqual('http://winpc1012/ReportServer_MSSQLSERVER2016?/Reports/Lost%20Time&rc:Parameters=false&Parameter1=Value2')
    });
});