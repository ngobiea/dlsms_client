import React, { useEffect } from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import ClassRoomsPage from './pages/ClassRoomPages/ClassRoomsPage';
import MonitorPage from './pages/MonitorPages/MonitorPage';
import AssignmentPage from './pages/AssignmentPages/AssignmentPage';
import NotificationPage from './pages/NotificationPages/NotificationPage';
import ReportPage from './pages/ReportPages/ReportPage';
import ClassRoomPage from './pages/ClassRoomPages/ClassRoomPage';
import JoinPage from './pages/ClassRoomPages/Student/JoinPage';
import RootLayout from './pages/RootLayout';
import ClassroomChatRoot from './pages/ClassRoomPages/Classroom/ClassroomChatRoot';
import ClassroomAssignmentRoot from './pages/ClassRoomPages/Assignments/ClassroomAssignmentRoot';
import ClassroomChat from './pages/ClassRoomPages/Classroom/ClassroomChat';
import CreateAssignment from './pages/ClassRoomPages/Assignments/CreateAssignment';
import ClassroomFiles from './pages/ClassRoomPages/Classroom/ClassroomFiles';
import Assigned from './pages/ClassRoomPages/Assignments/Assigned';
import GradedAssignment from './pages/ClassRoomPages/Assignments/GradedAssignment';
import JoinClassroomVerification from './pages/ClassRoomPages/Student/JoinClassroomVerification';

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <ClassRoomsPage /> },
      {
        path: ':classroomId',
        element: <ClassRoomPage />,
        children: [
          {
            path: '',
            element: <ClassroomChatRoot />,
            children: [
              {
                index: true,
                element: <ClassroomChat />,
              },
              {
                path: 'file',
                element: <ClassroomFiles />,
              },
            ],
          },
          {
            path: 'assignment',
            element: <ClassroomAssignmentRoot />,
            children: [
              {
                index: true,
                element: <Assigned />,
              },
              {
                path: 'graded',
                element: <GradedAssignment />,
              },
              {
                path: 'create',
                element: <CreateAssignment />,
              },
              {
                path: ':assignmentId',
              },
            ],
          },
        ],
      },
      {
        path: 'monitor',
        element: <MonitorPage />,
      },
      {
        path: 'assignment',
        element: <AssignmentPage />,
      },
      {
        path: 'notification',
        element: <NotificationPage />,
      },
      {
        path: 'report',
        element: <ReportPage />,
      },
      {
        path: ':classroomId/join',
        element: <JoinPage />,
      },
      {
        path: ':classroomId/image',
        element: <JoinClassroomVerification />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
