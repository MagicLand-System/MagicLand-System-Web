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
  //router có header, footer:
  {
    path: '/',
    element: <App />,
    children: [{
      element: <AuthRoutes />,
      children: [] //các route phải đăng nhập mới vào được
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
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
