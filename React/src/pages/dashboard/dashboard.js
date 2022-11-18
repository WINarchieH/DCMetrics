import React, {useState, useEffect} from 'react';
import Logo from '../../images/enter.png';
import { useSelector } from 'react-redux';
import {Link}  from "react-router-dom";
import Screen from '../../components/screen/screen';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import './dashboard.scss';
import { useHistory } from "react-router-dom";
import api from '../../components/api/api';



// Card Settings
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import { Droppable } from 'react-beautiful-dnd';
import DropDown from '../../components/fields/dropdown';






const Home = () => {
  



      const navbarData = useSelector(store => store.navbar);
      const currentSite = useSelector(store => store.site);
      const history = useHistory();

  
  

     

  return (
    <Screen>
    <div className='dashboard-container'>

      { navbarData ? 
        Object.keys(navbarData).map(headerTitle => {
          let headerSection = navbarData[headerTitle];
          if (currentSite)
          {
            let body = new URLSearchParams({
              'Site':currentSite
            });    
            
            api.post('/HomeScreen/HomeScreenProductivity/GetHomeScreenRoute',body).then(
              res => 
              {
                  
                let resdata = res.data;
                 history.push(res.data.route)
   
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
          else
          {
          };
        })
      : null }
      </div>
      </Screen>



  )
}

export default Home;