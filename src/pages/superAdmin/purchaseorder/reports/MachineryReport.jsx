'use client';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import logo from '../../../../assets/images/reports/imagetop.png';

const MachinePO = ({ poData }) => {
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

    // Add logo if available
    const logoImg = await getBase64Image(logo);
    doc.addImage(logoImg, 'PNG', margin, 5, pageWidth - 2 * margin, 25);

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Purchase Order', pageWidth / 2, 35, { align: 'center' });

    // Correct destructuring to match the actual data structure
    const {
      purchaseOrderNumber,
      createdAt,
      department,
      quotationNumber,
      indentId,
      vendorId,
      gst,
      grandTotal,
      items
    } = poData;

    console.log('🚀 ~ generatePOPDF ~ poData:', poData);

    let y = 45;
    const leftX = margin;
    const rightX = pageWidth / 2 + 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('To,', leftX, y);
    doc.setFont(undefined, 'normal');
    doc.text(vendorId.vendorName, leftX, y + 6);
    const addressLines = doc.splitTextToSize(vendorId.address, pageWidth / 2 - 20);
    doc.text(addressLines, leftX, y + 12);

    doc.autoTable({
      startY: y - 5,
      startX: rightX,
      margin: { left: rightX },
      tableWidth: pageWidth / 2 - margin - 10,
      body: [
        ['Date', createdAt],
        ['PO No', purchaseOrderNumber],
        ['Department', department || 'Machine'],
        ['Quotation No', quotationNumber],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
    });

    y = doc.lastAutoTable.finalY + 10;
    doc.text('Dear Sir,', margin, y);
    y += 5;

    doc.setFont(undefined, 'normal');
    const subjectText =
      'We are herewith glad to place the order for the below mentioned machines as per your offer subject to terms & conditions mentioned hereunder.';
    const wrappedSubject = doc.splitTextToSize(subjectText, pageWidth - 2 * margin);
    doc.text(wrappedSubject, margin, y);
    y += wrappedSubject.length * 3;

    // Machine table using the correct data structure
    const tableRows = items?.map((item, index) => {
      // Map data from codeDetails based on available ID type
      const itemCode =
        item.codeDetails?.mainAssetId ||
        item.codeDetails?.mainItemCode ||
        item.codeDetails?.mainMaintenanceId ||
        item.displayCode ||
        'N/A';

      const itemDescription = item.codeDetails?.description || item.description || 'No description';

      return [
        index + 1,
        `${itemCode} - ${itemDescription}`,
        item.orderQuantity || item.indentQuantity,
        `${Number.parseFloat(item.codeDetails?.price || 0).toFixed(2)}`,
        `${(
          Number.parseFloat(item.codeDetails?.price || 0) *
          Number.parseFloat(item.orderQuantity || item.indentQuantity)
        ).toFixed(2)}`,
      ];
    });

    // Replace the current GST calculation section with this:
    tableRows.push(['', '', '', '', '']);
    tableRows.push([
      '',
      '',
      '',
      `GST @ ${gst}%`,
      `${((Number.parseFloat(gst) / 100) * Number.parseFloat(grandTotal)).toFixed(2)}`,
    ]);
    tableRows.push(['', '', '', 'Grand Total', `${Number.parseFloat(grandTotal).toFixed(2)}`]);

    const usableWidth = pageWidth - margin * 2;

    doc.autoTable({
      startY: y,
      head: [['Sl. No.', 'Model No. & Description', 'Qty in Sets', 'Rate', 'Total']],
      body: tableRows,
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'center',
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [212, 170, 1],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: usableWidth * 0.1 }, // 10%
        1: { cellWidth: usableWidth * 0.5 }, // 55%
        2: { cellWidth: usableWidth * 0.125 }, // 10%
        3: { cellWidth: usableWidth * 0.125 }, // 10%
        4: { cellWidth: usableWidth * 0.15 }, // 15%
      },
      didDrawPage: (data) => {
        drawPageBorder(doc, pageWidth, pageHeight, margin);
      },
      pageBreak: 'auto',
    });

    doc.save(`Machine_PO_${purchaseOrderNumber}.pdf`);
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
      <h3>Machine Purchase Order</h3>
      <Button variant="contained" color="primary" onClick={generatePOPDF}>
        Download Machine PO PDF
      </Button>
    </div>
  );
};

export default MachinePO;
