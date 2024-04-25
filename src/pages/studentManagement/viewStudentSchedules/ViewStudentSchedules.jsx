import React, { useState, useEffect } from 'react'
import styles from './ViewStudentSchedules.module.css'
import { Button, Input, Table, Tabs, ConfigProvider, DatePicker, } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getClasses } from '../../../api/classesApi';
import { formatDate, formatDayOfWeek } from '../../../utils/utils';
import dayjs from 'dayjs';
import { getScheduleOfStudent } from '../../../api/student';

const { Search } = Input;

export default function ViewStudentSchedules() {
    const navigate = useNavigate()
    const params = useParams();
    const studentId = params.studentId;
    const [search, setSearch] = useState(null)
    const [date, setDate] = useState(dayjs())
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    async function getListOfSchedules(studentId, searchString, date) {
        try {
            setLoading(true);
            const data = await getScheduleOfStudent(studentId, date.toISOString());
            setSchedules(data);
            setTableParams({
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: data?.length
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getListOfSchedules(studentId, search, date)
    }, [studentId, search, date])

    const handleTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setSchedules([]);
        }
    };

    const columns = [
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
        // {
        //     title: 'Buổi học',
        //     dataIndex: 'index',
        //     width: 120
        // },
        // {
        //     title: 'Ngày học',
        //     render: (_, record) => {
        //         return record.dayOfWeek && record.date && `${formatDayOfWeek(record.dayOfWeek)} - ${formatDate(record.date)}`
        //     }
        // },
        {
            title: 'Giờ học',
            render: (_, record) => `${record.startTime} - ${record.endTime}`
        },
        {
            title: 'Phòng học',
            dataIndex: 'roomName',
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        //     render: (status) => {
        //         if (status) {
        //             if (status.toLowerCase().includes('future')) {
        //                 return <div style={{ backgroundColor: '#e7e9ea', color: '#495057', whiteSpace: 'nowrap' }} className={styles.status}>Sắp tới</div>
        //             } else if (status.toLowerCase().includes('present')) {
        //                 return <div style={{ backgroundColor: '#d4edda', color: '#155724', whiteSpace: 'nowrap' }} className={styles.status}>Đã hoàn thành</div>
        //             } else if (status.toLowerCase().includes('absent')) {
        //                 return <div style={{ backgroundColor: '#FFE5E5', color: '#FF0000', whiteSpace: 'nowrap' }} className={styles.status}>Đã hoàn thành</div>
        //             }
        //         }
        //     }
        // },
        {
            title: 'Học bù',
            render: (_, record) => (
                <Button type='link' onClick={() => navigate(`make-up-class/${record.id}`)} icon={<SwapOutlined />} size='large' />
            ),
            width: 120,
        },
    ];
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Danh sách buổi học</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                {/* <Search style={{ marginRight: 8 }} className={styles.searchBar} placeholder="Tìm kiếm mã lớp, tên khóa học" onSearch={(value, e) => { setSearch(value) }} enterButton /> */}
                <ConfigProvider
                    theme={{
                        components: {
                            DatePicker: {
                                activeBorderColor: '#f2c955'
                            },
                        },
                    }}>
                    <DatePicker
                        style={{ width: 250 }}
                        value={date}
                        format={'DD/MM/YYYY'}
                        className={styles.picker}
                        onChange={(date) => setDate(date)}
                        placeholder="Ngày học" />
                </ConfigProvider>
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={schedules}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
        </div >
    )
}
