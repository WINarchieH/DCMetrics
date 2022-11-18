import React, { Component, useState, useEffect} from 'react';
import Screen from '../../components/screen/screen';
import api from '../../components/api/api';

import Chart from 'react-apexcharts'
// card

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../components/fields/dateHelpers';
import { batch } from 'react-redux';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

   
         
          const useStyles = makeStyles((theme) => ({
            root: {
            width:'200%',
          
            fontFamily:"Calibri",
              fontSize:"10px"
            },
            media: {
              height: 0,
              paddingTop: "56.25%" // 16:9
            },
           
            container: {
              display: 'flex',
              flexWrap: 'wrap',
            },
            textField: {
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
              width: 200,
            },
            button: {
              margin: theme.spacing(1),
            }
           
          }));
        
         const curr = new Date() ; // get current date
         const lastDay = curr.getDate() - curr.getDay() +2 ; // First day is the day of the month - the day of the week
         const firstDay = lastDay - 6; // last day is the first day + 6
         
         const todate = new Date(curr.setDate(lastDay)).toDateString();
         const fromdate = new Date(curr.setDate(firstDay)).toDateString();
        
        
        
         class Charts extends React.Component {
          constructor(props) {
            super(props);
  

            this.state = {
          
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
                    fontFamily:'Montserrat',
                    color: 'rgb(35,168,224)'
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
                      color:'rgb(35,168,224)',
                      fontFamily:'Montserrat',
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
                      offsetX: -10,
                      offsetY: 0
                    }
                  }
                }],
                plotOptions: {
                  bar: {
                    borderRadius: 8,
                    horizontal: false,
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
                  text: 'LOST TIME PER CATEGORY',
                  align: 'black',
                  style: {
                    fontSize: "11px",
                    fontFamily:'Montserrat',
                    color: 'rgb(35,168,224)'
                  }

                },
                yaxis: {
                 
                  title: {
                    text: 'LOST TIME',
                    style:
                    {
                      color:'rgb(35,168,224)',
                      fontFamily:'Montserrat',
                      fontSize:'10px'
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
                  text: 'TOTAL LOST TIME PER DAY',
                  align: 'black',
                  style: {
                    fontSize: "11px",
                    fontFamily:'Montserrat',
                    color:'rgb(35,168,224)',
                   
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
  

        handleChange = (e) =>
        {
            
            this.setState({FromDate: dateToInput(inputToDate(e.target.value))});
          };
    
          handleEndDateChange = (e) =>
        {
          
            this.setState({ToDate: dateToInput(inputToDate(e.target.value))});
    
          };
          onButtonClick=(e)=>
          {
              
            let body = new URLSearchParams({
    
                'FromDate':this.state.FromDate,
                'ToDate':this.state.ToDate
             });
             api.post('/Dashboard/DashboardLosttime/DashBoardGetLostTime',body).then(
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

              api.post('/Dashboard/DashboardLosttime/DashBoardGetLostTime_PerUser',body).then(
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


        async componentDidMount(){
        
    
              
          let body = new URLSearchParams({
    
            'FromDate':this.state.FromDate,
            'ToDate':this.state.ToDate
         });
        
         api.post('/Dashboard/DashboardLosttime/DashBoardGetLostTime',body).then(
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

          api.post('/Dashboard/DashboardLosttime/DashBoardGetLostTime_PerUser',body).then(
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

        render() {
          return (
            
            <Screen>
            <div style = {{paddingLeft:'1vw',
            }}>
                <Card style ={
                    {
                        marginLeft:'3vw',
                        width:'95%',
                        backgroundColor:'rgb(241, 241, 242)'
                    
                    }
                }>
              
            
                <CardContent>
                <Typography>
              
            
              <div style= {{ display: 'flex', justifycontent: 'center', alignitems: 'center', height:'3vw' }}>
                  <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    style ={
                        { marginLeft : '28%'}}
                  className = {useStyles.textField}
                    value = {this.state.FromDate}
                    onChange={(e) => {this.handleChange(e)}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                
                <TextField
                    id="enddate"
                    label="End Date"
                    className = {useStyles.textField}
                    style ={{ marginLeft : '70px'}}
                    type="date"
                    value = {this.state.ToDate}
                    onChange={(e) => {this.handleEndDateChange(e)}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
              <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style ={{  fontFamily:'Montserrat', marginLeft : '90px', marginTop:'6px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                    onClick={(e) => {this.onButtonClick(e)}}
                  
                   
                  >
                    Update
                  </Button>
              
              </div>
              
            <br></br>

            <table>
  <tr>
    <td>
    <Grid item xs={50}>
<Paper>
<Card style ={
        {
            alignContent:'center',
            width:'100%',
            backgroundColor:'white'
        
        }
    }>
      <CardContent>
        <Typography>
        <div id="chart">
   
   <Chart options={this.state.options} series={this.state.series} type="bar" height={390} width={850} />
   </div>
   
        </Typography>
      </CardContent>
  <CardActions disableSpacing></CardActions>
      </Card>
</Paper>
        </Grid>
        </td>
        <td >

      
        <Grid  style ={{ marginLeft: '2vw'}} item xs={30}>
          <Paper>
          <Card style={{
      alignContent:'center',
      height:'400px',
      width:'121%',
    
      backgroundColor:'white'}}>
              <CardContent>
                <Typography>
                 <div >
                <Chart   options={this.state.options1} series={this.state.series1} type="donut" height={500}  />
               
                 </div>
                </Typography>
              </CardContent>

   </Card>
            
          </Paper>
        </Grid>
        </td>
  </tr>
  
</table>
<table>
  <tr>
    <td>
    <Grid item xs={100}>
<Paper>
<Card style ={
        {
            alignContent:'center',
            width:'120%',
            backgroundColor:'white',
            paddingLeft:'3vw'
        
        }
    }>
      <CardContent>
        <Typography>
        <div id="chart">
   
   <Chart options={this.state.lineGraphOptions} series={this.state.lineGraphSeries} type="line"  height={350} width={1050} />
   </div>
   
        </Typography>
      </CardContent>
  <CardActions disableSpacing></CardActions>
      </Card>
</Paper>
        </Grid>
        </td>
      
  </tr>
  
</table>


</Typography>
  </CardContent>
  <CardActions disableSpacing></CardActions>
</Card>
  </div>
  </Screen>
          )
        }
    };
    

      

export default Charts;