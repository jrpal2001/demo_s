'use client';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const departmentsWithSizes = [
  'cutting',
  'bitchecking',
  'recutting',
  'printing&fusing',
  'operationpart',
  'stitching',
  'finishing',
  'fqi',
];

export default function RouteCardGenerator({ rowData, workflowData }) {
  console.log('🚀 ~ RouteCardGenerator ~ rowData:', rowData);
  console.log('🚀 ~ RouteCardGenerator ~ workflowData:', workflowData);

  // Define a palette of light colors for department groups
  const deptColors = [
    [220, 235, 255], // light blue
    [235, 255, 220], // light green
    [255, 245, 220], // light orange
    [255, 230, 230], // light red
    [240, 220, 255], // light purple
    [255, 255, 220], // light yellow
    [220, 255, 255], // light cyan
  ];

  const generateRouteCardPDF = () => {
    if (!workflowData || !rowData) {
      alert('No data available');
      return;
    }

    const doc = new jsPDF('landscape'); // Use landscape for better table fit
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = 15;

    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('SAMURAI EXPORTS PVT. LTD. BANGALORE', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.text('ROUTE CARD', pageWidth / 2, y, { align: 'center' });
    y += 12;

    // Job Card Information Section
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    // Header information from rowData
    const col1X = margin;
    const col2X = pageWidth / 3;
    const col3X = (pageWidth * 2) / 3;

    doc.text(`J/c No: ${rowData.jobCardRef?.jobCardNo || 'N/A'}`, col1X, y);
    doc.text(`Work Order ID: ${rowData.workOrderId || 'N/A'}`, col2X, y);
    doc.text(`SKU Code: ${rowData.jobCardRef?.skuCode || 'N/A'}`, col3X, y);
    y += 6;

    doc.text(
      `Date: ${
        rowData.jobCardRef?.date ? new Date(rowData.jobCardRef.date).toLocaleDateString() : 'N/A'
      }`,
      col1X,
      y,
    );
    doc.text(`Color: ${rowData.jobCardRef?.bodyColor || 'N/A'}`, col2X, y);
    doc.text(`Gender: ${rowData.jobCardRef?.gender || 'N/A'}`, col3X, y);
    y += 6;

    doc.text(`Total Quantity: ${rowData.quantityToBeProduced || 0}`, col1X, y);
    y += 12;

    // --- Table: three departments per row, totals only ---
    const deptGroups = [];
    for (let i = 0; i < departmentsWithSizes.length; i += 3) {
      deptGroups.push(departmentsWithSizes.slice(i, i + 3));
    }
    // For each group of three departments, render a separate table
    deptGroups.forEach((group, groupIdx) => {
      // Insert a page break before the last group so it starts on a new page
      if (groupIdx === deptGroups.length - 1) {
        doc.addPage();
        y = 15;
      }
      // Build header rows for this group
      const headerRow1 = [];
      group.forEach(() => {
        headerRow1.push('', '', '', '');
      });
      let deptCol = 0;
      group.forEach((dept) => {
        headerRow1[deptCol] = dept.charAt(0).toUpperCase() + dept.slice(1).replace('&', ' & ');
        deptCol += 4;
      });
      const headerRow2 = [];
      group.forEach(() => {
        headerRow2.push('Received', 'QC Pass', 'QC Reject', 'Line');
      });
      // Data row: totals for each department in this group
      const dataRow = [];
      group.forEach((dept) => {
        const deptData = workflowData[dept] || {};
        // Use only top-level values
        const totalReceived = typeof deptData.received === 'number' ? deptData.received : 0;
        const totalQcPass = typeof deptData.qcpass === 'number' ? deptData.qcpass : 0;
        const totalQcReject = typeof deptData.qcreject === 'number' ? deptData.qcreject : 0;
        const totalLine = typeof deptData.line === 'number' ? deptData.line : 0;
        dataRow.push(totalReceived, totalQcPass, totalQcReject, totalLine);
      });
      // Remarks row
      const remarksRow = ['Remarks'];
      group.forEach((dept) => {
        const deptData = workflowData[dept] || {};
        remarksRow.push(deptData.remarks || '', '', '', '');
      });
      // Signature row
      const signatureRow = [];
      group.forEach(() => {
        signatureRow.push('Signature', '', '', '');
      });
      // Column styles for this group
      const columnStyles = {};
      for (let i = 0; i < group.length; i++) {
        const baseIndex = i * 4;
        columnStyles[baseIndex] = { cellWidth: 32 };
        columnStyles[baseIndex + 1] = { cellWidth: 18 };
        columnStyles[baseIndex + 2] = { cellWidth: 18 };
        columnStyles[baseIndex + 3] = { cellWidth: 18 };
      }
      // Render the table for this group
      doc.autoTable({
        startY: y,
        head: [headerRow1, headerRow2],
        body: [dataRow, remarksRow, signatureRow],
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
          halign: 'center',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [200, 200, 200],
          fontStyle: 'bold',
          fontSize: 9,
          textColor: [0, 0, 0],
        },
        bodyStyles: {
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: margin, right: margin },
        columnStyles: columnStyles,
        didParseCell: (data) => {
          // Set background color for each department group
          const deptGroupSize = 4;
          for (let i = 0; i < group.length; i++) {
            const base = i * deptGroupSize;
            const color = deptColors[(groupIdx * 3 + i) % deptColors.length];
            if (data.column.index >= base && data.column.index <= base + 3) {
              data.cell.styles.fillColor = color;
            }
          }
          // Set all table heading (header rows) text to black
          if (data.row.section === 'head') {
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
        didDrawCell: (data) => {
          // Merge department name cells: colSpan=4 for the first cell of each department, colSpan=0 for the next three
          if (
            data.row.section === 'head' &&
            data.row.index === 0 &&
            data.column.index > 0 &&
            data.column.index % 4 !== 0
          ) {
            data.cell.colSpan = 0;
          }
          // The first cell of each department gets colSpan=4 by default (autoTable behavior)
          // Style the department name cell with the same color as its group
          if (data.row.section === 'head' && data.row.index === 0 && data.column.index % 4 === 0) {
            const deptIdx = groupIdx * 3 + Math.floor(data.column.index / 4);
            const color = deptColors[deptIdx % deptColors.length];
            data.cell.styles.fillColor = color;
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.halign = 'center';
            data.cell.styles.valign = 'middle';
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
      });

      // After the last group, render the Requirement vs FQI table to the right
      if (groupIdx === deptGroups.length - 1) {
        // Calculate the width of the department table (3 departments * 4 columns * 18-32px each)
        const deptTableWidth = group.length * (32 + 18 + 18 + 18); // sum of cellWidths
        const fqiTableLeft = margin + deptTableWidth + 20; // 20px gap
        const fqiTableStartY = y;
        const requirement = rowData.quantityToBeProduced || 0;
        const fqiPass =
          workflowData.fqi && typeof workflowData.fqi.qcpass === 'number'
            ? workflowData.fqi.qcpass
            : 0;
        const percentFqi =
          requirement > 0 ? ((fqiPass / requirement) * 100).toFixed(2) + '%' : '0%';
        doc.autoTable({
          startY: fqiTableStartY,
          margin: { left: fqiTableLeft },
          head: [['Requirement', 'FQI']],
          body: [
            [requirement, fqiPass],
            [{ content: percentFqi, colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
          ],
          theme: 'grid',
          styles: {
            fontSize: 10,
            cellPadding: 3,
            halign: 'center',
            valign: 'middle',
          },
          headStyles: {
            fillColor: [200, 200, 200],
            fontStyle: 'bold',
            fontSize: 11,
            textColor: [0, 0, 0],
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 30 },
          },
        });
      }
      y = doc.lastAutoTable.finalY + 10;
    });

    // --- Department Summary Table: Pass/Reject/Line/% Rejection ---
    // Prepare columns (departments)
    const summaryDepartments = departmentsWithSizes;
    const summaryHeaders = summaryDepartments.map(
      (dept) => dept.charAt(0).toUpperCase() + dept.slice(1).replace('&', ' & '),
    );
    // Prepare data rows
    const totalPassRow = [];
    const totalRejectRow = [];
    const totalLineRow = [];
    const percentRejectRow = [];
    const qtyProduced = rowData.quantityToBeProduced || 0;
    summaryDepartments.forEach((dept) => {
      const deptData = workflowData[dept] || {};
      // Use only top-level values
      const totalQcPass = typeof deptData.qcpass === 'number' ? deptData.qcpass : 0;
      const totalQcReject = typeof deptData.qcreject === 'number' ? deptData.qcreject : 0;
      const totalLine = typeof deptData.line === 'number' ? deptData.line : 0;
      // % Rejection
      let percentReject = 0;
      if (qtyProduced > 0) {
        percentReject = (totalQcReject / qtyProduced) * 100;
      }
      totalPassRow.push(totalQcPass);
      totalRejectRow.push(totalQcReject);
      totalLineRow.push(totalLine);
      percentRejectRow.push(percentReject.toFixed(2) + '%');
    });
    // Table body
    const summaryBody = [
      ['Total Pass', ...totalPassRow],
      ['Total Reject', ...totalRejectRow],
      ['Total Line', ...totalLineRow],
      ['% Rejection', ...percentRejectRow],
    ];
    // Render the summary table
    doc.autoTable({
      startY: y,
      head: [['', ...summaryHeaders]],
      body: summaryBody,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [180, 180, 180],
        fontStyle: 'bold',
        fontSize: 9,
        textColor: [0, 0, 0],
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 32 },
      },
    });
    y = doc.lastAutoTable.finalY + 10;

    // New page for department status and signature section
    // Department Status Section (unchanged)
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Department Status', margin, y);
    y += 8;
    const statusHeaders = ['Department', 'Status', 'Start Time', 'Finish Time', 'Remarks'];
    const statusData = departmentsWithSizes.map((dept) => {
      const deptData = workflowData[dept] || {};
      const deptName = dept.charAt(0).toUpperCase() + dept.slice(1).replace('&', ' & ');
      return [
        deptName,
        deptData.processCompletion?.completed ? 'Completed' : 'Pending',
        deptData.timing?.startTime ? new Date(deptData.timing.startTime).toLocaleString() : 'N/A',
        deptData.timing?.finishTime ? new Date(deptData.timing.finishTime).toLocaleString() : 'N/A',
        deptData.remarks || 'N/A',
      ];
    });
    doc.autoTable({
      startY: y,
      head: [statusHeaders],
      body: statusData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        fontStyle: 'bold',
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 25 },
        2: { cellWidth: 45 },
        3: { cellWidth: 45 },
        4: { cellWidth: 60 },
      },
    });
    y = doc.lastAutoTable.finalY + 15;

    // Note
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text(
      'NOTE: Any Balance, Rejected, Altered, quantities should be cleared within 2-3 days maximum.',
      margin,
      y,
    );
    y += 4;
    doc.text(
      'JOBCARD along with ROUTE CARD should be sent immediately after completion.',
      margin,
      y,
    );

    // Save PDF
    doc.save(`Route_Card_${rowData.jobCardRef?.jobCardNo || 'unknown'}.pdf`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={generateRouteCardPDF}
        disabled={!workflowData || !rowData}
        size="large"
      >
        Download Route Card PDF
      </Button>
    </div>
  );
}

RouteCardGenerator.propTypes = {
  rowData: PropTypes.object.isRequired,
  workflowData: PropTypes.object.isRequired,
};
