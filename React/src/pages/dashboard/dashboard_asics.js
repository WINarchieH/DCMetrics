import React, { Component, useState, useEffect} from 'react';
import Screen from '../../components/screen/screen';
import api from '../../components/api/api';

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
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../components/fields/dateHelpers';
import { batch } from 'react-redux';
//Grid
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

// react Spinners
import {ClipLoader,SyncLoader} from "react-spinners";

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
        syncloader : true,
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
            enabled: true
          },
          stroke: {
            curve: 'smooth'
          },
          yaxis:
          {
            title:{
              text:'Units',
              style:
              {
                fontSize:'12px',
                fontFamily:  'Montserrat',
                color:  'rgb(35,168,224)'
              }
            }
          },

          title:{
            text:'TOTAL PICKED UNITS PER DAY',
            align:'left',
            style:
            {
              fontSize:'12px',
              fontFamily:  'Montserrat',
              color:  'rgb(35,168,224)'
            }
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
            fontFamily:  'Montserrat',
            color:  'rgb(35,168,224)'
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
              borderRadius: 5,
              horizontal: false,
              columnWidth: '90%',
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
            text:"TOTAL PICKED UNITS PER CATEGORY",
            align:"center",
          
           style: {
            fontSize:  '12px',
            fontFamily:  'Montserrat',
             color:  'rgb(35,168,224)'
           }
          },
      },

      prodseries: [{
        name: 'Chute Pick Productivity',
        data: []
      }, {
        name: 'Batch Pick Productivity',
        data: []
      }, {
        name: 'Pick Productivity',
        data: []
      }],

      prodoptions: {
        width:1050,
        title:{
          text:"Total Units",
          align:"center",
        
        style: {
          fontSize:  '14px',
          fontFamily:  'Montserrat',
          color:  'rgb(35,168,224)'
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
            borderRadius: 5,
            horizontal: false,
            columnWidth: '90%',
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
          text:"PICK PRODUCTIVITY PER CATEGORY",
          align:"center",
        
         style: {
          fontSize:  '14px',
          fontFamily:  'Montserrat',
          color:  'rgb(35,168,224)'
         }
        },
    },
      
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
          
       this.setState (
         { syncloader: true}
       );

        let body = new URLSearchParams({

            'StartDate':this.state.startDate,
            'EndDate':this.state.endDate
         });
 

          api.post('/Dashboard/DashboardProductivity/Asics_Dash_PickedProductivity',body).then(
          res => 
          {

            
              let resdata = res.data;
              var dates =[];
              var chutepickprod =[];
              var pickprod =[];
              var batchpickprod =[];

              //Pick Units

               var temp =    resdata.Dates;
               dates =       temp.map(x=>x);

               temp =    resdata.batchpickProductivity;
               batchpickprod =       temp.map(x => x);

                temp =    resdata.pickProductivity;
                pickprod = temp.map(x => x);

               temp =    resdata.ChutepickProductivity;
               chutepickprod = temp.map(x => x);

              this.setState({
                  prodoptions:
                  {
                          xaxis :
                          {
                              categories: dates
                          }

                  },
                  syncloader : false,
                  prodseries: [{
                    name: 'Chute Pick Productivity',
                    data: chutepickprod
                  }, {
                    name: 'Batch Pick Productivity',
                    data: batchpickprod
                  }, {
                    name: 'Pick Productivity',
                    data: pickprod
                  }],
                  
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

          api.post('/Dashboard/DashboardProductivity/Asics_Dash_PickedUnits',body).then(
           res => 
           {

            let resdata = res.data;
            var dates =[];
            var BatchPick=[];
            var Pick =[];
            var ChutePick= [];

          
           
            var areaGraphValues =[];
         
            //Pick Units

             var temp =    resdata.Dates;
             dates =       temp.map(x=>x);

             temp =    resdata.chutepicks;
             ChutePick =       temp.map(x => x);

              temp =    resdata.BatchPicks;
              BatchPick = temp.map(x => x);

             temp =    resdata.Picks;
             Pick = temp.map(x => x);

             temp =    resdata.totalunits;
             areaGraphValues = temp.map(x => x);

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
                   syncloader : false,
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


          await api.post('/Dashboard/DashboardProductivity/Asics_Dash_PickedProductivity',body).then(
            res => 
            {

              
                let resdata = res.data;
                var dates =[];
                var chutepickprod =[];
                var pickprod =[];
                var batchpickprod =[];

                this.setState({
                  syncloader : false,
                })
              
               
             
                //Pick Units

                 var temp =    resdata.Dates;
                 dates =       temp.map(x=>x);

                 temp =    resdata.batchpickProductivity;
                 batchpickprod =       temp.map(x => x);

                  temp =    resdata.pickProductivity;
                  pickprod = temp.map(x => x);

                 temp =    resdata.ChutepickProductivity;
                 chutepickprod = temp.map(x => x);

                this.setState({
                
                    prodoptions:
                    {
                            xaxis :
                            {
                                categories: dates
                            }

                    },
                   
                    prodseries: [{
                      name: 'Chute Pick Productivity',
                      data: chutepickprod
                    }, {
                      name: 'Batch Pick Productivity',
                      data: batchpickprod
                    }, {
                      name: 'Pick Productivity',
                      data: pickprod
                    }],
                    
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

  
           api.post('/Dashboard/DashboardProductivity/Asics_Dash_PickedUnits',body).then(
            res => 
            {

              
                let resdata = res.data;
                var dates =[];
                var BatchPick=[];
                var Pick =[];
                var ChutePick= [];

              
               
               var areaGraphValues =[];
             
                //Pick Units

                 var temp =    resdata.Dates;
                 dates =       temp.map(x=>x);

                 temp =    resdata.chutepicks;
                 ChutePick =       temp.map(x => x);

                  temp =    resdata.BatchPicks;
                  BatchPick = temp.map(x => x);

                 temp =    resdata.Picks;
                 Pick = temp.map(x => x);

                 temp =    resdata.totalunits;
                 areaGraphValues = temp.map(x => x);

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
        <div style = {{paddingLeft:'1vw',
        }}>
            <Card style ={
                {
                    marginLeft:'3vw',
                    width:'95%',
                    backgroundColor:'rgb(241, 242, 242)'
                
                }
            }>
          
        
          <CardContent>
            <Typography>
          
        
          <div style= {{ display: 'flex', justifycontent: 'center', alignitems: 'center', height:'3vw' }}>
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
                size="small"
                style ={{ fontFamily:  'Montserrat', marginLeft : '90px', marginTop:'6px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                onClick={(e) => {this.onButtonClick(e)}}
              
               
              >
                Update
              </Button>

              <SyncLoader color="#0000FF" loading={this.state.syncloader}  css={{ marginLeft : '30px',display: 'block',margin: '0 auto',borderClose: 'red',margin:'2'}} size={16} />
          
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
   
   <Chart options={this.state.options} series={this.state.series} type="bar" height={390} width={850} />
   </div>
   
        </Typography>
      </CardContent>
  <CardActions disableSpacing></CardActions>
      </Card>
</Paper>
        </Grid>
        </td>
        <td >

      
        <Grid  style ={{ marginLeft: '2vw'}}item xs={30}>
          <Paper>
          <Card style={{
    
      height:'450px',
      width:'120%',
    
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
<table>

  <tr>
    <td>
    <Grid item xs={50}>
<Paper>
<Card style ={
        {
          alignContent:'center',
          width:'120%',
          backgroundColor:'white',
          paddingLeft:'3vw'
        
        }
    }>
      <CardContent>
        <Typography>
        <div id="chart">
   
   <Chart options={this.state.prodoptions} series={this.state.prodseries} type="bar" height={390} width={1050} />
   </div>
   
        </Typography>
      </CardContent>
  <CardActions disableSpacing></CardActions>
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