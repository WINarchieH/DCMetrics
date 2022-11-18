
import React, { useState, useEffect } from 'react';

import {  Container } from '@material-ui/core';
import FormHelperText from '@mui/material/FormHelperText';

import { useSelector } from 'react-redux';
// import SettingsPassword from '../components/settings/SettingsPassword';

import api from '../../../components/api/api';


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

const FirstTab = () => {

  const user = useSelector(store => store.user);


  const [values, setValues] = useState({
    groupName: '',
   
  });

  const [checked, setChecked] = useState([]);
  const [userGroup, setUserGroup] = useState('');
  var screenlist = [];
  //const [updatedList, setupdatedList] = useState([]);



  const handleChange = (event) => {
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
  


  const createUserGroup = async (event) =>
  { 

     if ((!((/^[a-zA-Z\s]*$/).test(userGroup.trimStart().trimEnd()))) && (userGroup.trimStart().trimEnd().length < 1))
    {
      alert ("Please enter valid user group");
      return;
    }
     getAllcheckedScreen();

      if (screenlist.length <=0)
      {
       alert ("No Screens selected for the new group");
       return;

      }



    let body = new URLSearchParams({
      'GroupName': userGroup,
      'ScreenName': screenlist
     });

   await api.post('/Maintenance/UserGroupManagement/CreateNewUserGroup', body).then(
      res => {
          let data = res.data;  

          if (data)
          {
            alert ("UserGroup Created");
            

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
    




}, [user]);

  return( 
  
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '150%',
        minWidth: '100%',
        py: 3
      }}
    >
      <Container maxWidth="lg">
      <form>
      <Card style = {{ backgroundColor :'rgb(241,242,242)'}}>
    
      <CardContent>
        <Grid
          container
          spacing={6}
          wrap="wrap"
        >
          <Grid
            item
            md={12}
            sm={12}
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
            xs={12}
          >
            <Typography>
            <FormHelperText style ={{  fontWeight:'bold',   fontFamily:'Montserrat' }}>Please Enter new group name</FormHelperText>
            <TextField style={{ fontFamily :''}}
            fullWidth
            inputProps={{ pattern: "[a-z]" }}
            
            required
            onChange={handleChange}
            type="text"
            value={userGroup}
            variant="outlined"
            re
          />
     
          </Typography>
          </Grid>
          </Grid>
      </CardContent>
        </Card>
      </form>
        <Box sx={{ pt: 3 }}>
        <form   >
      <Card style = {{ backgroundColor :'rgb(241,242,242)'}}>
      <CardHeader style ={{   fontFamily: "Montserrat",color:'rgb(35,168,224)'}} />
     
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
          <Button  onClick = {createUserGroup} color="primary" variant="contained" style={{color:'white',backgroundColor:'rgb(35,168,224)' }}> SAVE  </Button>
        </Box>
      </Card>
    </form>
    
        </Box>
      </Container>
    </Box>
   
  
);
      }


  
export default FirstTab;
