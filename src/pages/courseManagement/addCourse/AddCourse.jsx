import React, { useEffect, useRef, useState } from 'react'
import styles from './AddCourse.module.css'
import { Button, Col, Collapse, DatePicker, Divider, Input, Row, Select, Steps } from 'antd';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCourses, getSubjects } from '../../../api/courseApi';
import TextArea from 'antd/es/input/TextArea';
import CurrencyInput from 'react-currency-input-field';
import { storage } from '../../../../firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function AddCourse() {
    const [currentStep, setCurrentStep] = useState(0)

    const [subjects, setSubjects] = useState([]);
    const [subjectsOptions, setSubjectsOptions] = useState(subjects);
    const [subject, setSubject] = useState(null);
    const [subjectError, setSubjectError] = useState(null);

    const imageInputRef = useRef(null);
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [imageError, setImageError] = useState(null)

    const [courses, setCourses] = useState([]);
    const [coursesOptions, setCoursesOptions] = useState(courses);
    const [preRequisite, setPreRequisite] = useState(null);
    const [preRequisiteError, setPreRequisiteError] = useState(null);

    const [subDescriptions, setSubDescriptions] = useState([{ title: null, contents: null }]);
    const [subDescriptionsError, setSubDescriptionsError] = useState(null)

    const syllabusInputRef = useRef(null);
    const [syllabus, setSyllabus] = useState(null);
    const [syllabusError, setSyllabusError] = useState(null)

    const [effectiveDate, setEffectiveDate] = useState(null);
    const [effectiveDateError, setEffectiveDateError] = useState(null)

    const fileInputRef = useRef(null);
    const [files, setFiles] = useState(null)
    const [fileError, setFileError] = useState(null)

    async function getListsOfSubjects() {
        const data = await getSubjects();
        if (data) {
            setSubjects(data);
            setSubjectsOptions(data);
        }
    };
    async function getListsOfCourses() {
        const data = await getCourses();
        if (data) {
            setCourses(data);
            setCoursesOptions(data);
        }
    };

    useEffect(() => {
        getListsOfSubjects();
        getListsOfCourses();
    }, []);

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
        updatedSubDescriptions[index].contents = value;
        setSubDescriptions(updatedSubDescriptions);
    };
    const handleDeleteSubDescription = (index) => {
        const updatedSubDescriptions = [...subDescriptions];
        updatedSubDescriptions.splice(index, 1);
        setSubDescriptions(updatedSubDescriptions);
    };
    const formik = useFormik({
        initialValues: {
            courseName: '',
            price: 0,
            mainDescription: '',
            minAge: null,
            maxAge: null,
        },
        onSubmit: async values => {
            if (image !== null) {
                const imageRef = ref(storage, `courses/${image.name + v4()}`);
                uploadBytes(imageRef, image).then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Tạo khóa học thành công",
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }).catch(error => {
                        console.log(error.message, "error getting image url")
                    })
                    setImage(null);
                    setImageUrl(null)
                }).catch(error => {
                    console.log(error.message)
                })
            } else {
                setImageError("Hãy cung cấp hình ảnh khóa học")
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
            <Steps
                className={styles.steps}
                current={currentStep}
                items={[
                    {
                        title: 'Thông tin chung',
                    },
                    {
                        title: 'Chương trình học',
                    },
                ]}
            />
            <Divider />
            <form onSubmit={formik.handleSubmit}>
                {currentStep === 0 && (
                    <Row>
                        <Col xs={24} lg={16}>
                            <Row>
                                <Col xs={24} lg={12} className={styles.column}>
                                    <p className={styles.addTitle}><span>*</span> Loại khóa học:</p>
                                    <Select
                                        showSearch
                                        value={subject}
                                        suffixIcon={null}
                                        filterOption={false}
                                        className={styles.input}
                                        placeholder="Chọn loại khóa học"
                                        onSelect={(data) => { setSubject(data) }}
                                        options={
                                            subjectsOptions
                                                .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                                                .map((subject) => ({
                                                    value: subject.id,
                                                    label: subject.name,
                                                }))}
                                        onSearch={(value) => {
                                            if (value) {
                                                const filteredOptions = subjects.filter(
                                                    (subject) => subject.name.toLowerCase().includes(value?.toLowerCase())
                                                );
                                                setSubjectsOptions(filteredOptions);
                                            } else {
                                                setSubjectsOptions(subjects);
                                            }
                                        }}
                                    />
                                    <div style={{ height: '24px', paddingLeft: '10px' }}>
                                        {subjectError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{subjectError}</p>)}
                                    </div>
                                </Col>
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
                                        className={`ant-input css-dev-only-do-not-override-1adbn6x ${styles.input}`}
                                        placeholder="Chi phí"
                                        allowDecimals={false}
                                        name='price'
                                        onValueChange={formik.handleChange}
                                        error={formik.touched.price && formik.errors.price}
                                        required
                                    />
                                    <div style={{ height: '24px', paddingLeft: '10px' }}>
                                        {formik.errors.price && formik.touched.price && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{formik.errors.price}</p>)}
                                    </div>
                                </Col>
                                <Col xs={24} lg={12} className={styles.column}>
                                    <p className={styles.addTitle}> Khóa học tiên quyết:</p>
                                    <Select
                                        mode="multiple"
                                        showSearch
                                        size={preRequisite}
                                        suffixIcon={null}
                                        filterOption={false}
                                        className={styles.input}
                                        placeholder="Khóa học tiên quyết"
                                        onChange={(data) => { setPreRequisite(data) }}
                                        options={
                                            coursesOptions
                                                .sort((a, b) => a.courseDetail.courseName.toLowerCase().localeCompare(b.courseDetail.courseName.toLowerCase()))
                                                .map((course) => ({
                                                    value: course.courseId,
                                                    label: course.courseDetail.courseName,
                                                }))}
                                        onSearch={(value) => {
                                            if (value) {
                                                const filteredOptions = courses.filter(
                                                    (course) =>
                                                        `${course.courseDetail.courseName}`
                                                            .toLowerCase()
                                                            .includes(value?.toLowerCase())
                                                );
                                                setCoursesOptions(filteredOptions);
                                            }
                                        }}
                                    />
                                    <div style={{ height: '24px', paddingLeft: '10px' }}>
                                        {preRequisiteError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{preRequisiteError}</p>)}
                                    </div>
                                </Col>
                                <Col span={24} className={styles.column}>
                                    <p className={styles.addTitle}><span>*</span> Mô tả chính:</p>
                                    <TextArea
                                        className={styles.input}
                                        placeholder="Mô tả chính"
                                        name='mainDescription'
                                        value={formik.values.mainDescription}
                                        onChange={formik.handleChange}
                                        error={formik.touched.mainDescription && formik.errors.mainDescription}
                                        required
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
                                            <Button onClick={() => { setSubDescriptions([...subDescriptions, { title: null, contents: null }]) }}>
                                                + Thêm mô tả
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Collapse items={subDescriptions.map((subDescription, index) => ({
                                        key: index,
                                        label: <Input
                                            placeholder={`Mô tả ${index + 1}`}
                                            value={subDescription?.title}
                                            onChange={(e) => handleTitleChange(index, e.target.value)}
                                            className={styles.input}
                                            required
                                        />,
                                        children:
                                            <div style={{ margin: '10px 0' }} key={index}>
                                                <TextArea
                                                    className={styles.input}
                                                    placeholder={`Nội dung ${index + 1}`}
                                                    value={subDescription?.contents}
                                                    onChange={(e) => handleContentChange(index, e.target.value)}
                                                    required
                                                />
                                            </div>,
                                        extra: index !== 0 ? (
                                            <DeleteOutlined style={{ fontSize: '1rem' }} onClick={() => handleDeleteSubDescription(index)} />
                                        ) : (<DeleteOutlined style={{ fontSize: '1rem', color: '#e6e6e6' }} />)
                                    }))} />
                                    <div style={{ height: '24px', paddingLeft: '10px' }}>
                                        {subDescriptionsError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{subDescriptionsError}</p>)}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} lg={8} className={styles.imageCol}>
                            <img className={styles.image} alt="image" src={image ? imageUrl : '../src/assets/images/empty_image.jpg'} />
                            <input type='file' accept='image/*' ref={imageInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                            <Button style={{ width: '180px' }} onClick={() => imageInputRef.current.click()} icon={<CloudUploadOutlined />} className={styles.button}>
                                Tải hình lên
                            </Button>
                            <div style={{ height: '24px', paddingLeft: '10px' }}>
                                {imageError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{imageError}</p>)}
                            </div>
                            <div style={{ display: 'flex' }}>
                                {currentStep > 1 && (
                                    <Button className={styles.cancelButton} onClick={() => { navigate(-1) }}>
                                        Quay lại
                                    </Button>
                                )}
                                <Button onClick={() => { setCurrentStep(currentStep + 1) }} className={styles.saveButton}>
                                    Tiếp theo
                                </Button>
                            </div>
                        </Col>
                    </Row>
                )}
                {
                    currentStep === 1 && (
                        <div className={styles.column}>
                            <p className={styles.addTitle}><span>*</span> Tài liệu:</p>
                            <Input
                                placeholder="Tài liệu"
                                style={{ caretColor: 'transparent' }}
                                value={files?.name}
                                onClick={() => fileInputRef.current.click()}
                                className={styles.input}
                                required
                            />
                            <input type='file' accept=".pdf" ref={fileInputRef} onChange={(e) => setFiles(e.target.files[0])} style={{ display: 'none' }} />
                            <div style={{ height: '24px', paddingLeft: '10px' }}>
                                {fileError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{fileError}</p>)}
                            </div>
                            <p className={styles.addTitle}><span>*</span> Giáo trình:</p>
                            <Input
                                placeholder="Tài liệu"
                                style={{ caretColor: 'transparent' }}
                                value={syllabus?.name}
                                onClick={() => syllabusInputRef.current.click()}
                                className={styles.input}
                                required
                            />
                            <input type='file' accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ref={syllabusInputRef} onChange={(e) => setSyllabus(e.target.files[0])} style={{ display: 'none' }} />
                            <div style={{ height: '24px', paddingLeft: '10px' }}>
                                {syllabusError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{syllabusError}</p>)}
                            </div>
                            <p className={styles.addTitle}><span>*</span> Ngày hiệu lực:</p>
                            <DatePicker
                                className={styles.input}
                                value={effectiveDate}
                                disabledDate={(current) => {
                                    return current && current < dayjs().add(1, 'day').startOf('day');
                                }}
                                onChange={(date) => setEffectiveDate(date)}
                                format={'DD/MM/YYYY'}
                                placeholder="Ngày hiệu lực" />
                            <div style={{ height: '24px', paddingLeft: '10px' }}>
                                {effectiveDateError && (<p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{effectiveDateError}</p>)}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button className={styles.cancelButton} onClick={() => { setCurrentStep(currentStep - 1) }}>
                                    Quay lại
                                </Button>
                                <Button htmlType='submit' className={styles.saveButton}>
                                    Tạo khóa học
                                </Button>
                            </div>
                        </div>
                    )
                }
            </form >
        </div >
    )
}
