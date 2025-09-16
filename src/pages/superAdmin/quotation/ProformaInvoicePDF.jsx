'use client';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import logo from '../../../assets/images/reports/imagetop.png';

const ProformaInvoicePDF = ({ piData }) => {
  const drawPageBorder = (doc, pageWidth, pageHeight, margin) => {
    doc.setDrawColor(0);
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
  };

  const generateProformaInvoicePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // Draw page border
    drawPageBorder(doc, pageWidth, pageHeight, margin);

    // Company Info Header
    let y = 10;
    // Add logo
    try {
      const logoImg = await getBase64Image(logo);
      doc.addImage(logoImg, 'PNG', margin, 5, pageWidth - 2 * margin, 25);
    } catch (error) {
      console.warn('Logo could not be loaded:', error);
    }
    y += 25;

    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('PROFORMA INVOICE', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8; // More margin below the table

    // Invoice Details Table
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return dateString;
      return dateObj.toLocaleDateString('en-GB');
    };
    const invoiceDetailsData = [
      [
        { content: 'Invoice No.', styles: { fontStyle: 'bold' } },
        piData.invoiceNo || '',
        { content: 'Dated', styles: { fontStyle: 'bold' } },
        piData.invoiceDate ? formatDate(piData.invoiceDate) : '',
      ],
      [
        { content: 'Delivery Note', styles: { fontStyle: 'bold' } },
        piData.deliveryNote || '',
        { content: 'Mode/Terms of Payment', styles: { fontStyle: 'bold' } },
        piData.modeOrTermsOfPayment || '',
      ],
      [
        { content: 'Reference No. & Date.', styles: { fontStyle: 'bold' } },
        piData.referenceNoAndDate || '',
        { content: 'Other References', styles: { fontStyle: 'bold' } },
        piData.otherReferences || '',
      ],
      [
        { content: "Buyer's Order No.", styles: { fontStyle: 'bold' } },
        piData.buyersOrderNo || '',
        { content: 'Dated', styles: { fontStyle: 'bold' } },
        piData.buyersOrderDate ? formatDate(piData.buyersOrderDate) : '',
      ],
      [
        { content: 'Dispatch Doc No.', styles: { fontStyle: 'bold' } },
        piData.dispatchDocNo || '',
        { content: 'Delivery Note Date', styles: { fontStyle: 'bold' } },
        piData.deliveryNoteDate ? formatDate(piData.deliveryNoteDate) : '',
      ],
      [
        { content: 'Dispatched through', styles: { fontStyle: 'bold' } },
        piData.dispatchedThrough || '',
        { content: 'Destination', styles: { fontStyle: 'bold' } },
        piData.destination || '',
      ],
    ];
    doc.autoTable({
      startY: y,
      body: invoiceDetailsData,
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: (pageWidth - 2 * margin) / 4 },
        1: { cellWidth: (pageWidth - 2 * margin) / 4 },
        2: { cellWidth: (pageWidth - 2 * margin) / 4 },
        3: { cellWidth: (pageWidth - 2 * margin) / 4 },
      },
      didParseCell: (data) => {
        if (data.row.index === 0) {
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
    });
    y = doc.lastAutoTable.finalY + 12; // More margin below the invoice details table

    // Consignee/Buyer Section
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Consignee (Ship to):', margin, y);
    doc.text('Buyer (Bill to):', pageWidth / 2, y);
    doc.setFont(undefined, 'normal');
    y += 5;
    doc.setFontSize(9);
    doc.text(piData.consignee || '', margin, y, { maxWidth: pageWidth / 2 - margin });
    doc.text(piData.buyer || '', pageWidth / 2, y, { maxWidth: pageWidth / 2 - margin });
    y += 15;

    // Goods Table
    const goodsTableData = piData.goods.map((item, index) => [
      index + 1,
      item.description || '',
      item.hsnOrSac || '',
      item.quantity || '',
      item.rate || '',
      item.per || '',
      item.amount || '',
    ]);
    doc.autoTable({
      startY: y,
      head: [['Sl No.', 'Description of Goods', 'HSN/SAC', 'Quantity', 'Rate', 'per', 'Amount']],
      body: goodsTableData,
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
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 60, halign: 'left' },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 25 },
      },
    });
    y = doc.lastAutoTable.finalY + 10;

    // Bank Details Box
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Company's Bank Details", margin, y);
    doc.setFont(undefined, 'normal');
    y += 5;
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.rect(margin, y, pageWidth - 2 * margin, 20);
    doc.setFontSize(9);
    let bankY = y + 5;
    doc.text("A/c Holder's Name: Samurai Exports Pvt Ltd", margin + 2, bankY);
    bankY += 4;
    doc.text('Bank Name: Union Bank of India-CA- 510101006788944', margin + 2, bankY);
    bankY += 4;
    doc.text('A/c No.: 510101006788944', margin + 2, bankY);
    bankY += 4;
    doc.text('Branch & IFS Code: Mysore Road Branch (0395) & UBIN0903957', margin + 2, bankY);
    y += 25;

    // Declaration and Signature
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Declaration', margin, y);
    y += 6;
    doc.setFont(undefined, 'normal');
    doc.text(
      'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
      margin,
      y,
      { maxWidth: pageWidth / 2 - margin },
    );
    y += 10;
    doc.text('E. & O.E', margin, y);
    // Signature
    doc.setFont(undefined, 'bold');
    doc.text('for Samurai Exports Pvt Ltd', pageWidth - margin - 60, y);
    y += 15;

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('SUBJECT TO BANGALORE JURISDICTION', pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.text('This is a Computer Generated Invoice', pageWidth / 2, y, { align: 'center' });

    doc.save(`Proforma_Invoice_${piData.invoiceNo || 'PI'}.pdf`);
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
        onClick={piData ? generateProformaInvoicePDF : undefined}
        disabled={!piData}
        sx={{ mb: 2 }}
      >
        Download Proforma Invoice PDF
      </Button>
    </div>
  );
};

ProformaInvoicePDF.propTypes = {
  piData: PropTypes.shape({
    invoiceNo: PropTypes.string,
    invoiceDate: PropTypes.string,
    deliveryNote: PropTypes.string,
    modeOrTermsOfPayment: PropTypes.string,
    referenceNoAndDate: PropTypes.string,
    otherReferences: PropTypes.string,
    buyersOrderNo: PropTypes.string,
    buyersOrderDate: PropTypes.string,
    dispatchDocNo: PropTypes.string,
    deliveryNoteDate: PropTypes.string,
    dispatchedThrough: PropTypes.string,
    destination: PropTypes.string,
    termsOfDelivery: PropTypes.string,
    consignee: PropTypes.string,
    buyer: PropTypes.string,
    goods: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        hsnOrSac: PropTypes.string,
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        per: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
  }).isRequired,
};

export default ProformaInvoicePDF;
