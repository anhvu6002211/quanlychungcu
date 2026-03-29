import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const exportToExcel = (data, fileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    // Chuyển JSON thành Sheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

    // Ghi file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: fileType });

    saveAs(dataBlob, fileName + fileExtension);
};

export default exportToExcel;
