import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React, { Component } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import events from 'events';
import firebase from 'firebase/app';
import 'firebase/database';

BigCalendar.momentLocalizer(moment);
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])



// generating all the event(tasks)
export default class Calendar extends Component{
    constructor(props){
        super(props);
        this.state = {
            events : []
        }
    }
    componentDidMount() {   
        this.groupRef = firebase.database().ref("Task");
        this.groupRef.on('value', (snapshot) => {
            console.log(snapshot.val());
            this.setState({ events: snapshot.val() });
        })
        console.log(this.state.events);
    }   

  render(){
    var today = new Date();
    return (
        // <div >
        <BigCalendar
        style={{"width":"200px", "height":"200px"}}
        {...this.props}
        events={this.state.events}
        views={allViews}
        step={60}
        defaultDate={new Date()}
      />
    )
  }
}

