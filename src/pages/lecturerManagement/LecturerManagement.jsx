import React, { useState, useEffect } from 'react'
import styles from './LecturerManagement.module.css'
import { Calendar, ConfigProvider, DatePicker, Empty, Input, Select, Spin, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getLecturerSchedule } from '../../api/user';
import { getLecturer, getSlots } from '../../api/classesApi';
import dayjs from 'dayjs';

export default function LecturerManagement() {
    const navigate = useNavigate()
    const [lecturer, setLecturer] = useState(null)
    const [lecturers, setLecturers] = useState([]);
    const [lecturersOptions, setLecturersOptions] = useState(lecturers)
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(dayjs())
    const [slots, setSlots] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    async function getListsOfSchedule(lecturer, startDate, endDate) {
        try {
            setLoading(true);
            const data = await getLecturerSchedule({ searchString: lecturer, startDate, endDate });
            setSchedules(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    async function getListsOfLecturers() {
        const data = await getLecturer();
        setLecturers(data);
        setLecturersOptions(data);
    };
    async function getListsOfSlots() {
        const data = await getSlots();
        setSlots(data);
    };

    useEffect(() => {
        getListsOfLecturers();
        getListsOfSlots();
    }, []);

    useEffect(() => {
        if (lecturer) {
            getListsOfSchedule(lecturer, startOfMonth(new Date(date)), endOfMonth(new Date(date)));
        }
    }, [lecturer, date]);
    function startOfWeek(date) {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    }
    function endOfWeek(date) {
        var lastday = date.getDate() - (date.getDay() - 1) + 6;
        return new Date(date.setDate(lastday));
    }
    function endOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    function startOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    const handleTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setCourses([]);
        }
    };
    // const columns = [
    //     {
    //         title: 'Tên khóa học',
    //         render: (_, record) => {
    //             return `${record.courseDetail.courseName}`
    //         },
    //         sorter: (a, b) => a.courseDetail.courseName.toLowerCase().localeCompare(b.courseDetail.courseName.toLowerCase()),
    //     },
    //     {
    //         title: 'Loại khóa học',
    //         render: (_, record) => {
    //             return `${record.courseDetail.subject}`
    //         },
    //         sorter: (a, b) => a.courseDetail.subject.toLowerCase().localeCompare(b.courseDetail.subject.toLowerCase()),
    //         filters: subjects.map((subject) => ({
    //             text: subject.name,
    //             value: subject.name
    //         })),
    //         onFilter: (value, record) => record.courseDetail.subject === value,
    //     },
    //     {
    //         title: 'Giá tiền',
    //         dataIndex: 'price',
    //         render: (price) => price.toLocaleString()
    //     },
    //     {
    //         title: 'Số lớp học hiện tại',
    //         render: (_, record) => {
    //             return `${record.numberClassOnGoing}`
    //         }
    //     },
    //     {
    //         title: 'Chi tiết',
    //         render: (_, record) => (
    //             <Button type='link' onClick={() => navigate(`detail/${record.courseId}`)} icon={<EyeOutlined />} size='large' />
    //         ),
    //         width: 120,
    //     },
    // ];
    const timeColors = {
        '7:00': '#3E618D',
        '9:15': '#C83D64',
        '12:00': '#FFB100',
        '14:15': '#507E31',
        '16:30': '#865FAB',
        '19:00': '#FF782D'
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản lý giáo viên</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
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
                        allowClear={false}
                        className={styles.input}
                        onChange={(date) => setDate(date)}
                        placeholder="Chọn thời gian" />
                </ConfigProvider>
                <Select
                    style={{ width: '100%', marginLeft: 10 }}
                    showSearch
                    value={lecturer}
                    suffixIcon={null}
                    filterOption={false}
                    className={styles.input}
                    placeholder="Giáo viên"
                    onSelect={(data) => { setLecturer(data) }}
                    notFoundContent={
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span>
                                    Không tìm thấy giáo viên
                                </span>
                            } />
                    }
                    options={lecturersOptions.map((lecturer) => ({
                        value: lecturer.fullName,
                        label: lecturer.fullName
                    }))}
                    onSearch={(value) => {
                        if (value) {
                            const filteredOptions = lecturers.filter(
                                (lecturer) => lecturer.fullName.toLowerCase().includes(value?.toLowerCase())
                            );
                            setLecturersOptions(filteredOptions);
                        }
                    }}
                />
            </div>
            {loading ?
                <div style={{ textAlign: 'center' }}>
                    <Spin />
                </div>
                : lecturer && schedules.length > 0 ?
                    <Calendar
                        value={date}
                        cellRender={(value) => {
                            const schedulesOnThisDay = schedules.filter(schedule => {
                                const date = new Date(schedule.date).setHours(0, 0, 0, 0)
                                const valueDate = new Date(value).setHours(0, 0, 0, 0)
                                return date === valueDate
                            });
                            return (
                                <ul>
                                    {schedulesOnThisDay.map((schedule, index) => (
                                        <li key={index} style={{ color: timeColors[schedule.startTime] }}>{schedule.classCode}: <br />{schedule.startTime} - {schedule.endTime}</li>
                                    ))}
                                </ul>
                            );
                        }}
                        headerRender={() => { <></> }}
                        onSelect={(date) => setDate(date)}
                    />
                    : <h5 style={{ textAlign: 'center', fontSize: '1.2rem' }}>Vui lòng chọn giáo viên</h5>
            }
            {/* <Table
                columns={columns}
                rowKey={(record) => record.courseId}
                dataSource={courses}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            /> */}
        </div >
    )
}
