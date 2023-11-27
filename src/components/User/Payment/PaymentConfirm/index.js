import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";

export default function PaymentConfirmComponent() {
  const toast = useRef(null);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const navigateBack = () => {
    // Use the navigate function to go back to the previous page
    navigate(-1);
  };
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Add smooth scroll behavior
      });
    };

    // Scroll to the top when the component mounts or the route changes
    scrollToTop();
  }, [location.pathname]); // Trigger the effect when the pathname changes

  /*
  CUSTOM DROPDOWN
  */
  const [selectedVourcher, setSelectedVourcher] = useState(null);
  const vourchers = [
    { name: "GIAMGIA15%", code: "15%" },
    { name: "GIAMGIA40%", code: "40%" },
    { name: "GIAMGIA50%", code: "50%" },
  ];
  const selectedVourcherTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img
            alt={option.name}
            src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
            className={`mr-2 flag flag-${option.code.toLowerCase()}`}
            style={{ width: "18px" }}
          />
          <div>{option.name}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };
  const vourcherOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <img
          alt={option.name}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: "18px" }}
        />
        <div>{option.name}</div>
      </div>
    );
  };
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const defaultRenderInput = ({ index, isFocused, ...rest }) => (
    <input
      key={index}
      {...rest}
      style={{
        width: "55px", // Set the width of each input
        height: "55px", // Set the height of each input
        margin: "20px 5px", // Add margin between inputs
        fontSize: "16px", // Set the font size
        borderRadius: "5px", // Add some border radius for styling
        border: "1px solid #ccc", // Add a border
        textAlign: "center", // Center the text
      }}
    />
  );
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
          THANH TOÁN
        </h1>
        {/* Phụ Huynh */}
        <div>
          <h3 style={{ color: "#C8A9F1" }}>Phụ Huynh</h3>
          <div className="ml-6">
            <div className="flex flex-row">
              <p className="w-1">Tên</p>
              <p className="font-bold">Ngô Gia Thưởng</p>
            </div>
            <div className="flex flex-row">
              <p className="w-1">Email</p>
              <p className="font-bold">thuongng@gmail.com</p>
            </div>
            <div className="flex flex-row">
              <p className="w-1">SĐT</p>
              <p className="font-bold">0934*******</p>
            </div>
            <div className="flex flex-row">
              <p className="w-1">Địa Chỉ</p>
              <p className="font-bold">123 ABC Q1</p>
            </div>
          </div>
        </div>
        {/* Fake data 1 */}
        <h3 style={{ color: "#C8A9F1" }}>Thông Tin Mua Hàng</h3>
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
            className="flex flex-row w-full justify-content-between pr-6 pl-6"
            style={{
              background: "#C8A9F1A6",
            }}
          >
            <h2 className="font-bold">Học Viên</h2>
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
        {/* Thanh toán */}
        <div className="flex flex-column pr-4 pl-4">
          <div
            className="flex flex-row w-full justify-content-between"
            style={{ borderBottom: "1px solid #000" }}
          >
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
          <div className="flex flex-row w-full align-items-center justify-content-between">
            <h2
              className="font-bold p-2"
              style={{ color: "#3AAC45", fontSize: 22 }}
            >
              VOUCHER GIẢM GIÁ
            </h2>
            <Dropdown
              value={selectedVourcher}
              onChange={(e) => setSelectedVourcher(e.value)}
              options={vourchers}
              optionLabel="name"
              placeholder="Select a Country"
              filter
              valueTemplate={selectedVourcherTemplate}
              itemTemplate={vourcherOptionTemplate}
              className="w-full md:w-12rem"
              style={{ height: "20%" }}
            />
          </div>
          <div className="flex flex-row w-full align-items-center justify-content-between">
            <h2
              className="font-bold p-2"
              style={{ color: "#C8A9F1", fontSize: 22 }}
            >
              Phương thức thanh toán
            </h2>
            <h2
              className="font-bold p-2"
              style={{ color: "#888888", fontSize: 22 }}
            >
              Ví Điện Tử
            </h2>
          </div>
          <div
            className="flex flex-row w-full align-items-center justify-content-between"
            style={{ borderBottom: "1px solid #000" }}
          >
            <h2
              className="font-bold p-2"
              style={{ color: "#888888", fontSize: 18 }}
            >
              Số dư của bạn
            </h2>
            <h2
              className="font-bold p-2"
              style={{ color: "#888888", fontSize: 18 }}
            >
              1.000.000đ
            </h2>
          </div>
          <div className="flex flex-row w-full align-items-center justify-content-between">
            <h2
              className="font-bold p-2"
              style={{ color: "#000", fontSize: 18 }}
            >
              Chi tiết thanh toán
            </h2>
          </div>
          <div className="flex flex-row w-full align-items-center justify-content-between">
            <h2
              className="font-bold p-2"
              style={{ color: "#888888", fontSize: 18 }}
            >
              Tổng tiền
            </h2>
            <h2
              className="font-bold p-2"
              style={{ color: "#888888", fontSize: 18 }}
            >
              400.000đ
            </h2>
          </div>
          <div className="flex flex-row w-full align-items-center justify-content-between">
            <h2
              className="font-bold p-2"
              style={{ color: "#888888", fontSize: 18 }}
            >
              Vourcher giảm giá
            </h2>
            <h2
              className="font-bold p-2"
              style={{ color: "#888888", fontSize: 18 }}
            >
              50.000đ
            </h2>
          </div>
          <div className="flex flex-row w-full align-items-center justify-content-between">
            <h2
              className="font-bold p-2"
              style={{ color: "red", fontSize: 22 }}
            >
              TỔNG THANH TOÁN
            </h2>
            <h2
              className="font-bold p-2"
              style={{ color: "red", fontSize: 22 }}
            >
              350.000đ{" "}
            </h2>
          </div>
          <div className="p-2 mb-4 flex flex-row w-full justify-content-center gap-4">
            <Button
              style={{
                background: "#F2C955",
                borderColor: "#F2C955",
                color: "#000",
                fontWeight: "bold",
              }}
              onClick={() => openDialog()}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
      <Dialog visible={showDialog} onHide={closeDialog} className="w-5">
        <div className="w-full flex flex-column align-items-center">
          <h3
            className="text-center"
            style={{ color: "#3A0CA3", fontSize: "30px" }}
          >
            Nhập mã xác nhận
          </h3>
          <span
            style={{ fontSize: "12px", color: "#858597" }}
            className="w-full flex"
          >
            MÃ XÁC NHẬN GỬI QUA SỐ ĐIỆN THOẠI 0941967088
          </span>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span> </span>}
            renderInput={defaultRenderInput}
          />
          <p
            className="w-full flex"
            style={{ fontSize: "12px", color: "#858597" }}
          >
            Chưa nhận được mã?<strong className="ml-1">GỬI LẠI</strong>
          </p>
          <Button
            onClick={() => {
              toast.current.show({
                severity: "success",
                summary: "Thành công",
                detail: "Bạn đã đăng kí lớp thành công",
                life: 3000,
              });
              setShowDialog(false);
            }}
          >
            Xác nhận
          </Button>
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
}
