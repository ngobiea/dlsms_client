import React from 'react';
import { Outlet } from 'react-router-dom';
import TitleNav from '../components/TitleNav';
import SideBar from '../components/SideBar';

const RootLayout = () => {


  return (
    <div className="relative w-screen h-screen">
      <TitleNav />
      <Outlet />
      <SideBar />
    </div>
  );
};

export default RootLayout;
