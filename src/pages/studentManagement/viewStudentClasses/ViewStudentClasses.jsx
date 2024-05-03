import React, { useState, useEffect } from 'react'
import styles from './ViewStudentClasses.module.css'
import { Button, Input, Table, Tabs, ConfigProvider, DatePicker, Row, Col, Avatar, } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getClasses } from '../../../api/classesApi';
import { formatDate, formatDayOfWeek, formatPhone } from '../../../utils/utils';
import { getClassOfStudent, getStudent } from '../../../api/student';

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
    const [student, setStudent] = useState(null)
    const [status, setStatus] = useState("upcoming");
    const [search, setSearch] = useState(null)
    const [date, setDate] = useState(null)
    const [classes, setClasses] = useState([]);
    const [numberOfClasses, setNumberOfClasses] = useState(null)
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    async function getListOfClasses(studentId, searchString, status, date) {
        try {
            setLoading(true);
            const data = await getClassOfStudent(studentId, status, searchString, date);
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
    async function getStudentData(studentId) {
        const data = await getStudent(studentId);
        setStudent(data[0]);
    };
    useEffect(() => {
        getStudentData(studentId);
    }, [studentId]);
    useEffect(() => {
        getListOfClasses(studentId, search, status, date)
    }, [studentId, search, status, date])

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
            render: (_, record) => {
                if (status && status !== 'completed') {
                    return <Button type='link' onClick={() => navigate(`change-class/${record.classId}`)} icon={<SwapOutlined />} size='large' />
                }
            },
            width: 120,
        },
    ];
    const columnsNotChange = [
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
    ];
    const scheduleColumns = [
        {
            title: 'Buổi học',
            dataIndex: 'index',
            width: 120
        },
        {
            title: 'Ngày học',
            render: (_, record) => {
                return record.date && formatDate(record.date)
            }
        },
        {
            title: 'Giờ học',
            render: (_, record) => `${record.startTime} - ${record.endTime}`
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                if (status) {
                    if (status.toLowerCase().includes('chưa diễn ra')) {
                        return <div style={{ backgroundColor: '#e7e9ea', color: '#495057', whiteSpace: 'nowrap' }} className={styles.status}>Chưa diễn ra</div>
                    } else if (status.toLowerCase().includes('có mặt')) {
                        return <div style={{ backgroundColor: '#d4edda', color: '#155724', whiteSpace: 'nowrap' }} className={styles.status}>Có mặt</div>
                    } else if (status.toLowerCase().includes('vắng mặt')) {
                        return <div style={{ backgroundColor: '#FFE5E5', color: '#FF0000', whiteSpace: 'nowrap' }} className={styles.status}>Vắng mặt</div>
                    }
                }
            }
        },
        {
            title: 'Học bù',
            render: (_, record) => (
                record.status && !record.status.toLowerCase().includes('có mặt') &&
                <Button type='link' onClick={() => navigate(`make-up-class/${record.id}`)} icon={<SwapOutlined />} size='large' />
            ),
            width: 120,
        },
    ];
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Danh sách lớp học</h2>
            {student &&
                <Row>
                    {/* <Col span={2} style={{ marginBottom: '40px' }}>
                        <Avatar shape="square" src={student?.studentResponse?.avatarImage} size={120} style={{margin: '0 auto'}}/>
                    </Col> */}
                    <Col span={12} style={{ marginBottom: '40px' }}>
                        <div className={styles.classPart}>
                            <h5 className={styles.classPartTitle}>Học viên</h5>
                            <Row>
                                <Col span={8}>
                                    <p className={styles.classTitle}>Họ và tên:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.classDetail}>{student?.studentResponse?.fullName}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <p className={styles.classTitle}>Ngày sinh:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.classDetail}>{student?.studentResponse?.dateOfBirth && `${formatDate(student.studentResponse.dateOfBirth)}`}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <p className={styles.classTitle}>Giới tính:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.classDetail}>{student?.studentResponse?.gender}</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col span={12} style={{ marginBottom: '40px' }}>
                        <div className={styles.classPart}>
                            <h5 className={styles.classPartTitle}>Phụ huynh</h5>
                            <Row>
                                <Col span={8}>
                                    <p className={styles.classTitle}>Họ và tên:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.classDetail}>{student?.parent?.fullName}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <p className={styles.classTitle}>Số điện thoại:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.classDetail}>{student?.parent?.phone && `${formatPhone(student.parent.phone)}`}</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            }
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Search style={{ marginRight: 8 }} className={styles.searchBar} placeholder="Tìm kiếm mã lớp, tên khóa học" onSearch={(value, e) => { setSearch(value) }} enterButton />
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
                    items={statusList.map(statusL => (
                        {
                            label: statusL.label,
                            key: statusL.key,
                            children: (
                                <>
                                    <h5 style={{ fontSize: '1rem', color: '#888888', fontWeight: 'normal', margin: '0 10px 10px' }}>Số lượng lớp <span style={{ textTransform: "lowercase" }}>{statusL.label}</span>: {!loading && numberOfClasses}</h5>
                                    <Table
                                        columns={status !== 'completed' ? columns : columnsNotChange}
                                        expandable={{
                                            expandedRowRender: (record) =>
                                                <ConfigProvider
                                                    theme={{
                                                        components: {
                                                            Table: {
                                                                headerBg: "#7940fe",
                                                                headerColor: "#fff"
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <Table
                                                        columns={scheduleColumns}
                                                        rowKey={(record) => record.id}
                                                        dataSource={record.classScheduleResponses}
                                                        sticky={{ offsetHeader: 128 }}
                                                        pagination={false}
                                                    />
                                                </ConfigProvider>,
                                            onExpand: (expanded, record) =>
                                                console.log("onExpand: ", record, expanded),
                                        }}
                                        rowKey={(record) => record.classId}
                                        dataSource={classes}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                        sticky={{ offsetHeader: 72 }}
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
