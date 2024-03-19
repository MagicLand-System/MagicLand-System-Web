import React, { useState, useEffect, useRef } from 'react'
import styles from './SyllabusManagement.module.css'
import { Button, Input, Modal, Table, ConfigProvider } from 'antd';
import { CloudUploadOutlined, PlusOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { checkSyllabusInfo, searchSyllabuses } from '../../api/syllabus';
import { getSubjects } from '../../api/courseApi';
import { EyeOutlined } from '@ant-design/icons';
import { formatDate } from '../../utils/utils';
import { TEMPLATE_ADD_SYLLABUS_FILE } from '../../constants/constants';
import * as XLSX from 'xlsx';
import { parse } from 'date-fns';

const { Search } = Input;


export default function SyllabusManagement() {
    const [importModalOpen, setImportModalOpen] = useState(false);
    const navigate = useNavigate()
    const [search, setSearch] = useState(null)
    const [syllabuses, setSyllabuses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);
    const [fileInput, setFileInput] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [apiLoading, setApiLoading] = useState(false)

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    async function getListsOfSyllabuses(searchString) {
        try {
            setLoading(true);
            const data = await searchSyllabuses(searchString);
            if (data) {
                setSyllabuses(data);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: data.length,
                    },
                });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };
    async function getListsOfSubjects() {
        const data = await getSubjects();
        setSubjects(data);
    };

    useEffect(() => {
        getListsOfSubjects();
    }, []);

    useEffect(() => {
        getListsOfSyllabuses(search);
    }, [search]);

    const handleTableChange = (pagination, filters, sorter, extra) => {
        pagination.total = extra.currentDataSource.length
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setSyllabuses([]);
        }
    };
    const columns = [
        {
            title: 'Mã giáo trình',
            render: (_, record) => {
                return `${record.subjectCode}`
            },
            sorter: (a, b) => a.subjectCode.toLowerCase().localeCompare(b.subjectCode.toLowerCase()),
        },
        {
            title: 'Tên khóa học',
            render: (_, record) => {
                return record.course?.courseName ? record.course.courseName : 'Chưa có'
            },
        },
        {
            title: 'Tên giáo trình',
            render: (_, record) => {
                return record.syllabusName
            },
            sorter: (a, b) => a.syllabusName.toLowerCase().localeCompare(b.syllabusName.toLowerCase()),
        },
        {
            title: 'Loại',
            render: (_, record) => {
                return `${record.category}`
            },
            sorter: (a, b) => a.category.toLowerCase().localeCompare(b.category.toLowerCase()),
            filters: subjects.map((subject) => ({
                text: subject.name,
                value: subject.name
            })),
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'Ngày hiệu lực',
            render: (_, record) => {
                return formatDate(record.effectiveDate)
            }
        },
        {
            title: 'Chi tiết',
            render: (_, record) => (
                <Button type='link' onClick={() => navigate(`detail/${record.syllabusId}`)} icon={<EyeOutlined />} size='large' />
            ),
            width: 120,
        },
    ];
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
    const handleImport = async (e) => {
        e.preventDefault();
        let errors = []
        let syllabusDetail = null
        if (excelFile !== null) {
            setApiLoading(true)
            const workbook = XLSX.read(excelFile, { type: 'buffer' });
            //sheet general
            const worksheetGeneral = workbook.Sheets['Thông tin chung'];
            const dataGeneral = XLSX.utils.sheet_to_json(worksheetGeneral);
            let numOfSessions = 0;
            if (dataGeneral.length === 1) {
                let newDataGeneral = dataGeneral.map(row => ({
                    syllabusName: row['Tên giáo trình'] || null,
                    subjectCode: row['Mã giáo trình'] || null,
                    type: row['Loại'] || null,
                    timePerSession: row['Thời gian / buổi'] || null,
                    numOfSessions: row['Số buổi học'] || null,
                    preRequisite: row['Điều kiện tiên quyết'] || null,
                    description: row['Mô tả'] || null,
                    studentTasks: row['Nhiệm vụ học sinh'] || null,
                    scoringScale: row['Thang điểm'] || null,
                    effectiveDate: row['Ngày hiệu lực'] || null,
                    minAvgMarkToPass: row['Số điểm hoàn thành'] || null,
                }))
                const generalData = newDataGeneral[0];
                numOfSessions = generalData.numOfSessions;
                if (!generalData.syllabusName || !generalData.subjectCode || !generalData.type || !generalData.timePerSession || !generalData.numOfSessions || !generalData.description || !generalData.studentTasks || !generalData.scoringScale || !generalData.effectiveDate || !generalData.minAvgMarkToPass) {
                    errors.push("Vui lòng điền đủ các thông tin chung")
                }
                if (generalData.syllabusName && generalData.subjectCode) {
                    try {
                        const data = await checkSyllabusInfo(generalData.syllabusName, generalData.subjectCode)
                        if (data !== "Thông Tin Giáo Trình Hợp Lệ") {
                            errors.push(data)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                if (generalData.effectiveDate) {
                    const today = new Date()
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);

                    const date = new parse(generalData.effectiveDate, "dd/MM/yyyy", new Date())
                    date.setHours(12);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    if (date < today) {
                        errors.push("Ngày hiệu lực không hợp lệ")
                    }
                }
                newDataGeneral.forEach(data => {
                    const preRequisite = data.preRequisite?.split("\r\n");
                    data.preRequisite = preRequisite
                });
                syllabusDetail = { generalData }
            } else {
                errors.push("Vui lòng điền đủ các thông tin chung")
            }
            //sheet syllabus
            const worksheetSyllabus = workbook.Sheets['Giáo trình'];
            const dataSyllabus = XLSX.utils.sheet_to_json(worksheetSyllabus);
            let syllabusLength = 0
            if (dataSyllabus.length > 0) {
                let newDataSyllabus = dataSyllabus.map(row => ({
                    index: row['STT'] || null,
                    topicName: row['Chủ đề'] || null,
                    order: row['Buổi'] || null,
                    content: row['Nội dung'] || null,
                    detail: row['Chi tiết'] || null,
                }))
                newDataSyllabus.forEach((item, index) => {
                    if (item.detail) {
                        if (!item.index && index > 0) {
                            item.index = newDataSyllabus[index - 1].index;
                        }
                        if (!item.topicName && index > 0) {
                            item.topicName = newDataSyllabus[index - 1].topicName;
                        }
                        if (!item.order && index > 0) {
                            item.order = newDataSyllabus[index - 1].order;
                        }
                        if (!item.content && index > 0) {
                            item.content = newDataSyllabus[index - 1].content;
                        }
                    } else {
                        if (!errors.includes("Vui lòng điền đủ các thông tin giáo trình")) {
                            errors.push("Vui lòng điền đủ các thông tin giáo trình");
                        }
                    }
                });
                const groupedSyllabus = groupDataByOrder(newDataSyllabus)
                syllabusLength = groupedSyllabus.length
                syllabusDetail = { ...syllabusDetail, syllabus: newDataSyllabus, groupedSyllabus }
            } else {
                errors.push("Vui lòng điền đủ các thông tin giáo trình");
            }
            if (!syllabusLength > 0 && !numOfSessions > 0 || syllabusLength !== numOfSessions) {
                if (!errors.includes("Vui lòng điền đủ các thông tin giáo trình")) {
                    errors.push("Thông tin số buổi và giáo trình không phù hợp");
                }
            }
            //sheet assessment
            const worksheetAssessment = workbook.Sheets['Đánh giá'];
            const dataAssessment = XLSX.utils.sheet_to_json(worksheetAssessment);
            if (dataAssessment.length > 0) {
                let newDataAssessment = dataAssessment.map(row => ({
                    type: row['Loại bài tập'] || null,
                    contentName: row['Nội dung'] || null,
                    part: row['Số lượng'] || null,
                    weight: row['Trọng số'] || null,
                    completionCriteria: row['Điểm tối thiểu'] >= 0 ? row['Điểm tối thiểu'] : null,
                    method: row['Phương thức'] || null,
                    duration: row['Thời gian'] || null,
                    questionType: row['Loại câu hỏi'] || null,
                }))
                let sumWeight = 0;
                newDataAssessment.forEach(data => {
                    const weight = data.weight.replace("%", "");
                    data.weight = weight
                    sumWeight = sumWeight + parseInt(weight);
                    const duration = data.duration?.toString();
                    data.duration = duration
                    if (!data.type || !data.contentName || !data.part || !data.weight || !(data.completionCriteria >= 0) || !data.method) {
                        if (!errors.includes("Vui lòng điền đủ các thông tin đánh giá")) {
                            errors.push("Vui lòng điền đủ các thông tin đánh giá");
                        }
                    }
                });
                if (sumWeight !== 100) {
                    errors.push("Vui lòng điền đúng đánh giá trọng số");
                }
                syllabusDetail = { ...syllabusDetail, examSyllabusRequests: newDataAssessment }
            } else {
                errors.push("Vui lòng điền đủ các thông tin đánh giá");
            }
            if (errors.length === 0) {
                syllabusDetail = { ...syllabusDetail, syllabusFile: fileInput }
                navigate('add-syllabus', { state: { syllabusDetail } })
            } else {
                Swal.fire({
                    icon: "error",
                    title: 'Có lỗi xảy ra',
                    html: errors.map(err => `${err}<br/>`).join(''),
                })
            }
        }
        setApiLoading(false)
    }
    function groupDataByOrder(inputData) {
        const groupedData = [];

        inputData.forEach(item => {
            const existingGroup = groupedData.find(group => group.order === item.order && group.topicName === item.topicName);

            if (!existingGroup) {
                groupedData.push({
                    order: item.order,
                    index: item.index,
                    topicName: item.topicName,
                    contents: [{
                        content: item.content,
                        details: item.detail ? [item.detail] : []
                    }]
                });
            } else {
                const existingContent = existingGroup.contents.find(content => content.content === item.content);
                if (!existingContent) {
                    existingGroup.contents.push({
                        content: item.content,
                        details: item.detail ? [item.detail] : []
                    });
                } else {
                    if (item.detail) {
                        existingContent.details.push(item.detail);
                    }
                }
            }
        });

        return groupedData;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản lý giáo trình</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Button onClick={() => setImportModalOpen(true)} className={styles.importButton} icon={<PlusOutlined />}>Thêm giáo trình</Button>
                <Search className={styles.searchBar} placeholder="Tìm kiếm mã giáo trình, tên giáo trình" onSearch={(value, e) => { setSearch(value) }} enterButton />
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.syllabusId}
                dataSource={syllabuses}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
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
                    title="Thêm tệp lớp học"
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
                        {!apiLoading ?
                            <>
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
                            </> : <>
                                <Button loading className={styles.saveButton}>
                                    Nạp tập tin
                                </Button>
                                <Button disabled className={styles.cancelButton}>
                                    Hủy
                                </Button>
                            </>}
                    </div>
                </Modal>
            </ConfigProvider>
        </div >
    )
}
