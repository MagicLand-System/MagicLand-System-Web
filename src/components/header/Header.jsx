import React, { useState } from 'react'
import { HomeOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Menu } from 'antd';
import styles from './Header.module.css'
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom'

const students = [
  {
    label: 'Học viên 1',
    key: 'student:1',
  },
  {
    label: 'Học viên 2',
    key: 'student:2',
  },
]

const items = [
  {
    label: (
      <Link style={{ fontWeight: 'normal' }} to={'/'}>
        Trang chủ
      </Link>
    ),
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: (
      <Link style={{ fontWeight: 'normal' }} to={'/'}>
        Khóa học
      </Link>
    ),
    key: 'courses',
  },
  {
    label: (
      <Link style={{ fontWeight: 'normal' }} to={'/'}>
        Sự kiện
      </Link>
    ),
    key: 'events',
  },
  {
    label: (
      <Link style={{ fontWeight: 'normal' }} to={'/'}>
        Về chúng tôi
      </Link>
    ),
    key: 'about-us',
  },
  // {
  //   label: 'Học viên',
  //   key: 'students',
  //   children: students.map((student) => {
  //     return {
  //       label: `${student.label}`,
  //       key: `${student.key}`,
  //     }
  //   })
  // },
  {
    label: (
      <Button style={{ paddingBottom: '5px' }}>
        <Link to={'/'}>
          &nbsp;Đăng kí / Đăng nhập
        </Link>
      </Button>
    ),
    key: 'login',
  },
];

export default function Header() {
  const [current, setCurrent] = useState('home');

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className={styles.container}>
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
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              horizontalItemSelectedColor: '#F2C955',
              itemBg: '#3A0CA3',
              itemHoverColor: '#F2C955',
              itemSelectedColor: '#F2C955',
            },
            Button: {
              defaultColor: '#3A0CA3',
              defaultBorderColor: '#F2C955',
            }
          }
        }}
      >
        <Menu className={styles.menu} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      </ConfigProvider>
    </div>
  );
};