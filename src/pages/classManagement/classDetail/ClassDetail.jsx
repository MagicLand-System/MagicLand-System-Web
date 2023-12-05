import React, { useState, useEffect } from 'react'
import styles from './ClassDetail.module.css'
import { Button, DatePicker, Radio, Input, Modal, Table, Select, TimePicker, Row, Col, Avatar } from 'antd';
import { CloudUploadOutlined, PlusOutlined, DeleteOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom';
import { AutoComplete } from 'antd';

const { Search } = Input;
const dataClass = {
    image: 'https://enspire.edu.vn/wp-content/uploads/38978937761_d19f1c1169_k-1024x683.jpg',
    className: 'CLA013',
    courseCode: 'ENG02',
    courseName: 'Tiếng anh cơ bản 2',
    status: 'waiting',
    method: 'offline',
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
}
const studentsData = [
    {
        id: 1,
        image: 'https://leplateau.edu.vn/wp-content/uploads/2023/10/anh-be-gai-1.jpg',
        fullName: 'Nguyễn Thị Băng Châu',
        age: 6,
        gender: 'Nữ',
        parentName: 'Trần Lê Bảo Ngọc',
        parentPhoneNumber: '0912344640',
    },
    {
        id: 2,
        image: 'https://mcdn.coolmate.me/image/May2022/kieu-toc-cho-be-trai_275.jpg',
        fullName: 'Trần Văn An',
        age: 6,
        gender: 'Nam',
        parentName: 'Trần Văn Bảo',
        parentPhoneNumber: '0912345678',
    },
    {
        id: 3,
        image: "https://image-us.eva.vn/upload/3-2021/images/2021-09-11/be-gai-2-tuoi-dep-nhu-bup-be-song-bi-cam-tham-mygio-thay-doi-chi-dong-1-phim-nam-co-be-bi-cam-dao-keo-nam-2-tuoi-lu-mo-ca-trieu-le--1631324096-934-width660height880.jpg",
        fullName: 'Lê Thị Cẩm Ly',
        age: 6,
        gender: 'Nữ',
        parentName: 'Lê Văn Đăng',
        parentPhoneNumber: '0912345679',
    },
    {
        id: 4,
        image: 'https://bizweb.dktcdn.net/100/438/408/files/kieu-toc-cho-be-trai-3-tuoi-yodyvn-1.jpg?v=1692066229333',
        fullName: 'Phạm Văn Hải',
        age: 7,
        gender: 'Nam',
        parentName: 'Phạm Văn Hùng',
        parentPhoneNumber: '0912345680',
    },
    {
        id: 5,
        image: 'https://cdn.vn.alongwalk.info/vn/wp-content/uploads/2023/02/28174712/image-ngam-nhin-100-anh-be-gai-cute-dang-yeu-nhu-thien-than-167755603299485.jpg',
        fullName: 'Trần Thị Giang',
        age: 6,
        gender: 'Nữ',
        parentName: 'Trần Văn Hưng',
        parentPhoneNumber: '0912345681',
    },
    {
        id: 6,
        image: 'https://hocchungchi.edu.vn/toc-dep-cho-be-trai-1-tuoi/imager_11_268_700.jpg',
        fullName: 'Lê Văn Idris',
        age: 6,
        gender: 'Nam',
        parentName: 'Lê Thị Kim',
        parentPhoneNumber: '0912345682',
    },
    {
        id: 7,
        image: 'https://my-test-11.slatic.net/p/87692c06c261ed5ce3361039f345c5bb.jpg',
        fullName: 'Nguyễn Thị Lệ Quyên',
        age: 6,
        gender: 'Nữ',
        parentName: 'Nguyễn Văn Minh',
        parentPhoneNumber: '0912345683',
    },
    {
        id: 8,
        image: 'https://image-us.eva.vn/upload/1-2022/images/2022-01-24/be-trai-sai-gon-bi-nham-lan-voi-bo-con-trai-hoa-minzy-vi-giong-90-me-ruot-tiet-lo-hoa-minzy-len-tieng-khi-hinh-anh-quy-tu-bi-loi-dun-1643000664-854-width660height925.jpg',
        fullName: 'Phan Văn Nam',
        age: 6,
        gender: 'Nam',
        parentName: 'Phan Thị Phương',
        parentPhoneNumber: '0912345684',
    },
    {
        id: 9,
        image: 'https://haycafe.vn/wp-content/uploads/2022/12/Hinh-anh-em-be-Han-Quoc.jpg',
        fullName: 'Vũ Thị Quỳnh',
        age: 6,
        gender: 'Nữ',
        parentName: 'Vũ Văn Rồng',
        parentPhoneNumber: '0912345685',
    },
    {
        id: 10,
        image: 'https://dongphuchaianh.vn/wp-content/uploads/2022/01/ao-so-mi-be-trai-trang.jpg',
        fullName: 'Đỗ Văn Sơn',
        age: 6,
        gender: 'Nam',
        parentName: 'Đỗ Thị Thủy',
        parentPhoneNumber: '0912345686',
    },
];

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
const dataRooms = [
    {
        room: '111'
    },
    {
        room: '112'
    },
    {
        room: '113'
    },
    {
        room: '114'
    },
    {
        room: '115'
    },

]
const columns = [
    {
        title: 'Tên học viên',
        dataIndex: 'fullName',
        // sorter: true,
        sorter: (a, b) => a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()),
        render: (text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Avatar size={64} src={record.image} style={{ marginRight: '10px' }} />
                <p>{record.fullName}</p>
            </div>
        ),
    },
    {
        title: 'Tuổi',
        dataIndex: 'age',
        // sorter: true,
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
];
const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

export default function ClassDetail() {

    const navigate = useNavigate();
    const [classData, setClassData] = useState(dataClass);
    const [students, setStudents] = useState(studentsData);

    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [addModalOpen, setAddModalOpen] = useState(false)
    // const [lecturers, setlecturers] = useState([])
    const [lecturers, setlecturers] = useState(dataLectures)
    const [lecturersOptions, setLecturersOptions] = useState(lecturers);

    const [lecturer, setLecturer] = useState(null)
    const [lecturerError, setLecturerError] = useState(null)

    const [rooms, setRooms] = useState(dataRooms)
    const [roomsOptions, setRoomsOptions] = useState(rooms)

    const [room, setRoom] = useState(null)
    const [roomError, setRoomError] = useState(null)

    const params = useParams();
    const id = params.id;
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
    const handleSubmit = () => {
        if (!lecturer || (classData.method === 'offline' && room === null)) {
            if (lecturer === null) {
                setLecturerError("Vui lòng chọn giáo viên")
            } else {
                setLecturerError(null)
            }
            if (classData.method === 'offline' && room === null) {
                setRoomError("Vui lòng nhập phòng học")
            } else {
                setRoomError(null)
            }
        } else {
            console.log(lecturer, room)
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Bắt đầu lớp học thành công",
                showConfirmButton: false,
                timer: 2000
            }).then(() => { navigate('/class-management') })
        }
    }
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Chi tiết lớp học</h2>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img style={{ width: '100%' }} src={classData.image} />
                    <Button onClick={() => setAddModalOpen(true)} type='primary' className={styles.importButton} >Bắt đầu lớp học</Button>
                </div>
                <div style={{ width: '50%', paddingLeft: '24px', paddingRight: '24px' }}>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Mã lớp:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.className}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Khóa học:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.courseCode} - {classData.courseName}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Giáo viên:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.lecturerName ? classData.lecturerName : 'Không có'}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Hình thức:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.method}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Phòng học:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.room ? classData.room : 'Không có'}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Số học viên tối thiểu:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.minNumOfChildrens}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Số học viên tối đa:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.maxNumOfChildrens}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Số học viên đã đăng kí:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.numOfChildrens}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Ngày bắt đầu:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.startDate}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Ngày kết thúc:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.endDate}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Trạng thái:</p>
                        </Col>
                        <Col md={16}>
                            <p className={styles.classDetail}>{classData.status === 'completed' ? 'Đã hoàn thành'
                                : classData.status === 'upcoming' ? 'Sắp tới'
                                    : classData.status === 'on-going' ? 'Đang diễn ra'
                                        : classData.status === 'waiting' && 'Đang chờ'}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p className={styles.classTitle}>Lịch học hàng tuần:</p>
                        </Col>
                        <Col md={16}>
                            {classData.schedule.map((session, index) => (
                                <p className={styles.classDetail} key={index}>
                                    {session.day === 'monday' ? 'Thứ 2' :
                                        session.day === 'tuesday' ? 'Thứ 3' :
                                            session.day === 'wednesday' ? 'Thứ 4' :
                                                session.day === 'thursday' ? 'Thứ 5' :
                                                    session.day === 'friday' ? 'Thứ 6' :
                                                        session.day === 'saturday' ? 'Thứ 7' : 'Chủ nhật'}: {session.startTime} - {session.endTime}
                                </p>
                            ))}
                        </Col>
                    </Row>
                </div>
            </div>
            <h3 style={{ fontSize: '1.5rem' }} className={styles.title}>Học viên đã đăng kí</h3>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Search className={styles.searchBar} placeholder="Tìm kiếm học viên..." onSearch={(value, e) => { console.log(value) }} enterButton />
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={students}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            <Modal
                title="Thêm thông tin"
                centered
                open={addModalOpen}
                footer={null}
                width={700}
                onCancel={() => setAddModalOpen(false)}
            >
                <form>
                    <Row>
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
                    </Row>
                    <Row>
                        <Col md={4}>
                            <p className={styles.addTitle}><span>*</span> Phòng học</p>
                        </Col>
                        <Col md={20}>
                            <AutoComplete
                                className={styles.input}
                                placeholder="Lớp học"
                                defaultValue={room}
                                onSelect={(data) => { setRoom(data) }}
                                options={roomsOptions.map((room) => ({
                                    value: `${room.room}`,
                                    label: `${room.room}`,
                                }))}
                                disabled={classData.method === 'online'}
                                onSearch={(value) => {
                                    if (value) {
                                        const filteredOptions = rooms.filter(
                                            (room) => room.room.toLowerCase().includes(value?.toLowerCase())
                                        );
                                        setRoomsOptions(filteredOptions);
                                    }
                                }}
                            />
                            <div style={{ height: '24px', paddingLeft: '10px' }}>
                                {roomError && classData.method === 'offline' && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{roomError}</p>)}
                            </div>
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button className={styles.saveButton} onClick={handleSubmit}>
                            Lưu
                        </Button>
                        <Button className={styles.cancelButton} onClick={() => { setAddModalOpen(false) }}>
                            Hủy
                        </Button>
                    </div>
                </form>
            </Modal>
        </div >
    )
}
