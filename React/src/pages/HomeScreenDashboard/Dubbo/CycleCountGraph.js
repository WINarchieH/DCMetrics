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

const curr = new Date() ; // get current date
const lastDay = curr.getDate()-1 ; // First day is the day of the month - the day of the week
const firstDay = lastDay - 6; // last day is the first day + 6

const last = new Date(curr.setDate(lastDay)).toDateString();
const first = new Date(curr.setDate(curr.getDate() - 7)).toDateString();



class CycleCountGraph extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open:false,
      startDate: first,
      endDate : last,
      radialCycleCountSeries:[{
        name: 'Total CycleCounts',
        data: []
      }],

      radialCCoptions: {
        yaxis: {
               
          title: {
            text: 'UNITS',
          
          style:{ fontSize:  '10px',
          fontFamily: "Montserrat",
          color:'rgb(35,168,224)'}
        }
       },
       title:
       {
     
          
          style:{ fontSize:  '12px',
          fontFamily: "Montserrat",
          color:'rgb(35,168,224)'}
       },
        chart: {
          id :'AreaChart',
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: true,
         
        },
        fill:
        {
         colors:['#FEB019']
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis:
        {
         
          categories: []
        },
        tooltip:
        {
          x:
          {
            format: 'dd MM'
          },
        },

      },
      CycleCountsPerHrSeries: [{
        name: 'Counts Per Hour',
        data:[]
      }],
         options: {
           fill:{
            colors:['#FEB019']
           },
             chart: {
              height: 350,
              type: 'line',
                 zoom: {
                  enabled: false
                     }
               },
           dataLabels: {
              enabled: true
            },
           stroke: {
              curve: 'straight'
           },
           title: {
            
              align: 'center',
              style:{ fontSize:  '12px',
              fontFamily: "Montserrat",
              color:'rgb(35,168,224)'}
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
       },
    };
   
    
  }
  handleIndepthButtonChange = (e) =>
  {
    
    
    window.open('/DashBoard/DashboardPickProductivity');
  }
  async componentDidMount()
  {
      // Productivity Cycle Counts Method
      let body = new URLSearchParams({

        'StartDate':this.state.startDate,
        'EndDate':this.state.endDate,
        'Site':this.props.props
     });

    await  api.post('/HomeScreen/DashboardProductivity/Dash_CCProductivity',body).then(
        res => 
        {

          let resdata = res.data;
          var dates =[];
          var numOfCounts=[];
          var countsPerHr =[];
        
     //Cycle Counts
    
           var temp =    resdata.Dates;
           dates =       temp.map(x=>x);

            temp =    resdata.TotalCounts;
            numOfCounts =       temp.map(x => x);

            temp =    resdata.CountsPerHr;
            countsPerHr = temp.map(x => x);


            // Hiding the rep graph table if the dates array is none
            if (dates.length === 0)
            {
              this.setState({
               hideCCgraph: true
               });
             } else {
              this.setState({
                hideCCgraph: false
                });
             }



            this.setState({
              open:true,

              radialCycleCountSeries:[{
                name: 'Total Cycle Counts',
                data: numOfCounts
              }],

              CycleCountsPerHrSeries: [{
                name: 'Counts Per Hour',
                data:countsPerHr
              }],
        
              radialCCoptions:
              {
                xaxis :
                {
                    categories: dates
                }

              },

              options : 
              {
                xaxis :
                {
                  categories: dates
                }
              }


            })


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
        title="CYCLE COUNTS PRODUCTIVITY PER DAY"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 310,
            position: 'relative'
          }}
        >
          <Chart options={this.state.options} series={this.state.CycleCountsPerHrSeries} type="bar" height={300} width={850} />
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
        title="TOTAL COUNTS PER DAY"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 280,
            position: 'relative'
          }}
        >
         <Chart options={this.state.radialCCoptions } series={ this.state.radialCycleCountSeries }type="area" height={300} />
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
  </Grid>


  );

}

}



export default CycleCountGraph;
