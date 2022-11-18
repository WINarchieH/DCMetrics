
import React, { useState, useEffect } from 'react';

import {  Container } from '@material-ui/core';

import { useSelector } from 'react-redux';
// import SettingsPassword from '../components/settings/SettingsPassword';

import api from '../../../components/api/api';

import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import FormHelperText from '@mui/material/FormHelperText';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
  TextField
} from '@material-ui/core';

const SecondTab = () => {
  
  const user = useSelector(store => store.user);
 

  const [values, setValues] = useState({
    groupName: '',
   
  });

  const [checked, setChecked] = useState([]);
  const [names, setnames] = useState([]);
  const [Screen, setScreens] = useState([]);
  const [userGroup, setUserGroup] = useState('');

  var screenlist= [];

    const handleHeaderTitleCheck = (event) => 
    {
    
      Object.keys(navbarData).map(headerTitle => {
               
               if (headerTitle === event.target.value)
               {
                let headerSection = navbarData[headerTitle];
                if (headerSection.length > 0)
                {
                 
                
                for(var i =0 ; i < headerSection.length ; i++)
                {
                   if (headerSection[i].Header === 'Y')
                   {
      
             
                
                  document.getElementById(headerSection[i].Name).checked = event.target.checked;
            
                  
                }
               }
              }

               
       
        
      }
    });
    }



    const handleChange = (event) => {
     
      let body = new URLSearchParams({
        'UserGroup':event.target.value
      });


      api.post('/Maintenance/Pickers/GetAllUserGroupScreens',body).then(
        res => {
            let data = res.data; 
         
            
              Object.keys(navbarData).map(headerTitle => {
               
           
                let headerSection = navbarData[headerTitle];
              
                if (headerSection.length > 0)
                {
                  document.getElementById(headerTitle).checked = false;
                  for(var i =0 ; i < headerSection.length ; i++)
                  {
                     if (headerSection[i].Header === 'Y')
                     {

                    document.getElementById(headerSection[i].Name).checked = false;
                  }
                }
                }
              })

                      
            if (data)
            {
           
              for (var i =0 ; i <data.length;i++ )
              {
            
             
                document.getElementById(data[i]).checked = true;
     

              }
             
            }

          
        }).catch(
            err => {
                // TODO: Error handling
                if (err.response) { 
                    console.log(err.response)
                }
                else {
                }
            }
        );
     
     
      setUserGroup(event.target.value);

    };
  

 
const getAllcheckedScreen=()=>
{
  Object.keys(navbarData).map(headerTitle => {
               
            
    let headerSection = navbarData[headerTitle];
    if (headerSection.length > 0)
    {
      for(var i =0 ; i < headerSection.length ; i++)
      {
       
         if ((headerSection[i].Header === 'Y') &&( document.getElementById(headerSection[i].Name).checked == true))
         {

          screenlist.push(headerSection[i].Name);
            }
    }
}
  });
}

  const updateUserGroup = async (event) =>
  {

 
     if ( userGroup.length < 1)

     {
      alert("Please select a User Group");
      return;
     }

    
     

     getAllcheckedScreen();
  
     if (screenlist.length <= 0)
     {
    
      alert ("No Screens are selected for the selected group");
          return;
        
      }
          let body = new URLSearchParams({
            'UserGroup': userGroup,
            'ScreenName': screenlist,
            
        });
      
         await api.post('/Maintenance/Pickers/UpdateUserGroup', body).then(
            res => {
                let data = res.data;  
      
                if (data ==="User group updated")
                {
                   alert ("UserGroup "+ userGroup+ " updated");
                }
                else
                {
                  alert(data);
                }
              
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) { 
                        console.log(err.response)
                    }
                    else {
                    }
                }
            );

        

     
  
  }

    const navbarData = useSelector(store => store.navbar);


    const handleCheck = (event) => {

      
        var updatedList = [...checked];
       
        if (event.target.checked) {
          updatedList = [...checked, event.target.value];
        } else {
          updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        setChecked(updatedList);
      };


 
useEffect(() => { // Get table and Dropdown Data


  //Get All user Groups api call
  api.post('/Maintenance/Pickers/GetAllUserGroups').then(
    res => {
        let data = res.data;  

        if (data)
        {
         
           setnames(data);
        }
      
    }).catch(
        err => {
            // TODO: Error handling
            if (err.response) { 
                console.log(err.response)
            }
            else {
            }
        }
    );

    //Get All DCMUsers api call
 



}, [user]);

  return( 
  
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '300%',
        minWidth: '100%',
        fontFamily:'Montserrat',
        py: 3
      }}
    >
      <Container Width="lg">
    
      <Card style = {{ backgroundColor :'rgb(241,242,242)'}}>
    
      <CardContent>
            
             
              <FormHelperText style ={{  fontWeight:'bold',   fontFamily:'Montserrat' }}>Select the required User Group</FormHelperText>
            
        
        <Select required fullWidth value={userGroup} onChange={handleChange}>
  
          {names.map((name) => (
            <MenuItem style ={{    fontFamily:'Montserrat' }} value={name}>{name}
            </MenuItem>
          ))}
        </Select>
      
  
        <br></br>

      
   
  

      </CardContent>
        </Card>
     
        <Box sx={{ pt: 3 }}>
        <form   >
      <Card style = {{ fontFamily: "Montserrat", backgroundColor :'rgb(241,242,242)'}}>

          <CardContent>

          <div className='dashboard-container'>
    
    { navbarData ? 
      Object.keys(navbarData).map(headerTitle => {
       
       
        let headerSection = navbarData[headerTitle];
        if (headerSection.length > 0)
        {
         
        return (
          
          
          <div key={headerTitle+'Section'}  style ={{  backgroundColor:' rgb(241,242,242)' , padding:'20px', borderRadius:'5px' }} className='links-card'> 
             
            <div key={headerTitle+'Title'} style={{ fontfamily:'Montserrat', color:'rgb(35,168,224)'}} className='links-title'>
            <input id={headerTitle} value={headerTitle} type="checkbox" onChange={handleHeaderTitleCheck} />
                    <span>{headerTitle}</span>
                
            </div>
            { headerSection.filter(row => row.Header === 'Y').map(
              x => {
              return (
               
                <div key={x.Name+'item'} className='links-item'>
                  
                    <input id={x.Name} value={x.Name} type="checkbox" onChange={handleCheck} />
                    <span>{x.Name}</span>
                
                  
                </div>
                

                
              );
            }) }
          </div>)
        };
      })
    : null }



  </div>
  


         </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button  onClick={updateUserGroup}  color="primary" variant="contained" style={{color:'white',backgroundColor:'rgb(35,168,224)' }}> SAVE  </Button>
        </Box>
      </Card>
    </form>
    
        </Box>
      </Container>
    </Box>
   
  
);
      }

export default SecondTab;
