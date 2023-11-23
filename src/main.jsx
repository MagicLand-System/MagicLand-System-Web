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

const router = createBrowserRouter([
  //Router đã đăng nhập thì k vào được, k có header, footer
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
  {
    path: "/error404",
    element: <Error404 />,
  },
  //router có header, footer:
  {
    path: '/',
    element: <App />,
    errorElement: <Error404 />,
    children: [{
      element: <AuthRoutes />,
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
      ] //các route phải đăng nhập mới vào được
    },
      // các route đăng nhập hay không vẫn vào được
      // {
      //   path: '/...',
      //   element: </>
      // }
    ]
  }
]
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
