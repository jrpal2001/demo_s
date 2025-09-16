import { useEffect, useState } from 'react';
import { getLastNotifications } from '@/api/notifications.api';
import { Box, Typography, Paper, Pagination, CircularProgress, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

function formatTime(isoString) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

const PAGE_SIZE = 12;

const AllNotifications = () => {
  const userId = useSelector((state) => state.auth._id);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await getLastNotifications({ userId, page: pageNum, limit: PAGE_SIZE });
      setNotifications(data.notifications || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setPage(data.pagination?.page || pageNum);
    } catch {
      setNotifications([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
    // eslint-disable-next-line
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box maxWidth="1000px" mx="auto" mt={4}>
      <Typography variant="h4" mb={3} align="center">
        All Notifications
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Typography align="center">No notifications found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {notifications.map((notification) => (
            <Grid item xs={12} sm={6} md={4} key={notification.id || notification._id}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {notification.subtitle || notification.message}
                  </Typography>
                  {notification.time && (
                    <Typography variant="caption" color="textSecondary">
                      {formatTime(notification.time)}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </Box>
    </Box>
  );
};

export default AllNotifications;
