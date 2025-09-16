import React from 'react';
import { IconButton, Box, AppBar, useMediaQuery, Toolbar, styled, Stack, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, toggleMobileSidebar } from '@/store/customizer/CustomizerSlice';
import { IconMenu2 } from '@tabler/icons';

// components
import Notifications from './Notifications';
import Profile from './Profile';
// import Search from './Search';
// import Language from './Language';
// import Navigation from './Navigation';
import MobileRightSidebar from './MobileRightSidebar';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { setAuth } from '@/store/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // for usertype selection 
  const auth = useSelector((state) => state.auth);

  // drawer
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
    // display: 'flex',
    // justifyContent: 'space-between',
  }));

  function handleUserTypeChange (event) {
    const lock = [event.target.value, ...auth.userType.filter(user => user !== event.target.value)];
    
    dispatch(setAuth({
      ...auth,
      userType: lock,
    }))
    
    let newUser = event.target.value.toLowerCase();
    if (newUser == 'superadmin') {
      newUser = 'admin';
    }
    navigate(`/${newUser}/dashboard`);
  }

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={lgUp ? () => dispatch(toggleSidebar()) : () => dispatch(toggleMobileSidebar())}
        >
          <IconMenu2 size="20" />
        </IconButton>
        {/* ------------------------------------------- */}
        <Box flexGrow={1} />
        {/* ------------------------------------------- */}
        <Box sx={{mr: 5}}>
          <CustomSelect
            name="user-type"
            defaultValue={ auth.userType[0] ?? "default" }
            onChange={ handleUserTypeChange }
          >
            <MenuItem value="default" disabled sx={{ display: "none" }}>Select User Type</MenuItem>
            { 
              auth && auth.userType.map( (user, index) => (
                <MenuItem key={index} value={user}>{user}</MenuItem>
              ))
            }
          </CustomSelect>
        </Box>
        <Stack spacing={1} direction="row" alignItems="center">
          {/* ------------------------------------------- */}
          <Notifications />
          {/* ------------------------------------------- */}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleSidebar: PropTypes.func,
};

export default Header;
