import React, { Component, useState, useEffect } from 'react';
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
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, TestdateObjToInput, formatDate } from '../../../components/fields/dateHelpers';
import { batch } from 'react-redux';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
// react Spinners
import {ClipLoader,SyncLoader} from "react-spinners";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '200%',

        fontFamily: "Montserrat",
        fontSize: "10px"
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


const curr = new Date(); // get current date
const lastDay = curr.getDate() - curr.getDay() -1; // First day is the day of the month - the day of the week
const firstDay = lastDay -1; // last day is the first day + 6

var dateFrom = new Date();
dateFrom.setDate(dateFrom.getDate() - 7);
var dateTo = new Date();
dateTo.setDate(dateTo.getDate() - 1);

//getting the last Week Start Date and Enddate
var beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
var beforeOneWeek2 = new Date(beforeOneWeek);
var day = beforeOneWeek.getDay()
var diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
var  lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
var lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));

const todate = lastSunday;
const fromdate = lastMonday;




class Charts extends React.Component {
    constructor(props) {
        super(props);


        this.state = {

            FromDate: TestdateObjToInput(fromdate),
            ToDate: TestdateObjToInput(todate),
            syncloader : true,
            BarGraphSeries:[
                  {
                   name: 'Direct Time',
                   data: []
                  },
                   {
                    name: 'Indirect Time',
                    data: []
                    },
             ],
             bargraphoptions:{
                title:{
                 text:"Indirect V Direct Per Day",
                 align:"center",
                style: {
                 fontSize:  '12Spx',
                 fontFamily: "Montserrat",
                        color:'rgb(35,168,224)'
                }
               },
                chart: {
                 id:"Pick-Chart",
                 
                 stacked: true,
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
                 opacity: 1,
                
               },
               title:{
                 text:"INDIRECT V DIRECT PER DAY",
                 align:"center",
               
               style: {
                 fontSize:  '12px',
                 fontFamily: "Montserrat",
                 color:'rgb(35,168,224)'
               }
              },
               yaxis: {
                      
               title: {
                 text: 'Total Time (Hours)',
               
               style: { fontSize: '13px',
               fontFamily: "Montserrat",
               color:'rgb(35,168,224)'}
               }
             },
            },
            series1: [],
            options1: {
                chart: {
                    width: 600,
                    type: 'donut',
                },
                plotOptions: {
                    pie: {
                        startAngle: -90,
                        endAngle: 270
                    }
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    type: 'gradient',
                
                },
                legend: {
                    formatter: function (val, opts) {
                        return val + " - " + opts.w.globals.series[opts.seriesIndex]
                    }
                },
                title: {
                    text: 'TOTAL TIME PER INDIRECT COST CENTRE',
                    align: 'black',
                    style: {
                        fontSize: "11px",
                        fontFamily: "Montserrat",
                        color:'rgb(35,168,224)'

                    }

                },

            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 400,
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],

            series2: [],
            options2: {
                chart: {
                    width: 600,
                    type: 'donut',
                },
                plotOptions: {
                    pie: {
                        startAngle: -90,
                        endAngle: 270
                    }
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    type: 'gradient',
                    
                },
                legend: {
                    formatter: function (val, opts) {
                        return val + " - " + opts.w.globals.series[opts.seriesIndex]
                    }
                },
                title: {
                    text: 'TOTAL HOURS PER INDIRECT TASK',
                    align: 'black',
                    style: {
                        fontSize: "11px",
                        fontFamily: "Montserrat",
                        color:'rgb(35,168,224)'

                    }

                },
                // chart: {
                //     events: {
                //         dataPointSelection: function (event, chartContext, config) {
                //             console.log(config.selectedDataPoints[0]);
                //         }
                //     }
                // },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 400,
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
            
            series3: [],
            options3: {
                chart: {
                    width: 550,
                    type: 'donut',
                },
                plotOptions: {
                    pie: {
                        startAngle: -90,
                        endAngle: 270
                    }
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    type: 'gradient',
                    
                },
                legend: {
                    formatter: function (val, opts) {
                        return val + " - " + opts.w.globals.series[opts.seriesIndex]
                    }
                },
                title: {
                    text: 'TOTAL HOURS PER DIRECT TASK',
                    align: 'black',
                    style: {
                        fontSize: "11px",
                        fontFamily: "Montserrat",
                        color:'rgb(35,168,224)'

                    }

                },
                // chart: {
                //     events: {
                //         dataPointSelection: function (event, chartContext, config) {
                //             console.log(config.selectedDataPoints[0]);
                //         }
                //     }
                // },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 400,
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },


            series4: [],
            options4: {
                chart: {
                    
                    type: 'column',
                },
               
                dataLabels: {
                    enabled: false
                },
                fill: {
                    type: 'gradient',
                
                },
                legend: {
                    formatter: function (val, opts) {
                        return val + " - " + opts.w.globals.series[opts.seriesIndex]
                    }
                },
                title: {
                    text: 'TOTAL TIME PER DIRECT TASKS VS INDIRECT TASKS',
                    align: 'black',
                    style: {
                        fontSize: "11px",
                        fontFamily: "Montserrat",
                        color:'rgb(35,168,224)'

                    }

                },

            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 400,
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
        };


    }


    handleChange = (e) => {

        this.setState({ FromDate: dateToInput(inputToDate(e.target.value)) });
    };

    handleEndDateChange = (e) => {

        this.setState({ ToDate: dateToInput(inputToDate(e.target.value)) });

    };
    onButtonClick = (e) => {
        
        this.setState({
            syncloader :true,
        })

        let body = new URLSearchParams({

            'StartDate': this.state.FromDate,
            'EndDate': this.state.ToDate
        });
        api.post('/Dashboard/DashboardTaskTime/Dash_TimePerIndirect_CC', body).then(
            res => {

                let resdata = res.data;

                var costCentre = [];
                var totalHrs = [];

                var temp = resdata.CostCentre;
                costCentre = temp.map(x => x);

                temp = resdata.TotalHrs;
                totalHrs = temp.map(x => x);

                var COLORS = [];
                while (COLORS.length < costCentre.length) {
                    COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
                }
                
                // random number generator
                function rand(frm, to) {
                    return ~~(Math.random() * (to - frm)) + frm;
                }
                
                

                this.setState({
                    syncloader :false,
                    options:
                    {
                        chart: {
                            id: "Indirect Cost Centre Time"
                        },
                        xaxis:
                        {
                            categories: costCentre
                        }

                    },
                    options1:
                    {colors: COLORS,
                        labels: costCentre
                    },
                    series1: totalHrs,

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

        api.post('/Dashboard/DashboardTaskTime/Dashboard_TimePerIndirectTasks', body).then(
            res => {

                let resdata = res.data;

                var taskName = [];
                var totalHrs = [];

                var temp = resdata.TaskName;
                taskName = temp.map(x => x);

                temp = resdata.TotalHrs;
                totalHrs = temp.map(x => x);

                var COLORS = [];
                while (COLORS.length < taskName.length) {
                    COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
                }
                
                // random number generator
                function rand(frm, to) {
                    return ~~(Math.random() * (to - frm)) + frm;
                }
                
                
                this.setState({
                    options:
                    {
                        chart: {
                            id: "Indirect Task Time"
                        },
                        xaxis:
                        {
                            categories: taskName
                        }

                    },
                    options2:
                    {colors: COLORS,
                        labels: taskName
                    },
                    series2: totalHrs,


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

            api.post('/Dashboard/DashboardTaskTime/Dash_TimePerDirectTasks', body).then(
                res => {
    

                    // getting random colors

                    let resdata = res.data;
    
                    var tasktype = [];
                    var totalHrs = [];
    
                    var temp = resdata.TaskName;
                    tasktype = temp.map(x => x);
                    temp = resdata.TotalHrs;
                    totalHrs = temp.map(x => x);

                    var COLORS = [];
                      while (COLORS.length < tasktype.length) {
                       COLORS.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
                              }

                               // random number generator
                               function rand(frm, to) {
                                return ~~(Math.random() * (to - frm)) + frm;
                                } 


                  


                    this.setState({
                        options3:
                        {

                            chart: {
                                id: "Direct Task Time"
                            },
                            xaxis:
                            {
                                categories: tasktype
                            }
    
                        },
                        options3:
                        {
                            colors: COLORS,
                            labels: tasktype
                        },
                      
                        series3: totalHrs
    
    
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

                // bar graph Api call

                api.post('/Dashboard/DashboardTaskTime/Dash_TimePerDirect_PerDay', body).then(
                    res => {
        
                        let resdata = res.data;
        
                        var dates = [];
                        var indirecthrs = [];
                        var directhrs = [];
        
                        var temp = resdata.Dates;
                        dates = temp.map(x => x);
        
                        temp = resdata.DirectActivityTime;
                        directhrs = temp.map(x => x);

                        temp = resdata.IndirectActivityTime;
                        indirecthrs = temp.map(x => x);
        
                        this.setState({
                            bargraphoptions:
                            {
                               
                                xaxis:
                                {
                                    categories: dates
                                }
        
                            },
                          
                          
                            BarGraphSeries:[
                                {
                                 name: 'Direct Time',
                                 data: directhrs
                                },
                                 {
                                  name: 'Indirect Time',
                                  data: indirecthrs
                                  },
                           ],
        
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


    async componentDidMount() {

        let body = new URLSearchParams({

            'StartDate': this.state.FromDate,
            'EndDate': this.state.ToDate
        });
        api.post('/Dashboard/DashboardTaskTime/Dash_TimePerIndirect_CC', body).then(
            res => {

                let resdata = res.data;

                var costCentre = [];
                var totalHrs = [];

                var temp = resdata.CostCentre;
                costCentre = temp.map(x => x);

                temp = resdata.TotalHrs;
                totalHrs = temp.map(x => x);

                this.setState({
                    syncloader :false,
                    options:
                    {
                        chart: {
                            id: "Indirect Cost Centre Time"
                        },
                        xaxis:
                        {
                            categories: costCentre
                        }

                    },
                    options1:
                    {
                        labels: costCentre
                    },
                    series1: totalHrs,

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



        api.post('/Dashboard/DashboardTaskTime/Dashboard_TimePerIndirectTasks', body).then(
            res => {

                let resdata = res.data;

                var taskName = [];
                var totalHrs = [];

                var temp = resdata.TaskName;
                taskName = temp.map(x => x);

                temp = resdata.TotalHrs;
                totalHrs = temp.map(x => x);

                this.setState({
                    options:
                    {
                        chart: {
                            id: "Indirect Task Time"
                        },
                        xaxis:
                        {
                            categories: taskName
                        }

                    },
                    options2:
                    {
                        labels: taskName
                    },
                    series2: totalHrs,


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
            api.post('/Dashboard/DashboardTaskTime/Dash_TimePerDirectTasks', body).then(
                res => {
    
                    let resdata = res.data;
    
                    var tasktype = [];
                    var totalHrs = [];
    
                    var temp = resdata.TaskName;
                    tasktype = temp.map(x => x);
    
                    temp = resdata.TotalHrs;
                    totalHrs = temp.map(x => x);
    
                    this.setState({
                        options3:
                        {
                            chart: {
                                id: "Direct Task Time"
                            },
                            xaxis:
                            {
                                categories: tasktype
                            }
    
                        },
                      
                        options3:
                    {
                        labels: tasktype
                    },
                        series3: totalHrs,
    
    
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

                // bar graph Api call

                api.post('/Dashboard/DashboardTaskTime/Dash_TimePerDirect_PerDay', body).then(
                    res => {
        
                        let resdata = res.data;
        
                        var dates = [];
                        var indirecthrs = [];
                        var directhrs = [];
        
                        var temp = resdata.Dates;
                        dates = temp.map(x => x);
        
                        temp = resdata.DirectActivityTime;
                        directhrs = temp.map(x => x);

                        temp = resdata.IndirectActivityTime;
                        indirecthrs = temp.map(x => x);
        
                        this.setState({
                            bargraphoptions:
                            {
                               
                                xaxis:
                                {
                                    categories: dates
                                }
        
                            },
                          
                          
                            BarGraphSeries:[
                                {
                                 name: 'Direct Time',
                                 data: directhrs
                                },
                                 {
                                  name: 'Indirect Time',
                                  data: indirecthrs
                                  },
                           ],
        
        
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

    render() {
        return (

            <Screen>
                <div style={{
                    paddingLeft: '1vw',
                }}>
                    <Card style={
                        {
                            marginLeft: '3vw',
                            width: '95%',
                            backgroundColor: 'rgb(241, 242, 242)'

                        }
                    }>


                        <CardContent>
                            <Typography>


                                <div style={{ display: 'flex', justifycontent: 'center', alignitems: 'center', height: '3vw' }}>
                                    <TextField
                                        id="date"
                                        label="Start Date"
                                        type="date"
                                        style={
                                            { marginLeft: '28%' }}
                                        className={useStyles.textField}
                                        value={this.state.FromDate}
                                        onChange={(e) => { this.handleChange(e) }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                    <TextField
                                        id="enddate"
                                        label="End Date"
                                        className={useStyles.textField}
                                        style={{ marginLeft: '70px' }}
                                        type="date"
                                        value={this.state.ToDate}
                                        onChange={(e) => { this.handleEndDateChange(e) }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        style={{  fontFamily: "Montserrat", marginLeft: '90px', marginTop: '6px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                                        onClick={(e) => { this.onButtonClick(e) }}

                                    >
                                        Update
                                    </Button>

                                    <SyncLoader color="#0000FF" loading={this.state.syncloader}  css={{ marginLeft : '30px',display: 'block',margin: '0 auto',borderClose: 'red',margin:'2'}} size={16} />

                                </div>

                                <br></br>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Paper>
                                            <Card style={{
                                                alignContent: 'center',
                                                backgroundColor: 'white',
                                                height:600
                                            }}>
                                                <CardContent>
                                                    <Typography>
                                                        <div >
                                                            <Chart options={this.state.options3} series={this.state.series3} type="donut" />

                                                        </div>
                                                    </Typography>
                                                </CardContent>

                                            </Card>
                                        </Paper>

                                    </Grid>

                                    <Grid item xs={6}>
                                        <Paper>
                                            <Card style={{
                                                alignContent: 'center',
                                                backgroundColor: 'white',
                                                height:600
                                            }}>
                                                <CardContent>
                                                    <Typography>
                                                        <div >
                                                            <Chart options={this.state.options2} series={this.state.series2} type="donut" />

                                                        </div>
                                                    </Typography>
                                                </CardContent>

                                            </Card>
                                        </Paper>

                                    </Grid>
                               

                                    <Grid item xs={90}>
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
   
        <Chart options={this.state.bargraphoptions} series={this.state.BarGraphSeries} type="bar"  height={350} width={1050} />
   </div>
   
        </Typography>
      </CardContent>
  <CardActions disableSpacing></CardActions>
      </Card>
</Paper>
        </Grid>
        </Grid>

                              





                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing></CardActions>
                    </Card>
                </div>
            </Screen>
        )
    }
};



export default Charts;