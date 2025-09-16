import { useEffect, useState, useRef } from 'react';
import { getQualityReportsDashboardSummary } from '@/api/qualityReport.api';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Stack, Avatar, IconButton, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const ScrollIndicator = ({ scrollRef }) => {
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
      handleScroll();
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollRef]);
  const visibleRatio = scroll.width / (scroll.scrollWidth || 1);
  const leftRatio = scroll.left / ((scroll.scrollWidth - scroll.width) || 1);
  return (
    <Box sx={{ position: 'relative', height: 6, mt: 0.5, width: '100%' }}>
      <Box sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 2,
        height: 2,
        bgcolor: 'grey.300',
        borderRadius: 2,
        opacity: 0.4,
      }} />
      <Box sx={{
        position: 'absolute',
        top: 2,
        left: `${leftRatio * 100}%`,
        width: `${visibleRatio * 100}%`,
        height: 2,
        bgcolor: 'primary.main',
        borderRadius: 2,
        transition: 'left 0.2s, width 0.2s',
      }} />
    </Box>
  );
};
ScrollIndicator.propTypes = {
  scrollRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

const RECENT_REPORTS_VISIBLE = 4;

const QualityDashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const theme = useTheme();
  const [recentStart, setRecentStart] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getQualityReportsDashboardSummary();
        setSummary(res);
      } catch {
        setError('Failed to load summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <Box sx={{ p: 3 }}>Loading...</Box>;
  if (error || !summary) return <Box sx={{ p: 3, color: 'red' }}>{error || 'No data'}</Box>;

  // Card 1: Status + Operational
  const statusOperationalCard = (
    <Card
      elevation={3}
      sx={{
        minWidth: 320,
        maxWidth: 400,
        flex: 1,
        borderTop: `6px solid ${theme.palette.info.main}`,
        borderRadius: 3,
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        mr: 3,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <CheckCircleIcon color="info" />
        <Typography variant="subtitle1" fontWeight={700}>Status & Operational</Typography>
      </Stack>
      <Stack direction="row" spacing={4}>
        <Stack spacing={0.5}>
          <Typography variant="body2"><b>Resolved:</b> {summary.statusCounts.resolved}</Typography>
          <Typography variant="body2"><b>Unresolved:</b> {summary.statusCounts.unresolved}</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="body2"><b>Operational:</b> {summary.operationalCounts.operational}</Typography>
          <Typography variant="body2"><b>Non-Operational:</b> {summary.operationalCounts.nonOperational}</Typography>
        </Stack>
      </Stack>
    </Card>
  );

  // Card 2: Avg Resolution + Top Job Cards
  const avgResJobCard = (
    <Card
      elevation={3}
      sx={{
        minWidth: 320,
        maxWidth: 400,
        flex: 1,
        borderTop: `6px solid ${theme.palette.warning.main}`,
        borderRadius: 3,
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        mr: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <AccessTimeIcon color="warning" />
        <Typography variant="subtitle1" fontWeight={700}>Avg Resolution & Job Cards</Typography>
      </Stack>
      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}><b>Avg Resolution:</b></Typography>
          <Typography variant="h6" fontWeight={700}>
            {summary.averageResolutionTimeDays?.toFixed(2)} <Typography component="span" variant="body2" fontWeight={400}>days</Typography>
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}><b>Job Cards with Most Issues:</b></Typography>
          {summary.byJobCardId.length === 0 ? (
            <Typography variant="body2" color="text.secondary">None</Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {summary.byJobCardId.map((j) => (
                <li key={j.jobCardId}>
                  <Typography variant="body2" fontWeight={600}>{j.jobCardNo || j.jobCardId}: <Box component="span" color={theme.palette.info.main}>{j.count}</Box></Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
      </Stack>
    </Card>
  );

  // Card 3: Oldest Unresolved
  const oldestUnresolvedCard = (
    <Card
      elevation={3}
      sx={{
        minWidth: 320,
        maxWidth: 400,
        flex: 1,
        borderTop: `6px solid ${theme.palette.error.main}`,
        borderRadius: 3,
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        mr: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <ErrorIcon color="error" />
        <Typography variant="subtitle1" fontWeight={700}>Oldest Unresolved</Typography>
      </Stack>
      <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
        {summary.oldestUnresolvedReports.length === 0 ? (
          <Typography variant="body2" color="text.secondary">None</Typography>
        ) : (
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {summary.oldestUnresolvedReports.map((r) => (
              <li key={r._id}>
                <Typography variant="body2" fontWeight={700}>{r.title} <Box component="span" color="text.secondary">({r.jobCardNo || r.jobCardId})</Box></Typography>
                <Typography variant="caption" color="text.secondary">{r.description}</Typography>
              </li>
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );

  // Card 4: Recent Reports with up/down buttons
  const recentReports = summary.recentReports || [];
  const canScrollUp = recentStart > 0;
  const canScrollDown = recentStart + RECENT_REPORTS_VISIBLE < recentReports.length;
  const visibleReports = recentReports.slice(recentStart, recentStart + RECENT_REPORTS_VISIBLE);

  const handleScrollUp = () => {
    setRecentStart((prev) => Math.max(0, prev - 1));
  };
  const handleScrollDown = () => {
    setRecentStart((prev) => Math.min(recentReports.length - RECENT_REPORTS_VISIBLE, prev + 1));
  };

  const recentReportsCard = (
    <Card
      elevation={3}
      sx={{
        minWidth: 320,
        maxWidth: 400,
        flex: 1,
        borderTop: `6px solid ${theme.palette.primary.main}`,
        borderRadius: 3,
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        mr:2
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <ListAltIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={700}>Recent Reports</Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" onClick={handleScrollUp} disabled={!canScrollUp}>
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleScrollDown} disabled={!canScrollDown}>
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Box sx={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {visibleReports.length === 0 ? (
          <Typography variant="body2" color="text.secondary">None</Typography>
        ) : (
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {visibleReports.map((r) => (
              <li key={r._id} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Avatar sx={{ bgcolor: r.resolved ? theme.palette.success.light : theme.palette.grey[300], width: 28, height: 28, mr: 1 }}>
                  <CheckCircleIcon sx={{ color: r.resolved ? theme.palette.success.main : theme.palette.grey[500], fontSize: 18 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>{r.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{r.description}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">JobCard: {r.jobCardNo || r.jobCardId} | WorkOrder: {r.workOrderId}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Created: {new Date(r.createdAt).toLocaleDateString()}</Typography>
                </Box>
              </li>
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );

  return (
    <Card elevation={3} sx={{ borderRadius: 3, height: 260, minHeight: 0, maxHeight: 260, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'sticky', top: 24, zIndex: 2, bgcolor: 'background.paper', p: 0 }}>
      <CardContent sx={{ pb: 1, pt: 2, pl: 3, pr: 0 }}>
        <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mb: 2, letterSpacing: 0.5 }}>Quality Reports</Typography>
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', gap: 2, overflowX: 'auto', scrollbarWidth: 'none', pb: 0.5 }} ref={scrollRef}>
          <style>{`.quality-scroll::-webkit-scrollbar { display: none; }`}</style>
          <Box className="quality-scroll" sx={{ display: 'flex', gap: 2 }}>
            {statusOperationalCard}
            {avgResJobCard}
            {oldestUnresolvedCard}
            {recentReportsCard}
          </Box>
        </Box>
        <ScrollIndicator scrollRef={scrollRef} />
      </CardContent>
    </Card>
  );
};

export default QualityDashboardSummary; 