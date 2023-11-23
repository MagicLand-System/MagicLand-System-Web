import React, { useEffect, useState } from "react";
/*
  Call API
*/
import courseApi from "../../../api/courseApi";
/*
  Import Prime React
*/
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import { Link } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";

export default function CourseComponent() {
  const [courses, setCourses] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses();
        setCourses(response.data);
      } catch (error) {}
    };
    fetchCourses();
  }, []);
  /*
  CUSTOM CHECKBOX && Handler Search
  */
  // Age
  const categoriesAge = [
    { name: "Từ 3 tuổi", key: "3" },
    { name: "Từ 11 tuổi", key: "11" },
    { name: "Từ 18 tuổi trở lên", key: "18" },
  ];
  const [selectedCategoryAge, setSelectedCategoryAge] = useState(
    categoriesAge[1]
  );
  const onCategoryChangeAge = (e) => {
    // Kiểm tra xem selectedCategoryAge có tồn tại hay không
    if (selectedCategoryAge) {
      // Kiểm tra trạng thái của checkbox
      const isChecked = selectedCategoryAge.key === e.value.key;

      // Nếu checkbox đã được chọn, thì uncheck nó
      if (isChecked) {
        setSelectedCategoryAge(null);
      } else {
        setSelectedCategoryAge(e.value);
      }
    } else {
      // Nếu selectedCategoryAge là null, chọn checkbox
      setSelectedCategoryAge(e.value);
    }
  };
  const fetchFilteredCourses = async () => {
    try {
      // Gọi API với searchTerm và filterOptions
      const searchParams = new URLSearchParams();
      searchParams.append("keyword", searchTerm);
      searchParams.append("minYearsOld", selectedCategoryAge.key);
      const response = await courseApi.searchCourse(searchParams);
      setCourses(response.data); // Cập nhật danh sách khóa học
    } catch (error) {
      console.error("Lỗi khi tìm kiếm và lọc khóa học: ", error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    fetchFilteredCourses();
  };

  /*
  CUSTOM CARD
  */
  const header = (
    <img
      style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
      alt="Hình ảnh khóa học"
      src="https://watermark.lovepik.com/photo/20211125/large/lovepik-cram-school-teaching-picture_500998070.jpg"
    />
  );
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
  CUSTOM BREADCRUMB
  */
  const items = [{ label: "Khóa học" }];
  const home = { icon: "pi pi-home", url: "/" };
  const displayedCourses = courses?.slice(first, first + rows);
  return (
    <>
      <BreadCrumb style={{ border: "none" }} model={items} home={home} />
      <div className="grid p-4">
        <div className="col-3">
          <div className="flex-auto p-3 border-round-sm surface-100">
            <div>
              <label htmlFor="search" className="font-bold block mb-2">
                Bạn cần tìm gì ?
              </label>
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search" />
                <InputText
                  className="w-full"
                  id="search"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </span>
            </div>
            {/* checkbox */}
            <div>
              <div>
                <label htmlFor="search" className="font-bold block mt-4 mb-3">
                  Độ tuổi
                </label>
                <div className="flex flex-column gap-3 ml-2">
                  {categoriesAge.map((category) => {
                    return (
                      <div
                        key={category.key}
                        className="flex align-items-center"
                      >
                        <Checkbox
                          inputId={category.key}
                          name="category"
                          value={category}
                          onChange={onCategoryChangeAge}
                          checked={
                            selectedCategoryAge
                              ? selectedCategoryAge.key === category.key
                              : false
                          }
                        />
                        <label htmlFor={category.key} className="ml-2">
                          {category.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                label="Tìm kiếm"
                onClick={handleSearch}
                outlined
              />
            </div>
          </div>
        </div>

        {/* Danh sách khóa học */}
        <div className="col">
          <div className="text-center grid p-3 border-round-xs surface-100 font-bold ">
            {displayedCourses &&
              (displayedCourses?.length === 0 ? (
                <p className="w-full">Không có kết quả</p>
              ) : (
                displayedCourses?.map((course, index) => {
                  return (
                    <div key={ index } className="col-4 ">
                      <Card
                        style={{ borderRadius: "15px", height: "100%" }}
                        title={course?.name}
                        header={header}
                      >
                        <div className="grid flex-column p-0">
                          <div
                            className="col flex justify-content-between
               align-items-center gap-2"
                          >
                            <label
                              htmlFor="search"
                              className="font-bold block "
                            >
                              Độ tuổi
                            </label>
                            <p>từ {course?.minAgeStudent} tuổi</p>
                          </div>
                          <div
                            className="col flex justify-content-between
               align-items-center gap-2"
                          >
                            <label
                              htmlFor="search"
                              className="font-bold block "
                            >
                              Điều kiện
                            </label>
                            <p>
                              {course?.coursePrerequisites[0]?.name ||
                                "Không có"}
                            </p>
                          </div>
                        </div>
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/course/detail/${course?.id}`}
                        >
                          <Button className="flex" label="Xem chi tiết" />
                        </Link>
                      </Card>
                    </div>
                  );
                })
              ))}
          </div>
          <div className="card">
            <Paginator
              first={first}
              rows={rows}
              totalRecords={courses?.length || 0}
              rowsPerPageOptions={[10, 20, 30]}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
