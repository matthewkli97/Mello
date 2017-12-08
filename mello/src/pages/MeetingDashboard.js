import React, { Component } from 'react';
import Notes from '../components/NotesContainer';
import {
    Container,
    Row,
    Col
} from 'reactstrap';

import firebase from 'firebase/app';
import 'firebase/database';

export default class MeetingDashboard extends Component {
    constructor(props) {
        super(props);
        // Load in messages from the database
        this.ref = firebase.database()
            // .ref("messages/" + this.props.match.params.meetingId)
            .ref("messages/" + "-L-kQ5S_sTpEhNeC92Ky");

        this.state = { messages: undefined };
    }

    componentDidMount() {
        this.ref.on("value", (snapshot) => {
            this.setState({ messages: snapshot.val() });
        });
    }

    render() {
        return (
            <div style={{ height: "100%" }}>
                <div style={{ height: "100%" }}>
                    <div xs={6} style={{ height: "100%", width: "50%", position: "fixed", left: 0, top: 0 }}>
                        <div style={{ height: "50%" }}>
                            <Notes />
                        </div>
                        <div style={{ height: "50%" }}>
                            <Notes />
                        </div>
                        {/* Calendar */}
                        {/* {TaskList} */}
                    </div>
                    <div xs={6} style={{ height: "100%", width: "50%", position: "fixed", left: "50%", top: "0" }}>
                        <Notes
                            user={this.props.currentUser}
                            messages={this.state.messages}
                            dbRef={this.ref}
                        />
                    </div>
                </div>
            </div>
        );
    }
}