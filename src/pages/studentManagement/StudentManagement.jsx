import React, { useState, useEffect } from 'react'
import styles from './StudentManagement.module.css'
import { Button, DatePicker, Input, Table, Avatar, ConfigProvider } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStudentsOfClass } from '../../api/classesApi';
import { formatDate, formatPhone } from '../../utils/utils';
import dayjs from 'dayjs';
import { getStudents } from '../../api/student';

const { Search } = Input

export default function StudentManagement() {

    const navigate = useNavigate();
    const [name, setName] = useState(null)
    const [dateOfBirth, setDateOfBirth] = useState(null)
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    async function getStudentsList(name, dateOfBirth) {
        try {
            setLoading(true);
            const data = await getStudents(name, dateOfBirth);
            setStudents(data);
            setTableParams({
                ...tableParams,
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: data?.length
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getStudentsList(name, dateOfBirth)
    }, [name, dateOfBirth])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };
    const studentsColumns = [
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
        {
            title: 'Ngày sinh',
            render: (_, record) => (record.studentResponse?.dateOfBirth && formatDate(record.studentResponse?.dateOfBirth)),
        },
        {
            title: 'Giới tính',
            render: (_, record) => {
                if (record.studentResponse?.gender === 'Nữ') {
                    return <div style={{ backgroundColor: '#ffb6c1', color: '#800000', whiteSpace: 'nowrap' }} className={styles.status}>Nữ</div>
                } else if (record.studentResponse?.gender === 'Nam') {
                    return <div style={{ backgroundColor: '#87ceeb', color: '#000080', whiteSpace: 'nowrap' }} className={styles.status}>Nam</div>
                }
            },
            filters: [
                {
                    text: 'Nữ',
                    value: 'Nữ',
                },
                {
                    text: 'Nam',
                    value: 'Nam',
                },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.gender === value,
        },
        {
            title: 'Tên phụ huynh',
            render: (_, record) => record.parent?.fullName,
        },
        {
            title: 'Số điện thoại phụ huynh',
            render: (_, record) => record.parent?.phone && formatPhone(record.parent?.phone),
        },
        {
            title: 'Lớp học',
            render: (_, record) =>
                <Button type='link' onClick={() => navigate(`view-classes/${record.studentResponse.studentId}`)} icon={< EyeOutlined />} size='large' />,
            width: 120,
        },
        {
            title: 'Buổi học',
            render: (_, record) =>
                <Button type='link' onClick={() => navigate(`view-schedules/${record.studentResponse.studentId}`)} icon={< EyeOutlined />} size='large' />,
            width: 120,
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản lý học viên</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Search className={styles.searchBar} placeholder="Tên học viên" onSearch={(value, e) => { setName(value) }} enterButton />
                <ConfigProvider
                    theme={{
                        components: {
                            DatePicker: {
                                activeBorderColor: '#f2c955'
                            },
                        },
                    }}>
                    <DatePicker
                        allowClear
                        style={{ marginLeft: 8, width: 250 }}
                        value={dateOfBirth}
                        format={'DD/MM/YYYY'}
                        disabledDate={(current) => {
                            return (current > dayjs().subtract(3, 'year'))
                        }}
                        className={styles.picker}
                        onChange={(date) => setDateOfBirth(date)}
                        placeholder="Ngày sinh" />
                </ConfigProvider>
            </div>
            <Table
                columns={studentsColumns}
                rowKey={(record) => record.studentId}
                dataSource={students}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
        </div >
    )
}
