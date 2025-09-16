import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Typography, Box, Stack, Button, Fab, MenuItem } from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons';

import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';

import PageContainer from '@/components/container/PageContainer';
import CustomTable from '@/components/shared/CustomTable';

import { userData } from '@/api/admin';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import DeleteUserDialog from '@/components/dialog/DeleteUserDialog';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Users' }];

const Users = () => {
  const userType = useSelector(selectCurrentUserType);
  // Simple permission checks - no complex system needed
  const canEditUser = userType === 'admin' || userType === 'superadmin';
  const canCreateUser = userType === 'admin' || userType === 'superadmin';
  const canDeleteUser = userType === 'admin' || userType === 'superadmin';
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [totalProducts, setTotalProducts] = useState(0);

  const handleRefresh = () => {
    if (users.length === 1 && paginationModel.page > 0) {
      setPaginationModel((prev) => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchData();
    }
  };

  const columns = [
    { field: 'id', headerName: 'Sl No', width: 70, headerClassName: 'custom-header' },
    {
      field: 'fullName',
      headerName: 'NAME',
      width: 130,
      flex: 1,
      headerClassName: 'custom-header',
    },
    { field: 'email', headerName: 'EMAIL', flex: 1, headerClassName: 'custom-header' },
    {
      field: 'phoneNumber',
      headerName: 'PHONE',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      headerClassName: 'custom-header',
    },
    {
      field: 'employeeId',
      headerName: 'EMPLOYEE ID',
      flex: 1,
      headerClassName: 'custom-header',
    },
    {
      field: 'department',
      headerName: 'DEPARTMENT',
      width: 130,
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        return (
          <>
            <CustomSelect
              defaultValue="0"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none', // Removes the border
                },
              }}
            >
              {params.formattedValue.map((dept) => (
                <MenuItem value={params.formattedValue.indexOf(dept)} key={dept}>
                  <Typography fontSize="12px">
                    {dept.deptName.replace(/([a-z])([A-Z])/g, '$1 $2').trim()} ({dept.subDept})
                  </Typography>
                </MenuItem>
              ))}
            </CustomSelect>
          </>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => {
        return (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            {canEditUser && (
              <Fab
                sx={{
                  boxShadow: 3, // Elevation level (same as MUI Paper elevation)
                  '&:hover': {
                    boxShadow: 8, // Increase shadow on hover
                  },
                }}
                color="warning"
                size="small"
                style={{ padding: '2px 6px' }}
                onClick={() => navigate(`/${userType}/users/edit/${params.row._id}`)}
              >
                <IconEdit size="16" />
              </Fab>
            )}
            {canDeleteUser && <DeleteUserDialog id={params.row._id} onDelete={handleRefresh} />}
          </Box>
        );
      },
    },
  ];

  const fetchData = async () => {
    const response = await userData(paginationModel.page, paginationModel.pageSize);
    if (response) {
      setUsers(response.data.users);
      setTotalProducts(response.data.totalUsers);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [paginationModel.pageSize, paginationModel.page]);

  return (
    <PageContainer title="User Table" description="This is the User Table page">
      <Breadcrumb title="Users" items={BCrumb} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Users</Typography>
        {canCreateUser && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/${userType}/users/create`)}
          >
            Add User
          </Button>
        )}
      </Stack>
      <CustomTable
        rows={users}
        columns={columns}
        loading={isLoading}
        totalProducts={totalProducts}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </PageContainer>
  );
};

export default Users;
