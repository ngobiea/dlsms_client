import io from 'socket.io-client';
// import { fetchClassroom } from '../store';
import { classroomApi } from '../store/apis/classroomsApi';
import { store } from '../store';
import { setUsers, addClassroom, setStudents } from '../store';
let socket = null;

export const connectWithSocketServer = (userDetails, navigate) => {
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
  socket.on('update-classroom-members', (data) => {
    console.log('received update-classroom-members event');
      const userId = JSON.parse(localStorage.getItem('user')).userId;

    const { classroom, students, studentId } = data;
    const { classroomId, classrooms } = store.getState().classroom;
    const { accountType } = store.getState().account;
    const foundClassroom = classrooms.find(
      (classR) => classR._id.toString() === classroom._id.toString()
    );
    if (foundClassroom) {
      store.dispatch(classroomApi.endpoints.fetchClassroom.initiate);
      if (classroomId === classroom._id.toString() && userId !== studentId) {
        store.dispatch(setStudents(students));
      }
      const notification = new window.Notification(
        `New Student Join ${classroom.name}`,
        {
          body: `${studentId} has join ${classroom.name}`,
        }
      );
      notification.onclick = () => {
        navigate(`/${classroom._id.toString()}`);
      };
    } else {
      if (userId === studentId) {
        store.dispatch(addClassroom(classroom));

        const notification = new window.Notification(
          `Successfully joined ${classroom.name}`,
          {
            body: `Welcome to ${classroom.name}`,
          }
        );
        notification.onclick = () => {
          navigate('/');
        };
      }
    }
  });
};
