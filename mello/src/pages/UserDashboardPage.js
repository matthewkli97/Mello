import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import { Container, Col, Row, Button } from 'reactstrap';
import TaskList from '../components/TaskList';
import ModalExample from '../components/ModalExample.js';
import Calendar from '../components/Calendar'

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import { RingLoader } from 'react-spinners';


import MeetingList from '../components/MeetingList.js';

export default class UserDashboardPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            meetings: {},
            tasks: {},
            events: []
        }
    }

    componentDidMount() {
        if (this.props.currentUser) {
            let taskRef = firebase.database().ref("tasks").child(this.props.currentUser.uid);

            taskRef.on("value", (snapshot) => {
                this.setState({ tasks: snapshot.val() });
                this.gatherEvents();
                console.log(this.state);
            });

            this.setState({ loading: true })

            this.memberRef = firebase.database().ref("members").child(this.props.currentUser.uid).child("permissions");

            this.memberRef.on("value", (snapshot) => {
                this.setState({ meetings: snapshot.val() });
            });
        }
    }

    gatherEvents() {

        let events = [];

        if (this.state.tasks && this.state.tasks != null) {
            let taskIds = Object.keys(this.state.tasks);
            taskIds.map((id) => {
                let date = new Date(this.state.tasks[id].dueDate);
                let endDate = new Date(date);
                endDate.setDate(date.getDate() + 1);

                events.push({
                    'title': this.state.tasks[id].taskName,
                    'start': date,
                    'end': endDate,
                    'allDay': true
                })
            })
        }

        if (this.state.meetings && this.state.meetings != null) {
            let meetingIds = Object.keys(this.state.meetings);
            meetingIds.map((id) => {
                let date = new Date(this.state.meetings[id].date);
                let endDate = new Date(date);
                endDate.setHours(date.getHours() + 2);

                events.push({
                    'title': this.state.meetings[id].name,
                    'start': date,
                    'end': endDate,
                })
            })
        }

        this.setState({ events: events });
    }

    componentWillUnmount() {
        if (this.props.currentUser) {
            this.memberRef.off();
        }
    }

    performAdd() {
        firebase.database().ref("members").once('value', (snapshot) => { console.log(snapshot.val()) }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        var color = '#4DAF7C';

        const styles = {
            row: {
                height: "50%"
            },
            container: {
                height: "100%"
            },
            spinner: {
                display: "inline-block",
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: 100,
                height: 100,
                margin: "auto",
                paddingRight: "auto",
                paddingLeft: "auto"
            },
            overFlow: {
                maxHeight: 600,
                overflowX: "hidden",
                overflowY: "auto"
            },
            marginTop: {
                marginTop: 40
            },
            imageCircle: {
                width: "25%",
                paddingTop: "25%",
                backgroundSize: "cover",
                display: "block",
                borderRadius: "50%",
                marginRight:"auto",
                marginLeft:"auto"
            }
        }

        if (this.props.currentUser) {
            return (
                <Container style={styles.container}>
                    <Row>
                        <Col>
                            <div className="pull-right">
                                <ModalExample buttonLabel={"Create Meeting"} currentUser={this.props.currentUser} />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {this.props.currentUser.photoURL &&
                            <div style={{ ...styles.imageCircle, ...{ backgroundImage: 'url(' + this.props.currentUser.photoURL + ')' } }}
                                role="img" alt={"profile image for " + this.props.currentUser.displayName}></div>
                        }
                        {
                            !this.props.currentUser.photoURL &&

                            <div style={{ ...styles.imageCircle, ...{ backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/chat-b9230.appspot.com/o/user.png?alt=media&token=d9e9621e-58fa-4c18-bd2d-c6d31b677a9d)' } }}
                                alt={"profile image for " + this.props.currentUser.displayName} role="img"></div>
                        }
                    </Row>
                    <Row style={{ ...styles.row, ...styles.marginTop, ...styles.overFlow }}>
                        <Col xs="12">
                            <p className="h3 mt-2">Tasks</p>
                            <TaskList currentUser={this.props.currentUser} tasks={this.state.tasks} />
                        </Col>
                    </Row>
                    <Row style={{ ...styles.row, ...styles.marginTop }}>
                        <Col sm="12" md="6" style={{ height: 400 }}>
                            <Calendar events={this.state.events} />
                        </Col>
                        <Col sm="12" md="6">
                            <p className="h3 mt-2">Meetings:</p>
                            <MeetingList currentUser={this.props.currentUser} meetings={this.state.meetings} />
                        </Col>
                    </Row>
                </Container >
            );
        } else {
            return (
                <Container style={styles.spinner}>
                    <RingLoader
                        size={100}
                        color={'#123abc'}
                        loading={true}
                    />
                </Container>
            );
        }
    }
}