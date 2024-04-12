import React, { useState } from 'react'
import styles from './Dashboard.module.css'
import { Col, Row, Card, Statistic, Table, ConfigProvider, DatePicker, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { getNumberOfUser, getRevenue, getRegistered, getFavoriteCourse } from '../../api/dashboard';
import { startOfMonth, endOfMonth } from 'date-fns';

export default function Dashboard() {
    const [numOfParents, setNumOfParents] = useState(0)
    const [numOfChildrens, setNumOfChildrens] = useState(0)
    const [numOfStaffs, setNumOfStaffs] = useState(0)
    const [numOfCurrentClasses, setNumOfCurrentClasses] = useState(0)

    const [date, setDate] = useState(dayjs())

    const [revenueData, setRevenueData] = useState([])
    const [registerData, setRegisterData] = useState([])

    const [favoriteCourses, setFavoriteCourses] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [loading, setLoading] = useState(false);
    const handleTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setFavoriteCourses([]);
        }
    };

    async function getGeneralData() {
        const data = await getNumberOfUser();
        setNumOfParents(data?.numOfParents)
        setNumOfChildrens(data?.numOfChildrens)
        setNumOfStaffs(data?.numOfStaffs)
        setNumOfCurrentClasses(data?.numOfCurrentClasses)
    };

    async function getRevenueData(date) {
        const start = startOfMonth(new Date(date));
        const end = endOfMonth(new Date(date));
        const data = await getRevenue(start, end);
        setRevenueData(data)
    };
    async function getRegisterData(date) {
        const start = startOfMonth(new Date(date));
        const end = endOfMonth(new Date(date));
        const data = await getRegistered(start, end);
        setRegisterData(data);
    };
    async function getFavoriteCourses(date) {
        const start = startOfMonth(new Date(date));
        const end = endOfMonth(new Date(date));
        try {
            setLoading(true)
            const data = await getFavoriteCourse(start, end);
            setFavoriteCourses(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const columns = [
        {
            title: 'Tên khóa học',
            render: (_, record) => {
                return `${record.courseName}`
            },
            sorter: (a, b) => a.courseName.toLowerCase().localeCompare(b.courseName.toLowerCase()),
        },
        {
            title: 'Loại khóa học',
            render: (_, record) => {
                return `${record.subject}`
            },
            onFilter: (value, record) => record.subject === value,
        },
        {
            title: 'Mã giáo trình',
            render: (_, record) => {
                return `${record.subjectName}`
            },
        },
        {
            title: 'Số lớp học đang mở',
            render: (_, record) => {
                return `${record.numberClassUpComing}`
            }
        },
        {
            title: 'Số lượng học viên đăng kí',
            render: (_, record) => {
                return `${record.numberStudentsRegister}`
            }
        },
    ];
    useEffect(() => {
        getGeneralData()
    }, [])
    useEffect(() => {
        getRevenueData(date)
        getRegisterData(date)
        getFavoriteCourses(date)
    }, [date]);
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
            <ConfigProvider
                theme={{
                    components: {
                        DatePicker: {
                            activeBorderColor: '#f2c955'
                        },
                    },
                }}>
                <DatePicker
                    value={date}
                    picker="month"
                    format={"MMMM/YYYY"}
                    allowClear={false}
                    disabledDate={current => current && current.valueOf() > Date.now()}
                    className={styles.input}
                    onChange={(date) => setDate(date)}
                    placeholder="Chọn thời gian" />
            </ConfigProvider>
            <Row>
                <Col xs={24} md={12}>
                    <div style={{ marginBottom: 20 }}>
                        <h5 className={styles.subTitle}>Doanh thu</h5>
                        <Column data={revenueData} xField="date" yField="revenue" stack={true} colorField='method' />
                    </div>
                </Col>
                <Col xs={24} md={12}>
                    <div style={{ marginBottom: 20 }}>
                        <h5 className={styles.subTitle}>Số lượt đăng kí</h5>
                        <Column data={registerData} xField="date" yField="numberOfRegisters" tooltip={(item) => {
                            return { name: 'Số lượt đăng kí', value: item.numberOfRegisters }
                        }} />
                    </div>
                </Col>
            </Row>


            <div style={{ marginBottom: 20 }}>
                <h5 className={styles.subTitle}>Các khóa học yêu thích</h5>
                <Table
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={favoriteCourses}
                    pagination={tableParams.pagination}
                    loading={loading}
                    onChange={handleTableChange}
                    scroll={{ y: 'calc(100vh - 220px)' }}
                />
            </div>
        </div >
    )
}
