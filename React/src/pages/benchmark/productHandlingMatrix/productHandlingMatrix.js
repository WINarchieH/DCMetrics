import React, {useState, useEffect} from 'react';
import Header from '../../../components/header/header';
import '../../../assets/panel.scss';
import './tableMatrix.scss';
import {useInputState} from '../../../components/hooks/hooks';
import TextField from '@material-ui/core/TextField';
import DropDown from '../../../components/fields/dropdown';
import api from '../../../components/api/api';
import { useSelector } from 'react-redux';
import {searchicon} from '../../../components/icons/gettotal.png';
import { Tooltip, IconButton } from '@material-ui/core';


const defaultInput = {
    
        SmallCube:0, MediumCube:0,LargeCube:0,ExtraLargeCube:0,
        SmallWeight:0, MediumWeight:0, HeavyWeight:0, VeryHeavyWeight:0,
        SmallLightFirstFull:0,SmallLightFirstSplit:0,SmallLightSubsFull:0, SmallLightSubsSplit:0,
        SmallMedFirstFull:0,SmallMedFirstSplit:0, SmallMedSubsFull:0,SmallMedSubsSplit:0,
        SmallHeavyFirstFull:0, SmallHeavyFirstSplit:0,SmallHeavySubsFull:0,SmallHeavySubsSplit:0,
        SmallVHeavyFirstFull:0,SmallVHeavyFirstSplit:0,SmallVHeavySubsFull:0,SmallVHeavySubsSplit:0,
        MedLightFirstFull:0,MedLightFirstSplit:0,MedLightSubsFull:0,MedLightSubsSplit:0,MedMedFirstFull:0,
        MedMedFirstSplit:0,MedMedSubsFull:0,MedMedSubsSplit:0,MedHeavyFirstFull:0,MedHeavyFirstSplit:0,
        MedHeavySubsFull:0,MedHeavySubsSplit:0,MedVHeavyFirstFull:0,MedVHeavyFirstSplit:0,
        MedVHeavySubsFull:0,MedVHeavySubsSplit:0,LargeLightFirstFull:0,LargeLightFirstSplit:0,
        LargeLightSubsFull:0,LargeLightSubsSplit:0,LargeMedFirstFull:0,LargeMedFirstSplit:0,
        LargeMedSubsFull:0,LargeMedSubsSplit:0,LargeHeavyFirstFull:0,LargeHeavyFirstSplit:0,
        LargeHeavySubsFull:0,LargeHeavySubsSplit:0,LargeVHeavyFirstFull:0,LargeVHeavyFirstSplit:0,
        LargeVHeavySubsFull:0,LargeVHeavySubsSplit:0,XLLightFirstFull:0,XLLightFirstSplit:0,
        XLLightSubsFull:0,XLLightSubsSplit:0,XLMedFirstFull:0,XLMedFirstSplit:0,XLMedSubsFull:0,
        XLMedSubsSplit:0,XLHeavyFirstFull:0,XLHeavyFirstSplit:0,XLHeavySubsFull:0,XLHeavySubsSplit:0,
        XLVHeavyFirstFull:0,XLVHeavyFirstSplit:0,XLVHeavySubsFull:0,XLVHeavySubsSplit:0,'Activity':'','Zone':'','DCMUser':''};

const emptyInput = {
    SmallCube:0, MediumCube:0,LargeCube:0,ExtraLargeCube:0,
    SmallWeight:0, MediumWeight:0, HeavyWeight:0, VeryHeavyWeight:0,
    SmallLightFirstFull:0,SmallLightFirstSplit:0,SmallLightSubsFull:0, SmallLightSubsSplit:0,
    SmallMedFirstFull:0,SmallMedFirstSplit:0, SmallMedSubsFull:0,SmallMedSubsSplit:0,
    SmallHeavyFirstFull:0, SmallHeavyFirstSplit:0,SmallHeavySubsFull:0,SmallHeavySubsSplit:0,
    SmallVHeavyFirstFull:0,SmallVHeavyFirstSplit:0,SmallVHeavySubsFull:0,SmallVHeavySubsSplit:0,
    MedLightFirstFull:0,MedLightFirstSplit:0,MedLightSubsFull:0,MedLightSubsSplit:0,MedMedFirstFull:0,
    MedMedFirstSplit:0,MedMedSubsFull:0,MedMedSubsSplit:0,MedHeavyFirstFull:0,MedHeavyFirstSplit:0,
    MedHeavySubsFull:0,MedHeavySubsSplit:0,MedVHeavyFirstFull:0,MedVHeavyFirstSplit:0,
    MedVHeavySubsFull:0,MedVHeavySubsSplit:0,LargeLightFirstFull:0,LargeLightFirstSplit:0,
    LargeLightSubsFull:0,LargeLightSubsSplit:0,LargeMedFirstFull:0,LargeMedFirstSplit:0,
    LargeMedSubsFull:0,LargeMedSubsSplit:0,LargeHeavyFirstFull:0,LargeHeavyFirstSplit:0,
    LargeHeavySubsFull:0,LargeHeavySubsSplit:0,LargeVHeavyFirstFull:0,LargeVHeavyFirstSplit:0,
    LargeVHeavySubsFull:0,LargeVHeavySubsSplit:0,XLLightFirstFull:0,XLLightFirstSplit:0,
    XLLightSubsFull:0,XLLightSubsSplit:0,XLMedFirstFull:0,XLMedFirstSplit:0,XLMedSubsFull:0,
    XLMedSubsSplit:0,XLHeavyFirstFull:0,XLHeavyFirstSplit:0,XLHeavySubsFull:0,XLHeavySubsSplit:0,
    XLVHeavyFirstFull:0,XLVHeavyFirstSplit:0,XLVHeavySubsFull:0,XLVHeavySubsSplit:0};
   

const dropdownData = {
    Zone: [],
    Activity: []
};

const Table = ({input, handleInputEvent}) => {
    const showFieldsInside = true;    

    return (
        <div className='table-container--center'>
            <div className='table-matrix--container'>
                <div className='table-cell--vol-input-1 table-cell--column-pos'>
                    <TextField name='SmallCube' value={input.SmallCube} onChange={handleInputEvent}/>
                </div>
                <div className='table-cell--vol-input-2 table-cell--column-pos'>
                    <TextField name='MediumCube' value={input.MediumCube} onChange={handleInputEvent}/>
                </div>
                <div className='table-cell--vol-input-3 table-cell--column-pos'>
                    <TextField name='LargeCube' value={input.LargeCube} onChange={handleInputEvent}/>
                </div>

                <div className='table-cell--wgt-input-1 table-matrix-cell--padding table-cell--row-pos'>
                    <TextField name='SmallWeight' value={input.SmallWeight} onChange={handleInputEvent}/>
                </div>
                <div className='table-cell--wgt-input-2 table-matrix-cell--padding table-cell--row-pos'>
                    <TextField name='MediumWeight' value={input.MediumWeight} onChange={handleInputEvent}/>  
                </div>
                <div className='table-cell--wgt-input-3 table-matrix-cell--padding table-cell--row-pos'>
                    <TextField name='HeavyWeight' value={input.HeavyWeight} onChange={handleInputEvent}/>
                </div>
                {/* { showFieldsInside ?
                <React.Fragment>
                    <div></div>
                    <div className='table-cell--center'>Small</div>
                    <div></div>
                    <div className='table-cell--center'>Medium</div>
                    <div></div>
                    <div className='table-cell--center'>Large</div>
                    <div></div>
                    <div className='table-cell--center'>Extra Large</div>
                </React.Fragment>
                : null} */}

                <div className='table-matrix-data--container'>                                            
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent} 
                        topLeftName='SmallLightFirstFull' topRightName='SmallLightFirstSplit' bottomLeftName='SmallLightSubsFull' bottomRightName='SmallLightSubsSplit'
                        topLeft={input.SmallLightFirstFull} topRight={input.SmallLightFirstSplit} bottomLeft={input.SmallLightSubsFull} bottomRight={input.SmallLightSubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent}
                        topLeftName='MedLightFirstFull' topRightName='MedLightFirstSplit' bottomLeftName='MedLightSubsFull' bottomRightName='MedLightSubsSplit'
                        topLeft={input.MedLightFirstFull} topRight={input.MedLightFirstSplit} bottomLeft={input.MedLightSubsFull} bottomRight={input.MedLightSubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent} 
                        topLeftName='LargeLightFirstFull' topRightName='LargeLightFirstSplit' bottomLeftName='LargeLightSubsFull' bottomRightName='LargeLightSubsSplit'
                        topLeft={input.LargeLightFirstFull} topRight={input.LargeLightFirstSplit} bottomLeft={input.LargeLightSubsFull} bottomRight={input.LargeLightSubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent}
                        topLeftName='XLLightFirstFull' topRightName='XLLightFirstSplit' bottomLeftName='XLLightSubsFull' bottomRightName='XLLightSubsSplit'
                        topLeft={input.XLLightFirstFull} topRight={input.XLLightFirstSplit} bottomLeft={input.XLLightSubsFull} bottomRight={input.XLLightSubsSplit}></TableCell>


                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent}  setLight={false}
                        topLeftName='SmallMedFirstFull' topRightName='SmallMedFirstSplit' bottomLeftName='SmallMedSubsFull' bottomRightName='SmallMedSubsSplit'
                        topLeft={input.SmallMedFirstFull} topRight={input.SmallMedFirstSplit} bottomLeft={input.SmallMedSubsFull} bottomRight={input.SmallMedSubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent} setLight={false}
                        topLeftName='MedMedFirstFull' topRightName='MedMedFirstSplit' bottomLeftName='MedMedSubsFull' bottomRightName='MedMedSubsSplit'
                        topLeft={input.MedMedFirstFull} topRight={input.MedMedFirstSplit} bottomLeft={input.MedMedSubsFull} bottomRight={input.MedMedSubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent}  setLight={false}
                        topLeftName='LargeMedFirstFull' topRightName='LargeMedFirstSplit' bottomLeftName='LargeMedSubsFull' bottomRightName='LargeMedSubsSplit'
                        topLeft={input.LargeMedFirstFull} topRight={input.LargeMedFirstSplit} bottomLeft={input.LargeMedSubsFull} bottomRight={input.LargeMedSubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent} setLight={false}
                        topLeftName='XLMedFirstFull' topRightName='XLMedFirstSplit' bottomLeftName='XLMedSubsFull' bottomRightName='XLMedSubsSplit'
                        topLeft={input.XLMedFirstFull} topRight={input.XLMedFirstSplit} bottomLeft={input.XLMedSubsFull} bottomRight={input.XLMedSubsSplit}></TableCell>

                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent} 
                        topLeftName='SmallHeavyFirstFull' topRightName='SmallHeavyFirstSplit' bottomLeftName='SmallHeavySubsFull' bottomRightName='SmallHeavySubsSplit'
                        topLeft={input.SmallHeavyFirstFull} topRight={input.SmallHeavyFirstSplit} bottomLeft={input.SmallHeavySubsFull} bottomRight={input.SmallHeavySubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent}
                        topLeftName='MedHeavyFirstFull' topRightName='MedHeavyFirstSplit' bottomLeftName='MedHeavySubsFull' bottomRightName='MedHeavySubsSplit'
                        topLeft={input.MedHeavyFirstFull} topRight={input.MedHeavyFirstSplit} bottomLeft={input.MedHeavySubsFull} bottomRight={input.MedHeavySubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent} 
                        topLeftName='LargeHeavyFirstFull' topRightName='LargeHeavyFirstSplit' bottomLeftName='LargeHeavySubsFull' bottomRightName='LargeHeavySubsSplit'
                        topLeft={input.LargeHeavyFirstFull} topRight={input.LargeHeavyFirstSplit} bottomLeft={input.LargeHeavySubsFull} bottomRight={input.LargeHeavySubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent}
                        topLeftName='XLHeavyFirstFull' topRightName='XLHeavyFirstSplit' bottomLeftName='XLHeavySubsFull' bottomRightName='XLHeavySubsSplit'
                        topLeft={input.XLHeavyFirstFull} topRight={input.XLHeavyFirstSplit} bottomLeft={input.XLHeavySubsFull} bottomRight={input.XLHeavySubsSplit}></TableCell>

                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent}  setLight={false}
                        topLeftName='SmallVHeavyFirstFull' topRightName='SmallVHeavyFirstSplit' bottomLeftName='SmallVHeavySubsFull' bottomRightName='SmallVHeavySubsSplit'
                        topLeft={input.SmallVHeavyFirstFull} topRight={input.SmallVHeavyFirstSplit} bottomLeft={input.SmallVHeavySubsFull} bottomRight={input.SmallVHeavySubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent} setLight={false}
                        topLeftName='MedVHeavyFirstFull' topRightName='MedVHeavyFirstSplit' bottomLeftName='MedVHeavySubsFull' bottomRightName='MedVHeavySubsSplit'
                        topLeft={input.MedVHeavyFirstFull} topRight={input.MedVHeavyFirstSplit} bottomLeft={input.MedVHeavySubsFull} bottomRight={input.MedVHeavySubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent}  setLight={false}
                        topLeftName='LargeVHeavyFirstFull' topRightName='LargeVHeavyFirstSplit' bottomLeftName='LargeVHeavySubsFull' bottomRightName='LargeVHeavySubsSplit'
                        topLeft={input.LargeVHeavyFirstFull} topRight={input.LargeVHeavyFirstSplit} bottomLeft={input.LargeVHeavySubsFull} bottomRight={input.LargeVHeavySubsSplit}></TableCell>
                    <TableCell showFieldNames={showFieldsInside} onChange={handleInputEvent}  setLight={false}
                        topLeftName='XLVHeavyFirstFull' topRightName='XLVHeavyFirstSplit' bottomLeftName='XLVHeavySubsFull' bottomRightName='XLVHeavySubsSplit'
                        topLeft={input.XLVHeavyFirstFull} topRight={input.XLVHeavyFirstSplit} bottomLeft={input.XLVHeavySubsFull} bottomRight={input.XLVHeavySubsSplit}></TableCell>
                </div>
                <div className='table-cell--col-name-1 table-cell-label table-cell--col-pos'>Small</div>
                <div className='table-cell--col-name-2 table-cell-label table-cell--col-pos'>Medium</div>
                <div className='table-cell--col-name-3 table-cell-label table-cell--col-pos'>Large</div>
                <div className='table-cell--col-name-4 table-cell-label table-cell--col-pos'>Extra Large</div>
                <div className='table-cell--row-name-1 table-cell--center-vertical table-cell-label'>Light</div>
                <div className='table-cell--row-name-2 table-cell--center-vertical table-cell-label'>Medium</div>
                <div className='table-cell--row-name-3 table-cell--center-vertical table-cell-label'>Heavy</div>
                <div className='table-cell--row-name-4 table-cell--center-vertical table-cell-label'>Very Heavy</div>
                <div className='table-cell-label-tl'></div>
            </div>
        </div>
    );
};

const TableCell = ({showFieldNames=true, onChange, setLight=true,
    topLeftName, topRightName, bottomLeftName, bottomRightName,
    topLeft, topRight, bottomLeft, bottomRight}) => {
    if (showFieldNames) {
        return (
            <div className={setLight ? 'table-matrix-cell--container table-matrix-cell--border table-row--light' : 'table-matrix-cell--container table-matrix-cell--border table-row--dark'}>
                <div></div>
                <div className='table-matrix-cell--center'>Full</div>
                <div className='table-matrix-cell--center'>Split</div>

                <div className='table-matrix-cell--center'>First</div>
                <div className='table-matrix-cell--center table-matrix-cell--padding'>
                    <TextField name={topLeftName} value={topLeft} onChange={onChange}/>
                </div>
                <div className='table-matrix-cell--center table-matrix-cell--padding'>
                    <TextField name={topRightName} value={topRight} onChange={onChange}/>
                </div>

                <div className='table-matrix-cell--center'>Subs</div>
                <div className='table-matrix-cell--center table-matrix-cell--padding'>
                    <TextField name={bottomLeftName} value={bottomLeft} onChange={onChange}/>
                </div>
                <div className='table-matrix-cell--center table-matrix-cell--padding'>
                    <TextField name={bottomRightName} value={bottomRight} onChange={onChange}/>
                </div>
            </div>
        )
    }
    return (
        <div className='table-matrix-cell--container-without-fields table-matrix-cell--border'>
            <div className='table-matrix-cell--center'>{topLeft}</div>
            <div className='table-matrix-cell--center'>{topRight}</div>

            <div className='table-matrix-cell--center'>{bottomLeft}</div>
            <div className='table-matrix-cell--center'>{bottomRight}</div>
        </div>
    )
};

const ProductHandlingMatrix = () => {
    const [input,setInput,, handleInputEvent] = useInputState(defaultInput);
    const [zone, setZone] = useState([]);
    const [activity, setActivity] = useState([]);
    const [itemszone, setzoneItems] = React.useState([]);
    const [itemsact, setactItems] = React.useState([]);
    const zoneHandler = (e) => setZone(e.currentTarget.value);
    const activityHander = (e) => setActivity(e.currentTarget.value);
    const user = useSelector(store => store.user); 
    input.DCMUser = user ;


    const searchHandler = () => {
        if (activity === '' || zone === '') {
            alert('Please select a zone and activity.');
        }
        else {
           

            let body = new URLSearchParams({
              
               'Activity': activity,
               'Zone' :zone,
               'DCMUser':user
            })

            let data = null;
            api.post('/Benchmark/ProductHandlingMatrix/GetMatrix',body).then( // Get All Activities
                res => {
                     data = res.data; 
                   

                     if (data.length > 0)
                     {
                     const dataInput = {
                        SmallCube:data[0].SmallCube, MediumCube:data[0].MediumCube,LargeCube:data[0].LargeCube,ExtraLargeCube:data[0].ExtraLargeCube,
                        SmallWeight:data[0].SmallWeight, MediumWeight:data[0].MediumWeight, HeavyWeight:data[0].HeavyWeight, VeryHeavyWeight:data[0].VeryHeavyWeight,
                        SmallLightFirstFull:data[0].SmallLightFirstFull,SmallLightFirstSplit:data[0].SmallLightFirstSplit,SmallLightSubsFull:data[0].SmallLightSubsFull, SmallLightSubsSplit:data[0].SmallLightSubsSplit,
                        SmallMedFirstFull:data[0].SmallMedFirstFull,SmallMedFirstSplit:data[0].SmallMedFirstSplit, SmallMedSubsFull:data[0].SmallMedSubsFull,SmallMedSubsSplit:data[0].SmallMedSubsSplit,
                        SmallHeavyFirstFull:data[0].SmallHeavyFirstFull, SmallHeavyFirstSplit:data[0].SmallHeavyFirstSplit,SmallHeavySubsFull:data[0].SmallHeavySubsFull,SmallHeavySubsSplit:data[0].SmallHeavySubsSplit,
                        SmallVHeavyFirstFull:data[0].SmallVHeavyFirstFull,SmallVHeavyFirstSplit:data[0].SmallVHeavyFirstSplit,SmallVHeavySubsFull:data[0].SmallVHeavySubsFull,SmallVHeavySubsSplit:data[0].SmallVHeavySubsSplit,
                        MedLightFirstFull:data[0].MedLightFirstSplit,MedLightFirstSplit:data[0].MedLightFirstSplit,MedLightSubsFull:data[0].MedLightSubsFull,MedLightSubsSplit:data[0].MedLightSubsSplit,MedMedFirstFull:data[0].MedMedFirstFull,
                        MedMedFirstSplit:data[0].MedMedFirstSplit,MedMedSubsFull:data[0].MedMedSubsFull,MedMedSubsSplit:data[0].MedMedSubsSplit,MedHeavyFirstFull:data[0].MedHeavyFirstFull,MedHeavyFirstSplit:data[0].MedHeavyFirstSplit,
                        MedHeavySubsFull:data[0].MedHeavySubsFull,MedHeavySubsSplit:data[0].MedHeavySubsSplit,MedVHeavyFirstFull:data[0].MedVHeavyFirstFull,MedVHeavyFirstSplit:data[0].MedVHeavyFirstSplit,
                        MedVHeavySubsFull:data[0].MedVHeavySubsFull,MedVHeavySubsSplit:data[0].MedVHeavySubsSplit,LargeLightFirstFull:data[0].LargeLightFirstFull,LargeLightFirstSplit:data[0].LargeLightFirstSplit,
                        LargeLightSubsFull:data[0].LargeLightSubsFull,LargeLightSubsSplit:data[0].LargeLightSubsSplit,LargeMedFirstFull:data[0].LargeMedFirstFull,LargeMedFirstSplit:data[0].LargeMedFirstSplit,
                        LargeMedSubsFull:data[0].LargeMedSubsFull,LargeMedSubsSplit:data[0].LargeMedSubsSplit,LargeHeavyFirstFull:data[0].LargeHeavyFirstFull,LargeHeavyFirstSplit:data[0].LargeHeavyFirstSplit,
                        LargeHeavySubsFull:data[0].LargeHeavySubsFull,LargeHeavySubsSplit:data[0].LargeHeavySubsSplit,LargeVHeavyFirstFull:data[0].LargeVHeavyFirstFull,LargeVHeavyFirstSplit:data[0].LargeVHeavyFirstSplit,
                        LargeVHeavySubsFull:data[0].LargeVHeavySubsFull,LargeVHeavySubsSplit:data[0].LargeVHeavySubsSplit,XLLightFirstFull:data[0].XLLightFirstFull,XLLightFirstSplit:data[0].XLLightFirstSplit,
                        XLLightSubsFull:data[0].XLLightSubsFull,XLLightSubsSplit:data[0].XLLightSubsSplit,XLMedFirstFull:data[0].XLMedFirstFull,XLMedFirstSplit:data[0].XLMedFirstSplit,XLMedSubsFull:data[0].XLMedFirstSplit,
                        XLMedSubsSplit:data[0].XLMedSubsSplit,XLHeavyFirstFull:data[0].XLHeavyFirstFull,XLHeavyFirstSplit:data[0].XLHeavyFirstSplit,XLHeavySubsFull:data[0].XLHeavySubsFull,XLHeavySubsSplit:data[0].XLHeavySubsSplit,
                        XLVHeavyFirstFull: data[0].XLVHeavyFirstFull,XLVHeavyFirstSplit:data[0].XLVHeavyFirstSplit,XLVHeavySubsFull:data[0].XLVHeavySubsFull,XLVHeavySubsSplit:data[0].XLVHeavySubsSplit};
                     setInput(dataInput);
                     }
                     else
                     {
                        setInput(emptyInput);
                     }
                    });

                
            
            
        }
    };

    const clearHandler = () => {
        setInput(emptyInput);
    };

    const deleteHandler = (event) => 
    {
        event.preventDefault();

        if (activity === '' || zone === '') {
            alert('Please select a zone and activity.');
        }
        else {

            input.activity = activity;
            input.Zone = zone;
            input.DCMUser=user;

        let body = new URLSearchParams(input);

        api.post('/Benchmark/ProductHandlingMatrix/DeleteMatrix', body).then(
            res => {
            
              let data = res.data;
              if (data === 'Selected Matrix Deleted') {
              
                window.alert("Selected Matrix Deleted");
                window.location.reload();
              }
              else {
                window.alert(data);
              }
          
      
            }).catch(
            
              err => {
                if (err.response) { // Server responded with error - web service issue
                  window.alert(err.response);
               
                }
                else {
      
                }
              }
            )
        
          
            }

        setInput(emptyInput);
    };

    const addHandler = (event) => 
    {
        event.preventDefault();

        if (activity === '' || zone === '') {
            alert('Please select a zone and activity.');
        }
        else {

            input.activity = activity;
            input.Zone = zone;
            input.DCMUser=user;

        let body = new URLSearchParams(input);

        api.post('/Benchmark/ProductHandlingMatrix/AddMatrix', body).then(
            res => {
            
              let data = res.data;
              if (data === 'New Matrix Created') {
              
                window.alert("New Matrix Created");
                window.location.reload();
              }
              else {
                window.alert(data);
              }
          
      
            }).catch(
            
              err => {
                if (err.response) { // Server responded with error - web service issue
                  window.alert(err.response);
               
                }
                else {
      
                }
              }
            )
        
          
            }

        setInput(emptyInput);
    };

    useEffect(() => {
        setActivity('');
        api.post('/Maintenance/Pickers/GetAllActivities').then( // Get All Activities
            res => {
                
                let data = res.data;    
                dropdownData['Activity'] = data.map(x => x['ActivityName']);
                setactItems(data.map(x => x['ActivityName']));
              
            });

        api.post('/Maintenance/Pickers/GetAllZone').then( // Agencies List
            res => {
                let data = res.data;
                dropdownData['Zone'] = data.map(x => x['ZoneNumber']); 
                setzoneItems(data.map(x => x['ZoneNumber']));     
            });
        

    }, [zone, setActivity]);

    return (
        <div>
            <Header></Header>
            <div className='screen-container'>
                <div className='panel panel--header'>
                    <div className='table-header'>Product Handling Matrix</div>
                    <div className='table-toolbar'>
                        <div className='toolbar-item'>
                            <DropDown label='Zone' defaultValue={zone}  value ={zone}onChange={zoneHandler} options={dropdownData.Zone}/>
                        </div>
                        <div className='toolbar-item'>
                            <DropDown label='Activity' defaultValue={activity} value ={activity} onChange={activityHander} options={dropdownData.Activity}/>
                        </div>
                        <div  className='toolbar-item' >
                        <Tooltip title='Log Out'>
                        <IconButton >
     
                           </IconButton>
                            </Tooltip>
                            <button className='modal-button modal-button--styling hover-cursor product-handle-search--position product-handle-button--width' onClick={searchHandler}>Search</button>
                        </div>

                        <div className='table-toolbar table-toolbar--right'>

                        <div className='toolbar-item'>
                                <button className='modal-button modal-button--styling hover-cursor product-handle-button--width' onClick={clearHandler}>Clear</button>
                            </div>

                            <div className='toolbar-item'>
                                <button className='modal-button modal-button--styling hover-cursor product-handle-button--width' onClick={addHandler}>Add</button>
                            </div>
                           
                            <div className='toolbar-item'>
                                <button className='modal-button modal-button--styling hover-cursor product-handle-button--width' onClick={deleteHandler}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='screen-container'>
                <div className='panel panel--table'>
                    <Table input={input} handleInputEvent={handleInputEvent}/>
                </div>
            </div>
            {/* <div className='screen-container'>
                <div className='table-toolbar'>
                    <div className='toolbar-item'>
                        <button className='modal-button modal-button--styling hover-cursor product-handle-button--width'>Save</button>
                    </div>
                    <div className='toolbar-item'>
                        <button className='modal-button modal-button--styling hover-cursor product-handle-button--width'>Clear</button>
                    </div>
                </div>
            </div> */}
        </div>
    )
}









export default ProductHandlingMatrix;