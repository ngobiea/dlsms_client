import React from 'react';
import { Link } from 'react-router-dom';
import ClassRoomCard from './ClassRoomCard';
import { useSelector } from 'react-redux';
const ClassRooms = () => {
    const { classrooms } = useSelector((state) => {
    return state.classroom;
  });
  return (
    <div className="pl-28 pr-8 pt-36 bg-gray-100 h-screen">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {classrooms &&
          classrooms.map((item) => {
            return (
              <Link to={`${item._id.toString()}`} key={item._id}>
                <ClassRoomCard title={item.name} classroom={item} />
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default ClassRooms;
