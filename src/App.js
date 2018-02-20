import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    user: null,
    message: null,
  }

  componentDidMount() {
    axios.get('/api/user-data').then(response => {
      this.setState({
        user: response.data.user,
      });
    }).catch(error => {
      this.setState({
        message: error.message,
      });
    });
  }

  logout = () => {
    axios.post('/api/logout').then(response => {
      this.setState({
        user: response.data.user,
      });
    }).catch(error => {
      this.setState({
        message: error.message,
      });
    });
  }

  render() {
    const { user, message } = this.state;

    return (
      <div className="app">
        {user ?
          <div>
            You are logged in. Your info is:
            <div>
              <pre>
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div><button onClick={this.logout}>Log out</button></div>
          </div>
        :
          <div>
            <div>Please <a href={`https://${process.env.REACT_APP_AUTH0_DOMAIN}/login?client=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email`}>login</a></div>
          </div>
        }
        <div className="message">{message}</div>
      </div>
    );
  }
}

export default App;
