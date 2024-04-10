import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getCourse, getCourseClasses } from '../../../api/courseApi';
import { getSyllabus, getSyllabusSession } from '../../../api/syllabus';
import { Button, Checkbox, Col, ConfigProvider, Row, Select, Table, Tabs } from 'antd';
import styles from './CourseRegisterDetail.module.css'
import { PlusOutlined } from '@ant-design/icons';
import { formatDate, formatDayOfWeek, formatSlot } from '../../../utils/utils';
import Swal from 'sweetalert2';
import { getSlots } from '../../../api/classesApi';
import { compareAsc } from 'date-fns';

export default function CourseRegisterDetail() {
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate()
    const [courseData, setCourseData] = useState(null);

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [classId, setClassId] = useState(null);
    const [dateOfWeeks, setDateOfWeeks] = useState([]);
    const [slots, setSlots] = useState([])
    const [method, setMethod] = useState(null)
    const [findSlots, setFindSlots] = useState([])
    const [syllabusId, setSyllabusId] = useState(null)
    const [tabActive, setTabActive] = useState('syllabus')
    const [tableSyllabusParams, setTableSyllabusParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    })
    const [syllabusLoading, setSyllabusLoading] = useState(true)
    const [sessions, setSessions] = useState([])
    async function getSession(id) {
        try {
            setSyllabusLoading(true)
            const data = await getSyllabusSession(id);
            setSessions(data);
            setTableSyllabusParams({
                ...tableSyllabusParams,
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: data?.length
                },
            })
        } catch (error) {
            console.log(error)
        } finally {
            setSyllabusLoading(false)
        }
    }

    async function getCourseDetail(id) {
        const data = await getCourse(id);
        setSyllabusId(data?.syllabusId)
        setCourseData(data);
    }
    async function getClasses(id, dateOfWeeks, slotId, method) {
        try {
            setLoading(true);
            const data = await getCourseClasses(id, dateOfWeeks, slotId, method);
            setClasses(data);
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
            setLoading(false)
        }
    }
    async function getListsOfSlots() {
        const data = await getSlots();
        data?.sort((a, b) => {
            const timeA = formatSlot(a.startTime);
            const timeB = formatSlot(b.startTime);
            return compareAsc(timeA, timeB);
        })
        setSlots(data);
    };
    useEffect(() => {
        getListsOfSlots()
    }, [])
    useEffect(() => {
        if (syllabusId) {
            getSession(syllabusId)
        }
    }, [syllabusId])
    useEffect(() => {
        getCourseDetail(id)
        getClasses(id, dateOfWeeks, findSlots, method)
    }, [id])
    useEffect(() => {
        getClasses(id, dateOfWeeks, findSlots, method)
    }, [dateOfWeeks, findSlots, method])
    const handleTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setClasses([]);
        }
    };
    const handleSyllabusTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableSyllabusParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableSyllabusParams.pagination?.pageSize) {
            setSessions([]);
        }
    };
    const syllabusColumns = [
        {
            title: 'Buổi',
            render: (record) => record.orderSession,
            sorter: (a, b) => a.orderSession - b.orderSession,
            width: 80
        },
        {
            title: 'Chủ đề',
            render: (record) => `${record.orderTopic}. ${record.topicName}`,
        },
        {
            title: 'Nội dung buổi học',
            render: (record) => (
                <>
                    {record.contents.map((content, index) => (
                        <div key={index}>
                            <p style={{ margin: 0 }}> {content.content}:</p>
                            {content.details.map((detail) => <p style={{ margin: 0 }}>&emsp;-&nbsp;{detail}</p>)}
                        </div>
                    ))}
                </>
            ),
        },
    ];
    const columns = [
        {
            render: (_, record) => (
                <Checkbox checked={record.classId === classId} value={record.classId} onChange={(e) => { setClassId(e.target.value) }} />
            ),
            width: 120,
        },
        {
            title: 'Lịch học',
            dataIndex: 'schedules',
            render: (schedules) => (
                <>
                    {schedules.map((session, index) => (
                        <p style={{ margin: 0 }} key={index}>
                            {session.dayOfWeek && formatDayOfWeek(session.dayOfWeek)}:&ensp;{session.startTime} - {session.endTime}
                        </p>
                    ))}
                </>
            )
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (startDate) => startDate && formatDate(startDate)
        },
        {
            title: 'Hình thức',
            dataIndex: 'method',
            render: (method) => {
                if (method.toLowerCase() === 'online') {
                    return <div style={{ backgroundColor: '#d4edda', color: '#155724' }} className={styles.status}>Online</div>
                } else if (method.toLowerCase() === 'offline') {
                    return <div style={{ backgroundColor: '#f8d7da', color: '#dc3545' }} className={styles.status}>Offline</div>
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
            onFilter: (value, record) => record.method.toLowerCase() === value,
        },
        {
            title: 'Số học viên đã đăng kí',
            dataIndex: 'numberOfStudentsRegister',
        }
    ];
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Chi tiết khóa học</h2>
            {courseData && (
                <>
                    <Row>
                        <Col xs={24} lg={8} style={{ marginBottom: '20px', boxSizing: 'border-box', padding: '0px 8px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Hình ảnh</h5>
                                <img style={{ width: '100%' }} src={courseData.image} alt="Hình ảnh" />
                            </div>
                        </Col>
                        <Col xs={24} lg={8} style={{ marginBottom: '20px', boxSizing: 'border-box', padding: '0px 8px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Thông tin khóa học</h5>
                                <Row style={{ marginTop: 12 }}>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Tên khóa học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{courseData.name}</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 12 }}>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Loại:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{courseData.subjectName}</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 12 }}>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Độ tuổi phù hợp:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{courseData.minYearOldsStudent} - {courseData.maxYearOldsStudent}</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 12 }}>
                                    <Col span={16}>
                                        <p className={styles.classTitle}>Chi phí:</p>
                                    </Col>
                                    <Col span={8}>
                                        <p className={styles.classDetail}>{courseData.price.toLocaleString()}đ</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 12 }}>
                                    <Col span={24}>
                                        <p className={styles.classTitle}>Mô tả chính:</p>
                                    </Col>
                                    <Col span={24}>
                                        <p className={styles.classDetail} style={{ textAlign: 'left' }}>{courseData.mainDescription}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col xs={24} lg={8} style={{ marginBottom: '20px', boxSizing: 'border-box', padding: '0px 8px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Mô tả chi tiết</h5>
                                {courseData.subDescriptionTitles?.map((subDes, index) =>
                                    <Row key={index} style={{ marginTop: 12 }}>
                                        <Col span={24}>
                                            <h3 style={{ margin: 0 }}>{subDes.title}</h3>
                                        </Col>
                                        {subDes.contents?.map((subCont, subIndex) =>
                                            <Col key={subIndex} span={24}>
                                                <p className={styles.classDetail} style={{ textAlign: 'left' }}><span className={styles.classTitle}>- {subCont.content}: </span>{subCont.description}</p>
                                            </Col>)}
                                    </Row>
                                )}
                            </div>
                        </Col>
                    </Row>
                </>
            )}
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
                    defaultActiveKey={tabActive}
                    type="card"
                    size="middle"
                    tabPosition='top'
                    onChange={activeKey => { setTabActive(activeKey) }}
                    items={[
                        {
                            label: 'Giáo trình',
                            key: 'syllabus',
                            children: (
                                <Table
                                    loading={syllabusLoading}
                                    columns={syllabusColumns}
                                    rowKey={(record) => record.sessionId}
                                    dataSource={sessions}
                                    pagination={tableSyllabusParams.pagination}
                                    onChange={handleSyllabusTableChange}
                                    scroll={{ y: 'calc(100vh - 220px)' }}
                                />
                            )
                        },
                        {
                            label: 'Lớp học',
                            key: 'classes',
                            children: (
                                <>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <Select
                                            mode="multiple"
                                            size='large'
                                            className={styles.multiSelect}
                                            placeholder="Ngày học"
                                            value={dateOfWeeks}
                                            onChange={(value) => setDateOfWeeks(value)}
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
                                        <Select
                                            mode="multiple"
                                            size='large'
                                            className={styles.multiSelect}
                                            value={findSlots}
                                            placeholder="Giờ học"
                                            onChange={(value) => setFindSlots(value)}
                                            options={slots.map((slot) => ({
                                                value: slot.id,
                                                label: `${slot.startTime} - ${slot.endTime}`
                                            }))
                                            }
                                        />
                                        <Select
                                            allowClear
                                            className={styles.input}
                                            placeholder="Hình thức"
                                            value={method}
                                            onChange={(value) => setMethod(value)}
                                            options={[
                                                {
                                                    value: 'offline',
                                                    label: 'Offline',
                                                },
                                                {
                                                    value: 'online',
                                                    label: 'Online',
                                                },
                                            ]}
                                        />
                                    </div>
                                    <Table
                                        columns={columns}
                                        rowKey={(record) => record.id}
                                        dataSource={classes}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                        scroll={{ y: 'calc(100vh - 220px)' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button onClick={() => {
                                            if (classId) {
                                                navigate('/course-register/register', { state: { courseId: id, classId } })
                                            } else {
                                                Swal.fire({
                                                    position: "center",
                                                    icon: "error",
                                                    title: "Xin hãy chọn lớp muốn đăng kí",
                                                    showConfirmButton: false,
                                                })
                                            }
                                        }} disabled={!classId} type='primary' className={styles.saveButton}>Đăng kí ngay</Button>
                                    </div>
                                </>
                            )
                        }
                    ]}
                />
            </ConfigProvider>
        </div >
    )
}
