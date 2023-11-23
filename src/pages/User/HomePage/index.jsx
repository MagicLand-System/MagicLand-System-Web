import { Button } from "primereact/button";
/*
Import Prime React
*/
import { Image } from "primereact/image";
import { Card } from "primereact/card";

/*
Import Image from assets
*/
import homepageImg from "../../../assets/images/Homepage/homepage1.png";
import icon1 from "../../../assets/images/Homepage/listIcon1.png";
import icon2 from "../../../assets/images/Homepage/listIcon2.png";
import icon3 from "../../../assets/images/Homepage/listIcon3.png";
import star1 from "../../../assets/images/Homepage/stars1.png";
import React, { useEffect } from "react";
export default function HomePageComponent() {
  useEffect(() => {
    localStorage.setItem("activePage", "HomePage");
  }, []);
  /*
  CUSTOM CARD
  */
  const header = (
    <img
      style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
      alt="Hình ảnh khóa học"
      src="https://pinkcloud.edu.vn/Uploads/pic/News/--VE-TRE-EM/637007717762988568.jpg"
    />
  );
  const footer = (
    <div class="flex flex-row align-items-center justify-content-between ">
      <div class="flex flex-row align-items-center justify-content-between gap-1">
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
        <span className="font-bold text-sm">123 lượt xem</span>
      </div>
      <div
        class="flex flex-row align-items-center justify-content-between gap-1 p-2 border-round-xl"
        style={{ background: "#794BFF" }}
      >
        <span className="font-bold text-sm text-white">4.9</span>
        <i
          pi-play
          className="pi pi-star-fill "
          style={{ fontSize: "1rem", color: "#FFC90C" }}
        ></i>
      </div>
    </div>
  );
  return (
    <>
      <div
        style={{
          background: "rgba(135, 145, 233, 0.3)",
          borderBottomLeftRadius: "25%",
          borderBottomRightRadius: "25%",
        }}
        className="gird h-50rem w-full relative mb-8"
      >
        {/* Content */}
        <div className="flex text-center justify-content-around p-6">
          <div className=" flex flex-column  align-items-center mt-4 ml-8 relative">
            <p
              style={{ color: "#3A0CA3" }}
              className="text-3xl font-bold w-25rem"
            >
              Cung cấp các khóa học tốt nhất cho con của bạn
            </p>
            <div>
              <Button
                className="border-round-3xl"
                label="Đăng kí ngay"
                severity="warning"
              />
            </div>
            <div
              style={{ marginLeft: "100%", marginTop: "-15%" }}
              className="absolute"
            >
              <Image
                imageStyle={{ mixBlendMode: "color-burn" }}
                src={star1}
                alt="Image"
                width="150"
              />
            </div>
          </div>
          <div className="mr-8">
            <Image
              imageStyle={{ mixBlendMode: "color-burn" }}
              src={homepageImg}
              alt="Image"
              width="350"
            />
          </div>
        </div>
        {/* List Icons */}
        <div>
          <div
            style={{ marginTop: "-5%" }}
            className="w-full flex flex-row justify-content-center gap-8 absolute"
          >
            <Image src={icon1} alt="Image" width="130" />
            <Image src={icon2} alt="Image" width="130" />
            <Image src={icon3} alt="Image" width="130" />
          </div>
        </div>
      </div>
      {/* Các Khóa Học Tốt Nhất Của Chúng Tôi */}
      <div className="flex flex-column align-items-center">
        <div className="text-center">
          <h2>Các Khóa Học Tốt Nhất Của Chúng Tôi</h2>
          <p>
            Những khóa học tốt nhất dành cho con của bạn, giúp các bé có thêm
            nhiều kỹ năng mới
          </p>
        </div>
        <div className="grid w-9">
          <div className="col-4 p-4 flex flex-column text-center">
            <Card
              style={{ borderRadius: "15px " }}
              title="Vẽ"
              footer={footer}
              header={header}
            >
              <p>Môn Vẽ giúp bé phát triển tư duy hội họa...</p>
            </Card>
          </div>
          <div className="col-4 p-4 flex flex-column text-center">
            <Card
              style={{ borderRadius: "15px " }}
              title="Vẽ"
              footer={footer}
              header={header}
            >
              <p>Môn Vẽ giúp bé phát triển tư duy hội họa...</p>
            </Card>
          </div>
          <div className="col-4 p-4 flex flex-column text-center">
            <Card
              style={{ borderRadius: "15px " }}
              title="Vẽ"
              footer={footer}
              header={header}
            >
              <p>Môn Vẽ giúp bé phát triển tư duy hội họa...</p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
