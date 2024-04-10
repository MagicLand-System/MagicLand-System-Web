import React, { useEffect, useState } from 'react'
import styles from './ImportClasses.module.css'
import { Button, DatePicker, Radio, Input, Modal, Table, Select, Row, Col, Tabs, ConfigProvider, Alert, Empty, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { addClass, getClasses, getLecturer, getLecturerBySchedule, getRooms, getRoomsBySchedule, getSlots, saveImport } from '../../../api/classesApi';
import { getCourses } from '../../../api/courseApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDate, formatDayOfWeek } from '../../../utils/utils';
import { ScheduleInput } from '../../../components/scheduleInput/ScheduleInput';

export default function ImportClasses() {
    const navigate = useNavigate()
    const location = useLocation()
    const { importClasses } = location.state
    const [apiLoading, setApiLoading] = useState(false);
    const [classes, setClasses] = useState(importClasses?.rowInsertResponse)
    const [loading, setLoading] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false)

    const [editClass, setEditClass] = useState(null)

    const [courses, setCourses] = useState([]);
    const [coursesOptions, setCoursesOptions] = useState(courses);

    const [allLecturers, setAllLecturers] = useState([])
    const [lecturers, setLecturers] = useState([])
    const [lecturersOptions, setLecturersOptions] = useState(lecturers);

    const [allRooms, setAllRooms] = useState([])
    const [rooms, setRooms] = useState([])
    const [roomsOptions, setRoomsOptions] = useState(rooms)

    const [course, setCourse] = useState(null)
    const [courseError, setCourseError] = useState(null)

    const [lecturer, setLecturer] = useState(null)
    const [lecturerError, setLecturerError] = useState(null)
    const [lecturerLoading, setLecturerLoading] = useState(false)

    const [startDate, setStartDate] = useState(null);
    const [startDateError, setStartDateError] = useState(null)

    const [method, setMethod] = useState('offline')
    const [room, setRoom] = useState(null)
    const [roomError, setRoomError] = useState(null)
    const [roomLoading, setRoomLoading] = useState(false)

    const [slots, setSlots] = useState([])
    const [slotsOptions, setSlotsOptions] = useState(slots)

    const [scheduleRequests, setSchedulesRequests] = useState([{ dateOfWeek: null, slotId: null }]);
    const [schedulesError, setSchedulesError] = useState(null)

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
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
    const formik = useFormik({
        initialValues: {
            leastNumberStudent: null,
            limitNumberStudent: null,
        },
        onSubmit: async values => {
            const hasNullValues = scheduleRequests.some((schedule) => {
                return schedule.dateOfWeek === null || schedule.slotId === null;
            });
            const hasDuplicateValues = checkDuplicateCombinations();
            const checkRoom = rooms.find(roomItem => roomItem.id === room);
            const checkLecturer = lecturers.find(lecturerItem => lecturerItem.lectureId === lecturer);
            if (!course || !lecturer || !startDate || !room || hasNullValues || hasDuplicateValues || !checkRoom || !checkLecturer) {
                if (course === null) {
                    setCourseError("Vui lòng chọn khóa học")
                } else {
                    setCourseError(null)
                }
                if (lecturer === null) {
                    setLecturerError("Vui lòng chọn giáo viên")
                } else if (!checkLecturer) {
                    setLecturerError("Vui lòng chọn giáo viên hợp lệ")
                } else {
                    setLecturerError(null)
                }
                if (startDate === null) {
                    setStartDateError("Vui lòng nhập ngày bắt đầu")
                } else {
                    setStartDateError(null)
                }
                if (room === null) {
                    setRoomError("Vui lòng chọn phòng học")
                } else if (!checkRoom) {
                    setRoomError("Vui lòng chọn phòng học hợp lệ")
                } else {
                    setRoomError(null)
                }
                if (hasNullValues) {
                    setSchedulesError("Vui lòng điền đủ thông tin lịch học");
                } else if (hasDuplicateValues) {
                    setSchedulesError("Lịch học bị trùng");
                } else {
                    setSchedulesError(null)
                }
            } else {
                setCourseError(null)
                setLecturerError(null)
                setStartDateError(null)
                setRoomError(null)
                setSchedulesError(null)
                const startDateWeekFormat = dayjs(startDate).format('dddd').toLowerCase()
                const isStartDateCorrect = scheduleRequests.some((schedule) => schedule.dateOfWeek.toLowerCase() === startDateWeekFormat);
                if (isStartDateCorrect) {
                    try {
                        setApiLoading(true)
                        const newClass = editClass;
                        newClass.createClass.courseId = course
                        const courseResponse = courses.find(iCourse => iCourse.courseId === course)
                        newClass.createClass.myCourseResponse = {
                            courseId: course,
                            courseName: courseResponse.courseDetail.courseName,
                            subjectCode: courseResponse.courseDetail.subjectCode
                        }

                        newClass.createClass.leastNumberStudent = values.leastNumberStudent
                        newClass.createClass.limitNumberStudent = values.limitNumberStudent
                        newClass.createClass.method = method
                        scheduleRequests.map(schedule => {
                            const findSlot = slots.find(slot => slot.id === schedule.slotId)
                            schedule.startTime = findSlot.startTime
                            schedule.endTime = findSlot.endTime
                            return schedule
                        })
                        newClass.createClass.scheduleRequests = scheduleRequests
                        newClass.createClass.startDate = startDate.toISOString()

                        newClass.createClass.roomId = room
                        const roomResponse = allRooms.find(iRoom => iRoom.id === room)
                        newClass.createClass.roomResponse = roomResponse

                        newClass.createClass.lecturerId = lecturer
                        const lecturerResponse = allLecturers.find(iLecturer => iLecturer.lectureId === lecturer)
                        newClass.createClass.lecturerResponse = lecturerResponse
                        newClass.isSuccess = true
                        console.log(newClass)

                        const updatedClasses = classes.map(cls => {
                            if (cls.index === newClass.index) {
                                return newClass;
                            }
                            return cls;
                        });
                        setClasses(updatedClasses)

                        setAddModalOpen(false)
                        setEditClass(null)
                        setCourse(null)
                        setCoursesOptions(courses)
                        setCourseError(null)

                        setLecturer(null)
                        setLecturerError(null)

                        setStartDate(null)

                        setRoom(null)
                        setRoomError(null)

                        setSchedulesRequests([{ dateOfWeek: null, slotId: null }])
                        setSchedulesError(null)
                        formik.resetForm()

                    } catch (error) {
                        console.log(error)
                    } finally {
                        setApiLoading(false)
                    }

                } else {
                    setStartDateError("Vui lòng chọn ngày bắt đầu trùng với lịch học")
                }
            }
        },
        validationSchema: Yup.object({
            leastNumberStudent: Yup.number().required("Vui lòng điền số học viên tối thiểu").min(1, "Số lượng học viên tối thiểu phải lớn hơn 1").max(30, "Số lượng học viên tối thiểu phải nhỏ hơn 30"),
            limitNumberStudent: Yup.number().required("Vui lòng điền số học viên tối đa").when(
                'leastNumberStudent',
                (minNum, schema) => schema.min(minNum, "Số lượng học viên tối đa phải lớn hơn hoặc bằng số tối thiểu")
            ).max(30, "Số lượng học viên tối đa phải nhỏ hơn 30"),
        }),
    });
    async function getListsOfCourses() {
        const data = await getCourses();
        setCourses(data);
        setCoursesOptions(data);
    };
    async function getListsOfSlots() {
        const data = await getSlots();
        setSlots(data);
        setSlotsOptions(data);
    };
    async function getAllLecturer() {
        const data = await getLecturer();
        setAllLecturers(data);
    };
    async function getAllRoom() {
        const data = await getRooms();
        setAllRooms(data);
    };
    async function getListsOfLecturer(startDate, schedules, courseId) {
        try {
            setLecturerLoading(true)
            const data = await getLecturerBySchedule({ startDate, schedules, courseId });
            data.sort((a, b) => a.numberOfClassesTeaching - b.numberOfClassesTeaching);
            setLecturers(data);
            setLecturersOptions(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLecturerLoading(false);
        }
    };
    async function getListsOfRooms(startDate, schedules, courseId) {
        try {
            setRoomLoading(true)
            const data = await getRoomsBySchedule({ startDate, schedules, courseId });
            setRooms(data);
            setRoomsOptions(data);
        } catch (error) {
            console.log(error);
        } finally {
            setRoomLoading(false);
        }
    };
    const handleSaveClasses = async () => {
        const errors = []
        let successRow = 0
        let failureRow = 0
        classes.map(iClass => {
            if (iClass.isSuccess === false) {
                errors.push(iClass.index)
                failureRow = failureRow++
            } else {
                successRow = successRow++
            }
        })
        if (errors.length > 0) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Thêm lớp học thất bại",
                text: `Vui lòng điền đủ thông tin lớp học có số thứ tự ${errors.map((error, index) => {
                    if (index !== errors.length - 1) {
                        return error + ", "
                    } else {
                        return error
                    }
                })}`,
                showConfirmButton: false,
            })
        } else {
            try {
                setApiLoading(true)
                const importData = {
                    successRow: importClasses.successRow,
                    failureRow: importClasses.failureRow,
                    rowInsertResponse: classes
                }
                await saveImport(importData)
                    .then(() =>
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Thêm lớp thành công",
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
                setApiLoading(false)
            }
        }
    }
    const handleDateChange = (index, value) => {
        const updatedSchedules = [...scheduleRequests];
        updatedSchedules[index].dateOfWeek = value;
        setSchedulesRequests(updatedSchedules);
    };

    const handleSlotChange = (index, value) => {
        const updatedSchedules = [...scheduleRequests];
        updatedSchedules[index].slotId = value;
        setSchedulesRequests(updatedSchedules);

        const uniqueSlotIds = Array.from(new Set(updatedSchedules.map((schedule) => schedule.slotId).filter(Boolean)));
        if (uniqueSlotIds.length < 2) {
            setSlotsOptions(slots);
        } else {
            const selectedSlots = uniqueSlotIds.slice(0, 2).map((slotId) =>
                slots.find((slot) => slot.id === slotId)
            );
            setSlotsOptions(selectedSlots);
        }
    };

    const handleDeleteSchedule = (index) => {
        const updatedSchedules = [...scheduleRequests];
        updatedSchedules.splice(index, 1);
        setSchedulesRequests(updatedSchedules);

        const uniqueSlotIds = Array.from(new Set(updatedSchedules.map((schedule) => schedule.slotId).filter(Boolean)));
        if (uniqueSlotIds.length < 2) {
            setSlotsOptions(slots);
        } else {
            const selectedSlots = uniqueSlotIds.slice(0, 2).map((slotId) =>
                slots.find((slot) => slot.id === slotId)
            );
            setSlotsOptions(selectedSlots);
        }
    };
    const checkDuplicateCombinations = () => {
        const seenCombinations = new Set();

        for (const request of scheduleRequests) {
            const combination = `${request.dateOfWeek}-${request.slotId}`;

            if (seenCombinations.has(combination)) {
                return true;
            } else {
                seenCombinations.add(combination);
            }
        }
        return false;
    };
    useEffect(() => {
        getListsOfCourses();
        getListsOfSlots();
        getAllLecturer();
        getAllRoom()
    }, []);
    useEffect(() => {
        const hasNullValues = scheduleRequests.some((schedule) => {
            return schedule.dateOfWeek === null || schedule.slotId === null;
        });
        const hasDuplicateValues = checkDuplicateCombinations();
        if (course && startDate && scheduleRequests) {
            if (hasNullValues) {
                setSchedulesError("Vui lòng điền đủ lịch học để chọn giáo viên và phòng học")
                setLecturers([]);
                setLecturersOptions([]);
            } else if (hasDuplicateValues) {
                setSchedulesError("Lịch học bị trùng")
                setLecturers([]);
                setLecturersOptions([]);
            } else {
                setSchedulesError(null)
                getListsOfLecturer(startDate, scheduleRequests, course);
                getListsOfRooms(startDate, scheduleRequests, course);
            }
        }
    }, [scheduleRequests, startDate, course]);
    const handleEdit = (dataClass) => {
        getListsOfCourses()
        formik.resetForm()
        setEditClass(dataClass)
        if (dataClass.createClass?.courseId !== "00000000-0000-0000-0000-000000000000") {
            setCourse(dataClass.createClass.courseId)
        } else {
            setCourse(null)
        }
        setCoursesOptions(courses)
        setCourseError(null)

        setLecturer(dataClass.createClass?.lecturerId)
        setLecturers([])
        setLecturersOptions([])
        setLecturerError(null)

        setStartDate(dayjs(dataClass.createClass?.startDate))

        setRoom(dataClass.createClass?.roomId)
        setRoomError(null)

        setMethod(dataClass.createClass?.method)

        formik.setValues({
            leastNumberStudent: dataClass.createClass?.leastNumberStudent,
            limitNumberStudent: dataClass.createClass?.limitNumberStudent,
        })

        setSchedulesRequests(dataClass.createClass?.scheduleRequests)
        setSchedulesError(null)
        setAddModalOpen(true)
    }
    const disabledDate = (current) => {
        if (current && current < dayjs().add(1, 'day').startOf('day')) {
            return true;
        }

        const validDates = scheduleRequests.map(schedule => schedule.dateOfWeek);
        if (current && !validDates.includes(dayjs(current).format('dddd').toLowerCase())) {
            return true;
        }

        return false;
    };
    const classesColumn = [
        {
            title: 'Số thứ tự',
            dataIndex: 'index',
            render: (_, record) => <p style={{ margin: 0 }}>{record.isSuccess === false && <span style={{ margin: 0, color: 'red' }}>* </span>} {record.index}</p>,
            sorter: (a, b) => a.index - b.index,
            width: 120,
        },
        {
            title: 'Khóa học',
            render: (_, record) => record.createClass?.myCourseResponse && `${record.createClass.myCourseResponse?.subjectCode} - ${record.createClass.myCourseResponse?.courseName}`,
        },
        {
            title: 'Số lượng học viên',
            render: (_, record) => record.createClass && `${record.createClass?.leastNumberStudent} - ${record.createClass?.limitNumberStudent}`,
        },
        {
            title: 'Hình thức',
            render: (_, record) => {
                if (record.createClass) {
                    if (record.createClass.method?.toLowerCase() === 'online') {
                        return <div style={{ backgroundColor: '#d4edda', color: '#155724' }} className={styles.status}>Online</div>
                    } else if (record.createClass.method?.toLowerCase() === 'offline') {
                        return <div style={{ backgroundColor: '#f8d7da', color: '#dc3545' }} className={styles.status}>Offline</div>
                    }
                }
            },
        },
        {
            title: 'Lịch học',
            render: (_, record) =>
                record.createClass?.scheduleRequests &&
                <>
                    {record.createClass?.scheduleRequests?.map((session, index) => (
                        <p style={{ margin: 0 }} key={index}>
                            {session.dateOfWeek && formatDayOfWeek(session.dateOfWeek)}:&ensp;{session.startTime} - {session.endTime}
                        </p>
                    ))}
                </>
        },
        {
            title: 'Ngày bắt đầu',
            render: (_, record) => record.createClass?.startDate && formatDate(record.createClass?.startDate)
        },
        {
            title: 'Giáo viên',
            render: (_, record) => record.createClass?.lecturerResponse && record.createClass?.lecturerResponse?.fullName,
        },
        {
            title: 'Phòng học',
            render: (_, record) => record.createClass?.roomResponse && record.createClass?.roomResponse?.name,
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <>
                    <Button disabled={apiLoading} type='link' onClick={() => handleEdit(record)} icon={<EditOutlined />} size='large' />
                    <Button disabled={apiLoading} type='link' onClick={() => {
                        const updatedClasses = classes.filter(iClass => iClass.index !== record.index)
                        setClasses(updatedClasses);
                    }} icon={<DeleteOutlined />} size='large' />
                </>
            ),
            width: 120,
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Tạo nhiều lớp</h2>
            <Table
                columns={classesColumn}
                rowKey={(record) => record.index}
                dataSource={classes}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Button loading={apiLoading} onClick={handleSaveClasses} className={styles.saveButton}>
                    Lưu
                </Button>
                <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                    Hủy
                </Button>
            </div>

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
                    open={addModalOpen}
                    footer={null}
                    onCancel={() => setAddModalOpen(false)}
                    width={600}
                    classNames={{ header: styles.modalHeader }}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col span={6}>
                                <p className={styles.addTitle} style={{ lineHeight: '18px' }}><span>*</span> Khóa học -<br /> mã giáo trình:</p>
                            </Col>
                            <Col span={18}>
                                <Select
                                    showSearch
                                    value={course}
                                    suffixIcon={null}
                                    filterOption={false}
                                    className={styles.input}
                                    placeholder="Chọn khóa học"
                                    onSelect={(data) => { setCourse(data) }}
                                    notFoundContent={
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <span>
                                                    Không tìm thấy khóa học
                                                </span>
                                            } />
                                    }
                                    options={
                                        coursesOptions
                                            .sort((a, b) => a.courseDetail.courseName.toLowerCase().localeCompare(b.courseDetail.courseName.toLowerCase()))
                                            .map((course) => ({
                                                value: course.courseId,
                                                label: (
                                                    <div>
                                                        <span>{course.courseDetail.courseName}</span>
                                                        <span style={{ float: 'right' }}>{course.courseDetail.subjectCode}</span>
                                                    </div>
                                                ),
                                            }))}
                                    onSearch={(value) => {
                                        if (value) {
                                            const filteredOptions = courses.filter(
                                                (course) => course.courseDetail.courseName.toLowerCase().includes(value?.toLowerCase())
                                                    || course.courseDetail.subjectCode.toLowerCase().includes(value?.toLowerCase())
                                            );
                                            setCoursesOptions(filteredOptions);
                                        } else {
                                            setCoursesOptions(courses);
                                        }
                                    }}
                                    disabled={apiLoading}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {courseError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{courseError}</p>)}
                                </div>
                            </Col>
                        </Row>
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
                                        max={30}
                                        value={formik.values.leastNumberStudent}
                                        onChange={formik.handleChange}
                                        error={formik.touched.leastNumberStudent && formik.errors.leastNumberStudent}
                                        className={styles.input}
                                        required
                                        disabled={apiLoading}
                                    />
                                    <Input
                                        placeholder="Tối đa"
                                        name='limitNumberStudent'
                                        type='number'
                                        min={1}
                                        max={30}
                                        value={formik.values.limitNumberStudent}
                                        onChange={formik.handleChange}
                                        error={formik.touched.limitNumberStudent && formik.errors.limitNumberStudent}
                                        className={styles.input}
                                        required
                                        disabled={apiLoading}
                                    />
                                </div>
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.leastNumberStudent && formik.touched.leastNumberStudent && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.leastNumberStudent}</p>)}
                                    {formik.errors.limitNumberStudent && formik.touched.limitNumberStudent && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.limitNumberStudent}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '8px' }}>
                            <Col span={6}>
                                <p className={styles.addTitle}><span>*</span> Hình thức:</p>
                            </Col>
                            <Col span={18} style={{ display: 'flex', alignItems: 'center' }}>
                                <Radio.Group disabled={apiLoading} onChange={(e) => { setMethod(e.target.value) }} value={method}>
                                    <Radio value='offline'>Offline</Radio>
                                    <Radio value='online'>Online</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <p style={{ color: '#999999', fontSize: '16px' }}>Lịch học hàng tuần:</p>
                            </Col>
                            <Col span={16} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                <Button disabled={apiLoading || scheduleRequests.length >= 3} style={{ marginRight: '24px' }} onClick={() => {
                                    const filterSchedule = scheduleRequests.filter((schedule) => {
                                        return schedule.slotId !== null
                                    })
                                    if (scheduleRequests.length > 0 && filterSchedule.length > 0) {
                                        setSchedulesRequests([...scheduleRequests, { dateOfWeek: null, slotId: filterSchedule[filterSchedule.length - 1].slotId }])
                                    } else {
                                        setSchedulesRequests([...scheduleRequests, { dateOfWeek: null, slotId: null }])
                                    }
                                }}>
                                    + Thêm lịch học
                                </Button>
                            </Col>
                        </Row>
                        {scheduleRequests.map((schedule, index) => (
                            <Row key={index}>
                                <Col span={6}>
                                    <p className={styles.addTitle}><span>*</span> Lịch học {index + 1}:</p>
                                </Col>
                                <Col span={18}>
                                    <ScheduleInput
                                        key={index}
                                        index={index}
                                        schedule={schedule}
                                        onDateChange={handleDateChange}
                                        onSlotChange={handleSlotChange}
                                        onDelete={handleDeleteSchedule}
                                        slots={slotsOptions}
                                        disabled={apiLoading}
                                    />
                                </Col>
                            </Row>
                        ))}
                        <Row>
                            <Col span={6}>
                            </Col>
                            <Col span={18}>
                                <div style={{ height: '24px', paddingLeft: '10px', marginBottom: '4px' }}>
                                    {schedulesError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{schedulesError}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p className={styles.addTitle}><span>*</span> Ngày bắt đầu:</p>
                            </Col>
                            <Col span={18}>
                                <DatePicker
                                    className={styles.input}
                                    value={startDate}
                                    disabledDate={disabledDate}
                                    onChange={(date) => setStartDate(date)}
                                    format={'DD/MM/YYYY'}
                                    placeholder="Ngày bắt đầu"
                                    disabled={apiLoading} />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {startDateError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{startDateError}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p className={styles.addTitle} style={{ lineHeight: '18px' }}><span>*</span> Giáo viên -<br /> số lớp đang dạy:</p>
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
                                    notFoundContent={
                                        lecturerLoading
                                            ? <div style={{ width: '100%', textAlign: 'center' }}>
                                                <Spin size='small' />
                                            </div>
                                            : <Empty
                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                description={
                                                    <span>
                                                        Không tìm thấy giáo viên
                                                    </span>
                                                } />
                                    }
                                    options={
                                        lecturersOptions
                                            .map((lecturer) => ({
                                                value: lecturer.lectureId,
                                                label: (
                                                    <div>
                                                        <span>{lecturer.fullName}</span>
                                                        <span style={{ float: 'right' }}>{lecturer.numberOfClassesTeaching}</span>
                                                    </div>
                                                )
                                            }))}
                                    onSearch={(value) => {
                                        if (value) {
                                            const filteredOptions = lecturers.filter(
                                                (lecture) => lecture.fullName.toLowerCase().includes(value.toLowerCase())
                                            );
                                            setLecturersOptions(filteredOptions);
                                        } else {
                                            setLecturersOptions(lecturers);
                                        }
                                    }}
                                    disabled={apiLoading}
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
                                    notFoundContent={
                                        roomLoading
                                            ? <div style={{ width: '100%', textAlign: 'center' }}>
                                                <Spin size='small' />
                                            </div>
                                            : <Empty
                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                description={
                                                    <span>
                                                        Không tìm thấy phòng học
                                                    </span>
                                                } />
                                    }
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
                                    disabled={apiLoading}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {roomError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{roomError}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button loading={apiLoading} className={styles.saveButton} htmlType='submit'>
                                Lưu
                            </Button>
                            <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => {
                                setAddModalOpen(false)
                                setEditClass(null)
                                setImportRow(null)
                                setCourse(null)
                                setCoursesOptions(courses)
                                setCourseError(null)

                                setLecturer(null)
                                setLecturersOptions(lecturers)
                                setLecturerError(null)

                                setMethod("offline")
                                setStartDate(null)

                                setRoom(null)
                                setRoomError(null)

                                setSchedulesRequests([{ dateOfWeek: null, slotId: null }])
                                setSchedulesError(null)
                                formik.resetForm()
                            }}>
                                Hủy
                            </Button>
                        </div>
                    </form>
                </Modal>
            </ConfigProvider>
        </div >
    )
}
