import React, { useState, useEffect, useRef } from 'react'
import styles from './AddSyllabus.module.css'
import { Button, Modal, Table, Row, Col, Tabs, ConfigProvider, Divider, Upload, Input } from 'antd';
import { CloudUploadOutlined, EditOutlined, InboxOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../firebase.config';
import { importSyllabus, updateSyllabus } from '../../../api/syllabus';
import Swal from 'sweetalert2';

const { Dragger } = Upload;

export default function AddSyllabus() {
    const params = useParams();
    const oldSyllabusId = params?.id;
    const navigate = useNavigate()
    const location = useLocation()
    const syllabusDetail = location.state.syllabusDetail;
    const [tab, setTab] = useState("syllabus");
    const [apiLoading, setApiLoading] = useState(false)

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const exerciseInputRefs = useRef([]);
    const [exercises, setExercises] = useState([]);
    const [exercisesError, setExercisesError] = useState(null)
    const [files, setFiles] = useState([])
    const [filesError, setFilesError] = useState(null)
    const [fileModalOpen, setFileModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

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

    const handleAddSyllabus = () => {
        const hasNullExcercise = exercises.some((excercise) => {
            return excercise.title === null || excercise.type === null || excercise.noOfSession === null || excercise.score === null || excercise.questionRequests === null
        });
        const hasNullMaterials = files.some((file) => {
            return file.fileName === null
        });
        const isDuplicate = checkDuplicateFiles(files.map(file => file.file));
        if (files.length === 0 || isDuplicate || exercises.length === 0 || hasNullExcercise || hasNullMaterials) {
            if (files.length === 0) {
                setFilesError("Vui lòng thêm tài liệu")
            } else if (isDuplicate) {
                setFilesError("Vui lòng xóa các tài liệu bị trùng")
            } else if (hasNullMaterials) {
                setFilesError("Vui lòng điền đủ thông tin tài liệu")
            } else {
                setFilesError(null)
            }
            if (exercises.length === 0) {
                setExercisesError("Vui lòng thêm bài tập")
            } else if (hasNullExcercise) {
                setExercisesError("Vui lòng điền đủ thông tin bài tập")
            } else {
                setExercisesError(null)
            }

        } else {
            setApiLoading(true)
            setFilesError(null)
            setExercisesError(null)
            //syllabus
            const groupedSyllabus = syllabusDetail.syllabus.reduce((acc, curr) => {
                const existingTopic = acc.find(topic => topic.index === curr.index && topic.topicName === curr.topicName);
                if (existingTopic) {
                    const existingSession = existingTopic.sessionRequests.find(session => session.order === curr.order);
                    if (existingSession) {
                        const existingContent = existingSession.sessionContentRequests.find(content => content.content === curr.content);
                        if (existingContent) {
                            existingContent.sessionContentDetails.push(curr.detail);
                        } else {
                            existingSession.sessionContentRequests.push({
                                content: curr.content,
                                sessionContentDetails: [curr.detail]
                            });
                        }
                    } else {
                        existingTopic.sessionRequests.push({
                            order: curr.order,
                            sessionContentRequests: [{
                                content: curr.content,
                                sessionContentDetails: [curr.detail]
                            }]
                        });
                    }
                } else {
                    acc.push({
                        index: curr?.index,
                        topicName: curr?.topicName,
                        sessionRequests: [{
                            order: curr?.order,
                            sessionContentRequests: [{
                                content: curr?.content,
                                sessionContentDetails: [curr?.detail]
                            }]
                        }]
                    });
                }
                return acc;
            }, []);
            //exercises
            let newExercises = exercises.map(exercise => ({ ...exercise }));
            newExercises.map(exercise => {
                let groupedData = [];
                let currentGroupedItem = null;
                exercise.questionRequests?.forEach((item, id) => {
                    if (exercise.type === 'flashcard') {
                        if ((item.description && id === 0) || (item.description !== exercise.questionRequests[--id].description)) {
                            currentGroupedItem = {
                                description: item.description,
                                flashCardRequests: [{
                                    leftSideImg: item.card1.toLowerCase().includes('https://') ? item.card1 : null,
                                    leftSideDescription: !item.card1.toLowerCase().includes('https://') ? item.card1 : null,
                                    rightSideImg: item.card2.toLowerCase().includes('https://') ? item.card2 : null,
                                    rightSideDescription: !item.card2.toLowerCase().includes('https://') ? item.card2 : null,
                                    score: item.score
                                }]
                            };
                            groupedData.push(currentGroupedItem);
                        } else {
                            if (currentGroupedItem) {
                                currentGroupedItem.flashCardRequests.push({
                                    leftSideImg: item.card1.toLowerCase().includes('https://') ? item.card1 : null,
                                    leftSideDescription: !item.card1.toLowerCase().includes('https://') ? item.card1 : null,
                                    rightSideImg: item.card2.toLowerCase().includes('https://') ? item.card2 : null,
                                    rightSideDescription: !item.card2.toLowerCase().includes('https://') ? item.card2 : null,
                                    score: item.score
                                });
                            }
                        }
                    } else if (exercise.type === 'multiple-choice') {
                        const newItem = {
                            description: item.description,
                            mutipleChoiceAnswerRequests: []
                        };
                        for (let i = 1; i <= 4; i++) {
                            const answerKey = 'answer' + i;
                            const scoreKey = 'score' + i;
                            if (item.hasOwnProperty(answerKey) && item.hasOwnProperty(scoreKey)) {
                                if (item[answerKey]?.toLowerCase().includes('https://')) {
                                    newItem.mutipleChoiceAnswerRequests.push({
                                        img: item[answerKey],
                                        score: item[scoreKey]
                                    });
                                } else {
                                    newItem.mutipleChoiceAnswerRequests.push({
                                        description: item[answerKey],
                                        score: item[scoreKey]
                                    });
                                }
                            }
                        }
                        if (item.hasOwnProperty('img')) {
                            newItem.img = item.img;
                        }
                        groupedData.push(newItem);
                    }
                });
                exercise.questionRequests = groupedData
            })
            //files
            let promises = [];
            files.forEach((file, index) => {
                const fileRef = ref(storage, `syllabuses/${syllabusDetail.generalData.syllabusName}/${syllabusDetail.generalData.effectiveDate}/${file.file.name}`);
                let uploadPromise = uploadBytes(fileRef, file.file.originFileObj)
                    .then(() => {
                        getDownloadURL(fileRef)
                            .then((url) => {
                                files[index].url = url;
                            })
                            .catch(error => {
                                console.error(error.message, "Error getting file URL");
                                setApiLoading(false)
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: "Thêm giáo trình thất bại",
                                    text: "Xin vui lòng thử lại sau",
                                    showConfirmButton: false
                                })
                            });
                    })
                    .catch(error => {
                        console.error(error.message, "Error uploading file");
                        setApiLoading(false)
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Thêm giáo trình thất bại",
                            text: "Xin vui lòng thử lại sau",
                            showConfirmButton: false
                        })
                    });
                promises.push(uploadPromise);
            });
            Promise.all(promises)
                .then(() => {
                    const syllabusRef = ref(storage, `syllabuses/${syllabusDetail.generalData.syllabusName}/${syllabusDetail.generalData.effectiveDate}/${syllabusDetail.syllabusFile.name}`);
                    uploadBytes(syllabusRef, syllabusDetail.syllabusFile).then(() => {
                        getDownloadURL(syllabusRef).then(async (url) => {
                            if (oldSyllabusId) {
                                try {
                                    await updateSyllabus(oldSyllabusId, { ...syllabusDetail.generalData, examSyllabusRequests: syllabusDetail.examSyllabusRequests, syllabusRequests: groupedSyllabus, materialRequests: files, questionPackageRequests: newExercises, syllabusLink: url })
                                        .then(() => {
                                            setApiLoading(false)
                                            Swal.fire({
                                                position: "center",
                                                icon: "success",
                                                title: "Chỉnh sửa giáo trình thành công",
                                                showConfirmButton: false,
                                                timer: 2000
                                            })
                                        }).then(() => {
                                            navigate(-2)
                                        })
                                } catch (error) {
                                    setApiLoading(false)
                                    Swal.fire({
                                        position: "center",
                                        icon: "error",
                                        title: "Chỉnh sửa giáo trình thất bại",
                                        text: error.response.data.Error,
                                        showConfirmButton: false
                                    })
                                }
                            } else {
                                try {
                                    await importSyllabus({ ...syllabusDetail.generalData, examSyllabusRequests: syllabusDetail.examSyllabusRequests, syllabusRequests: groupedSyllabus, materialRequests: files, questionPackageRequests: newExercises, syllabusLink: url })
                                        .then(() => {
                                            setApiLoading(false)
                                            Swal.fire({
                                                position: "center",
                                                icon: "success",
                                                title: "Thêm giáo trình thành công",
                                                showConfirmButton: false
                                            })
                                        }).then(() => {
                                            navigate(-1)
                                        })
                                } catch (error) {
                                    setApiLoading(false)
                                    Swal.fire({
                                        position: "center",
                                        icon: "error",
                                        title: "Thêm giáo trình thất bại",
                                        text: error.response.data.Error,
                                        showConfirmButton: false
                                    })
                                }
                            }
                        }).catch(error => {
                            setApiLoading(false)
                            console.log(error.message, "error getting material url")
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: "Thêm giáo trình thất bại",
                                text: "Xin vui lòng thử lại sau",
                                showConfirmButton: false
                            })
                        })
                    }).catch(error => {
                        setApiLoading(false)
                        console.log(error.message)
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Thêm giáo trình thất bại",
                            text: "Xin vui lòng thử lại sau",
                            showConfirmButton: false
                        })
                    })
                })
                .catch(error => {
                    setApiLoading(false)
                    console.error(error.message, "Error occurred while uploading files or getting URLs");
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Thêm giáo trình thất bại",
                        text: "Xin vui lòng thử lại sau",
                        showConfirmButton: false
                    })
                });
        }
    }
    const checkDuplicateFiles = (fileList) => {
        const fileNames = new Set();
        for (const file of fileList) {
            if (fileNames.has(file.name)) {
                return true;
            } else {
                fileNames.add(file.name);
            }
        }
        return false;
    };

    useEffect(() => {
        setExercises(syllabusDetail.exercises)
    }, [])
    const handleTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };
    const handleUploadExercise = (file, index) => {
        if (file) {
            const updatedExercises = [...exercises];
            let reader = new FileReader();
            reader.readAsArrayBuffer(file)
            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'buffer' });
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];
                const data = XLSX.utils.sheet_to_json(worksheet)
                let check = true
                let newDataQuestions = []
                let type = null
                let previousDescription = null;
                if (data.length > 0) {
                    if (data[0]?.['Thẻ 1']) {
                        type = 'flashcard';
                        newDataQuestions = data.map(row => {
                            const description = row['Câu hỏi'] ? row['Câu hỏi'] : previousDescription
                            previousDescription = description;
                            const question = {
                                description: description,
                                card1: row['Thẻ 1'] || null,
                                card2: row['Thẻ 2'] || null,
                                score: row['Số điểm'] >= 0 ? row['Số điểm'] : null,
                            }
                            if (!question.description || !question.card1 || !question.card2 || !question.score) {
                                check = false
                                console.log("Sai mẫu ghép thẻ")
                            }
                            return question
                        })
                    } else {
                        type = 'multiple-choice';
                        newDataQuestions = data.map(row => {
                            const question = {
                                description: row['Câu hỏi'] || null,
                                img: row['Hình ảnh mô tả (nếu có)'] || null,
                                answer1: row['Đáp án 1'],
                                score1: row['Số điểm 1'],
                                answer2: row['Đáp án 2'],
                                score2: row['Số điểm 2'],
                                answer3: row['Đáp án 3'],
                                score3: row['Số điểm 3'],
                                answer4: row['Đáp án 4'],
                                score4: row['Số điểm 4'],
                            }
                            if (!question.description
                                || (!question.answer1 && question.score1) || (question.answer1 && !question.score1 && question.score1 !== 0)
                                || (!question.answer2 && question.score2) || (question.answer2 && !question.score2 && question.score2 !== 0)
                                || (!question.answer3 && question.score3) || (question.answer3 && !question.score3 && question.score3 !== 0)
                                || (!question.answer4 && question.score4) || (question.answer4 && !question.score4 && question.score4 !== 0)) {
                                check = false
                                console.log("Sai mẫu trắc nghiệm")
                            }
                            return question
                        })
                    }
                    newDataQuestions.forEach(item => {
                        Object.keys(item).forEach(key => {
                            if (typeof item[key] === 'string' && item[key].startsWith("https://drive.google.com/file/d/")) {
                                item[key] = item[key].replace("https://drive.google.com/file/d/", "https://drive.google.com/thumbnail?id=");
                                item[key] = item[key].replace(/\/view.*$/, "");
                            }
                        });
                    })
                } else {
                    check = false
                    console.log("Không có câu hỏi")
                }
                if (check && type) {
                    updatedExercises[index].type = type
                    updatedExercises[index].questionRequests = newDataQuestions;
                    updatedExercises[index].questionFiles = file;
                    setExercises(updatedExercises);
                } else if (check && !type) {
                    Swal.fire({
                        icon: "error",
                        title: 'Có lỗi xãy ra',
                        text: 'Vui lòng chọn tệp câu hỏi phù hợp',
                        showConfirmButton: false,
                    })
                } else {
                    Swal.fire({
                        icon: "error",
                        title: 'Có lỗi xãy ra',
                        text: 'Vui lòng nhập đủ thông tin câu hỏi',
                        showConfirmButton: false,
                    })
                }
            }
        }
    };
    const handleTableQuestionChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableQuestionParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setFlashCardList([]);
            setMultipleChoiceList([]);
        }
    };
    function getQuesionList(index) {
        setQuestionModalOpen(false)
        setQuestionListType(exercises[index].type)
        const data = exercises[index].questionRequests
        if (data) {
            if (exercises[index].type === 'flashcard') {
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
    function transformFlashCardData(data) {
        let questionsLength = 0;
        let newData = []
        let array = []
        let index = 0
        data.forEach((card, id) => {
            if ((card.description && id === 0) || (card.description !== data[--id].description)) {
                array.forEach(arr => arr.questionsLength = questionsLength)
                newData = [...newData, ...array]
                array = []
                questionsLength = 1;
                index = 0
                array.push({
                    ...card,
                    answerIndex: index,
                })
            } else {
                ++questionsLength;
                array.push({
                    ...card,
                    answerIndex: ++index,
                })
            }
        });
        array.forEach((arr) => (arr.questionsLength = questionsLength));
        newData = [...newData, ...array];
        return newData
    }
    const syllabusColumns = [
        {
            title: 'Buổi',
            render: (record) => record.order,
            sorter: (a, b) => a.order - b.order,
            width: 120
        },
        {
            title: 'Chủ đề',
            render: (record) => `${record.index}. ${record.topicName}`,
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
    const examSyllabusRequestsColumns = [
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
            render: (questionType) => questionType?.split("\r\n").map((question, index) => <p key={index} style={{ margin: 0 }}>{question}</p>),
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
            title: <p style={{ margin: 0 }}>{exercisesError && <span style={{ color: 'red' }}>* </span>}Dạng bài</p>,
            dataIndex: 'type',
            render: (text) => text ? text === 'flashcard' ? 'Ghép thẻ' : text === 'multiple-choice' && 'Trắc nghiệm' : 'Chưa có',
        },
        {
            title: 'Buổi học',
            dataIndex: 'noOfSession',
        },
        {
            title: 'Tổng điểm',
            dataIndex: 'score',
        },
        {
            title: <p style={{ margin: 0 }}>{exercisesError && <span style={{ color: 'red' }}>* </span>}Tệp câu hỏi</p>,
            dataIndex: 'questionFiles',
            render: (text, record, index) =>
            (<>
                <input type='file' accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ref={(el) => exerciseInputRefs.current[index] = el} onChange={(e) => handleUploadExercise(e.target.files[0], index)} style={{ display: 'none' }} />
                {text ? <p style={{ margin: 0 }}>{text.name} <Button type='link' onClick={() => getQuesionList(index)} icon={<EyeOutlined />} size='large' /> <Button disabled={apiLoading} type='link' onClick={() => exerciseInputRefs.current[index].click()} icon={<EditOutlined />} size='large' /> </p> : <p style={{ margin: 0 }}>Chưa có <Button disabled={apiLoading} type='link' onClick={() => exerciseInputRefs.current[index].click()} icon={<CloudUploadOutlined />} size='large' /></p>}
            </>)
        },
    ]

    const multipleChoiceColumns = [
        {
            title: 'STT',
            render: (record, _, index) => ++index,
            width: 60,
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'description'
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'img',
            render: (text) => { if (text) return <img style={{ width: 100 }} src={text} alt="Hình ảnh" /> }
        },
        {
            title: 'Đáp án 1',
            dataIndex: 'answer1',
            render: (text) =>
                text?.toLowerCase().includes('https://') ?
                    <img style={{ width: 100 }} src={text} alt="Hình ảnh" /> : text
        },
        {
            title: 'Số điểm 1',
            dataIndex: 'score1'
        },
        {
            title: 'Đáp án 2',
            dataIndex: 'answer2',
            render: (text) =>
                text?.toLowerCase().includes('https://') ?
                    <img style={{ width: 100 }} src={text} alt="Hình ảnh" /> : text
        },
        {
            title: 'Số điểm 2',
            dataIndex: 'score2',
        },
        {
            title: 'Đáp án 3',
            dataIndex: 'answer3',
            render: (text) =>
                text?.toLowerCase().includes('https://') ?
                    <img style={{ width: 100 }} src={text} alt="Hình ảnh" /> : text
        },
        {
            title: 'Số điểm 3',
            dataIndex: 'score3',
        },
        {
            title: 'Đáp án 4',
            dataIndex: 'answer4',
            render: (text) =>
                text?.toLowerCase().includes('https://') ?
                    <img style={{ width: 100 }} src={text} alt="Hình ảnh" /> : text
        },
        {
            title: 'Số điểm 4',
            dataIndex: 'score4',
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
            dataIndex: 'card1',
            render: (text) =>
                text?.toLowerCase().includes('https://') ?
                    <img style={{ width: 100 }} src={text} alt="Hình ảnh" /> : text
        },
        {
            title: 'Thẻ 2',
            dataIndex: 'card2',
            render: (text) =>
                text?.toLowerCase().includes('https://') ?
                    <img style={{ width: 100 }} src={text} alt="Hình ảnh" /> : text
        },
        {
            title: 'Số điểm',
            dataIndex: 'score',
        },
    ]
    const materialColumns = [
        {
            title: 'STT',
            render: (record, _, index) => ++index,
            width: 120
        },
        {
            title: <p style={{ margin: 0 }}>{filesError === "Vui lòng điền đủ thông tin tài liệu" && <span style={{ color: 'red' }}>* </span>}Tên tài liệu</p>,
            render: (record, _, index) =>
                <Input
                    className={styles.input}
                    placeholder="Tên tài liệu"
                    name='fileName'
                    value={record.fileName}
                    onChange={(e) => handleChangeFileName(index, e.target.value)}
                    required
                    disabled={apiLoading}
                />
        },
        {
            title: 'Tài liệu',
            render: (record, _, index) => record.file?.name
        },
        {
            title: 'Chi tiết',
            render: (record, _, index) => (
                <Button type='link' onClick={() => handleViewFile(index)} icon={<EyeOutlined />} size='large' />
            ),
            width: 120
        },
        {
            title: 'Xóa',
            render: (record, _, index) => (
                <Button disabled={apiLoading} type='link' onClick={() => handleDeleteFile(index)} icon={<DeleteOutlined />} size='large' />
            ),
            width: 120
        },
    ]
    const uploadProps = {
        name: 'file',
        multiple: true,
        accept: 'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/pdf, image/*',
        onChange({ file, fileList }) {
            const newFile = {
                fileName: null,
                file: file,
            };
            if (newFile.file?.status === 'done' || newFile.file?.status === 'error') {
                setFiles([...files, newFile]);
            }
        },
        showUploadList: false,
        files: [],
    };
    const handleViewFile = (index) => {
        setFileModalOpen(false);
        const url = URL.createObjectURL(files[index].file.originFileObj)
        setSelectedFile(url);
        setFileModalOpen(true);
    };
    const handleDeleteFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };
    const handleChangeFileName = (index, newFileName) => {
        const updatedFiles = [...files];
        updatedFiles[index].fileName = newFileName;
        setFiles(updatedFiles);
    };
    return (
        <div className={styles.container}>
            {oldSyllabusId ?
                <h2 className={styles.title}>Cập nhật giáo trình</h2>
                : <h2 className={styles.title}>Thêm giáo trình</h2>
            }
            {syllabusDetail && (
                <Row style={{ marginBottom: 20 }}>
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Tên giáo trình:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail.generalData?.syllabusName}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Loại:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail.generalData?.type}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Mã giáo trình:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail.generalData?.subjectCode}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Thời gian:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>1 khóa học = {syllabusDetail.groupedSyllabus?.length} buổi</p>
                        <p className={styles.syllabusDetail}>1 buổi = {syllabusDetail.generalData?.timePerSession}'</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Điều kiện tiên quyết:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        {syllabusDetail.generalData?.preRequisite?.map((pre, index) => <p key={index} className={styles.syllabusDetail}>{pre}</p>)}
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Mô tả:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail.generalData?.description}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Nhiệm vụ của học sinh:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        {syllabusDetail.generalData?.studentTasks?.split("\r\n").map((pre, index) => <p key={index} className={styles.syllabusDetail}>{pre}</p>)}
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Thang điểm:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail.generalData?.scoringScale}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Ngày hiệu lực:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail.generalData?.effectiveDate}</p>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    <Col span={4}>
                        <p className={styles.syllabusTitle}>Số điểm hoàn thành:</p>
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <p className={styles.syllabusDetail}>{syllabusDetail.generalData?.minAvgMarkToPass}</p>
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
                    onChange={activeKey => {
                        setTab(activeKey)
                        let length = 0
                        if (activeKey === 'syllabus') {
                            length = syllabusDetail.groupedSyllabus.length
                        } else if (activeKey === 'examSyllabusRequests') {
                            length = syllabusDetail?.examSyllabusRequests?.length
                        } else if (activeKey === 'exercise') {
                            length = exercises.length
                        } else if (activeKey === 'material') {
                            length = files?.length
                        }
                        setTableParams({
                            pagination: {
                                current: 1,
                                pageSize: 10,
                                total: length
                            },
                        });
                    }}
                    // tabBarExtraContent={}
                    items={[
                        {
                            label: 'Giáo trình',
                            key: 'syllabus',
                            children: (
                                <Table
                                    columns={syllabusColumns}
                                    rowKey={(record) => record.order}
                                    dataSource={syllabusDetail.groupedSyllabus}
                                    pagination={tableParams.pagination}
                                    onChange={handleTableChange}
                                    scroll={{ y: 'calc(100vh - 220px)' }}
                                />
                            )
                        },
                        {
                            label: 'Đánh giá',
                            key: 'examSyllabusRequests',
                            children: (
                                <Table
                                    columns={examSyllabusRequestsColumns}
                                    rowKey={(record) => record.type}
                                    dataSource={syllabusDetail?.examSyllabusRequests}
                                    pagination={tableParams.pagination}
                                    onChange={handleTableChange}
                                    scroll={{ y: 'calc(100vh - 220px)' }}
                                />
                            )
                        },
                        {
                            label: <p style={{ margin: 0 }}>{exercisesError && <span style={{ color: 'red' }}>* </span>}Bài tập</p>,
                            key: 'exercise',
                            children: (
                                <>
                                    {exercisesError && <p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{exercisesError}</p>}
                                    <Table
                                        columns={exerciseColumns}
                                        rowKey={(record) => record.title}
                                        dataSource={exercises}
                                        pagination={tableParams.pagination}
                                        onChange={handleTableChange}
                                        scroll={{ y: 'calc(100vh - 220px)' }}
                                    />
                                </>
                            )
                        },
                        {
                            label: <p style={{ margin: 0 }}>{filesError && <span style={{ color: 'red' }}>* </span>}Tài liệu</p>,
                            key: 'material',
                            children: (
                                <>
                                    {filesError && <p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{filesError}</p>}
                                    <Dragger {...uploadProps} disabled={apiLoading} style={{ marginBottom: 10 }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Kéo và thả tài liệu hoặc nhấp để chọn</p>
                                        <p className="ant-upload-hint">
                                            Hỗ trợ các tài liệu word, excel, powerpoint, .pdf và hình ảnh
                                        </p>
                                    </Dragger>
                                    <Table
                                        columns={materialColumns}
                                        rowKey={(record) => record.index}
                                        dataSource={files}
                                        pagination={tableParams.pagination}
                                        onChange={handleTableChange}
                                        scroll={{ y: 'calc(100vh - 220px)' }}
                                    />
                                </>
                            )
                        }
                    ]}
                />
            </ConfigProvider>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                {apiLoading ? (
                    <>
                        <Button loading className={styles.saveButton}>
                            Lưu
                        </Button>
                        <Button disabled className={styles.cancelButton}>
                            Hủy
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={handleAddSyllabus} className={styles.saveButton}>
                            Lưu
                        </Button>
                        <Button className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                            Hủy
                        </Button>
                    </>
                )}
            </div>
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
                                rowKey={(record) => record.id}
                                dataSource={flashcardList}
                                pagination={tableQuestionParams.pagination}
                                onChange={handleTableQuestionChange}
                                scroll={{ y: '480px' }}
                            />
                        ) : (
                            <Table
                                columns={multipleChoiceColumns}
                                rowKey={(record) => record.id}
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
                    title="Tệp đã tải lên"
                    centered
                    open={fileModalOpen}
                    footer={null}
                    onCancel={() => setFileModalOpen(false)}
                    classNames={{ header: styles.modalHeader }}
                    width="80%"
                >
                    {selectedFile && (
                        <iframe src={selectedFile} style={{ width: '100%', height: '600px' }} ></iframe>
                    )}
                </Modal>
            </ConfigProvider>
        </div>
    )
}
