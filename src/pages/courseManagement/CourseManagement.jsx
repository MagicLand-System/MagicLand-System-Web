import React, { useState, useEffect } from 'react'
import styles from './CourseManagement.module.css'
import { Button, Input, Modal, Table, ConfigProvider } from 'antd';
import { CloudUploadOutlined, PlusOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getSubjects, searchCourses } from '../../api/courseApi';
import { ZoomInOutlined } from '@ant-design/icons';
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
    const [importModalOpen, setImportModalOpen] = useState(false);

    async function getListsOfCourses(searchString) {
        setLoading(true);
        const data = await searchCourses(searchString);
        if (data) {
            setCourses(data);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: data.length,
                },
            });
        }
        setLoading(false);
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
            setClasses([]);
        }
    };


    const handleImport = () => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Tạo khóa học thành công",
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            setImportModalOpen(false);
        })
    }

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
                // return `${record.}`
                return '10'
            }
        },
        {
            title: 'Ngày chỉnh sửa',
            render: (_, record) => {
                // return `${formatDate(startDate)}`
                return '20/01/2024'
            }
        },
        {
            title: 'Chi tiết',
            render: (_, record) => (
                <Button type='link' onClick={() => navigate(`detail/${record.courseId}`)} icon={<ZoomInOutlined />} size='large' />
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản lý khóa học</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Button onClick={() => setImportModalOpen(true)} type='primary' className={styles.importButton} icon={<CloudUploadOutlined />}>Tạo nhiều khóa</Button>
                <Button onClick={() => navigate('add-course')} className={styles.addButton} icon={<PlusOutlined />}>Tạo khóa học</Button>
                <Search className={styles.searchBar} placeholder="Tìm kiếm khóa học" onSearch={(value, e) => { setSearch(value) }} enterButton />
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.courseId}
                dataSource={courses}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            <ConfigProvider
                theme={{
                    components: {
                        Modal: {
                            titleFontSize: '1.2rem',
                        },
                    },
                }}
            >
                <Modal
                    title="Thêm tệp khóa học"
                    centered
                    open={importModalOpen}
                    footer={null}
                    onCancel={() => setImportModalOpen(false)}
                    classNames={{ header: styles.modalHeader }}
                >
                    <Button className={styles.addButton} i
                        con={<CloudDownloadOutlined />}>Tải tệp mẫu</Button>
                    <Button type='primary' className={styles.importButton} icon={<CloudUploadOutlined />}>Chọn tệp</Button>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleImport} className={styles.saveButton}>
                            Nạp tập tin
                        </Button>
                        <Button className={styles.cancelButton} onClick={() => { setImportModalOpen(false) }}>
                            Hủy
                        </Button>
                    </div>
                </Modal>
            </ConfigProvider>
        </div >
    )
}
