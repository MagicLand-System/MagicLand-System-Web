import React, { useState, useEffect } from 'react'
import styles from './CourseRegister.module.css'
import { Button, Card, Col, ConfigProvider, Empty, Input, Row, Select, Slider, Spin, Table, Transfer } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCoursesForRegister, getSubjects } from '../../api/courseApi';
import { formatDate } from '../../utils/utils';

const { Search } = Input;
const { Meta } = Card;

export default function CourseRegister() {
    const navigate = useNavigate()
    const [search, setSearch] = useState(null)
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [subjectsOptions, setSubjectsOptions] = useState([]);
    const [findSubjects, setFindSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [age, setAge] = useState([]);

    async function getListsOfCourses(search, findSubjects, age) {
        try {
            setLoading(true);
            const data = await getCoursesForRegister(search, findSubjects, age[0], age[1]);
            setCourses(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    async function getListsOfSubjects() {
        const data = await getSubjects();
        setSubjects(data);
        setSubjectsOptions(data);
    };

    useEffect(() => {
        getListsOfSubjects();
        getListsOfCourses(search, findSubjects, age);
    }, []);
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Đăng kí khóa học</h2>
            <Row>
                <Col span={7} style={{ padding: 20 }}>
                    <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: '30px 20px' }}>
                        <h5 style={{ fontSize: '1.2rem', margin: 0 }}>Tìm khóa học</h5>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={24} >
                                <p className={styles.searchTitle}> Loại khóa học:</p>
                            </Col>
                            <Col span={24}>
                                <Select
                                    mode="multiple"
                                    size='large'
                                    showSearch
                                    value={findSubjects}
                                    suffixIcon={null}
                                    filterOption={false}
                                    className={styles.multiSelect}
                                    placeholder="Loại khóa học"
                                    onChange={(data) => {
                                        setFindSubjects(data)
                                    }}
                                    notFoundContent={
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <span>
                                                    Không tìm thấy loại khóa học
                                                </span>
                                            } />
                                    }
                                    options={
                                        subjectsOptions
                                            .map((subject) => ({
                                                value: subject.id,
                                                label: subject.name,
                                            }))}
                                    onSearch={(value) => {
                                        if (value) {
                                            const filteredOptions = subjects.filter(
                                                (subject) => subject.name.toLowerCase().includes(value?.toLowerCase())
                                                    || subject.name.toLowerCase().includes(value?.toLowerCase())
                                            );
                                            setSubjectsOptions(filteredOptions);
                                        } else {
                                            setSubjectsOptions(subjects);
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 20, marginBottom: 30 }}>
                            <Col span={24} >
                                <p className={styles.searchTitle}>Độ tuổi:</p>
                            </Col>
                            <Col span={24}>
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            Slider: {
                                                controlSize: 30,
                                                dotActiveBorderColor: '#f2c955',
                                                dotBorderColor: '#f2c955',
                                                handleActiveColor: '#f2c955',
                                                handleColor: '#f2c955',
                                                trackBg: '#f2c955',
                                                trackHoverBg: '#f2c955',
                                            },
                                        },
                                    }}
                                >
                                    <Slider tooltip={{ open: true, placement: "bottom", color: 'transparent', overlayInnerStyle: { textAlign: 'center', color: 'black', padding: 0, boxShadow: 'none' } }} value={age} onChange={(value) => setAge(value)} range min={4} max={10} />
                                </ConfigProvider>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            <Col span={24} >
                                <p className={styles.searchTitle}>Tên khóa học:</p>
                            </Col>
                            <Col span={24}>
                                <Input className={styles.input} placeholder="Tìm kiếm khóa học" onChange={(e) => { setSearch(e.target.value) }} />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            <Col span={24}>
                                <Button style={{ width: '100%' }} onClick={() => getListsOfCourses(search, findSubjects, age)} type='primary' className={styles.importButton} icon={<SearchOutlined />}>Tìm kiếm</Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={17}>
                    {loading
                        ? <div style={{ textAlign: 'center' }}>
                            <Spin />
                        </div>
                        : courses.length > 0 ?
                            <Row>
                                {courses.map(course => (
                                    <Col span={8} key={course.id}>
                                        <Card
                                            hoverable
                                            style={{ width: "calc(100% - 10px)", margin: "20px 0" }}
                                            cover={<img alt="course image" src={course.image} style={{ aspectRatio: '8/5' }} />}
                                            onClick={() => navigate(`detail/${course.id}`)}
                                        >
                                            <Meta title={course.name} description={
                                                <>
                                                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Loại khóa học:&ensp;</span>{course.subjectName}</p>
                                                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Độ tuổi phù hợp:&ensp;</span>{course.minYearOldsStudent} - {course.maxYearOldsStudent} tuổi</p>
                                                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Ngày mở lớp gần nhất:&ensp;</span>{course.earliestClassTime && formatDate(course.earliestClassTime)}</p>
                                                </>
                                            } />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            : <h5 style={{ textAlign: 'center', fontSize: '1.2rem' }}>Không có khóa học phù hợp</h5>
                    }
                </Col>
            </Row>
        </div >
    )
}
