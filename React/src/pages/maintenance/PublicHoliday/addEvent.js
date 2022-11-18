import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Modal, { checkChange } from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import DateRangeIcon from '@material-ui/icons/DateRange';
import IconButton from '@material-ui/core/IconButton';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, TestdateObjToInput, formatDate } from '../../../components/fields/dateHelpers';

export default function AddEventModal(props) {

    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [loadModal, setLoadModal] = useState(false);

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [title, setTitle] = useState();
    const [date, setdate] = useState();
    const [description, setdescription] = useState();

    const user = useSelector(store => store.user);

    
    const handledateChange = (e) => {
        setdate(e.target.value);
    }
   
    const handledescriptionChange = (e) => {
        setdescription(e.target.value);
    }
  
    const onSubmit = async (e) => {
        e.preventDefault();

        setLoadModal(true);
        setModalMessage('');
        setModalMessageError('');

        let body = new URLSearchParams({
            'Description': description,
            'Date': inputToDate(date) ,
            'DCMUser': user
        });

        await api.post('Maintenance/PublicHoliday/Add', body).then(
            res => {
            
               
                if (res.data.response === 'Public Holiday Inserted') {
                    //getLeave();
                    setModalMessage(`New Public Holiday has been successfully added.`);

                    ///Maintenance/PublicHoliday/GetAllPublicHoliday

                    api.post('/Maintenance/PublicHoliday/GetAllPublicHoliday').then(
                        res => {
                            let data = res.data;
                            var holidays=[];
      
                            data = data.map(x => {
                            
                              var obj = 
                              {  'id':x.SerialID,
                                 'title':x.Description,
                                 'start': new Date(TestdateObjToInput(dateToDateObj(x.Date)) +'T'+'00:00:00'),
                                 'end': new Date (TestdateObjToInput(dateToDateObj(x.Date)) +'T'+'23:59:00') 
                               }
                                holidays.push(obj);
                              return x;
                            });

                            props.childHandler(holidays);

                        }).catch(
                            err => {
                                if (err.response) {
                                }
                                else {
                                }
                            }
                        );

                }
                else if (res.data.response === 'Dulpicate Record Found')
                {
                    setModalMessageError(`Error: Duplicate Record Found.Please try again with anaother date`);
                }
                else
                {
                    setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                }
                setLoadModal(false);
            }
        ).catch(
            err => { // TODO: Error handling
                console.log(err);
                setModalMessageError(`Error: Failed to connect to server. Please try again.`);
                setLoadModal(false);
            }
        );
    }
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [showModal, setShowModal] = React.useState(false);

    const handleOpen = () => {
        setShowModal(true);
        setModalMessage('');
        setModalMessageError('');

    };

    const handleClose = () => {
        setShowModal(false);
    };


    return (

        <div>
            <IconButton style={{ padding: '2px', float: 'right', }} onClick={handleOpen} aria-label="View Image">
                <DateRangeIcon onClick={handleOpen} fontSize='large' style={{ color: '#3d6090' }} />
            </IconButton>

            <Modal title='Add Public Holiday' buttonName='Add' showModal={showModal} onSubmit={onSubmit}
                setShowModal={setShowModal} loadModal={loadModal}
                message={modalMessage} messageError={modalMessageError} unrestrictWidth={true}>
                <div className='modal-grouping--col-2'>
                    <div className='modal-item'>
                        <label className='label label--position' >Date</label>
                        <input className="modal-fields modal-fields--outline modal-fields--date" type="date" value={date} onChange={handledateChange} required ></input>
                    </div>
                   
                    <TextField name='Description' label='Description' value={description} onChange={handledescriptionChange} type='text' required></TextField>
                </div>
            </Modal>


        </div>
    );
}
