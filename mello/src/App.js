import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect, NavLink } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import RenderNotes from './components/NotesContainer';

import firebase from 'firebase/app';

import MeetingDashboard from './pages/MeetingDashboard'

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      user: null
    }
  }

  componentDidMount() {
      this.unregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          this.setState({user: firebaseUser});
        } else {
          this.setState({user: null});
        }
        console.log(this.state.user);
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
      page : {
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

    return (
      <BrowserRouter basename={process.env.PUBLIC_URL + '/'}>
        <Switch>
          <Route exact path='/login' component={renderLoginPage} />
          <Route exact path='/signup' component={renderSignupPage} />
          <Route exact path='/temp' component={MeetingDashboard} />
          <Route exact path='/welcome' component={renderUserdashboardPage} />
          <Route exact path='/notes' component={RenderNotes} />
          <Redirect to="/welcome" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
