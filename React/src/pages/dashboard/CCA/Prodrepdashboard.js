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
//Grid
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { UNIT_SEP } from 'papaparse';

// react Spinners
import {ClipLoader,SyncLoader} from "react-spinners";

const useStyles = makeStyles((theme) => ({
    root: {
    width:'220%',
  
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

 ;

const curr = new Date() ; // get current date
const lastDay = curr.getDate() - curr.getDay() -1 ; // First day is the day of the month - the day of the week
const firstDay = lastDay - 1; // last day is the first day + 6

const last = new Date(new Date().setDate(lastDay)).toDateString();
const first = new Date(new Date().setDate(lastDay-5)).toDateString();

class ApexChart extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {

        //rep  and move div hiding in case of empty dataset
        syncloader : true,
        startDate:TestdateObjToInput(dateToDateObj(first)),
        endDate:TestdateObjToInput(dateToDateObj(last)),
        //Line graph Series and Options
       lineGraphSeries:[
        { name: 'Total Rep',
          data: []
         } ],
         lineGraphOptions:
         {
           chart: {
             id:'Putaway_PerUser',
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
             text: 'Top 15 Users by Rep',
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
               text: 'No Of Rep',
               style:
               {
                 fontFamily: "Montserrat",
                   color:'rgb(35,168,224)',
                 fontSize:'10px'
               }
             },
           }

         },
       
     
        role_radialseries: [
          {
            name: 'Forklift Driver',
            data: []
            },
             {
              name: 'Picker',
              data: []
              },
               {
                name: 'Hireach Driver',
                data: []
                },
                {
                  name: 'Rework',
                  data: []
                  }

      ], 
      manager_radialseries: [
        {
         name: 'JAYMEELEE BROWN',
         data: []
         },
          {
           name: 'TUPOU PEAUA',
           data: []
           },
            {
             name: 'PETER TURNER',
             data: []
             },
             {
               name: 'FRANS DEKKER',
               data: []
             }
                ],
                shift_radialseries: [
                  {
                    name: 'DS00',
                    data: []
                    },
                    {
                      name: 'DTOO',
                      data: []
                    },
                    {
                        name: 'DS07',
                        data: []
                      },
                        {
                          name: 'DO00',
                          data: []
                        },
                          {
                            name: 'AO00',
                            data: []
                            },
                             {
                              name: 'AS00',
                              data: []
                              },
                               {
                                name: 'AT00',
                                data: []
                                }
                            ], 
      
        Role_radialoptions: {
          chart: {
            id :'AreaChart',
            height: 350,
            type: 'area'
          },
          dataLabels: {
            enabled: true
          },
          
          stroke: {
            curve: 'smooth'
          },
         
          xaxis:
          {
            categories: []
          },
          yaxis: {
                 
            title: {
              text: 'No of Replenishments',
            
            style:{ fontSize:  '10px',
            fontFamily: "Montserrat",
            color:'rgb(35,168,224)'}
          }
         },
          title:
          {
            text:"Total Replenishments Per Role Per Day",
            align:"left",
          style: {
            fontSize:  '12px',
            fontFamily: "Montserrat",
            color:'rgb(35,168,224)'
          }
          },
          tooltip:
          {
            x:
            {
              format: 'dd MM'
            },
          },

        },   

        // Shift
       
      
        shift_radialoptions: {
          chart: {
            id :'AreaChart',
            height: 350,
            type: 'area'
          },
          dataLabels: {
            enabled: true
          },
          
          stroke: {
            curve: 'smooth'
          },
         
          xaxis:
          {
            title: {
              text: 'Date',
            
            style:{ fontSize:  '10px',
            fontFamily: "Montserrat",
            color:'rgb(35,168,224)'}
            },
           
            categories: []
          },
          yaxis: {
                 
            title: {
              text: 'No of Putaways',
            
            style:{ fontSize:  '10px',
            fontFamily: "Montserrat",
            color:'rgb(35,168,224)'}
          }
         },
          title:
          {
            text:"Total Replenishments Per Shift Per Day",
            align:"left",
          style: {
            fontSize:  '12px',
            fontFamily: "Montserrat",
            color:'rgb(35,168,224)'
          }
          },
          tooltip:
          {
            x:
            {
              format: 'dd MM'
            },
          },

        },

        //Manager

         
        
        role_series: [
          
          {
            name: 'Forklift Driver',
            data: []
            },
             {
              name: 'Picker',
              data: []
              },
               {
                name: 'Hireach Driver',
                data: []
                },
                {
                  name: 'Rework',
                  data: []
                  }
         ],
        Role_options:{
       
          chart: {
            id:"Pick-Chart",
            
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }, 

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
            title: {
              text: 'Date',
            
            style: { fontSize: '10px',
             fontFamily: "Montserrat",
             color:'rgb(35,168,224)'
            
            }
            }
          },
          legend: {
            position: 'right',
            offsetY: 40
          },
          fill: {
            opacity: 1
          },
          title:{
            text:"Replenishments Productivity By Role",
            align:"center",
          
          style: {
            fontSize:  '12px',
             fontFamily: "Montserrat",
             color:'rgb(35,168,224)'

          }
         },
         yaxis: {
                 
          title: {
            text: 'No of Replenishments Per Hour',
          
          style: { fontSize: '10px',
           fontFamily: "Montserrat",
           color:'rgb(35,168,224)'
          
          }
          }
         },
       },

       // by shift

       shift_series:
       [
          {
           name: 'DS00',
           data: []
          },
          {
            name: 'DTOO',
            data: []
          },
           {
              name: 'DS07',
              data: []
            },
              {
                name: 'DO00',
                data: []
              },
              {
                  name: 'AO00',
                  data: []
              },
              {
                    name: 'AS00',
                    data: []
              },
              {
                name: 'AT00',
                data: []
              }
       ],
      shift_options:{
     
        chart: {
          id:"Pick-Chart",
          
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }, 

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
          title: {
            text: 'Date',
          
          style: { fontSize: '10px',
           fontFamily: "Montserrat",
           color:'rgb(35,168,224)'
          
          }
          }
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        },
        title:{
          text:"Replenishment Productivity By Shift",
          align:"center",
        
        style: {
          fontSize:  '12px',
           fontFamily: "Montserrat",
           color:'rgb(35,168,224)'

        }
       },
       yaxis: {
               
        title: {
          text: 'No of Replenishments Per Hour',
        
        style: { fontSize: '10px',
         fontFamily: "Montserrat",
         color:'rgb(35,168,224)'
        
        }
        }
       },
     },
       // by manager
       manager_series: [
        {
          name: 'JAYMEELEE BROWN',
          data: []
          },
           {
            name: 'TUPOU PEAUA',
            data: []
            },
             {
              name: 'PETER TURNER',
              data: []
              },
              {
                name: 'FRANS DEKKER',
                data: []
              }
      ], 
       
       manager_radialoptions: {
           chart: {
            id :'AreaChart',
            height: 350,
            type: 'area'
            },
           dataLabels: {
             enabled: true
            },
           stroke: {
             curve: 'smooth'
            },
            xaxis:
            {
                categories: []
            },
             yaxis: {
               
                title: {
                text: 'No of Replenishments',
          
                      style:{ fontSize:  '10px',
                          fontFamily: "Montserrat",
                           color:'rgb(35,168,224)'}
                      }
            },
           title:
            {
              text:"Total Replenishments Per Manager Per Day",
              align:"left",
           style: {
             fontSize:  '12px',
             fontFamily: "Montserrat",
              color:'rgb(35,168,224)'
             }
            },
           tooltip:
           {
             x:
             {
              format: 'dd MM'
              },
            },

           },
          
      manager_options:{
     
        chart: {
        
          
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }, 

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
          title: {
            text: 'Date',
          
          style: { fontSize: '10px',
           fontFamily: "Montserrat",
           color:'rgb(35,168,224)'
          
          }
          }
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        },
        title:{
          text:"Replenishment Productivity By Manager",
          align:"center",
        
        style: {
          fontSize:  '12px',
           fontFamily: "Montserrat",
           color:'rgb(35,168,224)'

        }
       },
       yaxis: {
               
        title: {
          text: 'No of Replenishments Per Hour',
        
        style: { fontSize: '10px',
         fontFamily: "Montserrat",
         color:'rgb(35,168,224)'
        
        }
        }
       },
       }
      };




    }
    handleChange = (e) =>
    {
        
        this.setState({startDate: dateToInput(inputToDate(e.target.value))});
      };

      handleEndDateChange = (e) =>
    {
      
        this.setState({endDate: dateToInput(inputToDate(e.target.value))});

      };
      onButtonClick=(e)=>
      {

        this.setState(
          {
            syncloader: true
          }
        );

        let body = new URLSearchParams({

          'StartDate':this.state.startDate,
          'EndDate':this.state.endDate
       });

        api.post('/Dashboard/DashboardProductivity/GetCCA_RepProd_Split',body).then(
          res => 
          {


            let resdata = res.data;
            var dates =[];
            var manager_dates = [];
              var shift_dates = [];
            var forkliftdriversunits=[];
            var forkiftdriversunitsPerHour =[];

            var reworkunits=[];
            var reworkunitsPerHour =[];

            var hireachunits=[];
            var hireachunitsPerHour =[];

            var pickersunits=[];
            var pickersunitsPerHour =[];

              var JBunits=[];
              var JBunitsPerHour =[];

              var FDunits=[];
              var FDunitsPerHour =[];

              var PTunits=[];
              var PTunitsPerHour =[];

              var TPunits=[];
              var TPunitsPerHour =[];

              //Shift
              var AS00units=[];
              var AS00unitsPerHour =[];

              var AO00units=[];
              var AO00unitsPerHour =[];

              var AT00units=[];
              var AT00unitsPerHour =[];

              var DS00units=[];
              var DS00unitsPerHour =[];

              var DS07units=[];
              var DS07unitsPerHour =[];

              var DO00units=[];
              var DO00unitsPerHour =[];

              var DT00units=[];
              var DT00unitsPerHour =[];

              var COLORS = [];
              while (COLORS.length < 8) {
               COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
                      }

                       // random number generator
                       function rand(frm, to) {
                        return ~~(Math.random() * (to - frm)) + frm;
                        } 


      
              var temp =   resdata.dates_Roles;
               dates =       temp.map(x=>x);

               var temp =   resdata.dates_Manager;
               manager_dates =       temp.map(x=>x);

               var temp =   resdata.dates_Shift;
               shift_dates =       temp.map(x=>x);

               // forklift driver

                temp =    resdata.ForkliftDriverPutaway;
                forkiftdriversunitsPerHour = temp.map(x => x);
               
                temp =    resdata.ForkliftDriverUnits;
                forkliftdriversunits =  temp.map(x => x);

                // rework

                temp =    resdata.Role_ReworkUnits;
                reworkunits = temp.map(x => x);
               
                temp =    resdata.Role_ReworkPutaway;
                reworkunitsPerHour =  temp.map(x => x);
                
                //picker
                temp =    resdata.Role_PickerUnits;
                pickersunits = temp.map(x => x);
               
                temp =    resdata.Role_PickerPutaway;
                pickersunitsPerHour =  temp.map(x => x);


                //Hi reach

                 
                 temp =    resdata.Role_HRDriverUnits;
                 hireachunits = temp.map(x => x);
                
                 temp =    resdata.Role_HRDriverPutaway;
                hireachunitsPerHour =  temp.map(x => x);


                temp =    resdata.Manager_FDUnits;
                FDunits = temp.map(x => x);
               
                temp =    resdata.Manager_FDPutaway;
                FDunitsPerHour =  temp.map(x => x);

            
                temp =    resdata.Manager_JBUnits;
                JBunits = temp.map(x => x);
               
                temp =    resdata.Manager_JBPutaway;
                JBunitsPerHour =  temp.map(x => x);

                temp =    resdata.Manager_TPUnits;
                TPunits  = temp.map(x => x);
               
                temp =    resdata.Manager_TPPutaway;
                TPunitsPerHour =  temp.map(x => x);

                temp =    resdata.Manager_PTUnits;
                PTunits = temp.map(x => x);
               
                temp =    resdata.Manager_PtPutaway;
                PTunitsPerHour =  temp.map(x => x);

                //Shift
                temp =    resdata.shift_AT00Units;
                AT00units = temp.map(x => x);
               
                temp =    resdata.Shift_AT00Putaway;
                AT00unitsPerHour =  temp.map(x => x);

                //AS00
                temp =    resdata.shift_AS00Units;
                AS00units = temp.map(x => x);
               
                temp =    resdata.Shift_AS00Putaway;
                AS00unitsPerHour =  temp.map(x => x);

                //AO00
                temp =    resdata.shift_AO00Units;
                AO00units = temp.map(x => x);
               
                temp =    resdata.Shift_AO00Putaway;
                AO00unitsPerHour =  temp.map(x => x);

                //DS07
                temp =    resdata.shift_DS07Units;
                DS07units = temp.map(x => x);
               
                temp =    resdata.Shift_DS07Putaway;
                DS07unitsPerHour =  temp.map(x => x);

                //DO00
                temp =    resdata.shift_DO00Units;
                DO00units = temp.map(x => x);
               
                temp =    resdata.Shift_DO00Putaway;
                DO00unitsPerHour =  temp.map(x => x);

                //DT00
                temp =    resdata.shift_DT00Units;
                DT00units = temp.map(x => x);
               
                temp =    resdata.shift_DT00Putaway;
                DT00unitsPerHour =  temp.map(x => x);
                //DS00
                temp =    resdata.shift_DS00Units;
                DS00units = temp.map(x => x);
               
                temp =    resdata.Shift_DS00Putaway;
                DS00unitsPerHour =  temp.map(x => x);

          

              this.setState({
                
                  Role_options:
                  {
                      chart: {
                          id:"Pick-Chart"
                      },
                          xaxis :
                          {
                              categories: dates
                          }

                  },
                  shift_options:
                  {
                      chart: {
                          id:"Pick-Chart"
                      },
                          xaxis :
                          {
                              categories: shift_dates
                          },
                          colors:COLORS

                  },
                  manager_options:
                  {
                      chart: {
                          id:"Pick-Chart"
                      },
                          xaxis :
                          {
                              categories: manager_dates
                          }

                  },
                 
                  role_series: [
                    {
                    name: 'Forklift Driver',
                    data: forkiftdriversunitsPerHour
                    },
                     {
                      name: 'Picker',
                      data: pickersunitsPerHour
                      },
                       {
                        name: 'Hireach Driver',
                        data: hireachunitsPerHour
                        },
                        {
                          name: 'Rework',
                          data: reworkunitsPerHour
                          }
                   ],
                   shift_series:
                   [
                    {
                      name: 'DS00',
                      data: DS00unitsPerHour
                      },
                      {
                        name: 'DTOO',
                        data: DT00unitsPerHour
                      },
                      {
                          name: 'DS07',
                          data: DS07unitsPerHour
                        },
                          {
                            name: 'DO00',
                            data: DO00unitsPerHour
                          },
                            {
                              name: 'AO00',
                              data: AO00unitsPerHour
                              },
                               {
                                name: 'AS00',
                                data: AS00unitsPerHour
                                },
                                 {
                                  name: 'AT00',
                                  data: AT00unitsPerHour
                                  }
                    
                   ],
              
                   manager_series:
                   [
                    {
                      name: 'JAYMEELEE BROWN',
                      data: JBunitsPerHour
                      },
                       {
                        name: 'TUPOU PEAUA',
                        data: TPunitsPerHour
                        },
                         {
                          name: 'PETER TURNER',
                          data: PTunitsPerHour
                          },
                          {
                            name: 'FRANS DEKKER',
                            data: FDunitsPerHour
                          }
                   ],
                    Role_radialoptions :
                    {
                      chart: 
                      {
                        id :'AreaChart'
                      },
                      xaxis:
                      {
                        categories: dates
                      }
                    },
                    shift_radialoptions:
                    {
                      
                        xaxis:
                        {
                          categories: shift_dates
                        },

                        colors : COLORS
                        
                      
                      },
                    manager_radialoptions :
                    {
                      
                      
                        xaxis:
                        {
                          categories: manager_dates
                        }
                      
                    },                   
                    role_radialseries: [
                      {
                        name: 'Forklift Driver',
                        data: forkliftdriversunits
                        },
                         {
                          name: 'Picker',
                          data: pickersunits
                          },
                           {
                            name: 'Hireach Driver',
                            data: hireachunits
                            },
                            {
                              name: 'Rework',
                              data: reworkunits
                              }
            
                  ], 

                  manager_radialseries:
                   [
                    {
                      name: 'JAYMEELEE BROWN',
                      data: JBunits
                      },
                       {
                        name: 'TUPOU PEAUA',
                        data: TPunits
                        },
                         {
                          name: 'PETER TURNER',
                          data: PTunits
                          },
                          {
                            name: 'FRANS DEKKER',
                            data: FDunits
                          }
                   ],
                   shift_radialseries: [
                     {
                      name: 'DS00',
                      data: DS00units
                      },
                      {
                        name: 'DTOO',
                        data: DT00units
                      },
                      {
                          name: 'DS07',
                          data: DS07units
                        },
                          {
                            name: 'DO00',
                            data: DO00units
                          },
                            {
                              name: 'AO00',
                              data: AO00units
                              },
                               {
                                name: 'AS00',
                                data: AS00units
                                },
                                 {
                                  name: 'AT00',
                                  data: AT00units
                                  }
                              ], 
              })

              this.setState({
                syncloader: false
              })


          }).catch(
              err => {
                  // TODO: Error handling
                  if (err.response) { 
                      
                  }
                  else {
                  }
              }
          )

          // Reps Per User
         
             api.post('/Dashboard/DashboardProductivity/GetRep_PerUser',body).then(
              res => 
              
              {
                        
                let resdata = res.data;
                   
                   
                    var Totallines= [];
                    var names = [];
                    
    
                      var temp = resdata.Names;
                      names = temp.map(x=>x);
    
                      temp = resdata.lines;
                      Totallines = temp.map(x=>x);
    
    
                       this.setState({
  
                        lineGraphSeries:[
                          { name: 'Total Rep',
                            data: Totallines
                           }
                        ],
                          lineGraphOptions:
                          {
                              xaxis:
                              {
                                  categories:names
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
      
       

          
         
      }

   async componentDidMount()
    {
        let body = new URLSearchParams({

             'StartDate':this.state.startDate,
             'EndDate':this.state.endDate
          });

          api.post('/Dashboard/DashboardProductivity/GetCCA_RepProd_Split',body).then(
            res => 
            {
  
  
              let resdata = res.data;
              var dates =[];
              var manager_dates = [];
                var shift_dates = [];
              var forkliftdriversunits=[];
              var forkiftdriversunitsPerHour =[];
  
              var reworkunits=[];
              var reworkunitsPerHour =[];
  
              var hireachunits=[];
              var hireachunitsPerHour =[];
  
              var pickersunits=[];
              var pickersunitsPerHour =[];
  
                var JBunits=[];
                var JBunitsPerHour =[];
  
                var FDunits=[];
                var FDunitsPerHour =[];
  
                var PTunits=[];
                var PTunitsPerHour =[];
  
                var TPunits=[];
                var TPunitsPerHour =[];
  
                //Shift
                var AS00units=[];
                var AS00unitsPerHour =[];
  
                var AO00units=[];
                var AO00unitsPerHour =[];
  
                var AT00units=[];
                var AT00unitsPerHour =[];
  
                var DS00units=[];
                var DS00unitsPerHour =[];
  
                var DS07units=[];
                var DS07unitsPerHour =[];
  
                var DO00units=[];
                var DO00unitsPerHour =[];
  
                var DT00units=[];
                var DT00unitsPerHour =[];
  
                var COLORS = [];
                while (COLORS.length < 8) {
                 COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
                        }
  
                         // random number generator
                         function rand(frm, to) {
                          return ~~(Math.random() * (to - frm)) + frm;
                          } 
  
  
        
                var temp =   resdata.dates_Roles;
                 dates =       temp.map(x=>x);
  
                 var temp =   resdata.dates_Manager;
                 manager_dates =       temp.map(x=>x);
  
                 var temp =   resdata.dates_Shift;
                 shift_dates =       temp.map(x=>x);
  
                 // forklift driver
  
                  temp =    resdata.ForkliftDriverPutaway;
                  forkiftdriversunitsPerHour = temp.map(x => x);
                 
                  temp =    resdata.ForkliftDriverUnits;
                  forkliftdriversunits =  temp.map(x => x);
  
                  // rework
  
                  temp =    resdata.Role_ReworkUnits;
                  reworkunits = temp.map(x => x);
                 
                  temp =    resdata.Role_ReworkPutaway;
                  reworkunitsPerHour =  temp.map(x => x);
                  
                  //picker
                  temp =    resdata.Role_PickerUnits;
                  pickersunits = temp.map(x => x);
                 
                  temp =    resdata.Role_PickerPutaway;
                  pickersunitsPerHour =  temp.map(x => x);
  
  
                  //Hi reach
  
                   
                   temp =    resdata.Role_HRDriverUnits;
                   hireachunits = temp.map(x => x);
                  
                   temp =    resdata.Role_HRDriverPutaway;
                  hireachunitsPerHour =  temp.map(x => x);
  
  
                  temp =    resdata.Manager_FDUnits;
                  FDunits = temp.map(x => x);
                 
                  temp =    resdata.Manager_FDPutaway;
                  FDunitsPerHour =  temp.map(x => x);
  
              
                  temp =    resdata.Manager_JBUnits;
                  JBunits = temp.map(x => x);
                 
                  temp =    resdata.Manager_JBPutaway;
                  JBunitsPerHour =  temp.map(x => x);
  
                  temp =    resdata.Manager_TPUnits;
                  TPunits  = temp.map(x => x);
                 
                  temp =    resdata.Manager_TPPutaway;
                  TPunitsPerHour =  temp.map(x => x);
  
                  temp =    resdata.Manager_PTUnits;
                  PTunits = temp.map(x => x);
                 
                  temp =    resdata.Manager_PtPutaway;
                  PTunitsPerHour =  temp.map(x => x);
  
                  //Shift
                  temp =    resdata.shift_AT00Units;
                  AT00units = temp.map(x => x);
                 
                  temp =    resdata.Shift_AT00Putaway;
                  AT00unitsPerHour =  temp.map(x => x);
  
                  //AS00
                  temp =    resdata.shift_AS00Units;
                  AS00units = temp.map(x => x);
                 
                  temp =    resdata.Shift_AS00Putaway;
                  AS00unitsPerHour =  temp.map(x => x);
  
                  //AO00
                  temp =    resdata.shift_AO00Units;
                  AO00units = temp.map(x => x);
                 
                  temp =    resdata.Shift_AO00Putaway;
                  AO00unitsPerHour =  temp.map(x => x);
  
                  //DS07
                  temp =    resdata.shift_DS07Units;
                  DS07units = temp.map(x => x);
                 
                  temp =    resdata.Shift_DS07Putaway;
                  DS07unitsPerHour =  temp.map(x => x);
  
                  //DO00
                  temp =    resdata.shift_DO00Units;
                  DO00units = temp.map(x => x);
                 
                  temp =    resdata.Shift_DO00Putaway;
                  DO00unitsPerHour =  temp.map(x => x);
  
                  //DT00
                  temp =    resdata.shift_DT00Units;
                  DT00units = temp.map(x => x);
                 
                  temp =    resdata.shift_DT00Putaway;
                  DT00unitsPerHour =  temp.map(x => x);
                  //DS00
                  temp =    resdata.shift_DS00Units;
                  DS00units = temp.map(x => x);
                 
                  temp =    resdata.Shift_DS00Putaway;
                  DS00unitsPerHour =  temp.map(x => x);
  
            
  
                this.setState({
                  
                    Role_options:
                    {
                        chart: {
                            id:"Pick-Chart"
                        },
                            xaxis :
                            {
                                categories: dates
                            }
  
                    },
                    shift_options:
                    {
                        chart: {
                            id:"Pick-Chart"
                        },
                            xaxis :
                            {
                                categories: shift_dates
                            },
                            colors:COLORS
  
                    },
                    manager_options:
                    {
                        chart: {
                            id:"Pick-Chart"
                        },
                            xaxis :
                            {
                                categories: manager_dates
                            }
  
                    },
                   
                    role_series: [
                      {
                      name: 'Forklift Driver',
                      data: forkiftdriversunitsPerHour
                      },
                       {
                        name: 'Picker',
                        data: pickersunitsPerHour
                        },
                         {
                          name: 'Hireach Driver',
                          data: hireachunitsPerHour
                          },
                          {
                            name: 'Rework',
                            data: reworkunitsPerHour
                            }
                     ],
                     shift_series:
                     [
                      {
                        name: 'DS00',
                        data: DS00unitsPerHour
                        },
                        {
                          name: 'DTOO',
                          data: DT00unitsPerHour
                        },
                        {
                            name: 'DS07',
                            data: DS07unitsPerHour
                          },
                            {
                              name: 'DO00',
                              data: DO00unitsPerHour
                            },
                              {
                                name: 'AO00',
                                data: AO00unitsPerHour
                                },
                                 {
                                  name: 'AS00',
                                  data: AS00unitsPerHour
                                  },
                                   {
                                    name: 'AT00',
                                    data: AT00unitsPerHour
                                    }
                      
                     ],
                
                     manager_series:
                     [
                      {
                        name: 'JAYMEELEE BROWN',
                        data: JBunitsPerHour
                        },
                         {
                          name: 'TUPOU PEAUA',
                          data: TPunitsPerHour
                          },
                           {
                            name: 'PETER TURNER',
                            data: PTunitsPerHour
                            },
                            {
                              name: 'FRANS DEKKER',
                              data: FDunitsPerHour
                            }
                     ],
                      Role_radialoptions :
                      {
                        chart: 
                        {
                          id :'AreaChart'
                        },
                        xaxis:
                        {
                          categories: dates
                        }
                      },
                      shift_radialoptions:
                      {
                        
                          xaxis:
                          {
                            categories: shift_dates
                          },
  
                          colors : COLORS
                          
                        
                        },
                      manager_radialoptions :
                      {
                        
                        
                          xaxis:
                          {
                            categories: manager_dates
                          }
                        
                      },                   
                      role_radialseries: [
                        {
                          name: 'Forklift Driver',
                          data: forkliftdriversunits
                          },
                           {
                            name: 'Picker',
                            data: pickersunits
                            },
                             {
                              name: 'Hireach Driver',
                              data: hireachunits
                              },
                              {
                                name: 'Rework',
                                data: reworkunits
                                }
              
                    ], 
  
                    manager_radialseries:
                     [
                      {
                        name: 'JAYMEELEE BROWN',
                        data: JBunits
                        },
                         {
                          name: 'TUPOU PEAUA',
                          data: TPunits
                          },
                           {
                            name: 'PETER TURNER',
                            data: PTunits
                            },
                            {
                              name: 'FRANS DEKKER',
                              data: FDunits
                            }
                     ],
                     shift_radialseries: [
                       {
                        name: 'DS00',
                        data: DS00units
                        },
                        {
                          name: 'DTOO',
                          data: DT00units
                        },
                        {
                            name: 'DS07',
                            data: DS07units
                          },
                            {
                              name: 'DO00',
                              data: DO00units
                            },
                              {
                                name: 'AO00',
                                data: AO00units
                                },
                                 {
                                  name: 'AS00',
                                  data: AS00units
                                  },
                                   {
                                    name: 'AT00',
                                    data: AT00units
                                    }
                                ], 
                })
  
                this.setState({
                  syncloader: false
                })
  
  
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) { 
                        
                    }
                    else {
                    }
                }
            )

               // Reps Per User
         
               api.post('/Dashboard/DashboardProductivity/GetRep_PerUser',body).then(
                res => 
                
                {
                          
                  let resdata = res.data;
                     
                     
                      var Totallines= [];
                      var names = [];
                      
      
                        var temp = resdata.Names;
                        names = temp.map(x=>x);
      
                        temp = resdata.lines;
                        Totallines = temp.map(x=>x);
      
      
                         this.setState({
    
                          lineGraphSeries:[
                            { name: 'Total Rep',
                              data: Totallines
                             }
                          ],
                            lineGraphOptions:
                            {
                                xaxis:
                                {
                                    categories:names
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

                }

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
        value = {this.state.startDate}
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
        value = {this.state.endDate}
        onChange={(e) => {this.handleEndDateChange(e)}}
        InputLabelProps={{
          shrink: true,
        }}
      />
  <Button
        variant="contained"
        color="primary"
        size="small"
        style ={{  fontFamily: "Montserrat", marginLeft : '90px', marginTop:'6px',color:'white',backgroundColor:'rgb(35,168,224)' }}
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
   
   <Chart options={this.state.Role_options} series={this.state.role_series} type="bar" height={390} width={850} />
   </div>
   
        </Typography>
      </CardContent>
  <CardActions disableSpacing></CardActions>
      </Card>
</Paper>
        </Grid>
        </td>
        <td >

      
        <Grid  style ={{ marginLeft: '2vw'}}item xs={30}>
          <Paper>
          <Card style={{
      alignContent:'center',
      height:'450px',
      width:'120%',
    
      backgroundColor:'white'}}>
              <CardContent>
                <Typography>
                <div >
                <Chart options={this.state.Role_radialoptions } series={ this.state.role_radialseries }type="area" height={400} />
               
                 </div>
                </Typography>
              </CardContent>

   </Card>
            
          </Paper>
        </Grid>
        </td>
  </tr>
  
</table>

{/* By Shift */}

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
   
   <Chart options={this.state.shift_options} series={this.state.shift_series} type="bar" height={390} width={850} />
   </div>
   
        </Typography>
      </CardContent>
  <CardActions disableSpacing></CardActions>
      </Card>
</Paper>
        </Grid>
        </td>
        <td >

      
        <Grid  style ={{ marginLeft: '2vw'}}item xs={30}>
          <Paper>
          <Card style={{
      alignContent:'center',
      height:'450px',
      width:'120%',
    
      backgroundColor:'white'}}>
              <CardContent>
                <Typography>
                <div >
               
                <Chart options={this.state.shift_radialoptions } series={ this.state.shift_radialseries }type="area" height={400} />
               
                 </div>
                </Typography>
              </CardContent>

   </Card>
            
          </Paper>
        </Grid>
        </td>
  </tr>
  
</table>



{/* By Manager */}


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
   
   <Chart options={this.state.manager_options} series={this.state.manager_series} type="bar" height={390} width={850} />
   </div>
   
        </Typography>
      </CardContent>
  <CardActions disableSpacing></CardActions>
      </Card>
</Paper>
        </Grid>
        </td>
        <td >

      
        <Grid  style ={{ marginLeft: '2vw'}}item xs={30}>
          <Paper>
          <Card style={{
      alignContent:'center',
      height:'450px',
      width:'120%',
    
      backgroundColor:'white'}}>
              <CardContent>
                <Typography>
                <div >
                <Chart options={this.state.manager_radialoptions } series={ this.state.manager_radialseries }type="area" height={400} />
               
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

    export default ApexChart;