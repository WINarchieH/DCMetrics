import React, {useState, useEffect} from 'react';
import Logo from '../../../images/enter.png';
import { useSelector } from 'react-redux';
import {Link}  from "react-router-dom";
import Screen from '../../../components/screen/screen';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import './homeScreen.scss';
import Chart from "react-apexcharts";
import ReactApexCharts from 'apexcharts';
import {inputToDate, dateToInput, dateToDateObj, dateObjToDate,dateObjToInput, TestdateObjToInput,formatDate} from '../../../components/fields/dateHelpers';
import api from '../../../components/api/api';

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import {store} from 'react-notifications-component'
import homescreenimage from '../../../images/homescreenimage.png'



const Home = () => {
  
  const navbarData = useSelector(store => store.navbar);
  const user = useSelector(store => store.user);

  const ShowNotification = ()=>
 {
  
};
 useEffect(() => { // Updates Modal title and button name
       
     
 }, []);
     
  return (
    
    <Screen>  
      
    <ReactNotification></ReactNotification>


    <div className="welcomecard" >

       <div className='welcomecardtext'> 
        <table>
          <tr>
            <td style= {{  marginLeft:'120%'}} >
            <h1> Welcome Back, {user}</h1> 
            </td>
            <td>
            <img style= {{  marginLeft:'130%' , alignContent: 'center' }} width={300} height ={230} src={homescreenimage}/>
            </td>
          </tr>
        </table>
     

        
       </div>
     
  </div>


      <div className='dashboard-container'>
     


        { navbarData ? 
          Object.keys(navbarData).map(headerTitle => {
           
           
            let headerSection = navbarData[headerTitle];
            if (headerSection.length > 0)
            {
             
            return (
              
              
              <div key={headerTitle+'Section'}  style ={{  backgroundColor:' rgb(241,242,242)' , padding:'20px', borderRadius:'5px' }} className='links-card'> 
                 
                <div key={headerTitle+'Title'} style={{ fontfamily:'Montserrat', color:'rgb(35,168,224)'}} className='links-title'>
                { headerTitle }
                </div>
                { headerSection.filter(row => row.Header === 'Y').map(
                  x => {
                  return (
                   
                    <div key={x.Name+'item'} className='links-item'>
                      <li>
                      <Link className='link--remove-style' key={x.Name} to={x.URL}>{x.Name}</Link>
                      </li>
                      
                    </div>
                    
  
                    
                  );
                }) }
              </div>)
            };
          })
        : null }



      </div>
      
    </Screen>
  )
}

export default Home;