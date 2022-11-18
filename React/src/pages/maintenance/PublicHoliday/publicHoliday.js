import React from "react";
import Screen from '../../../components/screen/screen';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import api from '../../../components/api/api';
import { inputToDate, dateToInput, dateToDateObj, dateObjToDate, dateObjToInput, TestdateObjToInput, formatDate } from '../../../components/fields/dateHelpers';
import Moment from 'moment';
import AddEventModal from './addEvent';

import CalendarDialog from './calendarDocPopUp';
import year from './year';

const localizer = momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(Calendar);

class DCMCalendar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      events: [{
        id: "",
        title: '',
        start: '',
        end: ''
      }],
      toggleToTriggerOpenDialog: false, // toggle state var, used to open dialog on event item click
      selectedEventID: -1, // this is id of clicked event item, will be used to pass to child component (calendarDocPopUp.js) on event item click
      selectedEventTitle: "", // title of clicked event item, will be sent to child component (calendarDocPopUp.js) through props
    }
  }

  // handler to be passed to child (calendarDocPopUp.js)
  // child will send updated events list after deletion which will update the parent (calendar.js) events state
  childHandler = (childData) => {
    this.setState({
      events: childData
    })
  }

  // onEventResize = (data) => {
  //   const { start, end } = data;

  //   this.setState((state) => {
  //     state.events[0].start = new Date(start);
  //     state.events[0].end = new Date(end);
  //     return { events: state.events };
  //   });
  // };

  // onEventDrop = (data) => {
  //   this.setState((state) => {
  //     state.events[0].start = data.start;
  //     state.events[0].end = data.end;
  //     return { events: state.events };
  //   });
  // };

  // moves event through dragging on calendar
  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state

    // let body = new URLSearchParams({
    //   'id': event.id,
    //   'start': Moment(start).format('YYYY-MM-DD HH:mm:SS'),
    //   'end': Moment(end).format('YYYY-MM-DD HH:mm:SS')
    // });
    // api.post('/Maintenance/Calendar/UpdateEvent', body).then(
    //   res => {
    //     let data = res.data;

    //     if (data === 'Event Updated') {
    //       let allDay = event.allDay

    //       if (!event.allDay && droppedOnAllDaySlot) {
    //         allDay = true
    //       } else if (event.allDay && !droppedOnAllDaySlot) {
    //         allDay = false
    //       }

    //       const nextEvents = events.map(existingEvent => {
    //         return existingEvent.id == event.id
    //           ? { ...existingEvent, start, end, allDay }
    //           : existingEvent
    //       })

    //       this.setState({
    //         events: nextEvents,
    //       })
    //     }
    //   }).catch(
    //     err => {
    //       // TODO: Error handling
    //       if (err.response) {
    //         console.log(err.response)
    //       }
    //       else {
    //       }
    //     }
    //   );
    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }


  // resizes event through dragging on calendar
  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    let body = new URLSearchParams({
      'id': event.id,
      'start': Moment(start).format('YYYY-MM-DD HH:mm:SS'),
      'end': Moment(end).format('YYYY-MM-DD HH:mm:SS')
    });
    // api.post('/Maintenance/Calendar/UpdateEvent', body).then(
    //   res => {
    //     let data = res.data;

    //     if (data === 'Event Updated') {
    //       const nextEvents = events.map(existingEvent => {
    //         return existingEvent.id == event.id
    //           ? { ...existingEvent, start, end }
    //           : existingEvent
    //       })

    //       this.setState({
    //         events: nextEvents,
    //       })
    //     }
    //   }).catch(
    //     err => {
    //       // TODO: Error handling
    //       if (err.response) {
    //         console.log(err.response)
    //       }
    //       else {
    //       }
    //     }
    //   );

    //alert(`${event.title} was resized to ${start}-${end}`)
  }


  // on event selection, update state vars that are to be passed to child (calendarDocPopUp.js)
  onSelectEvent(pEvent) {

    this.setState({
      toggleToTriggerOpenDialog: !this.state.toggleToTriggerOpenDialog, // toggle to open dialog
      selectedEventID: pEvent.id, // to send selected event item id
      selectedEventTitle: pEvent.title // to send selected item title
    })
  }

  componentDidMount() { // page load

    api.post('/Maintenance/PublicHoliday/GetAllPublicHoliday').then(
      res => {
        let data = res.data;
        var holidays=[];
      
        data = data.map(x => {
        
          var obj = 
          {  'id':x.SerialID,
             'title':x.Description,
             'start':  new Date(TestdateObjToInput(dateToDateObj(x.Date)) +'T'+'00:00:00'),
             'end': new Date(TestdateObjToInput(dateToDateObj(x.Date)) +'T'+'23:59:00')
           }

            holidays.push(obj);
          return x;
        });

        console.log(holidays);
        this.setState({
          // events: [{ start: new Date('2021-07-21 10:18:18'), end: new Date('2021-07-21 11:18:18'), title: "special event", id:3 }
          // , { start: new Date('2021-08-24 10:18:18'), end: new Date(), title: "special event", id:4 }]
          events: holidays
        })
      }).catch(
        err => {
          if (err.response) {
          }
          else {
          }
        }
      );
  }

  handler() {
    api.post('/Maintenance/PublicHoliday/GetAllPublicHoliday').then(
      res => {
        let data = res.data;

        var holidays=[];
      
        data = data.map(x => {

          var obj = 
          {  'id':x.SerialID,
             'title':x.Description,
             'start':  new Date(TestdateObjToInput(dateToDateObj(x.Date)) +'T'+'00:00:00'),
             'end': new Date(TestdateObjToInput(dateToDateObj(x.Date)) +'T'+'23:59:00')
           }

            holidays.push(obj);
          return x;
        });

    
        this.setState({
          // events: [{ start: new Date('2021-07-21 10:18:18'), end: new Date('2021-07-21 11:18:18'), title: "special event", id:3 }
          // , { start: new Date('2021-08-24 10:18:18'), end: new Date(), title: "special event", id:4 }]
          events: holidays
        })
      }).catch(
        err => {
          if (err.response) {
          }
          else {
          }
        }
      );
  }

  render() {
    return (
      <Screen>
        <div className="App">
          <AddEventModal  
            // handler={this.handler} 
            childHandler={this.childHandler} // callback fn
          /> 
          <DnDCalendar
           // defaultDate={moment().toDate()}
            eventPropGetter={(event) => {
              const backgroundColor = event.allday ? 'rgb(35,168,224)' : 'rgb(35,168,224)';
              return { style: { backgroundColor,  fontFamily:'Montserrat' } }
           
            }}
            events={this.state.events}
            localizer={localizer}
            onEventDrop={this.moveEvent}
            onEventResize={this.resizeEvent}
            disabled={true}
            resizable
            style={{ height: "100vh" , backgroundColor:'white' }}
           // onSelectEvent={event => this.onSelectEvent(event)} //Fires selecting existing event
          />
        </div>
        < CalendarDialog 
        
          style ={{ backgroundColor:'black'}}
          toggleToTriggerOpenDialog={this.state.toggleToTriggerOpenDialog} 
          selectedEventID={this.state.selectedEventID}
          selectedEventTitle={this.state.selectedEventTitle}
          allEvents={this.state.events} // pass all events
          childHandler={this.childHandler} // callback fn
        />
      </Screen>

    );
  }
}

export default DCMCalendar;


