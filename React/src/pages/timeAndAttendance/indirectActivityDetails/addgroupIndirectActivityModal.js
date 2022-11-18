import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import TextField from '../../../components/fields/textfield';
import {formatDate, inputToDate, dateToInput,dateObjToInput, dateToDateObj, dateObjToDate, inputToDateObj, checkValidInput, isStartDateTimeSmallerThanEndDateTime} from '../../../components/fields/dateHelpers';
import DropDown from '../../../components/fields/dropdown';
import {useInputState, usePrevious} from '../../../components/hooks/hooks';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import TextareaAutosize from 'react-autosize-textarea';

import api from '../../../components/api/api';
import CloseIcon from '@material-ui/icons/Close';
import './addgroupindirectActivityModal.scss';


const defaultInput = {
    
    'UserName': '',
    'TaskName': '',
    'StartDate': '',
    'StartTime': '',
    'EndDate': '',
    'EndTime': '',
    'Site': '',
    'Notes':''
};

// Contains hardcoded dropdown data - Retrieve rest from db in component
const dropdownData = {
    'Task Name': [],
    'UserList':[],
    'LoggedUsers':[]
};

const ITEM_HEIGHT = 80;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



const today = new Date();

const AddgroupactivityModal = (props) => {
    /**
     * Modal component
     * 
     * @param {string} props.title - modal title
     * @param {string} props.buttonName - modal button name
     * @param {boolean} props.unrestrictWidth (optional) - Allows for varied width (defaults false)
     * @param {boolean} props.showModal - External boolean specifying if modal is visible
     * @param {func} props.setShowModal (optional) - Associated setter function with props.showModal
     * @param {func} props.onSubmit - Function to run when modeal form submits
     * @param {boolean} props.loadModal (optional) - Specifies if modal is in 'loading' state
     * @param {element} props.children (optional) - Array of React Elements (eg. Textfields)
     */

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [user, setUser] = useState([]);
    const [activitynotes, setactivitynotes] = useState('');
    defaultInput.StartDate = dateToInput(inputToDate(formatDate(new Date())));
    defaultInput.EndDate = dateObjToInput(today);


    //Accordian Styling
  const useStyles = makeStyles((theme) => ({
    root: {
      width: 1000,
      background: 'whitesmoke',
      alignContent: 'center',
    },
    SelectDropdown: {
      margin: theme.spacing(2),
      minWidth: 300,
      fontFamily: 'calibri',
      color: 'grey'
    },
    heading: {
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: 'calibri',
    },
    formclass:
    {
      marginLeft: 30,
    },
    margin: {
      margin: theme.spacing(1),
      alignItems: "center",
    },
    Accordion: {
      backgroundColor: "#3D5F90",
      color: "white"
    },
    AccordionDetails: {
      backgroundColor: "#f0f8ff",
      
    },
    AccordionDetails2: {
      backgroundColor: "#f0f8ff",
    
      display: "block",
      height: 350
    },
    AccordionDetailsCC: {
      backgroundColor: "#f0f8ff",
    
      display: "block",
      height: 200
    },
    button: {
      margin: theme.spacing(1),
    },
    
    errorblock:{
      color:"red",
      display: "flex",
      flexdirection: "column",
      justifyContent:"center",
      fontSize:"16px"
    },

    successblock:
    {
      color:"green",
      display: "flex",
      flexdirection: "column",
      justifyContent:"center",
      fontSize:"16px"
    }
    
  }));

  const classes = useStyles();

    const startDateHandler = (e) =>
     {  setInputName('StartDate', (e.currentTarget.value));
        
    };

    const MultiSelecthandleChange = (event) => {
        setUser(event.target.value);
      
      };
    
      const handleActivityChange = (event) => {
        setactivitynotes(event.target.value);
      
      };

    const endDateHandler = (e) => { setInputName('EndDate', (e.currentTarget.value))
  

  };


  const addgroupindirectActivity = () => 
  {
    
     let body = new URLSearchParams({
       
      'UserName': user,
      'TaskName':input.TaskName,
      'StartDate': input.StartDate,
      'EndDate': input.EndDate,
      'StartTime':input.StartTime,
      'EndTime': input.EndTime

      
     })

      api.post('/DataCapture/IndirectActivityDetails/AddGroupIndirectTransaction', body).then( // Reasons Codes List 
        res => {
            let data = res.data;
           
        }).catch(() => {});



  };
    const onClose = () => {
        if (props.setShowModal) {
            props.setShowModal(false);
        }
        else {
            setShowModal(false);
        }
     } 

    useEffect(() => {
        setShowModal(props.showModal);
        setIsLoading(props.loadModal);

      //   console.log(input);

        let body = new URLSearchParams({
          StartDate:  inputToDate(formatDate(new Date())),
          EndDate:  inputToDate(formatDate(new Date())),
         
      });

      // api.post('/Maintenance/Pickers/GetAllLoggedUsers').then( // Reasons Codes List 
      //   res => {
      //       let data = res.data;
      //       dropdownData['UserList'] = data.map(x => x);
      //   }).catch(() => {});

        // Retrieve Dropdown Data
        api.get('/DataCapture/IndirectActivityDetails/GetAllTaskNames').then( // IndirectTask Names List 
            res => {
                let data = res.data;
                dropdownData['Task Name'] = data.map(x => x['taskName']);
            });


            // Retrieve Dropdown Data
        api.post('/Maintenance/Pickers/GetAllLoggedUsers',body).then( // IndirectTask Names List 
          res => {
              let data = res.data;
              dropdownData['LoggedUsers'] = data.map(x => x);


              setUser(dropdownData['LoggedUsers']);
          });
            api.post('/Maintenance/Pickers/GetAllUserNames').then( // Reasons Codes List 
                res => {
                    let data = res.data;
                    dropdownData['UserList'] = data.map(x => x);
                }).catch(() => {});
    }, [props]);
    
    return (
        <div>
            <div className={showModal ? 'modal-background' : null} onClick={onClose}></div>
            <div className={showModal ? 'modal-container modal-container--display' : 'modal-container--hide'}>
                <h3 className='modal-title'> Add Group Indirect Activity</h3>
                <form onSubmit= {addgroupindirectActivity} className="modal-form--max-width">
                <div className='modal-grouping--col-2'> 
                <div className='modal-item'>
                                       <label className='label label--position'> Select Employee</label>
                                      <FormControl className={classes.formControl}>
                                     <Select
                                     labelId="demo-mutiple-checkbox-label"
                                   id="demo-mutiple-checkbox"
                                   multiple
                                  value={user}
                           onChange={MultiSelecthandleChange}
                            input={<Input />}
                          renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                      >
                     { dropdownData['UserList'].map((name) => (
                   <MenuItem key={name} value={name}>
                   <Checkbox checked={user.indexOf(name) > -1} />
                   <ListItemText primary={name} />
                  </MenuItem>
                    ))}
                 </Select>
                </FormControl>
                </div>
                <DropDown name='TaskName' label='Task Name' required options={dropdownData['Task Name']} defaultValue={input.TaskName} onChange={handleInputEvent} restrictions='default' ></DropDown> 
                 
                </div>
                <div className='modal-grouping--col-4'>                                                             
                                <TextField name='StartDate' label='Start Date' value={(input.StartDate)} onChange={startDateHandler} required type='date' ></TextField> 
                                <TextField name='StartTime' step="2" label='Start Time' value={input.StartTime} onChange={handleInputEvent} type='time' required ></TextField>          
                                <TextField name='EndDate' label='End Date' value={(input.EndDate)} onChange={endDateHandler} type='date' ></TextField>                                
                                <TextField name='EndTime' step="2" label='End Time' value={input.EndTime} onChange={handleInputEvent} type='time' ></TextField>                                
                            </div>
                            <div className='modal-item'>
                                       <label className='label label--position'> Task Notes</label>
                            <TextareaAutosize value={activitynotes} onChange={handleActivityChange} rows={10} style={{ minHeight: 20, maxHeight: 80 }} />
                            </div>
                    <div className='modal-item modal-item--success'>{props.message}</div>
                    <div className='modal-item modal-item--error'>{props.messageError}</div>
                    
                        <div className='modal-item modal-item--bottom'>
                        {isLoading ?
                        <button className='modal-button modal-button--styling modal-button--load hover-cursor'>Loading</button> :
                        <button className='modal-button modal-button--styling hover-cursor'>Submit</button>
                        }
                    </div> 
                    
                </form>
                <button className='close-button hover-cursor' onClick={onClose}><CloseIcon></CloseIcon></button>
            </div>
        </div>      
    )
};

AddgroupactivityModal.propTypes = {
   
    buttonName: PropTypes.string,
    showModal: PropTypes.bool,
    setShowModal: PropTypes.func,
    onSubmit: PropTypes.func,
    loadModal: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
};

export default AddgroupactivityModal;

