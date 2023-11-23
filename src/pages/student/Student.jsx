import React from 'react'
import styles from './Student.module.css'
import { Link, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { userSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';
import { Avatar, Menu } from 'antd';
import { UserOutlined, StarOutlined, BookOutlined, CalendarOutlined } from '@ant-design/icons';

export default function Student() {
    const location = useLocation()
    const params = useParams();
    const id = params?.id;
    const user = useSelector(userSelector);
    const items = [
        { type: 'divider' },
        {
            label: (
                <Link to={'schedule'}>
                    Lịch học
                </Link>
            ),
            key: 'schedule',
            icon: <CalendarOutlined />,
        },
        {
            label: 'Lớp học',
            key: 'classes',
            icon: <BookOutlined />,
            children: [
                {
                    label: (
                        <Link to={'classes/upcoming'}>
                            Sắp tới
                        </Link>
                    ),
                    key: 'classes/waiting',
                },
                {
                    label: (
                        <Link to={'classes/on-going'}>
                            Đang diễn ra
                        </Link>
                    ),
                    key: 'classes/on-going',
                },
                {
                    label: (
                        <Link to={'classes/completed'}>
                            Đã hoàn thành
                        </Link>
                    ),
                    key: 'classes/completed',
                },
            ],
        },
        {
            label: 'Sự kiện',
            key: 'events',
            icon: <StarOutlined />,
            children: [
                {
                    label: (
                        <Link to={'events/upcoming'}>
                            Đang chờ
                        </Link>
                    ),
                    key: 'events/waiting',
                },
                {
                    label: (
                        <Link to={'events/on-going'}>
                            Đang diễn ra
                        </Link>
                    ),
                    key: 'events/on-going',
                },
                {
                    label: (
                        <Link to={'events/completed'}>
                            Đã hoàn thành
                        </Link>
                    ),
                    key: 'events/completed',
                },
            ],
        },
        { type: 'divider' },
        {
            label: (
                <Link to={'edit'}>
                    Thay đổi thông tin
                </Link>
            ),
            icon: <UserOutlined />,
            key: 'edit'
        },

    ];
    const student = user.students.find((student) => student.id === id);
    if (student) {
        return (
            <div className={styles.container}>
                <div>
                    <div className={styles.student}>
                        <Avatar size={48} src={student.avatarImage} />
                        <h4 className={styles.studentName}>{student.fullName}</h4>
                    </div>
                    <Menu
                        style={{ width: 320 }}
                        defaultSelectedKeys={'classes/upcoming'}
                        defaultOpenKeys={['classes']}
                        mode="inline"
                        items={items}
                    />
                </div>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        );
    } else {
        return <Navigate to="/error404" state={{ from: location }} replace />
    }

}
