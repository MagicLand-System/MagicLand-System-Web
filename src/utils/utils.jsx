import { format, parse } from 'date-fns'
import FileSaver from 'file-saver';
import { checkSyllabusInfo } from '../api/syllabus';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

export function formatDayOfWeek(date) {
    switch (date.toLowerCase()) {
        case 'monday':
            return 'Thứ 2';
        case 'tuesday':
            return 'Thứ 3';
        case 'wednesday':
            return 'Thứ 4';
        case 'thursday':
            return 'Thứ 5';
        case 'friday':
            return 'Thứ 6';
        case 'saturday':
            return 'Thứ 7';
        case 'sunday':
            return 'Chủ nhật';
        default:
            return date;
    }
}
export function formatDate(date) {
    return format(date, 'dd/MM/yyyy')
}
export function formatDateTime(date) {
    return format(date, 'dd/MM/yyyy HH:mm:ss')
}
export function formatSlot(time) {
    return parse(time, 'HH:mm', new Date())
}
export function formatPhone(phone) {
    if (phone.length === 10) return `${phone.slice(0, 3)} ${phone.slice(3)}`
    return `${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5)}`
}
export function handleDownloadExcelFile(base64file, downloadName) {
    let dataBlob = base64file;
    let sliceSize = 1024;
    let byteCharacters = atob(dataBlob)
    let bytesLength = byteCharacters.length;
    let slicesCount = Math.ceil(bytesLength / sliceSize);
    let byteArrays = new Array(slicesCount);
    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        let begin = sliceIndex * sliceSize;
        let end = Math.min(begin + sliceSize, bytesLength);
        let bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    FileSaver.saveAs(
        new Blob(byteArrays, { type: "application/vnd.ms-excel" }),
        downloadName
    );
}
export async function handleImportSyllabus(excelFile, fileInput, action) {
    let errors = []
    let syllabusDetail = null
    XLSX.SSF.is_date("dd/mm/yyyy");
    const workbook = XLSX.read(excelFile, { type: 'buffer' });
    //sheet general
    const worksheetGeneral = workbook.Sheets['Thông tin chung'];
    const dataGeneral = XLSX.utils.sheet_to_json(worksheetGeneral);
    let numOfSessions = 0;
    if (dataGeneral.length === 1) {
        let newDataGeneral = dataGeneral.map(row => ({
            syllabusName: row['Tên giáo trình'] || null,
            subjectCode: row['Mã giáo trình'] || null,
            type: row['Loại'] || null,
            timePerSession: row['Thời gian / buổi'] || null,
            numOfSessions: row['Số buổi học'] || null,
            preRequisite: row['Điều kiện tiên quyết'] || null,
            description: row['Mô tả'] || null,
            studentTasks: row['Nhiệm vụ học sinh'] || null,
            scoringScale: row['Thang điểm'] || null,
            effectiveDate: row['Ngày hiệu lực'] || null,
            minAvgMarkToPass: row['Số điểm hoàn thành'] || null,
        }))
        const generalData = newDataGeneral[0];
        numOfSessions = generalData.numOfSessions;
        if (!generalData.syllabusName || !generalData.subjectCode || !generalData.type || !generalData.timePerSession || !generalData.numOfSessions || !generalData.description || !generalData.studentTasks || !generalData.scoringScale || !generalData.effectiveDate || !generalData.minAvgMarkToPass) {
            errors.push("Vui lòng điền đủ các thông tin chung")
        }
        if (generalData.syllabusName && generalData.subjectCode && action === "add") {
            try {
                const data = await checkSyllabusInfo(generalData.syllabusName, generalData.subjectCode)
                if (data !== "Thông Tin Giáo Trình Hợp Lệ") {
                    errors.push(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (generalData.effectiveDate) {
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(generalData.effectiveDate)) {
                errors.push("Vui lòng để ngày hiệu lực dạng văn bản (dd/mm/yyyy)");
            } else {
                const today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);

                const date = parse(generalData.effectiveDate, "dd/MM/yyyy", new Date());
                date.setHours(12);
                date.setMinutes(0);
                date.setSeconds(0);

                if (date < today) {
                    errors.push("Ngày hiệu lực không hợp lệ");
                }
            }
        }
        if (generalData.numOfSessions <= 0) {
            errors.push("Số lượng buổi học không hợp lệ");
        }
        newDataGeneral.forEach(data => {
            const preRequisite = data.preRequisite?.split("\r\n");
            data.preRequisite = preRequisite
        });
        syllabusDetail = { generalData }
    } else {
        errors.push("Vui lòng chỉ điền các thông tin chung trên 1 dòng")
    }
    //sheet syllabus
    const worksheetSyllabus = workbook.Sheets['Giáo trình'];
    const dataSyllabus = XLSX.utils.sheet_to_json(worksheetSyllabus);
    let syllabusLength = 0
    if (dataSyllabus.length > 0) {
        let newDataSyllabus = dataSyllabus.map(row => ({
            index: row['STT'] || null,
            topicName: row['Chủ đề'] || null,
            order: row['Buổi'] || null,
            content: row['Nội dung'] || null,
            detail: row['Chi tiết'] || null,
        }))
        newDataSyllabus.forEach((item, index) => {
            if (item.detail) {
                if (!item.index && index > 0) {
                    item.index = newDataSyllabus[index - 1].index;
                }
                if (!item.topicName && index > 0) {
                    item.topicName = newDataSyllabus[index - 1].topicName;
                }
                if (!item.order && index > 0) {
                    item.order = newDataSyllabus[index - 1].order;
                }
                if (!item.content && index > 0) {
                    item.content = newDataSyllabus[index - 1].content;
                }
            } else {
                if (!errors.includes("Vui lòng điền đủ các thông tin giáo trình")) {
                    errors.push("Vui lòng điền đủ các thông tin giáo trình");
                }
            }
        });
        const groupedSyllabus = groupDataByOrder(newDataSyllabus)
        syllabusLength = groupedSyllabus.length
        syllabusDetail = { ...syllabusDetail, syllabus: newDataSyllabus, groupedSyllabus }
    } else {
        errors.push("Vui lòng điền đủ các thông tin giáo trình");
    }
    if (syllabusLength > 0 && numOfSessions > 0 && syllabusLength !== numOfSessions) {
        if (!errors.includes("Thông tin số buổi và giáo trình không phù hợp")) {
            errors.push("Thông tin số buổi và giáo trình không phù hợp");
        }
    }
    //sheet assessment
    const worksheetAssessment = workbook.Sheets['Đánh giá'];
    const dataAssessment = XLSX.utils.sheet_to_json(worksheetAssessment);
    if (dataAssessment.length > 0) {
        let newDataAssessment = dataAssessment.map(row => ({
            type: row['Loại bài tập'] || null,
            contentName: row['Nội dung'] || null,
            part: row['Số lượng'] || null,
            weight: row['Trọng số'] || null,
            completionCriteria: row['Điểm tối thiểu'] >= 0 ? row['Điểm tối thiểu'] : null,
            method: row['Phương thức'] || null,
            duration: row['Thời gian'] || null,
            questionType: row['Loại câu hỏi'] || null,
        }))
        let sumWeight = 0;
        newDataAssessment.forEach(data => {
            const weight = data.weight.replace("%", "");
            data.weight = weight
            sumWeight = sumWeight + parseInt(weight);
            const duration = data.duration?.toString();
            data.duration = duration
            if (!data.type || !data.contentName || !data.part || !data.weight || !(data.completionCriteria >= 0) || !data.method) {
                if (!errors.includes("Vui lòng điền đủ các thông tin đánh giá")) {
                    errors.push("Vui lòng điền đủ các thông tin đánh giá");
                }
            }
        });
        if (sumWeight !== 100) {
            errors.push("Vui lòng điền đúng đánh giá trọng số");
        }
        syllabusDetail = { ...syllabusDetail, examSyllabusRequests: newDataAssessment }
    } else {
        errors.push("Vui lòng điền đủ các thông tin đánh giá");
    }
    //exercise
    if (syllabusDetail?.syllabus && syllabusDetail?.examSyllabusRequests) {
        const filteredExamsResult = syllabusDetail?.examSyllabusRequests
            .filter(item => item.method.toLowerCase().includes('online') && !item.type.toLowerCase().includes('participation'));
        const filteredSyllabusResult = syllabusDetail?.syllabus
            .filter(item =>
                filteredExamsResult.some(exam => exam.contentName === item.content)
            )
            .map(item => ({
                contentName: item.content,
                title: item.detail,
                type: null,
                noOfSession: item.order,
                score: syllabusDetail.generalData?.scoringScale,
                questionRequests: null,
            }));

        const filteredReviewResult = syllabusDetail?.syllabus
            .filter(item => item.content.toLowerCase().includes('ôn tập'))
            .map(item => ({
                contentName: item.content,
                title: item.detail,
                type: null,
                noOfSession: item.order,
                score: syllabusDetail.generalData?.scoringScale,
                questionRequests: null,
            }));
        //match syllabus and exam part
        const filteredExamsPart = syllabusDetail?.examSyllabusRequests
            .filter(item => !item.type.toLowerCase().includes('participation'));
        const syllabusContentCount = syllabusDetail?.syllabus.reduce((acc, item) => {
            acc[item.content] = (acc[item.content] || 0) + 1;
            return acc;
        }, {});

        const examContentCount = filteredExamsPart.reduce((acc, item) => {
            acc[item.contentName] = (acc[item.contentName] || 0) + item.part;
            return acc;
        }, {});

        for (const contentName in examContentCount) {
            const syllabusCount = syllabusContentCount[contentName] || 0;
            const examCount = examContentCount[contentName];
            if (syllabusCount !== examCount) {
                errors.push(`Số lượng bài "${contentName}" không khớp. Mong đợi ${examCount} bài, nhưng tìm thấy ${syllabusCount} bài`);
            }
        }
        //duplicate session
        const filteredSyllabusDuplicate = syllabusDetail?.syllabus
            .filter(item =>
                filteredExamsPart.some(exam => exam.contentName === item.content)
            )
            .map(item => ({
                contentName: item.content,
                title: item.detail,
                type: null,
                noOfSession: item.order,
                score: syllabusDetail.generalData?.scoringScale,
                questionRequests: null,
            }));
        const checkDataSessions = [...filteredSyllabusDuplicate, ...filteredReviewResult];
        const sessionCounts = {};
        checkDataSessions.forEach(item => {
            if (!sessionCounts[item.noOfSession]) {
                sessionCounts[item.noOfSession] = [];
            }
            sessionCounts[item.noOfSession].push(item.contentName);
        });

        for (const session in sessionCounts) {
            if (sessionCounts[session].length > 1) {
                errors.push(`Có ${sessionCounts[session].length} bài tập trùng buổi ${session}`);
            }
        }
        //result after checking
        const exercisesData = [...filteredSyllabusResult, ...filteredReviewResult];
        exercisesData.sort((a, b) => {
            if (a.noOfSession === b.noOfSession) {
                if (a.contentName.toLowerCase().includes('ôn tập') && !b.contentName.toLowerCase().includes('ôn tập')) {
                    return -1;
                } else if (!a.contentName.toLowerCase().includes('ôn tập') && b.contentName.toLowerCase().includes('ôn tập')) {
                    return 1;
                } else {
                    return 0;
                }
            }
            return a.noOfSession - b.noOfSession;
        });
        syllabusDetail = { ...syllabusDetail, exercises: exercisesData }
    }
    if (errors.length === 0) {
        syllabusDetail = { ...syllabusDetail, syllabusFile: fileInput }
        return syllabusDetail
    } else {
        Swal.fire({
            icon: "error",
            title: 'Có lỗi xảy ra',
            html: errors.map(err => `${err}<br/>`).join(''),
            showConfirmButton: false,
        })
        return null;
    }
}
function groupDataByOrder(inputData) {
    const groupedData = [];

    inputData.forEach(item => {
        const existingGroup = groupedData.find(group => group.order === item.order && group.topicName === item.topicName);

        if (!existingGroup) {
            groupedData.push({
                order: item.order,
                index: item.index,
                topicName: item.topicName,
                contents: [{
                    content: item.content,
                    details: item.detail ? [item.detail] : []
                }]
            });
        } else {
            const existingContent = existingGroup.contents.find(content => content.content === item.content);
            if (!existingContent) {
                existingGroup.contents.push({
                    content: item.content,
                    details: item.detail ? [item.detail] : []
                });
            } else {
                if (item.detail) {
                    existingContent.details.push(item.detail);
                }
            }
        }
    });

    return groupedData;
}