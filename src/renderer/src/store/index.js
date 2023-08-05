import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  accountReducer,
  changeAccountType,
  changeEmail,
  login,
  logout,
} from './slices/accountsSlice';
import {
  modalReducer,
  setCreateAssignment,
  setCreateClassroom,
  setJoinClassroom,
  setShowCode,
  setShowSchedule,
  setShowScheduleForm,
} from './slices/modalSlices';

import {
  classroomReducer,
  setClassRoomId,
  setName,
  setDescription,
  setCode,
  setTuTor,
  setStudents,
  addStudent,
  setClassrooms,
  addClassroom
} from './slices/classroomSlice';

import { assignmentReducer } from './slices/assignmentSlice';

import {
  appReducer,
  setIsWebcamActive,
  setVerificationResult,
  setPercentageCount,
  setEndDate,
  setStartDate,
} from './slices/appSlice';

import { chatReducer, addMessage, setMessages } from './slices/chatSlice';

import { accountApi } from './apis/accountsApi';
import { classroomApi } from './apis/classroomsApi';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    account: accountReducer,
    classroom: classroomReducer,
    assignment: assignmentReducer,
    app: appReducer,
    chat: chatReducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [classroomApi.reducerPath]: classroomApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(accountApi.middleware)
      .concat(classroomApi.middleware);
  },
});

setupListeners(store.dispatch);

export {
  store,
  // account slices
  changeAccountType,
  changeEmail,
  logout,
  login,
  // modal slices
  setCreateAssignment,
  setCreateClassroom,
  setJoinClassroom,
  setShowCode,
  setShowSchedule,
  setShowScheduleForm,

  //app slices
  setIsWebcamActive,
  setVerificationResult,
  setPercentageCount,
  setEndDate,
  setStartDate,

  //classroom Slice
  setStudents,
  setTuTor,
  setCode,
  setDescription,
  setName,
  setClassRoomId,
  addStudent,
  setClassrooms,
  addClassroom,

  //chat slice
  addMessage,
  setMessages,
};

// Account Apis
export {
  useLoginUserMutation,
  useSignupUserMutation,
  useResendEmailVerificationMutation,
} from './apis/accountsApi';

// Classroom Apis
export {
  useCreateClassroomMutation,
  useFetchClassroomsQuery,
  useFetchClassroomQuery,
  useVerifyClassroomCodeMutation,
  usePostJoinClassroomMutation,
  usePostScheduleClassSessionMutation,
} from './apis/classroomsApi';