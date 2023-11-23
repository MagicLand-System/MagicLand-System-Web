import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { BreadCrumb } from "primereact/breadcrumb";
import { Image } from "primereact/image";

import detail1 from "../../../../../assets/images/Class/detail1.png";
import detail3 from "../../../../../assets/images/Class/detail3.png";
import { Dialog } from "primereact/dialog";
import { Link } from "react-router-dom";

export default function DetailClassComponent() {
  const toast = useRef(null);
  const [infoDetail, setInFoDetail] = useState([]);
  useEffect(() => {
    const info = [
      {
        lophoc: "Toán Tư Duy cho trẻ mới bắt đầu (Cơ Bản)",
        sobuoi: 4,
        ngaybatdau: "11/11/2023",
        ngayketthuc: "14/11/2023",
        thoigian: "18:00 - 20:00",
        hinhthuc: "Online",
        phonghoc: "001",
        coso: "Cơ Sở 1 - 123 ABC QUẬN 1",
      },
    ];
    setInFoDetail(info);
  }, []);
  /*
  Custom Dialog Confirm Dialog
  */
  const accept = () => {
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đã thêm vào giỏ hàng",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Từ chối",
      detail: "Thêm giỏ hàng không thành",
      life: 3000,
    });
  };
  const addToCart = () => {
    confirmDialog({
      message: "Bạn có muốn thêm khóa học học vào giỏ hàng không?",
      header: "Thêm vào giỏ hàng",
      accept,
      reject,
    });
  };
  /*
  Custome Dialog
  */
  const [visible, setVisible] = useState(false);
  const footerContent = (
    <div className="text-center">
      <Link to="/payment">
        <Button
          style={{
            background: "#F2C955",
            color: "#000",
            borderRadius: "5px",
            border: "none",
          }}
          label="Đăng ký lớp học ngay"
          onClick={() => setVisible(false)}
          autoFocus
        />
      </Link>
    </div>
  );
  /*
  CUSTOM BREADCRUMB
  */
  const itemsBreadCrumb = [
    { label: "Khóa học" },
    { label: "Danh sách lớp" },
    { label: "Chi tiết lớp" },
  ];
  const home = { icon: "pi pi-home", url: "/" };
  return (
    <>
      <BreadCrumb
        style={{ border: "none" }}
        model={itemsBreadCrumb}
        home={home}
      />
      <div>
        <div className="grid  flex flex-row align-items-center text-center p-6">
          <div className="col-6 p-4 flex flex-column align-items-center">
            <Image src={detail1} alt="Image" width="300" height="300" />
            <div className="flex flex-row align-item-center gap-4">
              <Button
                label="Best Seller"
                style={{ background: "#F2C955", color: "red", border: "none" }}
              />
              <Button
                label="Online"
                style={{ background: "#3AAC45", color: "#fff", border: "none" }}
              />
            </div>
          </div>
          <div className="col-6">
            <h2>Lớp học Toán Tư Duy cho trẻ mới bắt đầu (Cơ Bản)</h2>
            <div className="flex flex-row w-full justify-content-center align-items-center gap-6">
              <div className="flex flex-row justify-content-center align-items-center">
                <i
                  className="pi pi-user mr-2"
                  style={{
                    fontSize: "1.5rem",
                    color: "#794BFF",
                  }}
                ></i>
                <p>8 người đăng ký</p>
              </div>
              <div
                className="w-1 p-2"
                style={{ background: "#794BFF", borderRadius: "20px" }}
              >
                <span className="font-bold text-sm text-white">4.9</span>
                <i
                  pi-play
                  className="pi pi-star-fill "
                  style={{ fontSize: "1rem", color: "#FFC90C" }}
                ></i>
              </div>
            </div>
            <div className="flex flex-row w-full justify-content-center align-items-center ">
              <div
                style={{ paddingRight: "5%", borderRight: "2px solid #000" }}
              >
                <h3>Độ Tuổi</h3>
                <p>8 Tuổi</p>
              </div>
              <div style={{ paddingRight: "5%", paddingLeft: "5%" }}>
                <h3>Thời Gian</h3>
                <p>18:00 - 20:00</p>
              </div>
              <div style={{ paddingLeft: "5%", borderLeft: "2px solid #000" }}>
                <h3>Địa Chỉ</h3>
                <p>Home</p>
              </div>
            </div>
            <Button
              className="mt-4 font-bold"
              style={{ background: "#fff", color: "#794BFF" }}
            >
              200.000đ/Học Viên
            </Button>
            <div className="flex flex-row align-items-center justify-content-center gap-6 text-center">
              <Button
                className="mt-3 font-bold w-3 justify-content-center"
                style={{
                  background: "#F2C955",
                  color: "#000",
                  fontSize: "10px",
                  border: "none",
                }}
                onClick={() => setVisible(true)}
              >
                Đăng ký lớp học ngay
              </Button>
              <Button
                className="mt-3 font-bold w-3 justify-content-center"
                style={{
                  background: "#F2C955",
                  color: "#000",
                  fontSize: "10px",
                  border: "none",
                }}
                onClick={addToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>
        {/* Lộ Trình Học */}
        <div
          className="flex flex-column align-items-center"
          style={{
            background: "#A2E2F8",
            margin: "0 10%",
            borderRadius: "25%",
          }}
        >
          <h2 style={{ color: "#3A0CA3" }}>Lộ trình học</h2>
          <Image
            // imageStyle={{ mixBlendMode: "color-burn" }}
            src={detail3}
            alt="Image"
            width="600"
          />
        </div>
        {/* Giáo viên giảng dạy */}
        <div className="grid flex flex-row justify-content-center align-items-center p-6">
          <div className="col-6 flex flex-column align-items-center">
            <Image
              src="https://cdnphoto.dantri.com.vn/blSc2iLdSAaRUHWSG5taiQk8TX8=/thumb_w/1020/2023/09/08/linh-0-edited-1694190818430.jpeg"
              alt="Image"
              width="350"
              imageStyle={{ borderRadius: "10%" }}
            />
            <p>“Hãy cùng cô tìm hiểu thêm về Toán Tư Duy nhé”</p>
          </div>
          <div className="col-6 p-4">
            <h3> Giáo Viên Giảng Dạy: Cô Hà My</h3>
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-verified"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <p>Tốt nghiệp loại giỏi Đại Học ABC</p>
            </div>
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-verified"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <p>Chứng nhận sư phạm</p>
            </div>
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-verified"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <p>
                Kinh nghiệm 5 năm giảng dạy bộ môn Toán Tư Duy - Giao viên
                Trường Quốc tế AAA
              </p>
            </div>
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-verified"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <p>Tận tâm với nghề và được nhiều phụ huynh học sinh yêu thích</p>
            </div>
          </div>
        </div>
        {/* Chi tiết */}
        <div className="card p-6">
          <DataTable
            value={infoDetail}
            showGridlines
            tableStyle={{ minWidth: "50rem", border: "1px solid #C8A9F1" }} // Add this line to set the border color
            style={{ fontSize: "15px" }}
            headerStyle={{ background: "#C8A9F1" }}
          >
            <Column field="lophoc" header="Lớp học"></Column>
            <Column field="sobuoi" header="Số buổi / tuần"></Column>
            <Column field="ngaybatdau" header="Ngày bắt đầu"></Column>
            <Column field="ngayketthuc" header="Ngày kết thúc"></Column>
            <Column field="thoigian" header="Thời gian"></Column>
            <Column field="hinhthuc" header="Hình thức"></Column>
            <Column field="phonghoc" header="Phòng học"></Column>
            <Column field="coso" header="Cơ sở"></Column>
          </DataTable>
        </div>
      </div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <Dialog
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div style={{ width: "100%", height: "100%" }}>
          <h2
            className="text-center"
            style={{ color: "#9B51E0", fontSize: 20 }}
          >
            ĐĂNG KÝ LỚP HỌC NGAY
          </h2>
          <div className="p-4">
            <span className="font-bold" style={{ color: "#3A0CA3" }}>
              Thông tin đăng ký
            </span>
            <div
              className="flex flex-column p-4 mt-4"
              style={{ border: "1px solid #000", borderRadius: "5px" }}
            >
              <h4 style={{ color: "#C8A9F1" }}>Phụ huynh</h4>
              <div className="pr-8 pl-8">
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Tên</p>
                  <p>Ngô Gia Thưởng</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Email</p>
                  <p>thuongng@gmail.com</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">SĐT</p>
                  <p>0934*******</p>
                </div>
                <div
                  className="flex flex-row w-full justify-content-between"
                  style={{ borderBottom: "1px solid " }}
                >
                  <p className="font-bold">Địa Chỉ</p>
                  <p>123 ABC Q1</p>
                </div>
              </div>
              <div className="flex flex-row align-items-center gap-2 mt-4">
                <h4 style={{ color: "#C8A9F1" }}>Học viên</h4>
                <Button
                  style={{ width: "130px", height: "40px", fontSize: "12px" }}
                >
                  Thêm học viên
                </Button>
              </div>
              <div className="pr-8 pl-8">
                <div className="flex flex-row w-full gap-4 justify-content-between">
                  <p>
                    <Checkbox></Checkbox>
                    <span className="ml-2">Tên:</span>{" "}
                    <strong>Trần Hữu Nghĩa</strong>
                  </p>
                  <p>
                    <span>Tuổi:</span> <strong>10 tuổi</strong>
                  </p>
                </div>
                <div className="flex flex-row w-full gap-4 justify-content-between">
                  <p>
                    <Checkbox></Checkbox>
                    <span className="ml-2">Tên:</span>{" "}
                    <strong>Trần Hữu Nghĩa</strong>
                  </p>
                  <p>
                    <span>Tuổi:</span> <strong>10 tuổi</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <span className="font-bold" style={{ color: "#3A0CA3" }}>
              Thông tin lớp học
            </span>
            <div
              className="flex flex-column p-4 mt-4"
              style={{ border: "1px solid #000", borderRadius: "5px" }}
            >
              <div className="pr-4 pl-4">
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Tên Lớp Học:</p>
                  <p>Lớp học Toán Tư Duy cho trẻ mới bắt đầu (Cơ Bản)</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Giáo Viên Giảng Dạy :</p>
                  <p>Cô Hà My</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Số Buổi:</p>
                  <p>4 buổi</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Ngày Học:</p>
                  <p>8,9,10,11 / 11</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Thời Gian:</p>
                  <p>18:00 - 20:00</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Hình Thức:</p>
                  <p>Online</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Cơ Sở::</p>
                  <p>Không có</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Địa Chỉ:</p>
                  <p>Không có</p>
                </div>
                <div className="flex flex-row w-full justify-content-between">
                  <p className="font-bold">Phòng:</p>
                  <p>Không có</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-row justify-content-center">
              <span
                className="font-bold p-4"
                style={{ color: "#3A0CA3", fontSize: 20 }}
              >
                Tổng chi phí
              </span>
              <span
                className="font-bold p-4"
                style={{ color: "#3A0CA3", fontSize: 20 }}
              >
                0đ
              </span>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
