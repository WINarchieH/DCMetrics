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

            hideloader :false,

            FromDate: props.startDate,
            ToDate: props.endDate,

            series: [{
                name: "Day",
                type:'column',
                data: []
                },
                { name: "Day TR",
                type:'column',
                data: []
                },
                {
                name: "Afternoon",
                type:'column',
                data: []
                },

                { name: "Afternoon TR",
                type:'column',
                data: []
                }
                ,
                { name: "Total",
                type:'line',
                data: []
                }

               
            ],
            options: {
               
                chart: {

                    stacked: true,
                    toolbar: {
                      show: true
                    },
                    zoom: {
                      enabled: true
                    }, 
          
                  },
                  dataLabels: {
                 
                   
                    offsetX: 0,
                    offsetY: 0,
                    enabled:true,
                    style:  {
                        fontSize:'11px'


                    }
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
                      text: 'Week',
                    
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
                    text:"Cases Count",
                    align:"center",
                  
                  style: {
                   
                     fontFamily: "Montserrat",
                     color:'rgb(35,168,224)'
          
                  }
                
                
               
              },
            }
           


        };
    }

    async componentDidMount() {

        let body = new URLSearchParams({

            'StartDate':formatDate(this.state.FromDate),
             'EndDate':formatDate(this.state.ToDate)
            })

      
         api.post('/Dashboard/CCAPickDashboard/GetCCA_PickCases_All_Weekly', body).then( // Reasons Codes List 
          res => {
      

    

            let resdata = res.data;
      
          var totalcases = [];
          
            var temp =   resdata.weeks;
            var weeks = temp.map(x=>x);



                temp =   resdata.pickcases_Afternoon_Exp;
                var pickcases_Exp_Afternoon = temp.map(x=>x);
  
                
               temp =   resdata.pickcases_Day_Trainee;
               var pickcases_trainee_Day = temp.map(x=>x);

               temp =   resdata.pickcases_Afternoon_Trainee;
               var pickcases_trainee_Afternoon = temp.map(x=>x);
 
               
              temp =   resdata.pickcases_Day_Exp;
              var  pickcases_Exp_Day = temp.map(x=>x);


              
        for (var i =0;i <weeks.length ; i++)
        {

           totalcases.push(parseInt(pickcases_Exp_Day[i]) + parseInt(pickcases_trainee_Day[i]) +
           parseInt(pickcases_Exp_Afternoon[i])+ parseInt(pickcases_trainee_Afternoon[i]) )

        } 

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
                     data: pickcases_Exp_Day
                     },
                     { name: "Day TR",
                     data: pickcases_trainee_Day
                     },
                     {
                     name: "Afternoon",
                     data: pickcases_Exp_Afternoon
                     },

                     { name: "Afternoon TR",
                     data: pickcases_trainee_Afternoon
                     },
                     {name :'Total',
                     data:totalcases
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
    
          
           
         api.post('/Dashboard/CCAPickDashboard/GetCCA_PickCases_All_Weekly', body).then( // Reasons Codes List 
         res => {
     

   

           let resdata = res.data;
     
         var totalcases = [];
         
           var temp =   resdata.weeks;
           var weeks = temp.map(x=>x);



               temp =   resdata.pickcases_Afternoon_Exp;
               var pickcases_Exp_Afternoon = temp.map(x=>x);
 
               
              temp =   resdata.pickcases_Day_Trainee;
              var pickcases_trainee_Day = temp.map(x=>x);

              temp =   resdata.pickcases_Afternoon_Trainee;
              var pickcases_trainee_Afternoon = temp.map(x=>x);

              
             temp =   resdata.pickcases_Day_Exp;
             var  pickcases_Exp_Day = temp.map(x=>x);


             
       for (var i =0;i <weeks.length ; i++)
       {

          totalcases.push(parseInt(pickcases_Exp_Day[i]) + parseInt(pickcases_trainee_Day[i]) +
          parseInt(pickcases_Exp_Afternoon[i])+ parseInt(pickcases_trainee_Afternoon[i]) )

       } 

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
                     data: pickcases_Exp_Day
                     },
                     { name: "Day TR",
                     data: pickcases_trainee_Day
                     },
                     {
                     name: "Afternoon",
                     data: pickcases_Exp_Afternoon
                     },

                     { name: "Afternoon TR",
                     data: pickcases_trainee_Afternoon
                     },
                     {name :'Total',
                     data:totalcases
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