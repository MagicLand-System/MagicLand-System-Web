import React, { useEffect, useState } from 'react'
import styles from './MakeUpClass.module.css'
import { Button, Input, Table, Checkbox, Select, DatePicker, ConfigProvider } from 'antd';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatDayOfWeek, formatSlot } from '../../../utils/utils';
import { arrangeMakeUpClass, getMakeUpClass, getSlots } from '../../../api/classesApi';
import { compareAsc } from 'date-fns';
import dayjs from 'dayjs';

const { Search } = Input;

export default function MakeUpClass() {
    const navigate = useNavigate()
    const location = useLocation()
    const { student } = location.state
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([])

    const [search, setSearch] = useState(null)
    const [findDate, setFindDate] = useState(null)
    const [slot, setSlot] = useState(null)
    const [makeUpScheduleId, setMakeUpScheduleId] = useState(null)

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const params = useParams();
    const scheduleId = params.scheduleId;
    const studentId = params.studentId;
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
    const handleSaveMakeUpClass = async () => {
        try {
            if (!makeUpScheduleId) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Vui lòng chọn lớp muốn học bù",
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                await arrangeMakeUpClass(scheduleId, studentId, makeUpScheduleId)
                    .then(() => Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Xếp lớp học bù thành công",
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
    async function getListsOfSlots() {
        const data = await getSlots();
        const sortedSlots = data.sort((a, b) => {
            const timeA = formatSlot(a.startTime);
            const timeB = formatSlot(b.startTime);
            return compareAsc(timeA, timeB);
        });
        setSlots(sortedSlots);
    };
    async function getListOfMakeUpClasses(scheduleId, studentId, keyword, dateTime, slotId) {
        try {
            setLoading(true);
            const data = await getMakeUpClass({ scheduleId, studentId, keyword, dateTime, slotId });
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
        getListsOfSlots()
    }, [])
    useEffect(() => {
        getListOfMakeUpClasses(scheduleId, studentId, search, findDate, slot)
    }, [scheduleId, studentId, search, findDate, slot])
    const classesColumn = [
        {
            render: (_, record) => (
                <Checkbox checked={record.id === makeUpScheduleId} value={record.id} onChange={(e) => { setMakeUpScheduleId(e.target.value) }} />
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
            dataIndex: 'lecturer',
            render: (lecturer) => lecturer.fullName
        },
        {
            title: 'Hình thức',
            dataIndex: 'method',
            render: (method) => {
                if (method?.toLowerCase().includes('online')) {
                    return <div style={{ backgroundColor: '#E9FFEF', color: '#409261' }} className={styles.status}>Online</div>
                } else if (method?.toLowerCase().includes('offline')) {
                    return <div style={{ backgroundColor: '#E4E4E4', color: '#3F3748' }} className={styles.status}>Offline</div>
                }
            },
        },
        {
            title: 'Ngày học',
            dataIndex: 'date',
            render: (_, record) => (`${formatDayOfWeek(record.dayOfWeeks)} - ${formatDate(record.date)}`),
        },
        {
            title: 'Giờ học',
            dataIndex: 'slot',
            render: (slot) => (
                `${slot.startTime} - ${slot.endTime}`
            ),
        },
        {
            title: 'Phòng học',
            dataIndex: 'room',
            render: (room) => room.name,
        }
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Xếp lịch học bù</h2>
            <p className={styles.classDetailTitle}>Học viên: <span className={styles.classDetail}>{student.student.fullName}</span></p>
            <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
                <Search className={styles.searchBar} placeholder="Tìm kiếm lớp học, giáo viên" onSearch={(value, e) => { setSearch(value) }} enterButton />
                <ConfigProvider
                    theme={{
                        components: {
                            DatePicker: {
                                activeBorderColor: '#f2c955'
                            },
                        },
                    }}>
                    <DatePicker
                        className={styles.input}
                        value={findDate}
                        disabledDate={(current) => {
                            return current && current < dayjs().add(1, 'day').startOf('day');
                        }}
                        onChange={(date) => setFindDate(date)}
                        format={'DD/MM/YYYY'}
                        placeholder="Tìm kiếm ngày" />
                </ConfigProvider>
                <Select
                    className={styles.input}
                    value={slot}
                    placeholder="Giờ học"
                    onChange={(value) => setSlot(value)}
                    options={slots.map((slot) => ({
                        value: slot.id,
                        label: `${slot.startTime} - ${slot.endTime}`
                    }))}
                />
            </div>
            <Table
                columns={classesColumn}
                rowKey={(record) => record.id}
                dataSource={classes}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleSaveMakeUpClass} className={styles.saveButton}>
                    Lưu
                </Button>
                <Button className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                    Hủy
                </Button>
            </div>
        </div >
    )
}
