import React, { createContext, useEffect } from 'react';
import io from 'socket.io-client';
import { logoutHandler } from '../utils/util';
import { useNavigate } from 'react-router-dom';
import {
  useFetchClassroomsQuery,
  setClassrooms,
  setStudents,
  addClassroom,
  store,
} from '../store';
import { useDispatch } from 'react-redux';
const userDetails = JSON.parse(localStorage.getItem('user'));
let socket;
if (userDetails) {
  const jwtToken = userDetails.token;
  socket = io('http://localhost:5001', {
    auth: {
      token: jwtToken,
    },
  });
}

const RealtimeContext = createContext();

const RealtimeProvider = ({ children }) => {
  const { accountType } = store.getState().account;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isSuccess } = useFetchClassroomsQuery(accountType);

  const connectWithSocketServer = () => {
    const { classrooms, classroomId } = store.getState().classroom;
    const { accountType } = store.getState().account;

    socket.on('connect', () => {
      console.log('successfully connected with socket.io server');
      console.log(socket.id);
    });
    socket.on('online-users', (value) => {
      console.log(value);
    });
    socket.on('connect_error', (err) => {
      console.log(err instanceof Error);
      console.log(err.message);
      console.log(err.data);
    });
    socket.on('update-classroom-members', (value) => {
      console.log('received update-classroom-members event');
      const userId = JSON.parse(localStorage.getItem('user')).userId;

      const { classroom, students, studentId } = value;

      const foundClassroom = classrooms.find(
        (classR) => classR._id.toString() === classroom._id.toString()
      );

      if (foundClassroom) {
        if (
          classroomId === classroom._id.toString() &&
          accountType === 'tutor'
        ) {
          dispatch(setStudents(students));
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
          dispatch(addClassroom(classroom));

          const notification = new window.Notification(
            `Successfully joined ${classroom.name}`,
            {
              body: `Welcome to ${classroom.name}`,
            }
          );
          notification.onclick = () => {
            navigate();
          };
        }
      }
    });
    socket.on('send-classroom', (value) => {
      console.log('received send-classroom event');
      console.log(value);
      store.dispatch(setStudents(value.students));
    });
  };

  useEffect(() => {
    if (!userDetails) {
      logoutHandler();
    }
    if (isSuccess) {
      dispatch(setClassrooms(data.classrooms));
      connectWithSocketServer();
    }
  }, [data, isSuccess]);
  const values = {
    socket,
  };
  return (
    <>
      <RealtimeContext.Provider value={values}>
        {children}
      </RealtimeContext.Provider>
    </>
  );
};

export { RealtimeProvider, socket };
export default RealtimeContext;
