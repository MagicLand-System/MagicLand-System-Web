import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './RegisterCourse.module.css'
import { Button, Checkbox, Col, AutoComplete, ConfigProvider, DatePicker, Divider, Empty, Input, Radio, Row, Select, Space, Steps, Spin, Avatar } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStudent, getUserByName, getUserByPhone } from '../../../api/user';
import dayjs from 'dayjs';
import { getClass } from '../../../api/classesApi';
import { cashCheckout, getCourse } from '../../../api/courseApi';
import { formatDate, formatDateTime, formatDayOfWeek, formatPhone } from '../../../utils/utils';
import debounce from 'lodash/debounce';
import { getTime } from '../../../api/time';
import MockDate from "mockdate";
export default function RegisterCourse() {
    const navigate = useNavigate()
    const location = useLocation()
    const courseId = location.state.courseId;
    const classId = location.state.classId;
    const [currentStep, setCurrentStep] = useState(0)

    const [course, setCourse] = useState(null)
    const [classData, setClassData] = useState(null)

    const [phoneNumber, setPhoneNumber] = useState(null)
    const [phoneNumberError, setPhoneNumberError] = useState(null)

    const [isExist, setIsExist] = useState(false)
    const [fullName, setFullName] = useState(null)
    const [fullNameError, setFullNameError] = useState(null)
    const [email, setEmail] = useState(null)
    const [emailError, setEmailError] = useState(null)

    const [childrens, setChildrens] = useState([])
    const [childrensList, setChildrensList] = useState([])
    const [newChildrensList, setNewChildrensList] = useState([])
    const [childrensError, setChildrensError] = useState(null)

    const [method, setMethod] = useState('cash')
    const [price, setPrice] = useState(0)
    const [paymentResponse, setPaymentResponse] = useState(null);
    const [apiLoading, setApiLoading] = useState(false)

    const [users, setUsers] = useState([])

    async function getParentData(name) {
        try {
            const data = await getUserByName(name);
            setUsers(data);
        } catch (error) {
            console.log(error)
            setUsers([])
        }
    };
    async function getStudentData(phoneNumber, classId) {
        try {
            const data = await getStudent(phoneNumber, classId);
            setChildrens(data);
        } catch (error) {
            console.log(error);
        }
    };
    async function checkPhoneExist(phone) {
        const data = await getUserByPhone(phone);
        if (data.phone && !isExist) {
            setPhoneNumberError("Số điện thoại đã tồn tại")
        } else {
            setPhoneNumberError(null)
        }
    };
    async function getCourseData(id) {
        const data = await getCourse(id);
        setCourse(data);
        setPrice(data.price)
    }
    async function getClassData(id) {
        const data = await getClass(id);
        setClassData(data);
    }
    useEffect(() => {
        getCourseData(courseId)
    }, [courseId])

    useEffect(() => {
        getClassData(classId)
    }, [classId])

    useEffect(() => {
        const regex = /^\+?[0-9]{10,11}$/;
        if (phoneNumber && phoneNumber.length >= 10) {
            if (regex.test(phoneNumber)) {
                checkPhoneExist(phoneNumber)
                if (!phoneNumberError) {
                    setPhoneNumberError(null)
                    getStudentData(phoneNumber, classId);
                }
            } else {
                setPhoneNumberError("Số điện thoại không hợp lệ")
            }
        }
    }, [phoneNumber])
    const debouncedGetParentData = useCallback(debounce((value) => {
        getParentData(value);
    }, 300), []);
    const toggleChildren = (children) => {
        if (childrensList.includes(children)) {
            setChildrensList(childrensList.filter(item => item !== children));
        } else {
            setChildrensList([...childrensList, children]);
        }
    };
    const deleteChildren = (index) => {
        const list = [...newChildrensList];
        list.splice(index, 1)
        setNewChildrensList(list)
    };
    const updateChildProperty = (index, columnName, newValue) => {
        setNewChildrensList(prevChildrensList => {
            const updatedChildrensList = [...prevChildrensList];
            const childToUpdate = updatedChildrensList[index];

            if (childToUpdate && columnName in childToUpdate) {
                childToUpdate[columnName] = newValue;
                return updatedChildrensList;
            } else {
                return prevChildrensList;
            }
        });
    };
    const handleFirstStep = () => {
        let check = true;
        const regex = /^\+?[0-9]{10,11}$/;
        checkPhoneExist(phoneNumber)
        if (!phoneNumber) {
            check = false;
            setPhoneNumberError("Vui lòng nhập số điện thoại")
        } else if (!regex.test(phoneNumber)) {
            check = false;
            setPhoneNumberError("Số điện thoại không hợp lệ")
        } else if (phoneNumberError) {
            check = false;
        } else {
            setPhoneNumberError(null)
        }
        if (!fullName) {
            check = false;
            setFullNameError("Vui lòng nhập họ và tên")
        } else {
            setFullNameError(null)
        }
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email) {
            check = false;
            setEmailError("Vui lòng nhập email")
        } else if (!re.test(email)) {
            check = false;
            setEmailError("Vui lòng nhập đúng email")
        } else {
            setEmailError(null)
        }
        if (childrensList.length === 0 && newChildrensList.length === 0) {
            check = false;
            setChildrensError("Vui lòng chọn hoặc thêm bé")
        } else {
            setChildrensError(null)
        }
        const newList = newChildrensList.map(child => {
            const errors = validateChildren(child);
            child.errors = errors;
            if (Object.values(errors).some(error => !!error)) {
                check = false;
            }
            return child;
        });
        setNewChildrensList(newList)
        if (check) {
            setCurrentStep(currentStep + 1)
        }
    }
    const handleSecondStep = async () => {
        try {
            setApiLoading(true)
            const staffUserCheckout = {
                fullName,
                phone: phoneNumber,
                email
            }
            const studentIdList = childrensList.map(child => child.studentId)
            const requests = [{
                classId,
                studentIdList
            }]
            const data = await cashCheckout({ staffUserCheckout, requests, createStudentRequest: newChildrensList})
            setPaymentResponse(data)
            setCurrentStep(currentStep + 1)
        } catch (error) {
            console.log(error)
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Đăng kí thất bại",
                text: error.response.data.Error,
                showConfirmButton: false
            }).then(() => { getCourseData(courseId) })
        } finally {
            setApiLoading(false)
        }
    }
    const validateChildren = (child) => {
        const errors = {};

        if (!child.fullName) {
            errors.fullNameError = 'Vui lòng nhập họ và tên';
        } else if (child.fullName.length < 5) {
            errors.fullNameError = 'Họ và tên bé tối thiểu 5 kí tự'
        } else {
            errors.fullNameError = '';
        }
        errors.dateOfBirthError = ''
        if (!child.dateOfBirth) {
            errors.dateOfBirthError = 'Vui lòng nhập ngày sinh';
        } else if (child.dateOfBirth) {
            const today = new Date();
            const birthDate = new Date(child.dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < course?.minYearOldsStudent || age > course?.maxYearOldsStudent) {
                errors.dateOfBirthError = `Tuổi của bé phải từ ${course?.minYearOldsStudent} đến ${course?.maxYearOldsStudent}`;
            }
        }

        if (!child.gender) {
            errors.genderError = 'Vui lòng chọn giới tính';
        } else {
            errors.genderError = '';
        }
        return errors;
    };


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Đăng kí khóa học</h2>
            <Steps
                className={styles.steps}
                current={currentStep}
                items={[
                    {
                        title: 'Thông tin đăng kí',
                    },
                    {
                        title: 'Xác nhận',
                    },
                    {
                        title: 'Hoàn thành',
                    },
                ]}
            />
            <Divider />
            {currentStep === 0 && (
                <Row>
                    <Col xs={24} lg={16}>
                        <h5 style={{ fontSize: '1.2rem', margin: 0 }}>Thông tin liên hệ</h5>
                        <p className={styles.addTitle}><span>*</span> Họ và tên:</p>
                        <AutoComplete
                            className={styles.input}
                            options={users?.map((user) => ({
                                value: `${user.fullName} - ${user.phone}`,
                                key: user.id,
                                user: user,
                                label: (
                                    <div key={user.id}>
                                        <span>{user.fullName}</span>
                                        <span style={{ float: 'right' }}>{user.phone && formatPhone(user.phone)}</span>
                                    </div>
                                ),
                            }))}
                            onSelect={(value, option) => {
                                setIsExist(true)
                                setFullName(option.user.fullName)
                                setPhoneNumber(option.user.phone)
                                setEmail(option.user.email)
                            }}
                            onChange={async (value) => {
                                setUsers([])
                                setIsExist(false)
                                setFullName(value)
                                setPhoneNumber(null)
                                setEmail(null)
                                setChildrens([])
                                setChildrensList([])
                                debouncedGetParentData(value);
                                const time = await getTime();
                                MockDate.set(new Date(time))
                            }}
                            placeholder="Họ và tên"
                        />
                        <div style={{ height: '24px' }}>
                            {fullNameError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{fullNameError}</p>)}
                        </div>
                        {!isExist &&
                            <>
                                <p className={styles.addTitle}><span>*</span> Số điện thoại:</p>
                                <Input
                                    allowClear
                                    placeholder="Số điện thoại phụ huynh"
                                    name='phoneNumber'
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className={styles.input}
                                    disabled={isExist}
                                    required
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {phoneNumberError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{phoneNumberError}</p>)}
                                </div>
                                <p className={styles.addTitle}><span>*</span> Email:</p>
                                <Input
                                    allowClear
                                    placeholder="Email"
                                    type='email'
                                    name='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    disabled={isExist}
                                    required
                                />
                                <div style={{ height: '24px' }}>
                                    {emailError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{emailError}</p>)}
                                </div>
                            </>
                        }
                        <div style={{ display: 'flex', marginTop: 20, justifyContent: 'space-between' }}>
                            <h5 style={{ fontSize: '1.2rem', margin: 0, marginLeft: 10 }}>Thông tin bé</h5>
                            <Button onClick={() => { setNewChildrensList([...newChildrensList, { fullName: null, dateOfBirth: dayjs().subtract(3, 'year'), gender: "Khác" }]) }} className={styles.addButton} icon={<PlusOutlined />}>
                                Thêm bé
                            </Button>
                        </div>
                        <div style={{ height: '24px', paddingLeft: '10px' }}>
                            {childrensError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{childrensError}</p>)}
                            {childrens.length === 0 && newChildrensList.length === 0 && <p style={{ fontSize: '1rem', textAlign: 'center' }}>Danh sách bé trống</p>}
                        </div>
                        <Row>
                            {childrens.length > 0 && childrens.map((child, index) =>
                                <Col key={index} xs={24} md={12} style={{ padding: 10 }}>
                                    {child.canRegistered ?
                                        <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: '20px 20px', height: '100%', boxSizing: 'border-box' }}>
                                            <Checkbox checked={childrensList.includes(child)} onChange={() => toggleChildren(child)} />
                                            <Row>
                                                <Col span={6} style={{ padding: '10px' }}>
                                                    <Avatar shape='square' alt={child.fullName} className={styles.avatar} src={child.avatarImage} />
                                                </Col>
                                                <Col span={14}>
                                                    <Row style={{ marginTop: 10 }}>
                                                        <Col span={8}>
                                                            <p className={styles.syllabusTitle}>Họ và tên:</p>
                                                        </Col>
                                                        <Col span={16}>
                                                            <p className={styles.syllabusInfo}>{child.fullName}</p>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: 20 }}>
                                                        <Col span={8}>
                                                            <p className={styles.syllabusTitle}>Tuổi:</p>
                                                        </Col>
                                                        <Col span={16}>
                                                            <p className={styles.syllabusInfo}>{child.dateOfBirth && (new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear())}</p>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: 20 }}>
                                                        <Col span={8}>
                                                            <p className={styles.syllabusTitle}>Giới tính:</p>

                                                        </Col>
                                                        <Col span={16}>
                                                            <p className={styles.syllabusInfo}>{child.gender}</p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                        : <div style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9', borderRadius: 6, padding: '20px 20px', height: '100%', boxSizing: 'border-box' }}>
                                            <Checkbox disabled checked={childrensList.includes(child)} onChange={() => toggleChildren(child)} />
                                            <Row>
                                                <Col span={6} style={{ padding: '10px' }}>
                                                    <Avatar shape='square' alt={child.fullName} className={styles.avatar} src={child.avatarImage} />
                                                </Col>
                                                <Col span={14}>
                                                    <Row style={{ marginTop: 10 }}>
                                                        <Col span={8}>
                                                            <p className={styles.syllabusTitle}>Họ và tên:</p>
                                                        </Col>
                                                        <Col span={16}>
                                                            <p className={styles.syllabusInfo}>{child.fullName}</p>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: 20 }}>
                                                        <Col span={8}>
                                                            <p className={styles.syllabusTitle}>Tuổi:</p>
                                                        </Col>
                                                        <Col span={16}>
                                                            <p className={styles.syllabusInfo}>{child.dateOfBirth && (new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear())}</p>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: 20 }}>
                                                        <Col span={8}>
                                                            <p className={styles.syllabusTitle}>Giới tính:</p>

                                                        </Col>
                                                        <Col span={16}>
                                                            <p className={styles.syllabusInfo}>{child.gender}</p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                </Col>
                            )}
                            {newChildrensList.length > 0 && newChildrensList.map((child, index) =>
                                <Col key={index} span={12} style={{ padding: 10 }}>
                                    <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: '20px 20px' }}>
                                        <DeleteOutlined style={{ fontSize: '1rem' }} onClick={() => deleteChildren(index)} />
                                        <Row style={{ marginTop: 10 }}>
                                            <Col span={8}>
                                                <p className={styles.addTitle}><span>*</span> Họ và tên:</p>
                                            </Col>
                                            <Col span={16}>
                                                <Input
                                                    placeholder="Họ và tên"
                                                    name='fullName'
                                                    value={child?.fullName}
                                                    onChange={(e) => updateChildProperty(index, 'fullName', e.target.value)}
                                                    className={styles.input}
                                                    required />
                                                <div style={{ height: '24px' }}>
                                                    {child?.errors?.fullNameError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{child.errors.fullNameError}</p>)}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={8}>
                                                <p className={styles.addTitle}><span>*</span> Ngày sinh:</p>
                                            </Col>
                                            <Col span={16}>
                                                <ConfigProvider
                                                    theme={{
                                                        components: {
                                                            DatePicker: {
                                                                activeBorderColor: '#f2c955'
                                                            },
                                                        },
                                                    }}>
                                                    <DatePicker
                                                        allowClear={false}
                                                        className={styles.input}
                                                        disabledDate={(current) => {
                                                            return (current > dayjs().subtract(3, 'year'))
                                                        }}
                                                        onChange={(date) => updateChildProperty(index, 'dateOfBirth', date)}
                                                        defaultValue={child?.dateOfBirth}
                                                        format={'DD/MM/YYYY'}
                                                        placeholder="Chọn ngày sinh" />
                                                </ConfigProvider>
                                                <div style={{ height: '24px' }}>
                                                    {child?.errors?.dateOfBirthError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{child.errors.dateOfBirthError}</p>)}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={8}>
                                                <p className={styles.addTitle}><span>*</span> Giới tính:</p>
                                            </Col>
                                            <Col span={16}>
                                                <Radio.Group onChange={(e) => { updateChildProperty(index, 'gender', e.target.value) }} value={child?.gender}>
                                                    <Radio value='Nữ'>Nữ</Radio>
                                                    <Radio value='Nam'>Nam</Radio>
                                                    <Radio value='Khác'>Khác</Radio>
                                                </Radio.Group>
                                                <div style={{ height: '24px' }}>
                                                    {child?.errors?.genderError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{child.errors.genderError}</p>)}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>)}
                        </Row>
                    </Col>
                    <Col xs={24} lg={8} className={styles.imageCol}>
                        {phoneNumber?.length >= 10 && fullName && email &&
                            <div style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: 6, padding: '30px 20px' }}>
                                <h5 style={{ fontSize: '1.2rem', margin: 0 }}>Thông tin phụ huynh</h5>
                                <Row style={{ marginTop: 10 }}>
                                    <Col span={8}>
                                        <p className={styles.syllabusTitle}>Họ và tên:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.syllabusInfo}>{fullName}</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col span={8}>
                                        <p className={styles.syllabusTitle}>Số điện thoại:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.syllabusInfo}>{phoneNumber && formatPhone(phoneNumber)}</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col span={8}>
                                        <p className={styles.syllabusTitle}>Email:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.syllabusInfo}>{email}</p>
                                    </Col>
                                </Row>
                            </div>
                        }
                        <div style={{ display: 'flex', marginTop: 20 }}>
                            <Button onClick={handleFirstStep} className={styles.saveButton}>
                                Tiếp theo
                            </Button>
                        </div>
                    </Col>
                </Row>
            )}
            {
                currentStep === 1 && (
                    <Row>
                        {((parent || (phoneNumber && fullName && email)) && childrensList) &&
                            <Col xs={24} lg={8} className={styles.imageCol}>
                                <div style={{ width: '100%', boxSizing: 'border-box', height: '100%', border: '1px solid #d9d9d9', borderRadius: 6, padding: '30px 20px' }}>
                                    <h5 style={{ fontSize: '1.2rem', margin: 0 }}>Thông tin đăng kí</h5>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col span={10}>
                                            <p className={styles.syllabusTitle}>Họ và tên phụ huynh:</p>
                                        </Col>
                                        <Col span={14}>
                                            <p className={styles.syllabusInfo}>{fullName}</p>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 20 }}>
                                        <Col span={10}>
                                            <p className={styles.syllabusTitle}>Số điện thoại:</p>
                                        </Col>
                                        <Col span={14}>
                                            <p className={styles.syllabusInfo}>{phoneNumber}</p>
                                        </Col>
                                    </Row>
                                </div>
                                {childrensList.length > 0 && childrensList.map((child, index) =>
                                    <div key={index} style={{ width: '100%', boxSizing: 'border-box', height: '100%', border: '1px solid #d9d9d9', borderRadius: 6, padding: '30px 20px', marginTop: 10 }}>
                                        <h5 style={{ fontSize: '1.2rem', margin: 0 }}>Thông tin bé</h5>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col span={10}>
                                                <p className={styles.syllabusTitle}>Họ và tên:</p>
                                            </Col>
                                            <Col span={14}>
                                                <p className={styles.syllabusInfo}>{child.fullName}</p>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: 20 }}>
                                            <Col span={10}>
                                                <p className={styles.syllabusTitle}>Tuổi:</p>
                                            </Col>
                                            <Col span={14}>
                                                <p className={styles.syllabusInfo}>{child.dateOfBirth && (new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear())}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                                {newChildrensList.length > 0 && newChildrensList.map((child, index) =>
                                    <div key={index} style={{ width: '100%', boxSizing: 'border-box', height: '100%', border: '1px solid #d9d9d9', borderRadius: 6, padding: '30px 20px', marginTop: 10 }}>
                                        <h5 style={{ fontSize: '1.2rem', margin: 0 }}>Thông tin bé</h5>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col span={10}>
                                                <p className={styles.syllabusTitle}>Họ và tên:</p>
                                            </Col>
                                            <Col span={14}>
                                                <p className={styles.syllabusInfo}>{child.fullName}</p>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: 20 }}>
                                            <Col span={10}>
                                                <p className={styles.syllabusTitle}>Tuổi:</p>
                                            </Col>
                                            <Col span={14}>
                                                <p className={styles.syllabusInfo}>{child.dateOfBirth && (new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear())}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </Col>
                        }
                        {course && classData &&
                            <Col xs={24} lg={8} className={styles.imageCol}>
                                <div style={{ width: '100%', boxSizing: 'border-box', height: '100%', border: '1px solid #d9d9d9', borderRadius: 6, padding: '30px 20px' }}>
                                    <h5 style={{ fontSize: '1.2rem', margin: 0 }}>Thông tin khóa học</h5>
                                    <Row style={{ marginTop: 20 }}>
                                        <Col span={8}>
                                            <p className={styles.syllabusTitle}>Tên khóa học:</p>
                                        </Col>
                                        <Col span={16}>
                                            <p className={styles.syllabusInfo}>{course?.name}</p>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 20 }}>
                                        <Col span={8}>
                                            <p className={styles.syllabusTitle}>Mã lớp học:</p>
                                        </Col>
                                        <Col span={16}>
                                            <p className={styles.syllabusInfo}>{classData?.classCode}</p>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 20 }}>
                                        <Col span={8}>
                                            <p className={styles.syllabusTitle}>Lịch học:</p>
                                        </Col>
                                        <Col span={16}>
                                            {classData?.schedules && classData.schedules.map((session, index) => (
                                                <p className={styles.syllabusInfo} key={index}>
                                                    {formatDayOfWeek(session.dayOfWeek)}:&ensp;{session.startTime} - {session.endTime}
                                                </p>
                                            ))}
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 20 }}>
                                        <Col span={8}>
                                            <p className={styles.syllabusTitle}>Ngày bắt đầu:</p>
                                        </Col>
                                        <Col span={16}>
                                            <p className={styles.syllabusInfo}>{classData?.startDate && `${formatDate(classData?.startDate)}`}</p>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        }
                        <Col xs={24} lg={8} className={styles.imageCol}>
                            <div style={{ width: '100%', boxSizing: 'border-box', height: '100%', border: '1px solid #d9d9d9', borderRadius: 6, padding: '30px 20px' }}>
                                <h5 style={{ fontSize: '1.2rem', margin: 0 }}>Thông tin thanh toán</h5>
                                <Row style={{ marginTop: 10 }}>
                                    <Col span={8}>
                                        <p className={styles.syllabusTitle}>Chi phí khóa học:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.syllabusInfo}>{price.toLocaleString()} đ</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col span={8}>
                                        <p className={styles.syllabusTitle}>Tổng chi phí:</p>
                                    </Col>
                                    <Col span={16}>
                                        <p className={styles.syllabusInfo}>{(price * childrensList.length + price * newChildrensList.length).toLocaleString()} đ</p>
                                    </Col>
                                </Row>
                                {/* <Row style={{ marginTop: 20 }}>
                                    <Col span={10}>
                                        <p className={styles.syllabusTitle}>Hình thức thanh toán:</p>
                                    </Col>
                                    <Col span={14} style={{ textAlign: 'right' }}>
                                        <Radio.Group onChange={(e) => setMethod(e.target.value)} value={method}>
                                            <Space direction="vertical">
                                                <Radio className={styles.syllabusInfo} style={{ display: 'flex', flexDirection: 'row-reverse', marginInlineEnd: 0 }} value='cash'>Tiền mặt</Radio>
                                                <Radio className={styles.syllabusInfo} style={{ display: 'flex', flexDirection: 'row-reverse', marginInlineEnd: 0 }} value='transfer'>Chuyển khoản</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Col>
                                </Row> */}
                                <div style={{ display: 'flex', marginTop: 20, justifyContent: 'flex-end' }}>
                                    <Button disabled={apiLoading} style={{ marginRight: 10 }} onClick={() => { setCurrentStep(currentStep - 1) }} className={styles.saveButton}>
                                        Quay lại
                                    </Button>
                                    <Button loading={apiLoading} onClick={handleSecondStep} className={styles.saveButton}>
                                        Đăng kí
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                )
            }
            {currentStep === 2 && (
                <Row>
                    <Col span={6}></Col>
                    <Col span={12} style={{ padding: 10 }}>
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: '20px 20px', height: '100%', boxSizing: 'border-box' }}>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img className={styles.image} alt="image" src={'../../src/assets/images/success.png'} />
                                    <h5 style={{ fontSize: '1.5rem', margin: '20px 20px', color: '#20bf55' }}>Đăng kí thành công</h5>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={8}>
                                    <p className={styles.syllabusTitle}>Thời gian:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.syllabusInfo}>{paymentResponse && formatDateTime(paymentResponse.date)}</p>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={8}>
                                    <p className={styles.syllabusTitle}>Số tiền:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.syllabusInfo}>{paymentResponse && paymentResponse.moneyAmount.toLocaleString()} đ</p>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={8}>
                                    <p className={styles.syllabusTitle}>Hình thức thanh toán:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.syllabusInfo}>{paymentResponse && paymentResponse.method}</p>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={8}>
                                    <p className={styles.syllabusTitle}>Người thanh toán:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.syllabusInfo}>{fullName}</p>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={8}>
                                    <p className={styles.syllabusTitle}>Nội dung:</p>
                                </Col>
                                <Col span={16}>
                                    <p className={styles.syllabusInfo}>{paymentResponse && paymentResponse.message}</p>
                                </Col>
                            </Row>
                            <div style={{ width: '100%', paddingTop: 20, textAlign: 'right' }}>
                                <Button loading={apiLoading} onClick={() => { navigate('/course-register') }} className={styles.saveButton}>
                                    Quay về trang chủ
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}></Col>
                </Row>
            )}
        </div >
    )
}