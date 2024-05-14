import React, { useState, useEffect } from 'react'
import styles from './StaffManagement.module.css'
import { Button, DatePicker, Input, Table, Avatar, ConfigProvider, Modal, Row, Col, Select, Tabs, Spin, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStudentsOfClass } from '../../api/classesApi';
import { formatDate, formatPhone } from '../../utils/utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addStaff, getLecturerCareer, getUsers } from '../../api/user';
import Swal from 'sweetalert2';

const { Search } = Input;
const searchRoleList = [
    {
        label: 'Nhân viên',
        key: 'STAFF',
        value: 'STAFF',
    },
    {
        label: 'Quản trị viên',
        key: 'ADMIN',
        value: 'ADMIN',
    },
    {
        label: 'Giáo viên',
        key: 'LECTURER',
        value: 'LECTURER',
    },
]

export default function StaffManagement() {

    const [searchRole, setSearchRole] = useState("STAFF");
    const [search, setSearch] = useState(null)
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [careers, setCareers] = useState([]);
    const [careersLoading, setCareersLoading] = useState(false)
    const [lecturerCareerId, setLecturerCareerId] = useState(null);
    const [careersError, setCareersError] = useState(null);
    const [careersOptions, setCareersOptions] = useState([]);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [apiLoading, setApiLoading] = useState(false)
    async function getListOfUsers(search, searchRole) {
        try {
            setLoading(true)
            const data = await getUsers(searchRole, search);
            setUsers(data);
            setTableParams({
                ...tableParams,
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
    };
    async function getCareer() {
        try {
            setCareersLoading(true)
            const data = await getLecturerCareer();
            setCareers(data);
            setCareersOptions(data)
        } catch (error) {
            console.log(error);
        } finally {
            setCareersLoading(false)
        }
    };

    useEffect(() => {
        getListOfUsers(search, searchRole)
    }, [search, searchRole])
    useEffect(() => {
        getCareer()
    }, [])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };
    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            sorter: (a, b) => a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()),
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar size={64} src={record.imgAvatar} style={{ marginRight: '10px' }} />
                    <p>{record.fullName}</p>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (email) => email ? email : 'Chưa có'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            render: (phone) => phone && formatPhone(phone)
        },
    ];
    const columnsLecturer = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            sorter: (a, b) => a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()),
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar size={64} src={record.imgAvatar} style={{ marginRight: '10px' }} />
                    <p>{record.fullName}</p>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (email) => email ? email : 'Chưa có'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            render: (phone) => phone && formatPhone(phone)
        },
        {
            title: 'Chuyên ngành',
            render: (record) => record.lecturerField && record.lecturerField.name
        },
    ];
    const formik = useFormik({
        initialValues: {
            userName: "",
            userPhone: "",
            role: null,
        },
        onSubmit: async values => {
            if (values.role === 'LECTURER' && !lecturerCareerId) {
                setCareersError("Vui lòng chọn chuyên ngành giáo viên")
            } else {
                setApiLoading(true)
                setCareersError(null)
                try {
                    if (values.role === 'LECTURER') {
                        await addStaff({ ...values, lecturerCareerId })
                            .then(() => {
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Thêm nhân viên thành công",
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                            })
                            .then(() => {
                                getListOfUsers(search, searchRole)
                                setAddModalOpen(false)
                                formik.resetForm()
                            })
                    } else {
                        await addStaff(values)
                            .then(() => {
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Thêm nhân viên thành công",
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                            })
                            .then(() => {
                                getListOfUsers(search, searchRole)
                                setAddModalOpen(false)
                                formik.resetForm()
                            })
                    }
                } catch (error) {
                    console.log(error)
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: error.response?.data?.Error,
                        showConfirmButton: false,
                        timer: 2000
                    })
                } finally {
                    setApiLoading(false)
                }
            }
        },
        validationSchema: Yup.object({
            userName: Yup.string().required("Vui lòng điền tên nhân viên"),
            userPhone: Yup.string().required("Vui lòng điền số học viên tối đa").matches(/^\+?[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
                .min(10, 'Số điện thoại có tối thiểu 10 kí tự')
                .max(12, 'Số điện thoại có tối đa 12 kí tự'),
            role: Yup.string().required("Vui lòng chọn vai trò nhân viên"),
        }),
    });

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản lý nhân sự</h2>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Button onClick={() => { setAddModalOpen(true) }} className={styles.addButton} icon={<PlusOutlined />}>Thêm nhân viên</Button>
            </div>
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
                    defaultActiveKey={searchRole}
                    type="card"
                    size="middle"
                    tabPosition='top'
                    onChange={activeKey => setSearchRole(activeKey)}
                    tabBarExtraContent={<Search className={styles.searchBar} placeholder="Tìm kiếm nhân viên" onSearch={(value, e) => { setSearch(value) }} enterButton />}
                    items={searchRoleList.map(status => (
                        {
                            label: status.label,
                            key: status.key,
                            children: (
                                <>
                                    <Table
                                        columns={searchRole === 'LECTURER' ? columnsLecturer : columns}
                                        rowKey={(record) => record.id}
                                        dataSource={users}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                        sticky={{ offsetHeader: 72 }}
                                    />
                                </>
                            )
                        }
                    ))}
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
                    title="Thêm nhân viên"
                    centered
                    open={addModalOpen}
                    footer={null}
                    onCancel={() => setAddModalOpen(false)}
                    width={600}
                    classNames={{ header: styles.modalHeader }}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col span={6}>
                                <p className={styles.addTitle}><span>*</span> Họ và tên:</p>
                            </Col>
                            <Col span={18}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Input
                                        placeholder="Họ và tên"
                                        name='userName'
                                        value={formik.values.userName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.userName && formik.errors.userName}
                                        className={styles.input}
                                        required
                                        disabled={apiLoading}
                                    />
                                </div>
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.userName && formik.touched.userName && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.userName}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p className={styles.addTitle} ><span>*</span> Số điện thoại:</p>
                            </Col>
                            <Col span={18}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Input
                                        placeholder="Số điện thoại"
                                        name='userPhone'
                                        value={formik.values.userPhone}
                                        onChange={formik.handleChange}
                                        error={formik.touched.userPhone && formik.errors.userPhone}
                                        className={styles.input}
                                        required
                                        disabled={apiLoading}
                                    />
                                </div>
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.userPhone && formik.touched.userPhone && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.userPhone}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p className={styles.addTitle} ><span>*</span> Vai trò:</p>
                            </Col>
                            <Col span={18}>
                                <Select
                                    value={formik.values.role}
                                    suffixIcon={null}
                                    className={styles.input}
                                    placeholder="Chọn vai trò"
                                    onSelect={(data) => { formik.setFieldValue("role", data) }}
                                    options={searchRoleList}
                                    disabled={apiLoading}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.role && formik.touched.role && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.role}</p>)}
                                </div>
                            </Col>
                        </Row>
                        {formik.values.role === 'LECTURER' &&
                            <Row>
                                <Col span={6}>
                                    <p className={styles.addTitle} ><span>*</span> Chuyên ngành:</p>
                                </Col>
                                <Col span={18}>
                                    <Select
                                        showSearch
                                        value={lecturerCareerId}
                                        suffixIcon={null}
                                        filterOption={false}
                                        className={styles.input}
                                        placeholder="Chọn chuyên ngành"
                                        onSelect={(data) => { setLecturerCareerId(data) }}
                                        notFoundContent={
                                            careersLoading
                                                ? <div style={{ width: '100%', textAlign: 'center' }}>
                                                    <Spin size='small' />
                                                </div>
                                                : <Empty
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    description={
                                                        <span>
                                                            Không tìm thấy chuyên ngành
                                                        </span>
                                                    } />
                                        }
                                        options={
                                            careersOptions
                                                .map((career) => ({
                                                    value: career.careerId,
                                                    label: career.careerName
                                                }))}
                                        onSearch={(value) => {
                                            if (value) {
                                                const filteredOptions = careers.filter(
                                                    (career) => career.careerName.toLowerCase().includes(value?.toLowerCase())
                                                );
                                                setCareersOptions(filteredOptions);
                                            } else {
                                                setCareersOptions(careers);
                                            }
                                        }}
                                        disabled={apiLoading}
                                    />
                                    <div style={{ height: '24px', paddingLeft: '10px' }}>
                                        {careersError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{careersError}</p>)}
                                    </div>
                                </Col>
                            </Row>
                        }
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button loading={apiLoading} className={styles.saveButton} htmlType='submit'>
                                Lưu
                            </Button>
                            <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => {
                                setAddModalOpen(false)
                                formik.resetForm()
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
