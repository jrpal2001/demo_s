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

import logo from '../../../../assets/images/reports/imagetop.png';
import { useLocation } from 'react-router-dom';

const defaultSubject =
  'We are herewith glad to place the order as per your offer subject to the terms & conditions mentioned hereunder.';

const defaultTermsPage2 = [
  {
    id: 'terms-header',
    title: 'Terms & Conditions',
    lines: [],
  },
  {
    id: 'general',
    title: 'General Guidelines:',
    lines: [
      '1. Seller/Service Provider must NOT execute orders based on verbal communication by Samurai Exports Pvt Ltd (hereinafter referred to as Purchaser).',
      '2. A Purchase Order (PO) is the ONLY acceptable document for timely processing of Invoice(s).',
      '3. The Invoice value/Cumulative of Invoices should be within the designated PO value.',
      '4. Invoice(s) received without proper supporting information are liable for rejection and affect payment timeline.',
      '5. Seller/Service Provider ledger statement must be shared on quarterly basis or on request of Purchaser for reconciliation activity.',
      '6. Invoices would be taken in Accounts only after the Quality Check and Approval for Acceptance.',
    ],
  },
  {
    id: 'ethics',
    title: 'Ethics Policies:',
    lines: [
      '1. Purchaser and its group of companies and associates are committed to operating its businesses conforming to the highest moral and ethical standards. The Seller/Service Provider is required to be committed to acting professionally, fairly and with integrity in all its business dealings and relationships wherever it operates, and to implementing and enforcing effective systems to counter bribery and unethical practices. The seller hereby represents and warrants that it agrees to and shall comply with the terms on anti-bribery, anti-corruption and anti-money laundering.',
      '2. In the event the Seller/Service Provider has any ethical enquiry or concern; or if the Seller/Service Provider notices any violation of the above mentioned Code of Conduct, you may report the same to purchase@samuraiexports.in',
    ],
  },
  {
    id: 'acceptance',
    title: 'Acceptance of PO:',
    lines: [
      '1. Acceptance of this PO along with enclosed Terms and Conditions should be communicated immediately from the date of receipt of this PO. In the event of no communication received, it will be construed that, this Purchase order along with the Terms & Conditions are accepted.',
      '2. Vendor agrees to be bound by and to comply with all these terms, which include any supplements to it, and all specifications and other documents referred to in this PO. These Terms may be modified only by a written document signed by duly authorised representatives of the Purchaser and the Vendor.',
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery of goods:',
    lines: [
      'Within the 15 days from the date of PO& all charges inclusive. Goods should be delivered to our location(Delivery Address- Same as Billing Address)',
      '1. The Vendor must deliver the goods/service to the delivery address by the delivery date in accordance with the PO. Time is of the essence for delivery. Without limitation to any other rights or remedies the Company may have, the Vendor will compensate the Company if it fails to deliver all the goods in accordance with the PO (which will include without limitation any and all consequential or indirect losses, loss of profits).',
      '2. The Company may also either cancel the PO or extend the delivery dates at its sole discretion in case of a delay.',
    ],
  },
];

const defaultTermsPage3 = [
  {
    id: 'packaging',
    title: 'Packaging:',
    lines: [
      '1. All goods must be packaged in the manner specified by the Company and shipped in the manner agreed with the Company.',
      '2. If Company does not specify the manner in which the goods must be packaged, the Vendor shall pack the goods so as to ensure sea/air/rail/roadworthy packaging to avoid any damage in transit.',
    ],
  },
  {
    id: 'quality',
    title: 'Quality & Inspection:',
    lines: [
      "1. The Company reserves the right to reject goods and services which are defective, not genuine or not in accordance with the agreed specifications. Company's payment for the goods shall not constitute its acceptance of the goods.",
      "2. Goods which are rejected may be returned to the Vendor at the Vendor's sole cost and expense. Payment, if any, made for any goods rejected hereunder shall be promptly refunded by the Vendor.",
    ],
  },
  {
    id: 'payment',
    title: 'Payments Terms: Payment terms are 45 days from the date of receipt of materials.',
    lines: [],
  },
  {
    id: 'invoice',
    title: 'Invoice:',
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

const TrimsReport = () => {
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

  // Helper function to add section with proper page breaks
  const addSectionWithPageBreak = (doc, section, currentY, pageWidth, pageHeight, margin) => {
    // Skip empty sections (no title and no lines)
    if (!section.title.trim() && section.lines.length === 0) {
      return currentY;
    }

    const titleHeight = calculateTextHeight(doc, section.title, pageWidth - 2 * margin, 12);
    const minSectionHeight = titleHeight + 15; // Title + minimum space for at least one line

    // Check if section title + some content can fit on current page
    if (currentY + minSectionHeight > pageHeight - margin - 30) {
      doc.addPage();
      drawPageBorder(doc, pageWidth, pageHeight, margin);
      currentY = 20;
    }

    // Add section title
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text(section.title, margin, currentY);
    doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
    currentY += titleHeight + 6;

    // Add section lines with individual line break checking
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
      currentY += lineHeight + 4;
    });

    return currentY + 6; // Add space after section
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

    // Note: You'll need to handle the logo import in your actual implementation
    const logoImg = await getBase64Image(logo);
    doc.addImage(logoImg, 'PNG', margin, 5, pageWidth - 2 * margin, 25);

    const {
      purchaseOrderNumber,
      createdAt,
      department,
      quotationNumber,
      indentId,
      vendorId,
      gst,
      grandTotal,
    } = poData;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');

    let y = 40;
    const leftX = margin;
    const rightX = pageWidth / 2 + 10;

    // Draw Left-side Box
    const boxHeight = 40;
    const boxWidth = pageWidth / 2 - 20;

    doc.rect(leftX, y, boxWidth, boxHeight);
    doc.text('To,', leftX + 2, y + 6);

    doc.setFont(undefined, 'normal');
    doc.text(vendorId.vendorName, leftX + 2, y + 12);

    const addressLines = doc.splitTextToSize(vendorId.address, boxWidth - 4);
    doc.text(addressLines, leftX + 2, y + 18);

    doc.autoTable({
      startY: y,
      startX: rightX,
      margin: { left: rightX },
      tableWidth: pageWidth / 2 - margin - 10,
      body: [
        ['Date', createdAt],
        ['PO No', purchaseOrderNumber],
        ['Department', 'Trims & Accessories'],
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

    y += boxHeight + 10;
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Subject:', margin, y);
    doc.setFont(undefined, 'normal');

    // Calculate subject height and add proper spacing
    const subjectLines = doc.splitTextToSize(subject, pageWidth - 2 * margin);
    doc.text(subjectLines, margin, y + 6);
    y += subjectLines.length * 6 + 10;

    const tableRows = indentId.items.map((item, index) => [
      index + 1,
      item.code.bomId,
      item.quantity,
      `${Number.parseFloat(item.code.price).toFixed(2)}`,
      `${(Number.parseFloat(item.code.price) * Number.parseFloat(item.quantity)).toFixed(2)}`,
    ]);

    tableRows.push(['', '', '', '', '']);
    tableRows.push([
      '',
      '',
      '',
      `GST @ ${gst}%`,
      `${((Number.parseFloat(gst) / 100) * Number.parseFloat(grandTotal)).toFixed(2)}`,
    ]);
    tableRows.push(['', '', '', 'Grand Total', `${Number.parseFloat(grandTotal).toFixed(2)}`]);

    // Use maximum available space for table
    doc.autoTable({
      startY: y,
      head: [['Sl. No.', 'Product Id', 'Quantity', 'Rate (INR)', 'Amount (INR)']],
      body: tableRows,
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

    // Filter out empty sections and process terms dynamically
    const activeTermsPage2 = termsPage2.filter(
      (section) => section.title.trim() !== '' || section.lines.length > 0,
    );
    const activeTermsPage3 = termsPage3.filter(
      (section) => section.title.trim() !== '' || section.lines.length > 0,
    );

    // Combine all active sections
    const allActiveSections = [...activeTermsPage2, ...activeTermsPage3];

    if (allActiveSections.length > 0) {
      // Start terms on new page
      doc.addPage();
      drawPageBorder(doc, pageWidth, pageHeight, margin);
      let currentY = 20;

      // Process all sections dynamically
      allActiveSections.forEach((section) => {
        currentY = addSectionWithPageBreak(doc, section, currentY, pageWidth, pageHeight, margin);
      });

      // Ensure signature section has proper spacing
      const signatureSpaceNeeded = 120;
      if (currentY + signatureSpaceNeeded > pageHeight - margin - 20) {
        doc.addPage();
        drawPageBorder(doc, pageWidth, pageHeight, margin);
        currentY = 20;
      }

      // Add some space before signature section
      currentY = Math.max(currentY + 20, pageHeight - signatureSpaceNeeded);
    } else {
      // If no terms sections, add new page for signature
      doc.addPage();
      drawPageBorder(doc, pageWidth, pageHeight, margin);
    }

    // Signature section - positioned properly at bottom
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

    doc.save(`PO_${purchaseOrderNumber}.pdf`);
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
        section.id === sectionId ? { ...section, lines: [...section.lines, 'New line'] } : section,
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
                <Chip label={`${section.lines.length} lines`} size="small" sx={{ mr: 1 }} />
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
        {section.lines.map((line, lineIndex) => (
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
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
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
        {section.lines.length === 0 && (
          <Typography variant="body2" color="textSecondary" fontStyle="italic">
            No lines in this section
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Editable Trims & Accessories PO</Typography>
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
                {termsPage2.reduce((acc, section) => acc + section.lines.length, 0) +
                  termsPage3.reduce((acc, section) => acc + section.lines.length, 0)}
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

export default TrimsReport;
