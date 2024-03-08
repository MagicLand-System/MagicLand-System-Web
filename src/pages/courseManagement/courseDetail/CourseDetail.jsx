import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCourse } from '../../../api/courseApi';
import { getSyllabus } from '../../../api/syllabus';
import { Button, Col, Row } from 'antd';
import styles from './CourseDetail.module.css'

export default function CourseDetail() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState(null);
  const [syllabusData, setSyllabusData] = useState(null);
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
                      <Link to={`/syllabus-management/detail/${courseData.syllabusId}`} className={styles.classDetail} style={{display: 'inline-block', width: '100%'}}>Xem tại đây</Link>
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
              Chỉnh sửa
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
