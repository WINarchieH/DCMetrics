import React, { useState ,useEffect} from 'react';
import Screen from '../../../components/screen/screen';
import api from '../../../components/api/api';
import { useSelector } from 'react-redux';
import './emailSubscription.scss';
import '../../../assets/panel.scss';

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
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import DropDown from '../../../components/fields/dropdown';
import TextField from '../../../components/fields/textfield';
import { useInputState,usePrevious } from '../../../components/hooks/hooks';
//accordian

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography';

//Model
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import AccordionActions from '@material-ui/core/AccordionActions';
//Table
import Table from '../../../components/table/table';
import TableScreen from '../../../components/screen/tableScreen';

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
  'PreferredTime': '',

};

const tableColumns = [
  {Header: 'Serial ID', accessor: 'SerialID', filter: 'text'}, 
  {Header: 'Report', accessor: 'ReportName',  filter: 'text', modalType: 'textbox'}, 
  {Header: 'Email', accessor: 'Email',  filter: 'text', modalType: 'textbox'},
  {Header: 'Scheduled Time', accessor: 'ScheduledTime', filter: 'text', modalType: 'textbox'},
  {Header: 'Format', accessor: 'Format', filter: 'text', modalType: 'textbox'}
  
];

const EmailSubscription = () => {

  const [dropdownData, setDropdownData] = useState({
   
    'reports':['']
  });

   const user = useSelector(store => store.user);
 

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 1200,
      background: 'whitesmoke',
      alignContent: 'center',
      marginLeft:"13%"
    },
    heading: {
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily:'Montserrat',
    },
    formControl: {
      margin: theme.spacing(2),
      minWidth: 500,
      maxWidth: 600,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    formclass:
    {
      marginLeft: 20,
    },
    margin: {
      margin: theme.spacing(1),
      alignItems: "center",
    },
    avatar: {
      backgroundColor: blue[300],
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0, 0.4)',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[3],
      padding: theme.spacing(1, 20, 20),
    },
  Accordion: {
    backgroundColor: 'rgb(241,242,242)',
    color: "black"
  },
  AccordionDetails: {
    backgroundColor: 'white'
  },
  AccordionDetails2: {
    backgroundColor: "white",
    color: "white",
    height: 700
  },
  table:{
    display: "flex",
    flexdirection: "row",
    alignitems: "center",
    width: "100%",
    height:"105%"
  }
  }));

  const classes = useStyles();

  const [report, setReportName] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState(null);
  const [input, setInput,, handleInputEvent] = useInputState(defaultInput);
  const [items, setItems] = React.useState([]);
  const [email,setEmail] = useState('');
  const [format,setformat] = useState(null);
  const [time,settime] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const editTableHandler = (data) => {
    setShowModal(true); 
    setModalMode(2);
    setInput(data);
    setModalMessage('');
    setModalMessageError('');
}
  //tableModal
  const [tableData, setTableData] = useState([]);

  // Parameters for modal
  const [modalMode, setModalMode] = useState(1);
  const [modalTitle, setModalTitle] = useState('Add New Payroll Rule');
  const [modalButtonName, setModalButtonName] = useState('Add');
  const [showModal, setShowModal] = useState(false);
  const [loadModal, setLoadModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalMessageError, setModalMessageError] = useState('');
  


  
  const [expanded, setExpanded] = React.useState(false);

  const handleAccordianChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const GetAllSubscription = async () => {
    setTableLoading(true);

input.DCMUser = user;
    let body = new URLSearchParams({
        'DCMUserName':input.DCMUser
    });
    await api.post('/Maintenance/Email/GetAllSubscription',body).then(
        res => {
            let data = res.data;  
            setTableData(data);  
            setTableLoading(false);
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
};


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

  const handleChange = (event) => {
    setError('');
    setReportName(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const OnProceedClick = (event) => {
    if (report.length > 0 ) {
      handleOpen();
    }
    else {
      onError('Please Select Report First');
    }
  };

  // const handleChangeMultiple = (event) => {
  //   const { options } = event.target;
  //   const value = [];
  //   for (let i = 0, l = options.length; i < l; i += 1) {
  //     if (options[i].selected) {
  //       value.push(options[i].value);
  //     }
  //   }
  //   setReportName(value);
  // };

  useEffect(() => {

let body = new URLSearchParams({
  Username:user,
});

    api.post('/Maintenance/Pickers/GetReportsList',body).then( // Reasons Codes List 
      res => {
          let data = res.data;
          dropdownData['reports'] = data.map(x => x.FormObject);
          setItems(data.map(x => x.FormObject));
     
      });
    

}, [user]);
useEffect(() => {
 
 
 input.DCMUserName = user;
  GetAllSubscription();
  // Retrieve Dropdown Data
  // api.get('/Maintenance/UserInfo/GetAllShiftCodes').then( // Shit Codes List 
  //     res => {
  //         let data = res.data;
  //         dropdownData['Shift Code'] = data.map(x => x['shiftcode']);
  //     });     
        
}, [user]);


const changeFormat=(event)=>
{

  setformat(event.target.value);
}

const changeTime=(event)=>
{

  settime(event.target.value);
}


const onformSubmit =(event) =>
{
  event.preventDefault();
}

const SaveSelection = (event) =>
{
  event.preventDefault();

   if (format === null)
   {
     setError("Please select a report Format");
     return;
   }

   if (time === null)
   {
     setError("Please select a Preferred Time");
     return;
   }

  let body = new URLSearchParams({

    'ScheduledTime':time,
    'DCMUserName':user,
    'ReportName':report,
    'Format':format ,
    'EmailAddress':email,
   
  })
  
  api.post('/Maintenance/Email/InsertNewSubscription', body).then(
    res => {
    
      let data = res.data;
      if (data === 'Report Subscription Created')
       {
      setError('');
       window.alert("Selected Subscriptions Saved");
       window.location.reload();
      }
      else 
      {
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

  const deleteHandler = async (rowData) => {
    // Delete row from table
    let body = new URLSearchParams({ 
        'SerialID':rowData.SerialID,
        'DCMUserName':input.DCMUser
    });
    await api.post('Maintenance/Email/UpdateSubscription', body).then( 
        res => {
           
            let tdata = tableData.slice();
           if (res.data === "Subscription Updated")
           {
            let index = tdata.indexOf(rowData);
            tdata.splice(index, 1);
           }
           else
           {
               window.alert(res.data);
           }
           setTableData(tdata); 
        }
    ).catch(
        err => { // TODO: Error handling
            window.alert(err);
        }
    );
};

  
const option = ['PDF', 'Excel Worksheet']

  return (
    <Screen >
      <Card className={classes.root}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')}>
          <AccordionSummary
            className={classes.Accordion}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <Typography className={classes.heading}>Add Email Subscription</Typography>
          </AccordionSummary>
          <form>
            <AccordionDetails className={classes.AccordionDetails}>
            <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Select Report</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              multiple
              value={report}
              onChange={handleChange}
              input={<Input />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {dropdownData['reports'].map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={report.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <Button variant="contained" color="primary" onClick={OnProceedClick}style={{color:'white',backgroundColor:'rgb(35,168,224)' }}>
              Proceed
              </Button>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <div className={classes.paper}>
                  <h2 id="transition-modal-title">Please Fill Below Fields</h2>
                  <form onSubmit={SaveSelection}>
                  <TextField name='Email' label='Preferred Email' value={email} onChange={e=>setEmail(e.target.value.trim())} type="email"  required></TextField>
  
                    <div className='modal-item'>
                    <label className='label label--position' >Preferred Time</label>
                    <select className='modal-fields modal-fields--outline' value ={time} onChange={changeTime} required>
                    <option  default selected disabled>Select Time</option>
                      <option value="06:00">06:00 AM</option>
                      <option value="07:00">07:00 AM</option>
                     <option   value="08:00">08:00 AM</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                     <option   value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                     <option   value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                     <option   value="17:00">05:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                      <option value="19:00">07:00 PM</option>
                     <option   value="20:00">08:00 PM</option>
                      <option value="21:00">09:00 PM</option>
                      <option value="22:00">10:00 PM</option>
                     <option   value="23:00">11:00 PM</option>
             </select>
             </div>

                    <div className='modal-item'>
                    <label className='label label--position' >Report Format</label>
                    <select className='modal-fields modal-fields--outline' value ={format} onChange={changeFormat} required>
                    <option selected disabled>Select Report Format</option>
                      <option value="xlsx">Excel Worksheet</option>
                     <option   value="pdf">PDF</option>
                    
           
             </select>
           
           
           </div>         <br></br>
                    <button type="submit" className='modal-button modal-button--styling hover-cursor'>Save</button>
                  </form>
                  <br></br>
                  {error}
                </div>
              </Fade>
            </Modal>
            <br></br>
            {error}
          </FormControl>
            </AccordionDetails>
           
          </form>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianChange('panel2')}>
          <AccordionSummary
            className={classes.Accordion}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <Typography className={classes.heading}>Delete Email Subscription</Typography>
          </AccordionSummary>
          <form>
            <AccordionDetails className={classes.AccordionDetails2}>
               
            <div>
                <div className={classes.table}>
                    <div className='panel panel--table'>
                    <Table data={tableData} tableColumns={tableColumns}  isLoading={tableLoading}
                           deleteHandler ={deleteHandler} ></Table>
                    </div>
                </div>
            </div>

           
            </AccordionDetails>
          </form>
        </Accordion>
        
      </Card>
    </Screen>
  )
}

export default EmailSubscription; 