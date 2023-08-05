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
      // console.log(accountType);
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
      console.log('update-classroom-members event received');
      console.log(accountType);
      const { classroomId, students, studentId } = data;
      console.log('data received');
      console.log(data);
      console.log('all classrooms');
      console.log(classrooms);

      const foundClassroom = classrooms.find(
        (classroom) => classroom._id == classroomId
      );
      console.log('found classroom');
      console.log(foundClassroom);
      if (foundClassroom) {
        if (foundClassroom.id === data.classroomId && accountType === 'tutor') {
          dispatch(setStudents(students));
        }
        const notification = new window.Notification(
          `New Student Joined ${foundClassroom.name}`,
          {
            body: `${studentId} has join First Classroom`,
          }
        );
        notification.onclick = () => {
          navigate(`/${foundClassroom.id}`);
        };
        notification.onclose = () => console.log('Closed');
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
