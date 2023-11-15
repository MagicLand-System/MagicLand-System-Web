import React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

export default function App() {

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
