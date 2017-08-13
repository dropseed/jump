import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import path from 'path'
import os from 'os'

const networkInterface = createNetworkInterface({
  uri: 'https://api.github.com/graphql'
});

const userSettings = require('electron').remote.require(path.join(os.homedir(), '.jump.js'))
const token = userSettings.config.github_access_token

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token');
    req.options.headers.authorization = token ? `bearer ${token}` : null;
    next();
  }
}]);

const client = new ApolloClient({
  networkInterface: networkInterface
});

ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
