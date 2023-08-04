import React from "react";
import logo from '../../public/images/dlsms2.png'
import '../../public/css/App.css'
const TitleNav = () => {

  return (
    <nav className="absolute inset-x-0 top-0 z-40 h-10 bg-title titleD">
      <span className="self-center text-xl pl-2  font-semibold  whitespace-nowrap text-white">
        DLSMS
      </span>
    </nav>
  );
};

export default TitleNav;
