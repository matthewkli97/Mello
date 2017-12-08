import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import React, { Component } from 'react';

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

export default class Calendar extends Component {

    render() {

        return (
            <div style={{ width: "100%", height: "100%" }}>
                <BigCalendar style={{ width: "100%", height: "100%" }}
                    {...this.props}
                    events={this.props.events}
                    views={["month", "day"]}
                    step={60}
                    defaultDate={new Date()}
                />
            </div>
        )
    }
}
