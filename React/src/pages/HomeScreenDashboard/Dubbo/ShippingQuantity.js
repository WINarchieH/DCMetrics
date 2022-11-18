import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  Grid,
  colors,
  CircularProgress
} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import React, { Component, useState, useEffect} from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {useHistory, Link}  from "react-router-dom";
import Chart from 'react-apexcharts'
import api from '../../../components/api/api';
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from '@material-ui/core/styles';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, TestdateObjToInput, formatDate } from '../../../components/fields/dateHelpers';

const curr = new Date() ; // get current date
const lastDay = curr.getDate()-1 ; // First day is the day of the month - the day of the week
const firstDay = lastDay - 6; // last day is the first day + 6

const last = new Date(curr.setDate(lastDay)).toDateString();
const first = new Date(curr.setDate(firstDay)).toDateString();

const todate = new Date(curr.setDate(lastDay)).toDateString();
const fromdate = new Date(curr.setDate(firstDay)).toDateString();



const useStyles = makeStyles(() => ({
  title: {
    color: 'red',
    margin: 50,
    padding: 60,
    fontSize: 300,
  }
}));


class ShippingQuantity extends React.Component {
  constructor(props) {
    super(props);
    
   
    this.state = {
      open: false,

      FromDate: TestdateObjToInput(dateToDateObj(fromdate)),
      ToDate: TestdateObjToInput(dateToDateObj(todate)),
  
      series: [{
          name: "Dates",
          data: []
      }],
      options: {
          chart: {
              height: 350,
              type: 'line',
              zoom: {
                  enabled: false
              }
          },
          dataLabels: {
              enabled: false
          },
          stroke: {
              curve: 'straight'
          },
          grid: {
              row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
              },
          },
          dataLabels: {
              enabled: true,
          },
          xaxis: {
              categories: [],
          }
      }
    

  }  
 
   
    
  }
  handleIndepthButtonChange = (e) =>
  {
    
    
    window.open('/DashBoard/DashboardTotalShipped');
  }
  async componentDidMount()
  {
    let body = new URLSearchParams({

      'StartDate': this.state.FromDate,
      'EndDate': this.state.ToDate,
      'Site': this.props.props
  });
  api.post('/HomeScreen/DashboardProductivity/ShippedUnits', body).then(
      res => {

          let resdata = res.data;

          var dates = [];
          var totalShipped = [];

          var temp = resdata.Dates;
          dates = temp.map(x => x);

          temp = resdata.Units;
          totalShipped = temp.map(x => x);

          this.setState({
            open:true,  
            options:
              {
                  chart: {
                      id: "Total Shipped Units Per Day"
                  },
                  xaxis:
                  {
                      categories: dates
                  }

              },
              options:
              {
                  labels: dates
              },
              series: [{
                  name: 'Total Shipped',
                  data: totalShipped
              }]

          });

      }).catch(
          err => {
              // TODO: Error handling
              if (err.response) {

              }
              else {
              }
          }
      );
          };
    


  render()
  {
   
  return (
  
  <Card>
 <CardHeader style={{ fontFamily:'Montserrat',  fontWeight:'400', color: 'rgb(35,168,224)',margin: '10', padding: '10' }}
        action={(
          <Button
            size="small"
            variant="text"
          >
            Last 7 days
          </Button>
        )}
        titleTypographyProps={{variant:'h6' }}
        title="TOTAL SHIPPED UNITS PER DAY"

      />
      <Divider />
  
  <CardContent>
    <Box
      sx={{
        height: 400,
        position: 'relative'
      }}
    >
      
       
      <Chart options={this.state.options} series={this.state.series} type="line" height={350} width={850} />
    </Box>
  </CardContent>
 
  <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          onClick={(e) => { this.handleIndepthButtonChange(e) }}
        >
          IN DEPTH VIEW
        </Button>
        </Box>
     <div hidden={this.state.open} >
      <LinearProgress color="secondary" />
    </div>
  
</Card>


  );

}

}



export default ShippingQuantity;
