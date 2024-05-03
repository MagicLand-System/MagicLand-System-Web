import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import locale from 'antd/locale/vi_VN';
import 'dayjs/locale/vi';
import { ConfigProvider } from 'antd'
import Login from './pages/login/Login.jsx'
import AuthRoutes from './routes/AuthRoutes.jsx'
import Register from './pages/register/Register.jsx'
import UnLoginRoutes from './routes/UnLoginRoutes.jsx'
import Error404 from './pages/error404/Error404.jsx'

import ClassManagement from './pages/classManagement/ClassManagement.jsx'
import ClassDetail from './pages/classManagement/classDetail/ClassDetail.jsx'
import TransactionManagement from './pages/transactionManagement/TransactionManagement.jsx'
import AttendanceManagement from './pages/attendanceManagement/AttendanceManagement.jsx'
import AttendanceDetail from './pages/attendanceManagement/attendanceDetail/AttendanceDetail.jsx'
import MakeUpClass from './pages/attendanceManagement/makeUpClass/MakeUpClass.jsx'
import CourseManagement from './pages/courseManagement/CourseManagement.jsx'
import ChangeClass from './pages/classManagement/changeClass/ChangeClass.jsx'
import AddCourse from './pages/courseManagement/addCourse/AddCourse.jsx'
import CourseDetail from './pages/courseManagement/courseDetail/CourseDetail.jsx'
import SyllabusManagement from './pages/syllabusManagement/SyllabusManagement.jsx'
import AddSyllabus from './pages/syllabusManagement/addSyllabus/AddSyllabus.jsx'
import SyllabusDetail from './pages/syllabusManagement/syllabusDetail/SyllabusDetail.jsx'
import RoomManagement from './pages/roomManagement/RoomManagement.jsx'
import LecturerManagement from './pages/lecturerManagement/LecturerManagement.jsx'
import CourseRegister from './pages/courseRegister/CourseRegister.jsx'
import CourseRegisterDetail from './pages/courseRegister/courseRegisterDetail/CourseRegisterDetail.jsx'
import RegisterCourse from './pages/courseRegister/register/RegisterCourse.jsx'
import NetworkStatusIndicator from './components/networkStatusIndicator/NetworkStatusIndicator.jsx'
import ImportClasses from './pages/classManagement/importClasses/ImportClasses.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import StudentManagement from './pages/studentManagement/StudentManagement.jsx'
import ViewStudentClasses from './pages/studentManagement/viewStudentClasses/ViewStudentClasses.jsx'
import StaffManagement from './pages/staffManagement/StaffManagement.jsx'
import ViewStudentMakeUp from './pages/studentManagement/viewStudentMakeUp/ViewStudentMakeUp.jsx'
import ViewStudentReserve from './pages/studentManagement/viewStudentReserve/ViewStudentReserve.jsx'

const router = createBrowserRouter([
  //Route đã đăng nhập thì k vào được, k có header, footer
  {
    element: <UnLoginRoutes />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
    ]
  },
  //error route
  {
    path: "/error404",
    element: <Error404 />,
  },
  //route có header, footer:
  {
    path: '/',
    element: <App />,
    errorElement: <Error404 />,
    children: [
      //các route phải đăng nhập mới vào được
      {
        element: <AuthRoutes role='STAFF' />,
        children: [
          {
            path: '/class-management',
            element: <ClassManagement />
          },
          {
            path: '/class-management/import-classes',
            element: <ImportClasses />
          },
          {
            path: '/class-management/detail/:id',
            element: <ClassDetail />
          },
          {
            path: '/transaction-management',
            element: <TransactionManagement />
          },
          {
            path: '/attendance-management',
            element: <AttendanceManagement />
          },
          {
            path: '/attendance-management/check-attendance/:id',
            element: <AttendanceDetail />
          },
          {
            path: '/course-register',
            element: <CourseRegister />
          },
          {
            path: '/course-register/detail/:id',
            element: <CourseRegisterDetail />
          },
          {
            path: '/course-register/register',
            element: <RegisterCourse />
          },
          {
            path: '/student-management',
            element: <StudentManagement />
          },
          {
            path: '/student-management/view-classes/:studentId',
            element: <ViewStudentClasses />
          },
          {
            path: '/student-management/view-classes/:studentId/change-class/:classId',
            element: <ChangeClass />
          },
          {
            path: '/student-management/view-classes/:studentId/make-up-class/:scheduleId',
            element: <MakeUpClass />
          },
          {
            path: '/student-management/view-make-up',
            element: <ViewStudentMakeUp />
          },
          {
            path: '/student-management/view-reserve',
            element: <ViewStudentReserve />
          },
          {
            path: '/student-management/view-reserve/:studentId/register/:courseId',
            element: <ChangeClass />
          },
        ]
      },
      {
        element: <AuthRoutes role='ADMIN' />,
        children: [
          {
            path: '/course-management',
            element: <CourseManagement />
          },
          {
            path: '/course-management/detail/:id',
            element: <CourseDetail />
          },
          {
            path: '/course-management/add-course',
            element: <AddCourse />
          },
          {
            path: '/course-management/update-course/:id',
            element: <AddCourse />
          },
          {
            path: '/syllabus-management',
            element: <SyllabusManagement />
          },
          {
            path: '/syllabus-management/detail/:id',
            element: <SyllabusDetail />
          },
          {
            path: '/syllabus-management/add-syllabus',
            element: <AddSyllabus />
          },
          {
            path: '/syllabus-management/update-syllabus/:id',
            element: <AddSyllabus />
          },
          {
            path: '/room-management',
            element: <RoomManagement />
          },
          {
            path: '/lecturer-management',
            element: <LecturerManagement />
          },
        ]
      },
      {
        element: <AuthRoutes role='STAFF ADMIN' />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />
          },
          {
            path: '/staff-management',
            element: <StaffManagement />
          },
        ]
      },
    ]
  }
]
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ConfigProvider
      locale={locale}
      theme={{
        components: {
          Table: {
            headerBg: "#430fbb",
            headerColor: "#fff",
            headerSortHoverBg: "#6d3ae6",
            headerSortActiveBg: "#6d3ae6",
            headerFilterHoverBg: "#6d3ae6",
          },
        },
      }}
    >
      <NetworkStatusIndicator />
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>
)
