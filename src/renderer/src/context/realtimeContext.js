import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { logoutHandler } from '../utils/util';
import { useNavigate } from 'react-router-dom';
import {
  useFetchClassroomsQuery,
  setClassrooms,
  setStudents,
  addClassroom,
} from '../store';
import { useDispatch, useSelector } from 'react-redux';
let socket = null;
const RealtimeContext = createContext();

const RealtimeProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { accountType } = useSelector((state) => {
    return state.account;
  });

  const { classroomId, classrooms } = useSelector((state) => {
    return state.classroom;
  });

  const { data, isSuccess } = useFetchClassroomsQuery(accountType);

  useEffect(() => {
    const userDetails = localStorage.getItem('user');
    if (!userDetails) {
      logoutHandler();
    } else {
    }
    if (isSuccess) {
      const { classrooms } = data;
      dispatch(setClassrooms(classrooms));
      connectWithSocketServer(JSON.parse(userDetails));
    }
  }, [isSuccess]);

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
      console.log('received update-classroom-members event');
      const userId = JSON.parse(localStorage.getItem('user')).userId;

      const { classroom, students, studentId } = data;
    
      const foundClassroom = classrooms.find(
        (classR) => classR._id.toString() === classroom._id.toString()
      );
      
      if (foundClassroom) {
        if (classroomId === classroom._id.toString() && userId !== studentId) {
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
