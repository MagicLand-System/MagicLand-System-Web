import React, { useEffect, useState } from 'react'
import styles from './ChangeClass.module.css'
import { Button, Table, Checkbox } from 'antd';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatDayOfWeek } from '../../../utils/utils';
import { changeClass, getSuitableClass } from '../../../api/classesApi';

export default function ChangeClass() {
    const navigate = useNavigate()
    const location = useLocation()
    const { student } = location.state
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState(null)
    const [newClassId, setNewClassId] = useState(null)

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const params = useParams();
    const classId = params.classId;
    const studentId = params.studentId;
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
    const handleSaveChangeClass = async () => {
        try {
            if (!newClassId) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Vui lòng chọn lớp muốn chuyển tới",
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                await changeClass({
                    fromClassId: classId,
                    toClassId: newClassId,
                    studentIdList: [studentId]
                }).then(() => Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Chuyển lớp thành công",
                    showConfirmButton: false,
                    timer: 2000
                })).then(() => {
                    navigate(-1)
                })
            }
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: error.response?.data?.Error,
                showConfirmButton: false,
                timer: 2000
            })
        }
    }
    const classesColumn = [
        {
            render: (_, record) => (
                <Checkbox checked={record.classId === newClassId} value={record.classId} onChange={(e) => { setNewClassId(e.target.value) }} />
            ),
            width: 120,
        },
        {
            title: 'Mã lớp học',
            dataIndex: 'classCode',
            sorter: (a, b) => a.classCode.toLowerCase().localeCompare(b.classCode.toLowerCase()),
        },
        {
            title: 'Giáo viên',
            render: (_, record) => record.lecture.fullName
        },
        {
            title: 'Hình thức',
            dataIndex: 'method',
            render: (method) => {
                if (method.toLowerCase().includes('online')) {
                    return <div style={{ backgroundColor: '#E9FFEF', color: '#409261' }} className={styles.status}>Online</div>
                } else if (method.toLowerCase().includes('offline')) {
                    return <div style={{ backgroundColor: '#E4E4E4', color: '#3F3748' }} className={styles.status}>Offline</div>
                }
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (startDate) => formatDate(startDate)
        },
        {
            title: 'Lịch học',
            dataIndex: 'schedules',
            render: (schedules) =>
                schedules.map((session, index) => (
                    <p style={{ margin: 0 }} key={index}>
                        {formatDayOfWeek(session.dayOfWeek)}: {session.startTime} - {session.endTime}
                    </p>
                ))
            ,
        },
    ];
    async function getListsOfClasses(classId, studentId) {
        try {
            setLoading(true);
            const data = await getSuitableClass({ classId, studentIdList: [studentId] });
            setClasses(data);
            setTableParams({
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: data.length
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getListsOfClasses(classId, studentId);
    }, [classId, studentId]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Chuyển lớp</h2>
            <p className={styles.classDetailTitle}>Học viên: <span className={styles.classDetail}>{student.fullName}</span></p>
            {/* <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
                <Search className={styles.searchBar} placeholder="Tìm kiếm lớp học, giáo viên" onSearch={(value, e) => { setSearch(value) }} enterButton />
            </div> */}
            <Table
                columns={classesColumn}
                rowKey={(record) => record.classId}
                dataSource={classes}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleSaveChangeClass} className={styles.saveButton}>
                    Lưu
                </Button>
                <Button className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                    Hủy
                </Button>
            </div>
        </div >
    )
}
