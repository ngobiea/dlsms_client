import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import { Provider } from 'react-redux';
import 'react-datetime/css/react-datetime.css';
import { store } from '../store';
import { AccountProvider } from '../context/accountContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AccountProvider>
      <App />
    </AccountProvider>
  </Provider>
);
