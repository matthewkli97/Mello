import React, { Component } from 'react';
import Notes from '../components/NotesContainer';
import {
    Container,
    Row,
    Col
} from 'reactstrap';


export default class MeetingDashboard extends Component {
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
                    <div xs={6} style={{ height: "100%", width: "50%", position: "fixed", left: "50%", top: "0"}}>
                        <Notes user={this.props.currentUser}/>
                    </div>
                </div>
            </div>
        );
    }
}