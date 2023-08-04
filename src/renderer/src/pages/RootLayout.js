import React from 'react';
import { Outlet } from 'react-router-dom';
import TitleNav from '../components/TitleNav';
import SideBar from '../components/SideBar';
import { RealtimeProvider } from '../context/realtime';

const RootLayout = () => {
  return (
    <RealtimeProvider>
      <div className="relative w-screen h-screen">
        <TitleNav />
        <SideBar />
        <Outlet />
      </div>
    </RealtimeProvider>
  );
};

export default RootLayout;
