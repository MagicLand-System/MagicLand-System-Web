import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Login from './pages/login/Login.jsx'
import AuthRoutes from './routes/AuthRoutes.jsx'
import Register from './pages/register/Register.jsx'
import UnLoginRoutes from './routes/UnLoginRoutes.jsx'
import AddStudent from './pages/addStudent/AddStudent.jsx'
import Error404 from './pages/error404/Error404.jsx'
import Student from './pages/student/Student.jsx'
import StudentSchedule from './pages/student/schedule/StudentSchedule.jsx'
import StudentClasses from './pages/student/classes/StudentClasses.jsx'
import StudentEvents from './pages/student/events/StudentEvents.jsx'
import EditStudentInfo from './pages/student/editStudentInfo/EditStudentInfo.jsx'

import HomePageComponent from './pages/User/HomePage'
import CourseComponent from './pages/User/Course'
import DetailCourseComponent from './pages/User/Course/Detail'
import ListClassComponent from './pages/User/Course/ListClass'
import DetailClassComponent from './pages/User/Course/ListClass/Detail'
import PaymentComponent from './pages/User/Payment'
import PaymentConfirmComponent from './pages/User/Payment/PaymentConfirm'
import CartComponent from './pages/User/Cart'
import { PrimeReactProvider } from 'primereact/api'
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

const router = createBrowserRouter([
  //Route đã đăng nhập thì k vào được, k có header, footer
  {
    element: <UnLoginRoutes />, children: [
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
      { //các route phải đăng nhập mới vào được
        element: <AuthRoutes role='PARENT' />,
        children: [
          {
            path: '/add-student',
            element: <AddStudent />
          },
          {
            path: '/students/:id',
            element: <Student />,
            children: [
              {
                path: 'schedule',
                element: <StudentSchedule />
              },
              {
                path: 'classes/:status',
                element: <StudentClasses />
              },
              {
                path: 'events/:status',
                element: <StudentEvents />
              },
              {
                path: 'edit',
                element: <EditStudentInfo />
              },
            ]
          },
        ]
      },
      {
        element: <AuthRoutes role='STAFF' />,
        children: [
          {
            path: '/class-management',
            element: <ClassManagement />
          },
          {
            path: '/class-management/detail/:id',
            element: <ClassDetail />
          },
          {
            path: '/class-management/detail/:classId/change-class/:studentId',
            element: <ChangeClass />
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
            path: '/check-attendance/:id',
            element: <AttendanceDetail />
          },
          {
            path: '/check-attendance/:scheduleId/make-up-class/:studentId',
            element: <MakeUpClass />
          },
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
        ]
      },
      {
        element: <AuthRoutes role='ADMIN' />,
        children: [
          {
            path: '/course-management',
            element: <CourseManagement />
          },
        ]
      },
      // các route đăng nhập hay không vẫn vào được
      {
        element: <AuthRoutes role={null} />,
        children: [
          {
            path: '',
            element: <HomePageComponent />
          },
          //courses
          {
            path: '/course',
            element: <CourseComponent />
          },
          {
            path: '/course/detail/:id',
            element: <DetailCourseComponent />
          },
          {
            path: '/course/listClass',
            element: <ListClassComponent />
          },
          {
            path: '/class/detail',
            element: <DetailClassComponent />
          },
          //payment
          {
            path: '/payment',
            element: <PaymentComponent />
          },
          {
            path: '/payment/paymentConfirm',
            element: <PaymentConfirmComponent />
          },
          //cart
          {
            path: '/cart',
            element: <CartComponent />
          },
        ]
      },

    ]
  }
]
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <PrimeReactProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </PrimeReactProvider>
)
