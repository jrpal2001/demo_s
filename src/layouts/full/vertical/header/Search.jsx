import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons';
import Menuitems from '../sidebar/MenuItems'; // Make sure Menuitems is an array
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { Link } from 'react-router-dom';

const Search = () => {
  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);
  const [search, setSerach] = useState('');

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  // Ensuring the filterRoutes works with Menuitems being an array
  const filterRoutes = (routes, cSearch) => {
    if (!Array.isArray(routes)) {
      console.warn('Menuitems is not an array');
      return []; // Return empty array if not an array
    }
    const term = cSearch.toLowerCase();
    return routes.reduce((acc, route) => {
      const hasMatch =
        route.title?.toLowerCase().includes(term) || route.href?.toLowerCase().includes(term);

      if (hasMatch) {
        acc.push(route);
      } else if (route.children) {
        const filteredChildren = route.children.filter(
          (child) =>
            child.title?.toLowerCase().includes(term) || child.href?.toLowerCase().includes(term),
        );

        if (filteredChildren.length > 0) {
          acc.push({ ...route, children: filteredChildren });
        }
      }

      return acc;
    }, []);
  };

  const searchData = filterRoutes(Menuitems, search);

  return (
    <>
      <IconButton
        aria-label="show 4 new mails"
        color="inherit"
        aria-controls="search-menu"
        aria-haspopup="true"
        onClick={() => setShowDrawer2(true)}
        size="large"
      >
        <IconSearch size="16" />
      </IconButton>
      <Dialog
        open={showDrawer2}
        onClose={() => setShowDrawer2(false)}
        fullWidth
        maxWidth={'sm'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { position: 'fixed', top: 30, m: 0 } }}
      >
        <DialogContent className="testdialog">
          <Stack direction="row" spacing={2} alignItems="center">
            <CustomTextField
              id="tb-search"
              placeholder="Search here"
              fullWidth
              onChange={(e) => setSerach(e.target.value)}
              inputProps={{ 'aria-label': 'Search here' }}
            />
            <IconButton size="small" variant="outlined" onClick={handleDrawerClose2}>
              <IconX size="18" />
            </IconButton>
          </Stack>
        </DialogContent>
        <Divider />
        <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Typography variant="h5" p={1}>
            Quick Page Links
          </Typography>
          <Box>
            <List component="nav">
              {searchData.map((menu) => {
                return (
                  <Box key={menu.title ? menu.id : menu.subheader}>
                    {menu.title && !menu.children ? (
                      <ListItemButton sx={{ py: 0.5, px: 1 }} to={menu.href} component={Link}>
                        <ListItemText
                          primary={menu.title}
                          secondary={menu.href}
                          sx={{ my: 0, py: 0.5 }}
                        />
                      </ListItemButton>
                    ) : (
                      ''
                    )}
                    {menu.children ? (
                      <>
                        {menu.children.map((child) => {
                          return (
                            <ListItemButton
                              sx={{ py: 0.5, px: 1 }}
                              to={child.href}
                              component={Link}
                              key={child.title ? child.id : menu.subheader}
                            >
                              <ListItemText
                                primary={child.title}
                                secondary={child.href}
                                sx={{ my: 0, py: 0.5 }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </>
                    ) : (
                      ''
                    )}
                  </Box>
                );
              })}
            </List>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Search;
