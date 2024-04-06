import React, { useState, useEffect, useRef } from 'react'
import styles from './SyllabusDetail.module.css'
import { Button, Table, Row, Col, Tabs, ConfigProvider, Divider, Modal, DatePicker, Input, Select, Empty } from 'antd';
import { EditOutlined, CloudDownloadOutlined, CloudUploadOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { getSyllabus, getSyllabusGeneral, updateSyllabusGeneral, getSyllabusMaterial, getSyllabusExam, getSyllabusSession, getSyllabusQuestion } from '../../../api/syllabus';
import { getQuiz } from '../../../api/quiz';
import { getSubjects } from '../../../api/courseApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'

import TextArea from 'antd/es/input/TextArea';
import Swal from 'sweetalert2';
import { handleImportSyllabus } from '../../../utils/utils';

export default function SyllabusDetail() {
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate()

    const [importModalOpen, setImportModalOpen] = useState(false);
    const [syllabusDetail, setSyllabusDetail] = useState(null);
    const [sessions, setSessions] = useState([])
    const [exams, setExams] = useState([])
    const [questionPackages, setQuestionPackages] = useState([])
    const [materials, setMaterials] = useState([])
    const [tab, setTab] = useState("syllabus");

    const fileInputRef = useRef(null);
    const [fileInput, setFileInput] = useState(null);
    const [excelFile, setExcelFile] = useState(null);

    const [flashcardList, setFlashCardList] = useState([]);
    const [multipleChoiceList, setMultipleChoiceList] = useState([]);
    const [questionListType, setQuestionListType] = useState(null);
    const [questionModalOpen, setQuestionModalOpen] = useState(false);
    const [tableQuestionParams, setTableQuestionParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesOptions, setCategoriesOptions] = useState(categories);

    const [category, setCategory] = useState(null)
    const [categoryError, setCategoryError] = useState(null)

    const [effectiveDate, setEffectiveDate] = useState(null);
    const [effectiveDateError, setEffectiveDateError] = useState(null)
    const [apiLoading, setApiLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            syllabusName: "",
            minAvgMarkToPass: 0,
            studentTasks: null,
            description: null,
        },
        onSubmit: async values => {
            if (!effectiveDate || !category) {
                if (effectiveDate === null) {
                    setEffectiveDateError("Vui lòng nhập ngày hiệu lực")
                } else {
                    setEffectiveDateError(null)
                }
                if (category === null) {
                    setCategoryError("Vui lòng nhập phòng học")
                } else {
                    setCategoryError(null)
                }
            } else {
                setEffectiveDateError(null)
                setCategoryError(null)
                try {
                    setApiLoading(true)
                    const formatEffectiveDate = dayjs(effectiveDate).format('DD/MM/YYYY');
                    await updateSyllabusGeneral(id, { ...values, effectiveDate: formatEffectiveDate, type: category })
                        .then(() => {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Chỉnh sửa giáo trình thành công",
                                showConfirmButton: false,
                                timer: 2000
                            })
                        })
                        .then(() => {
                            getSyllabusDetail(id)
                            setEditModalOpen(false)
                            setCategory(null)
                            setCategoriesOptions(categories)
                            setEffectiveDate(null)
                            formik.resetForm()
                        })
                } catch (error) {
                    console.log(error)
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: error.response?.data?.Error,
                        showConfirmButton: false,
                    })
                } finally {
                    setApiLoading(false)
                }
            }
        },
        validationSchema: Yup.object({
            syllabusName: Yup.string().required("Vui lòng điền tên khóa học"),
            minAvgMarkToPass: Yup.number().required("Vui lòng điền số điểm hoàn thành").min(0, "Số điểm hoàn thành ít nhất là 0"),
            studentTasks: Yup.string().required("Vui lòng điền nhiệm vụ học sinh"),
            description: Yup.string().required("Vui lòng điền mô tả"),
        }),
    });
    useEffect(() => {
        getListOfCategory()
    }, [])
    useEffect(() => {
        getSyllabusDetail(id)
    }, [id])
    useEffect(() => {
        switch (tab) {
            case "syllabus":
                getSession(id)
                break;
            case "assessment":
                getExam(id)
                break;
            case "exercise":
                getQuestion(id)
                break;
            case "material":
                getMaterial(id)
                break;
        }
    }, [tab])
    async function getSyllabusDetail(id) {
        const data = await getSyllabusGeneral(id);
        setSyllabusDetail(data);
        setCategory(data.category);
        setEffectiveDate(dayjs(data.effectiveDate, 'DD/MM/YYYY'));
        formik.setValues({
            syllabusName: data.syllabusName,
            minAvgMarkToPass: data.minAvgMarkToPass,
            studentTasks: data.studentTasks,
            description: data.description
        })
    }
    async function getMaterial(id) {
        const data = await getSyllabusMaterial(id);
        setMaterials(data);
        setTableParams({
            ...tableParams,
            pagination: {
                current: 1,
                pageSize: 10,
                total: data?.length
            },
        });
    }
    async function getExam(id) {
        const data = await getSyllabusExam(id);
        setExams(data);
        setTableParams({
            ...tableParams,
            pagination: {
                current: 1,
                pageSize: 10,
                total: data?.length
            },
        });
    }
    async function getSession(id) {
        const data = await getSyllabusSession(id);
        setSessions(data);
        setTableParams({
            ...tableParams,
            pagination: {
                current: 1,
                pageSize: 10,
                total: data?.length
            },
        });
    }
    async function getQuestion(id) {
        const data = await getSyllabusQuestion(id);
        setQuestionPackages(data);
        setTableParams({
            ...tableParams,
            pagination: {
                current: 1,
                pageSize: 10,
                total: data?.length
            },
        });
    }
    async function getListOfCategory() {
        const data = await getSubjects();
        setCategories(data);
        setCategoriesOptions(data);
    };

    function transformFlashCardData(inputData) {
        let transformedData = [];
        inputData.forEach(item => {
            const { questionId, description, staffAnswerResponse } = item;
            const questionsLength = staffAnswerResponse.flashCardAnswerResponses.length;
            staffAnswerResponse.flashCardAnswerResponses.forEach((response, index) => {
                transformedData.push({
                    answerIndex: index,
                    questionsLength: questionsLength,
                    questionId: questionId,
                    description: description,
                    flashCardId: response.flashCarId,
                    score: response.score,
                    sideFlashCardResponses: response.sideFlashCardResponses
                });
            });
        });
        return transformedData;
    }
    async function getQuesionList(id, type) {
        setQuestionModalOpen(false)
        setQuestionListType(type)
        const data = await getQuiz(id);
        if (data) {
            if (type === 'flashcard') {
                const newData = transformFlashCardData(data)
                setFlashCardList(newData)
                setTableQuestionParams({
                    pagination: {
                        current: 1,
                        pageSize: 10,
                        total: newData.length
                    },
                });
            } else {
                setMultipleChoiceList(data)
                setTableQuestionParams({
                    pagination: {
                        current: 1,
                        pageSize: 10,
                        total: data.length
                    },
                });
            }
            setQuestionModalOpen(true)
        }
    }
    const handleTableQuestionChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableQuestionParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setFlashCardList([]);
            setMultipleChoiceList([])
        }
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (excelFile !== null) {
            setApiLoading(true)
            const syllabusDetail = await handleImportSyllabus(excelFile, fileInput)
            if (syllabusDetail) {
                navigate(`/syllabus-management/update-syllabus/${id}`, { state: { syllabusDetail } })
            }
        }
        setApiLoading(false)
    }
    const handleFileChange = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            setFileInput(selectedFile)
            let reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile)
            reader.onload = (e) => {
                setExcelFile(e.target.result)
            }
        } else {
            setFileInput(null)
            setExcelFile(null)
        }
    }
    const handleTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
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
    const assessmentColumns = [
        {
            title: 'Loại',
            dataIndex: 'type',
        },
        {
            title: 'Nội dung',
            dataIndex: 'contentName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'part',
        },
        {
            title: 'Trọng số',
            dataIndex: 'weight',
            render: (weight) => `${weight}%`,
        },
        {
            title: 'Điểm tối thiểu',
            dataIndex: 'completionCriteria',
        },
        {
            title: 'Phương thức',
            dataIndex: 'method',
        },
        {
            title: 'Thời gian',
            dataIndex: 'duration',
        },
        {
            title: 'Loại câu hỏi',
            dataIndex: 'questionType',
            render: (questionType) => questionType?.split("\r\n").map((question, index) => <p style={{ margin: 0 }} key={index}>{question}</p>),
        },
    ];
    const exerciseColumns = [
        {
            title: 'Loại bài tập',
            dataIndex: 'contentName',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
        },
        {
            title: 'Dạng bài',
            dataIndex: 'type',
            render: (text) => text ? text === 'flashcard' ? 'Ghép thẻ' : text === 'multiple-choice' && 'Trắc nghiệm' : 'Chưa có',
        },
        {
            title: 'Buổi học',
            dataIndex: 'noOfSession',
        },
        {
            title: 'Tổng điểm',
            dataIndex: 'score'
        },
        {
            title: 'Thao tác',
            dataIndex: 'questionRequests',
            render: (text, record, index) =>
            (<>
                <Button type='link' onClick={() => getQuesionList(record.questionPackageId, record.type)} icon={<EyeOutlined />} size='large' />
                {/* <Button type='link' onClick={() => console.log('update')} icon={<EditOutlined />} size='large' /> */}
            </>)
        },
    ];

    const materialColumns = [
        {
            title: 'STT',
            render: (record, _, index) => ++index,
            width: 120
        },
        {
            title: 'Tên tài liệu',
            render: (record, _, index) => record.fileName
        },
        {
            title: 'Link tài liệu',
            render: (record, _, index) => <a href={record.url} target="_blank" key={index}>{record.url}</a>
        },
    ]
    const multipleChoiceColumns = [
        {
            title: 'STT',
            render: (record, _, index) => ++index,
            width: 60
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'description'
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'questionImg',
            render: (text) => { if (text) return <img style={{ width: 100 }} src={text} alt="Hình ảnh" /> }
        },
        {
            title: 'Đáp án 1',
            render: (record) =>
                record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[0]?.answer ?
                    record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[0]?.answer :
                    record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[0]?.answerImage &&
                    <img style={{ width: 100 }} src={record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[0]?.answerImage} alt="Hình ảnh" />
        },
        {
            title: 'Số điểm 1',
            render: (record) => record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[0]?.score
        },
        {
            title: 'Đáp án 2',
            render: (record) =>
                record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[1]?.answer ?
                    record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[1]?.answer :
                    record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[1]?.answerImage &&
                    <img style={{ width: 100 }} src={record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[1]?.answerImage} alt="Hình ảnh" />
        },
        {
            title: 'Số điểm 2',
            render: (record) => record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[1]?.score
        },
        {
            title: 'Đáp án 3',
            render: (record) =>
                record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[2]?.answer ?
                    record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[2]?.answer :
                    record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[2]?.answerImage &&
                    <img style={{ width: 100 }} src={record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[2]?.answerImage} alt="Hình ảnh" />
        },
        {
            title: 'Số điểm 3',
            render: (record) => record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[2]?.score
        },
        {
            title: 'Đáp án 4',
            render: (record) =>
                record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[3]?.answer ?
                    record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[3]?.answer :
                    record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[3]?.answerImage &&
                    <img style={{ width: 100 }} src={record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[3]?.answerImage} alt="Hình ảnh" />
        },
        {
            title: 'Số điểm 4',
            render: (record) => record.staffAnswerResponse?.staffMultiplechoiceAnswerResponses[3]?.score
        },
    ]
    const flashcardColumns = [
        {
            title: 'Câu hỏi',
            render: (record) => record.description,
            onCell: (record) => ({
                rowSpan: record.answerIndex % record.questionsLength === 0 ? record.questionsLength : 0,
            }),
        },
        {
            title: 'Thẻ 1',
            render: (record) => {
                if (record.sideFlashCardResponses[0]?.sideFlashCardDescription) {
                    return record.sideFlashCardResponses[0]?.sideFlashCardDescription
                } else {
                    return (<img style={{ width: 100 }} src={record.sideFlashCardResponses[0]?.sideFlashCardImage} alt='Thẻ 1' />)
                }
            }
        },
        {
            title: 'Thẻ 2',
            render: (record) => {
                if (record.sideFlashCardResponses[1]?.sideFlashCardDescription) {
                    return record.sideFlashCardResponses[1]?.sideFlashCardDescription
                } else {
                    return (<img style={{ width: 100 }} src={record.sideFlashCardResponses[1]?.sideFlashCardImage} alt='Thẻ 1' />)
                }
            }
        },
        {
            title: 'Số điểm',
            render: (record) => record.score
        },
    ]
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Chi tiết giáo trình</h2>
            {syllabusDetail && (
                <Row style={{ marginBottom: 20 }}>
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Tên khóa học:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail?.linkedCourse?.courseName ? syllabusDetail?.linkedCourse.courseName : 'Chưa có'}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Tên giáo trình:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail?.syllabusName}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Loại:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail?.category}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Mã giáo trình:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail?.subjectCode}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Thời gian:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>1 khóa học = {syllabusDetail?.numOfSessions} buổi</p>
                        <p className={styles.syllabusDetail}>1 buổi = {syllabusDetail?.timePerSession}'</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Điều kiện tiên quyết:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        {syllabusDetail?.preRequisite?.map(pre => <p className={styles.syllabusDetail}>{pre}</p>)}
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Mô tả:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail?.description}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Nhiệm vụ của học sinh:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail?.studentTasks}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Thang điểm:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail?.scoringScale}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Ngày hiệu lực:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail?.effectiveDate}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Số điểm hoàn thành:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail?.minAvgMarkToPass}</p>
                    </Col>
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Tệp giáo trình:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <a href={syllabusDetail?.syllabusLink} target="_blank" className={styles.syllabusDetail}>Tải tại đây</a>
                    </Col>
                </Row>
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
                    defaultActiveKey={tab}
                    type="card"
                    size="middle"
                    tabPosition='top'
                    onChange={activeKey => { setTab(activeKey) }}
                    tabBarExtraContent={
                        <>
                            <Button onClick={() => setEditModalOpen(true)} className={styles.saveButton}>
                                Chỉnh sửa thông tin
                            </Button>
                            <Button onClick={() => setImportModalOpen(true)} className={styles.cancelButton}>
                                Cập nhật giáo trình
                            </Button>
                        </>
                    }
                    items={[
                        {
                            label: 'Giáo trình',
                            key: 'syllabus',
                            children: (
                                <Table
                                    columns={syllabusColumns}
                                    rowKey={(record) => record.sessionId}
                                    dataSource={sessions}
                                    pagination={tableParams.pagination}
                                    onChange={handleTableChange}
                                    scroll={{ y: 'calc(100vh - 220px)' }}
                                />
                            )
                        },
                        {
                            label: 'Đánh giá',
                            key: 'assessment',
                            children: (
                                <Table
                                    columns={assessmentColumns}
                                    rowKey={(record) => record.examSyllabusId}
                                    dataSource={exams}
                                    pagination={tableParams.pagination}
                                    onChange={handleTableChange}
                                    scroll={{ y: 'calc(100vh - 220px)' }}
                                />
                            )
                        },
                        {
                            label: 'Bài tập',
                            key: 'exercise',
                            children: (
                                <Table
                                    columns={exerciseColumns}
                                    rowKey={(record) => record.questionPackageId}
                                    dataSource={questionPackages}
                                    pagination={tableParams.pagination}
                                    onChange={handleTableChange}
                                    scroll={{ y: 'calc(100vh - 220px)' }}
                                />
                            )
                        },
                        {
                            label: 'Tài liệu',
                            key: 'material',
                            children: (
                                <Table
                                    columns={materialColumns}
                                    rowKey={(record) => record.materialId}
                                    dataSource={materials}
                                    pagination={tableParams.pagination}
                                    onChange={handleTableChange}
                                    scroll={{ y: 'calc(100vh - 220px)' }}
                                />
                            )
                        }
                    ]}
                />
            </ConfigProvider>
            <ConfigProvider
                theme={{
                    components: {
                        Modal: {
                            titleFontSize: '1.2rem',
                        },
                    },
                }}
            >
                <Modal
                    title="Cập nhật giáo trình"
                    centered
                    open={importModalOpen}
                    footer={null}
                    onCancel={() => setImportModalOpen(false)}
                    classNames={{ header: styles.modalHeader }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button className={styles.addButton} icon={<CloudDownloadOutlined />} onClick={() => handleDownloadExcelFile(TEMPLATE_ADD_SYLLABUS_FILE, 'Mau-tao-giao-trinh.xlsx')} >Tải mẫu lớp học</Button>
                        <Button type='primary' className={styles.importButton} icon={<CloudUploadOutlined />} onClick={() => fileInputRef.current.click()}>Chọn tệp</Button>
                        <input accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' type='file' style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
                        <p>{fileInput ? fileInput.name : 'Chưa có tệp nào được chọn'}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleImport} className={styles.saveButton}>
                            Nạp tập tin
                        </Button>
                        <Button className={styles.cancelButton}
                            onClick={() => {
                                setFileInput(null)
                                setExcelFile(null)
                                setImportModalOpen(false)
                            }}>
                            Hủy
                        </Button>
                    </div>
                </Modal>
            </ConfigProvider>
            <ConfigProvider
                theme={{
                    components: {
                        Modal: {
                            titleFontSize: '1.2rem',
                        },
                    },
                }}
            >
                <Modal
                    title="Danh sách câu hỏi"
                    centered
                    open={questionModalOpen}
                    footer={null}
                    onCancel={() => setQuestionModalOpen(false)}
                    classNames={{ header: styles.modalHeader }}
                    width="80%"
                >
                    <>
                        {questionListType === 'flashcard' ? (
                            <Table
                                columns={flashcardColumns}
                                rowKey={(record) => record.flashCarId}
                                dataSource={flashcardList}
                                pagination={tableQuestionParams.pagination}
                                onChange={handleTableQuestionChange}
                                scroll={{ y: '480px' }}
                            />
                        ) : (
                            <Table
                                columns={multipleChoiceColumns}
                                rowKey={(record) => record.questionId}
                                dataSource={multipleChoiceList}
                                pagination={tableQuestionParams.pagination}
                                onChange={handleTableQuestionChange}
                                scroll={{ y: '480px' }}
                            />
                        )}
                    </>
                </Modal>
            </ConfigProvider>
            <ConfigProvider
                theme={{
                    components: {
                        Modal: {
                            titleFontSize: '1.2rem',
                        },
                    },
                }}
            >
                <Modal
                    title="Chỉnh sửa thông tin"
                    centered
                    open={editModalOpen}
                    footer={null}
                    onCancel={() => setEditModalOpen(false)}
                    classNames={{ header: styles.modalHeader }}
                    width={620}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col span={7}>
                                <p className={styles.addTitle}><span>*</span> Tên giáo trình:</p>
                            </Col>
                            <Col span={17}>
                                <Input
                                    className={styles.input}
                                    placeholder="Tên giáo trình"
                                    name='syllabusName'
                                    value={formik.values.syllabusName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.syllabusName && formik.errors.syllabusName}
                                    required
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.syllabusName && formik.touched.syllabusName && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.syllabusName}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <p className={styles.addTitle}><span>*</span> Loại:</p>
                            </Col>
                            <Col span={17}>
                                <Select
                                    showSearch
                                    value={category}
                                    suffixIcon={null}
                                    filterOption={false}
                                    className={styles.input}
                                    placeholder="Chọn loại giáo trình"
                                    notFoundContent={
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <span>
                                                    Không tìm thấy loại giáo trình
                                                </span>
                                            } />
                                    }
                                    onSelect={(data) => { setCategory(data) }}
                                    options={
                                        categoriesOptions
                                            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                                            .map((category) => ({
                                                value: category.name,
                                                label: category.name,
                                            }))}
                                    onSearch={(value) => {
                                        if (value) {
                                            const filteredOptions = categories.filter(
                                                (category) => category.name.toLowerCase().includes(value?.toLowerCase())
                                            );
                                            setCategoriesOptions(filteredOptions);
                                        } else {
                                            setCategoriesOptions(categories);
                                        }
                                    }}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {categoryError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{categoryError}</p>)}
                                </div>
                            </Col>
                        </Row>
                        {dayjs(syllabusDetail?.effectiveDate, 'DD/MM/YYYY').isAfter(dayjs(), 'day') && (
                            <Row>
                                <Col span={7}>
                                    <p className={styles.addTitle}><span>*</span> Ngày hiệu lực:</p>
                                </Col>
                                <Col span={17}>
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                DatePicker: {
                                                    activeBorderColor: '#f2c955'
                                                },
                                            },
                                        }}
                                    >
                                        <DatePicker
                                            className={styles.input}
                                            value={effectiveDate}
                                            disabledDate={(current) => {
                                                return current && current < dayjs().add(0, 'day').startOf('day');
                                            }}
                                            onChange={(date) => setEffectiveDate(date)}
                                            format={'DD/MM/YYYY'}
                                            placeholder="Ngày hiệu lực" />
                                    </ConfigProvider>
                                    <div style={{ height: '24px', paddingLeft: '10px' }}>
                                        {effectiveDateError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{effectiveDateError}</p>)}
                                    </div>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col span={7}>
                                <p className={styles.addTitle}><span>*</span> Số điểm hoàn thành:</p>
                            </Col>
                            <Col span={17}>
                                <Input
                                    placeholder="Số điểm hoàn thành"
                                    name='minAvgMarkToPass'
                                    type='number'
                                    min={0}
                                    value={formik.values.minAvgMarkToPass}
                                    onChange={formik.handleChange}
                                    error={formik.touched.minAvgMarkToPass && formik.errors.minAvgMarkToPass}
                                    className={styles.input}
                                    required
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.minAvgMarkToPass && formik.touched.minAvgMarkToPass && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.minAvgMarkToPass}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <p className={styles.addTitle}><span>*</span> Nhiệm vụ học sinh:</p>
                            </Col>
                            <Col span={17}>
                                <TextArea
                                    autoSize
                                    className={styles.input}
                                    placeholder="Nhiệm vụ học sinh"
                                    name='studentTasks'
                                    value={formik.values.studentTasks}
                                    onChange={formik.handleChange}
                                    error={formik.touched.studentTasks && formik.errors.studentTasks}
                                    required
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.studentTasks && formik.touched.studentTasks && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.studentTasks}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <p className={styles.addTitle}><span>*</span> Mô tả:</p>
                            </Col>
                            <Col span={17}>
                                <TextArea
                                    autoSize={{ minRows: 2 }}
                                    placeholder="Mô tả"
                                    name='description'
                                    min={0}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && formik.errors.description}
                                    className={styles.input}
                                    required
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.description && formik.touched.description && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.description}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button loading={apiLoading} className={styles.saveButton} htmlType='submit'>
                                Lưu
                            </Button>
                            <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => {
                                setEditModalOpen(false)
                                setCategory(syllabusDetail.category);
                                setEffectiveDate(dayjs(syllabusDetail.effectiveDate, 'DD/MM/YYYY'));
                                formik.setValues({
                                    syllabusName: syllabusDetail.syllabusName,
                                    minAvgMarkToPass: syllabusDetail.minAvgMarkToPass,
                                    studentTasks: syllabusDetail.studentTasks,
                                    description: syllabusDetail.description
                                })
                            }}>
                                Hủy
                            </Button>
                        </div>
                    </form>
                </Modal>
            </ConfigProvider>
        </div >
    )
}
