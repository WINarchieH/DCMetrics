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

        fontFamily: "Calibri",
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


const curr = new Date(); // get current date
const lastDay = curr.getDate() - curr.getDay() + 2; // First day is the day of the month - the day of the week
const firstDay = lastDay - 6; // last day is the first day + 6

const todate = new Date(curr.setDate(lastDay)).toDateString();
const fromdate = new Date(curr.setDate(firstDay)).toDateString();



class ShippedUnitsDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            FromDate: TestdateObjToInput(dateToDateObj(fromdate)),
            ToDate: TestdateObjToInput(dateToDateObj(todate)),

            series: [{
                name: "Dates",
                data: []
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Total Shipped Units Per Day',
                    align: 'left',
                    style:{
                        fontFamily: "Montserrat",
                        color:'rgb(35,168,224)'
                    }
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                dataLabels: {
                    enabled: true,
                },
                xaxis: {
                    categories: [],
                }
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
        api.post('/Dashboard/DashboardProductivity/ShippedUnits', body).then(
            res => {

                let resdata = res.data;

                var dates = [];
                var shippedQty = [];

                var temp = resdata.Dates;
                dates = temp.map(x => x);

                temp = resdata.Units;
                shippedQty = temp.map(x => x);

                this.setState({
                    options:
                    {
                        chart: {
                            id: "Total Shipped Units Per Day"
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
                        name: 'Total Shipped',
                        data: shippedQty
                    }]

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
        api.post('/Dashboard/DashboardProductivity/ShippedUnits', body).then(
            res => {

                let resdata = res.data;

                var dates = [];
                var totalShipped = [];

                var temp = resdata.Dates;
                dates = temp.map(x => x);

                temp = resdata.Units;
                totalShipped = temp.map(x => x);

                this.setState({
                    options:
                    {
                        chart: {
                            id: "Total Shipped Units Per Day"
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
                        name: 'Total Shipped',
                        data: totalShipped
                    }]

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
                <Card  style ={{ background: 'rgb(241,242,242)'}} >
                    <CardContent >
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
                                    style={{ fontFamily:'Montserrat', marginLeft: '90px', marginTop: '6px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                                    onClick={(e) => { this.onButtonClick(e) }}


                                >
                                    Update
                                </Button>

                            </div>

                            <br></br>
                        </Typography>
                        <Typography>
                            <div id="chart">
                                <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
                            </div>
                        </Typography>
                    </CardContent>
                </Card>
            </Screen>



        );
    }
}

export default ShippedUnitsDashboard;
