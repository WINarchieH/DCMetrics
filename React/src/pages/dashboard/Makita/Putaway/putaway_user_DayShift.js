import React, { Component, useState, useEffect } from 'react';
import api from '../../../../components/api/api';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../../components/fields/dateHelpers';
import {colors, LinearProgress
} from '@material-ui/core';
import Chart from 'react-apexcharts';
import { fontStyle } from '@mui/system';

const dropdownData = {
  'Role':['']
 
};

class PutawayProd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            hideloader :false,

            FromDate: props.startDate,
            ToDate: props.endDate,

            series: 
            [
              {
                name: 'Total Putaways',
                data:  []
              },
              {
                name: 'KPI',
                data:  []
              }
            ],
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
                   style:
                   {
                    fontSize: '9px',
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
                        
                       },
                       title:
                       {
                         text:'Total Putaways Per User - Day Shift',
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
                opacity: 1,
               
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


      var roles = '';
      if (this.props.role.length == 0)
      {
       
       api.get('/Maintenance/UserInfo/GetUserRole').then( // Roles List 
             res => {
                 let data = res.data;
                 dropdownData['Role'] = data.map(x => x['Role']);
                 roles = dropdownData['Role'].join(',').toString();
                
 
                let body = new URLSearchParams({
 
                 'StartDate':formatDate(this.state.FromDate),
                  'EndDate':formatDate(this.state.ToDate),
                  'Role': dropdownData['Role'].join(',').toString()
                 })
 
                api.post('/Dashboard/Makita/GetMakita_Putaways_Weekly_DayShift', body).then( // Reasons Codes List 
                res => {
            
      
                  var target  = [];
      
                  let resdata = res.data;
            
                     var temp =   resdata.DayShift_users;
                         var DayShift_users = temp.map(x=>x);
                
                
             
                         temp =   resdata.DayShift_lines;
                         var DayShift_lines = temp.map(x=>x);
      
                         
                         temp =   resdata.DayShift_KPI;
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
                          name: 'Total Lines',
                          data:  DayShift_lines
                        },
                        {
                          name: 'KPI',
                          data:  KPI
                        }
                      ],
                        options:{
                          xaxis:
                          {
                            categories:DayShift_users
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
 
             });

            }
       

    };


    componentDidUpdate(prevProps) {

      if (prevProps.loadGraphs != this.props.loadGraphs) {
          
        this.setState({
          hideloader:false
        })

        let body = new URLSearchParams({

          'StartDate':formatDate(this.props.startDate),
          'EndDate':formatDate(this.props.endDate),
          'Role': this.props.role.join(',').toString()
          })
      
         api.post('/Dashboard/Makita/GetMakita_Putaways_Weekly_DayShift', body).then( // Reasons Codes List 
          res => {
      

            var target  = [];

            let resdata = res.data;
  
               var temp =   resdata.DayShift_users;
                   var DayShift_users = temp.map(x=>x);
          
          
       
                   temp =   resdata.DayShift_lines;
                   var DayShift_lines = temp.map(x=>x);

                   
                   temp =   resdata.DayShift_KPI;
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
                    data:  DayShift_lines
                  },
                  {
                    name: 'KPI',
                    data:  KPI
                  }
                ],
                  options:{
                    xaxis:
                    {
                      categories:DayShift_users
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