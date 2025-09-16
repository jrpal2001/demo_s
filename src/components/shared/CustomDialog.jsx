import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from '@mui/material';
import { IconEye, IconTrash } from '@tabler/icons';

const CustomDialog = ({
  openUp = false,
  title,
  cancel = true,
  children,
  icon = 'eye',
  handleClickDelete,
}) => {
  const [open, setOpen] = useState(openUp);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);
    handleClickDelete();
  };

  return (
    <>
      {icon && icon === 'eye' && <IconEye onClick={handleClickOpen} />}
      {icon && icon === 'delete' && <IconTrash onClick={handleClickOpen} />}
      <Dialog open={open} sx={{ fullWidth: true }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          {icon && icon === 'delete' && (
            <Button color="error" onClick={handleDelete}>
              Delete
            </Button>
          )}
          {cancel && (
            <Button color="primary" onClick={handleClose}>
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomDialog;
