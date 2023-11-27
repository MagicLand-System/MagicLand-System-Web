import { Button } from "primereact/button";
import courseApi from "../../../../api/courseApi";
/*
Import Prime React
*/
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
/*
Import Image from assets
*/
import detail1 from "../../../../assets/images/Course/detail1.png";
import detail2 from "../../../../assets/images/Course/detail2.png";
import detail3 from "../../../../assets/images/Course/detail3.png";
import detail4 from "../../../../assets/images/Course/detail4.png";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function DetailCourseComponent() {
  const navigate = useNavigate();
  const op = useRef(null);
  const courseId = useParams();
  const [course, setCourse] = useState();
  const [classes, setClasses] = useState();
  useEffect(() => {
    localStorage.setItem("activePage", "HomePage");
    const fetchCourse = async () => {
      try {
        const response = await courseApi.getCourse(courseId.id);
        const response1 = await courseApi.getClassesOfCourse(courseId.id);
        setCourse(response.data);
        const temp = [];
        temp.push(response1.data[0]);
        temp.push(response1.data[1]);
        setClasses(temp);
      } catch (error) {}
    };
    fetchCourse();
  }, [courseId.id]);
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
              {course?.name}
            </h1>
            <p className="w-30rem">
              Khóa học {course?.name} Cho Bé được thiết kế dành cho các bé từ{" "}
              {course?.minAgeStudent} tuổi đến {course?.maxAgeStudent} tuổi nhằm
              giúp phát triển trí não, nâng cao độ hiểu biết của trẻ về môn
              toán. Từ đó, giúp các bé mở rộng thêm tiềm năng phát triển trong
              tương lai
            </p>
            <span className="w-30rem" style={{ color: "#C8A9F1" }}>
              (Dành cho bé từ {course?.minAgeStudent} đến{" "}
              {course?.maxAgeStudent} tuổi)
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
      {/* Các Khóa Học Tốt Nhất Của Chúng Tôi */}
      <div className="flex flex-column align-items-center">
        <div className="text-center">
          <h2>
            Vì Sao Nên Cho Bé Học{" "}
            <strong style={{ color: "red" }}>Toán Tư Duy</strong> Từ Sớm?
          </h2>
        </div>
        <div className="grid w-9">
          <div className="col-4">
            <Image
              imageStyle={{ mixBlendMode: "color-burn" }}
              src={detail2}
              alt="Image"
              width="350"
            />
          </div>
          <div className="col-8 flex flex-column align-items-center justify-content-center">
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-verified"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <p className="text-xl">
                <strong>Phát trển tư duy và kỹ năng:</strong> phát triển trí não
                và nâng cao các kỹ năng nhận biết với các phép tính toán…
              </p>
            </div>
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-verified"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <p className="text-xl">
                <strong>
                  Rèn luyện tính kỷ luật, tự giác, tỉ mỉ, có trách nhiệm:
                </strong>{" "}
                học sinh cần được trau dồi qua quá trình học tập, thử thách.
              </p>
            </div>
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-verified"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <p className="text-xl">
                <strong>Tránh ảnh hưởng tiêu cực từ công nghệ:</strong> hạn chế
                thời gian sử dụng điện thoại, máy tính, trò chơi bừa bãi; tránh
                bị lừa đảo…
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Chi Tiết Khóa Học */}
      <div
        className="flex flex-column align-items-center"
        style={{
          background: "#A2E2F8",
          margin: "0 10%",
          borderRadius: "25%",
        }}
      >
        <h1 style={{ color: "#F67766" }}>Chi Tiết Khóa Học</h1>
        <div className="w-10 grid flex flex-row">
          <div className="col-6">
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-arrow-circle-right"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <h4 className="w-5">Mã KH</h4>
              <p>Math002</p>
            </div>
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-arrow-circle-right"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <h4 className="w-5">Độ tuổi</h4>
              <p>Từ {course?.minAgeStudent} tuổi</p>
            </div>
            <div className="flex flex-row align-items-center gap-3 ">
              <i
                className="pi pi-arrow-circle-right"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <h4 className="w-5">Điều kiện tham gia</h4>
              <p className="w-5">
                {course?.coursePrerequisites[0]
                  ? `Đã hoàn thành khóa học ${course?.coursePrerequisites[0]?.name}`
                  : "Không yêu cầu"}
              </p>
            </div>
          </div>
          <div className="col-6">
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-arrow-circle-right"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <h4 className="w-5">Loại hình</h4>
              <p>Tiếng anh</p>
            </div>
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-arrow-circle-right"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <h4 className="w-5">Hình thức</h4>
              <p>Lớp học</p>
            </div>
            <div className="flex flex-row align-items-center gap-3">
              <i
                className="pi pi-arrow-circle-right"
                style={{ fontSize: "2rem", color: "green" }}
              ></i>
              <h4 className="w-5">Số buổi</h4>
              <p>{course?.numberOfSession} buổi/ khóa</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row align-items-center mt-4">
          <h2 style={{ color: "#3A0CA3" }}>Lộ trình học</h2>
          <Image
            // imageStyle={{ mixBlendMode: "color-burn" }}
            src={detail3}
            alt="Image"
            width="600"
          />
        </div>
      </div>
      {/* Các Lớp Thuộc Khóa Học */}
      <div className="flex flex-column align-items-center mt-4">
        <h1 style={{ color: "#3A0CA3" }}>Các Lớp Thuộc Khóa Học</h1>
        <div className="flex flex-column align-items-center mb-5">
          <div className="grid relative">
            {classes &&
              classes?.map((item, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="col-6 flex flex-column text-center"
                    >
                      <Card
                        style={{
                          borderRadius: "15px",
                          background: "rgb(200 169 241 / 47%)",
                          height: "100%",
                        }}
                      >
                        <div className="relative">
                          <img
                            style={{
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
                              fontSize: 20,
                              fontWeight: "bold",
                            }}
                            to="/class/detail"
                          >
                            <p>{item?.name}</p>
                          </Link>

                          <div className="flex flex-row justify-content-around">
                            <div>
                              <i
                                className="pi pi-user mr-2"
                                style={{ fontSize: "1.5rem", color: "#794BFF" }}
                              ></i>
                              <span>{course?.minAgeStudent}</span>
                            </div>
                            <div>
                              <i
                                className="pi pi-stopwatch mr-2"
                                style={{ fontSize: "1.5rem", color: "#794BFF" }}
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
                                style={{ fontSize: "1.5rem", color: "#794BFF" }}
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
                                style={{ fontSize: "1rem", color: "#FFC90C" }}
                              ></i>
                            </div>
                            <p
                              className="font-bold"
                              style={{ fontSize: "15px" }}
                            >
                              {item?.price}đ/Học viên
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                    <Link to="/course/listClass">
                      <p
                        className="absolute font-bold"
                        style={{ bottom: -40, right: 10, color: "#3A0CA3" }}
                      >
                        Xem thêm các lớp khác
                      </p>
                    </Link>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
