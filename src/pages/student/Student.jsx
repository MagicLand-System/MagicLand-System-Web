import React from 'react'
import styles from './Student.module.css'
import { Link, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { userSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';
import { Avatar, Menu } from 'antd';

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
            key: 'schedule'
        },
        {
            label: 'Lớp học',
            key: 'classes',
            children: [
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
                        <Link to={'classes/waiting'}>
                            Đang chờ
                        </Link>
                    ),
                    key: 'classes/waiting',
                },
                {
                    label: (
                        <Link to={'classes/completed'}>
                            Đã hoàn thành
                        </Link>
                    ),
                    key: 'classes/completed',
                },
                {
                    label: (
                        <Link to={'classes/cancelled'}>
                            Đã hủy
                        </Link>
                    ),
                    key: 'classes/cancel',
                }
            ],
        },
        {
            label: 'Sự kiện',
            key: 'events',
            children: [
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
                        <Link to={'events/waiting'}>
                            Đang chờ
                        </Link>
                    ),
                    key: 'events/waiting',
                },
                {
                    label: (
                        <Link to={'events/completed'}>
                            Đã hoàn thành
                        </Link>
                    ),
                    key: 'events/completed',
                },
                {
                    label: (
                        <Link to={'events/cancel'}>
                            Đã hủy
                        </Link>
                    ),
                    key: 'events/cancel',
                }
            ],
        },
        { type: 'divider' },
        {
            label: (
                <Link to={'edit'}>
                    Thay đổi thông tin
                </Link>
            ),
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
                        defaultSelectedKeys={'classes/waiting'}
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
