## Deploying On IIS

In order to deploy on IIS, refer to the following:

### React

React can be deployed by 

- Specify the URL for the `express` server in the `.env` file.
- Building the file with `npm run build` and then pointing IIS to the build file. 
- Configuring routing with `url-rewrite`, a package in IIS. More information can be found here: https://stackoverflow.com/questions/51755370/react-router-iis-how-to-enable-routing.


### Express

The Express server can be deployed by 

- Specifying the URL for the `react` frontend and `asp.net` backend.
- Refer to: https://medium.com/@harshamw/deploying-a-node-js-application-in-iis-using-a-reverse-proxy-process-management-using-pm2-3d59b83d7f76


### ASP.Net

