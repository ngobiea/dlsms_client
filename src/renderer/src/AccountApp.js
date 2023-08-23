import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/AuthenticationPages/LoginPage';
import SignupPage from './pages/AuthenticationPages/SignupPage';
import axios from 'axios';
const AccountApp = () => {
  useEffect(() => {
    getClassroom();

  }, [getClassroom]);
  const getClassroom = async () => {
    try {
      const response = await axios.get('http://localhost:6001/hello');
      console.log(response);
    } catch (error) {}
  };
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />}></Route>
      <Route path="/" element={<LoginPage />}></Route>
    </Routes>
  );
};

export default AccountApp;
