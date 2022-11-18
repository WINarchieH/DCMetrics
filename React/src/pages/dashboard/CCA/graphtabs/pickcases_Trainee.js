import React, { Component, useState, useEffect } from 'react';
import api from '../../../../components/api/api';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../../components/fields/dateHelpers';
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
                    enabled: true
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
                    title :{text: 'Date',
                    style:{fontFamily:"Montserrat",    color:'rgb(35,168,224)'}
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

      
         api.post('/Dashboard/CCAPickDashboard/GetCCA_PickCases_Trainee', body).then( // Reasons Codes List 
          res => {
      

            var target  = [];

            let resdata = res.data;
      
               var temp =   resdata.dates_Shift;
                   var dates = temp.map(x=>x);
          
                   temp =   resdata.pickcases_Afternoon_Trainee;
                   var pickrates_Exp_Afternoon = temp.map(x=>x);
     
                   
                  temp =   resdata.pickcases_Day_Trainee;
                  var pickrates_Exp_Day = temp.map(x=>x);

                   
                  temp =   resdata.pickcases_DC_daily_Trainee;
                  var DC = temp.map(x=>x);

                this.setState({
                    options:
                    {
                        chart: {
                            id: "Pick Rates"
                        },
                        xaxis:
                        {
                            categories: dates
                        }

                    },
                    options:
                    {
                        labels: dates
                    },
                    series: [{
                        name: "Afternoon",
                        data: pickrates_Exp_Afternoon
                        },
                        { name: "Day",
                        data: pickrates_Exp_Day
                        },
                        {
                            name:'DC',
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
                })
          
             api.post('/Dashboard/CCAPickDashboard/GetCCA_PickCases_Trainee', body).then( // Reasons Codes List 
              res => {
          
    
                let resdata = res.data;
          
                   var temp =   resdata.dates_Shift;
                       var dates = temp.map(x=>x);
              
                   
              
           
                       temp =   resdata.pickcases_Afternoon_Trainee;
                       var pickrates_Exp_Afternoon = temp.map(x=>x);
         
                       
                      temp =   resdata.pickcases_Day_Trainee;
                      var pickrates_Exp_Day = temp.map(x=>x);

                         
                  temp =   resdata.pickcases_DC_daily_Trainee;
                  var DC = temp.map(x=>x);
    
                    this.setState({
                        options:
                        {
                            chart: {
                                id: "Pick Rates"
                            },
                            xaxis:
                            {
                                categories: dates
                            }
    
                        },
                        options:
                        {
                            labels: dates
                        },
                        series: [{
                            name: "Afternoon",
                            data: pickrates_Exp_Afternoon
                            },
                            { name: "Day",
                            data: pickrates_Exp_Day
                            },
                            {
                                name:'DC',
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
                <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
                <div hidden={this.state.hideloader}> <LinearProgress color="secondary" ></LinearProgress>
           </div>
            </div>
        );
    }
}

export default PickProd;