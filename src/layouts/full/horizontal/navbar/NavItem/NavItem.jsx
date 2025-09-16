'use client';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// mui imports
import { ListItemIcon, ListItem, List, styled, ListItemText, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

const NavItem = ({ item, level, pathDirect, onClick }) => {
  const customizer = useSelector((state) => state.customizer);
  const Icon = item.icon;
  const theme = useTheme();
  const itemIcon =
    level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.1rem" />;

  const ListItemStyled2 = styled(ListItem)(() => ({
    padding: '5px 10px',
    gap: '10px',
    borderRadius: `${customizer.borderRadius}px`,
    marginBottom: level > 1 ? '3px' : '0px',
    color:
      level > 1 && pathDirect === item.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    //backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    '&.Mui-selected': {
      color: level > 1 ? theme.palette.primary.main : 'white!important',
      backgroundColor: level > 1 ? 'transparent' : theme.palette.primary.main,
      '&:hover': {
        backgroundColor: level > 1 ? '' : theme.palette.primary.main,
        color: 'white',
      },
    },
  }));

  // Check if the current path exactly matches the item's href
  // or if it's a child route (but not a sibling route)
  const isExactMatch = pathDirect === item.href;
  const isChildRoute = item.href !== '/' && pathDirect.startsWith(item.href + '/');

  // Don't match if it's just a partial string match
  // For example, /admin/material-inward-qc should not match /admin/material-inward
  const isActive = isExactMatch || isChildRoute;

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled2
        button
        component={item.external ? 'a' : NavLink}
        to={item.href}
        href={item.external ? item.href : ''}
        disabled={item.disabled}
        selected={isActive}
        target={item.external ? '_blank' : ''}
        onClick={onClick}
        end={true} // Add this to ensure exact matching for NavLink
      >
        <ListItemIcon
          sx={{
            minWidth: 'auto',
            p: '3px 0',
            color: 'inherit',
          }}
        >
          {itemIcon}
        </ListItemIcon>
        <ListItemText>{item.title}</ListItemText>
      </ListItemStyled2>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  hideMenu: PropTypes.any,
};

export default NavItem;
