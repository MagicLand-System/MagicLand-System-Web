import { format, parse } from 'date-fns'
import FileSaver from 'file-saver';

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
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 8)} ${phone.slice(8)}`
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