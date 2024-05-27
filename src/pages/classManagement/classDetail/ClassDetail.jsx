import React, { useState, useEffect } from 'react'
import styles from './ClassDetail.module.css'
import { Button, DatePicker, Input, Table, Row, Col, Avatar, ConfigProvider, Tabs, Modal, Select, Empty } from 'antd';
import { SwapOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelClass, getClass, getClassScores, getLecturerChangeClass, getRoomChangeClass, getSessionOfClass, getSlots, getStudentsOfClass, updateClass, updateSession } from '../../../api/classesApi';
import { formatDate, formatDayOfWeek, formatPhone, formatSlot } from '../../../utils/utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { compareAsc, isPast } from 'date-fns';

const { Search } = Input;

export default function ClassDetail() {
    const params = useParams();
    const id = params.id;

    const navigate = useNavigate();
    const [tabActive, setTabActive] = useState('students')
    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState([]);
    const [studentsTranscript, setStudentsTranscript] = useState([]);

    const [sessions, setSessions] = useState([]);

    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [transcripts, setTranscripts] = useState([])

    async function getClassDetail(id) {
        const data = await getClass(id);
        setClassData(data);
    }
    async function getStudentsList(id) {
        try {
            setLoading(true)
            const data = await getStudentsOfClass(id);
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
    async function getStudentsTranscript(id) {
        try {
            const data = await getClassScores(id);
            setStudentsTranscript(data);
            if (data.length > 0 && data[0].examInfors.length > 0) {
                setTranscripts(data[0]?.examInfors?.map((transcript, index) => (
                    {
                        title: (
                            <div style={{ display: 'flex' }}>
                                {transcript.examName}
                                {transcript.weight ? ` - ${transcript.weight}%` : ""}
                                {transcript.quizType === "offline"
                                    && classData?.status?.toLowerCase().includes('progressing')
                                    && isPast(transcript.doingDate) &&
                                    <Button
                                        style={{ color: "white" }}
                                        type="link"
                                        onClick={() => navigate(`update-scores/${transcript.examId}`)}
                                        icon={<EditOutlined />}
                                        size="large"
                                    />
                                }
                            </div>
                        ),
                        render: (_, record) => {
                            const matchingExam = record?.examInfors?.find(exam => exam.examName === transcript.examName);
                            return matchingExam?.scoreEarned !== undefined && matchingExam?.scoreEarned !== null
                                ? matchingExam.scoreEarned
                                : "Chưa có";
                        },
                    }
                )))
            }
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
    async function getSessions(id) {
        try {
            const data = await getSessionOfClass(id);
            setSessions(data);
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
        if (tabActive === 'students') {
            getStudentsList(id);
        } else if (tabActive === 'sessions') {
            getSessions(id);
        } else if (tabActive === 'studentsTranscript') {
            getStudentsTranscript(id)
        }
    }, [tabActive]);
    useEffect(() => {
        getClassDetail(id)
        if (tabActive === 'students') {
            getStudentsList(id);
        } else if (tabActive === 'sessions') {
            getSessions(id);
        } else if (tabActive === 'studentsTranscript') {
            getStudentsTranscript(id)
        }
    }, [id]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };
    const handleCancelClass = () => {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Bạn muốn hủy lớp này?",
            text: "Bạn không thể hoàn tác hành động này",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Hủy lớp học",
            cancelButtonText: "Hủy"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await cancelClass(id)
                    .then(() => {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Hủy lớp học thành công",
                            showConfirmButton: false,
                            timer: 2000
                        })
                        getClassDetail(id)
                    })
            }
        });
    }
    const studentsColumns = [
        {
            title: 'Tên học viên',
            dataIndex: 'fullName',
            sorter: (a, b) => a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()),
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar size={64} src={record.imgAvatar} style={{ marginRight: '10px' }} />
                    <p>{record.fullName}</p>
                </div>
            ),
            width: 250
        },
        {
            title: 'Tuổi',
            dataIndex: 'dateOfBirth',
            render: (_, record) => (record.dateOfBirth && (new Date().getFullYear() - new Date(record.dateOfBirth).getFullYear())),
            sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (gender) => {
                if (gender === 'Nữ') {
                    return <div style={{ backgroundColor: '#ffb6c1', color: '#800000', whiteSpace: 'nowrap' }} className={styles.status}>Nữ</div>
                } else if (gender === 'Nam') {
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
            dataIndex: 'parentName'
        },
        {
            title: 'Số điện thoại phụ huynh',
            dataIndex: 'parentPhoneNumber',
            render: (parentPhoneNumber) => parentPhoneNumber && formatPhone(parentPhoneNumber)
        },
        {
            title: 'Chuyển lớp',
            render: (_, record) => {
                if (record.canChangeClass) {
                    return (
                        <Button type='link' onClick={() => navigate(`/student-management/view-classes/${record.studentId}/change-class/${id}`)} icon={< SwapOutlined />} size='large' />
                    )
                }
            },
            width: 120
        },
    ];
    const studentsColumnsNotChange = [
        {
            title: 'Tên học viên',
            dataIndex: 'fullName',
            sorter: (a, b) => a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()),
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar size={64} src={record.imgAvatar} style={{ marginRight: '10px' }} />
                    <p>{record.fullName}</p>
                </div>
            ),
            width: 250
        },
        {
            title: 'Tuổi',
            dataIndex: 'dateOfBirth',
            render: (_, record) => (record.dateOfBirth && (new Date().getFullYear() - new Date(record.dateOfBirth).getFullYear())),
            sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (gender) => {
                if (gender === 'Nữ') {
                    return <div style={{ backgroundColor: '#ffb6c1', color: '#800000', whiteSpace: 'nowrap' }} className={styles.status}>Nữ</div>
                } else if (gender === 'Nam') {
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
            dataIndex: 'parentName'
        },
        {
            title: 'Số điện thoại phụ huynh',
            dataIndex: 'parentPhoneNumber',
            render: (parentPhoneNumber) => parentPhoneNumber && formatPhone(parentPhoneNumber)
        },
    ];
    const transcriptColumns = [
        {
            title: 'Tên học viên',
            sorter: (a, b) => a.studentInfor?.fullName?.toLowerCase().localeCompare(b.studentInfor?.fullName?.toLowerCase()),
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar size={64} src={record?.studentInfor?.avatarImage} style={{ marginRight: '10px' }} />
                    <p>{record?.studentInfor?.fullName}</p>
                </div>
            ),
        },
        {
            title: (_, record) => `Điểm danh${record?.participationInfor?.weight ? ` - ${record?.participationInfor?.weight}` : ""}`,
            render: (_, record) => record.participationInfor?.score
        },
        ...transcripts
    ];
    const completedTranscriptColumns = [
        {
            title: 'Tên học viên',
            sorter: (a, b) => a.studentInfor?.fullName?.toLowerCase().localeCompare(b.studentInfor?.fullName?.toLowerCase()),
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar size={64} src={record?.studentInfor?.avatarImage} style={{ marginRight: '10px' }} />
                    <p>{record?.studentInfor?.fullName}</p>
                </div>
            ),
        },
        {
            title: (_, record) => `Điểm danh${record?.participationInfor?.weight ? ` - ${record?.participationInfor?.weight}` : ""}`,
            render: (_, record) => record.participationInfor?.score
        },
        ...transcripts,
        {
            title: "Điểm tổng kết",
            render: (_, record) => {
                let total = (record.participationInfor?.score * record.participationInfor?.weight) / 100;
                let hasMissingScore = record.examInfors.some(currentExam => currentExam.scoreEarned === null);
                if (!hasMissingScore) {
                    total = total + record.examInfors.reduce((accumulator, currentExam) => {
                        let sumScore = accumulator;
                        if (currentExam.scoreEarned !== null) {
                            sumScore = sumScore + (currentExam.scoreEarned * currentExam.weight) / 100;
                        }
                        return sumScore;
                    }, total);
                } else {
                    total = null;
                }
                return total !== null ? total : "Chưa có"
            }
        }
    ];
    const sessionsColumns = [
        {
            title: 'Buổi học',
            dataIndex: 'index',
            sorter: (a, b) => a.index - b.index,
            width: 120
        },
        {
            title: 'Giáo viên',
            dataIndex: 'lecturer',
            render: (lecturer) => lecturer.fullName
        },
        {
            title: 'Ngày học',
            render: (_, record) => {
                return `${formatDayOfWeek(record.dayOfWeeks)} - ${formatDate(record.date)}`
            }
        },
        {
            title: 'Giờ học',
            render: (_, record) => `${record.slot.startTimeString} - ${record.slot.endTimeString}`
        },
        {
            title: 'Phòng học',
            dataIndex: 'room',
            render: (room) => room.name
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                if (status.toLowerCase().includes('future')) {
                    return <div style={{ backgroundColor: '#e7e9ea', color: '#495057', whiteSpace: 'nowrap' }} className={styles.status}>Sắp tới</div>
                } else if (status.toLowerCase().includes('completed')) {
                    return <div style={{ backgroundColor: '#d4edda', color: '#155724', whiteSpace: 'nowrap' }} className={styles.status}>Đã hoàn thành</div>
                } else if (status.toLowerCase().includes('canceled')) {
                    return <div style={{ backgroundColor: '#FFE5E5', color: '#FF0000', whiteSpace: 'nowrap' }} className={styles.status}>Đã hủy</div>
                }
            }
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Chi tiết lớp học</h2>
            {classData && (
                <>
                    <Row>
                        <Col md={6} xs={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Thông tin chung</h5>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Mã lớp:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.classCode}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Trạng thái:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.status.toLowerCase().includes('completed') ? 'Đã hoàn thành'
                                            : classData.status.toLowerCase().includes('upcoming') ? 'Sắp tới'
                                                : classData.status.toLowerCase().includes('progressing') ? 'Đang diễn ra'
                                                    : classData.status.toLowerCase().includes('canceled') && 'Đã hủy'}
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Số lượng tối thiểu:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{classData.leastNumberStudent}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Số lượng tối đa:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{classData.limitNumberStudent}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Số lượng học viên:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{classData.numberStudentRegistered}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6} xs={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Học vụ</h5>
                                <Row>
                                    <Col span={12}>
                                        <p className={styles.classTitle}>Ngày bắt đầu:</p>
                                    </Col>
                                    <Col span={12}>
                                        <p className={styles.classDetail}>{classData && `${formatDate(classData.startDate)}`}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <p className={styles.classTitle}>Ngày kết thúc:</p>
                                    </Col>
                                    <Col span={12}>
                                        <p className={styles.classDetail}>{classData && `${formatDate(classData.endDate)}`}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Hình thức:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail} style={{ textTransform: 'capitalize' }}>{classData.method.toLowerCase()}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <p className={styles.classTitle}>Phòng học:</p>
                                    </Col>
                                    <Col span={14}>
                                        <p className={styles.classDetail}>{classData.roomResponse.name}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <p className={styles.classTitle}>Lịch học hàng tuần:</p>
                                    </Col>
                                    <Col span={14}>
                                        {classData?.schedules?.map((session, index) => (
                                            <p className={styles.classDetail} key={index}>
                                                {formatDayOfWeek(session.dayOfWeek)}: {session.startTime} - {session.endTime}
                                            </p>
                                        ))}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6} xs={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Khóa học</h5>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Tên khóa học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.courseResponse.name}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Mã giáo trình:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{classData.courseResponse.syllabusCode}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Độ tuổi phù hợp:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{classData.courseResponse.minYearOldsStudent} - {classData.courseResponse.maxYearOldsStudent} tuổi</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6} xs={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Giáo viên</h5>
                                <Row>
                                    <Col span={10}>
                                        <p className={styles.classTitle}>Tên giáo viên:</p>
                                    </Col>
                                    <Col span={14}>
                                        <p className={styles.classDetail} style={{ textTransform: 'capitalize' }}>{classData.lecturerResponse.fullName}</p>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col span={10}>
                                        <p className={styles.classTitle}>Số điện thoại:</p>
                                    </Col>
                                    <Col span={14}>
                                        <p className={styles.classDetail}>{formatPhone(classData.lecturerResponse.phone)}</p>
                                    </Col>
                                </Row> */}
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Email:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.lecturerResponse.email}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    {/* {!classData.status.toLowerCase().includes('canceled') && !classData.status.toLowerCase().includes('completed') && (
                        <div style={{ display: 'flex', marginBottom: '20px' }}>
                            <Button className={styles.cancelButton} onClick={handleCancelClass}>
                                Hủy lớp học
                            </Button>
                        </div>
                    )} */}
                </>
            )}
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
                    defaultActiveKey={'students'}
                    type="card"
                    size="middle"
                    onChange={activeKey => setTabActive(activeKey)}
                    items={[
                        {
                            label: 'Học viên',
                            key: 'students',
                            children: (
                                <>
                                    {/* <div style={{ display: 'flex', marginBottom: '16px' }}>
                                        <Search className={styles.searchBar} placeholder="Tìm kiếm học viên..." onSearch={(value, e) => { console.log(value) }} enterButton />
                                    </div> */}
                                    <Table
                                        columns={(classData?.status && !classData?.status?.toLowerCase().includes('upcoming') && !classData?.status?.toLowerCase().includes('canceled')) ? studentsColumns : studentsColumnsNotChange}
                                        rowKey={(record) => record.studentId}
                                        dataSource={students}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                        sticky={{ offsetHeader: 72 }}
                                    />
                                </>
                            )
                        },
                        (classData?.status?.toLowerCase().includes('completed') || classData?.status?.toLowerCase().includes('progressing')) && {
                            label: 'Bảng điểm',
                            key: 'studentsTranscript',
                            children: (
                                <>
                                    <Table
                                        columns={classData.status.toLowerCase().includes('completed') ? completedTranscriptColumns : transcriptColumns}
                                        rowKey={(record) => record.studentId}
                                        dataSource={studentsTranscript}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                        sticky={{ offsetHeader: 72 }}
                                    />
                                </>
                            )
                        },
                        {
                            label: 'Lịch học',
                            key: 'sessions',
                            children: (
                                <Table
                                    columns={sessionsColumns}
                                    rowKey={(record) => record.id}
                                    dataSource={sessions}
                                    pagination={tableParams.pagination}
                                    loading={loading}
                                    onChange={handleTableChange}
                                    sticky={{ offsetHeader: 72 }}
                                />
                            )
                        },
                    ]}
                />

            </ConfigProvider>
        </div >
    )
}
