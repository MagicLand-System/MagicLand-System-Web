import React, { useRef, useState } from 'react'
import styles from './UpdateProfile.module.css'
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'
import { Button, Col, ConfigProvider, DatePicker, Input, Radio, Row } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons';
import { storage } from '../../../../firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../../store/features/authSlice';
import { useNavigate } from 'react-router-dom';
import { userSelector } from '../../../store/selectors';
import { updateCurrentUser } from '../../../api/user';

export default function UpdateProfile() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let user = useSelector(userSelector);
    const [apiLoading, setApiLoading] = useState(false)

    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null)
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth ? dayjs(user.dateOfBirth) : dayjs())
    const [gender, setGender] = useState(user.gender ? user.gender : 'Khác')
    const [dateOfBirthError, setDateOfBirthError] = useState(null)
    const [imageUrl, setImageUrl] = useState(user.imageUrl)
    const [address, setAddress] = useState(user.address)
    const [addressError, setAddressError] = useState(null)

    const formik = useFormik({
        initialValues: {
            fullName: user.fullName,
            email: user.email,
        },
        onSubmit: async values => {
            if (image) {
                const imageRef = ref(storage, `users/${image.name + v4()}`);
                uploadBytes(imageRef, image).then(() => {
                    getDownloadURL(imageRef).then(async (url) => {
                        if (!dateOfBirth || !address) {
                            if (!dateOfBirth) {
                                setDateOfBirthError("Vui lòng nhập ngày tháng năm sinh")
                            } else {
                                setDateOfBirthError(null)
                            }
                            if (!address) {
                                setAddressError("Vui lòng nhập địa chỉ")
                            } else {
                                setAddressError(null)
                            }
                        } else {
                            const stringDateOfBirth = dateOfBirth.toISOString()
                            const data = await updateCurrentUser({ ...values, avatarImage: url, gender, dateOfBirth: stringDateOfBirth, address })
                            if (data) {
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Chỉnh sửa thông tin thành công",
                                    showConfirmButton: false,
                                    timer: 2000
                                }).then(() => {
                                    dispatch(fetchUser())
                                    navigate(-1)
                                })
                            }
                        }
                    }).catch(error => {
                        Swal.fire({
                            icon: "error",
                            title: "Chỉnh sửa thông tin thất bại",
                            showConfirmButton: false,
                            timer: 2000
                        })
                        console.log(error.message)
                    })
                }).catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Chỉnh sửa thông tin thất bại",
                        showConfirmButton: false,
                        timer: 2000
                    })
                    console.log(error.message)
                })
            } else {
                try {
                    setApiLoading(true)
                    if (!dateOfBirth || !address) {
                        if (!dateOfBirth) {
                            setDateOfBirthError("Vui lòng nhập ngày tháng năm sinh")
                        } else {
                            setDateOfBirthError(null)
                        }
                        if (!address) {
                            setAddressError("Vui lòng nhập địa chỉ")
                        } else {
                            setAddressError(null)
                        }
                    } else {
                        const stringDateOfBirth = dateOfBirth.toISOString()
                        const data = await updateCurrentUser({ ...values, gender, dateOfBirth: stringDateOfBirth, address })
                        if (data) {
                            await signOut(auth)
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Chỉnh sửa thông tin thành công",
                                showConfirmButton: false,
                                timer: 2000
                            }).then(() => {
                                dispatch(fetchUser())
                                navigate(-1)
                            })
                        }
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Chỉnh sửa thông tin thất bại",
                        text: error.response.data.Error,
                        showConfirmButton: false,
                        timer: 2000
                    })
                    console.log(error.message)
                } finally {
                    setApiLoading(false)
                }
            }
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required("Vui lòng nhập họ và tên").matches(/(\w.+\s).+/, 'Vui lòng nhập ít nhất 2 từ'),
            email: Yup.string().email("Vui lòng nhập đúng email").required("Vui lòng nhập email"),
        }),
    });
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const selectedImage = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
                setImage(e.target.files[0])
            };
            reader.readAsDataURL(selectedImage);
        }
    }
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Chỉnh sửa thông tin</h2>
            <Row>
                <Col md={8} className={styles.left}>
                    <img className={styles.avatar} alt="children" src={image ? imageUrl : './src/assets/images/empty_avatar.png'} />
                    <input type='file' accept='image/*' ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                    <Button style={{ width: '180px' }} onClick={() => fileInputRef.current.click()} icon={<CloudUploadOutlined />} className={styles.button}>
                        Tải hình lên
                    </Button>
                </Col>
                <Col md={16} className={styles.right} style={{ width: '100%' }}>
                    <form onSubmit={formik.handleSubmit} className={styles.form}>
                        <Row>
                            <Col span={4}>
                                <p className={styles.addTitle} ><span>*</span> Họ và tên:</p>
                            </Col>
                            <Col span={20}>
                                <Input
                                    placeholder="Họ và tên"
                                    name='fullName'
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.fullName && formik.errors.fullName}
                                    className={styles.input}
                                    required
                                    disabled={apiLoading}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.fullName && formik.touched.fullName && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.fullName}</p>)}
                                </div>
                            </Col>
                            <Col span={4}>
                                <p className={styles.addTitle} ><span>*</span> Email:</p>
                            </Col>
                            <Col span={20}>
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
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.email && formik.touched.email && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.email}</p>)}
                                </div>
                            </Col>
                            <Col span={4}>
                                <p className={styles.addTitle} ><span>*</span> Ngày sinh:</p>
                            </Col>
                            <Col span={20}>
                                <DatePicker
                                    allowClear={false}
                                    style={{ width: '100%', height: '40px' }}
                                    disabledDate={(current) => {
                                        return (current > dayjs().subtract(3, 'year'))
                                    }}
                                    onChange={(date) => setDateOfBirth(date)}
                                    defaultValue={dateOfBirth}
                                    format={'DD/MM/YYYY'}
                                    placeholder="Chọn ngày sinh"
                                    disabled={apiLoading}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {dateOfBirthError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{dateOfBirthError}</p>)}
                                </div>
                            </Col>
                            <Col span={4} style={{ marginBottom: '24px' }}>
                                <p className={styles.addTitle} ><span>*</span> Giới tính:</p>
                            </Col>
                            <Col span={20} style={{ marginBottom: '24px' }}>
                                <Radio.Group onChange={(e) => { setGender(e.target.value) }} value={gender} disabled={apiLoading} style={{ marginTop: '10px' }}>
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Radio: {
                                                    buttonSolidCheckedActiveBg: '#f2c955',
                                                    buttonSolidCheckedBg: '#f2c955',
                                                    buttonSolidCheckedHoverBg: '#f2c955',
                                                },
                                            },
                                        }}
                                    >
                                        <Radio value='Nữ'>Nữ</Radio>
                                        <Radio value='Nam'>Nam</Radio>
                                        <Radio value='Khác'>Khác</Radio>
                                    </ConfigProvider>
                                </Radio.Group>
                            </Col>
                            <Col span={4}>
                                <p className={styles.addTitle} ><span>*</span> Địa chỉ:</p>
                            </Col>
                            <Col span={20}>
                                <Input
                                    placeholder="Address"
                                    name='address'
                                    value={address}
                                    onChange={(e) => { setAddress(e.target.value) }}
                                    className={styles.input}
                                    required
                                    disabled={apiLoading}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {addressError && (<p style={{ color: 'red', fontSize: '14  px', margin: '0' }}>{addressError}</p>)}
                                </div>
                            </Col>
                        </Row>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button loading={apiLoading} className={styles.saveButton} htmlType='submit'>
                                Lưu
                            </Button>
                            <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => {
                                navigate(-1)
                            }}>
                                Hủy
                            </Button>
                        </div>
                    </form>
                </Col>
            </Row>
        </div>
    )
}