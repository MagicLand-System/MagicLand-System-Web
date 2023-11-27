import React, { useEffect, useState } from "react";
// CSS
import styles from "./Header.module.css";
// className={styles["header"]}
import { MegaMenu } from "primereact/megamenu";
import { Dropdown } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import logo from "../../../assets/images/magicLandLogo.png";
import avt from "../../../assets/images/avt.jpg";
import { Link, useNavigate } from "react-router-dom";
export default function HeaderComponent() {
  const navigate = useNavigate();
  const [selectOptionAvt, setSelectOptionAvt] = useState(null);
  const dropdownAvt = [
    {
      name: (
        <span
          onClick={() => {
            navigate("#");
          }}
        >
          Thông tin học viên
        </span>
      ),
    },
    {
      name: (
        <span
          onClick={() => {
            navigate("#");
          }}
        >
          Học Viên
        </span>
      ),
    },
    {
      name: (
        <span
          onClick={() => {
            navigate("#");
          }}
        >
          Lịch Học
        </span>
      ),
    },
    {
      name: (
        <span
          onClick={() => {
            navigate("#");
          }}
        >
          Đổi Mật Khẩu
        </span>
      ),
    },
    {
      name: (
        <span
          onClick={() => {
            navigate("#");
          }}
        >
          Đăng Xuất
        </span>
      ),
    },
  ];
  const items = [
    {
      label: (
        <span
          onClick={() => {
            localStorage.setItem("activePage", "HomePage");
            navigate("/");
          }}
          style={{
            color:
              localStorage.getItem("activePage") === "HomePage"
                ? "yellow"
                : "#fff",
            margin: "0px 10px",
            fontWeight:
              localStorage.getItem("activePage") === "HomePage" ? "bold" : null,
          }}
        >
          Trang chủ
        </span>
      ),
    },
    {
      label: (
        <span
          onClick={() => {
            localStorage.setItem("activePage", "Course");
            navigate("/course");
          }}
          style={{
            color:
              localStorage.getItem("activePage") === "Course"
                ? "yellow"
                : "#fff",
            margin: "0px 10px",
            fontWeight:
              localStorage.getItem("activePage") === "Course" ? "bold" : null,
          }}
        >
          Khóa học
        </span>
      ),
    },
    {
      label: (
        <span
          style={{
            color:
              localStorage.getItem("activePage") === "Event"
                ? "yellow"
                : "#fff",
            margin: "0px 10px",
            fontWeight:
              localStorage.getItem("activePage") === "Event" ? "bold" : null,
          }}
        >
          Sự kiện
        </span>
      ),
    },
    {
      label: (
        <span
          style={{
            color:
              localStorage.getItem("activePage") === "About"
                ? "yellow"
                : "#fff",
            margin: "0px 10px",
            fontWeight:
              localStorage.getItem("activePage") === "HomePage" ? "bold" : null,
          }}
        >
          Về chúng tôi
        </span>
      ),
    },
  ];
  const start = (
    <div className="flex justify-content-center align-items-center">
      <img alt="logo" src={logo} height="100" className="mr-2 ml-5"></img>
      <p className="text-3xl mr-3">
        &ensp;
        <span className={`${styles.m} ${styles.logoSpan}`}>m</span>
        <span className={`${styles.a} ${styles.logoSpan}`}>a</span>
        <span className={`${styles.g} ${styles.logoSpan}`}>g</span>
        <span className={`${styles.i} ${styles.logoSpan}`}>i</span>
        <span className={`${styles.c} ${styles.logoSpan}`}>c</span>&nbsp;
        <span className={`${styles.l} ${styles.logoSpan}`}>l</span>
        <span className={`${styles.a} ${styles.logoSpan}`}>a</span>
        <span className={`${styles.n} ${styles.logoSpan}`}>n</span>
        <span className={`${styles.d} ${styles.logoSpan}`}>d</span>
      </p>
    </div>
  );
  const end = (
    <div className="flex justify-content-center align-items-center mr-5 w-auto gap-4">
      <Link style={{ textDecoration: "none", color: "#fff" }} to="/cart">
        <i
          className="pi pi-shopping-cart p-overlay-badge"
          style={{ fontSize: "2rem" }}
        >
          <Badge style={{ background: "red" }} value="1" />
        </i>
      </Link>
      <Dropdown
        value={selectOptionAvt}
        onChange={(e) => setSelectOptionAvt(e.value)}
        options={dropdownAvt}
        optionLabel="name"
        placeholder={
          <div className="flex justify-content-center align-items-center gap-2">
            <Avatar
              className="w-auto h-auto"
              image={avt}
              size="small"
              shape="circle"
            />
            <p className="text-md font-bold text-gray-900">Ngô Gia Thưởng</p>
          </div>
        }
        className="w-auto md:w-16rem bg-orange-400 border-none "
      />
    </div>
  );
  useEffect(() => {});
  /*
  Func 
  */

  return (
    <MegaMenu
      style={{
        "background-color": "rgb(59, 12, 166)",
        color: "#fff",
      }}
      pt={{
        headerAction: ({ context }) => ({
          className: context.active
            ? "hover:bg-orange-400"
            : "hover:bg-orange-400",
        }),
      }}
      model={items}
      orientation="horizontal"
      start={start}
      end={end}
      breakpoint="960px"
    />
  );
}
