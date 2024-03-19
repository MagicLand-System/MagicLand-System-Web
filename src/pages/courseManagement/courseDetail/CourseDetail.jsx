import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCourse } from '../../../api/courseApi';
import { getSyllabus } from '../../../api/syllabus';
import { Button, Col, ConfigProvider, DatePicker, Modal, Row } from 'antd';
import styles from './CourseDetail.module.css'
import CurrencyInput from 'react-currency-input-field';
import { compareAsc } from 'date-fns';
import dayjs from 'dayjs';

export default function CourseDetail() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState(null);
  const [syllabusData, setSyllabusData] = useState(null);

  const [priceModalOpen, setPriceModalOpen] = useState(false)
  const [start, setStart] = useState(null);
  const [startError, setStartError] = useState(null);
  const [end, setEnd] = useState(null);
  const [endError, setEndError] = useState(null);
  const [price, setPrice] = useState(null);
  const [priceError, setPriceError] = useState(null);

  async function getCourseDetail(id) {
    const data = await getCourse(id);
    if (data) {
      getSyllabusDetail(data.syllabusId);
    }
    setCourseData(data);
  }
  async function getSyllabusDetail(id) {
    const data = await getSyllabus(id);
    setSyllabusData(data)
  }
  useEffect(() => {
    getCourseDetail(id)
  }, [id])
  const handleUpdatePrice = async () => {
    let flag = true;
    if (!price) {
      flag = false
      setPriceError("Hãy nhập chi phí khóa học")
    } else {
      setPriceError(null)
    }
    if (!start) {
      flag = false
      setStartError("Hãy chọn thời gian bắt đầu")
    } else {
      setPriceError(null)
    }
    if (start && end && compareAsc(start, end) >= 0) {
      flag = false
      setEndError("Thời gian kết thúc phải sau thời gian bắt đầu")
    } else {
      setEndError(null)
    }
    if (flag) {
      console.log({ id, start, end, price })
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Chỉnh sửa chi phí thành công",
        showConfirmButton: false,
        timer: 2000
      })
      // try {
      //   await updatePrice({id, start, end, price})
      //     .then(() => {
      //       Swal.fire({
      //         position: "center",
      //         icon: "success",
      //         title: "Chỉnh sửa chi phí thành công",
      //         showConfirmButton: false,
      //         timer: 2000
      //       })
      //     })
      //     .then(() => {
      //       getCourseDetail(id)
      //       setPriceModalOpen(false)
      //     })
      // } catch (error) {
      //   Swal.fire({
      //     position: "center",
      //     icon: "error",
      //     title: error.response?.data?.Error,
      //     showConfirmButton: false,
      //     timer: 2000
      //   })
      // }
    }
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Chi tiết khóa học</h2>
      {courseData && (
        <>
          <Row>
            <Col xs={12} md={8} style={{ marginBottom: '40px' }}>
              <div className={styles.classPart}>
                <h5 className={styles.classPartTitle}>Thông tin khóa học:</h5>
                <Row style={{ marginTop: 12 }}>
                  <Col span={8}>
                    <p className={styles.classTitle}>Tên khóa học:</p>
                  </Col>
                  <Col span={16}>
                    <p className={styles.classDetail}>{courseData.name}</p>
                  </Col>
                </Row>
                <Row style={{ marginTop: 12 }}>
                  <Col span={8}>
                    <p className={styles.classTitle}>Loại:</p>
                  </Col>
                  <Col span={16}>
                    <p className={styles.classDetail}>{courseData.subjectName}</p>
                  </Col>
                </Row>
                <Row style={{ marginTop: 12 }}>
                  <Col span={16}>
                    <p className={styles.classTitle}>Độ tuổi phù hợp:</p>
                  </Col>
                  <Col span={8}>
                    <p className={styles.classDetail}>{courseData.minYearOldsStudent} - {courseData.maxYearOldsStudent}</p>
                  </Col>
                </Row>
                <Row style={{ marginTop: 12 }}>
                  <Col span={16}>
                    <p className={styles.classTitle}>Chi phí:</p>
                  </Col>
                  <Col span={8}>
                    <p className={styles.classDetail}>{courseData.price.toLocaleString()}đ</p>
                  </Col>
                </Row>
                <Row style={{ marginTop: 12 }}>
                  <Col span={24}>
                    <p className={styles.classTitle}>Mô tả chính:</p>
                  </Col>
                  <Col span={24}>
                    <p className={styles.classDetail} style={{ textAlign: 'left' }}>{courseData.mainDescription}</p>
                  </Col>
                </Row>
              </div>
            </Col>
            {syllabusData &&
              <Col xs={12} md={8} style={{ marginBottom: '40px' }}>
                <div className={styles.classPart}>
                  <h5 className={styles.classPartTitle}>Giáo trình:</h5>
                  <Row style={{ marginTop: 12 }}>
                    <Col span={8}>
                      <p className={styles.classTitle}>Mã giáo trình:</p>
                    </Col>
                    <Col span={16}>
                      <p className={styles.classDetail}>{syllabusData.subjectCode}</p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 12 }}>
                    <Col span={8}>
                      <p className={styles.classTitle}>Tên giáo trình:</p>
                    </Col>
                    <Col span={16}>
                      <p className={styles.classDetail}>{syllabusData.syllabusName}</p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 12 }}>
                    <Col span={8}>
                      <p className={styles.classTitle}>Ngày hiệu lực:</p>
                    </Col>
                    <Col span={16}>
                      <p className={styles.classDetail}>{syllabusData.effectiveDate}</p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 12 }}>
                    <Col span={24}>
                      <p className={styles.classTitle}>Mô tả:</p>
                    </Col>
                    <Col span={24}>
                      <p className={styles.classDetail} style={{ textAlign: 'left' }}>{syllabusData.description}</p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 12 }}>
                    <Col span={8}>
                      <p className={styles.classTitle}>Chi tiết:</p>
                    </Col>
                    <Col span={16}>
                      <Link to={`/syllabus-management/detail/${courseData.syllabusId}`} className={styles.classDetail} style={{ display: 'inline-block', width: '100%' }}>Xem tại đây</Link>
                    </Col>
                  </Row>
                </div>
              </Col>
            }
            <Col xs={12} md={8} style={{ marginBottom: '40px' }}>
              <div className={styles.classPart}>
                <h5 className={styles.classPartTitle}>Hình ảnh:</h5>
                <img style={{ width: '100%' }} src={courseData.image} alt="Hình ảnh" />
              </div>
            </Col>
          </Row>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <Button className={styles.saveButton} onClick={() => navigate(`/course-management/update-course/${id}`)}>
              Chỉnh sửa khóa học
            </Button>
            <Button onClick={() => setPriceModalOpen(true)} className={styles.cancelButton}>
              Cập nhật chi phí
            </Button>
          </div>
        </>
      )}
      <ConfigProvider
        theme={{
          components: {
            Modal: {
              titleFontSize: '1.2rem',
            },
          },
        }}
      >
        <Modal
          title="Chỉnh sửa chi phí"
          centered
          open={priceModalOpen}
          footer={null}
          onCancel={() => setPriceModalOpen(false)}
          width={610}
          classNames={{ header: styles.modalHeader }}
        >
          <Row>
            <Col span={6}>
              <p className={styles.addTitle}><span>*</span> Thời gian bắt đầu:</p>
            </Col>
            <Col span={18}>
              <ConfigProvider
                theme={{
                  components: {
                    DatePicker: {
                      activeBorderColor: '#f2c955'
                    },
                  },
                }}>
                <DatePicker
                  format="dd/MM/yyyy HH:mm:ss"
                  className={styles.input}
                  value={start}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                  }}
                  onChange={(date) => setStart(date)}
                  allowClear={false}
                  placeholder="Thời gian bắt đầu" />
              </ConfigProvider>
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {startError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{startError}</p>)}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <p className={styles.addTitle}><span>*</span> Thời gian kết thúc:</p>
            </Col>
            <Col span={18}>
              <ConfigProvider
                theme={{
                  components: {
                    DatePicker: {
                      activeBorderColor: '#f2c955'
                    },
                  },
                }}>
                <DatePicker
                  format="dd/MM/yyyy HH:mm:ss"
                  className={styles.input}
                  value={end}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                  }}
                  onChange={(date) => setEnd(date)}
                  allowClear={false}
                  placeholder="Thời gian kết thúc" />
              </ConfigProvider>
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {endError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{endError}</p>)}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <p className={styles.addTitle}><span>*</span> Chi phí:</p>
            </Col>
            <Col span={18}>
              <CurrencyInput
                className={`ant-input css-dev-only-do-not-override-1adbn6x ${styles.input}  ${styles.inputNumber}`}
                placeholder="Chi phí"
                allowDecimals={false}
                value={price}
                name='price'
                onValueChange={(value, name, values) => setPrice(parseInt(value))}
                required
                intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
              />
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {priceError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{priceError}</p>)}
              </div>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button className={styles.saveButton} onClick={handleUpdatePrice}>
              Lưu
            </Button>
            <Button className={styles.cancelButton} onClick={() => {
              setPriceModalOpen(false)
              setStart(null)
              setEnd(null)
              setPrice(null)
            }}>
              Hủy
            </Button>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  )
}
