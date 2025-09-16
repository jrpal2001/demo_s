import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stack, Typography, Grid, Grid2, Box } from '@mui/material';
import { IconEdit, IconEye } from '@tabler/icons';
import logo from '@/assets/images/logos/logo-opacity-30.png';

const ScrollContentDialog = ({ totalProducts }) => {
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconEye size="16" onClick={handleClickOpen('paper')} />
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                // fullScreen={ true }
                fullWidth={true}
            >
                <DialogTitle id="scroll-dialog-title">Entries</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}            
                     sx={{ 
                        backgroundImage: `url(${logo})`,
                        backgroundSize: 'contain', 
                        backgroundRepeat: 'no-repeat',
                        backgroundPositionY: '50%',
                      }}
                    >
                    <DialogContentText
                        id="scroll-dialog-description"
                        // ref={descriptionElementRef}
                        tabIndex={-1}
                        component="div"
                    >
                        {totalProducts.map((product, index) => (
                            Object.entries(product).map(([key, value]) => {
                                if (key === "_id" || key === "__v") {
                                    return null; // Skip rendering for these keys
                                } else {
                                    return (
                                        <Grid2 container size={5} rowSpacing={2} key={index + key}>
                                            <Grid2 size={{ xs: 5 }}>
                                                <Typography variant="h6">
                                                    {key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                                                </Typography>
                                            </Grid2>
                                            <Grid2 size={{ xs: 1 }}>
                                                <Typography variant="h6">:</Typography>
                                            </Grid2>
                                            <Grid2 size={{ xs: 6 }}>
                                                <Typography variant="h6">
                                                    {typeof value === "string" ? value.toUpperCase() : value}
                                                </Typography>
                                            </Grid2>
                                        </Grid2>
                                    );
                                }
                            })
                        ))}


                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ScrollContentDialog;
