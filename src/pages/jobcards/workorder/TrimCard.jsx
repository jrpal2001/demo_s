'use client';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchOutwardsByWorkOrderId } from '@/api/outward.api';
import PropTypes from 'prop-types';

export default function TrimsCardGenerator({ data }) {
  console.log('🚀 ~ TrimsCardGenerator ~ data:', data);
  const workOrderId = data?.workOrderRef?._id;
  console.log('🚀 ~ TrimsCardGenerator ~ workOrderId:', workOrderId);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [headerInfo, setHeaderInfo] = useState({ workOrderId: '', jobCardNo: '' });

  useEffect(() => {
    if (!workOrderId) return;
    setLoading(true);
    Promise.all([
      fetchOutwardsByWorkOrderId('trims', workOrderId),
      fetchOutwardsByWorkOrderId('accessories', workOrderId),
    ])
      .then(([trimsRes, accessoriesRes]) => {
        console.log('🚀 ~ .then ~ accessoriesRes:', accessoriesRes);
        console.log('🚀 ~ .then ~ trimsRes:', trimsRes);
        // Both responses have .data property with array of outwards
        const trimsItems = (trimsRes?.data?.[0]?.items || []).map((item) => ({
          ...item,
          _dept: 'trims',
        }));
        const accessoriesItems = (accessoriesRes?.data?.[0]?.items || []).map((item) => ({
          ...item,
          _dept: 'accessories',
        }));
        setItems([...trimsItems, ...accessoriesItems]);
        // Use header info from first available outward
        const outward = trimsRes?.data?.[0] || accessoriesRes?.data?.[0] || {};
        setHeaderInfo({
          workOrderId: outward.workOrderRef?.workOrderId || workOrderId,
          jobCardNo: outward.workOrderRef?.jobCardNo || '',
        });
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [workOrderId]);

  // --- PDF Generation Logic ---
  const generateTrimsCardPDF = () => {
    if (!items.length) {
      alert('No items available');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = 15;

    // Header
    doc.setFontSize(14);
    doc.text(`JOBCARD No: ${headerInfo.workOrderId}`, pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFontSize(12);
    doc.text('TRIMS CARD', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.text('TRIMS AND ACCESSORIES', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Items Table with signature columns
    doc.autoTable({
      startY: y,
      head: [
        [
          'ITEM CODE',
          'REQUESTED QTY',
          'ISSUED QTY',
          'Trims Incharge Sign',
          "Receiver's name and sign",
        ],
      ],
      body:
        items.length > 0
          ? items.map((item) => [
              item.code || 'N/A',
              item.requestedQuantity || 0,
              item.issuedQuantity || 0,
              '', // Trims Incharge Sign
              '', // Receiver's name and sign
            ])
          : [['No items available', '-', '-', '-', '', '']],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2, halign: 'center' },
      headStyles: { fillColor: [0, 0, 0], textColor: [239, 191, 0], fontStyle: 'bold' },
      margin: { left: margin, right: margin },
    });

    doc.save(`Trims_Card_${headerInfo.workOrderId || 'unknown'}.pdf`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Trims Card</h3>
      <Button variant="contained" color="primary" onClick={generateTrimsCardPDF}>
        {loading ? 'Loading...' : 'Download Trims Card PDF'}
      </Button>
    </div>
  );
}

TrimsCardGenerator.propTypes = {
  workOrderId: PropTypes.string.isRequired,
};
