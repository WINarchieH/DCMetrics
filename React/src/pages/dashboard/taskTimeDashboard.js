import React, { Component, useState, useEffect } from 'react';
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
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, TestdateObjToInput, formatDate } from '../../components/fields/dateHelpers';
import { batch } from 'react-redux';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '200%',

        fontFamily: "Montserrat",
        fontSize: "10px",
         color:'rgb(35,168,224)'
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
const lastDay = curr.getDate() - curr.getDay() + 2; // First day is the day of the month - the day of the week
const firstDay = lastDay - 6; // last day is the first day + 6

const todate = new Date(curr.setDate(lastDay)).toDateString();
const fromdate = new Date(curr.setDate(firstDay)).toDateString();




class Charts extends React.Component {
    constructor(props) {
        super(props);


        this.state = {

            FromDate: TestdateObjToInput(dateToDateObj(fromdate)),
            ToDate: TestdateObjToInput(dateToDateObj(todate)),


            series1: [],
            options1: {
                chart: {
                    width: 800,
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
                        fontFamily: 'Montserrat',
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
                    width: 800,
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
                    text: 'TOTAL TIME PER INDIRECT TASK',
                    align: 'black',
                    style: {
                        fontSize: "11px",
                        fontFamily: 'Montserrat',
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

        };


    }


    handleChange = (e) => {

        this.setState({ FromDate: dateToInput(inputToDate(e.target.value)) });
    };

    handleEndDateChange = (e) => {

        this.setState({ ToDate: dateToInput(inputToDate(e.target.value)) });

    };
    onButtonClick = (e) => {

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
                                        style={{ marginLeft: '90px', fontFamily:'Montserrat', marginTop: '6px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                                        onClick={(e) => { this.onButtonClick(e) }}

                                    >
                                        Update
                                    </Button>

                                </div>

                                <br></br>

                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Paper>
                                            <Card style={{
                                                alignContent: 'center',
                                                backgroundColor: 'white'
                                            }}>
                                                <CardContent>
                                                    <Typography>
                                                        <div >
                                                            <Chart options={this.state.options1} series={this.state.series1} type="donut" />

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
                                                backgroundColor: 'white'
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