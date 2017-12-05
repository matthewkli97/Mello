import React, { Component } from 'react';
import AuthProvider from '../components/AuthProvider';
import { Redirect, Link} from 'react-router-dom';
import firebase from 'firebase/app';
import {Container, Button} from 'reactstrap';

export default class LoginPage extends Component {

    render() {
        const styles = {
            image : {
                marginLeft: "auto",
                marginRight: "auto",
                width: "35%",
                maxWidth: 300,
                height: "auto"
            },
            container : {
                textAlign: "center"
            }
        }

        //if (this.props.currentUser === null) {
            return (
                <Container style={styles.container}>
                    {this.props.newAccount && 
                    <div>
                        <h1>Hey! Join the conversation!</h1>
                        <h2>Let's get you logged in...</h2>
                    </div>
                    } 
                    {!this.props.newAccount &&

                    <h1>Let's make you an account!</h1>
                    }

                    <img style={styles.image} src="/images/user.png" alt="unknown user"/>
                    <AuthProvider />
                    {
                        this.props.newAccount &&
                        <Link to="/login">I already have an account.</Link>
                    }
                    {
                        !this.props.newAccount &&
                        <Link to="/signup">I don't have an account.</Link>
                    }

                    <Button onClick={() => this.props.signoutHandle()}>Sign Me Out</Button>
                </Container>
            );
        /*} else {
            return (
                <Redirect to='/welcome' />
            );
        } */
    }
}