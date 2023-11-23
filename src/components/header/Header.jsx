import React, { useEffect, useState } from 'react'
import { HomeOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Menu } from 'antd';
import styles from './Header.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { userSelector } from '../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { removeUser } from '../../store/features/authSlice';
import { auth } from '../../../firebase.config';
import logo from '../../assets/images/logo.png';

const itemsNotLogin = [
  {
    label: (
      <Link style={{ fontWeight: 'normal' }} to={'/'}>
        Trang chủ
      </Link>
    ),
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: (
      <Link style={{ fontWeight: 'normal' }} to={'/'}>
        Khóa học
      </Link>
    ),
    key: '/courses',
  },
  {
    label: (
      <Link style={{ fontWeight: 'normal' }} to={'/'}>
        Sự kiện
      </Link>
    ),
    key: '/events',
  },
  {
    label: (
      <Link style={{ fontWeight: 'normal' }} to={'/'}>
        Về chúng tôi
      </Link>
    ),
    key: '/about-us',
  },
  {
    label: (
      <Button style={{ paddingBottom: '5px' }}>
        <Link to={'/login'}>
          &nbsp;Đăng kí / Đăng nhập
        </Link>
      </Button>
    ),
    key: '/login',
  },
];

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = useSelector(userSelector);
  const [current, setCurrent] = useState(currentPath);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [items, setItems] = useState(itemsNotLogin)
  useEffect(() => {
    if (user?.role.name === 'PARENT') {
      setItems([
        {
          label: (
            <Link style={{ fontWeight: 'normal' }} to={'/'}>
              Trang chủ
            </Link>
          ),
          key: '/',
          icon: <HomeOutlined />,
        },
        {
          label: (
            <Link style={{ fontWeight: 'normal' }} to={'/'}>
              Khóa học
            </Link>
          ),
          key: '/courses',
        },
        {
          label: (
            <Link style={{ fontWeight: 'normal' }} to={'/'}>
              Sự kiện
            </Link>
          ),
          key: '/events',
        },
        {
          label: (
            <Link style={{ fontWeight: 'normal' }} to={'/'}>
              Về chúng tôi
            </Link>
          ),
          key: '/about-us',
        },
        {
          label: 'Học viên',
          key: '/students',
          children: [
            user.students.length > 0 &&
            {
              type: 'group',
              label: 'Học viên',
              children: user?.students.map((student) => {
                return {
                  label: (
                    <Link style={{ fontWeight: 'normal' }} to={`/students/${student.id}/classes/waiting`}>
                      {student.fullName}
                    </Link>
                  ),
                  key: `/students/${student?.id}`,
                }
              })
            }, {
              label: (
                <Link style={{ fontWeight: 'normal' }} to={'/add-student'}>
                  Thêm học viên
                </Link>
              ),
              key: '/add-student',
            }
          ]
        },
        {
          label: (
            <Button style={{ paddingBottom: '5px' }}>
              &nbsp;{user?.fullName}
            </Button>
          ),
          children: [
            {
              label: (
                <Link style={{ fontWeight: 'normal' }} to={'/'}>
                  Ví
                </Link>
              ),
              key: '/wallet',
            },
            {
              label: (
                <Link style={{ fontWeight: 'normal' }} to={'/'}>
                  Thông tin tài khoản
                </Link>
              ),
              key: '/account',
            },
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
