import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fab, Grid2, Box, Avatar, styled, MenuItem } from '@mui/material';
import { IconTrash } from '@tabler/icons';
import { userDelete, userView } from '@/api/admin';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import CustomSelect from '../forms/theme-elements/CustomSelect';
import { toast } from 'react-toastify';

const DeleteUserDialog = ({ id, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({});

    const ProfileImage = styled(Box)(() => ({
        backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
        borderRadius: '50%',
        width: '110px',
        height: '110px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
    }));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        try {
            const response = await userDelete(id);
            if (response == 200) {
                toast.success("User deleted successfully");
                handleClose();
                onDelete();
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await userView(id);
                if (response) {
                    setUser(response.data);
                }
            } catch (error) {

            }
        }

        fetchUser();
    }, [id])

    return (
        <>
            <Fab
                sx={{
                    boxShadow: 3, // Elevation level (same as MUI Paper elevation)
                    "&:hover": {
                      boxShadow: 8, // Increase shadow on hover
                    },
                  }} 
                color="error"
                size="small"
                style={{ padding: '2px 6px' }}
                onClick={handleClickOpen}
            >
                <IconTrash />
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete User"}
                </DialogTitle>
                <DialogContent>
                    <Grid2>
                        <Box display="flex" alignItems="center" height="20vh" >
                            <ProfileImage>
                                <Avatar
                                    // src={userImg}
                                    // alt={userImg}
                                    sx={{
                                        borderRadius: '50%',
                                        width: '100px',
                                        height: '100px',
                                        border: '4px solid #fff',
                                    }}
                                />
                            </ProfileImage>
                        </Box>
                    </Grid2>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                            <CustomFormLabel htmlFor="fullName" >Name</CustomFormLabel>
                            <CustomTextField
                                id="fullName"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={user.fullName}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                            <CustomFormLabel htmlFor="email" >Email</CustomFormLabel>
                            <CustomTextField
                                id="email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={user.email}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                            <CustomFormLabel htmlFor="phoneNumber" >Phone</CustomFormLabel>
                            <CustomTextField
                                id="phoneNumber"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={user.phoneNumber}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                            <CustomSelect
                                id="department"
                                fullWidth
                                size="small"
                                defaultValue="default"
                            >
                                <MenuItem value="default" disabled>See Department</MenuItem>
                                {
                                    user?.department?.map(department => {
                                        const [key, value] = Object.entries(department)[0];
                                        return <MenuItem value={key} key={key}>{value}</MenuItem>;
                                    })
                                }
                            </CustomSelect>
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Dont Delete
                    </Button>
                    <Button color="error" onClick={handleDelete}>Im Sure</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeleteUserDialog;
