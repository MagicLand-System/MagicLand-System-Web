import React from 'react'
import styles from './Footer.module.css'
import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <Row className={styles.container}>
      <Col md={7} className={styles.logo}>
        <img src='./src/assets/images/logo.png' alt="logo" />
        <p style={{ margin: '30px 0' }}>&ensp;
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
      </Col>
      <Col md={7} className={styles.column} style={{ paddingRight: '80px' }}>
        <h4>MagicLand cung cấp đa dạng các khóa học và sự kiện cho trẻ</h4>
      </Col>
      <Col md={5} className={styles.column}>
        <h4>Magicland</h4>
        <p><Link className={styles.link}>Về chúng tôi</Link></p>
        <p><Link className={styles.link}>Khóa học</Link></p>
        <p><Link className={styles.link}>Sự kiện</Link></p>
        <p><Link className={styles.link}>Đánh giá</Link></p>
      </Col>
      <Col md={5} className={styles.column}>
        <h4>Thông tin liên lạc</h4>
        <p>SĐT: +84 999999999</p>
        <p>Địa chỉ: Quận 1, thành phố Hồ Chí Minh</p>
        <p>Gmail: magicland@gmail.com</p>
      </Col>
    </Row>
  )
}
