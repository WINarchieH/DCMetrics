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



class LostTimeGraph extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open:false,
      FromDate:TestdateObjToInput(dateToDateObj(fromdate)),
      ToDate:TestdateObjToInput(dateToDateObj(todate)),

      lineGraphSeries:[
       { name: 'Total Lost Time',
         data: []
        } ],
      lineGraphOptions:
      {
        chart: {
          id:'lostTime_PerUser',
          height: 350,
          type: 'line',
        },
        stroke: {
          width: 7,
          curve: 'smooth'
        },
        xaxis: {
         
          categories: []
         
          
        },
        title: {
          text: 'LOST TIME PER USER',
          align: 'center',
          style: {
            fontSize: "11px",
            fontFamily: "Montserrat",
            color:'rgb(35,168,224)'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: [ '#FDD835'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          },
        },
        dataLabels: {
          enabled: true
        },
        markers: {
          size: 4,
          colors: ["#FFA41B"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          }
        },
        yaxis: {
         
          title: {
            text: 'LOST TIME',
            style:
            {
              fontFamily: "Montserrat",
              color:'rgb(35,168,224)',
              fontSize:'10px'
            }
          },
        }

      },
      series: [],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
             
            }
          }
        }],
        plotOptions: {
          bar: {
            borderRadius: 8,
            horizontal: true,
          },
        },
        xaxis: {
         
          categories: [
          ],
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        },
        title: {
          
          align: 'black',
          style: {
            fontSize: "11px",
            fontFamily: "Montserrat",
            color:'rgb(35,168,224)'
          }

        },
        yaxis: {
         
          title: {
            text: 'LOST TIME',
            style:
            {
              
              fontSize:'10px',
              fontFamily: "Montserrat",
              color:'rgb(35,168,224)'
            }
          },
        }
      },
      series1: [],
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
            color:'rgb(35,168,224)'
           
          }

        },
      
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    };
   
    
  }
  handleIndepthButtonChange = (e) =>
  {
    
    
    window.open('/DashBoard/DashboardLostTime');
  }
  async componentDidMount()
  {
          
    let body = new URLSearchParams({
    
      'FromDate':this.state.FromDate,
      'ToDate':this.state.ToDate,
      'Site':this.props.props
   });
  
   api.post('/HomeScreen/DashboardLosttime/DashBoardGetLostTime',body).then(
    res => 
    
    {
              
      let resdata = res.data;
         
          var shortbreaklosttime =[];
          var longbreaklosttime=[];
          var startlosttime =[];
          var endlosttime= [];
          var  date = [];
          

  var temp = resdata.Date;
  date = temp.map(x=>x);

   temp = resdata.LongBreakLostTime;
   longbreaklosttime = temp.map(x=>x);

   temp = resdata.ShortBreakLostTime;
   shortbreaklosttime = temp.map(x=>x);

   temp = resdata.StartLostTime;
   startlosttime = temp.map(x=>x);

   temp = resdata.EndLostTime;
   endlosttime = temp.map(x=>x);
   var sum= [];
   
   for(var  i =0; i < date.length;i++)
   {
     sum.push(parseInt(endlosttime[i]) + parseInt(startlosttime[i]) + parseInt(shortbreaklosttime[i]) + parseInt(longbreaklosttime[i]))
   }

            this.setState({
                options:
                {
                    chart: {
                        id:"Lost Time"
                    },
                        xaxis :
                        {
                            categories: date
                        }

                },
                options1:
                {
                  labels:date
                },
                open:true,
                series1: sum ,
                series: [{
                    name: 'Start Lost Time',
                    data: startlosttime
                  }, {
                    name: 'End Lost Time',
                    data: endlosttime
                  }, {
                    name: 'Short Break Lost Time',
                    data: shortbreaklosttime
                  },{
                    name: 'Long Break Lost Time',
                    data: longbreaklosttime
                  
                  }],
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

    // Another Api call for the Lost Time Per User 

    api.post('/HomeScreen/DashboardLosttime/DashBoardGetLostTime_PerUser',body).then(
      res => 
      
      {
                
        let resdata = res.data;
           
           
            var TotalLostTime= [];
            var UserIDs = [];
            

              var temp = resdata.UserID;
              UserIDs = temp.map(x=>x);

              temp = resdata.TotalLostTime;
               TotalLostTime = temp.map(x=>x);


               this.setState({

                lineGraphSeries:[
                  { name: 'Total Lost Time',
                    data: TotalLostTime
                   }
                ],
                  lineGraphOptions:
                  {
                    chart:
                    {
                      id:'lostTime_PerUser',
                    },
                      xaxis:
                      {
                          categories:UserIDs
                      }
                  },
                
                 
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
        title="LOST TIME PER CATEGORY"
      />
      <Divider />
  
  <CardContent>
             <Box
               sx={{
               height: 250,
               position: 'relative'
               }}
              >
                <Chart options={this.state.options} series={this.state.series} type="bar" height={250} width={850} />
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
        title="LOST TIME PER DAY"
      />
      <Divider />
           <CardContent>
             <Box
              sx={{
               height: 220,
               position: 'relative'
                }}
               >  
              <Chart   options={this.state.options1} series={this.state.series1} type="donut" height={220}  />
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



export default LostTimeGraph;
