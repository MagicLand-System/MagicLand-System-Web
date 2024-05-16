import React, { useEffect, useState } from 'react'
import { Button, ConfigProvider, Menu } from 'antd';
import styles from './Header.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { userSelector } from '../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { removeUser } from '../../store/features/authSlice';
import { auth } from '../../../firebase.config';
import logo from '../../assets/images/logo.png';

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = useSelector(userSelector);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState([])
  useEffect(() => {
    let selectedItems = items.filter(item => {
      if (currentPath !== '' && currentPath.includes(item.key)) {
        return currentPath.includes(item.key) && item.key !== '/';
      } else {
        return item.key === '/';
      }
    }).map(item => item.key);
    setSelected(selectedItems);
  }, [currentPath, items]);
  useEffect(() => {
    if (user?.role.name === 'STAFF') {
      setItems([
        {
          label: (
            <Link className={styles.label} to={'/dashboard'}>
              Thống kê
            </Link>
          ),
          key: '/dashboard',
        },
        {
          label: (
            <Link className={styles.label} to={'/course-register'}>
              Đăng kí khóa học
            </Link>
          ),
          key: '/course-register',
        },
        {
          label: (
            <Link className={styles.label} to={'/transaction-management'}>
              Giao dịch
            </Link>
          ),
          key: '/transaction-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/student-management'}>
              Học viên
            </Link>
          ),
          key: '/student-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/attendance-management'}>
              Điểm danh
            </Link>
          ),
          key: '/attendance-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/class-management'}>
              Lớp học
            </Link>
          ),
          key: '/class-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/staff-management'}>
              Nhân sự
            </Link>
          ),
          key: '/staff-management',
        },
        {
          label: (
            <Button style={{ paddingBottom: '5px' }}>
              {user?.fullName}
            </Button>
          ),
          children: [
            {
              label: (
                <Link className={styles.label} to={'/view-profile'}>
                  Thông tin tài khoản
                </Link>
              ),
              key: '/view-profile',
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
    } else if (user?.role.name === 'ADMIN') {
      setItems([
        {
          label: (
            <Link className={styles.label} to={'/dashboard'}>
              Thống kê
            </Link>
          ),
          key: '/dashboard',
        },
        {
          label: (
            <Link className={styles.label} to={'/syllabus-management'}>
              Chương trình học
            </Link>
          ),
          key: '/syllabus-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/course-management'}>
              Khóa học
            </Link>
          ),
          key: '/course-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/room-management'}>
              Phòng học
            </Link>
          ),
          key: '/room-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/lecturer-management'}>
              Giáo viên
            </Link>
          ),
          key: '/lecturer-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/staff-management'}>
              Nhân sự
            </Link>
          ),
          key: '/staff-management',
        },
        {
          label: (
            <Button style={{ paddingBottom: '5px' }}>
              {user?.fullName}
            </Button>
          ),
          children: [
            {
              label: (
                <Link className={styles.label} to={'/view-profile'}>
                  Thông tin tài khoản
                </Link>
              ),
              key: '/view-profile',
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
        <Menu className={styles.menu} selectedKeys={selected} mode="horizontal" items={items} />
      </ConfigProvider>
    </div>
  );
};
