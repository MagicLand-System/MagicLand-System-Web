import React, { useEffect, useState } from 'react'
import styles from './ChangeClass.module.css'
import { Button, Table, Checkbox, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatDayOfWeek, formatPhone } from '../../../utils/utils';
import { changeClass, getClass, getSuitableClass } from '../../../api/classesApi';
import { addStudentToClass, getStudent, getSuitableReserveClass, setReserve } from '../../../api/student';
import { getCourse } from '../../../api/courseApi';

export default function ChangeClass() {
    const navigate = useNavigate()
    const [apiLoading, setApiLoading] = useState(false);
    const [apiReserveLoading, setApiReserveLoading] = useState(false);
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(false);

    const [newClassId, setNewClassId] = useState(null)
    const [student, setStudent] = useState(null)
    const [classData, setClassData] = useState(null)
    const [course, setCourse] = useState(null)

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const params = useParams();
    const classId = params.classId;
    const courseId = params.courseId;
    const studentId = params.studentId;
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
    const handleReserve = () => {
        Swal.fire({
            title: "Bạn chắc chắn muốn bảo lưu bé?",
            showCancelButton: true,
            confirmButtonText: "Lưu",
            cancelButtonText: "Hủy"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setApiReserveLoading(true)
                    await setReserve(classId, studentId)
                        .then(() => Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Bảo lưu học viên thành công",
                            showConfirmButton: false,
                            timer: 2000
                        })).then(() => {
                            navigate(-1)
                        })
                } catch (error) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: error.response?.data?.Error,
                        showConfirmButton: false,
                        timer: 2000
                    })
                } finally {
                    setApiReserveLoading(false)
                }
            }
        });
    }
    const handleSaveChangeClass = async () => {
        try {
            setApiLoading(true)
            if (!newClassId) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Vui lòng chọn lớp muốn chuyển tới",
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                await changeClass(classId, newClassId, studentId)
                    .then(() => Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Chuyển lớp thành công",
                        showConfirmButton: false,
                        timer: 2000
                    })).then(() => {
                        navigate(-1)
                    })
            }
        } catch (error) {
            console.log(error)
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
    const handleSaveAddClass = async () => {
        try {
            setApiLoading(true)
            if (!newClassId) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Vui lòng chọn lớp muốn học",
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                await addStudentToClass(courseId, newClassId, studentId)
                    .then(() => Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Thêm học viên vào lớp thành công",
                        showConfirmButton: false,
                        timer: 2000
                    })).then(() => {
                        navigate(-1)
                    })
            }
        } catch (error) {
            console.log(error)
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
    const classesColumn = [
        {
            render: (_, record) => (
                <Checkbox checked={record.classId === newClassId} value={record.classId} onChange={(e) => { setNewClassId(e.target.value) }} />
            ),
            width: 120,
        },
        {
            title: 'Mã lớp học',
            dataIndex: 'classCode',
            sorter: (a, b) => a.classCode.toLowerCase().localeCompare(b.classCode.toLowerCase()),
        },
        {
            title: 'Giáo viên',
            render: (_, record) => record.lecture?.fullName
        },
        {
            title: 'Số buổi đã học',
            render: (_, record) => record.currentSession
        },
        {
            title: 'Hình thức',
            dataIndex: 'method',
            render: (method) => {
                if (method.toLowerCase().includes('online')) {
                    return <div style={{ backgroundColor: '#E9FFEF', color: '#409261' }} className={styles.status}>Online</div>
                } else if (method.toLowerCase().includes('offline')) {
                    return <div style={{ backgroundColor: '#E4E4E4', color: '#3F3748' }} className={styles.status}>Offline</div>
                }
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (startDate) => formatDate(startDate)
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
    const classesReserveColumn = [
        {
            render: (_, record) => (
                <Checkbox checked={record.classId === newClassId} value={record.classId} onChange={(e) => { setNewClassId(e.target.value) }} />
            ),
            width: 120,
        },
        {
            title: 'Mã lớp học',
            dataIndex: 'classCode',
            sorter: (a, b) => a.classCode.toLowerCase().localeCompare(b.classCode.toLowerCase()),
        },
        {
            title: 'Giáo viên',
            render: (_, record) => record.lecturerName
        },
        {
            title: 'Hình thức',
            dataIndex: 'method',
            render: (method) => {
                if (method.toLowerCase().includes('online')) {
                    return <div style={{ backgroundColor: '#E9FFEF', color: '#409261' }} className={styles.status}>Online</div>
                } else if (method.toLowerCase().includes('offline')) {
                    return <div style={{ backgroundColor: '#E4E4E4', color: '#3F3748' }} className={styles.status}>Offline</div>
                }
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (startDate) => formatDate(startDate)
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
    async function getListsOfClasses(classId, studentId) {
        try {
            setLoading(true);
            const data = await getSuitableClass(classId, studentId);
            setClasses(data);
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
    async function getListsOfReserveClasses(courseId, studentId) {
        try {
            setLoading(true);
            const data = await getSuitableReserveClass(courseId, studentId);
            setClasses(data);
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
    async function getCourseDetail(courseId) {
        const data = await getCourse(courseId);
        setCourse(data);
    };
    async function getClassDetail(classId) {
        const data = await getClass(classId);
        setClassData(data);
    };
    async function getStudentData(studentId) {
        const data = await getStudent(studentId);
        setStudent(data[0]);
    };
    useEffect(() => {
        getStudentData(studentId);
    }, [studentId]);
    useEffect(() => {
        if (classId) {
            getClassDetail(classId);
        } else if (courseId) {
            getCourseDetail(courseId);
        }
    }, [classId, courseId]);
    useEffect(() => {
        if (classId) {
            getListsOfClasses(classId, studentId);
        } else if (courseId) {
            getListsOfReserveClasses(courseId, studentId)
        }
    }, [classId, courseId, studentId]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{classId ? 'Chuyển lớp' : 'Xếp lớp'}</h2>
            {classData && student && (
                <>
                    <Row>
                        <Col md={6} xs={12} style={{ marginBottom: '40px' }}>
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
                        <Col md={6} xs={12} style={{ marginBottom: '40px' }}>
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
                                <h5 className={styles.classPartTitle}>Lớp học ban đầu</h5>
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
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Ngày bắt đầu:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData && `${formatDate(classData.startDate)}`}</p>
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
                    </Row>
                </>
            )}
            {course && student && (
                <>
                    <Row>
                        <Col md={8} xs={12} style={{ marginBottom: '40px' }}>
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
                        <Col md={8} xs={12} style={{ marginBottom: '40px' }}>
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
                        <Col md={8} xs={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Khóa học</h5>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Tên khóa học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{course.name}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Loại khóa học:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{course.subjectName}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Mã giáo trình:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{course.syllabusCode}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Độ tuổi phù hợp:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{course.minYearOldsStudent} - {course.maxYearOldsStudent} tuổi</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
            <Table
                columns={classId ? classesColumn : classesReserveColumn}
                rowKey={(record) => record.classId}
                dataSource={classes}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                sticky={{ offsetHeader: 72 }}
            />
            {classId ?
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                    <Button loading={apiLoading} disabled={!newClassId || apiReserveLoading} onClick={handleSaveChangeClass} className={styles.saveButton}>
                        Lưu
                    </Button>
                    <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                        Hủy
                    </Button>
                </div>
                : courseId &&
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                    <Button loading={apiLoading} disabled={!newClassId} onClick={handleSaveAddClass} className={styles.saveButton}>
                        Lưu
                    </Button>
                    <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                        Hủy
                    </Button>
                </div>
            }
        </div >
    )
}
