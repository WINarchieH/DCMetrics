import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  Grid,
  colors,
  LinearProgress
} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import React, { Component, useState, useEffect} from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Chart from 'react-apexcharts'
import api from '../../../components/api/api';


const curr = new Date() ; // get current date
const lastDay = curr.getDate()-1 ; // First day is the day of the month - the day of the week
const firstDay = lastDay - 6; // last day is the first day + 6

const last = new Date(curr.setDate(lastDay)).toDateString();
const first = new Date(curr.setDate(firstDay)).toDateString();


class ProductivityPickGraph extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
   
      open:false,
      startDate: first,
      endDate : last,
      series: [{
            name: 'PickUnits Per Hour',
            data: []
          },
          {
           name: 'PutawayUnits Per Hour',
           data: []
          }
         ],
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
             
              align: 'center',
              style:{ fontSize:  '12px',
              fontFamily: "Montserrat",
              color:'rgb(35,168,224)'}
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
      radialseries: [{
        name: 'Total Pick Units',
        data: []
      },
      {
        name: 'Total Putaway Units',
        data: []
      }
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
       
        xaxis:
        {
         
          categories: []
        },
        yaxis: {
               
          title: {
            text: 'UNITS',
          
          style:{ fontSize:  '10px',
          fontFamily: "Montserrat",
          color:'rgb(35,168,224)'}
        }
       },
        title:
        {
          
          align:"left",
        style: {
          fontSize:  '12px',
          fontFamily: "Montserrat",
          color:'rgb(35,168,224)'
        }
        },
        tooltip:
        {
          x:
          {
            format: 'dd MM'
          },
        },

      },
      
    };

  }
  handleIndepthButtonChange = (e) =>
  {
    
    
    window.open('/DashBoard/DashboardPickProductivity');
  }
  async componentDidMount()
    {

      
      var currentsite = this.props.props;
    
        let body = new URLSearchParams({

             'StartDate':this.state.startDate,
             'EndDate':this.state.endDate,
             'Site':currentsite
          });
  
          
       
           api.post('/HomeScreen/HomeScreenProductivity/Dash_PickandPut_Productivity',body).then(
            res => 
            {

              let resdata = res.data;
              var dates =[];
              var units=[];
              var unitsPerHour =[];
              var putawayUnitsPerHr=[];
              var PutawayUnits=[];
              
           //Pick Units
                 var temp =    resdata.Dates;
                 dates =       temp.map(x=>x);
                  temp =    resdata.Units;
                 units =       temp.map(x => x);
                  temp =    resdata.UnitsPerHr;
                 unitsPerHour = temp.map(x => x);
                 //PutawayUnits
                 temp =    resdata.PutawayPerHr;
                 putawayUnitsPerHr = temp.map(x => x);

                  temp =    resdata.PutawayUnits;
                 PutawayUnits = temp.map(x => x);

                  
                

                this.setState({
                  open : true,
                    options:
                    {
                            xaxis :
                            {
                                categories: dates
                            }

                    },
                    series: [{
                        name: 'Pick Units Per Hour',
                        data: unitsPerHour
                      },
                      {
                        name: 'Putaway Units Per Hour',
                        data: putawayUnitsPerHr
                      }
                    ],
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
                        name: 'Total Pick Units',
                        data: units
                      },
                      {
                        name: 'Total Putaway Units',
                        data: PutawayUnits
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
              };
    


  render()
  {
  return (
    <Grid container spacing={1}>
    <Grid item lg={8} md={12} xl={9} xs={10} >
  
    <Card >
    <CardHeader style={{ fontFamily:'Montserrat',  fontWeight:'400', color: 'rgb(35,168,224)',margin: '10', padding: '10' }}
        action={(
          <Button  size="small"   variant="text">
            Last 7 days
          </Button>
        )}
        titleTypographyProps={{variant:'h6' }}
        title="PICK AND PUTAWAY PRODUCTIVITY PER DAY"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 250,
            position: 'relative'
          }}
        >
          <Chart options={this.state.options} series={this.state.series} type="bar" height={230} width={850} />
        </Box>
        
  <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          onClick={(e) => { this.handleIndepthButtonChange(e) }}
          
        >
          IN DEPTH VIEW
        </Button>
        </Box>
      </CardContent>
      <div hidden={this.state.open} >
      <LinearProgress color="secondary" />
    </div>
    </Card>
    </Grid>

      <Grid
      item
      lg={4}
      md={12}
      xl={9}
      xs={12}
    >
       <Card >
       <CardHeader style={{ fontFamily:'Montserrat',  fontWeight:'400', color: 'rgb(35,168,224)',margin: '10', padding: '10' }}
        action={(
          <Button
            size="small"
            variant="text"
          
          >
            Last 7 days
          </Button>
        )}
        titleTypographyProps={{variant:'h6' }}
        title="TOTAL UNITS PER DAY"
      />
      <Divider></Divider>
      <CardContent>
        <Box
          sx={{
            height: 220,
            position: 'relative'
          }}
        >
         <Chart options={this.state.radialoptions } series={ this.state.radialseries }type="area" height={230} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
            <Box
              
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
            
              <Typography  color="textPrimary" variant="body1" >
              </Typography>
              <Typography  variant="h2" >
            
              </Typography>
            </Box>
          
        </Box>
      </CardContent>
  
  <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          onClick={(e) => { this.handleIndepthButtonChange(e) }}
        
        >
          IN DEPTH VIEW
        </Button>
        </Box>
      <div hidden={this.state.open} >
      <LinearProgress color="secondary" />
    </div>
    </Card>
    
    </Grid>
  
  
    </Grid>

    
  
          
   

  );

}

}



export default ProductivityPickGraph;
