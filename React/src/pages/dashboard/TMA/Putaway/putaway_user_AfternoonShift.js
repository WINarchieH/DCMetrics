import React, { Component, useState, useEffect } from 'react';
import api from '../../../../components/api/api';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../../components/fields/dateHelpers';
import {colors, LinearProgress
} from '@material-ui/core';
import Chart from 'react-apexcharts';
import  PickRate from './putaway_user_DayShift';
import { fontStyle } from '@mui/system';

class PutawayProd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            hideloader :false,

            FromDate: props.startDate,
            ToDate: props.endDate,

            series: [],
            options: {
              
              chart: 
              {
                type: 'bar',
                height: 350
               },
                 plotOptions:
                 {
                  bar: {
                  horizontal: false,
                  columnWidth: '90%',
                 

                  },
                 },
                   dataLabels: {
                   enabled: true,
                   style: { fontSize: '9px',
                        fontFamily: "Montserrat",
                        colors:['black']
                       }
                    },
                    colors:['#008FFB','#FF0000'],
                   stroke: {
                     show: true,
                     width: 3,
                     colors: ['transparent']
                    },
                      xaxis: {
                        categories: [],
                        title:
                        {
                         
                        style: { fontSize: '10px',
                        fontFamily: "Montserrat",
                        color:'rgb(35,168,224)'
               
                       }
                       }
                       },
                       title:
                       {
                         text:'Total Putaways Per User - Afternoon Shift',
                         style:
                         {
                            fontSize: '12px',
                          fontFamily: "Montserrat",
                          color:'rgb(35,168,224)'
                 
                         }
                       },
                    yaxis: {
                      title:
                       {
                         text:'Putaways',
                         style:
                         {
                            fontSize: '12px',
                          fontFamily: "Montserrat",
                          color:'rgb(35,168,224)'
                 
                         }
                       }
                     
                       },
              fill: {
                opacity: 1
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return  val 
                  }
                }
              }
            }
          
        
        

        };
    }

    async componentDidMount() {

        let body = new URLSearchParams({

            'StartDate':formatDate(this.state.FromDate),
             'EndDate':formatDate(this.state.ToDate)
            })

      
         api.post('/Dashboard/TMADashboard/GetPutaways_PerUser_AfternoonShift', body).then( // Reasons Codes List 
          res => {
      

            var target  = [];

            let resdata = res.data;

          
      
               var temp =   resdata.AfternoonShift_users;

                    var AfternoonShift_users = temp.map(x=>x);
                
                    temp =   resdata.AfternoonShift_lines;
                    var AfternoonShift_lines = temp.map(x=>x);

                    
                    temp =   resdata.AfternoonShift_KPI;
                    var KPI = temp.map(x=>x);

                      // var COLORS = [];
                      // while (COLORS.length < DayShift_lines.length) {
                      //     COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
                      // }
                      
                      // // random number generator
                      // function rand(frm, to) {
                      //     return ~~(Math.random() * (to - frm)) + frm;
                      // };
                  


                this.setState({
                  
                  
                  series:[ 
                  {
                    name: 'Total Putaways',
                    data:  AfternoonShift_lines
                  },
                  {
                    name: 'KPI',
                    data:  KPI
                  }
                ],
                  options:{
                    
                    xaxis:
                    {
                      categories:AfternoonShift_users
                    },
                  
                  },

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

      
         api.post('/Dashboard/TMADashboard/GetPutaways_PerUser_AfternoonShift', body).then( // Reasons Codes List 
          res => {
      

            var target  = [];

            let resdata = res.data;

          
      
               var temp =   resdata.AfternoonShift_users;

                    var AfternoonShift_users = temp.map(x=>x);
                
                    temp =   resdata.AfternoonShift_lines;
                    var AfternoonShift_lines = temp.map(x=>x);

                    
                    temp =   resdata.AfternoonShift_KPI;
                    var KPI = temp.map(x=>x);

                      // var COLORS = [];
                      // while (COLORS.length < DayShift_lines.length) {
                      //     COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
                      // }
                      
                      // // random number generator
                      // function rand(frm, to) {
                      //     return ~~(Math.random() * (to - frm)) + frm;
                      // };
                  


                this.setState({
                  
                  
                  series:[ 
                  {
                    name: 'Total Putaways',
                    data:  AfternoonShift_lines
                  },
                  {
                    name: 'KPI',
                    data:  KPI
                  }
                ],
                  options:{
                    
                    xaxis:
                    {
                      categories:AfternoonShift_users
                    },
                  
                  },

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

export default PutawayProd;