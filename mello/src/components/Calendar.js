import moment from 'moment';
import './Calendar.css';
import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

const today = moment();

export class Calendar extends Component{
    constructor(props){
        super(props);
        this.state ={
            events:[],
            current: moment().clone()
        }        
    }

    componentDidMount() {   
        // this.groupRef = firebase.database().ref('tasks'+firebase.auth()
        this.groupRef = firebase.database().ref("tasks").orderByChild("dueDate");;
        this.groupRef.on('value', (snapshot) => {
            console.log(snapshot.val());
            this.setState({ events: snapshot.val() });
        })
        console.log(this.state.events);
        // this.state.events.forEach(event){
        //     set up the tasks at that day
        // }
    }   

    rightHandler(){
        // var update = this.state.title;
        this.setState({current: this.state.current.add(1, "months")})
    }
    leftHandler(){
        var update = today;
        this.setState({current: this.state.current.subtract(1, "months")})
    }

    render(){
        return(
            <div id="calendar">
            <Headers current={this.state.current} rightHandler={()=>this.rightHandler()} leftHandler={()=>this.leftHandler()}/>
            <Month  current={this.state.current} events={this.state.event}/>
            </div>
        );
    }
}

class Headers extends Component{
    constructor(props){
        super(props);
        this.state={
            current: this.props.current
        }
    }
    

    render(){
        return(
            <div className="header">
                <h1>{this.state.current.format('MMMM YYYY')}</h1>
                <div className="right" onClick={this.props.rightHandler}></div>
                <div className="left" onClick={this.props.leftHandler}></div>
            </div>
        );
    }
}

class Month extends Component{
    constructor(props){
        super(props);
    }
   
    current(){
        var clone = this.props.current.date(1).clone();
        var currentMonth = [];
        var key = 0;
        while(clone.month() === this.props.current.date(1).month()) {           // content.push(<Day key={key} day={clone.format} />);
            currentMonth.push(clone.format());
            // currentMonth.push(<Day key={clone.format()} day={moment(clone)} current={this.props.current}  handleClick={()=>this.handleClick()}/>)
            clone.add('days', 1);
        }
        return currentMonth;
    }

    backfill(){
        var backfill = []
        var clone = this.props.current.date(1).clone();
        var dayOfWeek = clone.day();
        if(!dayOfWeek) { return; }
        clone.subtract(dayOfWeek+1,'days').format;
        for(var i = dayOfWeek; i > 0 ; i--) {
            var theDay = clone.add(1, 'days').format(); 
            backfill.push(theDay)                        
            // backfill.push(<Day key={theDay} day={moment(theDay)} current={this.props.current}  handleClick={()=>this.handleClick()}/>)            
        } 
        return backfill;      
    }

    forwardfill(){
        var forwardfill = []
        var clone = this.props.current.date(1).clone().add('months', 1).subtract('days', 1);
        var dayOfWeek = clone.day();
        if(dayOfWeek === 6) { return; }
        for(var i = dayOfWeek; i < 6 ; i++) {
            var theDay = clone.add(1, 'days').format();         
            forwardfill.push(theDay);
            // forwardfill.push(<Day key={theDay} day={moment(theDay)} current={this.props.current} handleClick={()=>this.handleClick()} />)            
        }
        return forwardfill;
    }

    combine(){
        let currentMonth = this.current();
        let backfill = this.backfill();
        let forwardfill = this.forwardfill();
        if(backfill === undefined){
            var all = currentMonth.concat(forwardfill);
        }else if(forwardfill === undefined){
            all = backfill.concat(currentMonth);
        }else{
            all = backfill.concat(currentMonth, forwardfill);
        }
        return all;
    }

    render(){
        let content = this.combine();
        
        return(
            <div style={{backgroundColor:"white"}}>
                {/* {/* {content} */}
                <Weeks days={content} current = {this.props.current} events={this.props.events}/>
            </div>
        );
    }
}

class Weeks extends Component{
    render(){
        let content = [];
        let daysInAWeek = []
        this.props.days.map((day)=>{
            daysInAWeek.push(day);
            if(moment(day).day() === 6) {
                // let update = daysInAWeek;               
                content.push(
                <Week key={day+"week"} days={daysInAWeek} current={this.props.current}></Week>)
                daysInAWeek = [];                
            }
        })       
        return(
            <div>     
                {content}
                {/* <Weeks days={content}/> */}
            </div>
        )}
}

class Week extends Component{
    constructor(props){
        super(props);
        this.state = {
            open : false            
        }
    }

    handleClick(){
        this.setState({open : !this.state.open})
    }
    render(){        
        let content = [];
        this.props.days.map((day)=>{
        content.push(<Day key={day} day={moment(day)} current={this.props.current} handleClick={()=>{this.handleClick()}} events={this.props.events}/>)})
        
        return(
            <div className="week">
                {content}
                {this.state.open  &&
                <div className="day-events">
                <Event day={this.props.day} />
                </div>
                } 
            </div>
        );
    }
}

class Day extends Component{
    constructor(props){
        super(props);
        this.state = {
            local : false,
            todayEvent :[]
        }
    }
 
    click(){
        this.setState({local:!this.state.local});
        this.props.handleClick()
    }
    
    getClassName(day){
        var classes = ['day'];        
        if(day.month() !== this.props.current.month()) {
          classes.push('other');
        } else if (moment().isSame(day, 'day')) {
          classes.push('today');
        }
        return classes.join(' ');
    }

    render(){
        var className = this.getClassName(this.props.day);
        var theDay = this.props.day;   
        var content;
        return(
            <div className={""+className} onClick={()=>this.click(this.state.local)}>
                <div className="day-name">{theDay.format('ddd')}</div>
                <div className="day-number">{theDay.format('DD')}
                {this.state.todayEvent && <span className="blue"></span>}
                </div>
                {this.state.local &&<div className="arrow"></div>}
            </div>

        );
    }
}

class Event extends Component{
    constructor(props){
        super(props);
        this.state = {
            events : [],
            today: []
        }
    }

    render(){
        let content=[];
        if(this.state.today){
            this.state.today.map((task)=>{
                content.push( <div className="event">
                {/* <div className={"event-category"+"blue"}></div> */}
                <span>
                    hello
                {this.state.today.taskName}
                </span>
                </div>)
            })
            
        }else{
            content=(
            // <div className="events in">
            <div className="event empty">
            <span className={this.props.name}>No Events</span>
            </div>)
            // </div>)
        }
        // let className = getClassName();
        return (
            <div className="events">
                <div className="details" >
                    {content} 
                </div>
            </div>    
        )
    }
}

