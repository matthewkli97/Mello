import React, { Component } from 'react';
import {Container,Row ,Col} from 'reactstrap';

import NotesContainer from '../components/NotesContainer'
import Calendar from '../components/Calendar'
import TaskList from '../components/TaskList'
import TaskModal from '../components/TaskModal'
import InviteModal from '../components/InviteModal'
import ModalExample from '../components/ModalExample'

import { RingLoader } from 'react-spinners';

import firebase from 'firebase/app';


export default class MeetingDashboardPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            meeting: {}
        }
    }

    componentDidMount() {
        this.meetingRef = firebase.database().ref("meetings").child(this.props.match.params.meetingId);

        this.meetingRef.on("value", (snapshot) => {
            this.setState({ meeting: snapshot.val() });
        });
    }

    componentWillUnmount() {
        this.meetingRef.off()
    }

    toggleTaskModal = (messageContent) => {
        let newTitle = this.getTitle(messageContent);
        console.log(newTitle);
        this.setState({ 
            taskModal: !this.state.taskModal, 
            title: newTitle
        });
    }

    getTitle = (str) => {
        let headings = [];

        for (let i = 1; i <= 6; i++) {
            headings.push(str.indexOf("<h" + i + ">"));
        }

        for (let i = 0; i < 6; i++) {
            if (headings[i] !== -1) {
                return str.substring(
                    str.indexOf("<h" + (i + 1) + ">") + 4, 
                    str.indexOf("</h" + (i + 1) + ">")
                );
            }
        }

        return "";
    }

    render() {
        const styles = {
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
            }
        }

        if (this.props.currentUser) {
            return (
                <div style={{ height: "100%", padding: "5%" }}>
                    <Row>
                        <div style={{ margin: 15 }}>
                            <TaskModal
                                buttonLabel={"Create Task"} 
                                currentUser={this.props.currentUser} 
                                meetingId={this.props.match.params.meetingId} 
                                showModal={this.state.taskModal}
                                updatePage={this.updatePage}
                                title={this.state.title}
                            />
                        </div>
                        <div style={{margin: 15}}>
                            <ModalExample style={{ float: "right" }} buttonLabel={"Create Meeting"} currentUser={this.props.currentUser} />
                        </div>
                        <div style={{margin: 15}}>
                            <InviteModal meeting={this.state.meeting} />
                        </div>
                    </Row>
                    <Row style={{ height: "95%" }}>
                        <Col style={{ height: "100%" }} xs={6}>
                            <Row style={{ height: "50%" }}>
                                <Container style={{ height: "95%" , overflowY:"auto"}}>
                                    <TaskList currentUser={this.props.currentUser} tasks={this.state.meeting.tasks} />
                                </Container>
                            </Row>
                            <Row style={{ height: "50%" }}>
                                <Container style={{ height: "100%", width: "95%" }}>
                                    <Calendar currentUser={this.props.currentUser} />
                                </Container>
                            </Row>
                        </Col>
                        <Col style={{height: "90%", maxHeight: "90%", overflowY: "auto" }} xs={6}>
                            <NotesContainer 
                                currentUser={this.props.currentUser} 
                                meetingId={this.props.match.params.meetingId} 
                                toggleModal={this.toggleTaskModal}
                            />
                        </Col>
                    </Row>
                </div>

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