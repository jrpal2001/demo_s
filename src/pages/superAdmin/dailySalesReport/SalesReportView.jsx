'use client';

import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useState } from 'react';

// Corrected import path for images in the public directory
// This assumes the image is placed in public/assets/images/reports/imagetop.png
import logoPath from '../../../assets/images/reports/imagetop.png';

export default function SalesExecutiveReportView({
  reportData,
  salesExecutive,
  reportType,
  selectedYear,
  selectedMonth,
  selectedQuarter,
}) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const getBase64Image = (imgSrc) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imgSrc;
      image.crossOrigin = 'anonymous'; // Set crossOrigin to avoid CORS issues [^v0_domain_knowledge]
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      image.onerror = (e) => {
        console.error('Image loading error:', e);
        reject(new Error('Image loading failed. Check image path and CORS.'));
      };
    });
  };

  const drawPageBorder = (doc, pageWidth, pageHeight, margin) => {
    doc.setDrawColor(0);
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
  };

  const generateSalesReportPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10; // Standard margin for the document

      drawPageBorder(doc, pageWidth, pageHeight, margin);

      // Add logo
      const logoBase64 = await getBase64Image(logoPath);
      doc.addImage(logoBase64, 'PNG', margin, 5, pageWidth - 2 * margin, 25);

      let y = 40;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');

      let reportTitle = 'Daily Sales Report';
      if (reportType === 'yearly') {
        reportTitle += ` for Year ${selectedYear}`;
      } else if (reportType === 'monthly') {
        const monthName = new Date(0, parseInt(selectedMonth) - 1).toLocaleString('en-US', {
          month: 'long',
        });
        reportTitle += ` for ${monthName} ${selectedYear}`;
      } else if (reportType === 'quarterly') {
        reportTitle += ` for Q${selectedQuarter} ${selectedYear}`;
      }

      doc.text(reportTitle, pageWidth / 2, y, { align: 'center' });
      y += 10;

      if (salesExecutive) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Executive ID: ${salesExecutive.employeeId}`, margin, y);
        doc.text(`Executive Name: ${salesExecutive.fullName}`, margin, y + 6);
        y += 15;
      }

      const tableColumn = [
        'Date',
        'Job Card No',
        'Customer',
        'Product',
        'Quantity',
        'Amount',
        'Delivery Date',
        'Status',
      ];

      const tableRows = reportData.map((row) => [
        row.date ? row.date.substring(0, 10) : '-',
        row.jobcardNo,
        row.customerName,
        row.product,
        row.quantity,
        row.amount,
        row.deldate ? row.deldate.substring(0, 10) : '-',
        row.status,
      ]);

      // Calculate usable width for the table
      const usableWidth = pageWidth - 2 * margin;

      doc.autoTable({
        startY: y,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        margin: { left: margin, right: margin }, // This sets the overall margin for the table
        tableWidth: 'auto', // Ensures the table takes full width between margins
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          halign: 'center',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [255, 255, 255], // White text for header
          fontStyle: 'bold',
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        columnStyles: {
          // Distribute usableWidth among columns using percentages
          0: { cellWidth: usableWidth * 0.1 }, // Date (10%)
          1: { cellWidth: usableWidth * 0.12 }, // Job Card No (12%)
          2: { cellWidth: usableWidth * 0.18 }, // Customer (18%)
          3: { cellWidth: usableWidth * 0.18 }, // Product (18%)
          4: { cellWidth: usableWidth * 0.08 }, // Quantity (8%)
          5: { cellWidth: usableWidth * 0.08 }, // Amount (8%)
          6: { cellWidth: usableWidth * 0.12 }, // Delivery Date (12%)
          7: { cellWidth: usableWidth * 0.14 }, // Status (14%)
        },
      });

      // Add total summary
      const finalY = doc.autoTable.previous.finalY;
      const totalQuantity = reportData.reduce(
        (sum, item) => sum + (parseFloat(item.quantity) || 0),
        0,
      );
      const totalAmount = reportData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`Total Quantity: ${totalQuantity.toFixed(2)}`, margin, finalY + 10);
      doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, pageWidth - margin, finalY + 10, {
        align: 'right',
      });

      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, pageHeight - margin - 5);

      doc.save(
        `Sales_Report_${salesExecutive?.employeeId || 'Summary'}_${selectedYear}${
          selectedMonth || ''
        }${selectedQuarter || ''}.pdf`,
      );
    } catch (error) {
      console.error('Error generating PDF:', error); // More detailed error logging
      alert('Failed to generate PDF report. Check console for details.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!reportData || reportData.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 2 }}>
        No sales reports found for this executive.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3, '@media print': { p: 0 } }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Daily Sales Report for Sales Executive
      </Typography>
      {salesExecutive && (
        <Box sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
          <Typography variant="h6">
            <strong>Executive ID:</strong> {salesExecutive.employeeId}
          </Typography>
          <Typography variant="h6">
            <strong>Executive Name:</strong> {salesExecutive.fullName}
          </Typography>
        </Box>
      )}
      <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
        <Table size="small" aria-label="sales report table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Job Card No</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row, index) => (
              <TableRow key={row._id || index}>
                <TableCell>{row.date ? row.date.substring(0, 10) : '-'}</TableCell>
                <TableCell>{row.jobcardNo}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.product}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.deldate ? row.deldate.substring(0, 10) : '-'}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Box mt={3} textAlign="right">
        <Button
          variant="contained"
          color="primary"
          onClick={generateSalesReportPDF}
          disabled={isGeneratingPdf || reportData.length === 0}
        >
          {isGeneratingPdf ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Generating PDF...
            </>
          ) : (
            'Download PDF Report'
          )}
        </Button>
      </Box>
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ mt: 3, display: 'block', textAlign: 'right' }}
      >
        Generated on {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  );
}