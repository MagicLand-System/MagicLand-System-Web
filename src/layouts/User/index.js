import React from "react";
import { Outlet } from "react-router-dom";
import HeaderComponent from "../../components/Common/Header";
import FooterComponent from "../../components/Common/Fotter";
export default function UserLayout() {
  return (
    <div className="flex flex-column h-full">
      <HeaderComponent />
      <Outlet />
      <FooterComponent />
    </div>
  );
}
