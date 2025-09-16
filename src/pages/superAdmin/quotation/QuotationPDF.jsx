'use client';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import logo from '../../../assets/images/reports/imagetop.png';

const QuotationPDF = ({ quotationData }) => {
  const drawPageBorder = (doc, pageWidth, pageHeight, margin) => {
    doc.setDrawColor(0);
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
  };

  const generateQuotationPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // Calculate available width within the border (border is at margin/2 from each edge)
    const availableWidth = pageWidth - margin - 4; // Extra padding to ensure it stays within border

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
      qtnNo,
      date,
      to,
      gstin,
      gstRate,
      note,
      items = [],
      total,
      gst,
      roundedOff,
      grandTotal,
    } = quotationData;

    // Format date for PDF
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return dateString;
      // Format as DD/MM/YYYY
      return dateObj.toLocaleDateString('en-GB');
    };

    let y = 35;

    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('QUOTATION', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Header info - To on left, table on right
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    // Left side: To
    doc.text('To,', margin, y);
    y += 6;
    doc.text(to || '', margin, y);

    // Right side table with Date, QTN No, Our GSTIN
    const headerTableData = [
      ['Date', formatDate(date) || ''],
      ['QTN No', qtnNo || ''],
      ['Our GSTIN', gstin || ''],
    ];

    doc.autoTable({
      startY: y - 6,
      startX: pageWidth - 80,
      margin: { left: pageWidth - 80 },
      tableWidth: 70,
      body: headerTableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold' },
        1: { cellWidth: 45 },
      },
    });

    y += 20;

    // Dear Sir/Madam text above table
    doc.text('Dear Madam/Sir,', margin, y);
    y += 6;
    doc.text(
      'We are greatly privileged to be given this opportunity to supply your customized order, subject to the terms and conditions outlined below.',
      margin,
      y,
      { maxWidth: availableWidth },
    );
    y += 15;

    // Items Table with note in particulars column
    const tableData = items.map((item, index) => [
      index + 1,
      item.particulars || '',
      item.brand || '',
      item.mrp || '',
      item.rate || '',
      item.quantity || '',
      item.total || '',
    ]);

    doc.autoTable({
      startY: y,
      head: [
        [
          'Sl. No.',
          'PARTICULARS',
          'Brand',
          'MRP',
          'Rate per UNIT',
          'Quantity (Pcs)',
          'TOTAL [Rs.]',
        ],
      ],
      body: tableData,
      theme: 'grid',
      margin: { left: margin, right: margin },
      tableWidth: availableWidth,
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
        0: { cellWidth: 12 }, // Fixed smaller widths to fit within border
        1: { cellWidth: 85, halign: 'left' },
        2: { cellWidth: 16 },
        3: { cellWidth: 16 },
        4: { cellWidth: 20 },
        5: { cellWidth: 18 },
        6: { cellWidth: 18 },
      },
    });

    // Totals section - no gap, same dimensions
    const totalsData = [
      ['', '', '', '', '', 'Total', `Rs. ${total || '0.00'}`],
      ['', '', '', '', '', `GST @ ${gstRate}%`, `Rs. ${gst || '0.00'}`],
      ['', '', '', '', '', 'Rounded Off', `Rs. ${roundedOff || '0.00'}`],
      ['', '', '', '', '', 'Grand Total', `Rs. ${grandTotal || '0.00'}`],
    ];
    // Add note as the last row, spanning all columns, if present
    if (note) {
      totalsData.push([
        { content: `Note: ${note}`, colSpan: 7, styles: { fontStyle: 'italic', halign: 'left' } },
      ]);
    }

    doc.autoTable({
      startY: doc.lastAutoTable.finalY, // No gap
      body: totalsData,
      theme: 'grid',
      margin: { left: margin, right: margin },
      tableWidth: availableWidth,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 12 }, // Same exact widths as items table
        1: { cellWidth: 85 },
        2: { cellWidth: 16 },
        3: { cellWidth: 16 },
        4: { cellWidth: 20 },
        5: { cellWidth: 18, fontStyle: 'bold' },
        6: { cellWidth: 18, fontStyle: 'bold' },
      },
      didParseCell: (data) => {
        if (data.row.index === 3) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
    });

    doc.save(`Quotation_${qtnNo || 'Quote'}.pdf`);
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
        onClick={quotationData ? generateQuotationPDF : undefined}
        disabled={!quotationData}
        sx={{ mb: 2 }}
      >
        Download Quotation PDF
      </Button>
    </div>
  );
};

QuotationPDF.propTypes = {
  quotationData: PropTypes.shape({
    qtnNo: PropTypes.string,
    date: PropTypes.string,
    to: PropTypes.string,
    gstin: PropTypes.string,
    gstRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    note: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        particulars: PropTypes.string,
        brand: PropTypes.string,
        mrp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gst: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    roundedOff: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    grandTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default QuotationPDF;
