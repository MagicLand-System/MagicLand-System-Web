import React, { useEffect, useState } from 'react'
import styles from './ExamScore.module.css'
import { Button, Input, Table, Avatar, Checkbox, ConfigProvider } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { formatPhone } from '../../../utils/utils';
import { getListStudentScore, saveStudentScore } from '../../../api/student';

const { Search } = Input;

export default function ExamScore() {
    const navigate = useNavigate()
    const [apiLoading, setApiLoading] = useState(false);
    const [studentScoreList, setStudentScoreList] = useState([])
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const params = useParams();
    const id = params.id;
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setStudentScoreList([]);
        }
    };
    const onCheckStudentScore = (e) => {
        const newList = [...studentScoreList];
        newList.map((atten) => {
            if (atten.id === e.target.value) {
                atten.isPresent = !atten.isPresent;
                setStudentScoreList(newList)
            }
        })
    }
    const handleSaveStudentScore = async (e) => {
        try {
            setApiLoading(true);
            console.log(studentScoreList)
            await saveStudentScore(id, studentScoreList)
                .then(() =>
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Lưu điểm thành công",
                        showConfirmButton: false,
                        timer: 2000
                    }))
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: error.response?.data?.Error,
                showConfirmButton: false,
                timer: 2000
            })
        } finally {
            setApiLoading(false)
        }
    }
    async function getListOfStudents(examId) {
        try {
            setLoading(true);
            const data = await getListStudentScore(examId);
            setStudentScoreList(data);
            setTableParams({
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: data?.length
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getListOfStudents(id)
    }, [id])
    const studentsColumn = [
        {
            title: 'Học viên',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Avatar size={64} src={record.student.avatarImage} />
                    <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>{record.student.fullName}</p>
                </div>
            )
        },
        {
            title: 'Phụ huynh',
            render: (_, record) => (record.student.user.fullName)
        },
        {
            title: 'Số điện thoại',
            render: (_, record) => (record.student?.user?.phone && formatPhone(record.student.user.phone))
        },
        {
            title: 'Có mặt',
            dataIndex: 'isPresent',
            render: (_, record) => (
                <Checkbox checked={record.isPresent} value={record.id} onChange={onCheckStudentScore} />
            )
        },
        {
            title: 'Học bù',
            render: (_, record) => !record.isPresent && (
                <Button type='link' onClick={() => navigate(`/student-management/view-classes/${record.student.id}/make-up-class/${id}`)} icon={<SwapOutlined />} size='large' />
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Điểm kiểm tra</h2>
            <Table
                columns={studentsColumn}
                rowKey={(record) => record.id}
                dataSource={studentScoreList}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ y: 'calc(100vh - 220px)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button loading={apiLoading} onClick={handleSaveStudentScore} className={styles.saveButton}>
                    Lưu
                </Button>
                <Button disabled={apiLoading} className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                    Hủy
                </Button>
            </div>
        </div >
    )
}
