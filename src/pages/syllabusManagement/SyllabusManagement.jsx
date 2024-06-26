import React, { useState, useEffect, useRef } from 'react'
import styles from './SyllabusManagement.module.css'
import { Button, Input, Modal, Table, ConfigProvider } from 'antd';
import { CloudUploadOutlined, PlusOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { searchSyllabuses } from '../../api/syllabus';
import { getSubjects } from '../../api/courseApi';
import { EyeOutlined } from '@ant-design/icons';
import { formatDate, handleDownloadExcelFile, handleImportSyllabus } from '../../utils/utils';
import { TEMPLATE_ADD_SYLLABUS_FILE, TEMPLATE_FLASHCARD, TEMPLATE_MULTIPLE_CHOICE } from '../../utils/constants';

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
    const [numberOfSyllabus, setNumberOfSyllabus] = useState(null)

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
            setNumberOfSyllabus(data?.numberOfSyllabus)
            setSyllabuses(data?.syllabuses);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: data.length,
                },
            });
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
            title: 'Mã chương trình học',
            render: (_, record) => {
                return `${record.subjectCode}`
            },
            sorter: (a, b) => a.subjectCode.toLowerCase().localeCompare(b.subjectCode.toLowerCase()),
        },
        // {
        //     title: 'Tên khóa học',
        //     render: (_, record) => {
        //         return record.course?.courseName ? record.course.courseName : 'Chưa có'
        //     },
        // },
        {
            title: 'Tên chương trình học',
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
        if (excelFile !== null) {
            setApiLoading(true)
            const syllabusDetail = await handleImportSyllabus(excelFile, fileInput, "add")
            if (syllabusDetail) {
                navigate('add-syllabus', { state: { syllabusDetail } })
            }
        }
        setApiLoading(false)
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản lý chương trình học</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Button onClick={() => setImportModalOpen(true)} className={styles.importButton} icon={<PlusOutlined />}>Thêm chương trình học</Button>
                <Search className={styles.searchBar} placeholder="Tìm kiếm mã chương trình học, tên chương trình học" onSearch={(value, e) => { setSearch(value) }} enterButton />
            </div>
            <h5 style={{ fontSize: '1rem', color: '#888888', fontWeight: 'normal', margin: '0 10px 10px' }}>Tổng số chương trình học: {numberOfSyllabus}</h5>
            <Table
                columns={columns}
                rowKey={(record) => record.syllabusId}
                dataSource={syllabuses}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                sticky={{ offsetHeader: 72 }}
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
                        <Button className={styles.addButton} icon={<CloudDownloadOutlined />} onClick={() => {
                            handleDownloadExcelFile(TEMPLATE_ADD_SYLLABUS_FILE, 'Mau-tao-giao-trinh.xlsx')
                            handleDownloadExcelFile(TEMPLATE_FLASHCARD, 'Mau-ghep-the.xlsx')
                            handleDownloadExcelFile(TEMPLATE_MULTIPLE_CHOICE, 'Mau-trac-nghiem.xlsx')
                        }} >Tải mẫu chương trình học</Button>
                        <Button type='primary' className={styles.importButton} icon={<CloudUploadOutlined />} onClick={() => fileInputRef.current.click()}>Chọn tệp</Button>
                        <input accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' type='file' style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
                        <p>{fileInput ? fileInput.name : 'Chưa có tệp nào được chọn'}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button loading={apiLoading} onClick={handleImport} className={styles.saveButton}>
                            Nạp tập tin
                        </Button>
                        <Button disabled={apiLoading} className={styles.cancelButton}
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
        </div >
    )
}
