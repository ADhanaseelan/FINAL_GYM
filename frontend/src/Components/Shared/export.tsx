import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Export to Excel
export const exportToExcel = (data: any[]) => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Progress");
  XLSX.writeFile(workbook, "ProgressData.xlsx");
};

// ✅ Export to PDF
export const exportToPDF = (data: any[]) => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const doc = new jsPDF();
  doc.text("Progress Tracking Report", 14, 10);

  const tableColumn = ["Date", "Weight", "Fat", "V Fat", "BMR", "BMI", "Body Age"];
  const tableRows = data.map((entry) => [
    entry.date,
    entry.weight,
    entry.fat,
    entry.vfat,
    entry.bmr,
    entry.bmi,
    entry.bodyAge,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("ProgressData.pdf");
};
