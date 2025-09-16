import React from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import logo from '../../../../assets/images/reports/imagetop.png';

const TrimsAccessoriesPO = ({ poData }) => {
  const drawPageBorder = (doc, pageWidth, pageHeight, margin) => {
    doc.setDrawColor(0);
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
  };

  const generatePOPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    drawPageBorder(doc, pageWidth, pageHeight, margin);

    const logoImg = await getBase64Image(logo);
    doc.addImage(logoImg, 'PNG', margin, 5, pageWidth - 2 * margin, 25);

    console.log('🚀 ~ generatePOPDF ~ poData:', poData);
    const {
      purchaseOrderNumber,
      createdAt,
      quotationNumber,
      vendorId,
      gst,
      grandTotal,
      items, // <-- get items directly
    } = poData;
    console.log('🚀 ~ generatePOPDF ~ vendorId:', vendorId);

    // Defensive check for items
    if (!Array.isArray(items)) {
      alert('No items found to generate the PDF.');
      return;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');

    let y = 40;
    const leftX = margin;
    const rightX = pageWidth / 2 + 10;

    // Draw Left-side Box
    const boxHeight = 40;
    doc.rect(leftX, y, pageWidth / 2 - 20, boxHeight);
    doc.text('To,', leftX + 2, y + 6);
    doc.setFont(undefined, 'normal');
    doc.text(vendorId?.vendorName || '', leftX + 2, y + 12);
    doc.text(vendorId?.address || '', leftX + 2, y + 18, { maxWidth: pageWidth / 2 - 20 });

    doc.autoTable({
      startY: y,
      startX: rightX,
      margin: { left: rightX },
      tableWidth: pageWidth / 2 - margin - 10,
      body: [
        ['Date', new Date(createdAt).toLocaleDateString('en-CA')],
        ['PO No', purchaseOrderNumber],
        ['Department', 'Trims & Accessories'],
        // ['Contact Person', contactPerson],
        ['Quotation No.', quotationNumber],
      ],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak',
        lineWidth: 0.5, // <-- Bolder border
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [239, 191, 0],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 'auto' },
      },
    });

    y += boxHeight + 10;

    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Subject:', margin, y);
    doc.setFont(undefined, 'normal');
    doc.text(
      'We are herewith glad to place the order as per your offer subject to the terms & conditions mentioned hereunder.',
      margin,
      y + 6,
      { maxWidth: pageWidth - 2 * margin },
    );

    // Use poData.items and item.orderQuantity
    const tableRows = items?.map((item, index) => [
      index + 1,
      item.code?.bomId || '',
      item.orderQuantity,
      `${parseFloat(item?.code?.price || 0).toFixed(2)}`,
      `${(parseFloat(item?.code?.price || 0) * parseFloat(item.orderQuantity || 0)).toFixed(2)}`,
    ]);

    tableRows.push(['', '', '', '', '']);
    tableRows.push([
      '',
      '',
      '',
      `GST @ ${gst}%`,
      `${((parseFloat(gst || 0) / 100) * parseFloat(grandTotal || 0)).toFixed(2)}`,
    ]);
    tableRows.push(['', '', '', 'Grand Total', `${parseFloat(grandTotal || 0).toFixed(2)}`]);

    const usableWidth = pageWidth - margin * 2;

    doc.autoTable({
      startY: y + 20,
      head: [['Sl. No.', 'Product Id', 'Order Quantity', 'Rate (INR)', 'Amount (INR)']],
      body: tableRows,
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.8, // Thicker border
        lineColor: [0, 0, 0], // Black border
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [239, 191, 0],
        fontStyle: 'bold',
        lineWidth: 0.8,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: usableWidth * 0.1 }, // 10%
        1: { cellWidth: usableWidth * 0.5 }, // 55%
        2: { cellWidth: usableWidth * 0.125 }, // 10%
        3: { cellWidth: usableWidth * 0.125 }, // 10%
        4: { cellWidth: usableWidth * 0.15 }, // 15%
      },
    });

    doc.save(`PO_${purchaseOrderNumber}.pdf`);
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
    <div style={{ padding: '2rem' }}>
      <h3>Trims & Accessories PO</h3>
      <Button
        variant="contained"
        color="primary"
        onClick={poData?.items ? generatePOPDF : undefined}
        disabled={!poData?.items}
      >
        Download PO PDF
      </Button>
    </div>
  );
};

TrimsAccessoriesPO.propTypes = {
  poData: PropTypes.shape({
    purchaseOrderNumber: PropTypes.string,
    createdAt: PropTypes.string,
    quotationNumber: PropTypes.string,
    vendorId: PropTypes.shape({
      vendorName: PropTypes.string,
      address: PropTypes.string,
    }),
    gst: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    grandTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.shape({
          bomId: PropTypes.string,
          price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
        orderQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
  }).isRequired,
};

export default TrimsAccessoriesPO;
