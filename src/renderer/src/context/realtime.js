import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { logoutHandler } from '../utils/util';
import { useNavigate } from 'react-router-dom';
import { setStudents, addClassroom } from '../store';
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

  useEffect(() => {
    const userDetails = localStorage.getItem('user');
    if (!userDetails) {
      logoutHandler();
    } else {
      if (classrooms.length !== 0) {
        connectWithSocketServer(JSON.parse(userDetails));
      }
    }
  }, [classrooms]);
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

      console.log('classrooms from realtime context');
      console.log(classrooms);
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
      const { classroom, students, studentId } = data;

      const foundClassroom = classrooms.find(
        (classR) => classR._id.toString() === classroom._id.toString()
      );

      if (foundClassroom) {
        if (accountType === 'tutor') {
          dispatch(setStudents(students));
        }
        const notification = new window.Notification(
          `New Student Joined ${foundClassroom.name}`,
          {
            body: `${studentId} has join First Classroom`,
          }
        );
        notification.onclick = () => {
          navigate(`/${foundClassroom._id.toString()}`);
        };
        notification.onclose = () => console.log('Closed');
      } else if (accountType === 'student') {
        dispatch(addClassroom(classroom));
        const notification = new window.Notification(
          `Success Joining ${foundClassroom.name}`,
          {
            body: `Welcome to ${foundClassroom.name}`,
          }
        );
        notification.onclick = () => {
          navigate(`/${foundClassroom._id.toString()}`);
        };
      }
    });
  };
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

export { RealtimeProvider };
export default RealtimeContext;
