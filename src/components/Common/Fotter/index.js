import React from "react";
import styles from "./Footer.module.css";
import logo from "../../../assets/images/magicLandLogo.png";
export default function FooterComponent() {
  return (
    <div
      className="flex justify-content-center gap-4"
      style={{
        "background-color": "rgb(59, 12, 166)",
        color: "#fff",
        width: "100%",
      }}
    >
      <div className="grid w-full align-items-center ">
        <div class="col-4">
          <div class="text-center p-3 border-round-sm font-bold ">
            <div className="flex justify-content-center align-items-center">
              <img
                alt="logo"
                src={logo}
                height="100"
                className="mr-2 ml-5"
              ></img>
              <p className="text-3xl mr-3">
                &ensp;
                <span className={`${styles.m} ${styles.logoSpan}`}>m</span>
                <span className={`${styles.a} ${styles.logoSpan}`}>a</span>
                <span className={`${styles.g} ${styles.logoSpan}`}>g</span>
                <span className={`${styles.i} ${styles.logoSpan}`}>i</span>
                <span className={`${styles.c} ${styles.logoSpan}`}>c</span>
                &nbsp;
                <span className={`${styles.l} ${styles.logoSpan}`}>l</span>
                <span className={`${styles.a} ${styles.logoSpan}`}>a</span>
                <span className={`${styles.n} ${styles.logoSpan}`}>n</span>
                <span className={`${styles.d} ${styles.logoSpan}`}>d</span>
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="text-center p-3 border-round-sm font-bold ">
            <p>MAGICLAND cung cấp các dạng khóa học và sự kiện cho trẻ.</p>
          </div>
        </div>
        <div className="col">
          <div
            style={{ marginLeft: "35%" }}
            className="p-3 border-round-sm font-bold "
          >
            <h4>MagicLand</h4>
            <ul className="list-none p-0">
              <li className="mb-2">Về chúng tôi</li>
              <li className="mb-2">Khóa học</li>
              <li className="mb-2">Sự kiện</li>
              <li className="mb-2">Đánh giá</li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className=" p-3 border-round-sm  font-bold ">
            <h4>Thông Tin Liên Lạc</h4>
            <p>SDT: +84999999999</p>
            <p>Địa chỉ: Quận 1, Tp HCM</p>
            <p>Email: magicland@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
