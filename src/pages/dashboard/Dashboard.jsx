import React, { useState } from 'react'
import styles from './Dashboard.module.css'
import { Col, Row, Card, Statistic, Table, ConfigProvider, DatePicker, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { useEffect } from 'react';
import dayjs from 'dayjs';

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
        // const data = await getData();
        const data = {
            numOfParents: 810,
            numOfChildrens: 1221,
            numOfStaffs: 45,
            numOfCurrentClasses: 56,
        }
        setNumOfParents(data?.numOfParents)
        setNumOfChildrens(data?.numOfChildrens)
        setNumOfStaffs(data?.numOfStaffs)
        setNumOfCurrentClasses(data?.numOfCurrentClasses)
    };

    function endOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    function startOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    async function getRevenueData(date) {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        // const data = await getData();
        const data = [
            {
                date: '1/4',
                method: 'Ví',
                revenue: 1500000,
            },
            {
                date: '1/4',
                method: 'Trực tiếp',
                revenue: 200000,
            },
            {
                date: '2/4',
                method: 'Ví',
                revenue: 2000000,
            },
            {
                date: '2/4',
                method: 'Trực tiếp',
                revenue: 300000,
            },
            {
                date: '3/4',
                method: 'Ví',
                revenue: 1100000,
            },
            {
                date: '3/4',
                method: 'Trực tiếp',
                revenue: 100000,
            },
            {
                date: '4/4',
                method: 'Ví',
                revenue: 1800000,
            },
            {
                date: '4/4',
                method: 'Trực tiếp',
                revenue: 400000,
            },
            {
                date: '5/4',
                method: 'Ví',
                revenue: 2000000,
            },
            {
                date: '5/4',
                method: 'Trực tiếp',
                revenue: 200000,
            },
            {
                date: '6/4',
                method: 'Ví',
                revenue: 1000000,
            },
            {
                date: '6/4',
                method: 'Trực tiếp',
                revenue: 200000,
            },
            {
                date: '7/4',
                method: 'Ví',
                revenue: 1500000,
            },
            {
                date: '7/4',
                method: 'Trực tiếp',
                revenue: 200000,
            },
            {
                date: '8/4',
                method: 'Ví',
                revenue: 1400000,
            },
            {
                date: '8/4',
                method: 'Trực tiếp',
                revenue: 200000,
            },
            {
                date: '9/4',
                method: 'Ví',
                revenue: 1600000,
            },
            {
                date: '9/4',
                method: 'Trực tiếp',
                revenue: 200000,
            },
            {
                date: '10/4',
                method: 'Ví',
                revenue: 1800000,
            },
            {
                date: '10/4',
                method: 'Trực tiếp',
                revenue: 200000,
            },
            {
                date: '11/4',
                method: 'Ví',
                revenue: 500000,
            },
            {
                date: '11/4',
                method: 'Trực tiếp',
                revenue: 200000,
            },
            {
                date: '12/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '12/4',
                method: 'Trực tiếp',
                revenue: 0,
            },

            {
                date: '13/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '13/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '14/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '14/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '15/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '15/4',
                method: 'Trực tiếp',
                revenue: 0,
            },

            {
                date: '16/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '16/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '17/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '17/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '18/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '18/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '19/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '19/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '20/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '20/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '21/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '21/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '22/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '22/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '23/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '23/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '24/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '24/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '25/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '25/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '26/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '26/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '27/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '27/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '28/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '28/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '29/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '29/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
            {
                date: '30/4',
                method: 'Ví',
                revenue: 0,
            },
            {
                date: '30/4',
                method: 'Trực tiếp',
                revenue: 0,
            },
        ]
        setRevenueData(data)
    };
    async function getRegisterData(date) {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        // const data = await getData();
        const data = [
            { date: '1/4', numOfRegisters: 32 },
            { date: '2/4', numOfRegisters: 24 },
            { date: '3/4', numOfRegisters: 20 },
            { date: '4/4', numOfRegisters: 24 },
            { date: '5/4', numOfRegisters: 23 },
            { date: '6/4', numOfRegisters: 22 },
            { date: '7/4', numOfRegisters: 13 },
            { date: '8/4', numOfRegisters: 12 },
            { date: '9/4', numOfRegisters: 10 },
            { date: '10/4', numOfRegisters: 22 },
            { date: '11/4', numOfRegisters: 5 },
            { date: '12/4', numOfRegisters: 0 },
            { date: '13/4', numOfRegisters: 0 },
            { date: '14/4', numOfRegisters: 0 },
            { date: '15/4', numOfRegisters: 0 },
            { date: '16/4', numOfRegisters: 0 },
            { date: '17/4', numOfRegisters: 0 },
            { date: '18/4', numOfRegisters: 0 },
            { date: '19/4', numOfRegisters: 0 },
            { date: '20/4', numOfRegisters: 0 },
            { date: '21/4', numOfRegisters: 0 },
            { date: '22/4', numOfRegisters: 0 },
            { date: '23/4', numOfRegisters: 0 },
            { date: '24/4', numOfRegisters: 0 },
            { date: '25/4', numOfRegisters: 0 },
            { date: '26/4', numOfRegisters: 0 },
            { date: '27/4', numOfRegisters: 0 },
            { date: '28/4', numOfRegisters: 0 },
            { date: '29/4', numOfRegisters: 0 },
            { date: '30/4', numOfRegisters: 0 }
        ]
        setRegisterData(data);
    };
    async function getFavoriteCourses(date) {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        try {
            setLoading(true)
            // const data = await getData();
            const data = [
                {
                    numberClassUpComing: 12,
                    id: "794fa805-9365-4dc0-bfca-f213542d205d",
                    courseName: "Lập trình Scratch",
                    subjectCode: "LTS101",
                    subject: "Lập trình",
                    numberStudentsRegister: 50,
                },
                {
                    numberClassUpComing: 10,
                    id: "794fa805-9365-4dc0-bfca-f213542d2052",
                    courseName: "Toán tư duy",
                    subjectCode: "TTD101",
                    subject: "Toán",
                    numberStudentsRegister: 45,
                }
            ]
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
                return `${record.subjectCode}`
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
                    className={styles.input}
                    onChange={(date) => setDate(date)}
                    placeholder="Chọn thời gian" />
            </ConfigProvider>
            <div style={{ marginBottom: 20 }}>
                <h5 className={styles.subTitle}>Doanh thu</h5>
                <Column data={revenueData} xField="date" yField="revenue" stack={true} colorField='method' />
            </div>
            <div style={{ marginBottom: 20 }}>
                <h5 className={styles.subTitle}>Số lượt đăng kí</h5>
                <Column data={registerData} xField="date" yField="numOfRegisters" />
            </div>
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
