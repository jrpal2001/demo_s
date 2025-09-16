import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import Scrollbar from '@/components/custom-scroll/Scrollbar';

import { IconBellRinging } from '@tabler/icons';
import { Stack } from '@mui/system';
import useSocket from '@/hooks/useSocket'; // Adjust path as needed

import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { getLastNotifications } from '@/api/notifications.api';
import { toast } from 'react-toastify';
// Helper to format ISO date string
function formatTime(isoString) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

// Map notification types to user-friendly titles
const typeToTitle = {
  workOrderCreated: 'Work Order Created',
  jobCardCreated: 'Job Card Created',
  userRegistered: 'New User Registered',
  lowStockAlert: 'Low Stock Alert',
  purchaseOrderCreated: 'Purchase Order Created',
  purchaseIndentCreated: 'Purchase Indent Created',
  assetPurchaseOrderCreated: 'Asset Purchase Order Created',
  assetIndentCreated: 'Asset Indent Created',
  qualityReportCreated: 'Quality Report Created',
  info: 'Information',
  // Add more as needed
};

const Notifications = () => {
  let userType = useSelector(selectCurrentUserType);
  // Always use lowercase for socket room and URLs (except for 'admin')
  userType = userType === 'admin' ? userType : userType?.toLowerCase();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(false); // Track new socket notification
  const socket = useSocket();
  const userId = useSelector((state) => state.auth._id);

  // Only open the menu and show backend notifications
  const handleClick2 = async (event) => {
    setAnchorEl2(event.currentTarget);
    setNewNotification(false); // Remove the mark when bell is clicked
    try {
      const data = await getLastNotifications({ userId, limit: 10 });
      console.log('🚀 ~ handleClick2 ~ data:', data);
      setNotifications(data.notifications || []);
    } catch {
      toast.error('Failed to load notifications');
    }
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // Save notifications to localStorage whenever they change
  // Removed localStorage logic

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      let formatted;
      switch (notification.type) {
        case 'jobCardCreated':
          formatted = {
            title: 'Job Card Created',
            subtitle: notification.message,
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
          break;
        case 'userRegistered':
          formatted = {
            title: 'New User Registered',
            subtitle: notification.message,
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
          break;
        case 'workOrderCreated':
          formatted = {
            title: 'Work Order Created',
            subtitle: notification.message,
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
          break;
        case 'lowStockAlert':
          formatted = {
            title: 'Low Stock Alert',
            subtitle: notification.message,
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
          break;
        case 'purchaseOrderCreated':
          formatted = {
            title: 'Purchase Order Created',
            subtitle: notification.message,
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
          break;
        case 'purchaseIndentCreated':
          formatted = {
            title: 'Purchase Indent Created',
            subtitle: notification.message,
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
          break;
        case 'assetPurchaseOrderCreated':
          formatted = {
            title: 'Asset Purchase Order Created',
            subtitle: notification.message,
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
          break;
        case 'assetIndentCreated':
          formatted = {
            title: 'Asset Indent Created',
            subtitle: notification.message,
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
          break;
        case 'qualityReportCreated':
          formatted = {
            title: 'Quality Report Created',
            subtitle: notification.message,
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
          break;
        default:
          formatted = {
            title: notification.title || 'Notification',
            subtitle: notification.message || '',
            avatar: '',
            ...notification,
            read: false,
            id: notification.id || Date.now() + Math.random(),
          };
      }
      formatted.userId = userId;
      // Only show as toast
      toast.info(`${formatted.title}: ${formatted.subtitle}`);
      setNewNotification(true); // Mark bell when socket notification arrives
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, userId]);

  useEffect(() => {
    if (socket && userType) {
      socket.emit('joinUserTypeRoom', { userType });
    }
  }, [socket, userType]);

  // No mark as read logic; notifications are just shown

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(anchorEl2 && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Badge variant="dot" color="primary" invisible={!newNotification}>
          <IconBellRinging size="21" stroke="1.5" />
        </Badge>
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
          },
        }}
      >
        <Stack direction="row" py={2} px={4} justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Notifications</Typography>
          <Chip label={`${notifications.length} new`} color="primary" size="small" />
        </Stack>
        <Scrollbar sx={{ height: '385px' }}>
          {notifications.length === 0 ? (
            <Typography align="center" sx={{ mt: 2 }}>
              No notifications
            </Typography>
          ) : (
            notifications.map((notification) => {
              const title = notification.title || typeToTitle[notification.type] || 'Notification';
              return (
                <Box key={notification.id || notification._id}>
                  <MenuItem sx={{ py: 2, px: 4 }}>
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        src={notification.avatar}
                        alt={notification.avatar}
                        sx={{
                          width: 48,
                          height: 48,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          fontWeight={600}
                          noWrap
                          sx={{
                            width: '240px',
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          sx={{
                            width: '240px',
                          }}
                          noWrap
                        >
                          {notification.subtitle || notification.message}
                        </Typography>
                        {notification.time && (
                          <Typography
                            color="textSecondary"
                            variant="caption"
                            sx={{ width: '240px' }}
                            noWrap
                          >
                            {formatTime(notification.time)}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </MenuItem>
                </Box>
              );
            })
          )}
        </Scrollbar>
        <Box p={3} pb={1}>
          <Button
            to={`/${userType}/all-notifications`}
            variant="outlined"
            component={Link}
            color="primary"
            fullWidth
          >
            See all Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Notifications;
