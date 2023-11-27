import { Button } from "primereact/button";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PaymentComponent() {
  const navigate = useNavigate();
  const navigateBack = () => {
    // Use the navigate function to go back to the previous page
    navigate(-1);
  };
  return (
    <>
      {/* Breadcrumb */}
      <div className="p-3" style={{ cursor: "pointer" }} onClick={navigateBack}>
        <i
          className="pi pi-arrow-left"
          style={{ color: "green", fontSize: "1.5rem" }}
        ></i>
      </div>
      <div className="pr-8 pl-8">
        <h1
          style={{ color: "#3A0CA3" }}
          className="text-3xl font-bold  text-center w-full"
        >
          XÁC NHẬN THÔNG TIN
        </h1>
        {/* Fake data 1 */}
        <div
          className="flex flex-column mt-4"
          style={{ border: "1px solid #000", borderRadius: "5px" }}
        >
          {/* Học Viên */}
          <div
            className="flex flex-row w-full align-items-center justify-content-between pr-6 pl-6"
            style={{
              background: "#C8A9F1A6",
            }}
          >
            <h2 className="font-bold">Học Viên</h2>
            <i
              className="pi pi-times"
              style={{ fontSize: "1.5rem", color: "red" }}
            ></i>
          </div>
          <div className="pr-6 pl-6">
            <div className="flex flex-row w-full justify-content-between">
              <p>Tên</p>
              <p className="font-bold">LÊ BẢO NGỌC</p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Tuổi</p>
              <p className="font-bold">10 Tuổi</p>
            </div>
          </div>
          {/* Khóa Học */}
          <div
            className="flex flex-row w-full justify-content-between pr-6 pl-6"
            style={{
              background: "#C8A9F1A6",
            }}
          >
            <h2 className="font-bold">Khóa Học</h2>
          </div>
          <div className="pr-6 pl-6">
            <div className="flex flex-row w-full justify-content-between">
              <p>Tên Lớp Học</p>
              <p className="font-bold">
                Lớp học Toán Tư Duy cho trẻ mới bắt đầu (Cơ Bản)
              </p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Giáo Viên Giảng Dạy</p>
              <p className="font-bold">Cô Hà My</p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Số Buổi</p>
              <p className="font-bold">4 buổi</p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Ngày Học</p>
              <p className="font-bold">8,9,10,11 / 11</p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Thời Gian</p>
              <p className="font-bold">18:00 - 20:00</p>
            </div>
            <div
              className="flex flex-row w-full justify-content-between mb-2"
              style={{ borderBottom: "1px solid #000" }}
            >
              <p>Hình Thức</p>
              <p className="font-bold">Online</p>
            </div>
            <div className="flex flex-row justify-content-around">
              <span
                className="font-bold p-4"
                style={{ color: "#3A0CA3", fontSize: 20 }}
              >
                Giá
              </span>
              <span
                className="font-bold p-4"
                style={{ color: "#3A0CA3", fontSize: 20 }}
              >
                200.000đ
              </span>
            </div>
          </div>
        </div>
        {/* Fake data 2 */}
        <div
          className="flex flex-column mt-4"
          style={{ border: "1px solid #000", borderRadius: "5px" }}
        >
          {/* Học Viên */}
          <div
            className="flex flex-row w-full align-items-center justify-content-between pr-6 pl-6"
            style={{
              background: "#C8A9F1A6",
            }}
          >
            <h2 className="font-bold">Học Viên</h2>
            <i
              className="pi pi-times"
              style={{ fontSize: "1.5rem", color: "red" }}
            ></i>
          </div>
          <div className="pr-6 pl-6">
            <div className="flex flex-row w-full justify-content-between">
              <p>Tên</p>
              <p className="font-bold">TRẦN HỮU NGHĨA</p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Tuổi</p>
              <p className="font-bold">11 Tuổi</p>
            </div>
          </div>
          {/* Khóa Học */}
          <div
            className="flex flex-row w-full align-items-center justify-content-between pr-6 pl-6"
            style={{
              background: "#C8A9F1A6",
            }}
          >
            <h2 className="font-bold">Khóa Học</h2>
          </div>
          <div className="pr-6 pl-6">
            <div className="flex flex-row w-full justify-content-between">
              <p>Tên Lớp Học</p>
              <p className="font-bold">
                Lớp học Toán Tư Duy cho trẻ mới bắt đầu (Cơ Bản)
              </p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Giáo Viên Giảng Dạy</p>
              <p className="font-bold">Cô Hà My</p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Số Buổi</p>
              <p className="font-bold">4 buổi</p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Ngày Học</p>
              <p className="font-bold">8,9,10,11 / 11</p>
            </div>
            <div className="flex flex-row w-full justify-content-between">
              <p>Thời Gian</p>
              <p className="font-bold">18:00 - 20:00</p>
            </div>
            <div
              className="flex flex-row w-full justify-content-between mb-2"
              style={{ borderBottom: "1px solid #000" }}
            >
              <p>Hình Thức</p>
              <p className="font-bold">Online</p>
            </div>
            <div className="flex flex-row justify-content-around">
              <span
                className="font-bold p-4"
                style={{ color: "#3A0CA3", fontSize: 20 }}
              >
                Giá
              </span>
              <span
                className="font-bold p-4"
                style={{ color: "#3A0CA3", fontSize: 20 }}
              >
                200.000đ
              </span>
            </div>
          </div>
        </div>
        {/* Tổng bill */}
        <div className="flex flex-column pr-4 pl-4">
          <div className="flex flex-row w-full justify-content-between">
            <h2
              className="font-bold p-2"
              style={{ color: "#3A0CA3", fontSize: 22 }}
            >
              Tổng Lớp Học Đăng Ký
            </h2>
            <h2
              className="font-bold p-2"
              style={{ color: "#3A0CA3", fontSize: 22 }}
            >
              2
            </h2>
          </div>
          <div className="flex flex-row w-full justify-content-between">
            <h2
              className="font-bold p-2"
              style={{ color: "#3A0CA3", fontSize: 22 }}
            >
              Tổng Tiền
            </h2>
            <h2
              className="font-bold p-2"
              style={{ color: "#3A0CA3", fontSize: 22 }}
            >
              400.000đ
            </h2>
          </div>
          <div className="p-2 mb-4 flex flex-row w-full justify-content-center gap-4">
            <Button
              style={{
                background: "#fff",
                borderColor: "#F2C955",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              Hủy
            </Button>
            <Button
              style={{
                background: "#F2C955",
                borderColor: "#F2C955",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "#000",
                  fontWeight: "bold",
                }}
                to="/payment/paymentConfirm"
              >
                Xác nhận
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
