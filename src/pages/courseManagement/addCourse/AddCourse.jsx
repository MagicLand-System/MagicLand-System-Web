import React, { useEffect, useRef, useState } from 'react'
import styles from './AddCourse.module.css'
import { Button, Col, Collapse, Empty, Input, Row, Select, Spin } from 'antd';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addCourse, getCourse, updateCourse } from '../../../api/courseApi';
import TextArea from 'antd/es/input/TextArea';
import CurrencyInput from 'react-currency-input-field';
import { storage } from '../../../../firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getAvailableSyllabuses, getSyllabus, getSyllabusGeneral } from '../../../api/syllabus';


export default function AddCourse() {
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate()

    const imageInputRef = useRef(null);
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [imageError, setImageError] = useState(null)

    const [subDescriptions, setSubDescriptions] = useState([{ title: null, subDescriptionContentRequests: null }]);
    const [subDescriptionsError, setSubDescriptionsError] = useState(null)

    const [price, setPrice] = useState(0);
    const [priceError, setPriceError] = useState(null);

    const [syllabuses, setSyllabuses] = useState([])
    const [syllabusesOptions, setSyllabusesOptions] = useState(syllabuses);

    const [syllabusId, setSyllabusId] = useState(null)
    const [syllabusDetail, setSyllabusDetail] = useState(null)
    const [syllabusError, setSyllabusError] = useState(null)

    const [apiLoading, setApiLoading] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const selectedImage = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
                setImage(e.target.files[0])
            };
            reader.readAsDataURL(selectedImage);
        }
    }

    const handleTitleChange = (index, value) => {
        const updatedSubDescriptions = [...subDescriptions];
        updatedSubDescriptions[index].title = value;
        setSubDescriptions(updatedSubDescriptions);
    };
    const handleContentChange = (index, value) => {
        const updatedSubDescriptions = [...subDescriptions];
        updatedSubDescriptions[index].subDescriptionContentRequests = value;
        setSubDescriptions(updatedSubDescriptions);
    };
    const handleDeleteSubDescription = (index) => {
        const updatedSubDescriptions = [...subDescriptions];
        updatedSubDescriptions.splice(index, 1);
        setSubDescriptions(updatedSubDescriptions);
    };
    async function getListOfSyllabuses() {
        try {
            const data = await getAvailableSyllabuses();
            setSyllabuses(data);
            setSyllabusesOptions(data);
            setLoading(true)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };
    async function getSyllabusDetail(id) {
        const data = await getSyllabusGeneral(id);
        setSyllabusDetail(data);
    };
    async function getCourseDetail(id) {
        const data = await getCourse(id);
        if (data) {
            formik.setValues({
                courseName: data.name,
                mainDescription: data.mainDescription,
                minAge: data.minYearOldsStudent,
                maxAge: data.maxYearOldsStudent,
            })
            const newSubDescriptions = [...data.subDescriptionTitles]
            newSubDescriptions.map((sub) => {
                sub.subDescriptionContentRequests = sub.contents.map(content => `${content.content}${content.description ? `: ${content.description}` : ''}`).join('\n')
            })
            setImageUrl(data.image)
            setSubDescriptions(newSubDescriptions)
            setPrice(data.price)
            setSyllabusId(data.syllabusId)
        }
    }
    useEffect(() => {
        getListOfSyllabuses()
    }, [])
    useEffect(() => {
        if (syllabusId) {
            getSyllabusDetail(syllabusId)
        }
    }, [syllabusId])
    useEffect(() => {
        if (id) {
            getCourseDetail(id)
        }
    }, [id])
    const formik = useFormik({
        initialValues: {
            courseName: '',
            mainDescription: '',
            minAge: null,
            maxAge: null,
        },
        onSubmit: async values => {
            const hasNullDescriptions = subDescriptions.some((subDescription) => {
                return subDescription.title === null || subDescription.subDescriptionContentRequests === null;
            });
            if ((!syllabusId && !id) || (!image && !id) || hasNullDescriptions || !price) {
                if (!syllabusId && !id) {
                    setSyllabusError("Vui lòng chọn chương trình học")
                } else {
                    setSyllabusError(null)
                }
                if (!image && !id) {
                    setImageError("Hãy cung cấp hình ảnh khóa học")
                } else {
                    setImageError(null)
                }
                if (hasNullDescriptions) {
                    setSubDescriptionsError("Vui lòng nhập đủ mô tả khóa học")
                } else {
                    setSubDescriptionsError(null)
                }
                if (!price) {
                    setPriceError("Hãy nhập chi phí khóa học")
                } else {
                    setPriceError(null)
                }

            } else {
                setApiLoading(true)
                setImageError(null)
                setSubDescriptionsError(null)
                setPriceError(null)
                //subDescription
                const newSubDescriptions = JSON.parse(JSON.stringify(subDescriptions));
                newSubDescriptions.forEach((subDescript) => {
                    const lines = subDescript.subDescriptionContentRequests.split('\n');
                    const newContents = lines.map(line => {
                        const [content, description] = line.split(':');
                        return { content: content?.trim(), description: description?.trim() };
                    });
                    subDescript.subDescriptionContentRequests = newContents
                })
                //image
                if (id && !image) {
                    try {
                        await updateCourse(id, { ...values, subDescriptions: newSubDescriptions, price })
                            .then(() => {
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Chỉnh sửa khóa học thành công",
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                            }).then(() => {
                                setApiLoading(false)
                                navigate(-1)
                            })
                    } catch (error) {
                        setApiLoading(false)
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: error.response?.data?.Error,
                        })
                    }
                } else {
                    const imageRef = ref(storage, `courses/${formik.values.courseName}/${image.name + v4()}`);
                    uploadBytes(imageRef, image).then(() => {
                        getDownloadURL(imageRef).then(async (url) => {
                            try {
                                if (id) {
                                    await updateCourse(id, { ...values, subDescriptions: newSubDescriptions, price })
                                        .then(() => {
                                            Swal.fire({
                                                position: "center",
                                                icon: "success",
                                                title: "Chỉnh sửa khóa học thành công",
                                                showConfirmButton: false,
                                                timer: 2000
                                            })
                                        }).then(() => {
                                            setApiLoading(false)
                                            navigate(-1)
                                        })
                                } else {
                                    await addCourse({ ...values, img: url, subDescriptions: newSubDescriptions, syllabusId, price })
                                        .then(() => {
                                            Swal.fire({
                                                position: "center",
                                                icon: "success",
                                                title: "Tạo khóa học thành công",
                                                showConfirmButton: false,
                                                timer: 2000
                                            })
                                        }).then(() => {
                                            setApiLoading(false)
                                            navigate(-1)
                                        })
                                }
                            } catch (error) {
                                setApiLoading(false)
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: error.response?.data?.Error,
                                })
                            }
                        }).catch(error => {
                            setApiLoading(false)
                            console.log(error.message, "error getting image url")
                        })
                    }).catch(error => {
                        setApiLoading(false)
                        console.log(error.message)
                    })
                }
            }
        },
        validationSchema: Yup.object({
            courseName: Yup.string().required("Vui lòng điền tên khóa học"),
            mainDescription: Yup.string().required("Vui lòng điền mô tả khóa học"),
            minAge: Yup.number().required("Vui lòng điền số tuổi tối thiểu").min(4, "Vui lòng chọn tuổi từ 4-10").max(10, "Vui lòng chọn tuổi từ 4-10"),
            maxAge: Yup.number().required("Vui lòng điền số tuổi tối đa").when(
                'minAge',
                (minNum, schema) => schema.min(minNum, "Độ tuổi tối đa phải lớn hơn độ tuổi tối thiểu")
            ).max(10, "Vui lòng chọn tuổi từ 4-10"),
        }),
    });

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Tạo khóa học</h2>
            <form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col xs={24} lg={16}>
                        <Row>
                            {!id &&
                                <Col span={24} className={styles.column}>
                                    <p className={styles.addTitle}><span>*</span> Chương trình học:</p>
                                    <Select
                                        showSearch
                                        value={syllabusId}
                                        suffixIcon={null}
                                        filterOption={false}
                                        className={styles.input}
                                        placeholder="Chọn chương trình học"
                                        notFoundContent={
                                            loading
                                                ? <div style={{ width: '100%', textAlign: 'center' }}>
                                                    <Spin size='small' />
                                                </div>
                                                : <Empty
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    description={
                                                        <span>
                                                            Không tìm thấy chương trình học
                                                        </span>
                                                    } />
                                        }
                                        onSelect={(data) => { setSyllabusId(data) }}
                                        options={
                                            syllabusesOptions
                                                .sort((a, b) => a.syllabusName.toLowerCase().localeCompare(b.syllabusName.toLowerCase()))
                                                .map((syllabus) => ({
                                                    value: syllabus.id,
                                                    label: syllabus.syllabusName,
                                                }))}
                                        onSearch={(value) => {
                                            if (value) {
                                                const filteredOptions = syllabuses.filter(
                                                    (syllabus) => syllabus.syllabusName.toLowerCase().includes(value?.toLowerCase())
                                                );
                                                setSyllabusesOptions(filteredOptions);
                                            } else {
                                                setSyllabusesOptions(syllabuses);
                                            }
                                        }}
                                        disabled={apiLoading}
                                    />
                                    <div style={{ height: '24px', paddingLeft: '10px' }}>
                                        {syllabusError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{syllabusError}</p>)}
                                    </div>
                                </Col>
                            }
                            <Col xs={24} lg={12} className={styles.column}>
                                <p className={styles.addTitle}><span>*</span> Tên khóa học:</p>
                                <Input
                                    className={styles.input}
                                    placeholder="Tên khóa học"
                                    name='courseName'
                                    value={formik.values.courseName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.courseName && formik.errors.courseName}
                                    required
                                    disabled={apiLoading}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.courseName && formik.touched.courseName && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.courseName}</p>)}
                                </div>
                            </Col>
                            <Col xs={12} lg={6} className={styles.column}>
                                <p className={styles.addTitle}><span>*</span> Độ tuổi phù hợp (tối thiểu - tối đa):</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Input
                                        placeholder="Tối thiểu"
                                        name='minAge'
                                        type='number'
                                        min={4}
                                        max={10}
                                        value={formik.values.minAge}
                                        onChange={formik.handleChange}
                                        error={formik.touched.minAge && formik.errors.minAge}
                                        className={styles.input}
                                        required
                                        disabled={apiLoading}
                                    />
                                    <Input
                                        placeholder="Tối đa"
                                        name='maxAge'
                                        type='number'
                                        min={4}
                                        max={10}
                                        value={formik.values.maxAge}
                                        onChange={formik.handleChange}
                                        error={formik.touched.maxAge && formik.errors.maxAge}
                                        className={styles.input}
                                        required
                                        disabled={apiLoading}
                                    />
                                </div>
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.minAge && formik.touched.minAge && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.minAge}</p>)}
                                    {formik.errors.maxAge && formik.touched.maxAge && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.maxAge}</p>)}
                                </div>
                            </Col>
                            <Col xs={12} lg={6} className={styles.column}>
                                <p className={styles.addTitle}><span>*</span> Chi phí:</p>
                                <CurrencyInput
                                    className={`ant-input ${styles.currencyInput} ${styles.input} ${styles.inputNumber}`}
                                    placeholder="Chi phí"
                                    allowDecimals={false}
                                    value={price}
                                    name='price'
                                    onValueChange={(value, name, values) => setPrice(parseInt(value))}
                                    required
                                    intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                                    disabled={apiLoading}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {priceError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{priceError}</p>)}
                                </div>
                            </Col>
                            <Col span={24} className={styles.column}>
                                <p className={styles.addTitle}><span>*</span> Mô tả chính:</p>
                                <TextArea
                                    autoSize={{ minRows: 2 }}
                                    className={styles.input}
                                    placeholder="Mô tả chính"
                                    name='mainDescription'
                                    value={formik.values.mainDescription}
                                    onChange={formik.handleChange}
                                    error={formik.touched.mainDescription && formik.errors.mainDescription}
                                    required
                                    disabled={apiLoading}
                                />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {formik.errors.mainDescription && formik.touched.mainDescription && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.mainDescription}</p>)}
                                </div>
                            </Col>
                            <Col span={24} className={styles.column}>
                                <Row>
                                    <Col span={8}>
                                        <p className={styles.addTitle}><span>*</span> Mô tả chi tiết:</p>
                                    </Col>
                                    <Col span={16} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', marginBottom: 8 }}>
                                        <Button disabled={apiLoading} onClick={() => { setSubDescriptions([...subDescriptions, { title: null, subDescriptionContentRequests: null }]) }}>
                                            + Thêm mô tả
                                        </Button>
                                    </Col>
                                </Row>
                                <Collapse items={subDescriptions.map((subDescription, index) => ({
                                    key: index,
                                    label: <Input
                                        disabled={apiLoading}
                                        placeholder={`Mô tả ${index + 1}`}
                                        value={subDescription?.title}
                                        onChange={(e) => handleTitleChange(index, e.target.value)}
                                        className={styles.input}
                                        required
                                    />,
                                    children:
                                        <div style={{ margin: '10px 0' }} key={index}>
                                            <TextArea
                                                disabled={apiLoading}
                                                className={styles.input}
                                                placeholder={`Nội dung ${index + 1}`}
                                                value={subDescription?.subDescriptionContentRequests}
                                                onChange={(e) => handleContentChange(index, e.target.value)}
                                                required
                                            />
                                        </div>,
                                    extra: index !== 0 ? (
                                        <DeleteOutlined disabled={apiLoading} style={{ fontSize: '1rem' }} onClick={() => handleDeleteSubDescription(index)} />
                                    ) : (<DeleteOutlined disabled={apiLoading} style={{ fontSize: '1rem', color: '#e6e6e6' }} />)
                                }))} />
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {subDescriptionsError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{subDescriptionsError}</p>)}
                                </div>
                            </Col>
                            <Col span={24} className={styles.imageCol}>
                                {imageUrl &&
                                    <img className={styles.image} alt="image" src={imageUrl} />
                                }
                                <input type='file' disabled={apiLoading} accept='image/*' ref={imageInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                                <Button disabled={apiLoading} style={{ width: '180px' }} onClick={() => imageInputRef.current.click()} icon={<CloudUploadOutlined />} className={styles.button}>
                                    Tải hình lên
                                </Button>
                                <div style={{ height: '24px', paddingLeft: '10px' }}>
                                    {imageError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{imageError}</p>)}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} lg={8}>
                        {syllabusDetail &&
                            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: '30px 20px' }}>
                                <h5 style={{ fontSize: '1.2rem', margin: 0 }}>Chương trình học</h5>
                                <Row style={{ marginTop: 10 }}>
                                    <Col span={6} >
                                        <p className={styles.syllabusTitle}> Mã chương trình học:</p>
                                    </Col>
                                    <Col span={18}>
                                        <p className={styles.syllabusInfo}>{syllabusDetail.subjectCode}</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 20 }}>
                                    <Col span={6} >
                                        <p className={styles.syllabusTitle}> Tên chương trình học:</p>

                                    </Col>
                                    <Col span={18} >
                                        <p className={styles.syllabusInfo}>{syllabusDetail.syllabusName}</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 20 }}>
                                    <Col span={6} >
                                        <p className={styles.syllabusTitle}>Loại:</p>
                                    </Col>
                                    <Col span={18}>
                                        <p className={styles.syllabusInfo}>{syllabusDetail.category}</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 20 }}>
                                    <Col span={6}>
                                        <p className={styles.syllabusTitle}> Ngày hiệu lực:</p>
                                    </Col>
                                    <Col span={18} >
                                        <p className={styles.syllabusInfo}>{syllabusDetail.effectiveDate}</p>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 20 }}>
                                    <Col span={24} >
                                        <p className={styles.syllabusTitle}> Mô tả:</p>
                                    </Col>
                                    <Col span={24}>
                                        <p className={styles.syllabusInfo} style={{ textAlign: 'left' }}>{syllabusDetail.description}</p>
                                    </Col>
                                </Row>
                            </div>
                        }
                        <div style={{ width: '100%', textAlign: 'center', marginTop: 20 }}>
                            {id ?
                                <Button loading={apiLoading} htmlType='submit' className={styles.saveButton}>
                                    Lưu
                                </Button>
                                : <Button loading={apiLoading} htmlType='submit' className={styles.saveButton}>
                                    Tạo khóa học
                                </Button>
                            }
                        </div>
                    </Col>
                </Row>
            </form >
        </div >
    )
}
