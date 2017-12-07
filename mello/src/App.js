import React, { Component } from 'react';
import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Route, Switch, Redirect, NavLink } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import firebase from 'firebase/app';


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
    let renderLoginPage = (routerProps) => {
      return <LoginPage {...routerProps} signoutHandle={() => this.handleSignOut()} newAccount={false} currentUser={this.state.user} />
    };

    let renderSignupPage = (routerProps) => {
      return <LoginPage {...routerProps} signoutHandle={() => this.handleSignOut()} newAccount={true} currentUser={this.state.user} />
    };

    return (
      <BrowserRouter basename={process.env.PUBLIC_URL + '/'}>
        <Switch>
          <Route exact path='/login' component={renderLoginPage} />
          <Route exact path='/signup' component={renderSignupPage} />
          <Redirect to="/welcome" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
