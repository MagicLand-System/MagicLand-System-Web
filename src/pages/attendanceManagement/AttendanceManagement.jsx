import React, { useState } from 'react'
import styles from './AttendanceManagement.module.css'
import { Button, Input, Table, DatePicker, ConfigProvider, Tabs } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { getAttendanceClasses } from '../../api/attendance';
import { useEffect } from 'react';

const { Search } = Input;

export default function AttendanceManagement() {
    const navigate = useNavigate()
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(null)
    const [date, setDate] = useState(dayjs(new Date()))
    const [attendanceStatus, setAttendanceStatus] = useState('TA');
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setClasses([]);
        }
    };
    async function getListOfAttendanceClasses(searchString, dateTime) {
        try {
            setLoading(true);
            const data = await getAttendanceClasses({ searchString, dateTime: dateTime.toISOString(), attendanceStatus });
            if (data) {
                setClasses(data);
                setTableParams({
                    pagination: {
                        current: 1,
                        pageSize: 10,
                        total: data?.length
                    },
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getListOfAttendanceClasses(search, date)
    }, [search, date, attendanceStatus])
    const classesColumn = [
        {
            title: 'Mã lớp học',
            dataIndex: 'classCode',
            sorter: (a, b) => a.classCode.toLowerCase().localeCompare(b.classCode.toLowerCase()),
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'courseName',
            sorter: (a, b) => a.courseName.toLowerCase().localeCompare(b.courseName.toLowerCase()),
        },
        {
            title: 'Giáo viên',
            dataIndex: 'lecturer',
            render: (lecturer) => lecturer.fullName
        },
        {
            title: 'Phòng học',
            render: (_, record) => record.schedule.room.name
        },
        {
            title: 'Giờ học',
            render: (_, record) => (
                `${record.schedule.slot.startTime} - ${record.schedule.slot.endTime}`
            ),
        },
        {
            title: 'Điểm danh',
            render: (_, record) => (
                <Button type='link' onClick={() => navigate(`check-attendance/${record.schedule.id}`)} icon={<EyeOutlined />} size='large' />
            ),
            width: 120,
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Điểm danh</h2>
            <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
                <Search className={styles.searchBar} placeholder="Tìm kiếm mã lớp, tên khóa học" onSearch={(value, e) => { setSearch(value) }} enterButton />
                <ConfigProvider
                    theme={{
                        components: {
                            DatePicker: {
                                activeBorderColor: '#f2c955'
                            },
                        },
                    }}
                >
                    <DatePicker
                        value={date}
                        className={styles.picker}
                        onChange={(value) => setDate(value)}
                        style={{ marginBottom: '0 !important' }}
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                        allowClear={false}
                        format={'DD/MM/YYYY'}
                    />
                </ConfigProvider>
            </div>
            <ConfigProvider
                theme={{
                    components: {
                        Tabs: {
                            cardBg: '#f9e4aa',
                        },
                    },
                }}
            >
                <Tabs
                    defaultActiveKey={attendanceStatus}
                    type="card"
                    size="middle"
                    tabPosition='top'
                    onChange={activeKey => setAttendanceStatus(activeKey)}
                    items={[
                        {
                            label: 'Đã điểm danh',
                            key: 'TA',
                            children: (
                                <Table
                                    columns={classesColumn}
                                    rowKey={(record) => record.id}
                                    dataSource={classes}
                                    pagination={tableParams.pagination}
                                    loading={loading}
                                    onChange={handleTableChange}
                                    scroll={{ y: 'calc(100vh - 220px)' }}
                                />
                            )
                        },
                        {
                            label: 'Chưa điểm danh',
                            key: 'NTA',
                            children: (
                                <Table
                                    columns={classesColumn}
                                    rowKey={(record) => record.id}
                                    dataSource={classes}
                                    pagination={tableParams.pagination}
                                    loading={loading}
                                    onChange={handleTableChange}
                                    scroll={{ y: 'calc(100vh - 220px)' }}
                                />
                            )
                        },
                    ]}
                />
            </ConfigProvider>
        </div>
    )
}
