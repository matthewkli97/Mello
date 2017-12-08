import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import React, { Component } from 'react';

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

export default class Calendar extends Component {

    render() {

        let events = [
            {
                'title': 'Dinner',
                'start': new Date(2017, 4, 12, 20, 0, 0, 0),
                'end': new Date(2017, 4, 12, 21, 0, 0, 0)
            },
            {
                'title': 'Dinner',
                'start': new Date(2017, 3, 12, 20, 0, 0, 0),
                'end': new Date(2017, 3, 12, 21, 0, 0, 0)
            }
        ]

        return (
            <div style={{ width: "100%", height: "100%" }}>
                <BigCalendar style= {{width: "100%", height: "100%"}}
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