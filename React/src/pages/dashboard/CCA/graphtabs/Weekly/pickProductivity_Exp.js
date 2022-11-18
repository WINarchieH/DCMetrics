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
                    enabledOnSeries: [0,1,3],
                  },
                 
                  stroke: {
                    curve: 'straight'
                  },
                  title: {
                    text: 'Pick Rates - Experienced',
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

      
         api.post('/Dashboard/CCAPickDashboard/GetCCA_PickRates_Exp_Weekly', body).then( // Reasons Codes List 
          res => {
      

            var target  = [];

            let resdata = res.data;
      
               var temp =   resdata.weeks;
                   var weeks = temp.map(x=>x);
                
          
                   for (var i =0 ; i < weeks.length ; i++)
                   {
                       target.push(280);

                   }
          
       
      
             temp =   resdata.pickrates_Afternoon_Exp;
              var pickrates_Exp_Afternoon = temp.map(x=>x);

              
             temp =   resdata.pickrates_Day_Exp;
             var pickrates_Exp_Day = temp.map(x=>x);

             temp =   resdata.pickrates_DC_Weekly_Exp;
             var DC = temp.map(x=>x);


          
                this.setState({
                    options:
                    {
                        chart: {
                            id: "Pick Rates"
                        },
                        xaxis:
                        {
                            categories: weeks
                        }

                    },
                    options:
                    {
                        labels: weeks
                    },
                    series: [{
                        name: "Afternoon",
                        data: pickrates_Exp_Afternoon
                        },
                        { name: "Day",
                        data: pickrates_Exp_Day
                        },
                        {
                            name:"Target 280 c/h",
                            data:target
                        
                        },
                        {
                            name:"DC",
                            data:DC
                        
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
    
          
                api.post('/Dashboard/CCAPickDashboard/GetCCA_PickRates_Exp_Weekly', body).then( // Reasons Codes List 
                res => {
            
      
                  var target  = [];
      
                  let resdata = res.data;
            
                     var temp =   resdata.weeks;
                         var weeks = temp.map(x=>x);
                
                         for (var i =0 ; i < weeks.length ; i++)
                         {
                             target.push(280);
      
                         }

                         var label = [];
                         for (var i =0 ; i < weeks.length ; i++)
                         {
                             label.push(weeks[i].toString());
      
                         }

                          
         


                   temp =   resdata.pickrates_Afternoon_Exp;
                    var pickrates_Exp_Afternoon = temp.map(x=>x);
      
                    
                   temp =   resdata.pickrates_Day_Exp;
                   var pickrates_Exp_Day = temp.map(x=>x);
      
                   temp =   resdata.pickrates_DC_Weekly_Exp;
                   var DC = temp.map(x=>x);
      
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
                              name: "Afternoon",
                              data: pickrates_Exp_Afternoon
                              },
                              { name: "Day",
                              data: pickrates_Exp_Day
                              },
                              {
                                  name:"Target 280 c/h",
                                  data:target
                              
                              },
                              {
                                  name:"DC",
                                  data:DC
                              
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
                <Chart options={this.state.options} series={this.state.series} type="line" height={350}  />
                
          
           <div hidden={this.state.hideloader}> <LinearProgress color="secondary" ></LinearProgress>
           </div>
           </div>
          
        );
    }
}

export default PickProd;