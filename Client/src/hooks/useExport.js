import { useCallback } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

const useExport = () => {
   const exportToCSV = useCallback((data, fileName = "data.csv") => {
      if (!data.length) {
         console.warn("No data available for CSV export.");
         return;
      }
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.click();
   }, []);

   const exportToPDF = useCallback((data, headers, title = "Data Export", fileName = "data.pdf") => {
      if (!data.length) {
         console.warn("No data available for PDF export.");
         return;
      }

      const doc = new jsPDF();
      const pdfData = data.map((item) => {
         const entry = {};
         headers.forEach(header => {
            entry[header.dataKey] = item[header.dataKey];
         });
         return entry;
      });

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, 22);
      doc.autoTable({
         columns: headers,
         body: pdfData,
         startY: 30,
         margin: { horizontal: 10 },
         styles: {
            cellPadding: 5,
            fontSize: 10,
            overflow: 'linebreak',
         },
         headStyles: {
            fillColor: [22, 160, 133],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
         },
      });
      doc.save(fileName);
   }, []);

   return { exportToCSV, exportToPDF };
};

export default useExport;
