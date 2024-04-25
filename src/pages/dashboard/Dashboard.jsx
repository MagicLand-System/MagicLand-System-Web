import React, { useState } from 'react'
import styles from './Dashboard.module.css'
import { Col, Row, Card, Statistic, Table, ConfigProvider, DatePicker, Button, Select, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { getNumberOfUser, getRevenue, getRegistered, getFavoriteCourse } from '../../api/dashboard';
import QuarterSelect from '../../components/quarterSelect/QuaterSelect';
import { getCourses } from '../../api/courseApi';

export default function Dashboard() {
    const [numOfParents, setNumOfParents] = useState(0)
    const [numOfChildrens, setNumOfChildrens] = useState(0)
    const [numOfStaffs, setNumOfStaffs] = useState(0)
    const [numOfCurrentClasses, setNumOfCurrentClasses] = useState(0)

    const [courseRegisterData, setCourseRegisterData] = useState([])
    const [registerData, setRegisterData] = useState([])

    const [quarter, setQuarter] = useState(getCurrentQuarter())
    const [loading, setLoading] = useState(false)

    const [course, setCourse] = useState(null)
    const [courses, setCourses] = useState([]);
    const [coursesOptions, setCoursesOptions] = useState(courses);

    function getCurrentQuarter() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        return `${Math.ceil(currentMonth / 3)}-${currentDate.getFullYear()}`;
    }

    async function getGeneralData() {
        const data = await getNumberOfUser();
        setNumOfParents(data?.numOfParents)
        setNumOfChildrens(data?.numOfChildrens)
        setNumOfStaffs(data?.numOfStaffs)
        setNumOfCurrentClasses(data?.numOfCurrentClasses)
    };

    async function getCourseData(quarter, course) {
        try {
            setLoading(true)
            // const data = await getCourseChart(quarter, course);
            const data = [
                { time: '1/4 - 7/4', numberOfRegisters: 10 },
                { time: '8/4 - 14/4', numberOfRegisters: 5 },
                { time: '15/4 - 21/4', numberOfRegisters: 18 },
                { time: '22/4 - 28/4', numberOfRegisters: 22 },
                { time: '29/4 - 5/5', numberOfRegisters: 21 },
                { time: '6/5 - 12/5', numberOfRegisters: 7 },
                { time: '13/5 - 19/5', numberOfRegisters: 1 },
                { time: '20/5 - 26/5', numberOfRegisters: 2 },
                { time: '27/5 - 2/6', numberOfRegisters: 4 },
                { time: '3/6 - 9/6', numberOfRegisters: 12 },
                { time: '10/6 - 16/6', numberOfRegisters: 13 },
                { time: '17/6 - 23/6', numberOfRegisters: 19 },
                { time: '24/6 - 30/6', numberOfRegisters: 14 }
            ];
            setCourseRegisterData(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };
    async function getListsOfCourses() {
        const data = await getCourses();
        setCourses(data);
        setCoursesOptions(data);
    };
    async function getRegisterData(quarter) {
        try {
            setLoading(true)
            // const data = await getRegistered(quarter);
            const data = [
                { time: '1/4 - 7/4', numberOfRegisters: 50 },
                { time: '8/4 - 14/4', numberOfRegisters: 25 },
                { time: '15/4 - 21/4', numberOfRegisters: 28 },
                { time: '22/4 - 28/4', numberOfRegisters: 32 },
                { time: '29/4 - 5/5', numberOfRegisters: 29 },
                { time: '6/5 - 12/5', numberOfRegisters: 27 },
                { time: '13/5 - 19/5', numberOfRegisters: 31 },
                { time: '20/5 - 26/5', numberOfRegisters: 26 },
                { time: '27/5 - 2/6', numberOfRegisters: 30 },
                { time: '3/6 - 9/6', numberOfRegisters: 28 },
                { time: '10/6 - 16/6', numberOfRegisters: 33 },
                { time: '17/6 - 23/6', numberOfRegisters: 29 },
                { time: '24/6 - 30/6', numberOfRegisters: 34 }
            ];
            setRegisterData(data);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        getListsOfCourses()
        getGeneralData()
    }, [])
    useEffect(() => {
        getRegisterData(quarter)
    }, [quarter]);
    useEffect(() => {
        getCourseData(quarter, course)
    }, [quarter, course]);
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Thống kê</h2>
            <Row gutter={16}>
                <Col xs={12} md={6}>
                    <Card style={{ border: '1px solid #f2c955', backgroundColor: '#fffcf4', marginBottom: 20 }}>
                        <Statistic
                            title="Tổng số phụ huynh"
                            value={numOfParents}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card style={{ border: '1px solid #f2c955', backgroundColor: '#fffcf4', marginBottom: 20 }}>
                        <Statistic
                            title="Tổng số học viên"
                            value={numOfChildrens}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card style={{ border: '1px solid #f2c955', backgroundColor: '#fffcf4', marginBottom: 20 }}>
                        <Statistic
                            title="Tổng số nhân viên"
                            value={numOfStaffs}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card style={{ border: '1px solid #f2c955', backgroundColor: '#fffcf4', marginBottom: 20 }}>
                        <Statistic
                            title="Số lớp đang học"
                            value={numOfCurrentClasses}
                        />
                    </Card>
                </Col>
            </Row>
            <QuarterSelect value={quarter} onChange={(value) => setQuarter(value)} disabled={loading} />
            <div style={{ marginBottom: 20 }}>
                <h5 className={styles.subTitle}>Tổng số lượt đăng kí</h5>
                <Column data={registerData} xField="time" yField="numberOfRegisters" tooltip={(item) => {
                    return { name: 'Số lượt đăng kí', value: item.numberOfRegisters }
                }} />
            </div>
            <div style={{ marginBottom: 20 }}>
                <h5 className={styles.subTitle}>Số lượt đăng kí theo khóa</h5>
                <Select
                    showSearch
                    value={course}
                    suffixIcon={null}
                    filterOption={false}
                    className={styles.input}
                    placeholder="Chọn khóa học"
                    onSelect={(data) => { setCourse(data) }}
                    notFoundContent={
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span>
                                    Không tìm thấy khóa học
                                </span>
                            } />
                    }
                    options={
                        coursesOptions
                            .sort((a, b) => a.courseDetail.courseName.toLowerCase().localeCompare(b.courseDetail.courseName.toLowerCase()))
                            .map((course) => ({
                                value: course.courseId,
                                label: (
                                    <div>
                                        <span>{course.courseDetail.courseName}</span>
                                        <span style={{ float: 'right' }}>{course.courseDetail.subjectCode}</span>
                                    </div>
                                ),
                            }))}
                    onSearch={(value) => {
                        if (value) {
                            const filteredOptions = courses.filter(
                                (course) => course.courseDetail.courseName.toLowerCase().includes(value?.toLowerCase())
                                    || course.courseDetail.subjectCode.toLowerCase().includes(value?.toLowerCase())
                            );
                            setCoursesOptions(filteredOptions);
                        } else {
                            setCoursesOptions(courses);
                        }
                    }}
                    disabled={loading}
                />
                {course ?
                    <Column data={courseRegisterData} xField="time" yField="numberOfRegisters" tooltip={(item) => {
                        return { name: 'Số lượt đăng kí', value: item.numberOfRegisters }
                    }} />
                    : <h5 style={{ textAlign: 'center', fontSize: '1.2rem' }}>Vui lòng chọn khóa học</h5>}
            </div>
        </div >
    )
}
