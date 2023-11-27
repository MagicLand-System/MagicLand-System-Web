import React from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeflex/primeflex.css"; // css utility
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/User";
import HomePageComponent from "../components/User/HomePage";
import CourseComponent from "../components/User/Course";
import DetailCourseComponent from "../components/User/Course/Detail";
import ListClassComponent from "../components/User/Course/ListClass";
import DetailClassComponent from "../components/User/Course/ListClass/Detail";
import PaymentComponent from "../components/User/Payment";
import PaymentConfirmComponent from "../components/User/Payment/PaymentConfirm";
import CartComponent from "../components/User/Cart";
export default function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route path="" element={<HomePageComponent />} />
          {/* Course */}
          <Route path="course" element={<CourseComponent />} />
          <Route path="course/detail/:id" element={<DetailCourseComponent />} />
          <Route path="course/listClass" element={<ListClassComponent />} />
          <Route path="class/detail" element={<DetailClassComponent />} />
          {/* Payment */}
          <Route path="payment" element={<PaymentComponent />} />
          <Route
            path="payment/paymentConfirm"
            element={<PaymentConfirmComponent />}
          />
          {/* Cart */}
          <Route path="cart" element={<CartComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
