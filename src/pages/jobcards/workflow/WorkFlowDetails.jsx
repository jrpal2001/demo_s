'use client';

import { useEffect, useState, useRef } from 'react';
import { Typography, Box, IconButton, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DepartmentComponent from './Department';
import QuantsUpdate from './UpdateQuantity';
import { useParams, useLocation } from 'react-router-dom';
import SizeTable from './SizeTable';
import { fetchWorkflowForWorkorderId } from '@/api/workorder.api';
// import RouteCardGenerator from '../workorder/routeCardBackup';
import RouteCardGenerator from '../workorder/RouteCard';

export default function WorkflowDetails() {
  const { workorderId } = useParams();
  const [workflowData, setWorkflowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sliderRef = useRef(null);

  // Mock auth for demonstration - replace with your actual auth implementation
  const auth = {
    userType: ['superAdmin'],
  };

  // Mock job card data - replace with actual data
  const jobCardId = workflowData?.jobCardRef || '';
  const location = useLocation();
  const rowData = location.state?.rowData;
  console.log('🚀 ~ WorkflowDetails ~ rowData:', rowData);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const fetchWorkflowData = async () => {
    try {
      // Replace with your actual API call
      const response = await fetchWorkflowForWorkorderId(workorderId);
      console.log('🚀 ~ fetchWorkflowData ~ response.data:', response.data);

      setWorkflowData(response.data);
    } catch {
      // Error handling intentionally left blank
    }
  };

  useEffect(() => {
    fetchWorkflowData();
  }, [workorderId]);

  const generateTableData = (workflowData) => {
    // console.log('🚀 ~ generateTableData ~ workflowData:', workflowData);
    const sizeColumns = [
      'xs',
      's',
      'm',
      'l',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      'total',
      'qcpass',
      'qcreject',
      'line',
    ];

    const departmentNames = Object.keys(workflowData).filter(
      (key) =>
        workflowData[key] &&
        typeof workflowData[key] === 'object' &&
        [
          'cutting',
          'bitchecking',
          'recutting',
          'trims',
          'accessories',
          'embroidery',
          'printing&fusing',
          'operationpart',
          'stitching',
          'finishing',
          'fqi',
          'audit',
        ].includes(key),
    );

    // Generate rows for sizes and special rows
    const rows = sizeColumns.map((size) => {
      const row = { size };

      departmentNames.forEach((department) => {
        if (['total', 'qcpass', 'qcreject', 'line'].includes(size)) {
          // For special rows, directly access the values from the department object
          row[department] = workflowData[department]?.[size] || '-';
        } else {
          // For size rows, access the 'pass' value
          row[department] = workflowData[department]?.[size]?.pass || '-';
        }
      });

      // Populate Work Order column
      if (['qcpass', 'qcreject', 'line'].includes(size)) {
        row['workOrder'] = workflowData.workOrderRef?.sizeSpecification?.[size] ?? 0;
      } else if (size === 'total') {
        row['workOrder'] = workflowData.workOrderRef?.quantityToBeProduced ?? '-';
      } else {
        row['workOrder'] = workflowData.workOrderRef?.sizeSpecification?.[size] ?? '-';
      }

      row.id = `${size}-${Date.now()}-${Math.random()}`; // Ensure unique id for each row
      return row;
    });

    // Generate remarks row with default values
    const remarksRow = { size: 'Remarks', id: `remarks-${Date.now()}-${Math.random()}` };
    departmentNames.forEach((department) => {
      remarksRow[department] = workflowData[department]?.remarks || '-'; // Add remarks if available
    });
    remarksRow['workOrder'] = '-'; // Set remarks for Job Card column

    // Add remarks row at the end
    rows.push(remarksRow);

    return rows;
  };

  const generateColumns = (workflowData) => {
    if (!workflowData || typeof workflowData !== 'object') {
      return [{ field: 'size', headerName: 'Size', flex: 1 }]; // Default column if data is not ready
    }

    // Only include these departments
    const departmentsWithSizes = [
      'cutting',
      'bitchecking',
      'recutting',
      'trims',
      'accessories',
      'embroidery',
      'printing&fusing',
      'operationpart',
      'stitching',
      'finishing',
      'fqi',
      'audit',
    ];

    const columns = [
      { field: 'size', headerName: 'Size', flex: 1 },
      { field: 'workOrder', headerName: 'Work Order', flex: 1 },
      ...departmentsWithSizes
        .filter((department) => workflowData[department]) // Only include departments that exist in the data
        .map((department) => ({
          field: department,
          headerName: department.charAt(0).toUpperCase() + department.slice(1),
          flex: 1,
        })),
    ];

    return columns;
  };

  if (!workflowData) {
    return <Typography>Loading...</Typography>;
  }

  // Render RouteCardGenerator at the top
  // rowData comes from location.state?.rowData, workflowData is fetched
  // Only show the download button here

  const tableData = generateTableData(workflowData);
  const consolidatedColumns = generateColumns(workflowData);

  const allDepartments = [
    'fabric',
    'cutting',
    'bitchecking',
    'recutting',
    'trims',
    'accessories',
    'embroidery',
    'printing&fusing',
    'operationpart',
    'stitching',
    'finishing',
    'fqi',
    'audit',
  ];

  // Determine the current department based on the user's role (not workflow data)
  const isSuperAdmin =
    auth?.userType?.[0] === 'superAdmin' || auth?.userType?.[0] === 'superMerchandiser';

  // Get the current department index based on the user's role
  const currentDeptIndex = allDepartments.indexOf(auth?.userType[0]?.toLowerCase());

  // Separate departments into main departments and special departments (embroidery, accessories)
  const mainDepartments = allDepartments.filter(
    (dept) => !['embroidery', 'accessories'].includes(dept),
  );
  const specialDepartments = ['embroidery', 'accessories'];

  // If the user is not SuperAdmin, show current department and the previous one (if it's not the first department)
  const departmentNames = isSuperAdmin
    ? mainDepartments
    : currentDeptIndex > 0
    ? [mainDepartments[currentDeptIndex - 1], mainDepartments[currentDeptIndex]]
    : [mainDepartments[currentDeptIndex]]; // For the first department (e.g., 'fabric')

  // Filter the main departments to include only the ones present in departmentNames
  const filteredDepartments = Object.entries(workflowData || {}).filter(([key]) => {
    return (
      departmentNames.includes(key) && workflowData[key] && typeof workflowData[key] === 'object'
    );
  });

  // Filter special departments (embroidery, accessories)
  const filteredSpecialDepartments = Object.entries(workflowData || {}).filter(([key]) => {
    return (
      specialDepartments.includes(key) && workflowData[key] && typeof workflowData[key] === 'object'
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Route Card PDF Generator at the top */}
      <RouteCardGenerator rowData={rowData} workflowData={workflowData} />
      {/* Current Department */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Current Department:{' '}
          {workflowData.currentDepartment
            ? workflowData.currentDepartment.toUpperCase()
            : 'UNKNOWN'}
        </Typography>
      </Box>

      {/* Render individual department data as a carousel */}
      <Box sx={{ mb: 4, overflow: 'hidden', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Department Data</Typography>
          <Box>
            <IconButton
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous"
              sx={{ backgroundColor: 'primary.main', color: 'black', mx: 0.5 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next"
              sx={{ backgroundColor: 'primary.main', color: 'black', mx: 0.5 }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>

        <Slider
          ref={sliderRef}
          dots={false}
          infinite={false}
          speed={500}
          slidesToShow={3}
          slidesToScroll={1}
          centerMode={false}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
              },
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 0,
              },
            },
          ]}
        >
          {filteredDepartments.map(([departmentName, departmentData]) => {
            // Find previous department
            const currentIdx = allDepartments.indexOf(departmentName);
            const prevDeptName = currentIdx > 0 ? allDepartments[currentIdx - 1] : null;
            const previousDepartmentData = prevDeptName ? workflowData[prevDeptName] : null;

            return (
              <Box key={departmentName} sx={{ px: 2, py: 2 }}>
                <DepartmentComponent
                  departmentName={departmentName}
                  departmentData={departmentData}
                  previousDepartmentData={previousDepartmentData}
                  jobCardNo={jobCardId}
                  currentDepartment={workflowData.currentDepartment}
                  workorderId={workorderId}
                />
              </Box>
            );
          })}
        </Slider>
      </Box>

      {/* Special Departments (Embroidery & Accessories) */}
      {filteredSpecialDepartments.length > 0 && (
        <Box sx={{ mb: 4, overflow: 'hidden', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Special Departments (Embroidery & Accessories)</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {filteredSpecialDepartments.map(([departmentName, departmentData]) => {
              // Find previous department
              const currentIdx = allDepartments.indexOf(departmentName);
              const prevDeptName = currentIdx > 0 ? allDepartments[currentIdx - 1] : null;
              const previousDepartmentData = prevDeptName ? workflowData[prevDeptName] : null;

              return (
                <Box key={departmentName} sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <DepartmentComponent
                    departmentName={departmentName}
                    departmentData={departmentData}
                    previousDepartmentData={previousDepartmentData}
                    jobCardNo={jobCardId}
                    currentDepartment={workflowData.currentDepartment}
                    workorderId={workorderId}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Consolidated Table */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Consolidated Workflow Data</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ ml: 2 }}>
            Update Workflow Data
          </Button>
        </Box>

        <SizeTable rows={tableData} columns={consolidatedColumns} loading={false} />
      </Box>

      <QuantsUpdate
        jobCardId={jobCardId}
        open={isModalOpen}
        onClose={handleCloseModal}
        workflowData={workflowData}
        workOrderData={rowData}
        workorderId={workorderId}
      />
    </div>
  );
}
