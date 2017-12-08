/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import moment from 'moment';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // only needs to be imported once
import { isValid } from 'date-fns';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import MultiSelect from './MultiSelect'

import firebase from 'firebase/app';

class ModalExample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            date: new Date(),
            m: moment(),
            description: "",
            title: "",
            time: "10:30",
            blocking: false,
            selectedOption: '',
            selectedUsers: '',
            users: []
        };
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        let userRef = firebase.database().ref("members");
        userRef.on("value", (snapshot) => {
            let data = snapshot.val()
            let userArray = Object.keys(data).map((key) => {
                return { label: data[key].displayName, value: key }
            });
            this.setState({ users: userArray });
        });
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            description: "",
            time: "10:30",
            title: "",
            blocking: false,
            selectedUsers: ''
        });
    }

    createMeeting() {
        if (this.allValid()) {
            let tempDate = this.state.date;
            let timeArray = this.state.time.split(":");

            tempDate.setHours(timeArray[0], timeArray[0]);

            let time = tempDate.getTime();

            let userArray = this.state.selectedUsers.split(',');


            let newMeeting = {
                meetingName: this.state.title,
                date: time,
                description: this.state.description,
                members: userArray
            }

            this.toggleBlocking();

            var ref = firebase.database().ref("meetings");
            // this new, empty ref only exists locally
            var newChildRef = ref.push();
            // we can get its id using key()
            newChildRef.set(newMeeting)

            for (let i = 0; i < userArray.length; i++) {
                firebase.database().ref("members").child(userArray[i]).child("permissions")
                    .set({[newChildRef.key]: newMeeting.meetingName});
            }

            this.toggle();
            this.toggleBlocking();
        }
    }

    toggleBlocking() {
        this.setState({ blocking: !this.state.blocking });
    }

    allValid() {
        return (this.state.description.length > 0 &&
            this.state.title.length > 0 && this.state.time.length > 0)
    }

    handleDateSelect(date) {
        this.setState({ date: date });
    }

    handleTimeSelect(e) {
        this.setState({ time: e.target.value });
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value });
    }

    handleDescriptionChange(e) {
        this.setState({ description: e.target.value });
    }

    handleSelectChange(value) {
        this.setState({ selectedUsers: value })
    }

    render() {
        const styles = {
            marginTop: {
                marginTop: 5
            }
        }

        return (
            <div style={{ height: "90%" }}>
                <Button color="primary" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} size='lg'>
                    <BlockUi tag="div" blocking={this.state.blocking}>
                        <ModalHeader toggle={this.toggle}>Create Meeting:</ModalHeader>
                        <ModalBody>
                            <Container>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <InfiniteCalendar
                                            width={"100%"} height={250} selected={this.state.date} onSelect={(date) => { this.handleDateSelect(date) }} />
                                        <FormGroup>
                                            <Label for="exampleTime">Time</Label>
                                            <Input type="time" name="time" id="exampleTime" value={this.state.time} onChange={(e) => this.handleTimeSelect(e)} />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <FormGroup>
                                            <Label style={styles.marginTop} for="meetingTitle">Meeting:</Label>
                                            <Input onChange={(e) => this.handleTitleChange(e)} name="meetingTitle" value={this.state.title} />
                                            <Label style={styles.marginTop} for="exampleText">Meeting Objectives:</Label>
                                            <Input onChange={(e) => this.handleDescriptionChange(e)} value={this.state.description} type="textarea" rows={6} name="text" id="exampleText" />
                                            <Label style={styles.marginTop} for="exampleSelectMulti">Select Attendees</Label>
                                            <MultiSelect selected={this.state.selectedUsers} options={this.state.users} handleSelectChange={(value) => this.handleSelectChange(value)} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Container>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={!this.allValid()} onClick={() => this.createMeeting()}>Create</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </BlockUi>
                </Modal>
            </div>
        );
    }
}

export default ModalExample;