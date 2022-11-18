import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  Grid,
  LinearProgress
} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import React, { Component, useState, useEffect} from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Chart from 'react-apexcharts'
import api from '../../../components/api/api';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../components/fields/dateHelpers';

const curr = new Date() ; // get current date
const lastDay = curr.getDate()-1 ; // First day is the day of the month - the day of the week
const firstDay = lastDay - 6; // last day is the first day + 6

const todate = new Date(curr.setDate(lastDay)).toDateString();
const fromdate = new Date(curr.setDate(curr.getDate() - 7)).toDateString();



class TaskTime extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {

      FromDate: TestdateObjToInput(dateToDateObj(fromdate)),
      ToDate: TestdateObjToInput(dateToDateObj(todate)),


      series1: [],

      series2: [],
    
      options1: {
        chart: {
          width: 800,
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'gradient',
        },
        legend: {
          formatter: function(val, opts) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex]
          }
        },
        title: {
         
          align: 'black',
          style: {
            fontSize: "11px",
            fontFamily: "Montserrat",
            color:'rgb(35,168,224)',
           
          }

        },
        legend:
        {
          position:'bottom'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
           
          }
        }]
      },
      options2: {
        chart: {
          width: 800,
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'gradient',
        },
       
        title: {
         
          align: 'black',
          style: {
            fontSize: "11px",
            fontFamily: "Montserrat",
            color:'rgb(35,168,224)',
           
          }

        },
        legend:
        {
          position:'bottom'
        }
      ,
        responsive: [{
          breakpoint: 480,
          options: {
            
          }
        }]
      },


    };
   
    
  }
  handleIndepthButtonChange = (e) =>
  {
    
    
    window.open('/DashBoard/DashboardTaskTime');
  }
  async componentDidMount()
  {
    var currentsite = this.props.props;
    console.log(this.props);
      // Productivity Cycle Counts Method
      let body = new URLSearchParams({

        'StartDate': this.state.FromDate,
        'EndDate': this.state.ToDate,
        'Site':currentsite
    });
    api.post('/HomeScreen/DashboardTaskTime/Dash_TimePerIndirect_CC', body).then(
        res => {

            let resdata = res.data;

            var costCentre = [];
            var totalHrs = [];

            var temp = resdata.CostCentre;
            costCentre = temp.map(x => x);

            temp = resdata.TotalHrs;
            totalHrs = temp.map(x => x);

            this.setState({
              open:true,
                options:
                {
                    chart: {
                        id: "Indirect Cost Centre Time"
                    },
                    xaxis:
                    {
                        categories: costCentre
                    }

                },
                options1:
                {
                    labels: costCentre
                },
                series1: totalHrs,

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



    api.post('/HomeScreen/DashboardTaskTime/Dashboard_TimePerIndirectTasks', body).then(
        res => {

            let resdata = res.data;

            var taskName = [];
            var totalHrs = [];

            var temp = resdata.TaskName;
            taskName = temp.map(x => x);

            temp = resdata.TotalHrs;
            totalHrs = temp.map(x => x);

            this.setState({
              open:true,
                options:
                {
                    chart: {
                        id: "Indirect Task Time"
                    },
                    xaxis:
                    {
                        categories: taskName
                    }

                },
                options2:
                {
                    labels: taskName
                },
                series2: totalHrs,


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
<Grid container spacing={1}>
    <Grid item lg={8} md={12} xl={9} xs={10} >
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
        title="TIME PER INDIRECT TASK"
      />
    <Divider></Divider>
      <CardContent>
        <Box
          sx={{
            height: 240,
            position: 'relative'
          }}
        >
           <Chart options={this.state.options2} series={this.state.series2} type="donut" height={250}  />
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
    </Grid>
    <Grid
      item
      lg={4}
      md={12}
      xl={9}
      xs={12}
    >
       <Card >
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
      title="TIME PER INDIRECT COST CENTER"
    />
    <Divider></Divider>
      <CardContent>
     
       
        <Box
          sx={{
            height: 240,
            position: 'relative'
          }}
        >
         <Chart options={this.state.options1} series={this.state.series1} type="donut"  height={290} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
            <Box
              
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
            
              <Typography  color="textPrimary" variant="body1" >
              </Typography>
              <Typography  variant="h2" >
            
              </Typography>
            </Box>
          
        </Box>
       
       <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        
         
     
        </Box>
      </CardContent>
      <div hidden={this.state.open} >
      <LinearProgress color="secondary" />
    </div>
    </Card>
    </Grid>
  </Grid>


  );

}

}



export default TaskTime;
