import React, { useEffect, useState } from 'react'
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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
      <Link className={styles.label} to={'/'}>
        Trang chủ
      </Link>
    ),
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: (
      <Link className={styles.label} to={'/course'}>
        Khóa học
      </Link>
    ),
    key: '/course',
  },
  {
    label: (
      <Link className={styles.label} to={'/'}>
        Sự kiện
      </Link>
    ),
    key: '/events',
  },
  {
    label: (
      <Link className={styles.label} to={'/'}>
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
            <Link className={styles.label} to={'/'}>
              Trang chủ
            </Link>
          ),
          key: '/',
          icon: <HomeOutlined />,
        },
        {
          label: (
            <Link className={styles.label} to={'/course'}>
              Khóa học
            </Link>
          ),
          key: '/course',
        },
        {
          label: (
            <Link className={styles.label} to={'/'}>
              Sự kiện
            </Link>
          ),
          key: '/events',
        },
        {
          label: (
            <Link className={styles.label} to={'/'}>
              Về chúng tôi
            </Link>
          ),
          key: '/about-us',
        },
        {
          label: <Link style={{color: 'white'}} className={styles.label}>
            Học viên
          </Link>,
          key: '/students',
          children: [
            user.students.length > 0 &&
            {
              type: 'group',
              label: 'Học viên',
              children: user?.students.map((student) => {
                return {
                  label: (
                    <Link className={styles.label} to={`/students/${student.id}/classes/upcoming`}>
                      {student.fullName}
                    </Link>
                  ),
                  key: `/students/${student?.id}`,
                }
              })
            }, {
              label: (
                <Link className={styles.label} to={'/add-student'}>
                  Thêm học viên
                </Link>
              ),
              key: '/add-student',
            },
          ]
        },
        {
          label: (
            <Link className={styles.label} to={'/cart'}>
            </Link>
          ),
          key: '/cart',
          icon: <ShoppingCartOutlined style={{ fontSize: 18 }} />,
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
                <Link className={styles.label} to={'/'}>
                  Ví
                </Link>
              ),
              key: '/wallet',
            },
            {
              label: (
                <Link className={styles.label} to={'/'}>
                  Thông tin tài khoản
                </Link>
              ),
              key: '/account',
            },
            {
              label: (
                <Link className={styles.label} to={'/'}>
                  Đổi mật khẩu
                </Link>
              ),
              key: '/change-password',
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
    } else if (user?.role.name === 'STAFF') {
      setItems([
        {
          label: (
            <Link className={styles.label} to={'/'}>
              Trang chủ
            </Link>
          ),
          key: '/',
          icon: <HomeOutlined />,
        },
        {
          label: (
            <Link className={styles.label} to={'/'}>
              Thống kê
            </Link>
          ),
          key: '/dashboard',
        },
        {
          label: (
            <Link className={styles.label} to={'/class-management'}>
              Quản lý lớp học
            </Link>
          ),
          key: '/class-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/'}>
              Quản lý sự kiện
            </Link>
          ),
          key: '/event-management',
        },
        {
          label: (
            <Link className={styles.label} to={'/'}>
              Quản lý tài khoản
            </Link>
          ),
          key: '/account-management',
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
                <Link className={styles.label} to={'/'}>
                  Thông tin tài khoản
                </Link>
              ),
              key: '/account',
            },
            {
              label: (
                <Link className={styles.label} to={'/'}>
                  Đổi mật khẩu
                </Link>
              ),
              key: '/change-password',
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
