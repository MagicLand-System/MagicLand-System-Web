import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { useDispatch } from 'react-redux';
import { fetchUser } from "./store/features/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUser())
    }
  }, [accessToken])
  return (
    <div>
      <Header />
      <div className="body">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
