import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import { Container, Col, Row, Button } from 'reactstrap';
import TaskList from '../components/TaskList';
import ModalExample from '../components/ModalExample.js';

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import { RingLoader } from 'react-spinners';

export default class UserDashboardPage extends Component {

    performAdd() {
        firebase.database().ref("members").child("X6gdgCz7NmPGOVcdQSKgkzXAerk1").child("permissions").set({"-L-kQ5S_sTpEhNeC92Ky" : "HELLOOOO"})
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
            }
        }

        if (this.props.currentUser) {
            return (
                <Container style={styles.container}>
                    <ModalExample buttonLabel={"Open Me"} />
                    <Row style={styles.row}>
                        <Col xs="12">
                            <TaskList currentUser={this.props.currentUser} />
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Button onClick={() => this.performAdd()}></Button>

                    </Row>
                </Container>
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