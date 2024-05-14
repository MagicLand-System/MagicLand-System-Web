import React, { useEffect, useState } from 'react'
import styles from './ViewProfile.module.css'
import { Button, Input, Table, Checkbox, Select, DatePicker, ConfigProvider, Row, Col, Descriptions } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors';
import { formatDate, formatPhone } from '../../utils/utils';

export default function ViewProfile() {
    const navigate = useNavigate()
    let user = useSelector(userSelector);
    const items = [
        {
            key: 'fullName',
            label: 'Họ và tên',
            children: user?.fullName,
            span: 3,
        },
        {
            key: 'phone',
            label: 'Số điện thoại',
            children: user?.phone && formatPhone(user?.phone),
            span: 1,
        },
        {
            key: 'email',
            label: 'Email',
            children: user?.email ? user?.email : 'Chưa có',
            span: 2,
        },
        {
            key: 'gender',
            label: 'Giới tính',
            children: user?.gender,
            span: 1,
        },
        {
            key: 'dateOfBirth',
            label: 'Ngày sinh',
            children: user?.dateOfBirth ? formatDate(user?.dateOfBirth) : 'Chưa có',
            span: 2,
        },
        {
            key: 'address',
            label: 'Địa chỉ',
            children: user?.address ? user?.address : 'Chưa có',
            span: 3,
        },
        {
            key: 'role',
            label: 'Vai trò',
            children: user?.role?.name && user.role.name.toLowerCase().includes('staff')
                ? <div style={{ backgroundColor: '#E5F2FF', color: '#0066FF' }} className={styles.status}>Nhân viên</div>
                : user.role.name.toLowerCase().includes('admin')
                && <div style={{ backgroundColor: '#e7e9ea', color: '#495057' }} className={styles.status}>Quản trị viên</div>,
            span: 3,
        },
    ];
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Thông tin tài khoản</h2>
            <Row>
                <Col md={8} className={styles.left}>
                    <img className={styles.avatar} alt="children" src={user?.avatarImage ? user?.avatarImage : './src/assets/images/empty_avatar.png'} />
                    <Button style={{ width: '220px' }} onClick={() => navigate('/update-profile')} className={styles.button}>
                        Chỉnh sửa thông tin
                    </Button>
                    <Button style={{ width: '220px' }} onClick={() => console.log('phone')} className={styles.button}>
                        Thay đổi số điện thoại
                    </Button>
                </Col>
                <Col md={16} className={styles.right} style={{ width: '100%' }}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Descriptions: {
                                    labelBg: '#feedbd'
                                },
                            },
                        }}
                    >
                        <Descriptions style={{ width: '100%' }} bordered items={items} />
                    </ConfigProvider>
                </Col>
            </Row>
        </div>
    )
}
