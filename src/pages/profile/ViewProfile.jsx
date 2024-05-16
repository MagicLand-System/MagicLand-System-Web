import React, { useEffect, useState } from 'react'
import styles from './ViewProfile.module.css'
import { Button, Input, Table, Checkbox, Select, DatePicker, ConfigProvider, Row, Col, Descriptions, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Alert from 'antd/es/alert/Alert';
import OtpInput from 'otp-input-react';
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css";
import { auth } from '../../../firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Swal from 'sweetalert2';

import { useSelector, useDispatch } from 'react-redux';
import { userSelector } from '../../store/selectors';
import { formatDate, formatPhone } from '../../utils/utils';
import { fetchUser } from "../../store/features/authSlice";
import { checkExist } from '../../api/auth';

export default function ViewProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    let user = useSelector(userSelector);
    const [changePhoneModalOpen, setChangePhoneModalOpen] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [otp, setOtp] = useState('')
    const [phone, setPhone] = useState('')
    const [showOtp, setShowOtp] = useState(false)
    const items = [
        {
            key: 'fullName',
            label: 'Họ và tên',
            children: user?.fullName,
            span: 3,
        },
        {
            key: 'phone',
            label: 'Số điện thoại',
            children: user?.phone && formatPhone(user?.phone),
            span: 1,
        },
        {
            key: 'email',
            label: 'Email',
            children: user?.email ? user?.email : 'Chưa có',
            span: 2,
        },
        {
            key: 'gender',
            label: 'Giới tính',
            children: user?.gender,
            span: 1,
        },
        {
            key: 'dateOfBirth',
            label: 'Ngày sinh',
            children: user?.dateOfBirth ? formatDate(user?.dateOfBirth) : 'Chưa có',
            span: 2,
        },
        {
            key: 'address',
            label: 'Địa chỉ',
            children: user?.address ? user?.address : 'Chưa có',
            span: 3,
        },
        {
            key: 'role',
            label: 'Vai trò',
            children: user?.role?.name && user.role.name.toLowerCase().includes('staff')
                ? <div style={{ backgroundColor: '#E5F2FF', color: '#0066FF' }} className={styles.status}>Nhân viên</div>
                : user.role.name.toLowerCase().includes('admin')
                && <div style={{ backgroundColor: '#e7e9ea', color: '#495057' }} className={styles.status}>Quản trị viên</div>,
            span: 3,
        },
    ];
    function onCaptchVerify() {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    onChangePassword()
                },
                'expired-callback': () => {
                    // window.recaptchaVerifier.reset()
                }
            }, auth);
        }
    }
    async function onChangePassword() {
        try {
            setErrorMessage('')
            setApiLoading(true)
            const formatPhone = '+' + phone;
            const data = await checkExist({ phone: formatPhone })
            if (data) {
                setApiLoading(false)
                setErrorMessage("Số điện thoại đã tồn tại")
            } else {
                onCaptchVerify()
                const appVerifier = window.recaptchaVerifier;
                signInWithPhoneNumber(auth, formatPhone, appVerifier)
                    .then((confirmationResult) => {
                        window.confirmationResult = confirmationResult;
                        setApiLoading(false)
                        setErrorMessage('')
                        setShowOtp(true)
                    }).catch((error) => {
                        console.log(error)
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }
    function onOtpVerify() {
        setErrorMessage('')
        setApiLoading(true)
        const formatPhone = '+' + phone;
        window.confirmationResult.confirm(otp).then(async (result) => {
            await updateCurrentUser({ phone: formatPhone })
                .then(() => {
                    setApiLoading(false)
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "thay đổi số điện thoại thành công",
                        showConfirmButton: false,
                        timer: 2000
                    })
                })
                .then(() => {
                    dispatch(fetchUser())
                })
                .then(() => {
                    setErrorMessage('')
                    navigate('/')
                })
        }).catch(err => {
            setErrorMessage("Xác thực OTP không thành công")
            setApiLoading(false)
        })
    }
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Thông tin tài khoản</h2>
            <Row>
                <Col md={8} className={styles.left}>
                    <img className={styles.avatar} alt="children" src={user?.avatarImage ? user?.avatarImage : './src/assets/images/empty_avatar.png'} />
                    <Button style={{ width: '220px' }} onClick={() => navigate('/update-profile')} className={styles.button}>
                        Chỉnh sửa thông tin
                    </Button>
                    <Button style={{ width: '220px' }} onClick={() => setChangePhoneModalOpen(true)} className={styles.button}>
                        Thay đổi số điện thoại
                    </Button>
                </Col>
                <Col md={16} className={styles.right} style={{ width: '100%' }}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Descriptions: {
                                    labelBg: '#feedbd'
                                },
                            },
                        }}
                    >
                        <Descriptions style={{ width: '100%' }} bordered items={items} />
                    </ConfigProvider>
                </Col>
            </Row>
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
                    title="Thay đổi số điện thoại"
                    centered
                    open={changePhoneModalOpen}
                    footer={null}
                    onCancel={() => setChangePhoneModalOpen(false)}
                    classNames={{ header: styles.modalHeader }}
                >
                    <div>
                        <div id='recaptcha-container'></div>
                        {!showOtp ? (
                            <Row>
                                <Col span={8}>
                                    <p className={styles.addTitle} ><span>*</span> Số điện thoại:</p>
                                </Col>
                                <Col span={16}>
                                    <PhoneInput country={'vn'} className={styles.input} value={phone} onChange={setPhone} disabled={apiLoading} />
                                </Col>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    {apiLoading ? (
                                        <Button style={{ width: 220 }} loading className={styles.button}>Gửi OTP</Button>
                                    ) : phone === '' ? (
                                        <Button style={{ width: 220 }} disabled className={styles.button}>Gửi OTP</Button>
                                    ) : (
                                        <Button style={{ width: 220 }} onClick={onChangePassword} className={styles.button}>Gửi OTP</Button>
                                    )}
                                </div>
                            </Row>
                        ) : (
                            <div>
                                <p>Chúng tôi đã gửi một mã xác thực đến số điện thoại +{phone.substring(0, 6)}*****:</p>
                                <div style={{ textAlign: 'center', marginLeft: 20 }}>
                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        OTPLength={6}
                                        otpType="number"
                                        disabled={apiLoading}
                                        autoFocus
                                        className={styles.otpInput}
                                    >
                                    </OtpInput>
                                </div>
                                <p style={{ textAlign: 'center', color: 'black', marginTop: '0px' }}>Chưa nhận được mã? <Link onClick={onChangePassword} style={{ color: '#f2c955', textDecoration: 'underline' }}>Gửi lại</Link></p>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    {apiLoading ? (
                                        <Button style={{ width: 220 }} loading className={styles.button}>Xác thực</Button>
                                    ) : otp.length < 6 ? (
                                        <Button style={{ width: 220 }} disabled className={styles.button}>Xác thực</Button>
                                    ) : (
                                        <Button style={{ width: 220 }} onClick={onOtpVerify} className={styles.button}>Xác thực</Button>
                                    )}
                                </div>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {errorMessage !== '' && (
                                <Alert style={{ width: '55%', marginTop: '10px' }} message={errorMessage} type="error" showIcon />
                            )}
                        </div>
                    </div>
                </Modal>
            </ConfigProvider>
        </div>
    )
}
