import { useEffect, useState } from 'react';
import { getWorkOrdersDashboardSummary } from '@/api/workorder.api';
import PropTypes from 'prop-types';

const overlayBg = 'rgba(115,115,115,0.08)';
const mainBg = '#fff'; // White card for modern look

const Section = ({ title, children, row = false, scrollX = false }) => (
  <div
    style={{
      marginBottom: 8,
      background: overlayBg,
      padding: '14px 18px',
      borderLeft: '4px solid #B9971B',
      borderRadius: 0,
      color: '#232323',
      fontWeight: 600,
      boxShadow: 'none',
      display: row ? 'flex' : 'block',
      gap: row ? 16 : undefined,
      alignItems: row ? 'center' : undefined,
      flexWrap: row ? 'wrap' : undefined,
      minHeight: scrollX ? 160 : undefined, // Add minimum height for scrollable sections
    }}
  >
    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: row ? 0 : 12, color: '#B9971B', minWidth: 120 }}>{title}</div>
    {children}
  </div>
);

const ScrollIndicator = ({ scrollRef }) => {
  // itemWidth: width of each card, gap: gap between cards
  // containerPadding: horizontal padding of the scroll container
  const [scroll, setScroll] = useState({ left: 0, width: 0, scrollWidth: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScroll({
          left: scrollRef.current.scrollLeft,
          width: scrollRef.current.clientWidth,
          scrollWidth: scrollRef.current.scrollWidth,
        });
      }
    };
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
      // Initial
      handleScroll();
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollRef]);

  // Calculate indicator width and position
  const visibleRatio = scroll.width / (scroll.scrollWidth || 1);
  const leftRatio = scroll.left / ((scroll.scrollWidth - scroll.width) || 1);
  return (
    <div style={{ position: 'relative', height: 6, marginTop: 2, width: '100%' }}>
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 2,
        height: 2,
        background: '#e0e0e0',
        borderRadius: 2,
        opacity: 0.4,
      }} />
      <div style={{
        position: 'absolute',
        top: 2,
        left: `${leftRatio * 100}%`,
        width: `${visibleRatio * 100}%`,
        height: 2,
        background: '#B9971B',
        borderRadius: 2,
        transition: 'left 0.2s, width 0.2s',
      }} />
    </div>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  row: PropTypes.bool,
  scrollX: PropTypes.bool,
};

ScrollIndicator.propTypes = {
  scrollRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

const WorkOrderDashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const statusScrollRef = useState(() => ({ current: null }))[0];
  const stageScrollRef = useState(() => ({ current: null }))[0];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getWorkOrdersDashboardSummary();
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
    <div
      style={{
        background: mainBg,
        border: '1px solid #E0E0E0',
        padding: 12,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(44,82,130,0.08)',
        height: '340px',
        minHeight: 0,
        maxHeight: '340px',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        position: 'sticky',
        top: 24,
        zIndex: 2,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: '#232323',
          marginBottom: 12,
          letterSpacing: 0.5,
        }}
      >
        Work Orders
      </div>
      <Section title="Total Work Orders" row>
        <span style={{ fontSize: 22, fontWeight: 900 }}>{summary.totalWorkOrders}</span>
      </Section>
      <Section title="Total Qty (Open Orders)" row>
        <span style={{ fontSize: 22, fontWeight: 900 }}>{summary.totalQuantityToBeProducedExceptCompleted}</span>
      </Section>
      <Section title="Status Breakdown">
        <div style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden', padding: 0 }}>
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <div
              style={{
                overflowX: 'auto',
                width: '100%',
                boxSizing: 'border-box',
                scrollbarWidth: 'none', // Firefox
                paddingBottom: 4,
              }}
              ref={statusScrollRef}
            >
              {/* Hide scrollbar for Webkit browsers */}
              <style>{`
                .wo-status-scroll::-webkit-scrollbar { display: none; }
              `}</style>
              <div className="wo-status-scroll" style={{ display: 'flex', gap: 16 }}>
                {Object.entries(summary.statusCounts).map(([status, count], idx, arr) => (
                  <div
                    key={status}
                    style={{
                      textAlign: 'center',
                      minWidth: 80,
                      flex: '0 0 80px',
                      scrollSnapAlign: 'start',
                      background: '#fff',
                      borderRadius: 0,
                      border: '1px solid #E0E0E0',
                      boxShadow: '0 1px 2px rgba(44,82,130,0.04)',
                      marginRight: idx === arr.length - 1 ? 0 : 8,
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#1A202C' }}>{count}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{status.replace(/_/g, ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <ScrollIndicator scrollRef={statusScrollRef} />
            </div>
          </div>
        </div>
      </Section>
      <Section title="Created" row>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{summary.workOrdersCreatedToday}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Today</div>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{summary.workOrdersCreatedThisMonth}</div>
          <div style={{ fontSize: 12, color: '#888' }}>This Month</div>
        </div>
      </Section>
      <Section title="Due Soon (Next 7 Days)">
        {summary.dueSoon.length === 0 ? (
          <div style={{ color: '#888' }}>None</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {summary.dueSoon.map((wo) => (
              <li key={wo.workOrderId} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{wo.workOrderId}</span>
                {' '}| Qty: <span style={{ fontWeight: 600 }}>{wo.quantityToBeProduced ?? '-'}</span>
                {' '}| Due: {wo.expectedCompletionDate
                  ? new Date(wo.expectedCompletionDate).toLocaleDateString()
                  : '-'}
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section title="Current Stage Counts" row={Object.keys(summary.currentStageCounts).length <= 3} scrollX={Object.keys(summary.currentStageCounts).length > 3}>
        <div style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden', padding: 0 }}>
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <div
              style={{
                overflowX: 'auto',
                width: '100%',
                boxSizing: 'border-box',
                scrollbarWidth: 'none', // Firefox
                paddingBottom: 4,
                height: 80, // Fixed height
              }}
              ref={stageScrollRef}
            >
              {/* Hide scrollbar for Webkit browsers */}
              <style>{`
                .wo-stage-scroll::-webkit-scrollbar { display: none; }
              `}</style>
              <div className="wo-stage-scroll" style={{ display: 'flex', gap: 16 }}>
                {Object.entries(summary.currentStageCounts).map(([stage, count], idx, arr) => (
                  <div
                    key={stage}
                    style={{
                      textAlign: 'center',
                      minWidth: 60,
                      flex: '0 0 60px',
                      scrollSnapAlign: 'start',
                      background: '#fff',
                      borderRadius: 0,
                      border: '1px solid #E0E0E0',
                      boxShadow: '0 1px 2px rgba(44,82,130,0.04)',
                      marginRight: idx === arr.length - 1 ? 0 : 8,
                      height: 100, // Increased height for better visibility
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{count}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{stage}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <ScrollIndicator scrollRef={stageScrollRef} />
            </div>
          </div>
        </div>
      </Section>
      <Section title="Unclosed Past Due">
        {summary.unclosedPastExpectedCompletion.length === 0 ? (
          <div style={{ color: '#888' }}>None</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {summary.unclosedPastExpectedCompletion.map((wo) => (
              <li key={wo.workOrderId} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{wo.workOrderId}</span> &mdash; {wo.status} (Due:{' '}
                {wo.expectedCompletionDate
                  ? new Date(wo.expectedCompletionDate).toLocaleDateString()
                  : '-'}
                )
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section title="Unissued" row>
        <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{summary.unissuedFabric}</div>
            <div style={{ fontSize: 12, color: '#888' }}>Fabric</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{summary.unissuedTrims}</div>
            <div style={{ fontSize: 12, color: '#888' }}>Trims</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{summary.unissuedAccessories}</div>
            <div style={{ fontSize: 12, color: '#888' }}>Accessories</div>
          </div>
        </div>
      </Section>
      <Section title="Closed This Month" row>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{summary.workOrdersClosedThisMonth}</span>
      </Section>
    </div>
  );
};

export default WorkOrderDashboardSummary;
