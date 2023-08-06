import React from 'react';
import ClassroomNav from '../../components/classrooms/ClassRoomNav';
import { useSelector } from 'react-redux';
import ClassRooms from '../../components/classrooms/Classrooms';
import CreateClassroomForm from '../../components/classrooms/CreateClassroomForm';
import JoinClassroomForm from '../../components/classrooms/JoinClassroomForm';
const ClassRoomsPage = () => {
  const { isCreateClassroom, isJoinClassroom } = useSelector((state) => {
    return state.modal;
  });

  return (
    <>
      <ClassroomNav />
      {isCreateClassroom && <CreateClassroomForm />}
      {isJoinClassroom && <JoinClassroomForm />}
      <ClassRooms />
    </>
  );
};

export default ClassRoomsPage;
