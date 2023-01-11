import React, { Component, useState, useEffect } from 'react';
import api from '../../../../components/api/api';

import Chart from 'react-apexcharts'

class BatchPickProd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            FromDate: props.startDate,
            ToDate: props.endDate,

            series: [{
                name: "Dates",
                data: []
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: true
                    }
                },
                colors: ['#018FFB'],
                dataLabels: {
                    enabled: true
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Batch Pick Rates',
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
                }
            },


        };
    }

    async componentDidMount() {

        let body = new URLSearchParams({

            'StartDate': this.props.startDate,
            'EndDate': this.props.endDate,
            'UserId': this.props.userID,
            'TaskType': 'BatchPick'
        });
        api.post('/UserManagement/UserHistory/UserProductivityRates', body).then(
            res => {

                let resdata = res.data;

                var dates = [];
                var unitsPerHr = [];

                var temp = resdata.Dates;
                dates = temp.map(x => x);

                temp = resdata.UnitsPerHr;
                unitsPerHr = temp.map(x => x);

                this.setState({
                    options:
                    {
                        chart: {
                            id: "Batch Pick Rates"
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
                        name: 'Units Per Hr',
                        data: unitsPerHr
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


    componentDidUpdate(prevProps) {

        if (prevProps.loadGraphs != this.props.loadGraphs) {

            let body = new URLSearchParams({

                'StartDate': this.props.startDate,
                'EndDate': this.props.endDate,
                'UserId': this.props.userID,
                'TaskType': 'BatchPick'
            });
            api.post('/UserManagement/UserHistory/UserProductivityRates', body).then(
                res => {

                    let resdata = res.data;

                    var dates = [];
                    var unitsPerHr = [];

                    var temp = resdata.Dates;
                    dates = temp.map(x => x);

                    temp = resdata.UnitsPerHr;
                    unitsPerHr = temp.map(x => x);

                    this.setState({
                        options:
                        {
                            chart: {
                                id: "Batch Pick Rates"
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
                            name: 'Units Per Hr',
                            data: unitsPerHr
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
        }

    }

    render() {
        return (
            <div id="chart">
                <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>
        );
    }
}

export default BatchPickProd;