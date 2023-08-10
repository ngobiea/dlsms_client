import React, { createContext, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import { logoutHandler } from '../utils/util';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import {
  useFetchClassroomsQuery,
  setClassrooms,
  setStudents,
  store,
  setMessages,
} from '../store';
import { useDispatch } from 'react-redux';
import { joinClassroomHandler } from '../realTimeCommunication/classroom/joinClassroomHandler';
import { classroomScheduleMessageHandle } from '../realTimeCommunication/classroom/classroom/classroomScheduleMessageHandle';

const userDetails = JSON.parse(localStorage.getItem('user'));
let socket;
// if (userDetails) {
  // const jwtToken = userDetails.token;
  // socket = io('http://localhost:5001', {
  //   auth: {
  //     token: jwtToken,
  //   },
  // });
// }

const RealtimeContext = createContext();

const RealtimeProvider = ({ children }) => {
   const {
     register,
     handleSubmit,
     resetField,
     reset,
     formState: { errors, isSubmitSuccessful },
     setValue,
   } = useForm();
  const { accountType } = store.getState().account;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isSuccess } = useFetchClassroomsQuery(accountType);

  const connectWithSocketServer = () => {
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
    socket.on('online-users', (value) => {
      console.log(value);
    });
    socket.on('connect_error', (err) => {
      console.log(err instanceof Error);
      console.log(err.message);
      console.log(err.data);
    });
    socket.on('update-classroom-members', (value) => {
      joinClassroomHandler(value, navigate);
    });
    socket.on('send-classroom', (value) => {
      store.dispatch(setStudents(value.students));
      store.dispatch(setMessages(value.messages));
    });
    socket.on('classroom-schedule-message', (value) => {
      classroomScheduleMessageHandle(value, navigate);
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
    register,
    handleSubmit,
    resetField,
    reset,
    errors,
    isSubmitSuccessful,
    setValue,
  };

  return (
    <RealtimeContext.Provider value={values}>
      {children}
    </RealtimeContext.Provider>
  );
};

export { RealtimeProvider };
export default RealtimeContext;
