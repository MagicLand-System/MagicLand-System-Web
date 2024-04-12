import React, { useState, useEffect } from 'react'
import styles from './RoomManagement.module.css'
import { Calendar, ConfigProvider, DatePicker, Empty, Input, Select, Spin, Table, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getRoomDailySchedule, getRoomSchedule } from '../../api/room';
import { getRooms, getSlots } from '../../api/classesApi';
import dayjs from 'dayjs';
import { compareAsc, startOfWeek, endOfWeek } from 'date-fns';
import viLocale from 'date-fns/locale/vi';
import { formatDate, formatSlot } from '../../utils/utils';

const { Search } = Input;

export default function RoomManagement() {
    const navigate = useNavigate()
    const [room, setRoom] = useState(null)
    const [rooms, setRooms] = useState([]);
    const [roomsOptions, setRoomsOptions] = useState(rooms)
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(dayjs())
    const [dailyDate, setDailyDate] = useState(dayjs())
    const [slots, setSlots] = useState([])
    const [tab, setTab] = useState("daily")
    const [search, setSearch] = useState(null)

    const [dailySchedules, setDailySchedules] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    async function getListsOfSchedule(room, startDate, endDate) {
        try {
            setLoading(true);
            const data = await getRoomSchedule({ searchString: room, startDate, endDate });
            const groupedData = []
            data?.forEach(item => {
                const check = groupedData.filter(group => item.startTime === group.startTime)
                if (check.length === 0) {
                    groupedData.push({
                        startTime: item.startTime,
                        endTime: item.endTime,
                        rooms: [item]
                    })
                } else {
                    check[0].rooms.push(item)
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
    async function getListsOfDailySchedule(date, search) {
        try {
            setLoading(true);
            const data = await getRoomDailySchedule(date, search);
            setDailySchedules(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    async function getListsOfRooms() {
        const data = await getRooms();
        setRooms(data);
        setRoomsOptions(data);
    };
    async function getListsOfSlots() {
        const data = await getSlots();
        setSlots(data);
    };


    useEffect(() => {
        getListsOfRooms();
        getListsOfSlots();
    }, []);
    useEffect(() => {
        if (tab === "weekly") {
            if (room) {
                getListsOfSchedule(room, startOfWeek(new Date(date), { locale: viLocale }), endOfWeek(new Date(date), { locale: viLocale }));
            }
        } else {
            getListsOfDailySchedule(dailyDate, search)
        }
    }, [tab, room, date, dailyDate, search]);
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
            title: 'Tên lớp học',
            dataIndex: 'name',
            sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        },
        {
            title: '7:00 - 9:00',
            render: (_, record) => {
                const schedule = record.schedules?.filter((schedule) => schedule.startTime === "7:00")?.[0]
                if (schedule?.isUse) {
                    return (
                        <>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                            <p style={{ margin: 0 }}>{schedule.lecturerResponse?.fullName}</p>
                        </>
                    )
                } else {
                    return null
                }
            }
        },
        {
            title: '9:15 - 11:15',
            render: (_, record) => {
                const schedule = record.schedules?.filter((schedule) => schedule.startTime === "9:15")?.[0]
                if (schedule?.isUse) {
                    return (
                        <>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                            <p style={{ margin: 0 }}>{schedule.lecturerResponse?.fullName}</p>
                        </>
                    )
                } else {
                    return null
                }
            }
        },
        {
            title: '12:00 - 14:00',
            render: (_, record) => {
                const schedule = record.schedules?.filter((schedule) => schedule.startTime === "12:00")?.[0]
                if (schedule?.isUse) {
                    return (
                        <>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                            <p style={{ margin: 0 }}>{schedule.lecturerResponse?.fullName}</p>
                        </>
                    )
                } else {
                    return null
                }
            }
        },
        {
            title: '14:15 - 16:15',
            render: (_, record) => {
                const schedule = record.schedules?.filter((schedule) => schedule.startTime === "14:15")?.[0]
                if (schedule?.isUse) {
                    return (
                        <>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                            <p style={{ margin: 0 }}>{schedule.lecturerResponse?.fullName}</p>
                        </>
                    )
                } else {
                    return null
                }
            }
        },
        {
            title: '16:30 - 18:30',
            render: (_, record) => {
                const schedule = record.schedules?.filter((schedule) => schedule.startTime === "16:30")?.[0]
                if (schedule?.isUse) {
                    return (
                        <>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                            <p style={{ margin: 0 }}>{schedule.lecturerResponse?.fullName}</p>
                        </>
                    )
                } else {
                    return null
                }
            }
        },
        {
            title: '19:00 - 21:00',
            render: (_, record) => {
                const schedule = record.schedules?.filter((schedule) => schedule.startTime === "19:00")?.[0]
                if (schedule?.isUse) {
                    return (
                        <>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                            <p style={{ margin: 0 }}>{schedule.lecturerResponse?.fullName}</p>
                        </>
                    )
                } else {
                    return null
                }
            }
        },
    ];
    const weeklyColumns = [
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
                const schedules = record.rooms?.filter((room) => {
                    const dateA = startOfWeek(new Date(date), { locale: viLocale })
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(room.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.lecturerName}</p>
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
                const schedules = record.rooms?.filter((room) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(room.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.lecturerName}</p>
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
                const schedules = record.rooms?.filter((room) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 2 * 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(room.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.lecturerName}</p>
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
                const schedules = record.rooms?.filter((room) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 3 * 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(room.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.lecturerName}</p>
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
                const schedules = record.rooms?.filter((room) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 4 * 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(room.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.lecturerName}</p>
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
                const schedules = record.rooms?.filter((room) => {
                    const dateA = new Date(new Date(startOfWeek(new Date(date), { locale: viLocale })).getTime() + 5 * 24 * 60 * 60 * 1000)
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(room.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.lecturerName}</p>
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
                const schedules = record.rooms?.filter((room) => {
                    const dateA = endOfWeek(new Date(date), { locale: viLocale })
                    dateA.setHours(0, 0, 0, 0)
                    const dateB = new Date(room.date)
                    dateB.setHours(0, 0, 0, 0)
                    return compareAsc(dateA, dateB) === 0
                })
                if (schedules) {
                    return (
                        <>
                            {schedules.map(schedule => (
                                <>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{schedule.classCode}</p>
                                    <p style={{ margin: 0 }}>{schedule.lecturerName}</p>
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
            <h2 className={styles.title}>Quản lý phòng học</h2>
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
                    defaultActiveKey={tab}
                    type="card"
                    size="middle"
                    tabPosition='top'
                    onChange={activeKey => setTab(activeKey)}
                    items={[
                        {
                            label: "Ngày",
                            key: "daily",
                            children: (
                                <>
                                    <div style={{ display: 'flex', marginBottom: '16px', gap: 10 }}>
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    DatePicker: {
                                                        activeBorderColor: '#f2c955'
                                                    },
                                                },
                                            }}>
                                            <DatePicker
                                                value={dailyDate}
                                                format={'DD/MM/YYYY'}
                                                allowClear={false}
                                                className={styles.input}
                                                onChange={(date) => setDailyDate(date)}
                                                placeholder="Chọn thời gian" />
                                        </ConfigProvider>
                                        <Search className={styles.searchBar} placeholder="Tìm kiếm mã lớp, tên giáo viên" onSearch={(value, e) => { setSearch(value) }} enterButton />
                                    </div>
                                    {<Table
                                        columns={columns}
                                        rowKey={(record) => record.name}
                                        dataSource={dailySchedules}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                        scroll={{ y: 'calc(100vh - 220px)' }}
                                    />}
                                </>
                            )
                        },
                        {
                            label: "Tuần",
                            key: "weekly",
                            children: (
                                <>
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
                                                picker={"week"}
                                                format={`${formatDate(startOfWeek(new Date(date), { locale: viLocale }))} ~ ${formatDate(endOfWeek(new Date(date), { locale: viLocale }))}`}
                                                allowClear={false}
                                                className={styles.input}
                                                onChange={(date) => setDate(date)}
                                                placeholder="Chọn thời gian" />
                                        </ConfigProvider>
                                        <Select
                                            style={{ width: '100%', marginLeft: 10 }}
                                            showSearch
                                            value={room}
                                            suffixIcon={null}
                                            filterOption={false}
                                            className={styles.input}
                                            placeholder="Phòng học"
                                            onSelect={(data) => { setRoom(data) }}
                                            notFoundContent={
                                                <Empty
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    description={
                                                        <span>
                                                            Không tìm thấy phòng học
                                                        </span>
                                                    } />
                                            }
                                            options={roomsOptions.map((room) => ({
                                                value: room.name,
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
                                    </div>
                                    {
                                        room
                                            ? <Table
                                                columns={weeklyColumns}
                                                rowKey={(record) => record.startTime}
                                                dataSource={schedules}
                                                pagination={null}
                                                loading={loading}
                                                onChange={handleTableChange}
                                                scroll={{ y: 'calc(100vh - 220px)' }}
                                            />
                                            : <h5 style={{ textAlign: 'center', fontSize: '1.2rem' }}>Vui lòng chọn phòng học</h5>
                                    }
                                </>
                            )
                        },
                    ]}
                />
            </ConfigProvider>
        </div >
    )
}
