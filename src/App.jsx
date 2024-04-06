import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { useDispatch } from 'react-redux';
import { fetchUser } from "./store/features/authSlice";
import AuthRoutes from "./routes/AuthRoutes";

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname
  const accessToken = localStorage.getItem('accessToken');
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
