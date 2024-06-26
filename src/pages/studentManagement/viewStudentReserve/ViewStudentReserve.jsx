import React, { useState, useEffect } from 'react'
import styles from './ViewStudentReserve.module.css'
import { Button, Input, Table, Tabs, ConfigProvider, DatePicker, Avatar, } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatDateTime, formatDayOfWeek } from '../../../utils/utils';
import dayjs from 'dayjs';
import { getListReserve } from '../../../api/student';

const { Search } = Input;

export default function ViewStudentReserve() {
    const navigate = useNavigate()
    const [search, setSearch] = useState(null)
    const [date, setDate] = useState(null)
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    async function getListOfStudents(searchString, date) {
        try {
            setLoading(true);
            const data = await getListReserve(searchString, date);
            setStudents(data);
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
        getListOfStudents(search, date)
    }, [search, date])

    const handleTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setStudents([]);
        }
    };

    const columns = [
        {
            title: 'Tên học viên',
            sorter: (a, b) => a.studentResponse?.fullName?.toLowerCase().localeCompare(b.studentResponse?.fullName?.toLowerCase()),
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar size={64} src={record.studentResponse?.avatarImage} style={{ marginRight: '10px' }} />
                    <p>{record.studentResponse?.fullName}</p>
                </div>
            ),
        },
        // {
        //     title: 'Ngày sinh',
        //     render: (_, record) => (record.studentResponse?.dateOfBirth && formatDate(record.studentResponse?.dateOfBirth)),
        // },
        {
            title: 'Tên phụ huynh',
            render: (_, record) => record.parentResponse.fullName,
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'courseName',
            sorter: (a, b) => a.courseName.toLowerCase().localeCompare(b.courseName.toLowerCase()),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                if (status) {
                    if (status.toLowerCase().includes('saved')) {
                        return <div style={{ backgroundColor: '#E5F2FF', color: '#0066FF', whiteSpace: 'nowrap' }} className={styles.status}>Bảo lưu</div>
                    } else if (status.toLowerCase().includes('invalid')) {
                        return <div style={{ backgroundColor: '#FFE5E5', color: '#FF0000', whiteSpace: 'nowrap' }} className={styles.status}>Đã hết hạn</div>
                    }
                }
            }
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'validDate',
            render: (validDate) => validDate && formatDateTime(validDate)
        },
        {
            title: 'Xếp lớp',
            render: (_, record) => (
                <Button type='link' onClick={() => navigate(`/student-management/view-reserve/${record.studentResponse.studentId}/register/${record.courseId}`)} icon={<SwapOutlined />} size='large' />
            ),
            width: 120,
        },
    ];
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Danh sách học viên bảo lưu</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Search style={{ marginRight: 8 }} className={styles.searchBar} placeholder="Tìm kiếm học viên, tên khóa học" onSearch={(value, e) => { setSearch(value) }} enterButton />
                <ConfigProvider
                    theme={{
                        components: {
                            DatePicker: {
                                activeBorderColor: '#f2c955'
                            },
                        },
                    }}>
                    {/* <DatePicker
                        style={{ width: 250 }}
                        value={date}
                        format={'DD/MM/YYYY'}
                        className={styles.picker}
                        onChange={(date) => setDate(date)}
                        placeholder="Ngày sinh" /> */}
                </ConfigProvider>
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={students}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                sticky={{ offsetHeader: 72 }}
            />
        </div >
    )
}
