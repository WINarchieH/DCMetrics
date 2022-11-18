import React, { Component, useState, useEffect } from 'react';
import api from '../../../../components/api/api';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../../components/fields/dateHelpers';
import {colors, LinearProgress
} from '@material-ui/core';
import Chart from 'react-apexcharts'
import { fontStyle } from '@mui/system';

class PickProd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            hideloader :false,

            FromDate: props.startDate,
            ToDate: props.endDate,

            series: [],
            options: {
              chart: {
                type: 'bar',
                height: 350
               },
                 plotOptions: {
                   bar: {
                  horizontal: false,
                  columnWidth: '90%',
                
                  },
                 },
                  dataLabels: {
                   enabled: true,


                    },
                   stroke: {
                     show: true,
                     width: 2,
                     colors: ['transparent']
                    },
                      xaxis: {
                        categories: [],
                        title:
                        {
                          text:'Date',
                        
                        style: { fontSize: '10px',
                        fontFamily: "Montserrat",
                        color:'rgb(35,168,224)'
               
                       }
                       }
                       },
                       title:
                       {
                         text:'Pick Rate By Pickers Trainee - Day Shift',
                         style:
                         {
                            fontSize: '12px',
                          fontFamily: "Montserrat",
                          color:'rgb(35,168,224)'
                 
                         }
                       },
                    yaxis: {
                     
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

      
         api.post('/Dashboard/CCAPickDashboard/GetCCA_PickRates_User_DayShift_Trainee', body).then( // Reasons Codes List 
          res => {
      

            var target  = [];

            let resdata = res.data;
      
               var temp =   resdata.Labels;
                   var labels = temp.map(x=>x);
          
          
       
                   temp =   resdata.Dataset;
                   var Dataset = temp.map(x=>x);
     
                

                    var COLORS = [];
                    while (COLORS.length < Dataset.length) {
                        COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
                    }
                    
                    // random number generator
                    function rand(frm, to) {
                        return ~~(Math.random() * (to - frm)) + frm;
                    };

                  


                this.setState({
                  
                  
                  series:Dataset,
                  options:{
                    xaxis:
                    {
                      categories:labels
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

                this.setState({
                    hideloader:false
                })
    
          
                api.post('/Dashboard/CCAPickDashboard/GetCCA_PickRates_User_DayShift_Trainee', body).then( // Reasons Codes List 
                res => {
            
      
                  var target  = [];
      
                  let resdata = res.data;
            
                     var temp =   resdata.Labels;
                         var labels = temp.map(x=>x);
                
                
             
                         temp =   resdata.Dataset;
                         var Dataset = temp.map(x=>x);
           
                         console.log(Dataset);
                        
      
                          var COLORS = [];
                          while (COLORS.length < Dataset.length) {
                              COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
                          }
                          
                          // random number generator
                          function rand(frm, to) {
                              return ~~(Math.random() * (to - frm)) + frm;
                          };
      
                        
      
      
                      this.setState({
                        
                        
                        series:Dataset,
                        options:{
                          xaxis:
                          {
                            categories:labels
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

export default PickProd;