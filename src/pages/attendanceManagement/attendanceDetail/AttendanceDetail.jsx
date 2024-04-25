import React, { useEffect, useState } from 'react'
import styles from './AttendanceDetail.module.css'
import { Button, Input, Table, Avatar, Checkbox, ConfigProvider } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { formatPhone } from '../../../utils/utils';
import { getListAttendance, takeAttendance } from '../../../api/attendance';

const { Search } = Input;

export default function AttendanceDetail() {
    const navigate = useNavigate()
    const [apiLoading, setApiLoading] = useState(false);
    const [attendanceList, setAttendanceList] = useState([])
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(null)
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
            const data = await getListAttendance({ scheduleId });
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
    useEffect(() => {
        getListOfStudents(search, id)
    }, [search, id])
    const studentsColumn = [
        {
            title: 'Học viên',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Avatar size={64} src={record.student.avatarImage} />
                    <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>{record.student.fullName}</p>
                </div>
            )
        },
        {
            title: 'Phụ huynh',
            render: (_, record) => (record.student.user.fullName)
        },
        {
            title: 'Số điện thoại',
            render: (_, record) => (record.student?.user?.phone && formatPhone(record.student.user.phone))
        },
        {
            title: 'Có mặt',
            dataIndex: 'isPresent',
            render: (_, record) => (
                <Checkbox checked={record.isPresent} value={record.id} onChange={onCheckAttendance} />
            )
        },
        {
            title: 'Chuyển lớp học bù',
            render: (_, record) => !record.isPresent && (
                <Button type='link' onClick={() => navigate(`/student-management/view-schedules/${record.student.id}/make-up-class/${id}`)} icon={<SwapOutlined />} size='large' />
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Điểm danh</h2>
            <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
                <Search className={styles.searchBar} placeholder="Tìm kiếm học viên" onSearch={(value, e) => { setSearch(value) }} enterButton />
            </div>
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
