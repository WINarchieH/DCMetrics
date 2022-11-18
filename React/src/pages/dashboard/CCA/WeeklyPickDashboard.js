import React, { useState, useEffect , componentDidMount} from 'react';
import Screen from '../../../components/screen/screen';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {LinearProgress
} from '@material-ui/core';

//grid
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

//date picker
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';



//import UserSummaryPerformance from './userSummaryPerformance';

import Pickproductivity from './graphtabs/Weekly/pickProductivity_Exp';
import Pickproductivitytrainee from './graphtabs/Weekly/pickProductivity_Trainee';
import PickProdDC from './graphtabs/Weekly/pickProductivity_DC';
import PickcasesDC from './graphtabs/Weekly/pickCases_DC';
import PickcasesTrainee from './graphtabs/Weekly/pickcases_Trainee';
import PickCasesExp from './graphtabs/Weekly/pickCases_Exp';
import PickCasesAll from './graphtabs/Weekly/pickCases_All';
import ReworksDC from './graphtabs/Weekly/reworks_DC';
import PickAccuracy from './graphtabs/Weekly/pickAccuracy'



import api from '../../../components/api/api';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../components/fields/dateHelpers';


//import GraphTabs from './graphsTabs';
import './pickdashboard.scss';
import { padding } from '@mui/system';

const useStylesCards = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 10,
    },
    date:{
        fontFamily:'Montserrat',
    }
    ,
    heading:
    {
      fontFamily:'Montserrat',
      color:'rgb(35,168,224)'
    }
});

const useStylesGrid = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
  
}));

const useStylesAvatar = makeStyles((theme) => ({
  root: {
      display: 'flex',
      
      
  },
}))

const dropdownData = {
  'Pickrates_Exp_Day': [''],
  'Dates':['']
};

const  UserHistory = () => {
    const classesCards = useStylesCards();
    const classesGrid = useStylesGrid();
    const classesSelect = useStylesSelect();

 
    const classesAvatar = useStylesAvatar();

    var test = [];
    //state vars
    var dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 7);
    var dateTo = new Date();
    dateTo.setDate(dateTo.getDate() - 1);

    //getting the last Week Start Date and Enddate
    var beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
   var beforeOneWeek2 = new Date(beforeOneWeek);
   var day = beforeOneWeek.getDay()
   var diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
   var  lastMonday = new Date(beforeOneWeek.setDate(diffToMonday-7))
   var lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));

    const [fromDate, setFromDate] = React.useState(lastMonday);
    const [toDate, setToDate] = React.useState(lastSunday );

    const [loadAttributes, setLoadAttributes] = React.useState(true); // toggle this on btn click to force attributes component update
    const [loadSummaryPerformance, setLoadSummaryPerformance] = React.useState(true); // toggle this on btn click to force summary performance component update
    const [loadGraphs, setLoadGraphs] = React.useState(true); // toggle this on btn click to force graphs update


    const handleFromDateChange = (date) => {
        setFromDate(date);
    };
    const handleToDateChange = (date) => {
        setToDate(date);
    };

    const onFetchButtonClick = (e) => {
        // console.log(fromDate);
        // console.log(toDate);
      
        setLoadGraphs(!loadGraphs); //toggle boolean state to trigger graphs component reload with new dates
    }


    const testmethod =()=>
    {
      
    };

    useEffect(() => {  // Get data at tab load

       testmethod();

              

    }, [])



    return (
        <Screen>
              <h2 style={{ fontFamily:'Montserrat',color:'rgb(35,168,224)' }} >Weekly Pick dashboard</h2>
            <div className={classesGrid.root}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241, 242, 242)' }}>
                            <CardContent style={{ paddingBottom: '2px', paddingTop: '2px', textAlign: 'center' }}>
                                <Typography className={classesCards.title} color="textSecondary" gutterBottom>
                                    <div>
                                        


                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                           
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="dd/MM/yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="From Date"
                                                value={fromDate}
                                                onChange={handleFromDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                style={{paddingRight:'1em' , color:"black" ,fontWeight:'bold', fontFamily:'Montserrat'}}
                                            />
                                        </MuiPickersUtilsProvider>

                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                animateYearScrolling={true}
                                                format="dd/MM/yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="To Date"
                                                value={toDate}
                                                
                                                InputProps={{ className: classesGrid.date }}
                                                onChange={handleToDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                style={{paddingRight:'1em' , color:'black', fontWeight:'bold', fontFamily:'Montserrat'}}
                                            />
                                        </MuiPickersUtilsProvider>

                                        <Button
                                            variant="contained"
                                            
                                            
                                            size="small"
                                            style={{ marginLeft: '40px', marginTop: '26px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                                            onClick={(e) => onFetchButtonClick(e)}
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                    <Card  style={{  backgroundColor: 'rgb(241,242,242)'  }}className={classesCards.root} >
                        <CardContent>
                        <Pickproductivity
                         startDate ={fromDate}
                         endDate={toDate}
                         loadGraphs={loadGraphs} >

                       </Pickproductivity>
                       

                        </CardContent>
                      
                    </Card>
                </Grid>

                <Grid item xs={4}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <Pickproductivitytrainee
                         startDate ={fromDate}
                         endDate={toDate}
                         loadGraphs={loadGraphs} >

                       </Pickproductivitytrainee>

                        </CardContent>
                        
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <PickProdDC
                         startDate ={fromDate}
                         endDate={toDate}
                         loadGraphs={loadGraphs} >

                       </PickProdDC>

                        </CardContent>
                        
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <PickCasesExp
                         startDate ={fromDate}
                         endDate={toDate}
                         loadGraphs={loadGraphs} >

                       </PickCasesExp>

                        </CardContent>
                        
                    </Card>
                </Grid><Grid item xs={4}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <PickcasesTrainee
                         startDate ={fromDate}
                         endDate={toDate}
                         loadGraphs={loadGraphs} >

                       </PickcasesTrainee>

                        </CardContent>
                        
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <PickcasesDC
                         startDate ={fromDate}
                         endDate={toDate}
                         loadGraphs={loadGraphs} >

                       </PickcasesDC>

                        </CardContent>
                        
                    </Card>
                </Grid>

                <Grid item xs={8}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <PickCasesAll
                         startDate ={fromDate}
                         endDate={toDate}
                         loadGraphs={loadGraphs} >

                       </PickCasesAll>

                        </CardContent>
                        
                    </Card>
                </Grid>

                <Grid item xs={4}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <ReworksDC
                         startDate ={fromDate}
                         endDate={toDate}
                         loadGraphs={loadGraphs} >

                       </ReworksDC>

                        </CardContent>
                        
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                       <PickAccuracy
                         startDate ={fromDate}
                         endDate={toDate}
                         loadGraphs={loadGraphs} >

                       </PickAccuracy>

                        </CardContent>
                        
                    </Card>
                </Grid>


                </Grid>
            </div>
        </Screen>
    );
}
export default UserHistory
