import React, { useState, useEffect } from 'react'
import styles from './ImportClass.module.css'
import { Button, DatePicker, Radio, Input, Modal, Table, Select, TimePicker, Alert } from 'antd';
import { CloudUploadOutlined, PlusOutlined, DeleteOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';

const dataClasses = [
  {
    className: 'CLA011',
    courseCode: 'EMA01',
    courseName: 'Toán tiếng anh 1',
    method: 'online',
    lecturerName: 'Ngô Gia Thưởng',
    room: null,
    maxNumOfChildrens: 30,
    startedDate: '04/12/2023',
    schedule: [
      { day: 'monday', startTime: '10:15', endTime: '12:15' },
      { day: 'wednesday', startTime: '10:15', endTime: '12:15' }
    ],
    errors: [
      // {
      //   message: 'Khóa học không tồn tại'
      // },
      // {
      //   message: 'Ngày bắt đầu không đúng'
      // }
    ],
  },
  {
    className: 'CLA012',
    courseCode: 'APA01',
    courseName: 'Vẽ tranh nghệ thuật',
    method: 'offline',
    room: '001',
    lecturerName: 'Nguyễn Thị Hương',
    maxNumOfChildrens: 25,
    startedDate: '05/12/2023',
    schedule: [
      { day: 'tuesday', startTime: '14:30', endTime: '16:30' },
      { day: 'thursday', startTime: '14:30', endTime: '16:30' }
    ],
    errors: [],
  },
  {
    className: 'CLA013',
    courseCode: 'CKK01',
    courseName: 'Nấu ăn cho em',
    method: 'offline',
    lecturerName: 'Trần Văn Tuấn',
    room: '002',
    maxNumOfChildrens: 20,
    startedDate: '04/12/2023',
    schedule: [
      { day: 'monday', startTime: '09:00', endTime: '11:00' }
    ],
    errors: [],
  },
  {
    className: 'CLA014',
    courseCode: 'EMA02',
    courseName: 'Toán tiếng anh 2',
    method: 'online',
    lecturerName: 'Phạm Thị Hạnh',
    room: null,
    maxNumOfChildrens: 30,
    startedDate: '05/12/2023',
    schedule: [
      { day: 'tuesday', startTime: '11:00', endTime: '13:00' },
      { day: 'thursday', startTime: '11:00', endTime: '13:00' }
    ],
    errors: [],
  },
  {
    className: 'CLA015',
    courseCode: 'PRT01',
    courseName: 'Tư duy lập trình',
    method: 'offline',
    lecturerName: 'Lê Văn Hùng',
    room: '003',
    maxNumOfChildrens: 25,
    startedDate: '04/12/2023',
    schedule: [
      { day: 'monday', startTime: '13:30', endTime: '15:30' },
      { day: 'wednesday', startTime: '13:30', endTime: '15:30' }
    ],
    errors: [],
  },
  {
    className: 'CLA016',
    courseCode: 'VOV01',
    courseName: 'Vovinam',
    method: 'offline',
    lecturerName: 'Nguyễn Thị Hiền',
    room: '004',
    maxNumOfChildrens: 20,
    startedDate: '05/12/2023',
    schedule: [
      { day: 'tuesday', startTime: '10:00', endTime: '12:00' },
      { day: 'thursday', startTime: '10:00', endTime: '12:00' }
    ],
    errors: [],
  },
  {
    className: 'CLA017',
    courseCode: 'CIC01',
    courseName: 'Tự tin giao tiếp',
    method: 'online',
    lecturerName: 'Trần Văn Hoàng',
    room: null,
    maxNumOfChildrens: 30,
    startedDate: '04/12/2023',
    schedule: [
      { day: 'monday', startTime: '14:00', endTime: '16:00' }
    ],
    errors: [],
  },
  {
    className: 'CLA018',
    courseCode: 'BMD01',
    courseName: 'Làm bánh và pha chế',
    method: 'offline',
    lecturerName: 'Phan Thị Ngọc Anh',
    room: '005',
    maxNumOfChildrens: 25,
    startedDate: '05/12/2023',
    schedule: [
      { day: 'tuesday', startTime: '15:30', endTime: '17:30' },
    ],
    errors: [],
  },
  {
    className: 'CLA019',
    courseCode: 'ENG01',
    courseName: 'Tiếng anh cơ bản 1',
    method: 'online',
    lecturerName: 'Vũ Thị Mai',
    room: null,
    maxNumOfChildrens: 20,
    startedDate: '06/12/2023',
    schedule: [
      { day: 'monday', startTime: '16:45', endTime: '18:45' },
      { day: 'wednesday', startTime: '16:45', endTime: '18:45' }
    ],
    errors: [],
  },
  {
    className: 'CLA020',
    courseCode: 'ENG02',
    courseName: 'Tiếng anh cơ bản 2',
    method: 'online',
    lecturerName: 'Vũ Thị Mai',
    room: null,
    maxNumOfChildrens: 20,
    startedDate: '06/12/2023',
    schedule: [
      { day: 'monday', startTime: '16:45', endTime: '18:45' },
      { day: 'wednesday', startTime: '16:45', endTime: '18:45' }
    ],
    errors: [],
  },
];
const columns = [
  {
    title: 'Lớp học',
    dataIndex: 'className'
  },
  {
    title: 'Mã - Tên khóa học',
    dataIndex: 'courseCode',
    render: (text, record) => `${record.courseCode} - ${record.courseName}`,
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
  {
    title: 'Lỗi (nếu có)',
    dataIndex: 'errors',
    render: (text, record) => (
      <div>
        {record.errors.map((error, index) => (
          <p style={{ color: '#FF6868' }} key={index}>{error.message}</p>
        ))}
      </div>
    ),
  },
];

export default function ImportClass() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState(dataClasses);
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Thêm các lớp học thành công",
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      navigate('/class-management')
    })
  }
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
  }, []);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Xác nhận thông tin lớp học</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: '20px 0' }}>
        <Alert style={{ width: '100%', marginRight: '8px' }} message="Thông tin các lớp học hợp lệ" type="success" showIcon />
        <Button className={styles.saveButton} onClick={handleSubmit}>
          Lưu thông tin
        </Button>
        <Button className={styles.cancelButton} onClick={() => { navigate('/class-management') }}>
          Hủy
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record.className}
        dataSource={classes}
        loading={loading}
        pagination={false}
      />
    </div>
  )
}
