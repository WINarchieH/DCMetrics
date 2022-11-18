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
               
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
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
                    text: 'Reworks - DC',
                    style:{fontFamily:"Montserrat",    color:'rgb(35,168,224)'},
                    align: 'left'
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

      
         api.post('/Dashboard/CCAPickDashboard/GetCCA_Reworks_Weekly', body).then( // Reasons Codes List 
          res => {
      

            let resdata = res.data;
     
                 var temp =   resdata.weeks;
                  var weeks = temp.map(x=>x);
         
       
                  temp =   resdata.Reworks_Day_Weekly;
                  var reworks_DayShift = temp.map(x=>x);
    
                  
                 temp =   resdata.Reworks_afternoon_Weekly;
                 var reworks_AfternoonShift  = temp.map(x=>x);

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
                       data: reworks_AfternoonShift
                       },
                       { name: "Day",
                       data: reworks_DayShift
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
    
          
            
         api.post('/Dashboard/CCAPickDashboard/GetCCA_Reworks_Weekly', body).then( // Reasons Codes List 
         res => {
     

           var target  = [];

           let resdata = res.data;
     
                 var temp =   resdata.weeks;
                  var weeks = temp.map(x=>x);
         
       
                  temp =   resdata.Reworks_Day_Weekly;
                  var reworks_DayShift = temp.map(x=>x);
    
                  
                 temp =   resdata.Reworks_afternoon_Weekly;
                 var reworks_AfternoonShift  = temp.map(x=>x);

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
                       data: reworks_AfternoonShift
                       },
                       { name: "Day",
                       data: reworks_DayShift
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
                <Chart options={this.state.options} series={this.state.series} type="bar" height={350} />
                <div hidden={this.state.hideloader}> <LinearProgress color="secondary" ></LinearProgress>
           </div>
            </div>
        );
    }
}

export default PickProd;