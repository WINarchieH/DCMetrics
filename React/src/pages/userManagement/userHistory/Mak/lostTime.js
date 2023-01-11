import React, { Component, useState, useEffect } from 'react';
import api from '../../../../components/api/api';

import Chart from 'react-apexcharts'

class LostTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            FromDate: props.startDate,
            ToDate: props.endDate,

            lineGraphSeries: [
                {
                    name: 'Total Lost Time',
                    data: []
                }],
            lineGraphOptions:
            {
                chart: {
                    id: 'lostTime_PerUser',
                    height: 350,
                    type: 'line',
                },
                stroke: {
                    width: 7,
                    curve: 'smooth'
                },
                xaxis: {

                    categories: []


                },
                title: {
                    text: 'LOST TIME PER USER',
                    align: 'center',
                    style: {
                        fontSize: "11px",
                        fontFamily: 'Arial',
                        color: 'green'
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        gradientToColors: ['#FDD835'],
                        shadeIntensity: 1,
                        type: 'horizontal',
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100, 100, 100]
                    },
                },
                dataLabels: {
                    enabled: true
                },
                markers: {
                    size: 4,
                    colors: ["#FFA41B"],
                    strokeColors: "#fff",
                    strokeWidth: 2,
                    hover: {
                        size: 7,
                    }
                },
                yaxis: {

                    title: {
                        text: 'LOST TIME',
                        style:
                        {
                            color: 'green',
                            fontSize: '10px'
                        }
                    },
                }

            },
            series: [],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                    toolbar: {
                        show: true
                    },
                    zoom: {
                        enabled: true
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

                    categories: [
                    ],
                },
                legend: {
                    position: 'right',
                    offsetY: 40
                },
                fill: {
                    opacity: 1
                },
                title: {
                    text: 'LOST TIME PER CATEGORY',
                    align: 'black',
                    style: {
                        fontSize: "11px",
                        fontFamily: 'Arial',
                        color: 'green'
                    }

                },
                yaxis: {

                    title: {
                        text: 'LOST TIME',
                        style:
                        {
                            color: 'green',
                            fontSize: '10px'
                        }
                    },
                }
            }
        }
    }


    async componentDidMount() {

        let body = new URLSearchParams({

            'FromDate': this.props.startDate,
            'ToDate': this.props.endDate,
            'UserName': this.props.userID,
        });
        api.post('/UserManagement/UserHistory/UserHistoryLostTime', body).then(
            res => {

                let resdata = res.data;

                var shortbreaklosttime = [];
                var longbreaklosttime = [];
                var startlosttime = [];
                var endlosttime = [];
                var date = [];


                var temp = resdata.Date;
                date = temp.map(x => x);

                temp = resdata.LongBreakLostTime;
                longbreaklosttime = temp.map(x => x);

                temp = resdata.ShortBreakLostTime;
                shortbreaklosttime = temp.map(x => x);

                temp = resdata.StartLostTime;
                startlosttime = temp.map(x => x);

                temp = resdata.EndLostTime;
                endlosttime = temp.map(x => x);

                var sum = [];
                for (var i = 0; i < date.length; i++) {
                    sum.push(parseInt(endlosttime[i]) + parseInt(startlosttime[i]) + parseInt(shortbreaklosttime[i]) + parseInt(longbreaklosttime[i]))
                }

                this.setState({
                    options:
                    {
                        chart: {
                            id: "Lost Time"
                        },
                        xaxis:
                        {
                            categories: date
                        }

                    },
                    options1:
                    {
                        labels: date
                    },
                    series1: sum,
                    series: [{
                        name: 'Start Lost Time',
                        data: startlosttime
                    }, {
                        name: 'End Lost Time',
                        data: endlosttime
                    }, {
                        name: 'Short Break Lost Time',
                        data: shortbreaklosttime
                    }, {
                        name: 'Long Break Lost Time',
                        data: longbreaklosttime

                    }],
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

                'FromDate': this.props.startDate,
                'ToDate': this.props.endDate,
                'UserName': this.props.userID,
                
            });
            api.post('/UserManagement/UserHistory/UserHistoryLostTime', body).then(
                res => {

                    let resdata = res.data;

                    var shortbreaklosttime = [];
                    var longbreaklosttime = [];
                    var startlosttime = [];
                    var endlosttime = [];
                    var date = [];


                    var temp = resdata.Date;
                    date = temp.map(x => x);

                    temp = resdata.LongBreakLostTime;
                    longbreaklosttime = temp.map(x => x);

                    temp = resdata.ShortBreakLostTime;
                    shortbreaklosttime = temp.map(x => x);

                    temp = resdata.StartLostTime;
                    startlosttime = temp.map(x => x);

                    temp = resdata.EndLostTime;
                    endlosttime = temp.map(x => x);

                    var sum = [];
                    for (var i = 0; i < date.length; i++) {
                        sum.push(parseInt(endlosttime[i]) + parseInt(startlosttime[i]) + parseInt(shortbreaklosttime[i]) + parseInt(longbreaklosttime[i]))
                    }


                    this.setState({
                        options:
                        {
                            chart: {
                                id: "Lost Time"
                            },
                            xaxis:
                            {
                                categories: date
                            }

                        },
                        options1:
                        {
                            labels: date
                        },
                        series1: sum,
                        series: [{
                            name: 'Start Lost Time',
                            data: startlosttime
                        }, {
                            name: 'End Lost Time',
                            data: endlosttime
                        }, {
                            name: 'Short Break Lost Time',
                            data: shortbreaklosttime
                        }, {
                            name: 'Long Break Lost Time',
                            data: longbreaklosttime

                        }],
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
                <Chart options={this.state.options} series={this.state.series} type="bar" height={390} width={850} />
            </div>
        );
    }
}

export default LostTime;