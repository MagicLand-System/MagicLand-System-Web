import React, { useState, useEffect } from 'react'
import styles from './ClassDetail.module.css'
import { Button, DatePicker, Input, Table, Row, Col, Avatar, ConfigProvider, Tabs, Modal, Select } from 'antd';
import { SwapOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelClass, getClass, getLecturer, getRooms, getSessionOfClass, getSlots, getStudentsOfClass, updateClass, updateSession } from '../../../api/classesApi';
import { formatDate, formatDayOfWeek, formatSlot } from '../../../utils/utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { compareAsc } from 'date-fns';

const { Search } = Input;

export default function ClassDetail() {
    const params = useParams();
    const id = params.id;

    const navigate = useNavigate();
    const [tabActive, setTabActive] = useState('students')
    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [modifyModalOpen, setModifyModalOpen] = useState(false)
    const [sessionModalOpen, setSessionModalOpen] = useState(false)

    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [lecturers, setlecturers] = useState([])
    const [lecturersOptions, setLecturersOptions] = useState(lecturers);

    const [lecturer, setLecturer] = useState(null)
    const [lecturerError, setLecturerError] = useState(null)

    const [rooms, setRooms] = useState([])
    const [roomsOptions, setRoomsOptions] = useState(rooms)

    const [room, setRoom] = useState(null)
    const [roomError, setRoomError] = useState(null)

    const [slots, setSlots] = useState([])
    
    const [sessionId, setSessionId] = useState(null);

    const [lecturerSession, setLecturerSession] = useState(null)
    const [lecturerSessionError, setLecturerSessionError] = useState(null)

    const [roomSession, setRoomSession] = useState(null)
    const [roomSessionError, setRoomSessionError] = useState(null)

    const [slotSession, setSlotSession] = useState(null)
    const [slotSessionError, setSlotSessionError] = useState(null)

    const [dateSession, setDateSession] = useState(null);
    const [dateSessionError, setDateSessionError] = useState(null)


    const formik = useFormik({
        initialValues: {
            leastNumberStudent: null,
            limitNumberStudent: null,
        },
        onSubmit: async values => {
            if (!lecturer || !room) {
                if (lecturer === null) {
                    setLecturerError("Vui lòng chọn giáo viên")
                } else {
                    setLecturerError(null)
                }
                if (room === null) {
                    setRoomError("Vui lòng nhập phòng học")
                } else {
                    setRoomError(null)
                }
            } else {
                try {
                    await updateClass(id, { ...values, lecturerId: lecturer, roomId: room })
                        .then(() => {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Chỉnh sửa lớp học thành công",
                                showConfirmButton: false,
                                timer: 2000
                            })
                        })
                        .then(() => {
                            getClassDetail(id)
                            getSessions(id)
                            setModifyModalOpen(false)
                            setLecturerError(null)
                            setRoomError(null)
                            formik.resetForm()
                        })
                } catch (error) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Đã có lỗi xảy ra trong quá trình chỉnh sửa",
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            }
        },
        validationSchema: Yup.object({
            leastNumberStudent: Yup.number().min(1, "Số lượng học viên tối thiểu phải lớn hơn 1").max(25, "Số lượng học viên tối thiểu phải nhỏ hơn 25"),
            limitNumberStudent: Yup.number().when(
                'leastNumberStudent',
                (minNum, schema) => schema.min(minNum, "Số lượng học viên tối đa phải lớn hơn hoặc bằng số tối thiểu")
            ).max(25, "Số lượng học viên tối đa phải nhỏ hơn 25"),
        }),
    });
    async function getClassDetail(id) {
        const data = await getClass(id);
        setClassData(data);
        setLecturer(data.lecturerResponse.lectureId);
        setRoom(data.roomResponse.roomId);
        formik.setValues({
            leastNumberStudent: data.leastNumberStudent,
            limitNumberStudent: data.limitNumberStudent,
        })

    }
    async function getStudentsList(id) {
        try {
            const data = await getStudentsOfClass(id);
            setStudents(data);
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
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    async function getListsOfLecturer() {
        const data = await getLecturer();
        setlecturers(data);
        setLecturersOptions(data);
    };
    async function getListsOfRooms() {
        const data = await getRooms();
        setRooms(data);
        setRoomsOptions(data);
    };
    async function getListsOfSlots() {
        const data = await getSlots();
        setSlots(data);
    };
    useEffect(() => {
        getListsOfLecturer()
        getListsOfRooms();
        getListsOfSlots()
    }, []);
    useEffect(() => {
        if (tabActive === 'students') {
            getStudentsList(id);
        } else if (tabActive === 'sessions') {
            getSessions(id);
        }
    }, [tabActive]);
    useEffect(() => {
        getClassDetail(id)
        if (tabActive === 'students') {
            getStudentsList(id);
        } else if (tabActive === 'sessions') {
            getSessions(id);
        }
    }, [id]);

    const handleUpdateSession = async () => {
        if (!lecturerSession || !roomSession || !slotSession || !dateSession) {
            if (lecturerSession === null) {
                setLecturerSessionError("Vui lòng chọn giáo viên")
            } else {
                setLecturerSessionError(null)
            }
            if (roomSession === null) {
                setRoomSessionError("Vui lòng nhập phòng học")
            } else {
                setRoomSessionError(null)
            }
            if (slotSession === null) {
                setSlotSessionError("Vui lòng chọn giờ học")
            } else {
                setSlotSessionError(null)
            }
            if (dateSession === null) {
                setDateSessionError("Vui lòng chọn ngày học")
            } else {
                setDateSessionError(null)
            }
        } else {
            try {
                await updateSession(sessionId, { lecturerId: lecturerSession, roomId: roomSession, slotId: slotSession, dateTime: dateSession })
                    .then(() => {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Chỉnh sửa buổi học thành công",
                            showConfirmButton: false,
                            timer: 2000
                        })
                    })
                    .then(() => {
                        getSessions(id)
                        setSessionModalOpen(false)
                        setLecturerSessionError(null)
                        setRoomSessionError(null)
                        setDateSessionError(null)
                        setSlotSessionError(null)
                    })
            } catch (error) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Đã có lỗi xảy ra trong quá trình chỉnh sửa",
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        }
    }
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
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
                    })
            }
        });
    }
    const ableToChangeClass = () => {
        const today = new Date();
        const startDateObj = new Date(classData?.startDate);
        if (classData?.status?.toLowerCase().includes('canceled') ||
            (classData?.status?.toLowerCase().includes('upcoming') &&
                (startDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24) > 7)
        ) {
            return 1;
        }
        return 0;
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
        },
        {
            title: 'Tuổi',
            dataIndex: 'dateOfBirth',
            render: (_, record) => (new Date().getFullYear() - new Date(record.dateOfBirth).getFullYear()),
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
            dataIndex: 'parentPhoneNumber'
        },
        {
            title: 'Chuyển lớp',
            colSpan: ableToChangeClass(),
            render: (_, record) => {
                const today = new Date();
                const startDateObj = new Date(classData?.startDate);
                if (classData?.status?.toLowerCase().includes('canceled') ||
                    (classData?.status?.toLowerCase().includes('upcoming') &&
                        (startDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24) > 7)
                ) {
                    return (
                        <Button type='link' onClick={() => navigate(`change-class/${record.studentId}`, { state: { student: record } })} icon={< SwapOutlined />} size='large' />
                    )
                }
            }
        },
    ];
    const sessionsColumns = [
        {
            title: 'Buổi học',
            dataIndex: 'index',
            sorter: (a, b) => a.index - b.index,
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
            render: (_, record) => `${record.slot.startTime} - ${record.slot.endTime}`
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
                }
            }
        },
        {
            title: 'Chỉnh sửa',
            render: (_, record) => (
                record.status.toLowerCase().includes('future') &&
                <Button type='link' onClick={() => {
                    setSessionId(record.id)
                    setLecturerSession(record.lecturer.id)
                    setRoomSession(record.room.roomId)
                    setSlotSession(record.slot.slotId)
                    setDateSession(dayjs(record.date))
                    setSessionModalOpen(true)
                }} icon={<EditOutlined />} size='large' />
            ),
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
                                <h5 className={styles.classPartTitle}>Thông tin chung:</h5>
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
                                        <p className={styles.classTitle}>Tên khóa học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.courseName}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Giáo viên:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.lecturerName}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Trạng thái:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.status.toLowerCase().includes('completed') ? 'Đã hoàn thành'
                                            : classData.status.toLowerCase().includes('upcoming') ? 'Sắp tới'
                                                : classData.status.toLowerCase().includes('on-going') ? 'Đang diễn ra'
                                                    : classData.status.toLowerCase().includes('canceled') && 'Đã hủy'}
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6} xs={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Thời gian học:</h5>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Ngày bắt đầu:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData && `${formatDate(classData.startDate)}`}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Ngày kết thúc:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData && `${formatDate(classData.endDate)}`}</p>
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
                                <h5 className={styles.classPartTitle}>Địa điểm học:</h5>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Hình thức:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail} style={{ textTransform: 'capitalize' }}>{classData.method.toLowerCase()}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Phòng học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.roomResponse.name}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6} xs={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Quy định đăng ký:</h5>
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
                                        <p className={styles.classTitle}>Đã đăng kí:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{classData.numberStudentRegistered}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    {!classData.status.toLowerCase().includes('canceled') && !classData.status.toLowerCase().includes('completed') && (
                        <div style={{ display: 'flex', marginBottom: '20px' }}>
                            <Button className={styles.saveButton} onClick={() => setModifyModalOpen(true)}>
                                Chỉnh sửa
                            </Button>
                            <Button className={styles.cancelButton} onClick={handleCancelClass}>
                                Hủy lớp học
                            </Button>
                        </div>
                    )}
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
                                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                                        <Search className={styles.searchBar} placeholder="Tìm kiếm học viên..." onSearch={(value, e) => { console.log(value) }} enterButton />
                                    </div>
                                    <Table
                                        columns={studentsColumns}
                                        rowKey={(record) => record.studentId}
                                        dataSource={students}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                    />
                                </>
                            )
                        },
                        {
                            label: 'Lịch học',
                            key: 'sessions',
                            children: (
                                <>
                                    <Table
                                        columns={sessionsColumns}
                                        rowKey={(record) => record.id}
                                        dataSource={sessions}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                    />
                                </>
                            )
                        },
                    ]}
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
                    title="Chỉnh sửa lớp học"
                    centered
                    open={modifyModalOpen}
                    footer={null}
                    onCancel={() => setModifyModalOpen(false)}
                    width={600}
                    classNames={{ header: styles.modalHeader }}
                >
                    <form onSubmit={formik.handleSubmit}>
                        {classData?.status?.toLowerCase().includes('upcoming') && (
                            <Row>
                                <Col span={6}>
                                    <p className={styles.addTitle} style={{ lineHeight: '18px' }}><span>*</span> Số lượng học viên (tối thiểu - tối đa):</p>
                                </Col>
                                <Col span={18}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Input
                                            placeholder="Tối thiểu"
                                            name='leastNumberStudent'
                                            type='number'
                                            min={1}
                                            max={25}
                                            value={formik.values.leastNumberStudent}
                                            onChange={formik.handleChange}
                                            error={formik.touched.leastNumberStudent && formik.errors.leastNumberStudent}
                                            className={styles.input}
                                            required
                                        />
                                        <Input
                                            placeholder="Tối đa"
                                            name='limitNumberStudent'
                                            type='number'
                                            min={5}
                                            max={25}
                                            value={formik.values.limitNumberStudent}
                                            onChange={formik.handleChange}
                                            error={formik.touched.limitNumberStudent && formik.errors.limitNumberStudent}
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div style={{ height: '24px', paddingLeft: '10px' }}>
                                        {formik.errors.leastNumberStudent && formik.touched.leastNumberStudent && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.leastNumberStudent}</p>)}
                                        {formik.errors.limitNumberStudent && formik.touched.limitNumberStudent && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.limitNumberStudent}</p>)}
                                    </div>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col span={6}>
                                <p className={styles.addTitle}><span>*</span> Giáo viên:</p>
                            </Col>
                            <Col span={18}>
                                <Select
                                    showSearch
                                    value={lecturer}
                                    suffixIcon={null}
                                    filterOption={false}
                                    className={styles.input}
                                    placeholder="Giáo viên"
                                    onSelect={(data) => { setLecturer(data) }}
                                    defaultValue={lecturer}
                                    options={
                                        lecturersOptions
                                            .map((lecturer) => ({
                                                value: lecturer.lectureId,
                                                label: lecturer.fullName,
                                            }))}
                                    onSearch={(value) => {
                                        const filteredOptions = lecturers.filter(
                                            (lecture) =>
                                                `${lecture.fullName}`
                                                    .toLowerCase()
                                                    .includes(value.toLowerCase())
                                        );
                                        setLecturersOptions(filteredOptions);
                                    }}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {lecturerError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{lecturerError}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p className={styles.addTitle}><span>*</span> Phòng học:</p>
                            </Col>
                            <Col span={18}>
                                <Select
                                    showSearch
                                    value={room}
                                    suffixIcon={null}
                                    filterOption={false}
                                    className={styles.input}
                                    placeholder="Phòng học"
                                    onSelect={(data) => { setRoom(data) }}
                                    options={roomsOptions.map((room) => ({
                                        value: room.id,
                                        label: room.name
                                    }))}
                                    onSearch={(value) => {
                                        if (value) {
                                            const filteredOptions = rooms.filter(
                                                (room) => room.name.toLowerCase().includes(value?.toLowerCase())
                                            );
                                            setRoomsOptions(filteredOptions);
                                        }
                                    }}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {roomError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{roomError}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button className={styles.saveButton} htmlType='submit'>
                                Lưu
                            </Button>
                            <Button className={styles.cancelButton} onClick={() => { setModifyModalOpen(false) }}>
                                Hủy
                            </Button>
                        </div>
                    </form>
                </Modal>
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
                    title="Chỉnh sửa buổi học"
                    centered
                    open={sessionModalOpen}
                    footer={null}
                    onCancel={() => setSessionModalOpen(false)}
                    width={600}
                    classNames={{ header: styles.modalHeader }}
                >
                    <Row>
                        <Col span={6}>
                            <p className={styles.addTitle}><span>*</span> Ngày học:</p>
                        </Col>
                        <Col span={18}>
                            <DatePicker
                                className={styles.input}
                                value={dateSession}
                                disabledDate={(current) => {
                                    return current && current < dayjs().add(1, 'day').startOf('day');
                                }}
                                onChange={(date) => setDateSession(date)}
                                format={'DD/MM/YYYY'}
                                allowClear={false}
                                placeholder="Ngày học" />
                            <div style={{ height: '24px', paddingLeft: '10px' }}>
                                {dateSessionError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{dateSessionError}</p>)}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <p className={styles.addTitle}><span>*</span> Giờ học:</p>
                        </Col>
                        <Col span={18}>
                            <Select
                                className={styles.input}
                                value={slotSession}
                                placeholder="Giờ học"
                                onChange={(value) => setSlotSession(value)}
                                options={slots
                                    .sort((a, b) => {
                                        const timeA = formatSlot(a.startTime);
                                        const timeB = formatSlot(b.startTime);
                                        return compareAsc(timeA, timeB);
                                    }).map((slot) => ({
                                        value: slot.id,
                                        label: `${slot.startTime} - ${slot.endTime}`
                                    }))}
                            />
                            <div style={{ height: '24px', paddingLeft: '10px' }}>
                                {slotSessionError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{slotSessionError}</p>)}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <p className={styles.addTitle}><span>*</span> Giáo viên:</p>
                        </Col>
                        <Col span={18}>
                            <Select
                                showSearch
                                value={lecturerSession}
                                suffixIcon={null}
                                filterOption={false}
                                className={styles.input}
                                placeholder="Giáo viên"
                                onSelect={(data) => { setLecturerSession(data) }}
                                defaultValue={lecturer}
                                options={
                                    lecturersOptions
                                        .map((lecturer) => ({
                                            value: lecturer.lectureId,
                                            label: lecturer.fullName,
                                        }))}
                                onSearch={(value) => {
                                    const filteredOptions = lecturers.filter(
                                        (lecture) =>
                                            `${lecture.fullName}`
                                                .toLowerCase()
                                                .includes(value.toLowerCase())
                                    );
                                    setLecturersOptions(filteredOptions);
                                }}
                            />
                            <div style={{ height: '24px', paddingLeft: '10px' }}>
                                {lecturerSessionError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{lecturerSessionError}</p>)}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <p className={styles.addTitle}><span>*</span> Phòng học:</p>
                        </Col>
                        <Col span={18}>
                            <Select
                                showSearch
                                value={roomSession}
                                suffixIcon={null}
                                filterOption={false}
                                className={styles.input}
                                placeholder="Phòng học"
                                onSelect={(data) => { setRoomSession(data) }}
                                options={roomsOptions.map((room) => ({
                                    value: room.id,
                                    label: room.name
                                }))}
                                onSearch={(value) => {
                                    if (value) {
                                        const filteredOptions = rooms.filter(
                                            (room) => room.name.toLowerCase().includes(value?.toLowerCase())
                                        );
                                        setRoomsOptions(filteredOptions);
                                    }
                                }}
                            />
                            <div style={{ height: '24px', paddingLeft: '10px' }}>
                                {roomSessionError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{roomSessionError}</p>)}
                            </div>
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button className={styles.saveButton} onClick={handleUpdateSession}>
                            Lưu
                        </Button>
                        <Button className={styles.cancelButton} onClick={() => { setSessionModalOpen(false) }}>
                            Hủy
                        </Button>
                    </div>
                </Modal>
            </ConfigProvider>
        </div >
    )
}
