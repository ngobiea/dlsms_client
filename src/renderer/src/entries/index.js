import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import { Provider } from 'react-redux';
import 'react-datetime/css/react-datetime.css';
import { store } from '../store';
import { AccountProvider } from '../context/accountContext';
import { HashRouter } from 'react-router-dom';
import { RealtimeProvider } from '../context/realtimeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <Provider store={store}>
      <AccountProvider>
        <RealtimeProvider>
          <App />
        </RealtimeProvider>
      </AccountProvider>
    </Provider>
  </HashRouter>
);
