import React, { useState, useEffect } from 'react'
import styles from './StudentClasses.module.css'
import { useParams } from 'react-router-dom'
import { getClasses } from '../../../api/student';
import { Avatar, Card, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';

export default function StudentClasses() {
    const [title, setTitle] = useState('')
    const [classes, setClasses] = useState([])
    const [message, setMessage] = useState('')
    const params = useParams();
    const status = params.status;
    const id = params.id;
    const getClassesByStatus = async (status, id) => {
        try {
            const data = await getClasses({ status, id });
            setClasses(data)
        } catch (error) {
            if (error.response?.status === 400) {
                setMessage("Danh sách lớp học trống")
            }
        }
    }
    useEffect(() => {
        getClassesByStatus(status, id)
        if (status === 'completed') {
            setTitle('đã hoàn thành');
        } else if (status === 'on-going') {
            setTitle('đang diễn ra')
        } else if (status === 'upcoming') {
            setTitle('sắp tới')
        }
    }, [status, id])
    console.log(classes)
    return (
        <div>
            <h2 className={styles.title}>Các lớp học {title}</h2>
            {classes.length > 0 ? (
                <Row>
                    {classes.map((item, index) => (
                        <Col key={index} md={8} style={{ padding: 20 }}>
                            <Card
                                style={{ padding: 20, backgroundColor: 'rgba(217,217,217,0.22)', height: '100%' }}
                                hoverable
                                cover={<img alt="example" src="https://watermark.lovepik.com/photo/20211125/large/lovepik-cram-school-teaching-picture_500998070.jpg" />}
                            >
                                <Meta
                                    avatar={<Avatar size={48} src="https://media.istockphoto.com/id/1356636078/vi/anh/ch%C3%A2n-dung-m%E1%BB%99t-gi%C3%A1o-vi%C3%AAn-trong-l%E1%BB%9Bp-h%E1%BB%8Dc.jpg?s=612x612&w=0&k=20&c=AswtW364UNeNawoRwKIa9UDcCrrWxNr42An_LcGimlU=" />}
                                    title={<h4 className={styles.className}>{item.courseName}</h4>}
                                    description={
                                        <>
                                            <p className={styles.classDetail}><span className={styles.classTitle}>Tên lớp: </span>{item.className}</p>
                                            <p className={styles.classDetail}><span className={styles.classTitle}>Tên giáo viên: </span>{item.lecturerName}</p>
                                        </>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className={styles.message}>
                    <p>{message}</p>
                </div>
            )
            }

        </div >
    )
}
