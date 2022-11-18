import React, { Component, useState, useEffect } from 'react';
import api from '../../../../../components/api/api';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../../../components/fields/dateHelpers';
import {LinearProgress
} from '@material-ui/core';
import Chart from 'react-apexcharts'

class PickProd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            hideloader:'true',
            FromDate: props.startDate,
            ToDate: props.endDate,

            series: [{
                name: "Afternoon",
                data: []
                },
                { name: "Day",
                data: []
                },
               
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
                    style:
                    {
                        fontSize:"9"
                    },
                    
                    offsetX: -3
                   
                },
                  colors:['#008FFB','#00E396','#FF0000'],
                  stroke: {
                    curve: 'straight'
                  },
                  title: {
                    text: 'Pick Cases Per Man - Trainee',
                    style:{fontFamily:"Montserrat",    color:'rgb(35,168,224)'},
                    align: 'left'
                  },
                  yaxis:{
                    labels: {
                        show: false
                    }
                 },
                  grid: {
                    row: {
                      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                      opacity: 0.5
                    },
                  },
                 
                xaxis: {
                    categories: [],
                    title: {
                        text: 'Week',
                        style:{fontFamily:"Montserrat",    color:'rgb(35,168,224)'},
                        
                      },
                   
                }
            },


        };
    }

    async componentDidMount() {

        let body = new URLSearchParams({

            'StartDate':formatDate(this.state.FromDate),
             'EndDate':formatDate(this.state.ToDate)
            })

      
         api.post('/Dashboard/CCAPickDashboard/GetCCA_PickCases_Trainee_Weekly', body).then( // Reasons Codes List 
          res => {
      

            var target  = [];

            let resdata = res.data;
      
               var temp =   resdata.weeks;
                   var weeks = temp.map(x=>x);
          
                   temp =   resdata.pickcases_Trainee_afternoon_Weekly;
                   var pickcases_Afternoon = temp.map(x=>x);
     
                   
                  temp =   resdata.pickcases_Trainee_Day_Weekly;
                  var pickcases_Day = temp.map(x=>x);

                  temp =   resdata.pickcases_DC_Weekly_Trainee;
                  var DC = temp.map(x=>x);

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
                        name: "Afternoon",
                        data: pickcases_Afternoon
                        },
                        { name: "Day",
                        data: pickcases_Day
                        },
                        {
                            name :'DC',
                            data: DC
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
                })
                api.post('/Dashboard/CCAPickDashboard/GetCCA_PickCases_Trainee_Weekly', body).then( // Reasons Codes List 
                res => {
            
      
                  var target  = [];
      
                  let resdata = res.data;
            
                     var temp =   resdata.weeks;
                         var weeks = temp.map(x=>x);
                
                         temp =   resdata.pickcases_Trainee_afternoon_Weekly;
                         var pickcases_Afternoon = temp.map(x=>x);
           
                         
                        temp =   resdata.pickcases_Trainee_Day_Weekly;
                        var pickcases_Day = temp.map(x=>x);
      
                        temp =   resdata.pickcases_DC_Weekly_Trainee;
                        var DC = temp.map(x=>x);
      
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
                              name: "Afternoon",
                              data: pickcases_Afternoon
                              },
                              { name: "Day",
                              data: pickcases_Day
                              },
                              {
                                  name :'DC',
                                  data: DC
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