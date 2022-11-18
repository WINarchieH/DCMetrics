import React, { useState ,useEffect} from 'react';
import Screen from '../../../components/screen/screen';
import api from '../../../components/api/api';
import { useSelector } from 'react-redux';
import './tableMatrix.scss';

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
  'Activity': '',
  'Zone': ''

};


const dropdownData = {
    'ActivityName': [''],
    'Zone': [],
};


const ProductHandling = () => {

    const [input, setInput, , handleInputEvent] = useInputState(defaultInput);
   const user = useSelector(store => store.user);
 





  const useStyles = makeStyles((theme) => ({
    root: {
      height: '100ch',
      width: '180ch',
     // maxWidth: '110ch',
      background: '#E8E8E8',
      alignContent: 'center',
      marginLeft: '10ch',
      fontFamily:"10px",
  //    overflow: "auto",
    },
  
  
    textField: {
      width: "55ch",
      fontfamily: "calibri",
      fontSize: "small",
      display: "flex",
      flex: "column",
      margin: theme.spacing(1)
    },
    label:{
      color:"blue",
      fontWeight:"strong",
      fontfamily: "calibri"
    },
    title:{
    fontSize:"20px",
      fontWeight:"strong",
      fontfamily:"calibri",
      alignContent: 'center'
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
          if (data === 'Record Updated') {
          
            window.alert("Record Updated");
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



   // Retrieve Dropdown Data
   api.post('/Maintenance/Pickers/GetAllActivities').then( // Team Manager List
    res => {
        let data = res.data;    
        dropdownData['ActivityName'] = data.map(x => x['ActivityName']);
    });
api.post('/Maintenance/Pickers/GetAllZone').then( // Agencies List
    res => {
        let data = res.data;
       
        dropdownData['Zone'] = data.map(x => x['ZoneNumber']);      
        
    });
}, []);


  return (
    <Screen >
      <Card className={classes.root}>
        <CardContent>
            <h4 className={classes.title}>Product Handling Matrix</h4>   
            <form onSubmit={onSubmit}>
    <FormControl>
    <DropDown name='Activity' label='Activity' options={dropdownData['ActivityName']}  defaultValue={input.Activity} onChange={handleInputEvent} required></DropDown>  
    <DropDown name='Zone' label='Zone' options={dropdownData['Zone']}  defaultValue={input.Zone} onChange={handleInputEvent} required></DropDown>
      </FormControl>
      <br></br>
      <FormControl>
      <DropDown name='Zone' label='Zone' options={dropdownData['Zone']}  defaultValue={input.Zone} onChange={handleInputEvent} required></DropDown>
      </FormControl>

<br></br>
      <FormControl>
              <div className='login-form-item--mui'>
          
      </div>
      </FormControl>
<br>
</br>



              </form>
            
            <br></br>
            {error}
        
        </CardContent>
      </Card>
    </Screen>
  )
}

export default ProductHandling;