'use client';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import logo from '../../assets/images/reports/imagetop.png';

const FabricQcReportPDF = ({ qcData }) => {
  const drawPageBorder = (doc, pageWidth, pageHeight, margin) => {
    doc.setDrawColor(0);
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
  };

  const generateQcReportPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // Draw page border
    drawPageBorder(doc, pageWidth, pageHeight, margin);

    // Add logo
    try {
      const logoImg = await getBase64Image(logo);
      doc.addImage(logoImg, 'PNG', margin, 5, pageWidth - 2 * margin, 25);
    } catch (error) {
      console.warn('Logo could not be loaded:', error);
    }

    const {
      receptionSite,
      reportRef,
      origin,
      qcNo,
      date,
      invNo,
      invDate,
      commodityDescription,
      qcParameters = [],
      qcBy,
      verifiedBy,
      approvedBy,
      qcSignature,
      verifiedSignature,
      approvedSignature,
      qcDate,
      verifiedDate,
      approvedDate,
      ccTo,
    } = qcData;

    let y = 35;

    // Title
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Quality Check (QC) Report', pageWidth / 2, y, { align: 'center' });
    y += 15;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    // Line 1: Reception Site and QC
    const line1Y = y;
    const threeFourthsX = margin + (pageWidth - 2 * margin) * 0.75;
    // Reception Site / Warehouse label and line (first 3/4)
    doc.text('Reception Site / Warehouse:', margin, line1Y);
    doc.line(margin + 50, line1Y, threeFourthsX - 5, line1Y);
    if (receptionSite) {
      doc.text(receptionSite, margin + 52, line1Y - 1, {
        maxWidth: threeFourthsX - (margin + 52) - 2,
      });
    }
    // QC label and line (last 1/4)
    doc.text('QC:', threeFourthsX, line1Y);
    doc.line(threeFourthsX + 15, line1Y, pageWidth - margin, line1Y);
    if (qcNo) {
      doc.text(qcNo, threeFourthsX + 17, line1Y - 1);
    }
    y += 12;

    // Line 2: Report Ref and Date
    const line2Y = y;
    doc.text('Report Ref:', margin, line2Y);
    doc.line(margin + 25, line2Y, pageWidth / 2 - 5, line2Y);
    if (reportRef) {
      doc.text(reportRef, margin + 27, line2Y - 1);
    }

    const dateX = pageWidth / 2 + 10;
    doc.text('Date:', dateX, line2Y);
    doc.line(dateX + 15, line2Y, pageWidth - margin, line2Y);
    if (date) {
      doc.text(new Date(date).toLocaleDateString('en-CA'), dateX + 17, line2Y - 1);
    }
    y += 12;

    // Line 3: Origin, INV No, INV Date
    const line3Y = y;
    const col1Width = (pageWidth - 2 * margin) / 3;
    const col2X = margin + col1Width;
    const col3X = margin + 2 * col1Width;

    // Origin
    doc.text('Origin:', margin, line3Y);
    doc.line(margin + 20, line3Y, col2X - 5, line3Y);
    if (origin) {
      doc.text(origin, margin + 22, line3Y - 1);
    }

    // INV No
    doc.text('INV. No.:', col2X, line3Y);
    doc.line(col2X + 25, line3Y, col3X - 5, line3Y);
    if (invNo) {
      doc.text(invNo, col2X + 27, line3Y - 1);
    }

    // INV Date
    doc.text('Date:', col3X, line3Y);
    doc.line(col3X + 15, line3Y, pageWidth - margin, line3Y);
    if (invDate) {
      doc.text(new Date(invDate).toLocaleDateString('en-CA'), col3X + 17, line3Y - 1);
    }
    y += 15;

    // Commodity Description
    doc.text('Commodity Description:', margin, y);
    doc.line(margin + 45, y, pageWidth - margin, y);
    if (commodityDescription) {
      doc.text(commodityDescription, margin + 47, y - 1);
    }
    y += 15;

    // QC Parameters Table
    const tableData = qcParameters.map((param, index) => [
      index + 1,
      param.label || '',
      param.tolerance || '',
      param.variation || '',
      typeof param.accepted === 'number' ? param.accepted : param.accepted ? 1 : 0,
      typeof param.rejected === 'number' ? param.rejected : param.rejected ? 1 : 0,
      param.remarks || '',
    ]);

    doc.autoTable({
      startY: y,
      head: [
        [
          'Sl. No.',
          'QC Parameter',
          'Tolerance (%)',
          '% of Variation',
          'Accepted',
          'Rejected',
          'Remarks',
        ],
      ],
      body: tableData,
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35, halign: 'left' },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 50, halign: 'left' },
      },
    });

    // Get the final Y position after the table
    y = doc.lastAutoTable.finalY + 15;

    // Declaration text
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(
      'We the undersigned declare that the products and commodities listed were QC tested as mentioned above.',
      margin,
      y,
      { maxWidth: pageWidth - 2 * margin },
    );
    y += 15;

    // Signature section as table
    const signatureTableData = [
      [
        `QC By: ${qcBy || ''}`,
        `Verified By: ${verifiedBy || ''}`,
        `Approved By: ${approvedBy || ''}`,
      ],
      [
        `Signature: ${qcSignature || ''}`,
        `Signature: ${verifiedSignature || ''}`,
        `Signature: ${approvedSignature || ''}`,
      ],
      [
        `Date: ${qcDate ? new Date(qcDate).toLocaleDateString('en-CA') : ''}`,
        `Date: ${verifiedDate ? new Date(verifiedDate).toLocaleDateString('en-CA') : ''}`,
        `Date: ${approvedDate ? new Date(approvedDate).toLocaleDateString('en-CA') : ''}`,
      ],
    ];

    doc.autoTable({
      startY: y,
      body: signatureTableData,
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: 'left',
        valign: 'top',
      },
      columnStyles: {
        0: { cellWidth: (pageWidth - 2 * margin) / 3 },
        1: { cellWidth: (pageWidth - 2 * margin) / 3 },
        2: { cellWidth: (pageWidth - 2 * margin) / 3 },
      },
      didParseCell: (data) => {
        // Make the header rows (QC By, Verified By, Approved By) and label rows bold
        if (data.row.index === 0 || data.row.index === 3 || data.row.index === 6) {
          data.cell.styles.fontStyle = 'bold';
        }
        // Add extra height for signature rows
        if (data.row.index === 2 || data.row.index === 5) {
          data.cell.styles.minCellHeight = 15;
        }
      },
    });

    // Get the final Y position after the signature table
    y = doc.lastAutoTable.finalY + 10;

    // CC to
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Cc to: ${ccTo || 'Accounts'}`, margin, y);

    // Save the PDF
    doc.save(`QC_Report_${qcNo || 'Report'}.pdf`);
  };

  const getBase64Image = (img) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = img;
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      image.onerror = () => reject(new Error('Image loading failed.'));
    });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={qcData ? generateQcReportPDF : undefined}
        disabled={!qcData}
        sx={{ mb: 2 }}
      >
        Download QC Report PDF
      </Button>
    </div>
  );
};

FabricQcReportPDF.propTypes = {
  qcData: PropTypes.shape({
    receptionSite: PropTypes.string,
    reportRef: PropTypes.string,
    origin: PropTypes.string,
    qcNo: PropTypes.string,
    date: PropTypes.string,
    invNo: PropTypes.string,
    invDate: PropTypes.string,
    commodityDescription: PropTypes.string,
    qcParameters: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        tolerance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        variation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        accepted: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        rejected: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        remarks: PropTypes.string,
      }),
    ),
    qcBy: PropTypes.string,
    verifiedBy: PropTypes.string,
    approvedBy: PropTypes.string,
    qcSignature: PropTypes.string,
    verifiedSignature: PropTypes.string,
    approvedSignature: PropTypes.string,
    qcDate: PropTypes.string,
    verifiedDate: PropTypes.string,
    approvedDate: PropTypes.string,
    ccTo: PropTypes.string,
  }).isRequired,
};

export default FabricQcReportPDF;
