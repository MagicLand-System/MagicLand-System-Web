import React from 'react'
import styles from './Footer.module.css'
import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

export default function Footer() {
  return (
    <Row className={styles.container}>
      <Col md={8} className={styles.logo}>
        <img src={logo} alt="logo" />
        <p style={{ margin: '20px 0' }}>&ensp;
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
      <Col md={16} className={styles.column} style={{ paddingRight: '80px', marginTop: 50 }}>
        <h4 style={{color: 'white'}}>MagicLand cung cấp đa dạng các khóa học và sự kiện cho trẻ</h4>
      </Col>
    </Row>
  )
}
