import React, { useState, useEffect } from 'react'
import styles from './LecturerManagement.module.css'
import { Calendar, ConfigProvider, DatePicker, Empty, Input, Select, Spin, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getLecturerSchedule } from '../../api/user';
import { getLecturer, getSlots } from '../../api/classesApi';
import dayjs from 'dayjs';
import { formatDate, formatSlot } from '../../utils/utils';
import { compareAsc, startOfWeek, endOfWeek } from 'date-fns';
import viLocale from 'date-fns/locale/vi';

export default function LecturerManagement() {
    const navigate = useNavigate()
    const [lecturer, setLecturer] = useState(null)
    const [lecturers, setLecturers] = useState([]);
    const [lecturersOptions, setLecturersOptions] = useState(lecturers)
    const [schedules, setSchedules] = useState([]);
    const [lecturerLoading, setLecturerLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(dayjs())
    const [slots, setSlots] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    async function getListsOfSchedule(lecturer, startDate, endDate) {
        try {
            setLoading(true);
            const data = await getLecturerSchedule({ searchString: lecturer, startDate, endDate });
            const groupedData = []
            data?.forEach(item => {
                const check = groupedData.filter(group => item.startTime === group.startTime)
                if (check.length === 0) {
                    groupedData.push({
                        startTime: item.startTime,
                        endTime: item.endTime,
                        lecturers: [item]
                    })
                } else {
                    check[0].lecturers.push(item)
                }
            });
            groupedData.sort((a, b) => {
                const timeA = formatSlot(a.startTime);
                const timeB = formatSlot(b.startTime);
                return compareAsc(timeA, timeB);
            })
            setSchedules(groupedData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    async function getListsOfLecturers() {
        try {
            setLecturerLoading(true)
            const data = await getLecturer();
            setLecturers(data);
            setLecturersOptions(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLecturerLoading(false);
        }
    };
    async function getListsOfSlots() {
        const data = await getSlots();
        setSlots(data);
    };

    useEffect(() => {
        getListsOfLecturers();
        getListsOfSlots();
    }, []);

    useEffect(() => {
        if (lecturer) {
            getListsOfSchedule(lecturer, startOfWeek(new Date(date), { locale: viLocale }), endOfWeek(new Date(date), { locale: viLocale }));
        }
    }, [lecturer, date]);
    const handleTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setCourses([]);
        }
    };
    const columns = [
        {
            title: 'Thời gian',
            render: (_, record) => {
                return `${record.startTime} - ${record.endTime}`
            },
            width: 120,
        },
        {
            title: `Thứ 2 - ${formatDate(startOfWeek(new Date(date), { locale: viLocale }))}`,
            render: (_, record) => {
                const schedules = record.lecturers?.filter((lecturer) => {
                    const dateA = startOfWeek(new Date(date), { locale: viLocale })
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(lecturer.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.classRoom}</p>
                                </>
                            ))}
                        </>
                    )
                } else {
                    return null
                }
            }
        }, {
            title: `Thứ 3 - ${formatDate(new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 24 * 60 * 60 * 1000))}`,
            render: (_, record) => {
                const schedules = record.lecturers?.filter((lecturer) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(lecturer.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.classRoom}</p>
                                </>
                            ))}
                        </>
                    )
                } else {
                    return null
                }
            }
        },
        {
            title: `Thứ 4 - ${formatDate(new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 2 * 24 * 60 * 60 * 1000))}`,
            render: (_, record) => {
                const schedules = record.lecturers?.filter((lecturer) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 2 * 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(lecturer.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.classRoom}</p>
                                </>
                            ))}
                        </>
                    )
                } else {
                    return null
                }
            }
        },
        {
            title: `Thứ 5 - ${formatDate(new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 3 * 24 * 60 * 60 * 1000))}`,
            render: (_, record) => {
                const schedules = record.lecturer?.filter((lecturer) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 3 * 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(lecturer.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.classRoom}</p>
                                </>
                            ))}
                        </>
                    )
                } else {
                    return null
                }
            }
        },
        {
            title: `Thứ 6 - ${formatDate(new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 4 * 24 * 60 * 60 * 1000))}`,
            render: (_, record) => {
                const schedules = record.lecturers?.filter((lecturer) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 4 * 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(lecturer.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.classRoom}</p>
                                </>
                            ))}
                        </>
                    )
                } else {
                    return null
                }
            }
        },
        {
            title: `Thứ 7 - ${formatDate(new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 5 * 24 * 60 * 60 * 1000))}`,
            render: (_, record) => {
                const schedules = record.lecturers?.filter((lecturer) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 5 * 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(lecturer.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.classRoom}</p>
                                </>
                            ))}
                        </>
                    )
                } else {
                    return null
                }
            }
        },

        {
            title: `Chủ nhật - ${formatDate(endOfWeek(new Date(date), { locale: viLocale }))}`,
            render: (_, record) => {
                const schedules = record.lecturers?.filter((lecturer) => {
                    const dateA = endOfWeek(new Date(date), { locale: viLocale })
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(lecturer.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.classRoom}</p>
                                </>
                            ))}
                        </>
                    )
                } else {
                    return null
                }
            }
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Giáo viên</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <ConfigProvider
                    theme={{
                        components: {
                            DatePicker: {
                                activeBorderColor: '#f2c955'
                            },
                        },
                    }}>
                    <DatePicker
                        value={date}
                        picker="week"
                        format={`${formatDate(startOfWeek(new Date(date), { locale: viLocale }))} ~ ${formatDate(endOfWeek(new Date(date), { locale: viLocale }))}`}
                        allowClear={false}
                        className={styles.picker}
                        onChange={(date) => setDate(date)}
                        placeholder="Chọn thời gian" />
                </ConfigProvider>
                <Select
                    style={{ width: '100%', marginLeft: 10 }}
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
                    options={lecturersOptions.map((lecturer) => ({
                        value: lecturer.fullName,
                        label: lecturer.fullName
                    }))}
                    onSearch={(value) => {
                        if (value) {
                            const filteredOptions = lecturers.filter(
                                (lecturer) => lecturer.fullName.toLowerCase().includes(value?.toLowerCase())
                            );
                            setLecturersOptions(filteredOptions);
                        }
                    }}
                />
            </div>
            {
                lecturer
                    ? <Table
                        columns={columns}
                        rowKey={(record) => record.startTime}
                        dataSource={schedules}
                        pagination={null}
                        loading={loading}
                        onChange={handleTableChange}
                        sticky={{ offsetHeader: 72 }}
                    />
                    : <h5 style={{ textAlign: 'center', fontSize: '1.2rem' }}>Vui lòng chọn giáo viên</h5>
            }
        </div >
    )
}
