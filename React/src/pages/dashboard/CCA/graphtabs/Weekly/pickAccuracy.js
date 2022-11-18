import React, { Component, useState, useEffect } from 'react';
import api from '../../../../../components/api/api';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../../../components/fields/dateHelpers';

import Chart from 'react-apexcharts'
import {LinearProgress
} from '@material-ui/core';

class PickProd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            hideloader:false,

            FromDate: props.startDate,
            ToDate: props.endDate,

            series: [{
                name: "Afternoon",
                data: []
                },
                { name: "Day",
                data: []
                },
                {
                    name:"Target 280 c/h",
                    data:[]
                }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                      enabled: false
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    enabledOnSeries: [0,1,2,3],
                  },
                 
                  stroke: {
                    curve: 'straight'
                  },
                  title: {
                    text: 'Pick Accuracy (%)',
                    style:{fontFamily:"Montserrat",    color:'rgb(35,168,224)'},
                    align: 'left'
                  },
                  grid: {
                    row: {
                      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                      opacity: 0.5
                    },
                  },
                  yaxis:{
                    labels: {
                        show: false
                    }
                 },
                xaxis: {
                    categories: [],
                    title: {
                        text: 'Week',
                      
                      style: { fontSize: '10px',
                       fontFamily: "Montserrat",
                       color:'rgb(35,168,224)'
                      
                      }
                      }

                   
                }
            },


        };
    }

    async componentDidMount() {

        let body = new URLSearchParams({

            'StartDate':formatDate(this.state.FromDate),
             'EndDate':formatDate(this.state.ToDate)
            })

      
         api.post('/Dashboard/CCAPickDashboard/GetCCA_PickAccuracy_All_Weekly', body).then( // Reasons Codes List 
          res => {
      

            var target  = [];

            let resdata = res.data;
      
               var temp =   resdata.weeks;
                   var weeks = temp.map(x=>x);
          
                   for (var i =0 ; i < weeks.length ; i++)
                   {
                       target.push(99.7);

                   }
          
       
      
              temp =   resdata.pickAccuracy_Day_Exp;
              var pickAccuracy_Day_Exp = temp.map(x=>x);

              temp =   resdata.pickAccuracy_Day_Trainee;
              var pickAccuracy_Day_Trainee = temp.map(x=>x);


              temp =   resdata.pickAccuracy_Afternoon_Exp;
              var pickAccuracy_afternoon_Exp = temp.map(x=>x);


              temp =   resdata.pickAccuracy_Afternoon_Trainee;
              var pickAccuracy_afternoon_Trainee = temp.map(x=>x);

              var label = [];
                        for (var i =0 ; i < weeks.length ; i++)
                        {
                            label.push(weeks[i].toString());
      
                        }

                this.setState({
                    options:
                    {
                        chart: {
                            id: "Pick Rates"
                        },
                        xaxis:
                        {
                            categories: label
                        }

                    },
                    options:
                    {
                        labels: label
                    },
                    series: [{
                        name: "Day",
                        data: pickAccuracy_Day_Exp
                        },
                        {
                            name: "Day TR",
                            data: pickAccuracy_Day_Trainee
                        },
                        { 
                            name: "Afternoon",
                            data: pickAccuracy_afternoon_Exp
                        },
                        {
                            name:"Afternoon TR",
                            data:pickAccuracy_afternoon_Trainee
                        
                        },
                        {
                            name:"Target",
                            data:target
                        
                        }
                    ],
                    hideloader:true

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


    componentDidUpdate(prevProps) {

      

        if (prevProps.loadGraphs != this.props.loadGraphs) {

            let body = new URLSearchParams({

                'StartDate':formatDate(this.props.startDate),
                'EndDate':formatDate(this.props.endDate)
                })

                this.setState({
                    hideloader:false
        
                });


                api.post('/Dashboard/CCAPickDashboard/GetCCA_PickAccuracy_All_Weekly', body).then( // Reasons Codes List 
                res => {
            
      
                  var target  = [];
      
                  let resdata = res.data;
            
                     var temp =   resdata.weeks;
                         var weeks = temp.map(x=>x);
                
                         for (var i =0 ; i < weeks.length ; i++)
                         {
                             target.push(99.7);
      
                         }
                
             
            
                    temp =   resdata.pickAccuracy_Day_Exp;
                    var pickAccuracy_Day_Exp = temp.map(x=>x);
      
                    temp =   resdata.pickAccuracy_Day_Trainee;
                    var pickAccuracy_Day_Trainee = temp.map(x=>x);
      
      
                    temp =   resdata.pickAccuracy_Afternoon_Exp;
                    var pickAccuracy_afternoon_Exp = temp.map(x=>x);
      
      
                    temp =   resdata.pickAccuracy_Afternoon_Trainee;
                    var pickAccuracy_afternoon_Trainee = temp.map(x=>x);
      
                    var label = [];
                              for (var i =0 ; i < weeks.length ; i++)
                              {
                                  label.push(weeks[i].toString());
            
                              }
      
                      this.setState({
                          options:
                          {
                              chart: {
                                  id: "Pick Rates"
                              },
                              xaxis:
                              {
                                  categories: label
                              }
      
                          },
                          options:
                          {
                              labels: label
                          },
                          series: [{
                              name: "Day",
                              data: pickAccuracy_Day_Exp
                              },
                              {
                                  name: "Day TR",
                                  data: pickAccuracy_Day_Trainee
                              },
                              { 
                                  name: "Afternoon",
                                  data: pickAccuracy_afternoon_Exp
                              },
                              {
                                  name:"Afternoon TR",
                                  data:pickAccuracy_afternoon_Trainee
                              
                              },
                              {
                                  name:"Target",
                                  data:target
                              
                              }
                          ],
                          hideloader:true
      
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

    }

    render() {
        return (
            <div id="chart">
                <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
                
          
           <div hidden={this.state.hideloader}> <LinearProgress color="secondary" ></LinearProgress>
           </div>
           </div>
          
        );
    }
}

export default PickProd;