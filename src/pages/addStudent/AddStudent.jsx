import React, { useRef, useState } from 'react'
import styles from './AddStudent.module.css'
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'
import { Button, Col, ConfigProvider, DatePicker, Input, Radio, Row } from 'antd'
import { addStudent } from '../../api/student';
import { CloudUploadOutlined } from '@ant-design/icons';
import { storage } from '../../../firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../store/features/authSlice';

export default function AddStudent() {
    const dispatch = useDispatch()
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null)
    const [dateOfBirth, setDateOfBirth] = useState(dayjs().subtract(3, 'year'))
    const [gender, setGender] = useState('Khác')
    const [dateOfBirthError, setDateOfBirthError] = useState(null)
    const [imageError, setImageError] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)

    const formik = useFormik({
        initialValues: {
            fullName: '',
        },
        onSubmit: async values => {
            if (image !== null) {
                const imageRef = ref(storage, `childrens/${image.name + v4()}`);
                uploadBytes(imageRef, image).then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        if (dateOfBirth === null) {
                            setDateOfBirthError("Vui lòng nhập ngày tháng năm sinh")
                        } else {
                            const stringDateOfBirth = dateOfBirth.toISOString()
                            addStudent({ ...values, gender, dateOfBirth: stringDateOfBirth, avatarImage: url })
                                .then(
                                    Swal.fire({
                                        position: "center",
                                        icon: "success",
                                        title: "Thêm học viên thành công",
                                        showConfirmButton: false,
                                        timer: 2000
                                    })
                                )
                        }
                    }).catch(error => {
                        console.log(error.message, "error getting image url")
                    })
                    setImage(null);
                    formik.resetForm()
                    dispatch(fetchUser())
                }).catch(error => {
                    console.log(error.message)
                })
            } else {
                setImageError("Hãy cung cấp hình ảnh học viên")
            }
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required("Vui lòng nhập họ và tên").matches(/(\w.+\s).+/, 'Vui lòng nhập ít nhất 2 từ'),
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
            <h2 className={styles.title}>Thêm học viên</h2>
            <Row>
                <Col md={8} className={styles.left}>
                    <img className={styles.avatar} alt="children" src={image ? imageUrl : './src/assets/images/empty_avatar.png'} />
                    <input type='file' ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                    <Button style={{ width: '180px' }} onClick={() => fileInputRef.current.click()} icon={<CloudUploadOutlined />} className={styles.button}>
                        Tải hình lên
                    </Button>
                    <div style={{ height: '24px', paddingLeft: '10px' }}>
                        {imageError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{imageError}</p>)}
                    </div>
                </Col>
                <Col md={16} className={styles.right} style={{ width: '100%' }}>
                    <form onSubmit={formik.handleSubmit} className={styles.form}>
                        <Input
                            placeholder="Họ và tên"
                            name='fullName'
                            value={formik.values.fullName}
                            onChange={formik.handleChange}
                            error={formik.touched.fullName && formik.errors.fullName}
                            className={styles.input}
                            required
                        />
                        <div style={{ height: '24px', paddingLeft: '10px' }}>
                            {formik.errors.fullName && formik.touched.fullName && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.fullName}</p>)}
                        </div>
                        <p style={{ color: '#c0c0c0', fontSize: 16, marginBottom: 5, marginTop: 0 }}>Ngày sinh</p>
                        <DatePicker
                            style={{ width: '100%', height: '40px' }}
                            disabledDate={(current) => {
                                return (current > dayjs().subtract(3, 'year'))
                            }}
                            onChange={(date) => setDateOfBirth(date)}
                            defaultValue={dateOfBirth}
                            format={'DD/MM/YYYY'}
                            placeholder="Chọn ngày sinh" />
                        <div style={{ height: '24px', paddingLeft: '10px' }}>
                            {dateOfBirthError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{dateOfBirthError}</p>)}
                        </div>
                        <p style={{ color: '#c0c0c0', fontSize: 16, marginBottom: 5, marginTop: 0 }}>Giới tính</p>
                        <div style={{ margin: '10px' }}>
                            <Radio.Group onChange={(e) => { setGender(e.target.value) }} value={gender}>
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
                        </div>
                        <Button htmlType='submit' className={styles.button} disabled={!formik.isValid}>
                            Xác nhận
                        </Button>
                    </form>
                </Col>
            </Row>
        </div>
    )
}
