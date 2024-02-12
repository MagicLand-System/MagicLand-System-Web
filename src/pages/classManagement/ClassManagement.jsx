import React, { useState, useEffect, useRef } from 'react'
import styles from './ClassManagement.module.css'
import { Button, DatePicker, Radio, Input, Modal, Table, Select, TimePicker, Row, Col, Tabs, ConfigProvider } from 'antd';
import { CloudUploadOutlined, ZoomInOutlined, PlusOutlined, DeleteOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { addClass, getClassCode, getClasses, getLecturer, getRooms, getSlots } from '../../api/classesApi';
import { getCourses } from '../../api/courseApi';
import { formatDate, formatSlot, handleDownloadExcelFile } from '../../utils/utils';
import { compareAsc } from 'date-fns';
import { TEMPLATE_ADD_CLASS_FILE } from '../../constants/constants';
import * as XLSX from 'xlsx';

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

const ScheduleInput = ({ index, schedule, onDateChange, onSlotChange, onDelete, slots }) => {
  const { dateOfWeek, slotId } = schedule;
  const sortedSlots = slots.sort((a, b) => {
    const timeA = formatSlot(a.startTime);
    const timeB = formatSlot(b.startTime);
    return compareAsc(timeA, timeB);
  });
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
      <Select
        className={styles.input}
        placeholder={`Lịch học ${index + 1}`}
        value={dateOfWeek}
        onChange={(value) => onDateChange(index, value)}
        options={[
          {
            value: 'Monday',
            label: 'Thứ 2',
          },
          {
            value: 'Tuesday',
            label: 'Thứ 3',
          },
          {
            value: 'Wednesday',
            label: 'Thứ 4',
          },
          {
            value: 'Thursday',
            label: 'Thứ 5',
          },
          {
            value: 'Friday',
            label: 'Thứ 6',
          },
          {
            value: 'Saturday',
            label: 'Thứ 7',
          },
          {
            value: 'Sunday',
            label: 'Chủ nhật'
          }
        ]}
      />
      <Select
        className={styles.input}
        value={slotId}
        placeholder="Giờ học"
        onChange={(value) => onSlotChange(index, value)}
        options={sortedSlots.map((slot) => ({
          value: slot.id,
          label: `${slot.startTime} - ${slot.endTime}`
        }))}
      />
      {index !== 0 ? (
        <DeleteOutlined style={{ fontSize: '1rem' }} onClick={() => onDelete(index)} />
      ) : (<DeleteOutlined style={{ fontSize: '1rem', color: '#e6e6e6' }} />)}
    </div>
  );
};

export default function ClassManagement() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("upcoming");
  const [search, setSearch] = useState(null)
  const [classes, setClasses] = useState([]);
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

  const [lecturers, setlecturers] = useState([])
  const [lecturersOptions, setLecturersOptions] = useState(lecturers);

  const [rooms, setRooms] = useState([])
  const [roomsOptions, setRoomsOptions] = useState(rooms)

  const [course, setCourse] = useState(null)
  const [courseError, setCourseError] = useState(null)

  const [lecturer, setLecturer] = useState(null)
  const [lecturerError, setLecturerError] = useState(null)

  const [startDate, setStartDate] = useState(null);
  const [startDateError, setStartDateError] = useState(null)

  const [method, setMethod] = useState('OFFLINE')
  const [room, setRoom] = useState(null)
  const [roomError, setRoomError] = useState(null)

  const [slots, setSlots] = useState([])
  const [slotsOptions, setSlotsOptions] = useState(slots)

  const [scheduleRequests, setSchedulesRequests] = useState([{ dateOfWeek: null, slotId: null }]);
  const [schedulesError, setSchedulesError] = useState(null)

  const fileInputRef = useRef(null);
  const [fileInput, setFileInput] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

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
      if (!course || !lecturer || !startDate || !room || hasNullValues || hasDuplicateValues) {
        if (course === null) {
          setCourseError("Vui lòng chọn khóa học")
        } else {
          setCourseError(null)
        }
        if (lecturer === null) {
          setLecturerError("Vui lòng chọn giáo viên")
        } else {
          setLecturerError(null)
        }
        if (startDate === null) {
          setStartDateError("Vui lòng nhập ngày bắt đầu")
        } else {
          setStartDateError(null)
        }
        if (room === null) {
          setRoomError("Vui lòng nhập phòng học")
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
        const startDateWeekFormat = dayjs(startDate).format('dddd')
        const isStartDateCorrect = scheduleRequests.some((schedule) => schedule.dateOfWeek === startDateWeekFormat);
        if (isStartDateCorrect) {
          const stringStartDate = startDate.toISOString()
          try {
            await addClass({ ...values, startDate: stringStartDate, courseId: course, lecturerId: lecturer, method, scheduleRequests, roomId: room })
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
                getListOfClasses()
                setAddModalOpen(false)
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
              })
          } catch (error) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Đã có lỗi xảy ra trong quá trình tạo lớp",
              showConfirmButton: false,
              timer: 2000
            })
          }
        } else {
          setStartDateError("Vui lòng chọn ngày bắt đầu trùng với lịch học")
        }
      }
    },
    validationSchema: Yup.object({
      classCode: Yup.string().required("Vui lòng điền mã lớp học"),
      leastNumberStudent: Yup.number().required("Vui lòng điền số học viên tối thiểu").min(1, "Số lượng học viên tối thiểu phải lớn hơn 1").max(25, "Số lượng học viên tối thiểu phải nhỏ hơn 25"),
      limitNumberStudent: Yup.number().required("Vui lòng điền số học viên tối đa").when(
        'leastNumberStudent',
        (minNum, schema) => schema.min(minNum, "Số lượng học viên tối đa phải lớn hơn hoặc bằng số tối thiểu")
      ).max(25, "Số lượng học viên tối đa phải nhỏ hơn 25"),
    }),
  });
  async function getListOfClasses(searchString, status) {
    try {
      setLoading(true);
      const data = await getClasses({ searchString, status });
      if (data) {
        setClasses(data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.length,
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
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
  async function getClassCodeByCourseId(course) {
    const data = await getClassCode(course);
    formik.setValues({
      classCode: data.classCode
    })
  }

  useEffect(() => {
    getListsOfCourses();
    getListsOfSlots();
  }, []);
  useEffect(() => {
    getListsOfLecturer();
    getListsOfRooms();
  }, [scheduleRequests]);
  useEffect(() => {
    getListOfClasses(search, status)
  }, [search, status])
  useEffect(() => {
    getClassCodeByCourseId(course)
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

  const handleImport = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      console.log(data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Thêm lớp học thành công",
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        setImportModalOpen(false);
        setExcelFile(null);
        setFileInput(null);
      })
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
      render: (startDate) => {
        return `${formatDate(startDate)}`
      }
    },
    {
      title: 'Chi tiết',
      render: (_, record) => (
        <Button type='link' onClick={() => navigate(`detail/${record.classId}`)} icon={<ZoomInOutlined />} size='large' />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý lớp học</h2>
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <Button onClick={() => setImportModalOpen(true)} type='primary' className={styles.importButton} icon={<CloudUploadOutlined />}>Thêm nhiều lớp</Button>
        <Button onClick={() => setAddModalOpen(true)} className={styles.addButton} icon={<PlusOutlined />}>Thêm lớp học</Button>
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
                <Table
                  columns={columns}
                  rowKey={(record) => record.classId}
                  dataSource={classes}
                  pagination={tableParams.pagination}
                  loading={loading}
                  onChange={handleTableChange}
                />
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
                <p className={styles.addTitle}><span>*</span> Khóa học:</p>
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
                  options={
                    coursesOptions
                      .sort((a, b) => a.courseDetail.courseName.toLowerCase().localeCompare(b.courseDetail.courseName.toLowerCase()))
                      .map((course) => ({
                        value: course.courseId,
                        label: course.courseDetail.courseName,
                      }))}
                  onSearch={(value) => {
                    if (value) {
                      const filteredOptions = courses.filter(
                        (course) => course.courseDetail.courseName.toLowerCase().includes(value?.toLowerCase())
                      );
                      setCoursesOptions(filteredOptions);
                    } else {
                      setCoursesOptions(courses);
                    }
                  }}
                />
                <div style={{ height: '24px', paddingLeft: '10px' }}>
                  {courseError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{courseError}</p>)}
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <p className={styles.addTitle}><span>*</span> Mã lớp học:</p>
              </Col>
              <Col span={18}>
                <Input
                  readOnly
                  className={styles.input}
                  placeholder="Mã lớp học"
                  name='classCode'
                  value={formik.values.classCode}
                  onChange={formik.handleChange}
                  error={formik.touched.classCode && formik.errors.classCode}
                  required
                />
                <div style={{ height: '24px', paddingLeft: '10px' }}>
                  {formik.errors.classCode && formik.touched.classCode && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.classCode}</p>)}
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
                    min={1}
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
                  options={
                    lecturersOptions
                      .map((lecturer) => ({
                        value: lecturer.lectureId,
                        label: lecturer.fullName,
                      }))}
                  onSearch={(value) => {
                    if (value) {
                      const filteredOptions = lecturers.filter(
                        (lecture) => lecture.fullName.toLowerCase().includes(value.toLowerCase())
                      );
                      setLecturersOptions(filteredOptions);
                    } else {
                      setCoursesOptions(courses);
                    }
                  }}
                />
                <div style={{ height: '24px', paddingLeft: '10px' }}>
                  {lecturerError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{lecturerError}</p>)}
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
                  disabledDate={(current) => {
                    return current && current < dayjs().add(1, 'day').startOf('day');
                  }}
                  onChange={(date) => setStartDate(date)}
                  format={'DD/MM/YYYY'}
                  placeholder="Ngày bắt đầu" />
                <div style={{ height: '24px', paddingLeft: '10px' }}>
                  {startDateError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{startDateError}</p>)}
                </div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '8px' }}>
              <Col span={6}>
                <p className={styles.addTitle}><span>*</span> Hình thức:</p>
              </Col>
              <Col span={18} style={{ display: 'flex', alignItems: 'center' }}>
                <Radio.Group onChange={(e) => { setMethod(e.target.value) }} value={method}>
                  <Radio value='OFFLINE'>Offline</Radio>
                  <Radio value='ONLINE'>Online</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <p style={{ color: '#999999', fontSize: '16px' }}>Lịch học hàng tuần:</p>
              </Col>
              <Col span={16} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                <Button style={{ marginRight: '24px' }} onClick={() => { setSchedulesRequests([...scheduleRequests, { dateOfWeek: null, slotId: null }]) }}>
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
              <Button className={styles.cancelButton} onClick={() => { setAddModalOpen(false) }}>
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
            <Button className={styles.addButton} icon={<CloudDownloadOutlined />} onClick={() => handleDownloadExcelFile(TEMPLATE_ADD_CLASS_FILE, 'Mau-tao-lop-hoc.xlsx')} >Tải tệp mẫu</Button>
            <Button type='primary' className={styles.importButton} icon={<CloudUploadOutlined />} onClick={() => fileInputRef.current.click()}>Chọn tệp</Button>
            <input accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' type='file' style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
            <p>{fileInput ? fileInput.name : 'Chưa có tệp nào được chọn'}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleImport} className={styles.saveButton}>
              Nạp tập tin
            </Button>
            <Button className={styles.cancelButton}
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
