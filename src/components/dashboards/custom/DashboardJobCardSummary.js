import { useEffect, useState } from "react";
import { getJobCardsDashboardSummary } from "@/api/jobcard.api";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const AccordionSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        marginBottom: 16,
        background: 'rgba(115,115,115,0.08)', // #737373 with transparency
        color: '#232323',      // Dark text from logo
        boxShadow: 'none',
        overflow: 'hidden',
        borderLeft: '4px solid #B9971B', // Gold accent
        borderRadius: 0,
        border: 'none',
      }}
    >
      <div
        style={{
          cursor: 'pointer',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 700,
          fontSize: 16,
          color: '#232323',
          background: 'none',
          borderBottom: open ? '1px solid #D1D1D1' : 'none',
          transition: 'background 0.2s',
          userSelect: 'none',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#B9971B' }}>{open ? '-' : '+'}</span>
      </div>
      {open && <div style={{ padding: '16px 20px', background: 'none' }}>{children}</div>}
    </div>
  );
};
AccordionSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  defaultOpen: PropTypes.bool
};

const DashboardJobCardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getJobCardsDashboardSummary();
        setSummary(res.data);
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!summary) return <div style={{ padding: 24, color: 'red' }}>Failed to load summary.</div>;

  return (
    <div style={{
      padding: 16,
      background: theme.palette.primary.light,
      boxShadow: '0 2px 8px rgba(44,82,130,0.08)',
      maxWidth: 1200,
      margin: '0 auto',
      borderRadius: 0,
    }}>
      <div style={styles.heading}>Job Cards</div>
      <div style={{
        display: 'flex',
        marginBottom: 10,
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: 'rgba(115,115,115,0.05)',
        borderRadius: 0,
        boxShadow: 'none',
        padding: 0
      }}>
        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 0',
          borderRight: '1px solid #E0E0E0',
          borderRadius: 0,
          background: 'rgba(115,115,115,0.08)',
          boxShadow: 'none'
        }}>
          <BreakdownCard
            data={{
              Total: summary.totalJobCards,
              'This Month': summary.jobCardsCreatedThisMonth,
              Today: summary.jobCardsCreatedToday
            }}
            accentColor={theme.palette.primary.main}
            bold
          />
        </div>
        <div style={{
          flex: 0.8,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 0',
          borderRight: '1px solid #E0E0E0',
          borderRadius: 0,
          background: 'rgba(115,115,115,0.08)',
          boxShadow: 'none'
        }}>
          <BreakdownCard
            data={summary.statusCounts}
            accentColor={theme.palette.primary.main}
            bold
          />
        </div>
        <div style={{
          flex: 1.2,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 0',
          borderRadius: 0,
          background: 'rgba(115,115,115,0.08)',
          boxShadow: 'none'
        }}>
          <BreakdownCard
            data={summary.typeCounts}
            accentColor={theme.palette.primary.main}
            bold
          />
        </div>
      </div>

      {/* All other accordions closed by default, no extra headings */}
      <AccordionSection title="Top Products">
        <Table
          columns={["Product", "Count"]}
          rows={summary.topProducts.map(tp => [tp.product, tp.count])}
        />
      </AccordionSection>

      <AccordionSection title="Due Soon (Next 7 Days)">
        <Table
          columns={["Job Card No", "Customer", "Product", "Qty", "Status", "Type", "Delivery"]}
          rows={summary.dueSoon.map(jc => [
            jc.jobCardNo,
            jc.customerName,
            jc.product,
            jc.total ?? '-',
            jc.status,
            jc.type,
            jc.deliveryDate ? new Date(jc.deliveryDate).toLocaleDateString() : "-"
          ])}
        />
      </AccordionSection>

      <AccordionSection title="Recent Job Cards">
        <Table
          columns={["Job Card No", "Customer", "Product", "Status", "Type", "Created", "Delivery"]}
          rows={summary.recentJobCards.map(jc => [
            jc.jobCardNo,
            jc.customerName,
            jc.product,
            jc.status,
            jc.type,
            new Date(jc.createdAt).toLocaleDateString(),
            jc.deliveryDate ? new Date(jc.deliveryDate).toLocaleDateString() : "-"
          ])}
        />
      </AccordionSection>
    </div>
  );
};

// Redefine BreakdownCard to use only one accent color for numbers, and a muted color for all labels
const BreakdownCard = ({ data, accentColor, bold }) => (
  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-end', padding: 0 }}>
    {Object.entries(data).map(([key, value]) => (
      <div key={key} style={{ textAlign: 'center', minWidth: 48 }}>
        <div style={{
          fontSize: 20,
          fontWeight: bold ? 900 : 800,
          color: bold ? '#1A202C' : accentColor,
          letterSpacing: 0.5,
          marginBottom: 2,
          fontFamily: 'inherit',
        }}>{value}</div>
        <div style={{ fontSize: 12, color: '#888', fontWeight: 500, fontFamily: 'inherit' }}>{key.replace(/_/g, ' ')}</div>
      </div>
    ))}
  </div>
);
BreakdownCard.propTypes = {
  data: PropTypes.object.isRequired,
  accentColor: PropTypes.string.isRequired,
  bold: PropTypes.bool
};

const Table = ({ columns, rows }) => (
  <table style={{
    width: '100%',
    borderCollapse: 'collapse',
    background: 'rgba(115,115,115,0.08)'
  }}>
    <thead>
      <tr>
        {columns.map(col => (
          <th key={col} style={{
            background: 'rgba(115,115,115,0.08)',
            padding: '8px 12px',
            fontWeight: 700,
            fontSize: 14,
            color: '#232323',
            borderBottom: '2px solid #B9971B'
          }}>{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.length === 0 ? (
        <tr>
          <td colSpan={columns.length} style={{ padding: '16px 12px', textAlign: 'center', color: '#888', background: 'rgba(115,115,115,0.08)' }}>No data</td>
        </tr>
      ) : (
        rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', fontSize: 14, borderBottom: '1px solid #E0E0E0', background: 'rgba(115,115,115,0.08)', color: '#232323' }}>{cell}</td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
);
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.array).isRequired
};

const styles = {
  container: {
    padding: 16,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(44,82,130,0.08)",
    maxWidth: 1200,
    margin: "0 auto"
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2C5282',
    marginBottom: 12,
    letterSpacing: 0.5,
    paddingLeft: 2
  },
  topRow: {
    display: "flex",
    marginBottom: 10,
    alignItems: 'stretch',
    flexWrap: 'nowrap',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden'
  },
  breakdownCardTop: {
    flex: 1,
    minWidth: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    padding: 0,
    background: 'none',
    border: 'none',
    boxShadow: 'none'
  },
  kpiGroupRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%'
  },
  kpi: {
    background: "#F7FAFC",
    borderRadius: 8,
    border: "2px solid",
    padding: '6px 10px',
    textAlign: "center",
    marginBottom: 0,
    minWidth: 90
  },
  breakdownCard: {
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    borderRadius: 0,
    padding: 0,
    minHeight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#FAFAFA"
  },
  th: {
    background: "#E2E8F0",
    padding: "8px 12px",
    fontWeight: 700,
    fontSize: 14,
    color: "#2C5282",
    borderBottom: "2px solid #CBD5E1"
  },
  td: {
    padding: "8px 12px",
    fontSize: 14,
    borderBottom: "1px solid #E2E8F0"
  },
  tdEmpty: {
    padding: "16px 12px",
    textAlign: "center",
    color: "#888"
  },
  accordionSection: {
    marginBottom: 12,
    borderRadius: 8,
    border: '1px solid #E2E8F0',
    background: '#F9FAFB',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(44,82,130,0.04)'
  },
  accordionHeader: {
    cursor: 'pointer',
    padding: '10px 16px',
    fontWeight: 600,
    fontSize: 15,
    background: '#E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #CBD5E1',
    userSelect: 'none'
  },
  accordionContent: {
    padding: '12px 16px 6px 16px',
    background: '#F9FAFB'
  }
};

export default DashboardJobCardSummary;

