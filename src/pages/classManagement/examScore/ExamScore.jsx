import React, { useEffect, useState } from 'react'
import styles from './ExamScore.module.css'
import { Button, Input, Table, Avatar, Checkbox, ConfigProvider, Row, Col } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatPhone } from '../../../utils/utils';
import { getListStudentScore, saveStudentScore } from '../../../api/student';
import { getClass } from '../../../api/classesApi';

const { Search } = Input;

export default function ExamScore() {
    const navigate = useNavigate()
    const [apiLoading, setApiLoading] = useState(false);
    const [studentScoreList, setStudentScoreList] = useState([])
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [classData, setClassData] = useState(null);
    const [examData, setExamData] = useState(null);
    const [missingScores, setMissingScores] = useState([]);
    const params = useParams();
    const classId = params.classId;
    const examId = params.examId;
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setStudentScoreList([]);
        }
    };
    const onInputChange = (value, studentId) => {
        const newList = [...studentScoreList];
        newList.map((list) => {
            if (studentId === list.studentInfor.studentId) {
                list.examInfors[0].scoreEarned = value;
                setStudentScoreList(newList)
            }
        })
    }
    const handleSaveStudentScore = async (e) => {
        const missingScoresList = studentScoreList.filter(student => student.examInfors[0]?.scoreEarned === null || student.examInfors[0]?.scoreEarned === undefined);
        if (missingScoresList.length > 0) {
            setMissingScores(missingScoresList);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Thêm lớp học thất bại",
                text: `Vui lòng nhập điểm cho học viên ${missingScoresList.map((missScore) => " " + missScore.studentInfor.fullName)}`,
                showConfirmButton: false,
            })
        } else {
            setMissingScores([])
            try {
                setApiLoading(true);
                const newList = studentScoreList.map((list) => ({
                    studentId: list.studentInfor.studentId,
                    score: list.examInfors[0].scoreEarned,
                    status: list.examInfors[0].examStatus,
                }))
                await saveStudentScore(classId, examId, newList)
                    .then(() =>
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Lưu điểm thành công",
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
                }).then(() => {
                    getListStudentScore(classId, examId)
                })
            } finally {
                setApiLoading(false)
            }
        }
    }
    async function getListOfStudents(classId, examId) {
        try {
            setLoading(true);
            const data = await getListStudentScore(classId, examId);
            setStudentScoreList(data);
            setExamData(data[0]?.examInfors[0]);
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
    async function getClassDetail(id) {
        const data = await getClass(id);
        setClassData(data);
    }
    useEffect(() => {
        getClassDetail(classId)
        getListOfStudents(classId, examId)
    }, [classId, examId])
    const studentsColumn = [
        {
            title: 'Học viên',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Avatar size={64} src={record.studentInfor.avatarImage} />
                    <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>{record.studentInfor.fullName}</p>
                </div>
            )
        },
        {
            title: 'Phụ huynh',
            render: (_, record) => (record.parentInfor.fullName)
        },
        {
            title: 'Số điện thoại',
            render: (_, record) => (record.parentInfor?.phone && formatPhone(record.parentInfor.phone))
        },
        {
            title: 'Số điểm',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Input
                        status={missingScores.some(student => student.studentInfor.studentId === record.studentInfor.studentId) && "error"}
                        placeholder="Số điểm"
                        name='score'
                        type='number'
                        step={0.1}
                        min={1}
                        max={10}
                        value={record.examInfors[0]?.scoreEarned}
                        onChange={(e) => onInputChange(e.target.value, record.studentInfor.studentId)}
                        className={styles.input}
                        required
                        disabled={apiLoading}
                    />
                    {missingScores.some(student => student.studentInfor.studentId === record.studentInfor.studentId) &&
                        <p style={{ fontWeight: 'bold', fontSize: '1rem', color: 'red', margin: '0' }}>* </p>}
                </div>
            )
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Điểm kiểm tra</h2>
            {classData && examData && (
                <>
                    <Row>
                        <Col span={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Thông tin lớp học</h5>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Tên khóa học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.courseResponse.name}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Mã lớp học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.classCode}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Ngày bắt đầu:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData && `${formatDate(classData.startDate)}`}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Số lượng học viên:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{classData.numberStudentRegistered}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col span={12} style={{ marginBottom: '40px' }}>
                            <div className={styles.classPart}>
                                <h5 className={styles.classPartTitle}>Bài kiểm tra</h5>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Loại:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{examData.quizCategory}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Tiêu đề:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{examData.examName}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Trọng số:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{examData.weight}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.classTitle}>Ngày làm bài:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.classDetail}>{examData.doingDate}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
            <Table
                columns={studentsColumn}
                rowKey={(record) => record.studentInfor.studentId}
                dataSource={studentScoreList}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button loading={apiLoading} onClick={handleSaveStudentScore} className={styles.saveButton}>
                    Lưu
                </Button>
                <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                    Hủy
                </Button>
            </div>
        </div >
    )
}
