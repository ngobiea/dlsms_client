import io from 'socket.io-client';
import { store } from '../store';
import { setUsers } from '../store';
let socket = null;

export const connectWithSocketServer = (userDetails) => {
  const jwtToken = userDetails.token;

  socket = io('http://localhost:5001', {
    auth: {
      token: jwtToken,
    },
  });

  socket.on('connect', () => {
    console.log('successfully connected with socket.io server');
  });
  socket.on('online-users', (data) => {
    const { onlineUsers } = data;
    store.dispatch(setUsers(onlineUsers));
  });
  socket.on('connect_error', (err) => {
    console.log(err instanceof Error);
    console.log(err.message);
    console.log(err.data);
  });
  socket.on('update-classroom-members', data => {
    console.log('received update-classroom-members event')
    console.log(data)
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    console.log(userId)
  })
};
