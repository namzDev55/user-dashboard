import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store'; // Adjust the path based on your file structure
import './index.css'; // Import Tailwind CSS
import { Amplify, Auth } from 'aws-amplify';
import awsConfig from './external-services/aws-config';

// Configure AWS Amplify

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);