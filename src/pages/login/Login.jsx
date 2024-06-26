import React, { useState } from 'react'
import styles from './Login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import Alert from 'antd/es/alert/Alert';
import OtpInput from 'otp-input-react';
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css"
import { auth } from '../../../firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Swal from 'sweetalert2';
import { authUser, checkExist } from '../../api/auth';
import { useDispatch } from 'react-redux';
import { fetchUser } from "../../store/features/authSlice";

import kidImage from '../../assets/images/kid2.jpg'
import logo from '../../assets/images/logo.png';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [otp, setOtp] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          onLogin()
        },
        'expired-callback': () => {
          window.recaptchaVerifier.reset()
        }
      }, auth);
    }
  }
  async function onLogin() {
    try {
      setErrorMessage('')
      setLoading(true)
      const formatPhone = '+' + phone;
      const data = await checkExist({ phone: formatPhone })
      if (data) {
        if (data.role === "STAFF" || data.role === "ADMIN") {
          onCaptchVerify()
          const appVerifier = window.recaptchaVerifier;
          signInWithPhoneNumber(auth, formatPhone, appVerifier)
            .then((confirmationResult) => {
              window.confirmationResult = confirmationResult;
              setLoading(false)
              setErrorMessage('')
              setShowOtp(true)
            }).catch((error) => {
              console.log(error)
            })
        } else {
          setLoading(false)
          setErrorMessage('Tài khoản của bạn không được hỗ trợ trên nền tảng này')
        }
      }
    } catch (error) {
      console.log(error)
      if (error.response?.status === 404) {
        setLoading(false)
        setErrorMessage("Tài khoản của bạn không tồn tại, hãy đăng kí để tiếp tục");
      } else {
        setLoading(false)
        setErrorMessage("Số điện thoại không hợp lệ");
      }
    }
  }

  function onOtpVerify() {
    setErrorMessage('')
    setLoading(true)
    const formatPhone = '+' + phone;
    window.confirmationResult.confirm(otp).then(async (result) => {
      const data = await authUser({ phone: formatPhone })
      const accessToken = data.accessToken;
      localStorage.setItem('accessToken', accessToken)
      dispatch(fetchUser())
        // .then(Swal.fire({
        //   position: "center",
        //   icon: "success",
        //   title: "Đăng nhập thành công",
        //   showConfirmButton: false,
        //   timer: 2000
        // }))
        .then(() => {
          setErrorMessage('')
          navigate('/')
        })
      setLoading(false)
    }).catch(err => {
      setErrorMessage("Xác thực OTP không thành công")
      setLoading(false)
    })
  }
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
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
        {!showOtp ? (
          <>
            <h2 className={styles.title}>Đăng nhập</h2>
            <div className={styles.form}>
              <PhoneInput country={'vn'} className={styles.input} value={phone} onChange={setPhone} disabled={loading} />
              {loading ? (
                <Button loading className={styles.button}>Gửi OTP</Button>
              ) : phone === '' ? (
                <Button disabled className={styles.button}>Gửi OTP</Button>
              ) : (
                <Button onClick={onLogin} className={styles.button}>Gửi OTP</Button>
              )}
              {/* <p style={{ textAlign: 'center', color: 'black', marginTop: '0px' }}>Chưa có tài khoản? <Link to={'/register'} style={{ color: '#f2c955', textDecoration: 'underline' }}>Đăng kí ngay</Link></p> */}
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Xác thực OTP</h2>
            <div className={styles.form}>
              <p>Chúng tôi đã gửi một mã xác thực đến số điện thoại +{phone.substring(0, 4)}***{phone.substring(phone.length - 3)}:</p>
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
              <p style={{ textAlign: 'center', color: 'black', marginTop: '0px' }}>Chưa nhận được mã? <Link onClick={onLogin} style={{ color: '#f2c955', textDecoration: 'underline' }}>Gửi lại</Link></p>
              {loading ? (
                <Button loading className={styles.button}>Xác thực</Button>
              ) : otp.length < 6 ? (
                <Button disabled className={styles.button}>Xác thực</Button>
              ) : (
                <Button onClick={onOtpVerify} className={styles.button}>Xác thực</Button>
              )}
            </div>
          </>
        )}
        {errorMessage !== '' && (
          <Alert style={{ width: '55%', marginTop: '20px' }} message={errorMessage} type="error" showIcon />
        )}
      </div>
      <div className={styles.right}>
        {/* <div className={styles.rightLink}>
          <Link className={`${styles.link} ${styles.linkActive}`}>Đăng nhập</Link>
          <Link to={'/register'} className={styles.link}>Đăng ký</Link>
        </div> */}
        <img className={styles.rightImage} src={kidImage} />
      </div>
    </div>
  )
}
