import React, { Component, useState, useEffect} from 'react';
import Screen from '../../../components/screen/screen';
import api from '../../../components/api/api';

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
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../components/fields/dateHelpers';
import { batch } from 'react-redux';
//Grid
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    root: {
    width:'220%',
  
    fontFamily:"Calibri",
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
      
        startDate:TestdateObjToInput(dateToDateObj(first)),
        endDate:TestdateObjToInput(dateToDateObj(last)),
        radialseries: [{
          name: 'Total Picks',
          data: []
        }, 
      ],
        radialoptions: {
          chart: {
            id :'AreaChart',
            height: 350,
            type: 'area'
          },
          dataLabels: {
            enabled: false
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
        series: [{
          name: 'Chute Pick',
          data: []
        }, {
          name: 'Batch Pick',
          data: []
        }, {
          name: 'Pick',
          data: []
        }],
        options: {
          title:{
            text:"Total Units",
            align:"center",
          
          style: {
            fontSize:  '14px',
            fontFamily:  'arial',
            color:  'Blue'
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
            text:"Total Picked Units",
            align:"center",
          
          style: {
            fontSize:  '14px',
            fontFamily:  'arial',
            color:  'Blue'
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
          
        let body = new URLSearchParams({

            'StartDate':this.state.startDate,
            'EndDate':this.state.endDate
         });
 
          api.post('/Maintenance/Login/Dash_PickedUnits',body).then(
           res => 
           {

               let resdata = res.data;
               
               const areaGraphValues =[];
               
               const dates =[];

               const BatchPick=[];
               const Pick =[];
               const ChutePick= [];
               for (var i = 1 ; i < resdata.length ; i++)
               {
    
               
                 dates.push(resdata[i][0]);
                 ChutePick.push( parseInt(resdata[i][1]));
                 BatchPick.push(parseInt(resdata[i][2]));
                 Pick.push( parseInt(resdata[i][3]));
                 var sum = parseInt(resdata[i][1]) + parseInt(resdata[i][2])+ parseInt(resdata[i][3]);
                 areaGraphValues.push(sum);
               }
              
            



               this.setState({
                 
               
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
                   series: [{
                       name: 'Chute Pick',
                       data: ChutePick
                     }, {
                       name: 'Batch Pick',
                       data: BatchPick
                     }, {
                       name: 'Pick',
                       data: Pick
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
                     radialseries :
                     [{
                       name: 'Total Picks',
                       data: areaGraphValues
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
      }

   async componentDidMount()
    {
        let body = new URLSearchParams({

             'StartDate':this.state.startDate,
             'EndDate':this.state.endDate
          });
  
          await api.post('/Maintenance/Login/Dash_PickedUnits',body).then(
            res => 
            {

                let resdata = res.data;
                const dates =[];
                const BatchPick=[];
                const Pick =[];
                const ChutePick= [];
              
               
               const areaGraphValues =[];
             
               for (var i = 1 ; i < resdata.length ; i++)
               {
    
               
                 dates.push(resdata[i][0]);
                 ChutePick.push( parseInt(resdata[i][1]));
                 BatchPick.push(parseInt(resdata[i][2]));
                 Pick.push( parseInt(resdata[i][3]));
                 var sum = parseInt(resdata[i][1]) + parseInt(resdata[i][2])+ parseInt(resdata[i][3]);
                 areaGraphValues.push(sum);
               }
              
             

                this.setState({
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
                    series: [{
                        name: 'Chute Pick',
                        data: ChutePick
                      }, {
                        name: 'Batch Pick',
                        data: BatchPick
                      }, {
                        name: 'Pick',
                        data: Pick
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
                      radialseries :
                      [{
                        name: 'Total Picks',
                        data: areaGraphValues
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
    };


  

  

    render() {
      return (
        
        <Screen>
            <div style = {{paddingLeft:'20px',
}}>
    <Card style ={
        {
            
            width:'90%',
            backgroundColor:'rgb(212, 239, 255)'
        
        }
    }>
  

  <CardContent>
    <Typography>
    <div>
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
        size="medium"
        style ={{ marginLeft : '70px', marginTop:'6px' }}
        onClick={(e) => {this.onButtonClick(e)}}
      
       
      >
        Update
      </Button>

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
   
   <Chart options={this.state.options} series={this.state.series} type="bar" height={300} width={850} />
   </div>
   
        </Typography>
      </CardContent>
  <CardActions disableSpacing></CardActions>
      </Card>
</Paper>
        </Grid>
        </td>
        <td>

      
        <Grid item xs={30}>
          <Paper>
          <Card style={{
      alignContent:'center',
      height:'450px',
      width:'110%',
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