import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect, NavLink, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import MeetingDashboardPage from './pages/MeetingDashboardPage';

import { Container } from 'reactstrap'

import firebase from 'firebase/app';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: firebase.auth().currentUser
    }
  }

  componentDidMount() {
    this.unregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.setState({ user: firebaseUser });
        firebase.database().ref("members").child(firebaseUser.uid).child("displayName").set(firebaseUser.displayName);
      } else {
        this.setState({ user: null });
      }
    });
  }
  // Sign out handle to log user out of application
  handleSignOut() {
    this.setState({ errorMessage: null }); //clear any old errors

    /* TODO: sign out user here */
    firebase.auth().signOut()
      .catch((err) => console.log(err.message));
  }

  render() {

    const styles = {
      page: {
        height: "100%",
        width: "100%"
      }
    }

    let renderLoginPage = (routerProps) => {
      return <LoginPage {...routerProps} signoutHandle={() => this.handleSignOut()} newAccount={false} currentUser={this.state.user} />
    };

    let renderSignupPage = (routerProps) => {
      return <LoginPage {...routerProps} signoutHandle={() => this.handleSignOut()} newAccount={true} currentUser={this.state.user} />
    };

    let renderUserdashboardPage = (routerProps) => {
      return <UserDashboardPage {...routerProps} signoutHandle={() => this.handleSignOut()} currentUser={this.state.user} />
    };

    let renderMeetingDashboardPage = (routerProps) => {
      return <MeetingDashboardPage {...routerProps} signoutHandle={() => this.handleSignOut()} currentUser={this.state.user} />
    };

    return (
      <BrowserRouter basename={process.env.PUBLIC_URL + '/'}>
        <div style={styles.page}>
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100 }}>
            <nav class="navbar bg-dark" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
              <a class="navbar-brand" href="#"><Link style={{ color: "white" }} to='/'>Mello</Link></a>
            </nav>
          </div>
          {
            this.state.user !== null &&
            <Switch>
              <Route exact path='/welcome' component={renderUserdashboardPage} />
              <Route exact path="/meeting/:meetingId" component={renderMeetingDashboardPage} />
              <Redirect to="/welcome" />
            </Switch>
          }
          {
            this.state.user === null &&
            <Switch>
              <Route exact path='/login' component={renderLoginPage} />
              <Route exact path='/signup' component={renderSignupPage} />
              <Redirect to="/login" />
            </Switch>
          }
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
