import React, { useRef, useState } from 'react'
import styles from './Register.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { Button, ConfigProvider, DatePicker, Input, Radio } from 'antd'
import Alert from 'antd/es/alert/Alert';
import OtpInput from 'otp-input-react';
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css"
import { auth, firebaseConfig } from '../../../firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs'
import { checkExist, register } from '../../api/auth';
import { usePlacesWidget } from 'react-google-autocomplete';

export default function Register() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [otp, setOtp] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [showFillInfo, setShowFillInfo] = useState(true)

  const [dateOfBirth, setDateOfBirth] = useState(dayjs().subtract(3, 'year'))
  const [gender, setGender] = useState('Khác')
  const [dateOfBirthError, setDateOfBirthError] = useState(null)

  const [address, setAddress] = useState(null)
  const [addressError, setAddressError] = useState(null)

  const addressRef = useRef(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          onSignup()
        },
        'expired-callback': () => {
          // window.recaptchaVerifier.reset()
        }
      }, auth);
    }
  }
  async function onSignup() {
    setLoading(true)
    try {
      setErrorMessage('')
      const response = await checkExist({ phone: `+${phone}` })
      if (response.status === 200) {
        setErrorMessage("Số điện thoại đã tồn tại, hãy đăng nhập để tiếp tục");
        setLoading(false)
      }
    }
    catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage('')
        onCaptchVerify()
        const appVerifier = window.recaptchaVerifier;
        const formatPhone = '+' + phone;
        signInWithPhoneNumber(auth, formatPhone, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setLoading(false)
            setShowOtp(true)
          }).catch((error) => {
            console.log(error)
          })
      }
    }
  }

  function onOtpVerify() {
    setErrorMessage('')
    setLoading(true)
    window.confirmationResult.confirm(otp).then(async (result) => {
      setErrorMessage('')
      setLoading(false)
      setShowOtp(false)
      setShowFillInfo(true)
    }).catch(err => {
      setErrorMessage("Xác thực OTP không thành công")
      setLoading(false)
    })
  }
  const { ref: adrRef } = usePlacesWidget({
    apiKey: firebaseConfig.apiKey,
    onPlaceSelected: (place) => {
      const formattedAddress = place.formatted_address;
      if (addressRef.current && formattedAddress) {
        addressRef.current.value = formattedAddress;
        setAddress(formattedAddress);
      }
    },
    language: 'vi',
    options: {
      types: ["(regions)"],
      componentRestrictions: { country: "vn" },
    },
  })
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
    },
    onSubmit: async values => {
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
        const data = await register({ ...values, phone: `+${phone}`, gender, dateOfBirth: stringDateOfBirth, address })
        if (data) {
          await signOut(auth)
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Đăng kí thành công",
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            navigate('/login')
          })
        }
      }
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Vui lòng nhập họ và tên").matches(/(\w.+\s).+/, 'Vui lòng nhập ít nhất 2 từ'),
      email: Yup.string().email("Vui lòng nhập đúng email").required("Vui lòng nhập email"),
    }),
  });
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <img src='./src/assets/images/logo.png' alt="logo" />
          <p>&ensp;
            <span className={`${styles.m} ${styles.logoSpan}`}>m</span>
            <span className={`${styles.a} ${styles.logoSpan}`}>a</span>
            <span className={`${styles.g} ${styles.logoSpan}`}>g</span>
            <span className={`${styles.i} ${styles.logoSpan}`}>i</span>
            <span className={`${styles.c} ${styles.logoSpan}`}>c</span>&nbsp;
            <span className={`${styles.l} ${styles.logoSpan}`}>l</span>
            <span className={`${styles.a} ${styles.logoSpan}`}>a</span>
            <span className={`${styles.n} ${styles.logoSpan}`}>n</span>
            <span className={`${styles.d} ${styles.logoSpan}`}>d</span>
          </p>
        </div>
        <div id='recaptcha-container'></div>
        {(!showOtp && !showFillInfo) ? (
          <>
            <h2 className={styles.title}>Đăng kí</h2>
            <div className={styles.form}>
              <PhoneInput country={'vn'} className={styles.phoneInput} value={phone} onChange={setPhone} disabled={loading} />
              {loading ? (
                <Button loading className={styles.button}>Gửi OTP</Button>
              ) : phone === '' ? (
                <Button disabled className={styles.button}>Gửi OTP</Button>
              ) : (
                <Button onClick={onSignup} className={styles.button}>Gửi OTP</Button>
              )}
              <p style={{ textAlign: 'center', color: 'black', marginTop: '0px' }}>Đã có tài khoản? <Link to={'/login'} style={{ color: '#f2c955', textDecoration: 'underline' }}>Đăng nhập ngay</Link></p>
            </div>
          </>
        ) : (showOtp && !showFillInfo) ? (
          <>
            <h2 className={styles.title}>Xác thực OTP</h2>
            <div className={styles.form}>
              <p>Chúng tôi đã gửi một mã xác thực đến số điện thoại +{phone.substring(0, 6)}*****:</p>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={loading}
                autoFocus
                className={styles.otpInput}
              >
              </OtpInput>
              <p style={{ textAlign: 'center', color: 'black', marginTop: '0px' }}>Chưa nhận được mã? <Link onClick={onSignup} style={{ color: '#f2c955', textDecoration: 'underline' }}>Gửi lại</Link></p>
              {loading ? (
                <Button loading className={styles.button}>Xác thực</Button>
              ) : otp.length < 6 ? (
                <Button disabled className={styles.button}>Xác thực</Button>
              ) : (
                <Button onClick={onOtpVerify} className={styles.button}>Xác thực</Button>
              )}
            </div>
          </>
        ) : (!showOtp && showFillInfo) && (
          <>
            <h2 className={styles.title} style={{ marginTop: '20px' }}>Thông tin</h2>
            <form onSubmit={formik.handleSubmit} style={{ marginTop: 0, width: '60%', marginBottom: 20 }} className={styles.form}>
              <p className={styles.addTitle}><span>*</span> Họ và tên:</p>
              <Input
                placeholder="Họ và tên"
                name='fullName'
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && formik.errors.fullName}
                className={styles.input}
                required
                disabled={loading}
              />
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {formik.errors.fullName && formik.touched.fullName && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.fullName}</p>)}
              </div>
              <p className={styles.addTitle}><span>*</span> Email:</p>
              <Input
                placeholder="Email"
                name='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
                className={styles.input}
                required
                disabled={loading}
              />
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {formik.errors.email && formik.touched.email && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.email}</p>)}
              </div>
              <p className={styles.addTitle}><span>*</span> Ngày sinh:</p>

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
                  onChange={(date) => setDateOfBirth(date)}
                  value={dateOfBirth}
                  format={'DD/MM/YYYY'}
                  placeholder="Chọn ngày sinh"
                  disabled={loading} />
              </ConfigProvider>
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {dateOfBirthError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{dateOfBirthError}</p>)}
              </div>
              <p className={styles.addTitle}><span>*</span> Giới tính:</p>
              <div style={{ margin: '10px' }}>
                <Radio.Group disabled={loading} onChange={(e) => { setGender(e.target.value) }} value={gender}>
                  <Radio value='Nữ'>Nữ</Radio>
                  <Radio value='Nam'>Nam</Radio>
                  <Radio value='Khác'>Khác</Radio>
                </Radio.Group>
              </div>
              <p className={styles.addTitle}><span>*</span> Địa chỉ:</p>
              {/* <Input
                ref={(c) => {
                  addressRef.current = c;
                  if (c) adrRef.current = c.input;
                }}
                className={styles.input}
                required
                disabled={loading}
              /> */}
              <Input
                placeholder="Address"
                name='address'
                value={address}
                onChange={(e) => { setAddress(e.target.value) }}
                className={styles.input}
                required
                disabled={loading}
              />
              <div style={{ height: '24px', paddingLeft: '10px' }}>
                {addressError && (<p style={{ color: 'red', fontSize: '14  px', margin: '0' }}>{addressError}</p>)}
              </div>
              <Button loading={loading} htmlType='submit' className={styles.button}>
                Xác nhận
              </Button>
            </form>
          </>
        )}
        {errorMessage !== '' && (
          <Alert style={{ width: '55%', marginTop: '20px' }} message={errorMessage} type="error" showIcon />
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.rightLink}>
          <Link to={'/login'} className={styles.link}>Đăng nhập</Link>
          <Link className={`${styles.link} ${styles.linkActive}`}>Đăng kí</Link>
        </div>
        <img className={styles.rightImage} src="./src/assets/images/kid2.jpg" />
      </div>
    </div>
  )
}
