import React, { useState, useEffect } from 'react'
import styles from './StaffManagement.module.css'
import { Button, DatePicker, Input, Table, Avatar, ConfigProvider, Modal, Row, Col, Select, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStudentsOfClass } from '../../api/classesApi';
import { formatDate, formatPhone } from '../../utils/utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const { Search } = Input;
const searchRoleList = [
    {
        label: 'Nhân viên',
        key: 'staff',
        value: 'staff',
    },
    {
        label: 'Quản trị viên',
        key: 'admin',
        value: 'admin',
    },
    {
        label: 'Giáo viên',
        key: 'teacher',
        value: 'teacher',
    },
]

export default function StaffManagement() {

    const navigate = useNavigate();
    const [searchRole, setSearchRole] = useState("staff");
    const [search, setSearch] = useState(null)
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [apiLoading, setApiLoading] = useState(false)
    async function getUsers(search, searchRole) {
        try {
            // const data = await getUser(search, searchRole);
            const data = [
                {
                    id: 1,
                    fullName: "Heo hồng",
                    phone: "+84912344640",
                    gender: "Nam",
                    email: "a@gmail.com",
                    dateOfBirth: "2000-10-05T14:48:00.000Z",
                    role: "admin"
                },
                {
                    id: 2,
                    fullName: "Bo Su",
                    phone: "+84935447505",
                    gender: "Nam",
                    email: "b@gmail.com",
                    dateOfBirth: "2000-10-05T14:48:00.000Z",
                    role: "admin"
                },
            ]
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

    useEffect(() => {
        getUsers(search, searchRole)
    }, [search, searchRole])

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
            title: 'Số điện thoại',
            dataIndex: 'phone',
            render: (phone) => phone && formatPhone(phone)
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            render: (_, record) => (record.dateOfBirth && formatDate(record.dateOfBirth)),
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (gender) => {
                if (gender === 'Nữ') {
                    return <div style={{ backgroundColor: '#ffb6c1', color: '#800000', whiteSpace: 'nowrap' }} className={styles.status}>Nữ</div>
                } else if (gender === 'Nam') {
                    return <div style={{ backgroundColor: '#87ceeb', color: '#000080', whiteSpace: 'nowrap' }} className={styles.status}>Nam</div>
                }
            },
            filters: [
                {
                    text: 'Nữ',
                    value: 'Nữ',
                },
                {
                    text: 'Nam',
                    value: 'Nam',
                },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.gender === value,
        },
    ];
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            role: null,
        },
        onSubmit: async values => {
            try {
                // await addStaff(values)
                //     .then(() => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Thêm nhân viên thành công",
                    showConfirmButton: false,
                    timer: 2000
                })
                    // })
                    .then(() => {
                        getUsers(search, searchRole)
                        setAddModalOpen(false)
                        formik.resetForm()
                    })
            } catch (error) {
                console.log(error)
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: error.response?.data?.Error,
                })
            } finally {
                setApiLoading(false)
            }
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Vui lòng điền tên nhân viên"),
            email: Yup.string().email("Vui lòng nhập đúng email").required("Vui lòng điền email nhân viên"),
            phone: Yup.string().required("Vui lòng điền số học viên tối đa").matches(/^\+?[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
                .min(10, 'Số điện thoại có tối thiểu 10 kí tự')
                .max(11, 'Số điện thoại có tối đa 12 kí tự'),
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
                    onChange={activeKey => setStatus(activeKey)}
                    tabBarExtraContent={<Search className={styles.searchBar} placeholder="Tìm kiếm nhân viên" onSearch={(value, e) => { setSearch(value) }} enterButton />}
                    items={searchRoleList.map(status => (
                        {
                            label: status.label,
                            key: status.key,
                            children: (
                                <>
                                    <Table
                                        columns={columns}
                                        rowKey={(record) => record.id}
                                        dataSource={users}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                        scroll={{ y: 'calc(100vh - 220px)' }}
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
                                        name='name'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && formik.errors.name}
                                        className={styles.input}
                                        required
                                        disabled={apiLoading}
                                    />
                                </div>
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.name && formik.touched.name && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.name}</p>)}
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
                                        name='phone'
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        error={formik.touched.phone && formik.errors.phone}
                                        className={styles.input}
                                        required
                                        disabled={apiLoading}
                                    />
                                </div>
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.phone && formik.touched.phone && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.phone}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p className={styles.addTitle} ><span>*</span> Email:</p>
                            </Col>
                            <Col span={18}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Input
                                        placeholder="Email"
                                        name='email'
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && formik.errors.email}
                                        className={styles.input}
                                        required
                                        disabled={apiLoading}
                                    />
                                </div>
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.email && formik.touched.email && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.email}</p>)}
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
