import React, { useState, useEffect } from 'react'
import styles from './ClassManagement.module.css'
import { Button, DatePicker, Radio, Input, Modal, Table, Select, TimePicker } from 'antd';
import { CloudUploadOutlined, PlusOutlined, DeleteOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const dataClasses = [
  {
    image: 'https://cdn.popsww.com/blog-kids-learn/sites/3/2022/03/hoc-toan-lop-4.jpeg',
    className: 'CLA001',
    courseCode: 'EMA01',
    courseName: 'Toán tiếng anh 1',
    status: 'completed',
    method: 'online',
    lecturerName: 'Ngô Gia Thưởng',
    room: null,
    maxNumOfChildrens: 30,
    numOfChildrens: 20,
    startedDate: '16/10/2023',
    schedule: [
      { day: 'monday', startTime: '10:15', endTime: '12:15' },
      { day: 'wednesday', startTime: '10:15', endTime: '12:15' }
    ]
  },
  {
    image: 'https://baobariavungtau.com.vn/dataimages/202208/original/images1753055_tranh.jpg',
    className: 'CLA002',
    courseCode: 'APA01',
    courseName: 'Vẽ tranh nghệ thuật',
    status: 'on-going',
    method: 'offline',
    room: '001',
    lecturerName: 'Nguyễn Thị Hương',
    maxNumOfChildrens: 25,
    numOfChildrens: 15,
    startedDate: '21/11/2023',
    schedule: [
      { day: 'tuesday', startTime: '14:30', endTime: '16:30' },
      { day: 'thursday', startTime: '14:30', endTime: '16:30' }
    ]
  },
  {
    image: 'https://hocmonviet.edu.vn/wp-content/uploads/2021/02/anh-thuc-te-khoa-hoc-nau-an-cho-tre-em-tai-hoc-mon-viet-25.jpg',
    className: 'CLA003',
    courseCode: 'CKK01',
    courseName: 'Nấu ăn cho em',
    status: 'upcoming',
    method: 'offline',
    lecturerName: 'Trần Văn Tuấn',
    room: '002',
    maxNumOfChildrens: 20,
    numOfChildrens: 10,
    startedDate: '25/12/2023',
    schedule: [
      { day: 'monday', startTime: '09:00', endTime: '11:00' }
    ]
  },
  {
    image: 'https://toanvn.edu.vn/uploads/ckeditor/pictures/2430/content_top-12-trung-tam-day-toan-chat-luong-cao-ha-noi-1.jpg',
    className: 'CLA004',
    courseCode: 'EMA02',
    courseName: 'Toán tiếng anh 2',
    status: 'completed',
    method: 'online',
    lecturerName: 'Phạm Thị Hạnh',
    room: null,
    maxNumOfChildrens: 30,
    numOfChildrens: 25,
    startedDate: '17/10/2023',
    schedule: [
      { day: 'tuesday', startTime: '11:00', endTime: '13:00' },
      { day: 'thursday', startTime: '11:00', endTime: '13:00' }
    ]
  },
  {
    image: 'https://letweb-os-1.sgp1.digitaloceanspaces.com/dailyinfo.vn/2022/01/26011630/hoc-lap-trinh-cung-se-la-mot-hinh-thuc-giai-tri-khi-tre-du-nhan-thuc-de-hieu-ve-no.jpg',
    className: 'CLA005',
    courseCode: 'PRT01',
    courseName: 'Tư duy lập trình',
    status: 'upcoming',
    method: 'offline',
    lecturerName: 'Lê Văn Hùng',
    room: '003',
    maxNumOfChildrens: 25,
    numOfChildrens: 20,
    startedDate: '20/12/2023',
    schedule: [
      { day: 'monday', startTime: '13:30', endTime: '15:30' },
      { day: 'wednesday', startTime: '13:30', endTime: '15:30' }
    ]
  },
  {
    image: 'https://www.nestlemilo.com.vn/sites/default/files/2021-10/vovinam-1.jpg',
    className: 'CLA006',
    courseCode: 'VOV01',
    courseName: 'Vovinam',
    status: 'on-going',
    method: 'offline',
    lecturerName: 'Nguyễn Thị Hiền',
    room: '004',
    maxNumOfChildrens: 20,
    numOfChildrens: 15,
    startedDate: '28/11/2023',
    schedule: [
      { day: 'tuesday', startTime: '10:00', endTime: '12:00' },
      { day: 'thursday', startTime: '10:00', endTime: '12:00' }
    ]
  },
  {
    image: 'https://ts.masterkids.edu.vn/public/kids2/assets/img/c4.jpg',
    className: 'CLA007',
    courseCode: 'CIC01',
    courseName: 'Tự tin giao tiếp',
    status: 'completed',
    method: 'online',
    lecturerName: 'Trần Văn Hoàng',
    room: null,
    maxNumOfChildrens: 30,
    numOfChildrens: 28,
    startedDate: '14/11/2023',
    schedule: [
      { day: 'monday', startTime: '14:00', endTime: '16:00' }
    ]
  },
  {
    image: 'https://phongtuyensinh.dongdoctm.edu.vn/wp-content/uploads/2023/08/Khoa-hoc-lam-banh-va-do-uong-cho-tre-em-3.jpg',
    className: 'CLA008',
    courseCode: 'BMD01',
    courseName: 'Làm bánh và pha chế',
    status: 'upcoming',
    method: 'offline',
    lecturerName: 'Phan Thị Ngọc Anh',
    room: '005',
    maxNumOfChildrens: 25,
    numOfChildrens: 22,
    startedDate: '05/12/2023',
    schedule: [
      { day: 'tuesday', startTime: '15:30', endTime: '17:30' },
    ]
  },
  {
    image: 'https://giasuhanoigioi.edu.vn/wp-content/uploads/nen-thue-gia-su-day-tieng-anh-tai-nha-la-nguoi-viet-hay-nguoi-nuoc-ngoai.jpg',
    className: 'CLA009',
    courseCode: 'ENG01',
    courseName: 'Tiếng anh cơ bản 1',
    status: 'on-going',
    method: 'online',
    lecturerName: 'Vũ Thị Mai',
    room: null,
    maxNumOfChildrens: 20,
    numOfChildrens: 18,
    startedDate: '22/11/2023',
    schedule: [
      { day: 'monday', startTime: '16:45', endTime: '18:45' },
      { day: 'wednesday', startTime: '16:45', endTime: '18:45' }
    ]
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU1r1rXxEphShKtHsLNFoOG7Fxq9yTgswvJvYEUJa3tWSLvNx1mE4L5N_F_WPI1u2-EMw&usqp=CAU',
    className: 'CLA010',
    courseCode: 'ENG02',
    courseName: 'Tiếng anh cơ bản 2',
    status: 'completed',
    method: 'online',
    lecturerName: 'Vũ Thị Mai',
    room: null,
    maxNumOfChildrens: 20,
    numOfChildrens: 12,
    startedDate: '27/09/2023',
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
    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
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
    render: (text, record) => (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={record.image} alt="Class Image" style={{ width: '50px', marginRight: '10px' }} />
        <p>{record.className}</p>
      </div>
    ),
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
    render: (text, record) => {
      if (record.status === 'completed') {
        return <div style={{ backgroundColor: '#e7e9ea', color: '#495057' }} className={styles.status}>Đã hoàn thành</div>
      } else if (record.status === 'upcoming') {
        return <div style={{ backgroundColor: '#cce5ff', color: '#004085' }} className={styles.status}>Sắp tới</div>
      } else if (record.status === 'on-going') {
        return <div style={{ backgroundColor: '#d4edda', color: '#155724' }} className={styles.status}>Đang diễn ra</div>
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
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.status === value,
  },
  {
    title: 'Hình thức',
    dataIndex: 'method',
    render: (text, record) => {
      if (record.method === 'online') {
        return <div style={{ backgroundColor: '#e6d9f0', color: '#6f42c1' }} className={styles.status}>Online</div>
      } else if (record.method === 'offline') {
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
    title: 'Số học viên tối đa',
    dataIndex: 'maxNumOfChildrens',
  },
  {
    title: 'Số học viên đã đăng kí',
    dataIndex: 'numOfChildrens',
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'startedDate',
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
  // const [lecturers, setlecturers] = useState([])
  const [lecturers, setlecturers] = useState(dataLectures)

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
        if (lecturer === null) {
          setLecturerError("Vui lòng chọn giáo viên")
        } else {
          setLecturerError(null)
        }
        if (startedDay === null) {
          setStartedDayError("Vui lòng nhập ngày bắt đầu")
        } else {
          setStartedDayError(null)
        }
        if (method === 'offline' && room === null) {
          setRoomError("Vui lòng nhập phòng học")
        } else {
          setRoomError(null)
        }
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
        console.log({ ...values, startedDay: stringStartedDay, course, lecturer, method, schedules })
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tạo lớp học thành công",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          setAddModalOpen(false)
          setCourse(null)
          setLecturer(null)
          setStartedDay(null)
          setRoom(null)
          setSchedules([{ day: null, startTime: null, endTime: null }]) 
          formik.resetForm()
        })
      }
    },
    validationSchema: Yup.object({
      maxNumOfChildrens: Yup.number().min(1, "Số lượng học viên tối thiểu là 1"),
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
      />
      <Modal
        title="Thêm lớp học"
        centered
        open={addModalOpen}
        footer={null}
        onCancel={() => setAddModalOpen(false)}
      >
        <form onSubmit={formik.handleSubmit}>
          <Select
            className={styles.input}
            placeholder="Chọn khóa học"
            value={course}
            onChange={(value) => setCourse(value)}
            options={courses.sort((a, b) => a.courseCode.toLowerCase().localeCompare(b.courseCode.toLowerCase())).map((course) => ({
              value: course.courseCode,
              label: `${course.courseCode} - ${course.courseName}`,
            }))}
          />
          <div style={{ height: '24px', paddingLeft: '10px' }}>
            {courseError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{courseError}</p>)}
          </div>
          <Input
            placeholder="Số lượng học viên tối đa"
            name='maxNumOfChildrens'
            type='number'
            value={formik.values.maxNumOfChildrens}
            onChange={formik.handleChange}
            error={formik.touched.maxNumOfChildrens && formik.errors.maxNumOfChildrens}
            className={styles.input}
            required
          />
          <div style={{ height: '24px', paddingLeft: '10px' }}>
            {formik.errors.maxNumOfChildrens && formik.touched.maxNumOfChildrens && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.maxNumOfChildrens}</p>)}
          </div>
          <Select
            className={styles.input}
            placeholder="Giáo viên"
            value={lecturer}
            onChange={(value) => setLecturer(value)}
            options={lecturers.map((lecturer) => ({
              value: lecturer.id,
              label: lecturer.fullName,
            }))}
          />
          <div style={{ height: '24px', paddingLeft: '10px' }}>
            {lecturerError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{lecturerError}</p>)}
          </div>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#c0c0c0', fontSize: 16, marginBottom: 5, marginTop: 0 }}>Hình thức</p>
            <Radio.Group onChange={(e) => { setMethod(e.target.value) }} value={method}>
              <Radio value='offline'>Offline</Radio>
              <Radio value='online'>Online</Radio>
            </Radio.Group>
          </div>
          <Input
            placeholder="Phòng học"
            name='room'
            value={room}
            onChange={(e) => { setRoom(e.target.value) }}
            className={styles.input}
            disabled={method === 'online'}
          />
          <div style={{ height: '24px', paddingLeft: '10px' }}>
            {roomError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{roomError}</p>)}
          </div>
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
          <p style={{ color: '#c0c0c0', fontSize: 16, marginBottom: 5, marginTop: 0 }}>Lịch học theo tuần</p>

          {schedules.map((schedule, index) => (
            <ScheduleInput
              key={index}
              index={index}
              schedule={schedule}
              onDayChange={handleDayChange}
              onTimeChange={handleTimeChange}
              onDelete={handleDeleteSchedule}
            />
          ))}
          <div style={{ height: '24px', paddingLeft: '10px' }}>
            {schedulesError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{schedulesError}</p>)}
          </div>
          <div>
            <Button style={{ marginBottom: '8px' }} onClick={() => { setSchedules([...schedules, { day: null, startTime: null, endTime: null }]) }}>
              Thêm lịch học
            </Button>
          </div>
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
          <Button className={styles.saveButton} onClick={() => navigate('import')}>
            Nạp tập tin
          </Button>
          <Button className={styles.cancelButton} onClick={() => { setImportModalOpen(false) }}>
            Hủy
          </Button>
        </div>
      </Modal>
    </div>
  )
}
