import { Paper, Box, Typography, Grid, Avatar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PublicIcon from '@mui/icons-material/Public';
import logo from '@/assets/images/logos/Samurai Logo.png';

const CompanyInfoBox = () => (
  <Paper elevation={4} sx={{ display: 'flex', borderRadius: 3, overflow: 'hidden', mb: 3, maxWidth: 600, ml: 0, boxShadow: 6 }}>
    {/* Accent bar */}
    <Box sx={{ width: 8, bgcolor: 'primary.main' }} />
    <Box sx={{ flex: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={logo} alt="Samurai Logo" sx={{ width: 56, height: 56, mr: 2, boxShadow: 2 }} />
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Samurai Exports Pvt Ltd
        </Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <LocationOnIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
            <Box>
              <Typography variant="body2">#79, SSI Area, 1st Main Road,</Typography>
              <Typography variant="body2">Rajajinagar 5th Block, Bang - 560010</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GppGoodIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">GSTIN/UIN: <b>29AAZCS6489F1Z8</b></Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PublicIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">State: <b>Karnataka</b>, Code: <b>29</b></Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">accounts@samuraiexports.in</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Paper>
);

export default CompanyInfoBox; 