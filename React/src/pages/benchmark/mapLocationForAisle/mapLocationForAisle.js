import React, { useState ,useEffect} from 'react';
import Screen from '../../../components/screen/screen';
import api from '../../../components/api/api';
import { useSelector } from 'react-redux';
import './mapLocationForAisle.scss';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';

import { blue } from '@material-ui/core/colors';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import DropDown from '../../../components/fields/dropdown';
import TextField from '../../../components/fields/textfield';
import { useInputState } from '../../../components/hooks/hooks';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 550,
    },
  },
};

const defaultInput = {
  'StartPosition': '',
  'Length': ''

};



const Maplocation = () => {

  const [dropdownData, setDropdownData] = useState({
    'Format': ['PDF', 'Excel Worksheet', 'CSV'],
    'reports':['']
  });
  
   const user = useSelector(store => store.user);
 





  const useStyles = makeStyles((theme) => ({
    root: {
      height: 500,
      width: 600,
      maxWidth: 800,
      background: 'rgb(241,242,242)',
      alignContent: 'center',
      marginLeft: 500,
      fontFamily:"10px"
    },
  
  
    textField: {
      width: "55ch",
      fontFamily: "Montserrat",
      fontSize: "small",
      display: "flex",
      flex: "column",
      margin: theme.spacing(1)
    },
    label:{
      color:"rgb(129,129,129)",
      fontWeight:"strong",
      fontFamily: "Montserrat"
    },
    title:{

      alignContent: 'center',
      marginLeft: 500,
      fontFamily: "Montserrat",
      color:'rgb(35,168,224)',
    

    }
  
  }));

  const classes = useStyles();

  const [startposition,setstartposition]  = React.useState('');
  const[length,setlength] = React.useState('')
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState(null);
  
  const ErrorMessage = (props) => {
    return (
      <div className="login-form-item error-message" >
        {props.msg}
      </div>
    );
  };

  const onError = (msg) => {
    setError(<ErrorMessage msg={msg}></ErrorMessage>);
  }

  const onSubmit=(event)=>
  {
  event.preventDefault();

      let body = new URLSearchParams({
  
       'StartPosition':startposition,
       'Length':length,
      })
      
      api.post('/Benchmark/MapLocation/InsertRecord', body).then(
        res => {
        
          let data = res.data;
          if (data === 'Record Created') {
          
            window.alert("Record Created");
          }
          else {
           setError(data);
          }
      
  
        }).catch(
        
          err => {
            if (err.response) { // Server responded with error - web service issue
              setError(err.response);
           
            }
            else {
  
            }
          }
        )
    
      };


  useEffect(() => {



    api.post('/Benchmark/MapLocation/SearchRecord').then( // Reasons Codes List 
      res => {
          let data = res.data;
        
 setstartposition(data[0].StartPosition);
 setlength(data[0].Length);
      });

}, []);


  return (
    <Screen >

      <h2 className={classes.title}>MAP LOCATION FOR AISLE</h2>
      <Card className={classes.root}>
       
        <CardContent>
         
            
            <form onSubmit={onSubmit}>
              <FormControl>
              <div className='login-form-item--mui'>
            <TextField required
            type="number"
            min="1" step="1"
          label="Start Position"
          id="outlined-start-adornment"
          className={classes.textField}
          value={startposition}
          onChange={e => setstartposition(e.target.value)}
          InputProps={{
          }}
          variant="outlined"
        />
 
      </div>
      </FormControl>
<br></br>
      <FormControl>
              <div className='login-form-item--mui'>
            <TextField required
            type="number"
          label="Length"
          min="0" step="1"
          id="outlined-start-adornment"
          className={classes.textField}
          value={length}
          onChange={e => setlength(e.target.value)}
          InputProps={{
          }}
          variant="outlined"
        />
 
      </div>
      </FormControl>
<br>
</br>
<br></br>
<FormControl>
      <label className={classes.label}> E.g. If Location = AB010203 Then Aisle = AB01 </label>
      </FormControl>
                
  

            <br></br>
            <br></br>

            <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    style={{ marginLeft: '10px', marginTop: '26px',color:'white',backgroundColor:'rgb(35,168,224)' }}
                                    
                                >
                                    Update
                                </Button>

              </form>
            
            <br></br>
            {error}
        
        </CardContent>
      </Card>
    </Screen>
  )
}

export default Maplocation;