import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TitleNav from '../components/TitleNav';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchClassroomsQuery, setClassrooms } from '../store';
import SideBar from '../components/SideBar';
import { connectWithSocketServer } from '../realTimeCommunication/socketConnection';

const RootLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accountType } = useSelector((state) => {
    return state.account;
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
      connectWithSocketServer(JSON.parse(userDetails), navigate);
    }
  }, [isSuccess]);
  return (
    <div className="relative w-screen h-screen">
      <TitleNav />
      <Outlet />
      <SideBar />
    </div>
  );
};

export default RootLayout;
