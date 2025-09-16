'use client';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const departmentsWithSizes = [
  'bitchecking',
  'recutting',
  'printing&fusing',
  'operationpart',
  'stitching',
  'finishing',
  'fqi',
];

const sizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

export default function RouteCardGenerator({ rowData, workflowData }) {
  console.log('🚀 ~ RouteCardGenerator ~ rowData:', rowData);
  console.log('🚀 ~ RouteCardGenerator ~ workflowData:', workflowData);

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

    // --- Three departments per row ---
    // Split departments into triplets
    const departmentTriplets = [];
    for (let i = 0; i < departmentsWithSizes.length; i += 3) {
      departmentTriplets.push(departmentsWithSizes.slice(i, i + 3));
    }

    // For each triplet, create a table
    departmentTriplets.forEach((triplet, tripletIdx) => {
      // First header row: department names (each spans 4 columns)
      const headerRow1 = ['Size'];
      triplet.forEach(() => {
        headerRow1.push('', '', '', '');
      });
      // Fill department names
      let deptCol = 1;
      triplet.forEach((dept) => {
        headerRow1[deptCol] = dept.charAt(0).toUpperCase() + dept.slice(1).replace('&', ' & ');
        deptCol += 4;
      });

      // Second header row: subtopics
      const headerRow2 = [''];
      triplet.forEach(() => {
        headerRow2.push('Received', 'QC Pass', 'QC Reject', 'Line');
      });

      // Column styles
      const columnStyles = { 0: { cellWidth: 18 } };
      for (let i = 0; i < triplet.length; i++) {
        const baseIndex = i * 4 + 1;
        columnStyles[baseIndex] = { cellWidth: 32 }; // Received wider for department name
        columnStyles[baseIndex + 1] = { cellWidth: 18 };
        columnStyles[baseIndex + 2] = { cellWidth: 18 };
        columnStyles[baseIndex + 3] = { cellWidth: 18 };
      }

      // Table data
      const tableData = sizes.map((size) => {
        const row = [size.toUpperCase()];
        triplet.forEach((dept) => {
          const deptData = workflowData[dept] || {};
          const receivedQty = deptData.received?.[size] || 0;
          const sizeData = deptData[size] || {};
          const qcPassQty = sizeData.qcpass || 0;
          const qcRejectQty = sizeData.qcreject || 0;
          const lineQty = sizeData.line || 0;
          row.push(receivedQty, qcPassQty, qcRejectQty, lineQty);
        });
        return row;
      });

      // Totals row
      const totalsRow = ['TOTAL'];
      triplet.forEach((dept) => {
        const deptData = workflowData[dept] || {};
        const totalReceived = sizes.reduce(
          (sum, size) => sum + (deptData.received?.[size] || 0),
          0,
        );
        const totalQcPass = sizes.reduce((sum, size) => {
          const sizeData = deptData[size] || {};
          return sum + (sizeData.qcpass || 0);
        }, 0);
        const totalQcReject = sizes.reduce((sum, size) => {
          const sizeData = deptData[size] || {};
          return sum + (sizeData.qcreject || 0);
        }, 0);
        const totalLine = sizes.reduce((sum, size) => {
          const sizeData = deptData[size] || {};
          return sum + (sizeData.line || 0);
        }, 0);
        totalsRow.push(totalReceived, totalQcPass, totalQcReject, totalLine);
      });
      tableData.push(totalsRow);

      // Remarks row
      const remarksRow = ['Remarks'];
      triplet.forEach((dept) => {
        const deptData = workflowData[dept] || {};
        remarksRow.push(deptData.remarks || '', '', '', '');
      });
      tableData.push(remarksRow);

      // Signature row
      const signatureRow = ['Signatures'];
      triplet.forEach(() => {
        signatureRow.push('Signature', '', '', '');
      });
      tableData.push(signatureRow);

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

      doc.autoTable({
        startY: y,
        head: [headerRow1, headerRow2],
        body: tableData,
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
          textColor: [0, 0, 0], // Black text for all table headings
          cellPadding: 1, // Decrease heading height
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
          if (data.row.index === tableData.length - 2) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [220, 220, 220];
          }
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.halign = 'left';
          }
          // Remove all custom blue borders
          // Set background color for each department group
          const deptGroupSize = 4;
          for (let i = 0; i < triplet.length; i++) {
            const base = i * deptGroupSize + 1;
            const color = deptColors[i % deptColors.length];
            if (data.column.index >= base && data.column.index <= base + 3) {
              data.cell.styles.fillColor = color;
            }
          }
          // Set the first column ('Size') header and sub-header to black text
          if (data.row.section === 'head' && data.column.index === 0) {
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
        didDrawCell: (data) => {
          // Merge department name cells: colSpan=4 for the first cell of each department, colSpan=0 for the next three
          if (
            data.row.section === 'head' &&
            data.row.index === 0 &&
            data.column.index > 0 &&
            (data.column.index - 1) % 4 !== 0
          ) {
            data.cell.colSpan = 0;
          }
          // The first cell of each department gets colSpan=4 by default (autoTable behavior)
          // Style the department name cell with the same color as its group
          if (
            data.row.section === 'head' &&
            data.row.index === 0 &&
            (data.column.index - 1) % 4 === 0 &&
            data.column.index > 0
          ) {
            const deptIdx = Math.floor((data.column.index - 1) / 4);
            const color = deptColors[deptIdx % deptColors.length];
            data.cell.styles.fillColor = color;
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.halign = 'center';
            data.cell.styles.valign = 'middle';
            data.cell.styles.textColor = [0, 0, 0]; // Black text for department name
          }
          // Set all table heading (header rows) text to black
          if (data.row.section === 'head') {
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
      });
      // After each table, start a new page for the next triplet (except the last one)
      if (tripletIdx < departmentTriplets.length - 1) {
        doc.addPage();
        y = 15;
      } else {
        // On the last page, render the department status table side by side with the last department table
        const lastTableY = y;
        const lastTableFinalY = doc.lastAutoTable.finalY;
        // Department Status table (right half)
        const statusHeaders = ['Department', 'Status', 'Start Time', 'Finish Time', 'Remarks'];
        const statusData = departmentsWithSizes.map((dept) => {
          const deptData = workflowData[dept] || {};
          const deptName = dept.charAt(0).toUpperCase() + dept.slice(1).replace('&', ' & ');
          return [
            deptName,
            deptData.processCompletion?.completed ? 'Completed' : 'Pending',
            deptData.timing?.startTime
              ? new Date(deptData.timing.startTime).toLocaleString()
              : 'N/A',
            deptData.timing?.finishTime
              ? new Date(deptData.timing.finishTime).toLocaleString()
              : 'N/A',
            deptData.remarks || 'N/A',
          ];
        });
        doc.autoTable({
          startY: lastTableY,
          tableWidth: (pageWidth - 2 * margin) / 2 - 2,
          margin: { left: pageWidth /2.5, right: margin },
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
            cellPadding: 1,
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 25 },
            2: { cellWidth: 35 },
            3: { cellWidth: 35 },
            4: { cellWidth: 40 },
          },
        });
        y = Math.max(lastTableFinalY, doc.lastAutoTable.finalY) + 15;
      }
    });

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
