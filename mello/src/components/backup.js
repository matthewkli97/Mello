import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import events from 'events';
import firebase from 'firebase/app';
import 'firebase/database';

import React, { Component } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.momentLocalizer(moment);

// generating all the event(tasks)
export default class Calendar extends Component{
    constructor(props){
        super(props);
    }
  render(){
    return (
        <BigCalendar
        {...this.props}
        events={[
            {
              'title': 'All Day Event very long title',
              'allDay': true,
              'start': new Date(2015, 3, 0),
              'end': new Date(2015, 3, 1)
            },
            {
              'title': 'Long Event',
              'start': new Date(2015, 3, 7),
              'end': new Date(2015, 3, 10)
            }]}
        
        views={["month", "week"]}
        defaultDate={new Date()}
      />
    )
  }
}

