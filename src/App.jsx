import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { useDispatch } from 'react-redux';
import { fetchUser } from "./store/features/authSlice";
import AuthRoutes from "./routes/AuthRoutes";
import { getTime } from "./api/time";
import MockDate from "mockdate";

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchTime();
    const interval = setInterval(() => {
      fetchTime();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTime = async () => {
    try {
      const time = await getTime();
      MockDate.set(new Date(time))
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUser())
    }
  }, [accessToken])

  if (currentPath === '/') {
    return <AuthRoutes role={null} />
  }
  return (
    <>
      <Header />
      <div className="body">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
