import React, { useState, useEffect } from 'react'
import styles from './RoomManagement.module.css'
import { Calendar, ConfigProvider, DatePicker, Empty, Input, Select, Spin, Table, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getRoomDailySchedule, getRoomSchedule } from '../../api/room';
import { getRooms, getSlots } from '../../api/classesApi';
import dayjs from 'dayjs';

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
            setSchedules(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    async function getListsOfDailySchedule(date) {
        try {
            setLoading(true);
            const data = await getRoomDailySchedule({ date });
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
        if (tab === "monthly") {
            getListsOfSchedule(room, startOfMonth(new Date(date)), endOfMonth(new Date(date)));
        } else {
            getListsOfDailySchedule(dailyDate)
        }
    }, [tab, room, date, dailyDate]);
    function startOfWeek(date) {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    }
    function endOfWeek(date) {
        var lastday = date.getDate() - (date.getDay() - 1) + 6;
        return new Date(date.setDate(lastday));
    }
    function endOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    function startOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
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
            render: (_, record) => {
                return `${record.name}`
            },
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
    const timeColors = {
        '7:00': '#3E618D',
        '9:15': '#C83D64',
        '12:00': '#FFB100',
        '14:15': '#507E31',
        '16:30': '#865FAB',
        '19:00': '#FF782D'
    };

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
                            label: "Ngày học",
                            key: "daily",
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
                                                value={dailyDate}
                                                format={'DD/MM/YYYY'}
                                                allowClear={false}
                                                className={styles.input}
                                                onChange={(date) => setDailyDate(date)}
                                                placeholder="Chọn thời gian" />
                                        </ConfigProvider>
                                    </div>
                                    {
                                        loading ?
                                            <div style={{ textAlign: 'center' }}>
                                                <Spin />
                                            </div>
                                            : dailySchedules.length > 0
                                            && <Table
                                                columns={columns}
                                                rowKey={(record) => record.name}
                                                dataSource={dailySchedules}
                                                pagination={tableParams.pagination}
                                                loading={loading}
                                                onChange={handleTableChange}
                                                scroll={{ y: 'calc(100vh - 220px)' }}
                                            />
                                    }
                                </>
                            )
                        },
                        {
                            label: "Phòng học",
                            key: "monthly",
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
                                                picker={"month"}
                                                format={'MM/YYYY'}
                                                allowClear={false}
                                                className={styles.input}
                                                onChange={(date) => setDate(date)}
                                                placeholder="Chọn thời gian" />
                                        </ConfigProvider>
                                        <Select
                                            allowClear
                                            onClear={(data) => { setRoom(null) }}
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
                                        loading ?
                                            <div style={{ textAlign: 'center' }}>
                                                <Spin />
                                            </div> : room && schedules.length > 0 ?
                                                <Calendar
                                                    value={date}
                                                    cellRender={(value) => {
                                                        const schedulesOnThisDay = schedules.filter(schedule => {
                                                            const date = new Date(schedule.date).setHours(0, 0, 0, 0)
                                                            const valueDate = new Date(value).setHours(0, 0, 0, 0)
                                                            return date === valueDate
                                                        });
                                                        return (
                                                            <ul>
                                                                {schedulesOnThisDay.map((schedule, index) => (
                                                                    <li key={index} style={{ color: timeColors[schedule.startTime] }}>{schedule.classCode}: <br />{schedule.startTime} - {schedule.endTime}</li>
                                                                ))}
                                                            </ul>
                                                        );
                                                    }}
                                                    headerRender={() => { <></> }}
                                                    onSelect={(date) => setDate(date)}
                                                />
                                                : <p> Vui lòng chọn phòng học cần tìm</p>
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
