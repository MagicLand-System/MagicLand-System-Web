import React, { useState, useEffect } from 'react'
import styles from './ViewStudentClasses.module.css'
import { Button, Input, Table, Tabs, ConfigProvider, } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getClasses } from '../../../api/classesApi';
import { formatDate, formatDayOfWeek } from '../../../utils/utils';
import { getClassOfStudent } from '../../../api/student';

const { Search } = Input;

const statusList = [
    {
        label: 'Sắp tới',
        key: 'upcoming',
    },
    {
        label: 'Đang diễn ra',
        key: 'progressing',
    },
    {
        label: 'Đã hoàn thành',
        key: 'completed',
    },
    {
        label: 'Đã hủy',
        key: 'canceled',
    },
]
export default function ViewStudentClasses() {
    const navigate = useNavigate()
    const params = useParams();
    const studentId = params.studentId;
    const [status, setStatus] = useState("upcoming");
    const [search, setSearch] = useState(null)
    const [classes, setClasses] = useState([]);
    const [numberOfClasses, setNumberOfClasses] = useState(null)
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    async function getListOfClasses(studentId, searchString, status) {
        try {
            setLoading(true);
            const data = await getClassOfStudent(studentId, status, searchString);
            setNumberOfClasses(data?.numberOfClasses)
            setClasses(data?.myClassResponses);
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
        getListOfClasses(studentId, search, status)
    }, [studentId, search, status])

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
    const ableToChangeClass = () => {
        if (status !== 'completed') return 1
        return 0
    }

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
        {
            title: 'Giáo viên',
            dataIndex: 'lecturerName',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (startDate) => startDate && formatDate(startDate)
        },
        {
            title: 'Lịch học',
            dataIndex: 'schedules',
            render: (schedules) =>
                schedules.map((session, index) => (
                    <p style={{ margin: 0 }} key={index}>
                        {formatDayOfWeek(session.dayOfWeek)}: {session.startTime} - {session.endTime}
                    </p>
                ))
            ,
        },
        {
            title: 'Chuyển lớp',
            colSpan: ableToChangeClass(),
            render: (_, record) => (
                status !== 'completed' && <Button type='link' onClick={() => navigate(`change-class/${record.classId}`)} icon={<SwapOutlined />} size='large' />
            ),
            width: 120,
        },
    ];
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Danh sách lớp học</h2>
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
                    defaultActiveKey={status}
                    type="card"
                    size="middle"
                    tabPosition='top'
                    onChange={activeKey => setStatus(activeKey)}
                    tabBarExtraContent={<Search className={styles.searchBar} placeholder="Tìm kiếm mã lớp, tên khóa học" onSearch={(value, e) => { setSearch(value) }} enterButton />}
                    items={statusList.map(status => (
                        {
                            label: status.label,
                            key: status.key,
                            children: (
                                <>
                                    <h5 style={{ fontSize: '1rem', color: '#888888', fontWeight: 'normal', margin: '0 10px 10px' }}>Số lượng lớp <span style={{ textTransform: "lowercase" }}>{status.label}</span>: {!loading && numberOfClasses}</h5>
                                    <Table
                                        columns={columns}
                                        rowKey={(record) => record.classId}
                                        dataSource={classes}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                        scroll={{ y: 'calc(100vh - 220px)' }}
                                    />
                                </>
                            )
                        }
                    ))}
                />
            </ConfigProvider>
        </div >
    )
}
