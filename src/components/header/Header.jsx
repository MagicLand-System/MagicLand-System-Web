import React, { useEffect, useState } from 'react'
import { HomeOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Menu } from 'antd';
import styles from './Header.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { userSelector } from '../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { removeUser } from '../../store/features/authSlice';
import { auth } from '../../../firebase.config';

const itemsNotLogin = [
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
        <Link to={'/login'}>
          &nbsp;Đăng kí / Đăng nhập
        </Link>
      </Button>
    ),
    key: 'login',
  },
];

export default function Header() {
  const [current, setCurrent] = useState('home');
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [items, setItems] = useState(itemsNotLogin)
  const user = useSelector(userSelector);
  useEffect(() => {
    if (user?.role.name === 'PARENT') {
      setItems([
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
        {
          label: 'Học viên',
          key: 'students',
          children: [
            {
              type: 'group',
              label: 'Students',
              children: user?.students.map((student) => {
                return {
                  label: `${student?.label}`,
                  key: `${student?.key}`,
                }
              })
            }, {
              type: 'group',
              label: 'Add',
              children: [
                {
                  label: (
                    <Link style={{ fontWeight: 'normal' }} to={'/'}>
                      Thêm học viên
                    </Link>
                  ),
                  key: 'add-student',
                }
              ]
            }
          ]
        },
        {
          label: (
            <Button style={{ paddingBottom: '5px' }}>
              <Link to={'/'}>
                &nbsp;{user?.fullName}
              </Link>
            </Button>
          ),
          key: 'login',
          children: [
            {
              label: (
                <Button style={{ border: 'none', width: '100%' }} onClick={async () => {
                  await signOut(auth);
                  dispatch(removeUser());
                  localStorage.removeItem('accessToken');
                  navigate('/login')
                }}>
                  Đăng xuất
                </Button>
              ),
              key: 'logout',
            }
          ]
        },
      ]);
    }
  }, [user])

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className={styles.container}>
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
