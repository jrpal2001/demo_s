import { useEffect, useState, useRef } from 'react';
import { getQuotationDashboardSummary } from '@/api/quotation.api';
import { getLeadDashboardSummary } from '@/api/lead.api';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Stack, useTheme, Table, TableBody, TableRow, TableCell } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CategoryIcon from '@mui/icons-material/Category';

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
        bgcolor: 'secondary.main',
        borderRadius: 2,
        transition: 'left 0.2s, width 0.2s',
      }} />
    </Box>
  );
};
ScrollIndicator.propTypes = {
  scrollRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

const QuotationLeadDashboard = () => {
  const [quotation, setQuotation] = useState(null);
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quotationRes, leadRes] = await Promise.all([
          getQuotationDashboardSummary(),
          getLeadDashboardSummary(),
        ]);
        setQuotation(quotationRes.data);
        setLead(leadRes.data);
      } catch {
        setError('Failed to load dashboard summary');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box sx={{ p: 3 }}>Loading...</Box>;
  if (error || !quotation || !lead) return <Box sx={{ p: 3, color: 'red' }}>{error || 'No data'}</Box>;

  // Quotation cards (grouped)
  const quotationCards = [
    {
      title: 'Quotation Overview',
      color: theme.palette.success.dark,
      icon: <DescriptionIcon sx={{ color: theme.palette.success.dark }} />,
      content: (
        <Stack spacing={1}>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="body2"><b>Total:</b> {quotation.totalQuotations}</Typography>
            <Typography variant="body2"><b>Today:</b> {quotation.todayQuotations}</Typography>
            <Typography variant="body2"><b>This Month:</b> {quotation.monthQuotations}</Typography>
          </Stack>
          {quotation.quotationsByQuarter && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>By Year Quarters:</Typography>
              <Table size="small" sx={{ width: '100%' }}>
                <TableBody>
                  <TableRow>
                    {Object.entries(quotation.quotationsByQuarter).map(([quarter]) => (
                      <TableCell key={quarter} align="center" sx={{ border: 0, fontWeight: 600, color: 'text.secondary', px: 1 }}>
                        {quarter}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {Object.entries(quotation.quotationsByQuarter).map(([quarter, count]) => (
                      <TableCell key={quarter} align="center" sx={{ border: 0, fontWeight: 700, px: 1, color: theme.palette.success.dark }}>
                        {count}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}
        </Stack>
      ),
    },
  ];

  // Lead cards (grouped)
  const leadCards = [
    {
      title: 'Lead Overview',
      color: theme.palette.warning.dark,
      icon: <LeaderboardIcon color="secondary" />,
      content: (
        <Stack spacing={1}>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="body2"><b>Total:</b> {lead.totalLeads}</Typography>
            <Typography variant="body2"><b>Today:</b> {lead.todayLeads}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="body2"><b>This Month:</b> {lead.monthLeads}</Typography>
            <Typography variant="body2"><b>This Week:</b> {lead.weekLeads}</Typography>
          </Stack>
          {lead.leadsByQuarter && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>By Year Quarters:</Typography>
              <Table size="small" sx={{ width: '100%' }}>
                <TableBody>
                  <TableRow>
                    {Object.entries(lead.leadsByQuarter).map(([quarter]) => (
                      <TableCell key={quarter} align="center" sx={{ border: 0, fontWeight: 600, color: 'text.secondary', px: 1 }}>
                        {quarter}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {Object.entries(lead.leadsByQuarter).map(([quarter, count]) => (
                      <TableCell key={quarter} align="center" sx={{ border: 0, fontWeight: 700, px: 1 }}>
                        {count}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}
        </Stack>
      ),
    },
    {
      title: 'Lead Breakdown',
      color: theme.palette.info.dark,
      icon: <CategoryIcon sx={{ color: theme.palette.info.dark }} />,
      content: (
        <Stack spacing={1}>
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>By Source:</Typography>
            <Box sx={{ maxHeight: 32, overflowY: 'auto' }}>
              {Object.keys(lead.leadsBySource || {}).length === 0 ? (
                <Typography variant="body2" color="text.secondary">None</Typography>
              ) : (
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                  {Object.entries(lead.leadsBySource || {}).map(([source, count]) => (
                    <li key={source}>
                      <Typography variant="body2" fontWeight={600}>{source}: <Box component="span" color={theme.palette.info.dark}>{count}</Box></Typography>
                    </li>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>By Customer Type:</Typography>
            <Box sx={{ maxHeight: 32, overflowY: 'auto' }}>
              {Object.keys(lead.leadsByCustomerType || {}).length === 0 ? (
                <Typography variant="body2" color="text.secondary">None</Typography>
              ) : (
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                  {Object.entries(lead.leadsByCustomerType || {}).map(([type, count]) => (
                    <li key={type}>
                      <Typography variant="body2" fontWeight={600}>{type}: <Box component="span" color={theme.palette.info.dark}>{count}</Box></Typography>
                    </li>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      ),
    },
  ];

  return (
    <Card elevation={3} sx={{ borderRadius: 3, height: 260, minHeight: 0, maxHeight: 260, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'sticky', top: 24, zIndex: 2, bgcolor: 'background.paper', p: 0 }}>
      <CardContent sx={{ pb: 1, pt: 2, pl: 3, pr: 0 }}>
        <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mb: 2, letterSpacing: 0.5 }}>Quotation & Lead</Typography>
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', gap: 2, overflowX: 'auto', scrollbarWidth: 'none', pb: 0.5 }} ref={scrollRef}>
          <style>{`.quotation-lead-scroll::-webkit-scrollbar { display: none; }`}</style>
          <Box className="quotation-lead-scroll" sx={{ display: 'flex', gap: 2 }}>
            {[...quotationCards, ...leadCards].map((card) => (
              <Card
                key={card.title}
                elevation={0}
                sx={{
                  minWidth: 260,
                  maxWidth: 260,
                  minHeight: 120,
                  mr: 2,
                  borderTop: `6px solid ${card.color}`,
                  borderRadius: 2,
                  boxShadow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  {card.icon}
                  <Typography variant="subtitle1" fontWeight={700}>{card.title}</Typography>
                </Stack>
                {card.content}
              </Card>
            ))}
          </Box>
        </Box>
        <ScrollIndicator scrollRef={scrollRef} />
      </CardContent>
    </Card>
  );
};

export default QuotationLeadDashboard; 