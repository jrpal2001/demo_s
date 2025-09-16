
'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

import { useLocation } from 'react-router-dom';
import logo from '../../../../assets/images/reports/imagetop.png';

const defaultSubject =
  'We are herewith pleased to place the order for the following items subject to terms & conditions mentioned below';

const defaultTermsPage2 = [
  {
    id: 'general',
    title: 'General Guidelines:',
    lines: [
      '1. Seller/Service Provider must NOT execute orders based on verbal communication by Samurai Exports Pvt Ltd (hereinafter referred to as Purchaser)',
      '2. Invoices would be taken in Accounts only after the Quality Check and Approval for Acceptance.',
      '3. A Purchase Order (PO) is the ONLY acceptable document for timely processing of Invoice(s)',
      '4. The Invoice value/Cumulative of Invoices should be within the designated PO value.',
      '5. Invoice(s) received without proper supporting information are liable for rejection and affect payment timeline',
      '6. Seller/Service Provider Ledger statement must be shared on quarterly basis or on request of purchase for reconciliation activity',
    ],
  },
  {
    id: 'acceptance',
    title: 'Acceptance of PO:',
    lines: [
      '1. Acceptance of this PO along with enclosed Terms and Conditions should be communicated immediately from the date of receipt of this PO. In the event of no communication received, it will be construed that this Purchase order along with the Terms & Conditions are accepted.',
      '2. Any rejections or Non-acceptance of the Fabric Trims would be returned and Transportation Cost of the same has to be paid by the supplier.',
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery of Goods:',
    lines: ['Within 10-15 days from the date of PO & Freight is Exclusive.'],
  },
];

const defaultTermsPage3 = [
  {
    id: 'packaging',
    title: 'Packaging:',
    lines: [
      '1. Packaging to be done properly with plastic cover on the fabric rolls and then packed in Gunny bags, the Vendor shall pack the goods so as to ensure sea/air/rail/roadworthy packaging to avoid any damage in transit,Any damages due to Poor Packaging would be deducted from the invoices.',
    ],
  },
  {
    id: 'quality-fabric',
    title: 'Quality & Inspection (Fabric):',
    lines: [
      '1. The Company reserves the right to reject goods/Fabrics which are defective, found with Stains, Dying Stains, Needle Holes or not in accordance with the agreed specifications.Any Defects below 25% would be accepted and the same would be deducted from the invoice. If found more than 25%, entire lot will be rejected.',
      '2. Shade Variation - Roll to Roll is not acceptable and same roll variation in the same lot is also not acceptable.',
      "3. Goods which are rejected may be returned to the Vendor at the Vendor's sole cost and expense.Payment, if any, made for any goods rejected hereunder shall be promptly refunded by the Vendor.",
    ],
  },
  {
    id: 'quality-collar',
    title: 'Quality & Inspection (Collar-Tape):',
    lines: [
      '1. Nylon Thread to be used for Opening of Collar & Tape.',
      '2. Any Damages found after opening of Collar & tape, same has to be replaced by the supplier at their cost.',
      '3. Collar & tape would be rejected if found with more of Elasticity/Flexibility or Change in size ratios after opened and with no strength.',
    ],
  },
  {
    id: 'payment',
    title: 'Payments Terms:',
    lines: ['45 days from date of Receiving of goods.'],
  },
  {
    id: 'measures',
    title: 'Measures to Carry:',
    table: {
      head: [['Colour Fastness', 'Staining on Cotton', 'Staining on Polyester']],
      body: [
        ['Washing', '4-5', '4-5'],
        ['Perspiration (Base)', '4-5', '4-5'],
        ['Perspiration (RIB and Collar)', '4-5', '4-5'],
        ['Rubbing', '4-5(Dry)', '4-5(Wet)'],
      ],
    },
  },
  {
    id: 'invoice',
    title: 'Invoice Requirements:',
    lines: [
      'The Vendor shall raise a valid tax invoice carrying all the declarations as prescribed under the law on GST and conform to the requirements of the applicable tax/GST laws as provided below:',
      '1. Name, address, GSTIN and PAN No. of the Vendor',
      '2. PO NUMBER (every invoice should carry this mandatorily to ensure timely payment of invoices)',
      '3. Name, address and GSTIN of the Company',
      '4. HSN code of goods or Accounting Code of services',
      '5. Description of goods or services',
      '6. Taxable value of supply of goods or services or both taking into account discount or abatement, if any',
      '7. Rate of tax',
    ],
  },
];

const FabricPO = () => {
  const location = useLocation();
  const poData = location.state?.poData;
  const [subject, setSubject] = useState(defaultSubject);
  const [termsPage2, setTermsPage2] = useState(defaultTermsPage2);
  const [termsPage3, setTermsPage3] = useState(defaultTermsPage3);
  const [editingSubject, setEditingSubject] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingLine, setEditingLine] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [newSectionDialog, setNewSectionDialog] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionPage, setNewSectionPage] = useState(2);

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

  // Helper function to calculate text height
  const calculateTextHeight = (doc, text, maxWidth, fontSize = 11) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    return lines.length * (fontSize * 0.35);
  };

  // Improved helper function to add section with proper page breaks and reduced spacing
  const addSectionWithPageBreak = (doc, section, currentY, pageWidth, pageHeight, margin) => {
    // Skip empty sections (no title and no lines/table)
    if (!section.title.trim() && (!section.lines || section.lines.length === 0) && !section.table) {
      return currentY;
    }

    const titleHeight = calculateTextHeight(doc, section.title, pageWidth - 2 * margin, 12);
    let estimatedSectionHeight = titleHeight + 10; // Reduced from 15

    // Estimate height for lines
    if (section.lines && section.lines.length > 0) {
      section.lines.forEach((line) => {
        estimatedSectionHeight +=
          calculateTextHeight(doc, line, pageWidth - 2 * margin - 2, 11) + 3; // Reduced spacing
      });
    }

    // Estimate height for table
    if (section.table) {
      estimatedSectionHeight += (section.table.body.length + 1) * 12; // Reduced table height estimate
    }

    // Check if section can fit on current page
    if (currentY + estimatedSectionHeight > pageHeight - margin - 30) {
      doc.addPage();
      drawPageBorder(doc, pageWidth, pageHeight, margin);
      currentY = 20;
    }

    // Add section title
    if (section.title.trim()) {
      doc.setFont(undefined, 'bold');
      doc.setFontSize(12);
      doc.text(section.title, margin, currentY);
      doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
      currentY += titleHeight + 4; // Reduced from 6
    }

    // Add section lines
    if (section.lines && section.lines.length > 0) {
      doc.setFont(undefined, 'normal');
      doc.setFontSize(11);

      section.lines.forEach((line) => {
        const lineHeight = calculateTextHeight(doc, line, pageWidth - 2 * margin - 2, 11);

        // Check if this line fits on current page
        if (currentY + lineHeight > pageHeight - margin - 30) {
          doc.addPage();
          drawPageBorder(doc, pageWidth, pageHeight, margin);
          currentY = 20;
        }

        const wrappedLines = doc.splitTextToSize(line, pageWidth - 2 * margin - 2);
        doc.text(wrappedLines, margin + 2, currentY);
        currentY += lineHeight + 2; // Reduced from 4
      });
    }

    // Add table if present
    if (section.table) {
      // Check if table fits on current page
      const tableHeight = (section.table.body.length + 1) * 12;
      if (currentY + tableHeight > pageHeight - margin - 30) {
        doc.addPage();
        drawPageBorder(doc, pageWidth, pageHeight, margin);
        currentY = 20;
      }

      doc.autoTable({
        startY: currentY,
        head: section.table.head,
        body: section.table.body,
        theme: 'grid',
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          halign: 'center',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [212, 170, 1],
          fontStyle: 'bold',
        },
      });

      currentY = doc.lastAutoTable.finalY + 4; // Reduced from 6
    }

    return currentY + 4; // Reduced spacing after section from 6 to 4
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

    // Add logo placeholder (you'll need to implement getBase64Image for your logo)
    const logoImg = await getBase64Image(logo);
    doc.addImage(logoImg, 'PNG', margin, 5, pageWidth - 2 * margin, 25);

    const { purchaseOrderNumber, createdAt, quotationNumber, indentId, vendorId, gst, grandTotal } =
      poData;

    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Purchase Order', pageWidth / 2, 40, { align: 'center' });

    let y = 50;
    const leftX = margin;
    const rightX = pageWidth / 2 + 10;

    // Header info
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('To,', leftX, y);
    doc.setFont(undefined, 'normal');
    doc.text(vendorId.vendorName, leftX, y + 6);
    const addressLines = doc.splitTextToSize(vendorId.address, pageWidth / 2 - 20);
    doc.text(addressLines, leftX, y + 12);

    // Right side details
    doc.autoTable({
      startY: y - 5,
      startX: rightX,
      margin: { left: rightX },
      tableWidth: pageWidth / 2 - margin - 10,
      body: [
        ['Date', createdAt],
        ['PO No', purchaseOrderNumber],
        ['Quotation No.', quotationNumber],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
    });

    y += 40;

    // Dear Sir
    doc.setFont(undefined, 'bold');
    doc.text('Dear Sir,', margin, y);
    y += 10;

    // Subject
    doc.setFont(undefined, 'normal');
    const subjectLines = doc.splitTextToSize(subject, pageWidth - 2 * margin);
    doc.text(subjectLines, margin, y);
    y += subjectLines.length * 6 + 10;

    // Get unique fabric and collar specifications
    const uniqueFabricSpecs = getUniqueFabricSpecs(indentId.items);
    const uniqueCollarSpecs = getUniqueCollarSpecs(indentId.items);

    // Fabric specifications table (if fabric items exist)
    if (uniqueFabricSpecs.length > 0) {
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
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [212, 170, 1],
          fontStyle: 'bold',
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      // Fabric items table
      const fabricItems = indentId.items.filter(
        (item) => item.code.category === 'fabric' && item.code.subCategory !== 'colar',
      );
      if (fabricItems.length > 0) {
        const fabricRows = fabricItems.map((item, index) => [
          index + 1,
          item.code.fabricColor || '',
          item.quantity,
          `${Number.parseFloat(item.code.price).toFixed(2)}`,
          `${(Number.parseFloat(item.code.price) * Number.parseFloat(item.quantity)).toFixed(2)}`,
        ]);

        const fabricTotal = fabricItems.reduce(
          (sum, item) =>
            sum + Number.parseFloat(item.code.price) * Number.parseFloat(item.quantity),
          0,
        );
        const totalQuantity = fabricItems.reduce(
          (sum, item) => sum + Number.parseFloat(item.quantity),
          0,
        );

        fabricRows.push(['', 'Total', totalQuantity, '', `${fabricTotal.toFixed(2)}`]);

        doc.autoTable({
          startY: y,
          head: [['Sl No', 'Fabric Colour', 'Qty in KG', 'Rate (Rs) Per KG', 'Total']],
          body: fabricRows,
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
        });

        y = doc.lastAutoTable.finalY + 15;
      }
    }

    // Collar specifications and table (if collar items exist)
    if (uniqueCollarSpecs.length > 0) {
      // Check if we need a new page
      if (y + 60 > pageHeight - margin - 30) {
        doc.addPage();
        drawPageBorder(doc, pageWidth, pageHeight, margin);
        y = 20;
      }

      doc.setFont(undefined, 'bold');
      doc.text('Collar & Cuff with tipping - measurement as per the given sample', margin, y);
      y += 10;

      // Collar specifications table
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
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [212, 170, 1],
          fontStyle: 'bold',
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      // Collar items table
      const collarItems = indentId.items.filter(
        (item) => item.code.category === 'fabric' && item.code.subCategory === 'colar',
      );
      if (collarItems.length > 0) {
        const collarRows = collarItems.map((item, index) => [
          index + 1,
          item.code.fabricColor || '',
          item.description || '',
          item.quantity,
          (item.quantity * 0.065).toFixed(3), // Total Kgs calculation
          `${Number.parseFloat(item.code.price).toFixed(2)}`,
          `${(Number.parseFloat(item.code.price) * Number.parseFloat(item.quantity)).toFixed(2)}`,
        ]);

        const collarTotal = collarItems.reduce(
          (sum, item) =>
            sum + Number.parseFloat(item.code.price) * Number.parseFloat(item.quantity),
          0,
        );
        const totalQuantity = collarItems.reduce(
          (sum, item) => sum + Number.parseFloat(item.quantity),
          0,
        );
        const totalKgs = collarItems.reduce((sum, item) => sum + item.quantity * 0.065, 0);

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
            halign: 'center',
          },
          headStyles: {
            fillColor: [0, 0, 0],
            textColor: [212, 170, 1],
            fontStyle: 'bold',
          },
        });

        y = doc.lastAutoTable.finalY + 15;
      }
    }

    // Summary table
    if (y + 80 > pageHeight - margin - 30) {
      doc.addPage();
      drawPageBorder(doc, pageWidth, pageHeight, margin);
      y = 20;
    }

    const fabricItems = indentId.items.filter(
      (item) => item.code.category === 'fabric' && item.code.subCategory !== 'colar',
    );
    const collarItems = indentId.items.filter(
      (item) => item.code.category === 'fabric' && item.code.subCategory === 'colar',
    );

    const fabricTotal = fabricItems.reduce(
      (sum, item) => sum + Number.parseFloat(item.code.price) * Number.parseFloat(item.quantity),
      0,
    );
    const collarTotal = collarItems.reduce(
      (sum, item) => sum + Number.parseFloat(item.code.price) * Number.parseFloat(item.quantity),
      0,
    );
    const subtotal = fabricTotal + collarTotal;
    const gstAmount = (Number.parseFloat(gst) / 100) * subtotal;
    const finalTotal = subtotal + gstAmount;

    const summaryRows = [];
    if (fabricItems.length > 0) {
      const fabricTotalKgs = fabricItems.reduce(
        (sum, item) => sum + Number.parseFloat(item.quantity),
        0,
      );
      summaryRows.push(['1', 'Fabric', fabricTotalKgs, '', `${fabricTotal.toFixed(2)}`]);
    }
    if (collarItems.length > 0) {
      const collarTotalKgs = collarItems.reduce((sum, item) => sum + item.quantity * 0.065, 0);
      summaryRows.push([
        '2',
        'Collar & Cuff',
        collarTotalKgs.toFixed(3),
        '',
        `${collarTotal.toFixed(2)}`,
      ]);
    }

    summaryRows.push(['', '', '', 'Grand Total', `${subtotal.toFixed(2)}`]);
    summaryRows.push(['', '', '', `IGST @ ${gst}%`, `${gstAmount.toFixed(2)}`]);
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
        halign: 'center',
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [212, 170, 1],
        fontStyle: 'bold',
      },
    });

    y = doc.lastAutoTable.finalY + 15; // Reduced spacing

    // Terms & Conditions with improved dynamic processing
    const activeTermsPage2 = termsPage2.filter(
      (section) =>
        section.title.trim() !== '' || (section.lines && section.lines.length > 0) || section.table,
    );
    const activeTermsPage3 = termsPage3.filter(
      (section) =>
        section.title.trim() !== '' || (section.lines && section.lines.length > 0) || section.table,
    );

    const allActiveSections = [...activeTermsPage2, ...activeTermsPage3];

    if (allActiveSections.length > 0) {
      // Check if we need a new page for terms
      if (y + 30 > pageHeight - margin - 30) {
        doc.addPage();
        drawPageBorder(doc, pageWidth, pageHeight, margin);
        y = 20;
      }

      doc.setFont(undefined, 'bold');
      doc.text('Terms & Conditions', margin, y);
      y += 10; // Reduced spacing

      // Process all sections dynamically with improved spacing
      allActiveSections.forEach((section) => {
        y = addSectionWithPageBreak(doc, section, y, pageWidth, pageHeight, margin);
      });

      // Ensure signature section has proper spacing
      const signatureSpaceNeeded = 100; // Reduced from 120
      if (y + signatureSpaceNeeded > pageHeight - margin - 20) {
        doc.addPage();
        drawPageBorder(doc, pageWidth, pageHeight, margin);
        y = 20;
      }

      y = Math.max(y + 15, pageHeight - signatureSpaceNeeded); // Reduced spacing
    } else {
      // If no terms sections, add new page for signature
      doc.addPage();
      drawPageBorder(doc, pageWidth, pageHeight, margin);
    }

    // Signature section
    doc.setFontSize(11);
    let sigY = pageHeight - 80;
    doc.text('PO Created By', margin, sigY);
    doc.text('PO Verified By', pageWidth - margin - 50, sigY);
    sigY += 22;
    doc.text('Signature', margin, sigY);
    doc.text('Signature', pageWidth - margin - 50, sigY);

    doc.line(margin, sigY + 10, pageWidth - margin, sigY + 10);

    sigY += 25;
    doc.text('Accepted with terms and conditions', margin, sigY);
    doc.text('For, Samurai Exports Pvt Ltd.', pageWidth - margin - 50, sigY);
    sigY += 26;
    doc.text('Vendor Signature', margin, sigY);
    doc.text('Authorised Signatory', pageWidth - margin - 50, sigY);

    doc.save(`Fabric_PO_${purchaseOrderNumber}.pdf`);
  };

  const addSection = () => {
    if (newSectionTitle.trim()) {
      const newSection = {
        id: Date.now().toString(),
        title: newSectionTitle,
        lines: [],
      };

      if (newSectionPage === 2) {
        setTermsPage2([...termsPage2, newSection]);
      } else {
        setTermsPage3([...termsPage3, newSection]);
      }

      setNewSectionTitle('');
      setNewSectionDialog(false);
    }
  };

  const removeSection = (sectionId, page) => {
    if (page === 2) {
      setTermsPage2(termsPage2.filter((section) => section.id !== sectionId));
    } else {
      setTermsPage3(termsPage3.filter((section) => section.id !== sectionId));
    }
  };

  const addLine = (sectionId, page) => {
    const updateSections = page === 2 ? setTermsPage2 : setTermsPage3;
    const sections = page === 2 ? termsPage2 : termsPage3;

    updateSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lines: section.lines ? [...section.lines, 'New line'] : ['New line'],
            }
          : section,
      ),
    );
  };

  const removeLine = (sectionId, lineIndex, page) => {
    const updateSections = page === 2 ? setTermsPage2 : setTermsPage3;
    const sections = page === 2 ? termsPage2 : termsPage3;

    updateSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, lines: section.lines.filter((_, index) => index !== lineIndex) }
          : section,
      ),
    );
  };

  const startEditingSection = (sectionId, currentTitle, page) => {
    setEditingSection({ id: sectionId, page });
    setTempValue(currentTitle);
  };

  const startEditingLine = (sectionId, lineIndex, currentLine, page) => {
    setEditingLine({ sectionId, lineIndex, page });
    setTempValue(currentLine);
  };

  const saveEdit = () => {
    if (editingSubject) {
      setSubject(tempValue);
      setEditingSubject(false);
    } else if (editingSection) {
      const updateSections = editingSection.page === 2 ? setTermsPage2 : setTermsPage3;
      const sections = editingSection.page === 2 ? termsPage2 : termsPage3;

      updateSections(
        sections.map((section) =>
          section.id === editingSection.id ? { ...section, title: tempValue } : section,
        ),
      );
      setEditingSection(null);
    } else if (editingLine) {
      const updateSections = editingLine.page === 2 ? setTermsPage2 : setTermsPage3;
      const sections = editingLine.page === 2 ? termsPage2 : termsPage3;

      updateSections(
        sections.map((section) =>
          section.id === editingLine.sectionId
            ? {
                ...section,
                lines: section.lines.map((line, index) =>
                  index === editingLine.lineIndex ? tempValue : line,
                ),
              }
            : section,
        ),
      );
      setEditingLine(null);
    }
    setTempValue('');
  };

  const cancelEdit = () => {
    setEditingSubject(false);
    setEditingSection(null);
    setEditingLine(null);
    setTempValue('');
  };

  const renderSection = (section, page) => (
    <Card key={section.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
      <CardHeader
        title={
          editingSection?.id === section.id ? (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                fullWidth
                size="small"
              />
              <IconButton onClick={saveEdit} color="primary">
                <SaveIcon />
              </IconButton>
              <IconButton onClick={cancelEdit}>
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{section.title}</Typography>
              <Box>
                <Chip
                  label={`${section.lines ? section.lines.length : 0} lines${
                    section.table ? ' + table' : ''
                  }`}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton
                  size="small"
                  onClick={() => startEditingSection(section.id, section.title, page)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => addLine(section.id, page)} color="primary">
                  <AddIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => removeSection(section.id, page)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          )
        }
      />
      <CardContent>
        {section.lines &&
          section.lines.map((line, lineIndex) => (
            <Box key={lineIndex} sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {editingLine?.sectionId === section.id && editingLine?.lineIndex === lineIndex ? (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <IconButton size="small" onClick={saveEdit} color="primary">
                      <SaveIcon />
                    </IconButton>
                    <IconButton size="small" onClick={cancelEdit}>
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                    <strong>{lineIndex + 1}.</strong> {line}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => startEditingLine(section.id, lineIndex, line, page)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removeLine(section.id, lineIndex, page)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          ))}

        {section.table && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Table Data:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Headers: {section.table.head[0].join(', ')}
            </Typography>
            <Typography variant="body2">Rows: {section.table.body.length}</Typography>
            <Typography variant="caption" color="textSecondary">
              Note: Table editing not yet implemented
            </Typography>
          </Box>
        )}

        {(!section.lines || section.lines.length === 0) && !section.table && (
          <Typography variant="body2" color="textSecondary" fontStyle="italic">
            No content in this section
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Editable Fabric Purchase Order</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={generatePOPDF}
          disabled={!poData}
        >
          Generate PDF
        </Button>
      </Box>

      {/* Subject Section */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Subject"
          action={
            <IconButton
              onClick={() => {
                setEditingSubject(true);
                setTempValue(subject);
              }}
            >
              <EditIcon />
            </IconButton>
          }
        />
        <CardContent>
          {editingSubject ? (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <IconButton onClick={saveEdit} color="primary">
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={cancelEdit}>
                  <CancelIcon />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1">{subject}</Typography>
          )}
        </CardContent>
      </Card>

      {/* Terms & Conditions Page 2 */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Terms & Conditions - Page 2"
          action={
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                setNewSectionPage(2);
                setNewSectionDialog(true);
              }}
            >
              Add Section
            </Button>
          }
        />
        <CardContent>{termsPage2.map((section) => renderSection(section, 2))}</CardContent>
      </Card>

      {/* Terms & Conditions Page 3 */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Terms & Conditions - Page 3"
          action={
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                setNewSectionPage(3);
                setNewSectionDialog(true);
              }}
            >
              Add Section
            </Button>
          }
        />
        <CardContent>{termsPage3.map((section) => renderSection(section, 3))}</CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader title="Summary" />
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Box>
              <Typography variant="h4">{termsPage2.length + termsPage3.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                Total Sections
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4">
                {termsPage2?.reduce((acc, section) => acc + (section?.lines?.length || 0), 0) +
                  termsPage3?.reduce((acc, section) => acc + (section?.lines?.length || 0), 0)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Lines
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4">{subject.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                Subject Characters
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Add Section Dialog */}
      <Dialog open={newSectionDialog} onClose={() => setNewSectionDialog(false)}>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Title"
            fullWidth
            variant="outlined"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Will be added to Page {newSectionPage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewSectionDialog(false)}>Cancel</Button>
          <Button onClick={addSection} variant="contained">
            Add Section
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FabricPO;
