import React from 'react';
import { Outlet } from 'react-router-dom';
import TitleNav from '../components/TitleNav';
import SideBar from '../components/SideBar';
import { RealtimeProvider } from '../context/realtime';

const RootLayout = () => {
  return (
    <div className="relative w-screen h-screen">
      <TitleNav />
      <RealtimeProvider>
        <Outlet />
      </RealtimeProvider>
      <SideBar />
    </div>
  );
};

export default RootLayout;
