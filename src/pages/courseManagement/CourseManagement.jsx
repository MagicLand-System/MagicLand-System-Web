import React, { useState, useEffect } from 'react'
import styles from './CourseManagement.module.css'
import { Button, Input, Modal, Table, ConfigProvider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getSubjects, searchCourses } from '../../api/courseApi';
import { EyeOutlined } from '@ant-design/icons';
import { formatDate } from '../../utils/utils';

const { Search } = Input;


export default function CourseManagement() {
    const navigate = useNavigate()
    const [search, setSearch] = useState(null)
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    async function getListsOfCourses(searchString) {
        try {
            setLoading(true);
            const data = await searchCourses(searchString);
            if (data) {
                setCourses(data);
                setTableParams({
                    pagination: {
                        current: 1,
                        pageSize: 10,
                        total: data.length
                    },
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    async function getListsOfSubjects() {
        const data = await getSubjects();
        if (data) {
            setSubjects(data);
        }
    };

    useEffect(() => {
        getListsOfSubjects();
    }, []);

    useEffect(() => {
        getListsOfCourses(search);
    }, [search]);

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
    const columns = [
        {
            title: 'Tên khóa học',
            render: (_, record) => {
                return `${record.courseDetail.courseName}`
            },
            sorter: (a, b) => a.courseDetail.courseName.toLowerCase().localeCompare(b.courseDetail.courseName.toLowerCase()),
        },
        {
            title: 'Loại khóa học',
            render: (_, record) => {
                return `${record.courseDetail.subject}`
            },
            sorter: (a, b) => a.courseDetail.subject.toLowerCase().localeCompare(b.courseDetail.subject.toLowerCase()),
            filters: subjects.map((subject) => ({
                text: subject.name,
                value: subject.name
            })),
            onFilter: (value, record) => record.courseDetail.subject === value,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            render: (price) => price.toLocaleString()
        },
        {
            title: 'Số lớp học hiện tại',
            render: (_, record) => {
                return `${record.numberClassOnGoing}`
            }
        },
        {
            title: 'Chi tiết',
            render: (_, record) => (
                <Button type='link' onClick={() => navigate(`detail/${record.courseId}`)} icon={<EyeOutlined />} size='large' />
            ),
            width: 120,
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản lý khóa học</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Button onClick={() => navigate('add-course')} type='primary' className={styles.importButton} icon={<PlusOutlined />}>Thêm khóa học</Button>
                <Search className={styles.searchBar} placeholder="Tìm kiếm khóa học" onSearch={(value, e) => { setSearch(value) }} enterButton />
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.courseId}
                dataSource={courses}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
        </div >
    )
}
