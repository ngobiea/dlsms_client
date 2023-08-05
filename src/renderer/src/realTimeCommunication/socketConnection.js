import io from 'socket.io-client';
import { store } from '../store';
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
    console.log(socket.id);
  });
  socket.on('online-users', (data) => {
    const { onlineUsers } = data;
    console.log(onlineUsers);
  });
  socket.on('connect_error', (err) => {
    console.log(err instanceof Error);
    console.log(err.message);
    console.log(err.data);
  });
};


