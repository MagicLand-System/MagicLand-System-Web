import React, { useEffect, useState } from 'react'
import styles from './MakeUpClass.module.css'
import { Button, Input, Table, Checkbox, Select, DatePicker, ConfigProvider, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatDayOfWeek, formatPhone, formatSlot } from '../../../utils/utils';
import { arrangeMakeUpClass, getMakeUpClass, getSlots } from '../../../api/classesApi';
import { compareAsc } from 'date-fns';
import dayjs from 'dayjs';
import { getSessionOfStudent, getStudent } from '../../../api/student';

const { Search } = Input;

export default function MakeUpClass() {
    const navigate = useNavigate()

    const [student, setStudent] = useState(null)
    const [schedule, setSchedule] = useState(null)
    const [apiLoading, setApiLoading] = useState(false);
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([])

    const [search, setSearch] = useState(null)
    const [findDate, setFindDate] = useState(null)
    const [slot, setSlot] = useState(null)
    const [makeUpScheduleId, setMakeUpScheduleId] = useState(null)

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const params = useParams();
    const scheduleId = params.scheduleId;
    const studentId = params.studentId;
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setAttendanceList([]);
        }
    };
    const handleSaveMakeUpClass = async () => {
        try {
            setApiLoading(true)
            if (!makeUpScheduleId) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Vui lòng chọn lớp muốn học bù",
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                await arrangeMakeUpClass(scheduleId, studentId, makeUpScheduleId)
                    .then(() => Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Xếp lớp học bù thành công",
                        showConfirmButton: false,
                        timer: 2000
                    })).then(() => {
                        navigate(-1)
                    })
            }
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
    async function getListsOfSlots() {
        const data = await getSlots();
        const sortedSlots = data.sort((a, b) => {
            const timeA = formatSlot(a.startTime);
            const timeB = formatSlot(b.startTime);
            return compareAsc(timeA, timeB);
        });
        setSlots(sortedSlots);
    };
    async function getListOfMakeUpClasses(scheduleId, studentId, keyword, dateTime, slotId) {
        try {
            setLoading(true);
            const data = await getMakeUpClass({ scheduleId, studentId, keyword, dateTime, slotId });
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
    useEffect(() => {
        getListsOfSlots()
    }, [])
    async function getScheduleDetail(scheduleId) {
        const data = await getSessionOfStudent(scheduleId);
        setSchedule(data);
    };
    async function getStudentData(studentId) {
        const data = await getStudent(studentId);
        setStudent(data[0]);
    };
    useEffect(() => {
        getStudentData(studentId);
    }, [studentId]);
    useEffect(() => {
        getScheduleDetail(scheduleId);
    }, [scheduleId]);
    useEffect(() => {
        getListOfMakeUpClasses(scheduleId, studentId, search, findDate, slot)
    }, [scheduleId, studentId, search, findDate, slot])
    const classesColumn = [
        {
            render: (_, record) => (
                <Checkbox checked={record.scheduleId === makeUpScheduleId} value={record.scheduleId} onChange={(e) => { setMakeUpScheduleId(e.target.value) }} />
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
            dataIndex: 'lecturer',
            render: (lecturer) => lecturer.fullName
        },
        {
            title: 'Hình thức',
            dataIndex: 'method',
            render: (method) => {
                if (method?.toLowerCase().includes('online')) {
                    return <div style={{ backgroundColor: '#E9FFEF', color: '#409261' }} className={styles.status}>Online</div>
                } else if (method?.toLowerCase().includes('offline')) {
                    return <div style={{ backgroundColor: '#E4E4E4', color: '#3F3748' }} className={styles.status}>Offline</div>
                }
            },
        },
        {
            title: 'Ngày học',
            dataIndex: 'date',
            render: (_, record) => (`${formatDayOfWeek(record.dayOfWeeks)} - ${formatDate(record.date)}`),
        },
        {
            title: 'Giờ học',
            dataIndex: 'slot',
            render: (slot) => (
                `${slot.startTimeString} - ${slot.endTimeString}`
            ),
        },
        {
            title: 'Phòng học',
            dataIndex: 'room',
            render: (room) => room.name,
        }
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Xếp lịch học bù</h2>
            {schedule && student && (
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
                                <h5 className={styles.classPartTitle}>Buổi học ban đầu</h5>
                                <Row>
                                    <Col span={10}>
                                        <p className={styles.classTitle}>Khóa học:</p>
                                    </Col>
                                    <Col span={14}>
                                        <p className={styles.classDetail}>{schedule.courseName}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <p className={styles.classTitle}>Buổi học thứ:</p>
                                    </Col>
                                    <Col span={14}>
                                        <p className={styles.classDetail}>{schedule.index}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Ngày học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{schedule.date && formatDate(schedule.date)}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Giờ học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{`${schedule.startTime} - ${schedule.endTime}`}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6} xs={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Nội dung buổi học</h5>
                                <Row>
                                    <Col span={10}>
                                        <p className={styles.classTitle}>Chủ đề:</p>
                                    </Col>
                                    <Col span={14}>
                                        <p className={styles.classDetail}>{schedule.topicName}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <p className={styles.classTitle}>Nội dung buổi học:</p>
                                    </Col>
                                    <Col span={24}>
                                        {schedule.contents.map((content, index) => (
                                            <div key={index}>
                                                <p className={styles.classDetail} style={{textAlign: 'left', marginLeft: 10}}> {content.content}:</p>
                                                {content.details.map((detail) => <p className={styles.classDetail} style={{textAlign: 'left', marginLeft: 10}}>&emsp;-&nbsp;{detail}</p>)}
                                            </div>
                                        ))}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
            <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
                <Search className={styles.searchBar} placeholder="Tìm kiếm lớp học, giáo viên" onSearch={(value, e) => { setSearch(value) }} enterButton />
                <ConfigProvider
                    theme={{
                        components: {
                            DatePicker: {
                                activeBorderColor: '#f2c955'
                            },
                        },
                    }}>
                    <DatePicker
                        className={styles.input}
                        value={findDate}
                        disabledDate={(current) => {
                            return current && current < dayjs().add(1, 'day').startOf('day');
                        }}
                        onChange={(date) => setFindDate(date)}
                        format={'DD/MM/YYYY'}
                        placeholder="Tìm kiếm ngày" />
                </ConfigProvider>
                <Select
                    allowClear
                    className={styles.input}
                    value={slot}
                    placeholder="Giờ học"
                    onChange={(value) => setSlot(value)}
                    options={slots.map((slot) => ({
                        value: slot.id,
                        label: `${slot.startTime} - ${slot.endTime}`
                    }))}
                />
            </div>
            <Table
                columns={classesColumn}
                rowKey={(record) => record.id}
                dataSource={classes}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <Button loading={apiLoading} disabled={!makeUpScheduleId} onClick={handleSaveMakeUpClass} className={styles.saveButton}>
                    Lưu
                </Button>
                <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                    Hủy
                </Button>
            </div>
        </div >
    )
}
