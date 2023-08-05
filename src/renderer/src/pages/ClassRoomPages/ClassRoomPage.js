import React, { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import ClassRoomSideBar from '../../components/classrooms/ClassRoomSideBar';
import ClassroomCode from '../../components/classrooms/ClassroomCode';
import ScheduleClassSession from '../../components/classrooms/ClassSession/ScheduleClassSession';
import './classroomPage.css';
import {
  useFetchClassroomQuery,
  setStudents,
  setTuTor,
  setName,
  setCode,
  setDescription,
  setShowSchedule,
  setClassRoomId,
  setMessages,
} from '../../store';
import { useSelector, useDispatch } from 'react-redux';

const ClassRoomPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { classroomId } = params;

  const { accountType } = useSelector((state) => {
    return state.account;
  });
  const { classrooms } = useSelector((state) => {
    return state.classroom;
  });
  const { data, isSuccess } = useFetchClassroomQuery({
    accountType,
    classroomId,
  });

  useEffect(() => {
    if (isSuccess) {
      const { name, code, tutor, description, students } = data.classroom;
      dispatch(setName(name));
      dispatch(setTuTor(tutor));
      dispatch(setStudents(students));
      dispatch(setCode(code));
      dispatch(setDescription(description));
      dispatch(setClassRoomId(classroomId));
      dispatch(setMessages(data.classroom.messages));
    }
    console.log('classrooms from classroom page')
    console.log(classrooms)
  }, [isSuccess]);
  const { isShowCode, isShowSchedule, isShowScheduleForm } = useSelector(
    (state) => {
      return state.modal;
    }
  );

  return (
    <div
      className="fixed inset-0 z-0 mt-10 ml-20 flex"
      onClick={() => {
        if (isShowSchedule) {
          dispatch(setShowSchedule(false));
        }
      }}
    >
      {isSuccess && <ClassRoomSideBar classroom={data.classroom} />}
      <Outlet />
      {isSuccess && isShowCode && <ClassroomCode classroom={data.classroom} />}
      {isShowScheduleForm && <ScheduleClassSession />}
    </div>
  );
};

export default ClassRoomPage;