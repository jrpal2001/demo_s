import { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import TimingComponent from './Timing';
import QualityComponent from './Quality';
import ProcessCompletionComponent from './ProcessCompletion';
import { useSelector } from 'react-redux';
// import TimingPageModal from './TimingForm';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Function to map usernames to department names
const mapUsernameToDepartment = (username) => {
  const mapping = {
    superadmin: 'superadmin', // SuperAdmin can access all
    merchandiser: 'merchandiser',
    supermerchandiser: 'supermerchandiser',
    purchase: 'purchase',
    trimsandmachinepartsstore: 'trims',
    fabric: 'fabric',
    cutting: 'cutting',
    production: 'production',
    partproduction: 'operationpart',
    finishing: 'finishing',
    fgstore: 'fgstore',
    fgstoreinward: 'fgstoreinward',
    fgstoreoutward: 'fgstoreoutward',
    embroidery: 'embroidery',
    ordermanagement: 'ordermanagement',
    asset: 'asset',
    accessories: 'accessories',
    maintenance: 'maintenance',
    otherstores: 'otherstores',
    leadmanager: 'leadmanager',
    salesexecutive: 'salesexecutive',
    quality: 'quality',
    accounts: 'accounts',
  };

  return mapping[username.toLowerCase()] || username.toLowerCase();
};

// Helper function to determine background color based on timing status
const getCardBackgroundColor = (timing) => {
  if (timing?.finishTime) {
    return '#e8f5e9'; // Light green for finished work
  } else if (timing?.startTime) {
    return '#fff9c4'; // Light yellow for ongoing work
  } else {
    return '#ffe0b2'; // Light orange for not started
  }
};

const DepartmentComponent = ({
  departmentName,
  departmentData,
  jobCardNo,
  workorderId,
  previousDepartmentData,
}) => {
  console.log('🚀 ~ DepartmentComponent ~ departmentName:', departmentName);
  const backgroundColor = getCardBackgroundColor(departmentData.timing);

  const auth = useSelector((state) => state.auth);
  const isSuperAdmin = auth?.userType?.[0] === 'superAdmin';
  const currentDept = mapUsernameToDepartment(auth?.userType?.[0]);

  // modal state
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    // setOpenModal(false);
  };

  const handleUpdateNavigate = () => {
    navigate('update', {
      state: {
        department: departmentName,
        data: departmentData.timing || {},
        departmentData:departmentData,
        processCompletion: departmentData.processCompletion,
        jobCardNo,
        workorderId,
        previousDepartmentData,
        // Do NOT include any functions here!
      },
    });
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box
        sx={{
          border: '1px solid #E0E0E0', // Light border color
          borderRadius: 2, // Rounded corners
          boxShadow: 2, // Subtle shadow for depth
          p: 3, // More padding for spacing
          bgcolor: backgroundColor, // Dynamic background color based on timing
          mb: 3, // Margin between cards
          transition: 'transform 0.3s ease', // Smooth transition for hover effect
          '&:hover': {
            transform: 'scale(1.05)', // Slight scale on hover
            boxShadow: 6, // Increased shadow on hover
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'primary.main', // Theme-based color for the department name
            }}
          >
            {departmentName}
          </Typography>
          {(isSuperAdmin || currentDept === departmentName?.toLowerCase()) && ( // Conditionally render the button
            <>
              <button
                style={{
                  backgroundColor: '#1976d2', // Primary blue color
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={handleUpdateNavigate}
              >
                Update
              </button>
            </>
          )}
        </Box>

        <TimingComponent timing={departmentData.timing} />

        {/* Conditionally render the QualityComponent for Fabric department */}
        {departmentName === 'Fabric' && <QualityComponent quality={departmentData.quality} />}

        <ProcessCompletionComponent processCompletion={departmentData.processCompletion} />
      </Box>

      {/* TimingPageModal to update department timing data */}
      {/* <TimingPageModal
        isOpen={openModal} // Modal open state
        onClose={handleClose} // Close handler
        department={departmentName} // Dynamic department name
        data={departmentData.timing || {}} // Always pass an object
        onUpdateTimingData={onUpdateTimingData} // Handler for timing data update
        jobCardNo={jobCardNo}
        workorderId={workorderId}
      /> */}
    </Grid>
  );
};

DepartmentComponent.propTypes = {
  departmentName: PropTypes.string.isRequired,
  departmentData: PropTypes.shape({
    timing: PropTypes.object,
    quality: PropTypes.object,
    processCompletion: PropTypes.object,
  }).isRequired,
  jobCardNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  workorderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DepartmentComponent;
