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
//Grid
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { UNIT_SEP } from 'papaparse';

// react Spinners
import {ClipLoader,SyncLoader} from "react-spinners";

const useStyles = makeStyles((theme) => ({
    root: {
    width:'220%',
  
    fontFamily:  'Montserrat',
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
const lastDay = curr.getDate() - curr.getDay() +2 ; // First day is the day of the month - the day of the week
const firstDay = lastDay - 6; // last day is the first day + 6

const last = new Date(curr.setDate(lastDay)).toDateString();
const first = new Date(curr.setDate(firstDay)).toDateString();

class ApexChart extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {

        //rep  and move div hiding in case of empty dataset
        hiderepgraph: false,
        hidemovegraph:false,
        hideCCgraph:false,
        syncloader : true,
        startDate:TestdateObjToInput(dateToDateObj(first)),
        endDate:TestdateObjToInput(dateToDateObj(last)),
       radialMoveSeries:[{
        name: 'Total Move',
        data: []
       }],
       radialMoveoptions: {
        yaxis: {
               
          title: {
            text: 'UNITS',
          
          style:{ fontSize:  '10px',
          fontFamily:  'Montserrat',
          color:  'rgb(35,168,224)'}
        }
       },
       title:
       {
        text: 'TOTAL MOVE UNITS PER DAY',
          
          style:{ fontSize:  '12px',
          fontFamily:  'Montserrat',
          color:  'rgb(35,168,224)'}
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
         colors:['red']
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
       radialReplenishmentSeries:[{
        name: 'Total Replenishment',
        data: []
      }],

      radialRepoptions: {
        yaxis: {
               
          title: {
            text: 'UNITS',
          
          style:{ fontSize:  '10px',
          fontFamily:  'Montserrat',
          color:  'rgb(35,168,224)'}
        }
       },
       title:
       {
        text: 'TOTAL REPLENISHMENT UNITS PER DAY',
          
          style:{ fontSize:  '12px',
          fontFamily:  'Montserrat',
          color:  'rgb(35,168,224)'}
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
         colors:['#FF9800']
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
        radialPutawayseries: [{
          name: 'Total Putaway',
          data: []
        }], 
        radialPutawayoptions: {
          yaxis: {
                 
            title: {
              text: 'UNITS',
            
            style:{ fontSize:  '10px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'}
          }
         },
         title:
         {
          text: 'TOTAL PUTAWAY UNITS PER DAY',
            
            style:{ fontSize:  '12px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'}
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
           colors:['green']
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
        radialseries: [{
          name: 'Total Pick',
          data: []
        }], 
      
        radialoptions: {
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
              text: 'UNITS',
            
            style:{ fontSize:  '10px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'}
          }
        },
          title:
          {
            text:"TOTAL PICKED UNITS PER DAY",
            align:"left",
          style: {
            fontSize:  '12px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'
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

        radialCycleCountSeries:[{
          name: 'Total Cycle Counts',
          data: []
        }],
  
        radialCCoptions: {
          yaxis: {
                 
            title: {
              text: 'UNITS',
            
            style:{ fontSize:  '10px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'}
          }
         },
         title:
         {
          text: 'TOTAL CYCLE COUNTS UNITS',
            
            style:{ fontSize:  '12px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'}
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

        MoveProductivityseries: [{
          name: 'Move Per Hour',
          data: []
        }],
        MoveProductivityoptions:{
           title:{
            text:"MOVE PER HOUR",
            align:"center",
           style: {
            fontSize:  '12Spx',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'
           }
          },
           chart: {
            id:"Pick-Chart",
            
            stacked: false,
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
          },
          legend: {
            position: 'right',
            offsetY: 40
          },
          fill: {
            opacity: 1,
            colors:['#FF0000']
          },
          title:{
            text:"MOVE PER HOUR",
            align:"center",
          
          style: {
            fontSize:  '12px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'
          }
         },
          yaxis: {
                 
          title: {
            text: 'UNITS',
          
          style: { fontSize: '10px',
          fontFamily: 'arial',
          color: 'rgb(35,168,224)'}
          }
        },
       },

       CycleCountsPerHrSeries: [{
        name: 'Cycle Counts Per Hour',
        data: []
      }],
      CycleCountsPerHrOptions:
      {
        yaxis: {
               
          title: {
            text: 'UNITS',
          
          style:{ fontSize:  '10px',
          fontFamily:  'Montserrat',
          color:  'rgb(35,168,224)'}
        }
       },
        title:{
          text:"CYCLE COUNTS PER HOUR",
          align:"center",
        style: {
          fontSize:  '12px',
          fontFamily:  'Montserrat',
          color:  'rgb(35,168,224)'
        }
        },
        chart: {
        id:"CycleCountsPerHour-Chart",
        
        stacked: false,
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
         },
        legend: {
        position: 'right',
        offsetY: 40
        },
        fill: {

        colors:['#FEB019']
        }
      },
      
        RepProductivityseries: [{
          name: 'Replenishment Per Hour',
          data: []
        }],

        PutawayPerHrseries: [{
          name: 'Putaway Per Hour',
          data: []
        }],
        PutawayPerHrOptions:
        {
          yaxis: {
                 
            title: {
              text: 'UNITS',
            
            style:{ fontSize:  '10px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'}
          }
         },
          title:{
            text:"PUT AWAY PER HOUR",
            align:"center",
          style: {
            fontSize:  '12px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'
          }
          },
          chart: {
          id:"PUtawayPerHour-Chart",
          
          stacked: false,
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
           },
          legend: {
          position: 'right',
          offsetY: 40
          },
          fill: {

          colors:['#008000']
          }
        },

        RepPerHrOptions:
        {
          yaxis: {
                 
            title: {
              text: 'UNITS',
            
            style:{ fontSize:  '10px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'}
          }
         },
          title:{
            text:"REPLENISHMENT PER HOUR",
            align:"center",
          style: {
            fontSize:  '12px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'
          }
          },
          chart: {
          id:"RepPerHour-Chart",
          
          stacked: false,
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
           },
          legend: {
          position: 'right',
          offsetY: 40
          },
          fill: {
          opacity: 1,
          colors:['#FF9800']
          }
        },
        series: [{
          name: 'Unit Per Hour',
          data: []
        }],
        options:{
          title:{
            text:"UNITS PER HOUR",
            align:"center",
          style: {
            fontSize:  '12Spx',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'
          }
         },
          chart: {
            id:"Pick-Chart",
            
            stacked: false,
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
          },
          legend: {
            position: 'right',
            offsetY: 40
          },
          fill: {
            opacity: 1
          },
          title:{
            text:"UNITS PER HOUR",
            align:"center",
          
          style: {
            fontSize:  '12px',
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'
          }
        },
         yaxis: {
                 
          title: {
            text: 'UNITS',
          
          style: { fontSize: '10px',
          fontFamily: 'arial',
          color: 'rgb(35,168,224)'}
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

        api.post('/Dashboard/DashboardProductivity/Dash_PickandPut_Productivity',body).then(
         res => 
         {

           let resdata = res.data;
           var dates =[];
           var units=[];
           var unitsPerHour =[];
           var putawayUnitsPerHr=[];
           var PutawayUnits=[];
           var  PutawayUnitDates = [];
          //Pick Units
              var temp =    resdata.Dates;
              dates =       temp.map(x=>x);
               temp =    resdata.Units;
              units =       temp.map(x => x);
               temp =    resdata.UnitsPerHr;
              unitsPerHour = temp.map(x => x);
              //PutawayUnits
              temp =    resdata.PutawayPerHr;
              putawayUnitsPerHr = temp.map(x => x);

               temp =    resdata.PutawayUnits;
              PutawayUnits = temp.map(x => x);

               
              temp =    resdata.PutawayUnitdates;
              PutawayUnitDates = temp.map(x => x);


             this.setState({
              syncloader : false,
                 options:
                 {
                     chart: {
                         id:"Pick-Chart"
                     },
                         xaxis :
                         {
                             categories: dates
                         }

                 },
                 PutawayPerHrOptions:{
                   xaxis:
                   {
                     categories: PutawayUnitDates
                   }
                 },
                 series: [{
                     name: 'Unit Per Hour',
                     data: unitsPerHour
                   }],
                   PutawayPerHrseries:
                     [{
                       name: 'Putaway Per Hour',
                       data: putawayUnitsPerHr
                     }],
                   radialoptions :
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
                   radialPutawayoptions:
                   {
                     xaxis:
                     {
                       categories: PutawayUnitDates
                     }
                   },
                   radialseries :
                   [{
                     name: 'Total Units',
                     data: units
                   }],
                   radialPutawayseries: [{
                     name: 'Total Putaway',
                     data: PutawayUnits
                   }]
                
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


         // Productivity move

         api.post('/Dashboard/DashboardProductivity/Dash_MoveProductivity',body).then(
           res => 
           {

             let resdata = res.data;
             var dates =[];
             var moveunits=[];
             var movePerHour =[];
             
          //Move Units
                var temp =    resdata.Dates;
                dates =       temp.map(x=>x);

                 temp =    resdata.Units;
                 moveunits =       temp.map(x => x);

                 temp =    resdata.MovePerHr;
                 movePerHour = temp.map(x => x);

                  // Hiding the move graph table if the dates array is none
                  if (dates.length === 0)
                  {
                    this.setState({
                     hidemovegraph: true
                     });
                   }

               this.setState({
                   radialMoveoptions:
                   {
                       
                           xaxis :
                           {
                               categories: dates
                           }

                   },
                 
                   MoveProductivityseries: [{
                       name: 'MOVE Per Hour',
                       data: movePerHour
                     }],
                    
                     radialMoveSeries:[{
                       name: 'Total Move',
                       data: moveunits
                      }],
                      MoveProductivityoptions :
                      {
                        xaxis :{
                          categories : dates
                        }

                      },


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

           // Productivity Rep Method

           api.post('/Dashboard/DashboardProductivity/Dash_RepProductivity',body).then(
             res => 
             {
 
               let resdata = res.data;
               var dates =[];
               var repunits=[];
               var repPerHour =[];
             
          //rep Units
                var temp =    resdata.Dates;
                dates =       temp.map(x=>x);

                 temp =    resdata.Units;
                 repunits =       temp.map(x => x);

                 temp =    resdata.RepPerHr;
                 repPerHour = temp.map(x => x);


                 // Hiding the rep graph table if the dates array is none
                 if (dates.length === 0)
                 {
                   this.setState({
                    hiderepgraph: true
                    });
                  }

 
 
                 this.setState({

                   radialReplenishmentSeries:[{
                     name: 'Total Replenishment',
                     data: repunits
                   }],

                   RepProductivityseries: [{
                     name: 'Replenishment Per Hour',
                     data:repPerHour
                   }],
             
                   radialRepoptions:
                   {
                     xaxis :
                     {
                         categories: dates
                     }

                   },

                   RepPerHrOptions : 
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

             // Productivity Cycle Counts Method

           api.post('/Dashboard/DashboardProductivity/Dash_CCProductivity',body).then(
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

                  CycleCountsPerHrOptions : 
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
      }

   async componentDidMount()
    {
        let body = new URLSearchParams({

             'StartDate':this.state.startDate,
             'EndDate':this.state.endDate
          });
  
           api.post('/Dashboard/DashboardProductivity/Dash_PickandPut_Productivity',body).then(
            res => 
            {

              let resdata = res.data;
              var dates =[];
              var units=[];
              var unitsPerHour =[];
              var putawayUnitsPerHr=[];
              var PutawayUnits=[];
              var  PutawayUnitDates = [];
           //Pick Units
                 var temp =    resdata.Dates;
                 dates =       temp.map(x=>x);
                  temp =    resdata.Units;
                 units =       temp.map(x => x);
                  temp =    resdata.UnitsPerHr;
                 unitsPerHour = temp.map(x => x);
                 //PutawayUnits
                 temp =    resdata.PutawayPerHr;
                 putawayUnitsPerHr = temp.map(x => x);

                  temp =    resdata.PutawayUnits;
                 PutawayUnits = temp.map(x => x);

                  
                 temp =    resdata.PutawayUnitdates;
                 PutawayUnitDates = temp.map(x => x);


                this.setState({
                  syncloader : false,
                    options:
                    {
                        chart: {
                            id:"Pick-Chart"
                        },
                            xaxis :
                            {
                                categories: dates
                            }

                    },
                    PutawayPerHrOptions:{
                      xaxis:
                      {
                        categories: PutawayUnitDates
                      }
                    },
                    series: [{
                        name: 'Unit Per Hour',
                        data: unitsPerHour
                      }],
                      PutawayPerHrseries:
                        [{
                          name: 'Putaway Per Hour',
                          data: putawayUnitsPerHr
                        }],
                      radialoptions :
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
                      radialPutawayoptions:
                      {
                        xaxis:
                        {
                          categories: PutawayUnitDates
                        }
                      },
                      radialseries :
                      [{
                        name: 'Total Units',
                        data: units
                      }],
                      radialPutawayseries: [{
                        name: 'Total Putaway',
                        data: PutawayUnits
                      }]
                   
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


            // Productivity move

            api.post('/Dashboard/DashboardProductivity/Dash_MoveProductivity',body).then(
              res => 
              {
  
                let resdata = res.data;
                var dates =[];
                var moveunits=[];
                var movePerHour =[];
                
             //Move Units
                   var temp =    resdata.Dates;
                   dates =       temp.map(x=>x);

                    temp =    resdata.Units;
                    moveunits =       temp.map(x => x);

                    temp =    resdata.MovePerHr;
                    movePerHour = temp.map(x => x);

                     // Hiding the move graph table if the dates array is none
                     if (dates.length === 0)
                     {
                       this.setState({
                        hidemovegraph: true
                        });
                      }

  
                  this.setState({
                      radialMoveoptions:
                      {
                          
                              xaxis :
                              {
                                  categories: dates
                              }
  
                      },
                    
                      MoveProductivityseries: [{
                          name: 'MOVE Per Hour',
                          data: movePerHour
                        }],
                       
                        radialMoveSeries:[{
                          name: 'Total Move',
                          data: moveunits
                         }],
                         MoveProductivityoptions :
                         {
                           xaxis :{
                             categories : dates
                           }

                         },


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

              // Productivity Rep Method

              api.post('/Dashboard/DashboardProductivity/Dash_RepProductivity',body).then(
                res => 
                {
    
                  let resdata = res.data;
                  var dates =[];
                  var repunits=[];
                  var repPerHour =[];
                
             //Rep Units
                   var temp =    resdata.Dates;
                   dates =       temp.map(x=>x);

                    temp =    resdata.Units;
                    repunits =       temp.map(x => x);

                    temp =    resdata.RepPerHr;
                    repPerHour = temp.map(x => x);

    
                   
                        // Hiding the Rep graph table if the dates array is none
                        if (dates.length === 0)
                           {
                             this.setState({
                              hiderepgraph: true
                              });
                            }

    
                    this.setState({

                      radialReplenishmentSeries:[{
                        name: 'Total Replenishment',
                        data: repunits
                      }],

                      RepProductivityseries: [{
                        name: 'Replenishment Per Hour',
                        data:repPerHour
                      }],
                
                      radialRepoptions:
                      {
                        xaxis :
                        {
                            categories: dates
                        }

                      },

                      RepPerHrOptions : 
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

                // Productivity Cycle Counts Method

           api.post('/Dashboard/DashboardProductivity/Dash_CCProductivity',body).then(
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

                  CycleCountsPerHrOptions : 
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
        style ={{ fontFamily: 'Montserrat', marginLeft : '90px', marginTop:'6px',color:'white',backgroundColor:'rgb(35,168,224)' }}
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
                <Chart options={this.state.radialoptions } series={ this.state.radialseries }type="area" height={400} />
               
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
   
   <Chart options={this.state.PutawayPerHrOptions} series={this.state.PutawayPerHrseries} type="bar" height={390} width={850} />
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
                <Chart options={this.state.radialPutawayoptions } series={ this.state.radialPutawayseries }type="area" height={400} />
               
                 </div>
                </Typography>
              </CardContent>

   </Card>
            
          </Paper>
        </Grid>
        </td>
  </tr>
  
</table>
<table  hidden = {this.state.hidemovegraph}>
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
   
   <Chart options={this.state.MoveProductivityoptions} series={this.state.MoveProductivityseries} type="bar" height={390} width={850} />
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
                <Chart options={this.state.radialMoveoptions } series={ this.state.radialMoveSeries }type="area" height={400} />
               
                 </div>
                </Typography>
              </CardContent>

   </Card>
            
          </Paper>
        </Grid>
        </td>
  </tr>
  
</table>
<table  hidden = {this.state.hiderepgraph}>
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
   
   <Chart options={this.state.RepPerHrOptions} series={this.state.RepProductivityseries} type="bar" height={390} width={850} />
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
                <Chart options={this.state.radialRepoptions } series={ this.state.radialReplenishmentSeries }type="area" height={400} />
               
                 </div>
                </Typography>
              </CardContent>

   </Card>
            
          </Paper>
        </Grid>
        </td>
  </tr>
  
</table>

<table  hidden = {this.state.hideCCgraph}>
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
   
   <Chart options={this.state.CycleCountsPerHrOptions} series={this.state.CycleCountsPerHrSeries} type="bar" height={390} width={850} />
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
                <Chart options={this.state.radialCCoptions } series={ this.state.radialCycleCountSeries }type="area" height={400} />
               
                 </div>
                </Typography>
              </CardContent>

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