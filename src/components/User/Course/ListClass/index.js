import classesAPI from "../../../../api/classesApi";
/*
Import Prime React
*/
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Rating } from "primereact/rating";
import { BreadCrumb } from "primereact/breadcrumb";

/*
Import Image from assets
*/
import detail1 from "../../../../assets/images/Course/detail1.png";
import detail4 from "../../../../assets/images/Course/detail4.png";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
export default function ListClassComponent() {
  const op = useRef(null);
  const [classes, setClasses] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    localStorage.setItem("activePage", "HomePage");
    const fetchClasses = async () => {
      try {
        const response = await classesAPI.getClasses();
        setClasses(response.data);
      } catch (error) {}
    };
    fetchClasses();
  }, []);
  const fetchFilteredClass = async () => {
    try {
      // Gọi API với searchTerm và filterOptions
      const searchParams = new URLSearchParams();
      searchParams.append("keyWords", searchTerm);
      const response = await classesAPI.searchClass(searchParams);
      setClasses(response.data); // Cập nhật danh sách khóa học
    } catch (error) {
      console.error("Lỗi khi tìm kiếm và lọc khóa học: ", error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    fetchFilteredClass();
  };
  /*
  CUSTOM PAGINATION
  */
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  /*
  CUSTOM MENU SEARCH
  */
  const items = [
    {
      label: "Độ tuổi",
      items: [
        {
          label: "Từ 3 tuổi",
        },
        {
          label: "Từ 11 tuổi",
        },
        {
          label: "Từ 18 tuổi",
        },
      ],
    },
    {
      label: "Học phí",
      items: [
        {
          label: "Dưới 200.000đ",
        },
        {
          label: "200.000đ-1.000.000đ",
        },
        {
          label: "Trên 1.000.000đ",
        },
      ],
    },
    {
      label: "Hình thức",
      items: [
        {
          label: "Online",
        },
        {
          label: "Offline",
        },
      ],
    },
    {
      label: "Cơ sở",
      items: [
        {
          label: "Cở sở 1",
        },
        {
          label: "Cở sở 2",
        },
        {
          label: "Cở sở 3",
        },
      ],
    },
    {
      label: "Đánh giá",
      items: [
        {
          label: <Rating value={1} readOnly cancel={false} />,
        },
        {
          label: <Rating value={2} readOnly cancel={false} />,
        },
        {
          label: <Rating value={3} readOnly cancel={false} />,
        },
        {
          label: <Rating value={4} readOnly cancel={false} />,
        },
      ],
    },
    {
      icon: "pi pi-times",
    },
  ];
  const start = (
    <InputText
      placeholder="Nhập tên lớp học.."
      type="text"
      className="w-auto mr-2"
      value={searchTerm}
      onChange={(e) => {
        handleSearchChange(e);
        handleSearch();
      }}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
    />
  );
  /*
  CUSTOM BREADCRUMB
  */
  const itemsBreadCrumb = [{ label: "Khóa học" }, { label: "Danh sách lớp" }];
  const home = { icon: "pi pi-home", url: "/" };
  const displayedClasses = classes?.slice(first, first + rows);
  return (
    <>
      <BreadCrumb
        style={{ border: "none" }}
        model={itemsBreadCrumb}
        home={home}
      />
      <div
        style={{
          background: "rgba(135, 145, 233, 0.3)",
          borderBottomLeftRadius: "25%",
          borderBottomRightRadius: "25%",
        }}
        className="gird h-50rem w-full relative"
      >
        {/* Content */}
        <div className="flex align-items-center justify-content-around p-6">
          <div className="flex flex-column w-full align-items-center mt-4 ml-8 relative">
            <span
              className="text-3xl font-bold w-30rem"
              style={{ marginTop: "-3%", left: 100 }}
            >
              Khóa học
            </span>
            <h1
              style={{ color: "#3A0CA3" }}
              className="text-3xl font-bold w-30rem mt-5"
            >
              TOÁN TƯ DUY CHO BÉ
            </h1>
            <p className="w-30rem">
              Khóa học Toán Tư Duy Cho Bé được thiết kế dành cho các bé từ 3
              tuổi đến 15 tuổi nhằm giúp phát triển trí não, nâng cao độ hiểu
              biết của trẻ về môn toán. Từ đó, giúp các bé mở rộng thêm tiềm
              năng phát triển trong tương lai
            </p>
            <span className="w-30rem" style={{ color: "#C8A9F1" }}>
              (Dành cho bé từ 8 đến 15 tuổi)
            </span>
            <div className="w-30rem mt-3">
              <Button
                className="border-round-3xl"
                label="Đăng kí lớp học ngay"
                severity="warning"
              />
            </div>
          </div>
          <div className="mr-8">
            <Image
              imageStyle={{ mixBlendMode: "color-burn" }}
              src={detail1}
              alt="Image"
              width="350"
            />
          </div>
        </div>
      </div>

      {/* Các Lớp Khóa Học */}
      <div className="flex flex-column align-items-center mt-4">
        <h1 style={{ color: "#3A0CA3" }}>Lớp Học TOÁN TƯ DUY</h1>
        <div className="mt-5 mb-5">
          <Menubar style={{ background: "#fff" }} model={items} start={start} />
        </div>
        <div className="grid flex flex-row mb-5 w-full p-6 text-center border-round-xs surface-100 font-bold">
          {displayedClasses && displayedClasses?.length === 0 ? (
            <p className="w-full">Không có kết quả</p>
          ) : (
            displayedClasses?.map((item, index) => {
              return (
                <>
                  <div key={index} className="col-4 col-md-4 mb-3">
                    <Card
                      style={{
                        borderRadius: "15px",
                        background: "rgb(200 169 241 / 47%)",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <div className="relative">
                        <img
                          style={{
                            width: "100%",
                            borderRadius: "20px",
                            marginBottom: "10%",
                          }}
                          alt="Hình ảnh khóa học"
                          src={detail4}
                        />
                        <Avatar
                          onMouseEnter={(e) => op.current.toggle(e)}
                          image="../../../../assets/images/Course/avt1.png"
                          size="large"
                          shape="circle"
                          className="absolute"
                          style={{ bottom: 20, left: 0 }}
                        />
                        <i
                          className="pi pi-shopping-cart absolute"
                          style={{
                            fontSize: "2rem",
                            background: "#794BFF",
                            padding: 10,
                            color: "#fff",
                            borderRadius: "20px",
                            right: 0,
                            top: 0,
                          }}
                        ></i>
                        <OverlayPanel
                          className="w-3 flex flex-column align-items-center"
                          ref={op}
                          onMouseLeave={() => op.current.hide()}
                        >
                          <img
                            className="w-full"
                            img={item?.lecture?.avatarImage}
                            alt="Bamboo Watch"
                          ></img>
                          <h2 className="text-center">
                            {item?.lecture?.fullName}
                          </h2>
                          <span>
                            Giáo viên Toán Tư Duy với hơn 5 năm kinh nghiệm
                          </span>
                          <div>
                            <div className="w-full flex flex-row align-items-center">
                              <p
                                className="w-6 font-bold"
                                style={{ fontSize: "16px" }}
                              >
                                Giới thiệu bản thân:
                              </p>
                              <span
                                className="w-full"
                                style={{ fontSize: "16px" }}
                              >
                                Hãy cùng cô tìm hiểu thêm về Toán Tư Duy nhé
                              </span>
                            </div>
                            <div className="w-full flex flex-row align-items-center">
                              <p
                                className="w-8 font-bold"
                                style={{ fontSize: "16px" }}
                              >
                                Kinh nghiệm làm việc:
                              </p>
                              <span
                                className="w-full"
                                style={{ fontSize: "16px" }}
                              >
                                Giao viên Trường Quốc tế AAA
                              </span>
                            </div>
                          </div>
                          <Button>Xem chi tiết</Button>
                        </OverlayPanel>
                      </div>
                      <div className="flex flex-column justify-content-around gap-2">
                        <div className="flex flex-row justify-content-around">
                          <Button severity="warning">
                            <strong style={{ color: "red" }}>
                              Best seller
                            </strong>
                          </Button>
                          {/*  */}
                          <Button severity="success">
                            <i
                              className="pi pi-circle-fill mr-2"
                              style={{ fontSize: "1rem", color: "white" }}
                            ></i>
                            <strong style={{}}>Online</strong>
                          </Button>
                        </div>
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "#3A0CA3",
                            fontWeight: "bold",
                            fontSize: 20,
                          }}
                          to="/class/detail"
                        >
                          <p>{item?.name}</p>
                        </Link>
                        <div className="flex flex-row justify-content-around">
                          <div>
                            <i
                              className="pi pi-user mr-2"
                              style={{
                                fontSize: "1.5rem",
                                color: "#794BFF",
                              }}
                            ></i>
                            <span>8 tuổi</span>
                          </div>
                          <div>
                            <i
                              className="pi pi-stopwatch mr-2"
                              style={{
                                fontSize: "1.5rem",
                                color: "#794BFF",
                              }}
                            ></i>
                            <span>
                              {new Date(item?.startTime).getHours()}
                              {":"}
                              {new Date(item?.startTime).getMinutes()}
                              {" - "}
                              {new Date(item?.endTime).getHours()}
                              {":"}
                              {new Date(item?.endTime).getMinutes()}
                            </span>
                            {/* pi-user */}
                          </div>
                          <div>
                            <i
                              className="pi pi-home mr-2"
                              style={{
                                fontSize: "1.5rem",
                                color: "#794BFF",
                              }}
                            ></i>
                            <span>cơ sở 1</span>
                          </div>
                        </div>
                        <div class="w-full flex flex-row align-items-center justify-content-between gap-1 pt-3">
                          <div class="flex flex-row align-items-center justify-content-around">
                            <svg
                              width="28"
                              height="26"
                              viewBox="0 0 28 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.6331 0.349609C6.10445 0.349609 0 5.96813 0 12.8974C0 19.8268 6.10445 25.4453 13.6331 25.4453C21.1617 25.4453 27.2662 19.8268 27.2662 12.8974C27.2662 5.96813 21.1617 0.349609 13.6331 0.349609ZM18.0182 13.0907L11.3721 17.5413C11.3356 17.5654 11.2927 17.5797 11.2479 17.5828C11.2032 17.5859 11.1584 17.5776 11.1184 17.5588C11.0785 17.54 11.045 17.5114 11.0215 17.4762C10.9981 17.441 10.9857 17.4005 10.9856 17.3592V8.46369C10.9854 8.42231 10.9977 8.3817 11.0211 8.34636C11.0445 8.31103 11.0781 8.28234 11.1181 8.26349C11.1581 8.24464 11.203 8.23635 11.2479 8.23956C11.2927 8.24276 11.3357 8.25732 11.3721 8.28163L18.0182 12.7294C18.0496 12.7498 18.0752 12.7769 18.0929 12.8083C18.1105 12.8398 18.1198 12.8746 18.1198 12.91C18.1198 12.9454 18.1105 12.9803 18.0929 13.0118C18.0752 13.0432 18.0496 13.0703 18.0182 13.0907Z"
                                fill="#794BFF"
                              />
                            </svg>
                            <span className="font-bold text-sm">
                              123 lượt xem
                            </span>
                          </div>
                          <div
                            class="flex flex-row align-items-center justify-content-between gap-1 p-2 border-round-xl"
                            style={{ background: "#794BFF" }}
                          >
                            <span className="font-bold text-sm text-white">
                              4.9
                            </span>
                            <i
                              pi-play
                              className="pi pi-star-fill "
                              style={{
                                fontSize: "1rem",
                                color: "#FFC90C",
                              }}
                            ></i>
                          </div>
                          <p className="font-bold" style={{ fontSize: "15px" }}>
                            {item?.price}đ/Học viên
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              );
            })
          )}
        </div>
        <div className="card">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={classes?.length || 0}
            rowsPerPageOptions={[10, 20, 30]}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
}
