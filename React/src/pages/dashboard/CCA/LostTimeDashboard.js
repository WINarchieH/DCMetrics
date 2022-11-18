import React, { Component, useState, useEffect} from 'react';
import Screen from '../../../components/screen/screen';
import api from '../../../components/api/api';

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
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../components/fields/dateHelpers';
import { batch } from 'react-redux';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {ClipLoader,SyncLoader} from "react-spinners";
   
         
          const useStyles = makeStyles((theme) => ({
            root: {
            width:'200%',
          
            fontFamily:"Montserrat",
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
         const lastDay = curr.getDate() - curr.getDay() -1 ; // First day is the day of the month - the day of the week
     //    const firstDay = ; // last day is the first day + 6
         
     const fromdate = new Date(new Date().setDate(lastDay)).toDateString();
     const todate = new Date(new Date().setDate(lastDay)).toDateString();
     var COLORS = [];   
     while (COLORS.length < 8) {
      COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
             }

              // random number generator
              function rand(frm, to) {
               return ~~(Math.random() * (to - frm)) + frm;
               } ;


        
         class Charts extends React.Component {
          constructor(props) {
            super(props);
  

            this.state = {
          
              FromDate:TestdateObjToInput(dateToDateObj(fromdate)),
              ToDate:TestdateObjToInput(dateToDateObj(todate)),
              syncloader : true,
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
              series1: [
                [{
                  name: 'Picker Lost Time',
                  data:[]
                }, {
                  name: 'Cleaner Lost Time',
                  data: []
                }, {
                  name: 'Rework Lost Time',
                  data: []
                },{
                  name: 'High Raise Driver Lost Time',
                  data: []
                },{
                  name: 'Forklift driver Lost Time',
                  data:[]
                
                }]
              ],
              options1: {
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
                 
                  categories: [],
                },
                legend: {
                  position: 'right',
                  offsetY: 40
                },
                fill: {
                  opacity: 1
                },
                title: {
                  text: 'LOST TIME PER ROLE',
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
              
              series2: [],
              options2: {
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
                  text: 'LOST TIME PER MANAGER',
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
              series3: [],
              options3: {
                colors :COLORS,
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
                  text: 'LOST TIME PER SHIFT',
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
  



  
              series4: [],
              options4: {
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
            this.setState({
              syncloader : true,
            })
              
            let body = new URLSearchParams({
    
                'FromDate':this.state.FromDate,
                'ToDate':this.state.ToDate
             });
             api.post('/Dashboard/DashboardLosttime/DashBoardGetLostTimeAll',body).then(
              res => 
              {

                let resdata = res.data;
                
                var Pickerlosttime =[];
                var Cleanerlosttime=[];
                var Reworklosttime =[];
                var HRDriverlosttime= [];
                var ForkliftDriverlosttime = [];
                var  date1 = [];
      
                //
                var  date2 = [];
                var  FDLostTime =[];
                var  JBLostTime =[];
                var  TPLostTime =[];
                var  PTLostTime =[];
      
                //
                var  date3 = [];
                var  AO00LostTime =[];
                var  DT00LostTime =[];
                var  DS00LostTime =[];
                var  DO00LostTime =[];
                var  AS00LostTime =[];
                var  DS07LostTime =[];
                var  AT00LostTime =[];
                
      
               var temp = resdata.dates_Roles;
               date1 = temp.map(x=>x);
      
               temp = resdata.Role_PickerUnits;
                Pickerlosttime = temp.map(x=>x);
      
              temp = resdata.Role_cleaner;
              Cleanerlosttime = temp.map(x=>x);
      
              temp = resdata.Role_ReworkUnits;
              Reworklosttime = temp.map(x=>x);
      
               temp = resdata.Role_HRDriverUnits;
               HRDriverlosttime = temp.map(x=>x);
               
               temp = resdata.ForkliftDriverUnits;
               ForkliftDriverlosttime = temp.map(x=>x);
      
               //
      
               var temp = resdata.dates_Manager;
               date2 = temp.map(x=>x);
      
               temp = resdata.Manager_FDUnits;
               FDLostTime = temp.map(x=>x);
      
               temp = resdata.Manager_JBUnits;
               JBLostTime = temp.map(x=>x);
      
               temp = resdata.Manager_TPUnits;
               TPLostTime = temp.map(x=>x);
      
               temp = resdata.Manager_PTUnits;
               PTLostTime = temp.map(x=>x);
      
                          
               var temp = resdata.dates_Shift;
               date3 = temp.map(x=>x);
      
               temp = resdata.shift_AO00Units;
               AO00LostTime = temp.map(x=>x);
      
               temp = resdata.shift_DT00Units;
               DT00LostTime = temp.map(x=>x);
      
               temp = resdata.shift_DS00Units;
               DS00LostTime = temp.map(x=>x);
      
               temp = resdata.shift_DO00Units;
               DO00LostTime = temp.map(x=>x);
      
               temp = resdata.shift_DS07Units;
               DS07LostTime = temp.map(x=>x);
      
               temp = resdata.shift_AT00Units;
               AT00LostTime = temp.map(x=>x);
      
               temp = resdata.shift_AS00Units;
               AS00LostTime = temp.map(x=>x);
      




             
                

                 
                   
                        this.setState({
            
                        
                            options4:
                            {
                                    xaxis :
                                    {
                                        categories: date1
                                    }
            
                            },
                            options1:
                            {
                              labels:date1
                            },
                            
                            series1: [{
                                name: 'Picker',
                                data: Pickerlosttime
                              }, {
                                name: 'Cleaner',
                                data: Cleanerlosttime
                              }, {
                                name: 'Rework',
                                data: Reworklosttime
                              },{
                                name: 'Hireach Driver',
                                data: HRDriverlosttime
                              },{
                                name: 'Forklift driver',
                                data:ForkliftDriverlosttime
                              
                              }],
                   
    

// manager
                   
                        options2:
                        {
                          labels:date2
                        },
                        series2: [{
                            name: 'Frans Dekker',
                            data: FDLostTime
                          }, {
                            name: 'Jaymeelee Brown',
                            data: JBLostTime
                          }, {
                            name: 'Peter Turner',
                            data: PTLostTime
                          },{
                            name: 'Tupou Peaua',
                            data: TPLostTime
                          }],
                  
    //shift

                        
                
                        options3:
                        {
                          labels:date3
                        },
                    
                        series3: [{
                            name: 'AO00',
                            data: AO00LostTime
                          }, {
                            name: 'AS00',
                            data: AS00LostTime
                          }, {
                            name: 'AT00',
                            data: AT00LostTime
                          },{
                            name: 'DS00',
                            data: DS00LostTime
                          },
                          {
                            name: 'DS07',
                            data: DS07LostTime
                          },
                          {
                            name: 'DT00',
                            data: DT00LostTime
                          },
                          {
                            name: 'DO00',
                            data: DO00LostTime
                          }],
                          syncloader: false
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

                      syncloader : false,
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
         api.post('/Dashboard/DashboardLosttime/DashBoardGetLostTimeAll',body).then(
          res => 
          {

            let resdata = res.data;
            
            var Pickerlosttime =[];
            var Cleanerlosttime=[];
            var Reworklosttime =[];
            var HRDriverlosttime= [];
            var ForkliftDriverlosttime = [];
            var  date1 = [];
  
            //
            var  date2 = [];
            var  FDLostTime =[];
            var  JBLostTime =[];
            var  TPLostTime =[];
            var  PTLostTime =[];
  
            //
            var  date3 = [];
            var  AO00LostTime =[];
            var  DT00LostTime =[];
            var  DS00LostTime =[];
            var  DO00LostTime =[];
            var  AS00LostTime =[];
            var  DS07LostTime =[];
            var  AT00LostTime =[];
            
  
           var temp = resdata.dates_Roles;
           date1 = temp.map(x=>x);
  
           temp = resdata.Role_PickerUnits;
            Pickerlosttime = temp.map(x=>x);
  
          temp = resdata.Role_cleaner;
          Cleanerlosttime = temp.map(x=>x);
  
          temp = resdata.Role_ReworkUnits;
          Reworklosttime = temp.map(x=>x);
  
           temp = resdata.Role_HRDriverUnits;
           HRDriverlosttime = temp.map(x=>x);
           
           temp = resdata.ForkliftDriverUnits;
           ForkliftDriverlosttime = temp.map(x=>x);
  
           //
  
           var temp = resdata.dates_Manager;
           date2 = temp.map(x=>x);
  
           temp = resdata.Manager_FDUnits;
           FDLostTime = temp.map(x=>x);
  
           temp = resdata.Manager_JBUnits;
           JBLostTime = temp.map(x=>x);
  
           temp = resdata.Manager_TPUnits;
           TPLostTime = temp.map(x=>x);
  
           temp = resdata.Manager_PTUnits;
           PTLostTime = temp.map(x=>x);
  
                      
           var temp = resdata.dates_Shift;
           date3 = temp.map(x=>x);
  
           temp = resdata.shift_AO00Units;
           AO00LostTime = temp.map(x=>x);
  
           temp = resdata.shift_DT00Units;
           DT00LostTime = temp.map(x=>x);
  
           temp = resdata.shift_DS00Units;
           DS00LostTime = temp.map(x=>x);
  
           temp = resdata.shift_DO00Units;
           DO00LostTime = temp.map(x=>x);
  
           temp = resdata.shift_DS07Units;
           DS07LostTime = temp.map(x=>x);
  
           temp = resdata.shift_AT00Units;
           AT00LostTime = temp.map(x=>x);
  
           temp = resdata.shift_AS00Units;
           AS00LostTime = temp.map(x=>x);
  




         
            

             
               
                    this.setState({
        
                    
                        options4:
                        {
                                xaxis :
                                {
                                    categories: date1
                                }
        
                        },
                        options1:
                        {
                          labels:date1
                        },
                        
                        series1: [{
                            name: 'Picker',
                            data: Pickerlosttime
                          }, {
                            name: 'Cleaner',
                            data: Cleanerlosttime
                          }, {
                            name: 'Rework',
                            data: Reworklosttime
                          },{
                            name: 'Hireach Driver',
                            data: HRDriverlosttime
                          },{
                            name: 'Forklift driver',
                            data:ForkliftDriverlosttime
                          
                          }],
               


// manager
               
                    options2:
                    {
                      labels:date2
                    },
                    series2: [{
                        name: 'Frans Dekker',
                        data: FDLostTime
                      }, {
                        name: 'Jaymeelee Brown',
                        data: JBLostTime
                      }, {
                        name: 'Peter Turner',
                        data: PTLostTime
                      },{
                        name: 'Tupou Peaua',
                        data: TPLostTime
                      }],
              
//shift

                    
            
                    options3:
                    {
                      labels:date3
                    },
                
                    series3: [{
                        name: 'AO00',
                        data: AO00LostTime
                      }, {
                        name: 'AS00',
                        data: AS00LostTime
                      }, {
                        name: 'AT00',
                        data: AT00LostTime
                      },{
                        name: 'DS00',
                        data: DS00LostTime
                      },
                      {
                        name: 'DS07',
                        data: DS07LostTime
                      },
                      {
                        name: 'DT00',
                        data: DT00LostTime
                      },
                      {
                        name: 'DO00',
                        data: DO00LostTime
                      }],
                      syncloader: false
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
                       
                        backgroundColor:'rgb(241, 242, 242)'
                    
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
                    style ={{ fontFamily:'Montserrat', marginLeft : '90px', marginTop:'6px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                    onClick={(e) => {this.onButtonClick(e)}}
                  
                   
                  >
                    Update
                  </Button>
                  <SyncLoader color="blue" loading={this.state.syncloader}  css={{ marginLeft : '30px',display: 'block',margin: '0 auto',borderClose: 'red',margin:'2'}} size={16} />
              </div>
              
            <br></br>

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
   
   <Chart options={this.state.options1} series={this.state.series1} type="bar" height={350} width={1050} />
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
   
   <Chart options={this.state.options2} series={this.state.series2} type="bar" height={350} width={1050} />
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
   
   <Chart options={this.state.options3} series={this.state.series3} type="bar" height={350} width={1050} />
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

)}
};
    
    

      
    
export default Charts;