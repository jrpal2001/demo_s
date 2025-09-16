import { useEffect, useState, useRef } from 'react';
import { getPurchaseOrdersDashboardSummary } from '@/api/purchaseorder.api';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Stack, Avatar, IconButton, useTheme, Table, TableBody, TableRow, TableCell } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TodayIcon from '@mui/icons-material/Today';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
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

const RECENT_ORDERS_VISIBLE = 4;

const PurchaseOrderDashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const theme = useTheme();
  const [recentStart, setRecentStart] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getPurchaseOrdersDashboardSummary();
        console.log("🚀 ~ fetchSummary ~ res:", res)
        setSummary(res.data);
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

  // Card 1: Status Counts
  const statusCard = (
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
        <AssignmentIcon color="info" />
        <Typography variant="subtitle1" fontWeight={700}>Status Overview</Typography>
      </Stack>
      <Stack direction="row" spacing={4}>
        <Stack spacing={0.5}>
          <Typography variant="body2"><b>Total:</b> {summary.totalPurchaseOrders}</Typography>
          <Typography variant="body2"><b>Pending:</b> {summary.statusCounts?.pending ?? 0}</Typography>
          <Typography variant="body2"><b>Approved:</b> {summary.statusCounts?.approved ?? 0}</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="body2"><b>Rejected:</b> {summary.statusCounts?.rejected ?? 0}</Typography>
          <Typography variant="body2"><b>Ordered:</b> {summary.statusCounts?.ordered ?? 0}</Typography>
          <Typography variant="body2"><b>Received:</b> {summary.statusCounts?.received ?? 0}</Typography>
        </Stack>
      </Stack>
    </Card>
  );

  // Card 2: Created Today/This Month
  const createdCard = (
    <Card
      elevation={3}
      sx={{
        minWidth: 320,
        maxWidth: 400,
        flex: 1,
        borderTop: `6px solid ${theme.palette.success.main}`,
        borderRadius: 3,
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        mr: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <TodayIcon color="success" />
        <Typography variant="subtitle1" fontWeight={700}>Created Orders</Typography>
      </Stack>
      <Stack spacing={2}>
        <Typography variant="body2"><b>Created Today:</b> {summary.createdToday}</Typography>
        <Typography variant="body2"><b>Created This Month:</b> {summary.createdThisMonth}</Typography>
      </Stack>
    </Card>
  );

  // Card 3: Top Vendors & Items
  const topVendorsItemsCard = (
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
        <LocalShippingIcon color="warning" />
        <Typography variant="subtitle1" fontWeight={700}>Top Vendors & Items</Typography>
      </Stack>
      <Stack spacing={1}>
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}><b>Top Vendors:</b></Typography>
          {(summary.topVendors ?? []).length === 0 ? (
            <Typography variant="body2" color="text.secondary">None</Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {(summary.topVendors ?? []).map((v, idx) => (
                <li key={idx}>
                  <Typography variant="body2" fontWeight={600}>{
                    typeof v.vendorName === 'string'
                      ? v.vendorName
                      : typeof v.vendorId === 'string'
                        ? v.vendorId
                        : (typeof v.vendorId === 'object' && v.vendorId !== null)
                          ? v.vendorId._id || JSON.stringify(v.vendorId)
                          : 'Unknown'
                  }: <Box component="span" color={theme.palette.warning.main}>{v.count}</Box></Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}><b>Top Items:</b></Typography>
          {(summary.topItems ?? []).length === 0 ? (
            <Typography variant="body2" color="text.secondary">None</Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {(summary.topItems ?? []).map((i, idx) => (
                <li key={idx}>
                  <Typography variant="body2" fontWeight={600}> {
                    i.bomId ||
                    (typeof i.itemCode === 'string'
                      ? i.itemCode
                      : i.itemCode?.code || i.itemCode?._id) ||
                    'Unknown'
                  }: <Box component="span" color={theme.palette.warning.main}>{i.count}</Box></Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
      </Stack>
    </Card>
  );

  // Card 4: Approval Status & Recent Orders
  const recentOrders = summary.recentPurchaseOrders || [];
  const canScrollUp = recentStart > 0;
  const canScrollDown = recentStart < recentOrders.length - 1;
  const visibleOrders = recentOrders.slice(recentStart, recentStart + RECENT_ORDERS_VISIBLE);

  const handleScrollUp = () => {
    setRecentStart((prev) => Math.max(0, prev - 1));
  };
  const handleScrollDown = () => {
    setRecentStart((prev) => Math.min(recentOrders.length - 1, prev + 1));
  };

  // Card 4: Approval Status
  const approvalStatusCard = (
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
        mr: 2
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <ThumbUpIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={700}>Approval Status</Typography>
      </Stack>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}><b>Approval Status:</b></Typography>
        <Table size="small" sx={{ width: '100%' }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: 0, fontWeight: 600, color: 'text.secondary', px: 1 }}>Super Admin</TableCell>
              <TableCell sx={{ border: 0, fontWeight: 600, color: 'text.secondary', px: 1 }}>Super Merchandiser</TableCell>
              <TableCell sx={{ border: 0, fontWeight: 600, color: 'text.secondary', px: 1 }}>Awaiting</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: 0, fontWeight: 700, px: 1 }}>
                P: {summary.approvalStatusCounts?.superAdmin?.pending ?? 0} <br/>
                A: {summary.approvalStatusCounts?.superAdmin?.approved ?? 0} <br/>
                R: {summary.approvalStatusCounts?.superAdmin?.rejected ?? 0}
              </TableCell>
              <TableCell sx={{ border: 0, fontWeight: 700, px: 1 }}>
                P: {summary.approvalStatusCounts?.superMerchandiser?.pending ?? 0} <br/>
                A: {summary.approvalStatusCounts?.superMerchandiser?.approved ?? 0} <br/>
                R: {summary.approvalStatusCounts?.superMerchandiser?.rejected ?? 0}
              </TableCell>
              <TableCell sx={{ border: 0, fontWeight: 700, px: 1 }}>
                {summary.awaitingApproval ?? 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );

  // Card 5: Recent Orders (scrollable)
  const recentOrdersCard = (
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
        mr: 2
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <AssignmentIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={700}>Recent Orders</Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" onClick={handleScrollUp} disabled={!canScrollUp}>
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleScrollDown} disabled={!canScrollDown}>
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Box sx={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {visibleOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary">None</Typography>
        ) : (
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {visibleOrders.map((o) => (
              <li key={o._id} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 28, height: 28, mr: 1 }}>
                  <AssignmentIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>{o.purchaseOrderNumber || o._id}</Typography>
                  <Typography variant="caption" color="text.secondary">Vendor: {
                    typeof o.vendorId === 'string'
                      ? o.vendorId
                      : (typeof o.vendorId === 'object' && o.vendorId !== null)
                        ? o.vendorId.vendorName || o.vendorId.vendorId || o.vendorId._id || JSON.stringify(o.vendorId)
                        : 'N/A'
                  }</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Status: {o.status}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">SuperAdmin: {o.superAdminStatus} | SuperMerch: {o.superMerchandiserStatus}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Total: ₹{o.grandTotal?.toLocaleString?.() ?? o.grandTotal}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Created: {new Date(o.createdAt).toLocaleDateString()}</Typography>
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
        <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mb: 2, letterSpacing: 0.5 }}>Purchase Orders</Typography>
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', gap: 2, overflowX: 'auto', scrollbarWidth: 'none', pb: 0.5 }} ref={scrollRef}>
          <style>{`.purchase-scroll::-webkit-scrollbar { display: none; }`}</style>
          <Box className="purchase-scroll" sx={{ display: 'flex', gap: 2 }}>
            {statusCard}
            {createdCard}
            {topVendorsItemsCard}
            {approvalStatusCard}
            {recentOrdersCard}
          </Box>
        </Box>
        <ScrollIndicator scrollRef={scrollRef} />
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderDashboardSummary; 