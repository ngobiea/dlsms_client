import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { logoutHandler } from '../utils/util';
import { useNavigate } from 'react-router-dom';
import { setStudents, useFetchClassroomsQuery, setClassrooms } from '../store';
import { useDispatch, useSelector } from 'react-redux';
let socket = null;
const RealtimeContext = createContext();

const RealtimeProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classrooms } = useSelector((state) => {
    return state.classroom;
  });
  const { accountType } = useSelector((state) => {
    return state.account;
  });
  const { data, isSuccess } = useFetchClassroomsQuery(accountType);
  useEffect(() => {
    if (isSuccess) {
      console.log(data.classrooms);
      dispatch(setClassrooms(data.classrooms));
    }
  }, [isSuccess]);

  useEffect(() => {
    const userDetails = localStorage.getItem('user');
    if (!userDetails) {
      logoutHandler();
    } else {
      connectWithSocketServer(JSON.parse(userDetails));
    }
  }, []);
  const connectWithSocketServer = (userDetails) => {
    const jwtToken = userDetails.token;
    socket = io('http://localhost:5001', {
      auth: {
        token: jwtToken,
      },
    });
    socket.on('connect', () => {
      console.log('successfully connected with socket.io server');
      console.log(socket.id);
      console.log(accountType);
    });
    socket.on('online-users', (data) => {
      const { onlineUsers } = data;
      console.log(data);
    });
    socket.on('connect_error', (err) => {
      console.log(err instanceof Error);
      console.log(err.message);
      console.log(err.data);
    });
    socket.on('update-classroom-members', (data) => {
      const { classroomId, students, studentId } = data;
      const classroom = classrooms.find(
        (classroom) => classroom._id.toString() === classroomId
      );
      if (classroom) {
        if (classroom.id === data.classroomId && accountType === 'tutor') {
          dispatch(setStudents(students));
        }
        const notification = new window.Notification(
          `New Student Joined ${classroom.name}`,
          {
            body: `${studentId} has join First Classroom`,
          }
        );
        notification.onclick = () => {
          navigate(`/${classroom.id}`);
        };
        notification.onclose = () => console.log('Closed');
      }
    });
  };
  const values = {
    socket,
  };
  return (
    <RealtimeContext.Provider value={values}>
      {children}
    </RealtimeContext.Provider>
  );
};

export { RealtimeProvider };
export default RealtimeContext;
