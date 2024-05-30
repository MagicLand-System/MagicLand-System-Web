import React, { useState, useEffect } from 'react'
import styles from './ViewStudentClasses.module.css'
import { Button, Input, Table, Tabs, ConfigProvider, DatePicker, Row, Col, Avatar, Modal, } from 'antd';
import { SwapOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getClasses } from '../../../api/classesApi';
import { formatDate, formatDayOfWeek, formatPhone } from '../../../utils/utils';
import { getClassOfStudent, getStudent, getStudentClassScore, setReserve } from '../../../api/student';
import Swal from 'sweetalert2';
import { addDays, isAfter } from 'date-fns';

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
    const [apiLoading, setApiLoading] = useState(false)
    const [scores, setScores] = useState(null)
    const [viewScoresModalOpen, setViewScoresModalOpen] = useState(false)
    const handleReserve = (classId) => {
        Swal.fire({
            title: "Bạn chắc chắn muốn bảo lưu bé?",
            showCancelButton: true,
            confirmButtonText: "Lưu",
            cancelButtonText: "Hủy"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setApiLoading(true)
                    await setReserve(classId, studentId)
                        .then(() => Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Bảo lưu học viên thành công",
                            showConfirmButton: false,
                            timer: 2000
                        }))
                        .then(() => getListOfClasses(studentId, search, status, date))
                } catch (error) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: error.response?.data?.Error,
                        showConfirmButton: false,
                        timer: 2000
                    })
                } finally {
                    setApiLoading(false)
                }
            }
        });
    }
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
    async function handleViewScore(classId, studentId) {
        try {
            const data = await getStudentClassScore(classId, studentId);
            if (data.length > 0) {
                const participation = data[0].participationInfor;
                participation.quizCategory = "Participation"
                participation.examName = "Điểm danh"
                participation.scoreEarned = participation.score
                if (status === "completed") {
                    let total = (participation.scoreEarned * participation.weight) / 100;
                    let hasMissingScore = data[0]?.examInfors.some(currentExam => currentExam.scoreEarned === null);
                    if (!hasMissingScore) {
                        total = total + data[0]?.examInfors.reduce((accumulator, currentExam) => {
                            let sumScore = accumulator;
                            if (currentExam.scoreEarned !== null) {
                                sumScore = sumScore + (currentExam.scoreEarned * currentExam.weight) / 100;
                            }
                            return sumScore;
                        }, total);
                    } else {
                        total = null;
                    }
                    setScores([participation, ...data[0]?.examInfors, {
                        quizCategory: "Total Score",
                        examName: "Điểm tổng kết",
                        scoreEarned: total
                    }])
                } else {
                    setScores([participation, ...data[0]?.examInfors])
                }
                setViewScoresModalOpen(true)
            }

        } catch (error) {
            console.log(error)
        }
    }
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
            title: 'Bảo lưu',
            render: (_, record) => {
                if (record?.startDate && isAfter(new Date(record?.startDate), addDays(new Date(), 3))) {
                    return <Button disabled={apiLoading} onClick={() => handleReserve(record.classId)} className={styles.cancelButton}>
                        Bảo lưu
                    </Button>
                }
            },
            width: 120,
        },
        {
            title: 'Chuyển lớp',
            render: (_, record) => {
                if (status && record.canChangeClass === true && record.startDate && isAfter(new Date(record?.startDate), addDays(new Date(), 3))) {
                    return <Button type='link' onClick={() => navigate(`change-class/${record.classId}`)} icon={<SwapOutlined />} size='large' />
                }
            },
            width: 120,
        },
    ];
    const columnsCancel = [
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
                if (status && record.canChangeClass === true) {
                    return <Button type='link' onClick={() => navigate(`change-class/${record.classId}`)} icon={<SwapOutlined />} size='large' />
                }
            },
            width: 120,
        },
    ];
    const columnsProgressing = [
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
            title: 'Xem bảng điểm',
            render: (_, record) => {
                return <Button type='link' onClick={() => handleViewScore(record.classId, studentId)} icon={<EyeOutlined />} size='large' />
            },
            width: 120,
        },
    ];
    const columnsComplete = [
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
            title: 'Xem bảng điểm',
            render: (_, record) => {
                return <Button type='link' onClick={() => handleViewScore(record.classId, studentId)} icon={<EyeOutlined />} size='large' />
            },
            width: 120,
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
                    if (status.toLowerCase().includes('upcoming')) {
                        return <div style={{ backgroundColor: '#E5F2FF', color: '#0066FF', whiteSpace: 'nowrap' }} className={styles.status}>Chưa diễn ra</div>
                    } else if (status.toLowerCase().includes('present')) {
                        return <div style={{ backgroundColor: '#d4edda', color: '#155724', whiteSpace: 'nowrap' }} className={styles.status}>Có mặt</div>
                    } else if (status.toLowerCase().includes('absent')) {
                        return <div style={{ backgroundColor: '#FFE5E5', color: '#FF0000', whiteSpace: 'nowrap' }} className={styles.status}>Vắng mặt</div>
                    } else if (status.toLowerCase().includes('cancel')) {
                        return <div style={{ backgroundColor: '#e7e9ea', color: '#495057', whiteSpace: 'nowrap' }} className={styles.status}>Đã hủy</div>
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
    const scheduleColumnsNotMakeUp = [
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
                    if (status.toLowerCase().includes('upcoming')) {
                        return <div style={{ backgroundColor: '#87ceeb', color: '#000080', whiteSpace: 'nowrap' }} className={styles.status}>Chưa diễn ra</div>
                    } else if (status.toLowerCase().includes('present')) {
                        return <div style={{ backgroundColor: '#d4edda', color: '#155724', whiteSpace: 'nowrap' }} className={styles.status}>Có mặt</div>
                    } else if (status.toLowerCase().includes('absent')) {
                        return <div style={{ backgroundColor: '#FFE5E5', color: '#FF0000', whiteSpace: 'nowrap' }} className={styles.status}>Vắng mặt</div>
                    } else if (status.toLowerCase().includes('cancel')) {
                        return <div style={{ backgroundColor: '#e7e9ea', color: '#495057', whiteSpace: 'nowrap' }} className={styles.status}>Đã hủy</div>
                    }
                }
            }
        },
    ];
    const transcriptColumns = [
        {
            title: 'Loại',
            dataIndex: 'quizCategory',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'examName',
        },
        {
            title: 'Trọng số',
            dataIndex: 'weight',
            render: (weight) => weight && `${weight}%`
        },
        {
            title: 'Ngày làm bài',
            dataIndex: 'doingDate',
            render: (doingDate) => doingDate ? formatDate(doingDate) : "Không có"
        },
        {
            title: 'Số điểm',
            render: (_, record) => record?.scoreEarned !== undefined && record?.scoreEarned !== null
                ? record.scoreEarned
                : "Chưa có"
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
                                        columns={status === 'completed' ? columnsComplete : status === 'upcoming' ? columns : status === 'progressing' ? columnsProgressing : columnsCancel}
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
                                                        columns={record.status === 'PROGRESSING' ? scheduleColumns : scheduleColumnsNotMakeUp}
                                                        rowKey={(record) => record.id}
                                                        dataSource={record.classScheduleResponses}
                                                        sticky={{ offsetHeader: 128 }}
                                                        pagination={false} expandable={{
                                                            expandedRowRender: (record) =>
                                                                <>
                                                                    <Row>
                                                                        <Col span={3}>
                                                                            <p className={styles.classTitle}>Chủ đề:</p>
                                                                        </Col>
                                                                        <Col span={19}>
                                                                            <p className={styles.classDetail} style={{ textAlign: 'left', marginLeft: 10 }}>{record?.topicContent?.topicName}</p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col span={3}>
                                                                            <p className={styles.classTitle}>Nội dung buổi học:</p>
                                                                        </Col>
                                                                        <Col span={19}>
                                                                            {record?.topicContent?.contents && record.topicContent.contents.map((content, index) => (
                                                                                <div key={index}>
                                                                                    <p className={styles.classDetail} style={{ textAlign: 'left', marginLeft: 10 }}> {content.content}:</p>
                                                                                    {content.details.map((detail) => <p className={styles.classDetail} style={{ textAlign: 'left', marginLeft: 10 }}>&emsp;-&nbsp;{detail}</p>)}
                                                                                </div>
                                                                            ))}
                                                                        </Col>
                                                                    </Row>
                                                                </>
                                                        }}
                                                    />
                                                </ConfigProvider>,
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
                    title="Bảng điểm"
                    centered
                    open={viewScoresModalOpen}
                    footer={null}
                    onCancel={() => setViewScoresModalOpen(false)}
                    classNames={{ header: styles.modalHeader }}
                    width="80%"
                >
                    <Table
                        columns={transcriptColumns}
                        rowKey={(record) => record.examId}
                        dataSource={scores}
                        scroll={{ y: '480px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button className={styles.cancelButton}
                            onClick={() => { setViewScoresModalOpen(false) }}>
                            Đóng
                        </Button>
                    </div>
                </Modal>
            </ConfigProvider>
        </div >
    )
}
