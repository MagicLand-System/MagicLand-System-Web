import React, { useEffect, useState } from 'react'
import styles from './AttendanceDetail.module.css'
import { Button, Input, Table, Avatar, Checkbox, ConfigProvider, Row, Col } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatPhone } from '../../../utils/utils';
import { getListAttendance, takeAttendance } from '../../../api/attendance';
import { getSessionOfStudent } from '../../../api/student';

const { Search } = Input;

export default function AttendanceDetail() {
    const navigate = useNavigate()
    const [apiLoading, setApiLoading] = useState(false);
    const [attendanceList, setAttendanceList] = useState([])
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(null)
    const [schedule, setSchedule] = useState(null)
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const params = useParams();
    const id = params.id;
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
    const onCheckAttendance = (e) => {
        const newList = [...attendanceList];
        newList.map((atten) => {
            if (atten.id === e.target.value) {
                atten.isPresent = !atten.isPresent;
                setAttendanceList(newList)
            }
        })
    }
    const handleSaveAttendance = async (e) => {
        try {
            setApiLoading(true);
            console.log(attendanceList)
            await takeAttendance(attendanceList)
                .then(() =>
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Điểm danh lớp học thành công",
                        showConfirmButton: false,
                        timer: 2000
                    }))
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
    async function getListOfStudents(searchString, scheduleId) {
        try {
            setLoading(true);
            const data = await getListAttendance(scheduleId, searchString);
            setAttendanceList(data);
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
    async function getScheduleDetail(scheduleId) {
        const data = await getSessionOfStudent(scheduleId);
        setSchedule(data);
    };
    useEffect(() => {
        getScheduleDetail(id);
    }, [id]);
    useEffect(() => {
        getListOfStudents(search, id)
    }, [search, id])
    const studentsColumn = [
        {
            title: 'Học viên',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Avatar size={64} src={record.student.avatarImage} />
                    <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>{record.student?.fullName}</p>
                </div>
            )
        },
        {
            title: 'Phụ huynh',
            render: (_, record) => (record.student.parent?.fullName)
        },
        {
            title: 'Số điện thoại',
            render: (_, record) => (record.student?.parent?.phone && formatPhone(record.student.parent.phone))
        },
        {
            title: 'Có mặt',
            dataIndex: 'isPresent',
            render: (_, record) => (
                <Checkbox checked={record.isPresent} value={record.id} onChange={onCheckAttendance} />
            )
        },
        {
            title: 'Học bù',
            render: (_, record) => !record.isPresent && (
                <Button type='link' onClick={() => navigate(`/student-management/view-classes/${record.student.id}/make-up-class/${id}`)} icon={<SwapOutlined />} size='large' />
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Điểm danh</h2>
            {/* <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
                <Search className={styles.searchBar} placeholder="Tìm kiếm học viên" onSearch={(value, e) => { setSearch(value) }} enterButton />
            </div> */}
            {schedule && (
                <Row>
                    <Col span={12} style={{ marginBottom: '40px' }}>
                        <div className={styles.classPart}>
                            <h5 className={styles.classPartTitle}>Thông tin buổi học</h5>
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
                                    <p className={styles.classTitle}>Mã lớp học:</p>
                                </Col>
                                <Col span={14}>
                                    <p className={styles.classDetail}>{schedule.classCode}</p>
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
                    <Col span={12} style={{ marginBottom: '40px' }}>
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
                                <Col span={10}>
                                    <p className={styles.classTitle}>Nội dung buổi học:</p>
                                </Col>
                                <Col span={14}>
                                    {schedule.contents.map((content, index) => (
                                        <div key={index}>
                                            <p className={styles.classDetail}> {content.content}:</p>
                                            {content.details.map((detail) => <p className={styles.classDetail}>&emsp;-&nbsp;{detail}</p>)}
                                        </div>
                                    ))}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            )}
            <Table
                columns={studentsColumn}
                rowKey={(record) => record.id}
                dataSource={attendanceList}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button loading={apiLoading} onClick={handleSaveAttendance} className={styles.saveButton}>
                    Lưu
                </Button>
                <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                    Hủy
                </Button>
            </div>
        </div >
    )
}
