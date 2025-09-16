
// 'use client';
// import React from 'react';
// import PropTypes from 'prop-types';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { Button } from '@mui/material';

// const sizeList = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

// const FinalQcReportPDF = ({ qcData }) => {
//   const generatePdf = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 12;
//     let y = 20;

//     // Title
//     doc.setFontSize(14);
//     doc.setFont(undefined, 'bold');
//     doc.text('Final Quality Check (QC) Report', pageWidth / 2, y, { align: 'center' });
//     y += 12;

//     // Reset font
//     doc.setFontSize(10);
//     doc.setFont(undefined, 'normal');

//     // Header Fields
//     const headerFields = [
//       ['J/c No:', qcData.jcNo || ''],
//       ['Product:', qcData.product || ''],
//       ['R. Card No:', qcData.rCardNo || ''],
//       ['J/c Date:', qcData.jcDate ? new Date(qcData.jcDate).toLocaleDateString() : ''],
//       ['Fabric:', qcData.fabric || ''],
//       ['Date of Commence:', qcData.dateOfCommence ? new Date(qcData.dateOfCommence).toLocaleDateString() : ''],
//       ['J/c Qty:', qcData.jcQty != null ? qcData.jcQty.toString() : ''],
//       ['Colour:', qcData.colour || ''],
//       ['J/c Closed On:', qcData.jcClosedOn ? new Date(qcData.jcClosedOn).toLocaleDateString() : ''],
//       ['Work Order No:', qcData.workOrderNo || ''],
//       ['Style:', qcData.style || ''],
//       ['Gender:', qcData.gender || ''],
//     ];

//     headerFields.forEach(([label, value]) => {
//       doc.text(`${label} ${value}`, margin, y);
//       y += 6;
//     });

//     // Remarks
//     y += 4;
//     doc.setFont(undefined, 'bold');
//     doc.text('Remarks:', margin, y);
//     doc.setFont(undefined, 'normal');
//     y += 6;

//     const remarksLines = doc.splitTextToSize(qcData.remarks || '', pageWidth - 2 * margin);
//     doc.text(remarksLines, margin, y);
//     y += remarksLines.length * 6 + 10;

//     // Size-based Quantities Table
//     const tableBody = sizeList.map((size) => [
//       size,
//       qcData.receivedQty?.[size] ?? 0,
//       qcData.minorDamageQty?.[size] ?? 0,
//       qcData.majorDamageQty?.[size] ?? 0,
//       qcData.outputQty?.[size] ?? 0,
//     ]);

//     doc.autoTable({
//       startY: y,
//       head: [['Size', 'Received Qty', 'Minor Damage Qty', 'Major Damage Qty', 'Output Qty']],
//       body: tableBody,
//       theme: 'grid',
//       margin: { left: margin, right: margin },
//       styles: { fontSize: 9, halign: 'center' },
//       headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: 'bold' },
//       columnStyles: {
//         0: { cellWidth: 25 }, // Size column
//       },
//     });

//     // Save PDF
//     doc.save(`Final_QC_Report_${qcData.jcNo || 'Report'}.pdf`);
//   };

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       onClick={qcData ? generatePdf : undefined}
//       disabled={!qcData}
//     >
//       Download Final QC Report PDF
//     </Button>
//   );
// };

// FinalQcReportPDF.propTypes = {
//   qcData: PropTypes.shape({
//     jcNo: PropTypes.string,
//     product: PropTypes.string,
//     rCardNo: PropTypes.string,
//     jcDate: PropTypes.string,
//     fabric: PropTypes.string,
//     dateOfCommence: PropTypes.string,
//     jcQty: PropTypes.number,
//     colour: PropTypes.string,
//     jcClosedOn: PropTypes.string,
//     workOrderNo: PropTypes.string,
//     style: PropTypes.string,
//     gender: PropTypes.string,
//     remarks: PropTypes.string,
//     receivedQty: PropTypes.objectOf(PropTypes.number),
//     minorDamageQty: PropTypes.objectOf(PropTypes.number),
//     majorDamageQty: PropTypes.objectOf(PropTypes.number),
//     outputQty: PropTypes.objectOf(PropTypes.number),
//   }).isRequired,
// };

// export default FinalQcReportPDF;


'use client';
import React from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';

const sizeList = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

const FinalQcReportPDF = ({ qcData }) => {
  const generatePdf = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 20;

    // --- Title / Header ---
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(
      'SAMURAI EXPORTS PVT. LTD. BANGALORE',
      pageWidth / 2,
      y,
      { align: 'center' }
    );
    y += 7;
    doc.text('FINAL QUALITY CHECK REPORT', pageWidth / 2, y, { align: 'center' });
    y += 12;

    // --- Header Fields ---
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const headerFields = [
      ['J/c No:', qcData.jcNo || ''],
      ['Product:', qcData.product || ''],
      ['R. Card No:', qcData.rCardNo || ''],
      ['J/c Date:', qcData.jcDate ? new Date(qcData.jcDate).toLocaleDateString() : ''],
      ['Fabric:', qcData.fabric || ''],
      ['Date of Commence:', qcData.dateOfCommence ? new Date(qcData.dateOfCommence).toLocaleDateString() : ''],
      ['J/c Qty:', qcData.jcQty != null ? qcData.jcQty.toString() : ''],
      ['Colour:', qcData.colour || ''],
      ['J/c Closed On:', qcData.jcClosedOn ? new Date(qcData.jcClosedOn).toLocaleDateString() : ''],
      ['Work Order No:', qcData.workOrderNo || ''],
      ['Style:', qcData.style || ''],
      ['Gender:', qcData.gender || ''],
    ];

    headerFields.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, margin, y);
      doc.setFont(undefined, 'normal');
      doc.text(value, margin + 35, y);
      y += 7;
    });

    // --- Remarks ---
    y += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Remarks:', margin, y);
    doc.setFont(undefined, 'normal');
    y += 6;

    const remarksLines = doc.splitTextToSize(
      qcData.remarks || '',
      pageWidth - 2 * margin
    );
    doc.text(remarksLines, margin + 20, y);
    y += remarksLines.length * 6 + 12;

    // --- Size-based Quantities Table ---
    const tableBody = sizeList.map((size) => [
      size,
      qcData.receivedQty?.[size] ?? 0,
      qcData.minorDamageQty?.[size] ?? 0,
      qcData.majorDamageQty?.[size] ?? 0,
      qcData.outputQty?.[size] ?? 0,
    ]);

    doc.autoTable({
      startY: y,
      head: [
        [
          'Size',
          'Received Qty',
          'Minor Damage Qty',
          'Major Damage Qty',
          'Output Qty',
        ],
      ],
      body: tableBody,
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        halign: 'center',
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 0,
        fontStyle: 'bold',
        lineWidth: 0.5,
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'left' },
      },
    });

    // --- Footer ---
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFont(undefined, 'bold');
    doc.text('FINISHING DEPT HEAD SIGNATURE', margin, finalY);

    // Save PDF
    doc.save(`Final_QC_Report_${qcData.jcNo || 'Report'}.pdf`);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={qcData ? generatePdf : undefined}
      disabled={!qcData}
    >
      Download Final QC Report PDF
    </Button>
  );
};

FinalQcReportPDF.propTypes = {
  qcData: PropTypes.shape({
    jcNo: PropTypes.string,
    product: PropTypes.string,
    rCardNo: PropTypes.string,
    jcDate: PropTypes.string,
    fabric: PropTypes.string,
    dateOfCommence: PropTypes.string,
    jcQty: PropTypes.number,
    colour: PropTypes.string,
    jcClosedOn: PropTypes.string,
    workOrderNo: PropTypes.string,
    style: PropTypes.string,
    gender: PropTypes.string,
    remarks: PropTypes.string,
    receivedQty: PropTypes.objectOf(PropTypes.number),
    minorDamageQty: PropTypes.objectOf(PropTypes.number),
    majorDamageQty: PropTypes.objectOf(PropTypes.number),
    outputQty: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
};

export default FinalQcReportPDF;
