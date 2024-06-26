import React, { useState, useEffect, useRef } from 'react'
import styles from './ClassManagement.module.css'
import { Button, DatePicker, Radio, Input, Modal, Table, Select, Row, Col, Tabs, ConfigProvider, Alert, Empty, Spin } from 'antd';
import { CloudUploadOutlined, EyeOutlined, PlusOutlined, DeleteOutlined, CloudDownloadOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { addClass, getClassCode, getClasses, getLecturer, getLecturerBySchedule, getRooms, getRoomsBySchedule, getSlots, importClass } from '../../api/classesApi';
import { getCourses } from '../../api/courseApi';
import { formatDate, handleDownloadExcelFile } from '../../utils/utils';
import { TEMPLATE_ADD_CLASS_FILE } from '../../utils/constants';
import * as XLSX from 'xlsx';
import { ScheduleInput } from '../../components/scheduleInput/ScheduleInput';

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

export default function ClassManagement() {
  const navigate = useNavigate()
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
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [courses, setCourses] = useState([]);
  const [coursesOptions, setCoursesOptions] = useState(courses);

  const [lecturers, setLecturers] = useState([])
  const [lecturersOptions, setLecturersOptions] = useState(lecturers);

  const [rooms, setRooms] = useState([])
  const [roomsOptions, setRoomsOptions] = useState(rooms)

  const [course, setCourse] = useState(null)
  const [courseError, setCourseError] = useState(null)
  const [courseLoading, setCourseLoading] = useState(false)

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

  const fileInputRef = useRef(null);
  const [fileInput, setFileInput] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

  const [apiLoading, setApiLoading] = useState(false)

  const handleFileChange = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileInput(selectedFile)
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile)
      reader.onload = (e) => {
        setExcelFile(e.target.result)
      }
    } else {
      setFileInput(null)
      setExcelFile(null)
    }
  }

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
  const formik = useFormik({
    initialValues: {
      classCode: "",
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
          setApiLoading(true)
          try {
            await addClass({ ...values, startDate, courseId: course, lecturerId: lecturer, method, scheduleRequests, roomId: room })
              .then(() => {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Tạo lớp học thành công",
                  showConfirmButton: false,
                  timer: 2000
                })
              })
              .then(() => {
                getListOfClasses(search, status)
                setAddModalOpen(false)
                setCourse(null)
                setCourses(courses)
                setCourseError(null)

                setLecturers([])
                setLecturersOptions([])

                setLecturer(null)
                setLecturerError(null)

                setStartDate(null)

                setRooms([])
                setRoomsOptions([])

                setRoom(null)
                setRoomError(null)

                setSchedulesRequests([{ dateOfWeek: null, slotId: null }])
                setSchedulesError(null)
                formik.resetForm()
              })
          } catch (error) {
            console.log(error)
            Swal.fire({
              position: "center",
              icon: "error",
              title: error.response?.data?.Error,
            })
          } finally {
            setApiLoading(false)
          }
        } else {
          setStartDateError("Vui lòng chọn ngày bắt đầu trùng với lịch học")
        }
      }
    },
    validationSchema: Yup.object({
      classCode: Yup.string().required("Vui lòng điền mã lớp học"),
      leastNumberStudent: Yup.number().required("Vui lòng điền số học viên tối thiểu").min(1, "Số lượng học viên tối thiểu phải lớn hơn 1").max(30, "Số lượng học viên tối thiểu phải nhỏ hơn 30"),
      limitNumberStudent: Yup.number().required("Vui lòng điền số học viên tối đa").when(
        'leastNumberStudent',
        (minNum, schema) => schema.min(minNum, "Số lượng học viên tối đa phải lớn hơn hoặc bằng số tối thiểu")
      ).max(30, "Số lượng học viên tối đa phải nhỏ hơn 30"),
    }),
  });
  async function getListOfClasses(searchString, status) {
    try {
      setLoading(true);
      const data = await getClasses({ searchString, status });
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
  async function getListsOfCourses() {
    try {
      setCourseLoading(true)
      const data = await getCourses();
      setCourses(data);
      setCoursesOptions(data);
    } catch (error) {
      console.log(error)
    } finally {
      setCourseLoading(false)
    }

  };
  async function getListsOfSlots() {
    const data = await getSlots();
    setSlots(data);
    setSlotsOptions(data);
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
  async function getListsOfRooms(startDate, schedules, courseId, method) {
    try {
      setRoomLoading(true)
      const data = await getRoomsBySchedule({ startDate, schedules, courseId, method });
      setRooms(data);
      setRoomsOptions(data);
    } catch (error) {
      console.log(error);
    } finally {
      setRoomLoading(false);
    }
  };
  async function getClassCodeByCourseId(course) {
    const data = await getClassCode(course);
    formik.setFieldValue("classCode", data.classCode)
  }

  useEffect(() => {
    getListsOfSlots();
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
        getListsOfRooms(startDate, scheduleRequests, course, method);
      }
    }
  }, [scheduleRequests, startDate, course, method]);
  useEffect(() => {
    getListOfClasses(search, status)
  }, [search, status])
  useEffect(() => {
    if (course) {
      getClassCodeByCourseId(course)
    }
  }, [course])

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

  const handleImport = async (e) => {
    e.preventDefault();
    let errors = []
    if (excelFile !== null) {
      XLSX.SSF.is_date("dd/mm/yyyy");
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      let newData = []
      const indexValues = [];
      if (data.length > 0) {
        newData = data.map(row => ({
          index: row['STT'] || null,
          courseCode: row['Mã khóa học'] || null,
          leastNumberStudent: row['Số lượng học viên tối thiểu'] >= 0 ? row['Số lượng học viên tối thiểu'] : null,
          limitNumberStudent: row['Số lượng học viên tối đa'] >= 0 ? row['Số lượng học viên tối đa'] : null,
          startDate: row['Ngày bắt đầu'] || null,
          method: row['Hình thức'] || null,
          schedule1: row['Lịch học 1'] || null,
          slot1: row['Giờ học 1'] || null,
          schedule2: row['Lịch học 2'] || null,
          slot2: row['Giờ học 2'] || null,
          schedule3: row['Lịch học 3'] || null,
          slot3: row['Giờ học 3'] || null,
        }))
        newData = newData.map(data => {
          if (!data.index || !data.courseCode || !data.leastNumberStudent || !data.limitNumberStudent || !data.startDate || !data.method
            || (!data.schedule1 && data.slot1) || (data.schedule1 && !data.slot1)
            || (!data.schedule2 && data.slot2) || (data.schedule2 && !data.slot2)
            || (!data.schedule3 && data.slot3) || (data.schedule3 && !data.slot3)) {
            errors.push(`Vui lòng điền đủ các thông tin lớp học số ${data.index}`);
          } else {
            if (indexValues.includes(data.index)) {
              if (!errors.includes("Số thứ tự trùng lặp")) {
                errors.push("Số thứ tự trùng lặp");
              }
            } else {
              indexValues.push(data.index);
            }
            if (data.startDate) {
              const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
              if (!dateRegex.test(data.startDate)) {
                if (!errors.includes("Vui lòng để ngày bắt đầu dạng văn bản (dd/mm/yyyy)")) {
                  errors.push("Vui lòng để ngày bắt đầu dạng văn bản (dd/mm/yyyy)");
                }
              }
            }
            const newItem = {
              index: data.index,
              courseCode: data.courseCode,
              leastNumberStudent: data.leastNumberStudent,
              limitNumberStudent: data.limitNumberStudent,
              startDate: data.startDate,
              method: data.method,
              scheduleRequests: []
            }
            for (let i = 1; i <= 3; i++) {
              const scheduleKey = 'schedule' + i;
              const slotKey = 'slot' + i;
              if (data.hasOwnProperty(scheduleKey) && data.hasOwnProperty(slotKey)) {
                if (data[scheduleKey] !== null) {
                  newItem.scheduleRequests.push({
                    schedule: data[scheduleKey],
                    slot: data[slotKey]
                  });
                }
              }
            }
            if (newItem.scheduleRequests.length > 0) {
              return newItem
            } else {
              errors.push(`Vui lòng điền lịch học lớp số ${data.index}`);
            }
          }
        });
      } else {
        errors.push("Vui lòng điền thông tin lớp học");
      }
      if (errors.length === 0) {
        try {
          setApiLoading(true)
          const data = await importClass(newData)
          navigate('import-classes', { state: { importClasses: data } })
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: error.response.data.Error,
            showConfirmButton: false,
            timer: 2000
          })
        } finally {
          setApiLoading(false)
        }
      } else {
        Swal.fire({
          icon: "error",
          title: 'Có lỗi xãy ra',
          html: errors.map(err => `${err}<br/>`).join(''),
        })
      }
    }
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
      title: 'Số học viên đã đăng kí',
      dataIndex: 'numberStudentRegistered',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      render: (startDate) => startDate && formatDate(startDate)
    },
    {
      title: 'Chi tiết',
      render: (_, record) => (
        <Button type='link' onClick={() => navigate(`detail/${record.classId}`)} icon={<EyeOutlined />} size='large' />
      ),
      width: 120,
    },
  ];
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
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý lớp học</h2>
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <Button onClick={() => setImportModalOpen(true)} type='primary' className={styles.importButton} icon={<CloudUploadOutlined />}>Thêm nhiều lớp</Button>
        <Button onClick={() => {
          getListsOfCourses();
          setAddModalOpen(true)
        }} className={styles.addButton} icon={<PlusOutlined />}>Thêm lớp học</Button>
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
          tabBarExtraContent={<Search className={styles.searchBar} placeholder="Tìm kiếm mã lớp, tên khóa học" onSearch={(value, e) => { setSearch(value) }} enterButton />}
          items={statusList.map(status => (
            {
              label: status.label,
              key: status.key,
              children: (
                <>
                  <h5 style={{ fontSize: '1rem', color: '#888888', fontWeight: 'normal', margin: '0 10px 10px' }}>Tổng số lớp <span style={{ textTransform: "lowercase" }}>{status.label}</span>: {!loading && numberOfClasses}</h5>
                  <Table
                    sticky={{ offsetHeader: 72 }}
                    columns={columns}
                    rowKey={(record) => record.classId}
                    dataSource={classes}
                    pagination={tableParams.pagination}
                    loading={loading}
                    onChange={handleTableChange}
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
          title="Thêm lớp học"
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
                    courseLoading
                      ? <div style={{ width: '100%', textAlign: 'center' }}>
                        <Spin size='small' />
                      </div>
                      : <Empty
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
                <p style={{ color: 'black', margin: 0 }}> Mã lớp học:&ensp;<span style={{ fontWeight: "bold" }}>{formik.values.classCode ? formik.values.classCode : "Chưa có"}</span></p>
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
                    schedules={scheduleRequests}
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
          title="Thêm tệp lớp học"
          centered
          open={importModalOpen}
          footer={null}
          onCancel={() => setImportModalOpen(false)}
          classNames={{ header: styles.modalHeader }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button className={styles.addButton} icon={<CloudDownloadOutlined />} onClick={() => handleDownloadExcelFile(TEMPLATE_ADD_CLASS_FILE, 'Mau-tao-lop-hoc.xlsx')} >Tải mẫu lớp học</Button>
            <Button type='primary' className={styles.importButton} icon={<CloudUploadOutlined />} onClick={() => fileInputRef.current.click()}>Chọn tệp</Button>
            <input accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' type='file' style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
            <p>{fileInput ? fileInput.name : 'Chưa có tệp nào được chọn'}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button loading={apiLoading} onClick={handleImport} className={styles.saveButton}>
              Nạp tập tin
            </Button>
            <Button disabled={apiLoading} className={styles.cancelButton}
              onClick={() => {
                setFileInput(null)
                setExcelFile(null)
                setImportModalOpen(false)
              }}>
              Hủy
            </Button>
          </div>
        </Modal>
      </ConfigProvider>
    </div >
  )
}
