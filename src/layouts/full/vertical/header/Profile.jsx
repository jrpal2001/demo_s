import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';

import { IconMail, IconPhone } from '@tabler/icons';
import { Stack } from '@mui/system';

import ProfileImg from '@/assets/images/profile/user-1.jpg';
import Scrollbar from '@/components/custom-scroll/Scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/api/auth';
import { resetAuth } from '@/store/auth/AuthSlice';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response) {
        dispatch(resetAuth());
        navigate('/login');
      }
    } catch (err) {

    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
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
        <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
          <Box p={3}>
            <Typography variant="h5">User Profile</Typography>
            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar src={ProfileImg} alt={ProfileImg} sx={{ width: 95, height: 95 }} />
              <Box>
                <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                  {user.fullName}
                </Typography>
                <Typography 
                  variant="subtitle2" 
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}  
                >
                  <IconPhone width={15} height={15} />
                  {user.phoneNumber}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <IconMail width={15} height={15} />
                  {user.email}
                </Typography>
              </Box>
            </Stack>
            <Divider />

            <Box mt={2}>
              <Button variant="outlined" color="primary" fullWidth onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
