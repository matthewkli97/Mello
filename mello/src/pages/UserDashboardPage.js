import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import { Container, Col, Row } from 'reactstrap';
import TaskList from '../components/TaskList';
import { MeetingModal } from '../components/Modal.js';

export default class LoginPage extends Component {

    render() {

        const styles = {
            row : {
                height: "50%"
            },
            container: {
                height: "100%"
            }
        }

        return (
            <Container style={styles.container}>
                <MeetingModal />
                <Row style={styles.row}>
                    <Col xs="12">
                        <TaskList />                                           
                    </Col>
                </Row>
                <Row style={styles.row}>
                    
                </Row>
            </Container>
        );
    }
}