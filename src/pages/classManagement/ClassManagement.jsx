import React, { useState, useEffect } from 'react'
import styles from './ClassManagement.module.css'
import { Button, DatePicker, Radio, Input, Modal, Table, Select, TimePicker, Row, Col } from 'antd';
import { CloudUploadOutlined, PlusOutlined, DeleteOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { AutoComplete } from 'antd';

const { Search } = Input;

const dataClasses = [
  {
    className: 'CLA001',
    courseCode: 'EMA01',
    courseName: 'Toán tiếng anh 1',
    status: 'completed',
    method: 'online',
    lecturerName: 'Ngô Gia Thưởng',
    room: null,
    minNumOfChildrens: 15,
    maxNumOfChildrens: 30,
    numOfChildrens: 20,
    startDate: '16/10/2023',
    endDate: '15/11/2023',
    schedule: [
      { day: 'monday', startTime: '10:15', endTime: '12:15' },
      { day: 'wednesday', startTime: '10:15', endTime: '12:15' }
    ]
  },
  {
    className: 'CLA002',
    courseCode: 'APA01',
    courseName: 'Vẽ tranh nghệ thuật',
    status: 'on-going',
    method: 'offline',
    room: '001',
    lecturerName: 'Nguyễn Thị Hương',
    minNumOfChildrens: 10,
    maxNumOfChildrens: 25,
    numOfChildrens: 15,
    startDate: '21/11/2023',
    endDate: '21/12/2023',
    schedule: [
      { day: 'tuesday', startTime: '14:30', endTime: '16:30' },
      { day: 'thursday', startTime: '14:30', endTime: '16:30' }
    ]
  },
  {
    className: 'CLA003',
    courseCode: 'CKK01',
    courseName: 'Nấu ăn cho em',
    status: 'upcoming',
    method: 'offline',
    lecturerName: 'Trần Văn Tuấn',
    room: '002',
    minNumOfChildrens: 10,
    maxNumOfChildrens: 20,
    numOfChildrens: 10,
    startDate: '25/12/2023',
    endDate: '25/12/2023',
    schedule: [
      { day: 'monday', startTime: '09:00', endTime: '11:00' }
    ]
  },
  {
    className: 'CLA004',
    courseCode: 'EMA02',
    courseName: 'Toán tiếng anh 2',
    status: 'completed',
    method: 'online',
    lecturerName: 'Phạm Thị Hạnh',
    room: null,
    minNumOfChildrens: 15,
    maxNumOfChildrens: 30,
    numOfChildrens: 25,
    startDate: '17/10/2023',
    endDate: '16/11/2023',
    schedule: [
      { day: 'tuesday', startTime: '11:00', endTime: '13:00' },
      { day: 'thursday', startTime: '11:00', endTime: '13:00' }
    ]
  },
  {
    className: 'CLA005',
    courseCode: 'PRT01',
    courseName: 'Tư duy lập trình',
    status: 'upcoming',
    method: 'offline',
    lecturerName: 'Lê Văn Hùng',
    room: '003',
    minNumOfChildrens: 15,
    maxNumOfChildrens: 25,
    numOfChildrens: 20,
    startDate: '20/12/2023',
    endDate: '21/01/2024',
    schedule: [
      { day: 'monday', startTime: '13:30', endTime: '15:30' },
      { day: 'wednesday', startTime: '13:30', endTime: '15:30' }
    ]
  },
  {
    className: 'CLA006',
    courseCode: 'VOV01',
    courseName: 'Vovinam',
    status: 'on-going',
    method: 'offline',
    lecturerName: 'Nguyễn Thị Hiền',
    room: '004',
    minNumOfChildrens: 15,
    maxNumOfChildrens: 20,
    numOfChildrens: 15,
    startDate: '28/11/2023',
    endDate: '28/12/2023',
    schedule: [
      { day: 'tuesday', startTime: '10:00', endTime: '12:00' },
      { day: 'thursday', startTime: '10:00', endTime: '12:00' }
    ]
  },
  {
    className: 'CLA007',
    courseCode: 'CIC01',
    courseName: 'Tự tin giao tiếp',
    status: 'completed',
    method: 'online',
    lecturerName: 'Trần Văn Hoàng',
    room: null,
    minNumOfChildrens: 15,
    maxNumOfChildrens: 30,
    numOfChildrens: 28,
    startDate: '14/11/2023',
    endDate: '14/11/2023',
    schedule: [
      { day: 'monday', startTime: '14:00', endTime: '16:00' }
    ]
  },
  {
    className: 'CLA008',
    courseCode: 'BMD01',
    courseName: 'Làm bánh và pha chế',
    status: 'upcoming',
    method: 'offline',
    lecturerName: 'Phan Thị Ngọc Anh',
    room: '005',
    minNumOfChildrens: 15,
    maxNumOfChildrens: 25,
    numOfChildrens: 22,
    startDate: '05/12/2023',
    endDate: '06/01/2024',
    schedule: [
      { day: 'tuesday', startTime: '15:30', endTime: '17:30' },
    ]
  },
  {
    className: 'CLA009',
    courseCode: 'ENG01',
    courseName: 'Tiếng anh cơ bản 1',
    status: 'on-going',
    method: 'online',
    lecturerName: 'Vũ Thị Mai',
    room: null,
    minNumOfChildrens: 10,
    maxNumOfChildrens: 20,
    numOfChildrens: 18,
    startDate: '22/11/2023',
    endDate: '22/12/2023',
    schedule: [
      { day: 'monday', startTime: '16:45', endTime: '18:45' },
      { day: 'wednesday', startTime: '16:45', endTime: '18:45' }
    ]
  },
  {
    className: 'CLA010',
    courseCode: 'ENG02',
    courseName: 'Tiếng anh cơ bản 2',
    status: 'completed',
    method: 'online',
    lecturerName: 'Vũ Thị Mai',
    room: null,
    minNumOfChildrens: 10,
    maxNumOfChildrens: 20,
    numOfChildrens: 12,
    startDate: '27/09/2023',
    endDate: '26/10/2023',
    schedule: [
      { day: 'monday', startTime: '16:45', endTime: '18:45' },
      { day: 'wednesday', startTime: '16:45', endTime: '18:45' }
    ]
  },
  {
    className: 'CLA011',
    courseCode: 'BMD01',
    courseName: 'Làm bánh và pha chế',
    status: 'waiting',
    method: 'offline',
    lecturerName: null,
    room: null,
    minNumOfChildrens: 10,
    maxNumOfChildrens: 25,
    numOfChildrens: 22,
    startDate: '04/01/2024',
    endDate: '04/01/2024',
    schedule: [
      { day: 'thursday', startTime: '15:30', endTime: '17:30' },
    ]
  },
  {
    className: 'CLA012',
    courseCode: 'ENG01',
    courseName: 'Tiếng anh cơ bản 1',
    status: 'waiting',
    method: 'online',
    lecturerName: null,
    room: null,
    minNumOfChildrens: 15,
    maxNumOfChildrens: 20,
    numOfChildrens: 18,
    startDate: '15/01/2024',
    endDate: '14/02/2024',
    schedule: [
      { day: 'monday', startTime: '16:45', endTime: '18:45' },
      { day: 'wednesday', startTime: '16:45', endTime: '18:45' }
    ]
  },
  {
    className: 'CLA013',
    courseCode: 'ENG02',
    courseName: 'Tiếng anh cơ bản 2',
    status: 'waiting',
    method: 'online',
    lecturerName: null,
    room: null,
    minNumOfChildrens: 15,
    maxNumOfChildrens: 20,
    numOfChildrens: 12,
    startDate: '17/01/2024',
    endDate: '19/02/2024',
    schedule: [
      { day: 'monday', startTime: '16:45', endTime: '18:45' },
      { day: 'wednesday', startTime: '16:45', endTime: '18:45' }
    ]
  },
];

const dataCourses = [
  {
    courseCode: 'EMA01',
    courseName: 'Toán tiếng anh 1',
  },
  {
    courseCode: 'APA01',
    courseName: 'Vẽ tranh nghệ thuật',
  },
  {
    courseCode: 'CKK01',
    courseName: 'Nấu ăn cho em',
  },
  {
    courseCode: 'EMA02',
    courseName: 'Toán tiếng anh 2',
  },
  {
    courseCode: 'PRT01',
    courseName: 'Tư duy lập trình',
  },
  {
    courseCode: 'VOV01',
    courseName: 'Vovinam',
  },
  {
    courseCode: 'CIC01',
    courseName: 'Tự tin giao tiếp',
  },
  {
    courseCode: 'BMD01',
    courseName: 'Làm bánh và pha chế',
  },
  {
    courseCode: 'ENG01',
    courseName: 'Tiếng anh cơ bản 1',
  },
  {
    courseCode: 'ENG02',
    courseName: 'Tiếng anh cơ bản 2',
  },
]

const dataLectures = [
  {
    id: 1,
    fullName: 'Ngô Gia Thưởng',
  },
  {
    id: 2,
    fullName: 'Nguyễn Thị Hương',
  },
  {
    id: 3,
    fullName: 'Trần Văn Tuấn',
  },
  {
    id: 4,
    fullName: 'Phạm Thị Hạnh',
  },
  {
    id: 5,
    fullName: 'Lê Văn Hùng',
  },
  {
    id: 6,
    fullName: 'Nguyễn Thị Hiền',
  },
  {
    id: 7,
    fullName: 'Trần Văn Hoàng',
  },
  {
    id: 8,
    fullName: 'Phan Thị Ngọc Anh',
  },
  {
    id: 9,
    fullName: 'Vũ Thị Mai',
  },

]

const ScheduleInput = ({ index, schedule, onDayChange, onTimeChange, onDelete }) => {
  const { day, startTime, endTime } = schedule;
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
      <Select
        className={styles.input}
        placeholder={`Lịch học ${index + 1}`}
        value={day}
        onChange={(value) => onDayChange(index, value)}
        options={[
          {
            value: 'monday',
            label: 'Thứ 2',
          },
          {
            value: 'tuesday',
            label: 'Thứ 3',
          },
          {
            value: 'wednesday',
            label: 'Thứ 4',
          },
          {
            value: 'thursday',
            label: 'Thứ 5',
          },
          {
            value: 'friday',
            label: 'Thứ 6',
          },
          {
            value: 'saturday',
            label: 'Thứ 7',
          },
          {
            value: 'sunday',
            label: 'Chủ nhật'
          }
        ]}
      />
      <TimePicker.RangePicker
        className={styles.input}
        onChange={(value) => onTimeChange(index, value)}
        value={[startTime, endTime]}
        format="HH:mm"
        placeholder={['Bắt đầu', 'Kết thúc']}
        disabledTime={() => ({
          disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(h => h < 8 || h >= 22),
        })}
      />
      {index !== 0 ? (
        <DeleteOutlined style={{ fontSize: '1rem' }} onClick={() => onDelete(index)} />
      ) : (<DeleteOutlined style={{ fontSize: '1rem', color: '#e6e6e6' }} />)}
    </div>
  );
};

const columns = [
  {
    title: 'Lớp học',
    dataIndex: 'className',
    // sorter: true,
    sorter: (a, b) => a.className.toLowerCase().localeCompare(b.className.toLowerCase()),
  },
  {
    title: 'Mã - Tên khóa học',
    dataIndex: 'courseCode',
    // sorter: true,
    sorter: (a, b) => a.courseCode.toLowerCase().localeCompare(b.courseCode.toLowerCase()),
    render: (text, record) => `${record.courseCode} - ${record.courseName}`,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (status) => {
      if (status === 'completed') {
        return <div style={{ backgroundColor: '#e7e9ea', color: '#495057', whiteSpace: 'nowrap' }} className={styles.status}>Đã hoàn thành</div>
      } else if (status === 'upcoming') {
        return <div style={{ backgroundColor: '#cce5ff', color: '#004085', whiteSpace: 'nowrap' }} className={styles.status}>Sắp tới</div>
      } else if (status === 'on-going') {
        return <div style={{ backgroundColor: '#d4edda', color: '#155724', whiteSpace: 'nowrap' }} className={styles.status}>Đang diễn ra</div>
      } else if (status === 'waiting') {
        return <div style={{ backgroundColor: '#f8d7da', color: '#721c24', whiteSpace: 'nowrap' }} className={styles.status}>Đang chờ</div>
      }
    },
    filters: [
      {
        text: 'Đã hoàn thành',
        value: 'completed',
      },
      {
        text: 'Sắp tới',
        value: 'upcoming',
      },
      {
        text: 'Đang diễn ra',
        value: 'on-going',
      },
      {
        text: 'Đang chờ',
        value: 'waiting',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.status === value,
  },
  {
    title: 'Hình thức',
    dataIndex: 'method',
    render: (method) => {
      if (method === 'online') {
        return <div style={{ backgroundColor: '#e6d9f0', color: '#6f42c1' }} className={styles.status}>Online</div>
      } else if (method === 'offline') {
        return <div style={{ backgroundColor: '#ffe5cc', color: '#d9534f' }} className={styles.status}>Offline</div>
      }
    },
    filters: [
      {
        text: 'Online',
        value: 'online',
      },
      {
        text: 'Offline',
        value: 'offline',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.method === value,
  },
  {
    title: 'Giáo viên',
    dataIndex: 'lecturerName',
    render: (lecturerName) => {
      if (!lecturerName) {
        return "Không có"
      } else {
        return `${lecturerName}`
      }
    },
  },
  {
    title: 'Phòng học',
    dataIndex: 'room',
    render: (text, record) => {
      if (!record.room) {
        return "Không có"
      } else {
        return `${record.room}`
      }
    },
  },
  {
    title: 'Số học viên tối thiểu',
    dataIndex: 'minNumOfChildrens',
  },
  {
    title: 'Số học viên tối đa',
    dataIndex: 'maxNumOfChildrens',
  },
  {
    title: 'Số học viên đã đăng kí',
    dataIndex: 'numOfChildrens',
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'startDate',
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'endDate',
  },
  {
    title: 'Lịch học hàng tuần',
    dataIndex: 'schedule',
    render: (text, record) => (
      <div>
        {record.schedule.map((session, index) => (
          <div key={index}>
            {session.day === 'monday' ? 'Thứ 2' :
              session.day === 'tuesday' ? 'Thứ 3' :
                session.day === 'wednesday' ? 'Thứ 4' :
                  session.day === 'thursday' ? 'Thứ 5' :
                    session.day === 'friday' ? 'Thứ 6' :
                      session.day === 'saturday' ? 'Thứ 7' : 'Chủ nhật'}: {session.startTime} - {session.endTime}
          </div>
        ))}
      </div>
    ),
  },
];

const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});
export default function ClassManagement() {
  const navigate = useNavigate()
  // const [classes, setClasses] = useState([]);
  const [classes, setClasses] = useState(dataClasses);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false)
  // const [courses, setCourses] = useState([]);
  const [courses, setCourses] = useState(dataCourses);
  const [coursesOptions, setCoursesOptions] = useState(courses);
  // const [lecturers, setlecturers] = useState([])
  const [lecturers, setlecturers] = useState(dataLectures)
  const [lecturersOptions, setLecturersOptions] = useState(lecturers);

  const [course, setCourse] = useState(null)
  const [courseError, setCourseError] = useState(null)

  const [lecturer, setLecturer] = useState(null)
  const [lecturerError, setLecturerError] = useState(null)

  const [startedDay, setStartedDay] = useState(null);
  const [startedDayError, setStartedDayError] = useState(null)

  const [method, setMethod] = useState('offline')
  const [room, setRoom] = useState(null)
  const [roomError, setRoomError] = useState(null)

  const [schedules, setSchedules] = useState([{ day: null, startTime: null, endTime: null }]);
  const [schedulesError, setSchedulesError] = useState(null)

  const formik = useFormik({
    initialValues: {
      minNumOfChildrens: null,
      maxNumOfChildrens: null,
    },
    onSubmit: async values => {
      const hasNullValues = schedules.some((schedule) => {
        return schedule.day === null || schedule.startTime === null || schedule.endTime === null;
      });
      if (!course || !lecturer || !startedDay || (method === 'offline' && room === null) || hasNullValues) {
        if (course === null) {
          setCourseError("Vui lòng chọn khóa học")
        } else {
          setCourseError(null)
        }
        // if (lecturer === null) {
        //   setLecturerError("Vui lòng chọn giáo viên")
        // } else {
        //   setLecturerError(null)
        // }
        if (startedDay === null) {
          setStartedDayError("Vui lòng nhập ngày bắt đầu")
        } else {
          setStartedDayError(null)
        }
        // if (method === 'offline' && room === null) {
        //   setRoomError("Vui lòng nhập phòng học")
        // } else {
        //   setRoomError(null)
        // }
        if (hasNullValues) {
          setSchedulesError("Vui lòng điền đủ thông tin lịch học");
        } else {
          setSchedulesError(null)
        }
      }
      else {
        const stringStartedDay = startedDay.toISOString()
        if (method === 'online') {
          formik.setValues({ room: null })
        }
        const courseId = course.split(" - ")[0];
        const lecturerId = lecturer.split(" - ")[0];
        console.log({ ...values, startedDay: stringStartedDay, course: courseId, lecturer: lecturerId, method, schedules })
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tạo lớp học thành công",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          setAddModalOpen(false)
          setCourse(null)
          setCoursesOptions(courses)
          setLecturer(null)
          setStartedDay(null)
          setRoom(null)
          setSchedules([{ day: null, startTime: null, endTime: null }])
          formik.resetForm()
        })
      }
    },
    validationSchema: Yup.object({
      minNumOfChildrens: Yup.number().min(5, "Số lượng học viên tối thiểu phải lớn hơn 5"),
      maxNumOfChildrens: Yup.number().when(
        'minNumOfChildrens',
        (minNum, schema) => schema.min(minNum, "Số lượng học viên tối đa phải lớn hơn hoặc bằng số tối thiểu")
      ),
    }),
  });
  const fetchData = () => {
    //https://codesandbox.io/p/sandbox/ajax-antd-5-11-4-tkp6cv?file=%2Fdemo.tsx%3A104%2C5
    // setLoading(true);
    // const data = getData();
    // if (data) {
    //   setData(results);
    //   setLoading(false);
    //   setTableParams({
    //     ...tableParams,
    //     pagination: {
    //       ...tableParams.pagination,
    //       total: 200,
    //       // 200 is mock data, you should read it from server
    //       // total: data.totalCount,
    //     },
    //   });
    // }
  };
  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
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

  const handleDayChange = (index, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index].day = value;
    setSchedules(updatedSchedules);
  };

  const handleTimeChange = (index, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index].startTime = value[0];
    updatedSchedules[index].endTime = value[1];
    setSchedules(updatedSchedules);
  };

  const handleDeleteSchedule = (index) => {
    const updatedSchedules = [...schedules];
    updatedSchedules.splice(index, 1);
    setSchedules(updatedSchedules);
  };

  const handleImport = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Thêm lớp học thành công",
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      setImportModalOpen(false);
    })
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý lớp học</h2>
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <Button onClick={() => setImportModalOpen(true)} type='primary' className={styles.importButton} icon={<CloudUploadOutlined />}>Thêm nhiều lớp</Button>
        <Button onClick={() => setAddModalOpen(true)} className={styles.addButton} icon={<PlusOutlined />}>Thêm lớp học</Button>
        <Search className={styles.searchBar} placeholder="Tìm kiếm mã lớp, mã khóa học, tên khóa học..." onSearch={(value, e) => { console.log(value) }} enterButton />
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record.className}
        dataSource={classes}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => navigate(`detail/${record.className}`, record),
        })}
      />
      <Modal
        title="Thêm lớp học"
        centered
        open={addModalOpen}
        footer={null}
        width={1000}
        onCancel={() => setAddModalOpen(false)}
      >
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={4}>
              <p className={styles.addTitle}><span>*</span> Khóa học:</p>
            </Col>
            <Col md={20}>
              <AutoComplete
                className={styles.input}
                placeholder="Chọn khóa học"
                defaultValue={course}
                onSelect={(data) => { setCourse(data) }}
                options={
                  coursesOptions
                    .sort((a, b) => a.courseCode.toLowerCase().localeCompare(b.courseCode.toLowerCase()))
                    .map((course) => ({
                      value: `${course.courseCode} - ${course.courseName}`,
                      label: `${course.courseCode} - ${course.courseName}`,
                    }))}
                onSearch={(value) => {
                  if (value) {
                    const filteredOptions = courses.filter(
                      (course) =>
                        `${course.courseCode} - ${course.courseName}`
                          .toLowerCase()
                          .includes(value?.toLowerCase())
                    );
                    setCoursesOptions(filteredOptions);
                  }
                }}
              />
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {courseError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{courseError}</p>)}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <p className={styles.addTitle} style={{ lineHeight: '18px' }}><span>*</span> Số lượng học viên (tối thiểu - tối đa):</p>
            </Col>
            <Col md={20}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input
                  placeholder="Số lượng học viên tối thiểu"
                  name='minNumOfChildrens'
                  type='number'
                  min={5}
                  value={formik.values.minNumOfChildrens}
                  onChange={formik.handleChange}
                  error={formik.touched.minNumOfChildrens && formik.errors.minNumOfChildrens}
                  className={styles.input}
                  required
                />
                <Input
                  placeholder="Số lượng học viên tối đa"
                  name='maxNumOfChildrens'
                  type='number'
                  min={5}
                  value={formik.values.maxNumOfChildrens}
                  onChange={formik.handleChange}
                  error={formik.touched.maxNumOfChildrens && formik.errors.maxNumOfChildrens}
                  className={styles.input}
                  required
                />
              </div>
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {formik.errors.minNumOfChildrens && formik.touched.minNumOfChildrens && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.minNumOfChildrens}</p>)}
                {formik.errors.maxNumOfChildrens && formik.touched.maxNumOfChildrens && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.maxNumOfChildrens}</p>)}
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col md={4}>
              <p className={styles.addTitle}><span>*</span> Giáo viên:</p>
            </Col>
            <Col md={20}>
              <AutoComplete
                className={styles.input}
                placeholder="Giáo viên"
                onSelect={(data) => { setLecturer(data) }}
                defaultValue={lecturer}
                options={
                  lecturersOptions
                    .map((lecturer) => ({
                      value: `${lecturer.id} - ${lecturer.fullName}`,
                      label: `${lecturer.id} - ${lecturer.fullName}`,
                    }))}
                onSearch={(value) => {
                  const filteredOptions = lecturers.filter(
                    (lecture) =>
                      `${lecture.id} - ${lecture.fullName}`
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
          </Row> */}
          <Row>
            <Col md={4}>
              <p className={styles.addTitle}><span>*</span> Ngày bắt đầu:</p>
            </Col>
            <Col md={20}>
              <DatePicker
                className={styles.input}
                value={startedDay}
                disabledDate={(current) => {
                  return current && current < dayjs().startOf('day');
                }}
                onChange={(date) => setStartedDay(date)}
                format={'DD/MM/YYYY'}
                placeholder="Ngày bắt đầu" />
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {startedDayError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{startedDayError}</p>)}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: '8px' }}>
            <Col md={4}>
              <p className={styles.addTitle}><span>*</span> Hình thức</p>
            </Col>
            <Col md={20} style={{ display: 'flex', alignItems: 'center' }}>
              <Radio.Group onChange={(e) => { setMethod(e.target.value) }} value={method}>
                <Radio value='offline'>Offline</Radio>
                <Radio value='online'>Online</Radio>
              </Radio.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <p style={{ color: '#999999', fontSize: '16px', textAlign: 'right', marginRight: '16px' }}>Lịch học hàng tuần:</p>
            </Col>
            <Col md={20} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
              <Button style={{ marginRight: '24px' }} onClick={() => { setSchedules([...schedules, { day: null, startTime: null, endTime: null }]) }}>
                + Thêm lịch học
              </Button>
            </Col>
          </Row>
          {schedules.map((schedule, index) => (
            <Row>
              <Col md={4}>
                <p className={styles.addTitle}><span>*</span> Lịch học {index + 1}:</p>
              </Col>
              <Col md={20}>
                <ScheduleInput
                  key={index}
                  index={index}
                  schedule={schedule}
                  onDayChange={handleDayChange}
                  onTimeChange={handleTimeChange}
                  onDelete={handleDeleteSchedule}
                />
              </Col>
            </Row>
          ))}
          <div style={{ height: '24px', paddingLeft: '10px' }}>
            {schedulesError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{schedulesError}</p>)}
          </div>
          <div style={{ height: '24px', paddingLeft: '10px' }}>
            {lecturerError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{lecturerError}</p>)}
          </div>
          {/* <Row>
            <Col md={4}>
              <p className={styles.addTitle}><span>*</span> Phòng học</p>
            </Col>
            <Col md={20}>
              <Input
                placeholder="Phòng học"
                name='room'
                value={room}
                onChange={(e) => { setRoom(e.target.value) }}
                className={styles.input}
                disabled={method === 'online'}
              />
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {roomError && method === 'offline' && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{roomError}</p>)}
              </div>
            </Col>
          </Row> */}
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
      <Modal
        title="Thêm tệp lớp học"
        centered
        open={importModalOpen}
        footer={null}
        onCancel={() => setImportModalOpen(false)}
      >
        <Button className={styles.addButton} icon={<CloudDownloadOutlined />}>Tải tệp mẫu</Button>
        <Button type='primary' className={styles.importButton} icon={<CloudUploadOutlined />}>Chọn tệp</Button>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleImport} className={styles.saveButton}>
            Nạp tập tin
          </Button>
          <Button className={styles.cancelButton} onClick={() => { setImportModalOpen(false) }}>
            Hủy
          </Button>
        </div>
      </Modal>
    </div >
  )
}
