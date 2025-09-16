'use client';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import logo from '../../../../assets/images/reports/imagetop.png';
import PropTypes from 'prop-types';

const FabricPO = ({ poData }) => {
  const drawPageBorder = (doc, pageWidth, pageHeight, margin) => {
    doc.setDrawColor(0);
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
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

  // Function to get unique fabric specifications
  const getUniqueFabricSpecs = (items) => {
    const fabricItems = items.filter(
      (item) => item.code.category === 'fabric' && item.code.subCategory !== 'colar',
    );
    const uniqueSpecs = new Map();

    fabricItems.forEach((item) => {
      const key = `${item.code.fabricStructure}-${item.code.fabricName}-${item.code.yarnComposition}-${item.code.dia}`;
      if (!uniqueSpecs.has(key)) {
        uniqueSpecs.set(key, {
          fabricStructure: item.code.fabricStructure || '',
          quality: item.code.fabricName || '',
          yarnContent: item.code.yarnComposition || '',
          fabricDia: item.code.dia || '',
          gsm: item.code.gsm || '',
        });
      }
    });

    return Array.from(uniqueSpecs.values());
  };

  // Function to get unique collar specifications
  const getUniqueCollarSpecs = (items) => {
    const collarItems = items.filter(
      (item) => item.code.category === 'fabric' && item.code.subCategory === 'colar',
    );
    const uniqueSpecs = new Map();

    collarItems.forEach((item) => {
      const key = `${item.code.collarHeight}-${item.code.collarLength}-${item.code.tapeHeight}`;
      if (!uniqueSpecs.has(key)) {
        uniqueSpecs.set(key, {
          collarHeight: item.code.collarHeight || '',
          collarLength: item.code.collarLength || '',
          tapeHeight: item.code.tapeHeight || '',
        });
      }
    });

    return Array.from(uniqueSpecs.values());
  };

  const generatePOPDF = async () => {
    if (!poData) {
      alert('No PO data available');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    drawPageBorder(doc, pageWidth, pageHeight, margin);

    // Add logo
    const logoImg = await getBase64Image(logo);
    doc.addImage(logoImg, 'PNG', margin, 5, pageWidth - 2 * margin, 25);

    const { purchaseOrderNumber, createdAt, quotationNumber, vendorId, gst, items } = poData;

    let y = 40;
    const leftX = margin;
    const rightX = pageWidth / 2 + 10;

    // Draw Left-side Box
    const boxHeight = 40;
    doc.setFontSize(12);
    doc.rect(leftX, y, pageWidth / 2 - 20, boxHeight);
    doc.text('To,', leftX + 2, y + 6);
    doc.setFont(undefined, 'normal');
    doc.text(vendorId.vendorName, leftX + 2, y + 12);
    doc.text(vendorId.address, leftX + 2, y + 18, { maxWidth: pageWidth / 2 - 20 });

    // Right side details table
    doc.autoTable({
      startY: y,
      startX: rightX,
      margin: { left: rightX },
      tableWidth: pageWidth / 2 - margin - 10,
      body: [
        ['Date', new Date(createdAt).toLocaleDateString('en-CA')],
        ['PO No', purchaseOrderNumber],
        ['Department', 'Fabric'],
        ['Quotation No.', quotationNumber],
      ],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak',
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 'auto' },
      },
    });

    y += boxHeight + 20;

    // Subject
    doc.setFont(undefined, 'bold');
    doc.text('Subject:', margin, y);
    doc.setFont(undefined, 'normal');
    doc.text(
      'We are here with pleased to place the order for the following items subject to terms & conditions mentioned below',
      margin,
      y + 6,
      { maxWidth: pageWidth - 2 * margin },
    );

    y += 20;

    // Get fabric and collar items
    const fabricItems = items.filter(
      (item) => item.code.category === 'fabric' && item.code.subCategory !== 'colar',
    );
    const collarItems = items.filter(
      (item) => item.code.category === 'fabric' && item.code.subCategory === 'colar',
    );

    // Table 1: Fabric Specifications
    if (fabricItems.length > 0) {
      const uniqueFabricSpecs = getUniqueFabricSpecs(items);
      const fabricSpecRows = uniqueFabricSpecs.map((spec) => [
        spec.fabricStructure,
        spec.quality,
        spec.yarnContent,
        spec.gsm,
        spec.fabricDia,
      ]);

      doc.autoTable({
        startY: y,
        head: [['Fabric Structure', 'Quality', 'Yarn Content', 'GSM', 'Fabric Dia']],
        body: fabricSpecRows,
        theme: 'grid',
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineWidth: 0.8,
          lineColor: [0, 0, 0],
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
      });

      y = doc.lastAutoTable.finalY + 15;
    }

    // Table 2: Fabric Items Details
    if (fabricItems.length > 0) {
      const fabricRows = fabricItems.map((item, index) => [
        index + 1,
        item.code.fabricColor || '',
        item.orderQuantity,
        `${Number.parseFloat(item.code.price).toFixed(2)}`,
        `${(Number.parseFloat(item.code.price) * Number.parseFloat(item.orderQuantity)).toFixed(
          2,
        )}`,
      ]);

      const fabricTotal = fabricItems.reduce(
        (sum, item) =>
          sum + Number.parseFloat(item.code.price) * Number.parseFloat(item.orderQuantity),
        0,
      );
      const totalQuantity = fabricItems.reduce(
        (sum, item) => sum + Number.parseFloat(item.orderQuantity),
        0,
      );

      fabricRows.push(['', 'Total', totalQuantity, '', `${fabricTotal.toFixed(2)}`]);

      const usableWidth = pageWidth - margin * 2;

      doc.autoTable({
        startY: y,
        head: [['Sl No', 'Fabric Colour', 'Qty in KG', 'Rate (Rs) Per KG', 'Total']],
        body: fabricRows,
        theme: 'grid',
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineWidth: 0.8,
          lineColor: [0, 0, 0],
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

      y = doc.lastAutoTable.finalY + 15;
    }

    // Table 3: Collar Specifications (if collar items exist)
    if (collarItems.length > 0) {
      // Check if we need a new page
      if (y + 60 > pageHeight - margin - 30) {
        doc.addPage();
        drawPageBorder(doc, pageWidth, pageHeight, margin);
        y = 20;
      }

      doc.setFont(undefined, 'bold');
      doc.text('Collar & Cuff with tipping - measurement as per the given sample', margin, y);
      y += 10;

      const uniqueCollarSpecs = getUniqueCollarSpecs(items);
      const collarSpecRows = uniqueCollarSpecs.map((spec) => [
        spec.collarHeight,
        spec.collarLength,
        spec.tapeHeight,
      ]);

      doc.autoTable({
        startY: y,
        head: [['Collar Height', 'Collar Length', 'Tape Height']],
        body: collarSpecRows,
        theme: 'grid',
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineWidth: 0.8,
          lineColor: [0, 0, 0],
          halign: 'center',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          lineWidth: 0.8,
          lineColor: [0, 0, 0],
        },
      });

      y = doc.lastAutoTable.finalY + 15;
    }

    // Table 4: Collar Items Details (if collar items exist)
    if (collarItems.length > 0) {
      const collarRows = collarItems.map((item, index) => [
        index + 1,
        item.code.fabricColor || '',
        item.description || '',
        item.orderQuantity,
        (item.orderQuantity * 0.065).toFixed(3),
        `${Number.parseFloat(item.code.price).toFixed(2)}`,
        `${(Number.parseFloat(item.code.price) * Number.parseFloat(item.orderQuantity)).toFixed(
          2,
        )}`,
      ]);

      const collarTotal = collarItems.reduce(
        (sum, item) =>
          sum + Number.parseFloat(item.code.price) * Number.parseFloat(item.orderQuantity),
        0,
      );
      const totalQuantity = collarItems.reduce(
        (sum, item) => sum + Number.parseFloat(item.orderQuantity),
        0,
      );
      const totalKgs = collarItems.reduce((sum, item) => sum + item.orderQuantity * 0.065, 0);

      collarRows.push([
        '',
        '',
        '',
        totalQuantity,
        totalKgs.toFixed(3),
        '',
        `${collarTotal.toFixed(2)}`,
      ]);

      doc.autoTable({
        startY: y,
        head: [
          [
            'Sl.No',
            'Collar & Cuff Colour',
            'Collar Size in Inches',
            'Quantity In Sets (Approx)',
            'Total Kgs (0.065gms per Set Approx)',
            'Rate (Rs) per Kg',
            'Total',
          ],
        ],
        body: collarRows,
        theme: 'grid',
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineWidth: 0.8,
          lineColor: [0, 0, 0],
          halign: 'center',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          lineWidth: 0.8,
          lineColor: [0, 0, 0],
        },
      });

      y = doc.lastAutoTable.finalY + 15;
    }

    // Table 5: Summary/Grand Total
    if (y + 80 > pageHeight - margin - 30) {
      doc.addPage();
      drawPageBorder(doc, pageWidth, pageHeight, margin);
      y = 20;
    }

    const fabricTotal = fabricItems.reduce(
      (sum, item) =>
        sum + Number.parseFloat(item.code.price) * Number.parseFloat(item.orderQuantity),
      0,
    );
    const collarTotal = collarItems.reduce(
      (sum, item) =>
        sum + Number.parseFloat(item.code.price) * Number.parseFloat(item.orderQuantity),
      0,
    );
    const subtotal = fabricTotal + collarTotal;
    const gstAmount = (Number.parseFloat(gst) / 100) * subtotal;
    const finalTotal = subtotal + gstAmount;

    const summaryRows = [];
    if (fabricItems.length > 0) {
      const fabricTotalKgs = fabricItems.reduce(
        (sum, item) => sum + Number.parseFloat(item.orderQuantity),
        0,
      );
      summaryRows.push(['1', 'Fabric', fabricTotalKgs, '', `${fabricTotal.toFixed(2)}`]);
    }
    if (collarItems.length > 0) {
      const collarTotalKgs = collarItems.reduce((sum, item) => sum + item.orderQuantity * 0.065, 0);
      summaryRows.push([
        '2',
        'Collar & Cuff',
        collarTotalKgs.toFixed(3),
        '',
        `${collarTotal.toFixed(2)}`,
      ]);
    }

    summaryRows.push(['', '', '', 'Grand Total', `${subtotal.toFixed(2)}`]);
    summaryRows.push(['', '', '', `GST @ ${gst}%`, `${gstAmount.toFixed(2)}`]);
    summaryRows.push(['', '', '', 'Final Total', `${finalTotal.toFixed(2)}`]);

    doc.autoTable({
      startY: y,
      head: [['Sl No', 'Description', 'Total Kgs', 'Rate (Rs)', 'Total Amount']],
      body: summaryRows,
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.8,
        lineColor: [0, 0, 0],
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
    });

    doc.save(`Fabric_PO_${purchaseOrderNumber}.pdf`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Fabric PO</h3>
      <Button variant="contained" color="primary" onClick={generatePOPDF}>
        Download PO PDF
      </Button>
    </div>
  );
};

FabricPO.propTypes = {
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
          category: PropTypes.string,
          subCategory: PropTypes.string,
          fabricStructure: PropTypes.string,
          fabricName: PropTypes.string,
          yarnComposition: PropTypes.string,
          dia: PropTypes.string,
          gsm: PropTypes.string,
          price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          fabricColor: PropTypes.string,
          collarHeight: PropTypes.string,
          collarLength: PropTypes.string,
          tapeHeight: PropTypes.string,
        }),
        orderQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default FabricPO;
