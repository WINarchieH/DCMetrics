import React, {useState, useEffect} from 'react';
import Logo from '../../../images/enter.png';
import { useSelector } from 'react-redux';
import {Link}  from "react-router-dom";
import Screen from '../../../components/screen/screen';
import header from '../../../components/header/header';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import './homeScreen.scss';
import Chart from "react-apexcharts";
import ReactApexCharts from 'apexcharts';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../components/fields/dateHelpers';
import api from '../../../components/api/api';

// Card Settings
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import { Droppable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Helmet } from 'react-helmet';

import ProductivityPickGraph from './ProductivityPickandPutaway';
import CycleCountGraph from './CycleCountGraph';
import LostTimeGraph from './LostTime';
import ShippingQuantity from './ShippingQuantity';
import TaskTime from './TaskTime'; 

import {
  Box,
  Container,
  Grid
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(200),
      height: theme.spacing(100),
    },
  },
}));


const Home = () => {

      const navbarData = useSelector(store => store.navbar);
      const classes = useStyles();
      const sites = useSelector(store => store.sites);
      const currentSite = useSelector(store => store.site);
      useEffect(() => { // Updates Modal title and button name
       
       
    }, []);

      if (currentSite)
  
     
      {  return (
    <Screen>
       <header></header>
      
       <Helmet>
      <title>Dashboard</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Grid >
           <ProductivityPickGraph props={currentSite}></ProductivityPickGraph>
          <br></br>
           <LostTimeGraph props={currentSite}></LostTimeGraph>
           <br></br>
           <TaskTime props={currentSite}></TaskTime>
           <br></br>
          <CycleCountGraph props={currentSite}></CycleCountGraph>
          <br></br>
         
         <Container  maxWidth={false} spacing = {3}>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <ShippingQuantity props={currentSite}/>
          
          </Grid>
          <Grid
               item
               lg={4}
               md={6}
               xl={3}
               xs={12}
             
          >
            
          </Grid>
          </Container>
        </Grid>
      </Container>
    </Box>

     
      
    </Screen>
  )
    }
    else
    {
      return(
      <Screen>
        <header></header>
      
      
      </Screen>
      );
    }
}

export default Home;