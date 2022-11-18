import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Modal, { checkChange } from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import DateRangeIcon from '@material-ui/icons/DateRange';
import IconButton from '@material-ui/core/IconButton';

export default function AddEventModal(props) {

    const [modalMessage, setModalMessage] = useState('');
    const [modalMessageError, setModalMessageError] = useState('');
    const [loadModal, setLoadModal] = useState(false);

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [title, setTitle] = useState();

    const user = useSelector(store => store.user);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    }
    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    }
    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    }
    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    }
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        setLoadModal(true);
        setModalMessage('');
        setModalMessageError('');

        let body = new URLSearchParams({
            'title': title,
            'start': startDate + ' ' + startTime,
            'end': endDate + ' ' + endTime,
            'DCMUser': user
        });
        await api.post('/Maintenance/Calendar/AddEvent', body).then(
            res => {
                let response = res.data;

                if (response === 'Event Added') {
                    //getLeave();
                    setModalMessage(`New Event has been successfully added.`);

                    api.post('/Maintenance/Calendar/GetEvents').then(
                        res => {
                            let data = res.data;
                            data = data.map(x => {
                                x.start = new Date(x.start);
                                x.end = new Date(x.end);
                                return x;
                            });

                            props.childHandler(data);

                        }).catch(
                            err => {
                                if (err.response) {
                                }
                                else {
                                }
                            }
                        );

                }
                else {
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
            <IconButton style={{ padding: '2px', float: 'right', }}
                onClick={handleOpen}
                aria-label="View Image"
            >
                <DateRangeIcon onClick={handleOpen} fontSize='large' style={{ color: '#3d6090' }} />
            </IconButton>

            <Modal title='ADD EVENT' buttonName='Add' showModal={showModal} onSubmit={onSubmit}
                setShowModal={setShowModal} loadModal={loadModal}
                message={modalMessage} messageError={modalMessageError} unrestrictWidth={true}>
                <div className='modal-grouping--col-2'>
                    <TextField name='Title' label='Title' value={title} onChange={handleTitleChange} required restrictions='default'></TextField>
                    <div></div>
                    <div className='modal-item'>
                        <label className='label label--position' >Start Date</label>
                        <input className="modal-fields modal-fields--outline modal-fields--date" type="date" value={startDate} onChange={handleStartDateChange} required ></input>
                    </div>
                    <TextField name='StartTime' label='Start Time' value={startTime} onChange={handleStartTimeChange} type='time' required></TextField>
                    <div className='modal-item'>
                        <label className='label label--position' >End Date</label>
                        <input className="modal-fields modal-fields--outline modal-fields--date" type="date" value={endDate} onChange={handleEndDateChange} required ></input>
                    </div>
                    <TextField name='EndTime' label='End Time' value={endTime} onChange={handleEndTimeChange} type='time' required></TextField>
                </div>
            </Modal>


        </div>
    );
}
