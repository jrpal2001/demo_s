'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
} from '@mui/material';
import { updateSizesAndRemarks } from '@/api/admin';
import { useSelector } from 'react-redux';

const QuantsUpdate = ({ jobCardId, open, onClose, workflowData, workOrderData, workorderId }) => {
  const auth = useSelector((state) => state.auth);
  const currentDept = auth?.userType?.[0];
  const [department, setDepartment] = useState('');
  const [sizes, setSizes] = useState({
    xs: { pass: '', reject: '', line: '' },
    s: { pass: '', reject: '', line: '' },
    m: { pass: '', reject: '', line: '' },
    l: { pass: '', reject: '', line: '' },
    xl: { pass: '', reject: '', line: '' },
    '2xl': { pass: '', reject: '', line: '' },
    '3xl': { pass: '', reject: '', line: '' },
    '4xl': { pass: '', reject: '', line: '' },
    '5xl': { pass: '', reject: '', line: '' },
  });
  const [pass, setPass] = useState('');
  const [reject, setReject] = useState('');
  const [line, setLine] = useState('');
  const [total, setTotal] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedDepartmentsWithSize, setassignedDepartmentsWithSize] = useState([]);

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

  // Determine the department names based on the current user and finished departments
  let departmentNames = [];

  const allSizeDepartments = [
    'cutting',
    'bitchecking',
    'accessories',
    'trims',
    'embroidery',
    'printing&fusing',
    'operationpart',
    'stitching',
    'finishing',
    'fqi',
    'audit',
  ];

  // Get all finished departments from workflow data
  const finishedDepartments = allSizeDepartments.filter((dept) => {
    return (
      workflowData[dept]?.timing?.finishTime && workOrderData?.assignedDepartments?.includes(dept)
    );
  });
  console.log("🚀 ~ QuantsUpdate ~ finishedDepartments:", finishedDepartments)

  // SuperAdmin can update any finished department
  if (auth.userType[0].toLowerCase() === 'superadmin') {
    departmentNames = finishedDepartments;
  } else {
    // For other users, they can only update their own department if it's finished
    const currentUserDept = mapUsernameToDepartment(auth.userType[0]);
    console.log('🚀 ~ currentUserDept:', currentUserDept);

    if (finishedDepartments.includes(currentUserDept)) {
      departmentNames = [currentUserDept];
    } else {
      departmentNames = []; // No departments available for this user
    }
  }

  // Function to calculate totals from individual size values
  const calculateTotals = (sizesData) => {
    const sizeKeys = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

    let totalPass = 0;
    let totalReject = 0;
    let totalLine = 0;

    sizeKeys.forEach((size) => {
      totalPass += Number.parseInt(sizesData[size]?.pass) || 0;
      totalReject += Number.parseInt(sizesData[size]?.reject) || 0;
      totalLine += Number.parseInt(sizesData[size]?.line) || 0;
    });

    return {
      pass: totalPass,
      reject: totalReject,
      line: totalLine,
      total: totalPass + totalReject + totalLine,
    };
  };

  // Update totals whenever sizes change
  useEffect(() => {
    const totals = calculateTotals(sizes);
    setPass(totals.pass);
    setReject(totals.reject);
    setLine(totals.line);
    setTotal(totals.total);
  }, [sizes]);

  // Update size and remarks state when department is selected
  useEffect(() => {
    console.log('🚀 ~ workOrderData.assignedDepartments:', workOrderData.assignedDepartments);
    const allSizeDepartments = [
      'cutting',
      'bitchecking',
      'printing&fusing',
      'operationpart',
      'stitching',
      'finishing',
      'fqi',
      'audit',
    ];
    const departmentsWithSizes = allSizeDepartments.filter((dept) =>
      workOrderData.assignedDepartments.includes(dept),
    );
    console.log('🚀 ~ useEffect ~ departmentsWithSizes:', departmentsWithSizes);
    setassignedDepartmentsWithSize(departmentsWithSizes);

    if (department && workflowData[department]) {
      const departmentData = workflowData[department];
      console.log('🚀 ~ useEffect ~ departmentData:', departmentData);

      // Load existing size data
      const newSizes = {};
      ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'].forEach((size) => {
        newSizes[size] = {
          pass: departmentData[size]?.pass || '',
          reject: departmentData[size]?.reject || '',
          line: departmentData[size]?.line || '',
        };
      });
      setSizes(newSizes);
      setRemarks(departmentData.remarks || '');
    }
  }, [department, workflowData]);

  // Handle department change
  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  // Handle size input change
  const handleSizeChange = (size, field) => (event) => {
    const value = event.target.value;
    setSizes((prevSizes) => ({
      ...prevSizes,
      [size]: {
        ...prevSizes[size],
        [field]: value,
      },
    }));
  };

  // Handle remarks input change
  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  // Submit the updated sizes and remarks to the backend
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const data = {
        sizes,
        remarks,
        department,
        pass,
        reject,
        line,
        total,
      };
      console.log('🚀 ~ handleSubmit ~ data:', data);

      // API call to update sizes and remarks for the department
      await updateSizesAndRemarks(
        jobCardId,
        department,
        sizes,
        remarks,
        pass,
        reject,
        line,
        total,
        workorderId,
      );

      console.log('Sizes and remarks updated successfully');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>Update Workflow Data for Job Card: {jobCardId}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, padding: 2 }}>
          {/* Left side: Scrollable table with size details */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Job Card Requirement
            </Typography>

            {/* FIXED: Added horizontal scroll container */}
            <Box
              sx={{
                overflowX: 'auto',
                overflowY: 'visible',
                border: '1px solid #ddd',
                borderRadius: 1,
                backgroundColor: '#fff',
                // Ensure minimum width for proper scrolling
                '& > div': {
                  minWidth: `${Math.max(600, 150 + assignedDepartmentsWithSize.length * 120)}px`,
                },
              }}
            >
              <Box sx={{ display: 'table', width: '100%' }}>
                {/* Table header */}
                <Box
                  sx={{
                    display: 'table-row',
                    fontWeight: 'bold',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid #ddd',
                  }}
                >
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      minWidth: '80px',
                      borderRight: '1px solid #ddd',
                      fontWeight: 'bold',
                    }}
                  >
                    Size
                  </Box>
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      minWidth: '100px',
                      borderRight: '1px solid #ddd',
                      fontWeight: 'bold',
                    }}
                  >
                    Requirement
                  </Box>
                  {/* Adding columns for each department */}
                  {assignedDepartmentsWithSize.map((dept, index) => (
                    <Box
                      key={dept}
                      sx={{
                        display: 'table-cell',
                        padding: 1,
                        minWidth: '120px',
                        borderRight:
                          index < assignedDepartmentsWithSize.length - 1
                            ? '1px solid #ddd'
                            : 'none',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </Box>
                  ))}
                </Box>

                {/* Table rows for each size */}
                {['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'].map((size, rowIndex) => (
                  <Box
                    key={size}
                    sx={{
                      display: 'table-row',
                      backgroundColor: rowIndex % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'table-cell',
                        padding: 1,
                        borderBottom: '1px solid #ddd',
                        borderRight: '1px solid #ddd',
                        fontWeight: 'bold',
                      }}
                    >
                      {size.toUpperCase()}
                    </Box>
                    <Box
                      sx={{
                        display: 'table-cell',
                        padding: 1,
                        borderBottom: '1px solid #ddd',
                        borderRight: '1px solid #ddd',
                        textAlign: 'center',
                      }}
                    >
                      {workflowData.workOrderRef.sizeSpecification[size] || '-'}
                    </Box>
                    {/* Add data from workflowData for each department */}
                    {assignedDepartmentsWithSize.map((dept, colIndex) => (
                      <Box
                        key={dept}
                        sx={{
                          display: 'table-cell',
                          padding: 0.5,
                          borderBottom: '1px solid #ddd',
                          borderRight:
                            colIndex < assignedDepartmentsWithSize.length - 1
                              ? '1px solid #ddd'
                              : 'none',
                          textAlign: 'center',
                        }}
                      >
                        {workflowData[dept]?.[size]?.pass || '-'}
                      </Box>
                    ))}
                  </Box>
                ))}

                {/* QC PASS Row */}
                <Box
                  sx={{
                    display: 'table-row',
                    backgroundColor: '#e3f2fd',
                  }}
                >
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ddd',
                      borderRight: '1px solid #ddd',
                    }}
                  >
                    QC Pass
                  </Box>
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      borderBottom: '1px solid #ddd',
                      borderRight: '1px solid #ddd',
                      textAlign: 'center',
                    }}
                  >
                    {workOrderData.total || '-'}
                  </Box>
                  {assignedDepartmentsWithSize.map((dept, colIndex) => (
                    <Box
                      key={dept}
                      sx={{
                        display: 'table-cell',
                        padding: 0.5,
                        borderBottom: '1px solid #ddd',
                        borderRight:
                          colIndex < assignedDepartmentsWithSize.length - 1
                            ? '1px solid #ddd'
                            : 'none',
                        textAlign: 'center',
                      }}
                    >
                      {workflowData[dept]?.qcpass || '-'}
                    </Box>
                  ))}
                </Box>

                {/* QC REJECT Row */}
                <Box
                  sx={{
                    display: 'table-row',
                    backgroundColor: '#ffebee',
                  }}
                >
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ddd',
                      borderRight: '1px solid #ddd',
                    }}
                  >
                    QC Reject
                  </Box>
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      borderBottom: '1px solid #ddd',
                      borderRight: '1px solid #ddd',
                      textAlign: 'center',
                    }}
                  >
                    {workOrderData.total || '-'}
                  </Box>
                  {assignedDepartmentsWithSize.map((dept, colIndex) => (
                    <Box
                      key={dept}
                      sx={{
                        display: 'table-cell',
                        padding: 0.5,
                        borderBottom: '1px solid #ddd',
                        borderRight:
                          colIndex < assignedDepartmentsWithSize.length - 1
                            ? '1px solid #ddd'
                            : 'none',
                        textAlign: 'center',
                      }}
                    >
                      {workflowData[dept]?.qcreject || '-'}
                    </Box>
                  ))}
                </Box>

                {/* LINE Row */}
                <Box
                  sx={{
                    display: 'table-row',
                    backgroundColor: '#fff3e0',
                  }}
                >
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ddd',
                      borderRight: '1px solid #ddd',
                    }}
                  >
                    Line
                  </Box>
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      borderBottom: '1px solid #ddd',
                      borderRight: '1px solid #ddd',
                      textAlign: 'center',
                    }}
                  >
                    {workOrderData.total || '-'}
                  </Box>
                  {assignedDepartmentsWithSize.map((dept, colIndex) => (
                    <Box
                      key={dept}
                      sx={{
                        display: 'table-cell',
                        padding: 0.5,
                        borderBottom: '1px solid #ddd',
                        borderRight:
                          colIndex < assignedDepartmentsWithSize.length - 1
                            ? '1px solid #ddd'
                            : 'none',
                        textAlign: 'center',
                      }}
                    >
                      {workflowData[dept]?.line || '-'}
                    </Box>
                  ))}
                </Box>

                {/* REMARKS Row */}
                <Box
                  sx={{
                    display: 'table-row',
                    backgroundColor: '#f3e5f5',
                  }}
                >
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ddd',
                      borderRight: '1px solid #ddd',
                    }}
                  >
                    Remarks
                  </Box>
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      borderBottom: '1px solid #ddd',
                      borderRight: '1px solid #ddd',
                      textAlign: 'center',
                    }}
                  >
                    -
                  </Box>
                  {assignedDepartmentsWithSize.map((dept, colIndex) => (
                    <Box
                      key={dept}
                      sx={{
                        display: 'table-cell',
                        padding: 0.5,
                        borderBottom: '1px solid #ddd',
                        borderRight:
                          colIndex < assignedDepartmentsWithSize.length - 1
                            ? '1px solid #ddd'
                            : 'none',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={workflowData[dept]?.remarks || '-'}
                    >
                      {workflowData[dept]?.remarks || '-'}
                    </Box>
                  ))}
                </Box>

                {/* Total Row */}
                <Box
                  sx={{
                    display: 'table-row',
                    backgroundColor: '#e8f5e8',
                    fontWeight: 'bold',
                  }}
                >
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      fontWeight: 'bold',
                      borderRight: '1px solid #ddd',
                    }}
                  >
                    Total
                  </Box>
                  <Box
                    sx={{
                      display: 'table-cell',
                      padding: 1,
                      borderRight: '1px solid #ddd',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {workOrderData.total || '-'}
                  </Box>
                  {assignedDepartmentsWithSize.map((dept, colIndex) => (
                    <Box
                      key={dept}
                      sx={{
                        display: 'table-cell',
                        padding: 0.5,
                        borderRight:
                          colIndex < assignedDepartmentsWithSize.length - 1
                            ? '1px solid #ddd'
                            : 'none',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {workflowData[dept]?.total || '-'}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right side: Form for updating sizes and remarks */}
          <Box
            sx={{
              width: '350px',
              minWidth: '350px',
              borderLeft: '2px solid #ddd',
              padding: 2,
              backgroundColor: 'rgba(0,0,250,0.04)',
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>
              Update Workflow Data
            </Typography>

            {/* Department selection dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="select-department">Department</InputLabel>
              <Select
                labelId="select-department"
                value={department}
                onChange={handleDepartmentChange}
                fullWidth
                disabled={departmentNames.length === 0}
              >
                <MenuItem value="">Select Department</MenuItem>
                {departmentNames.map((deptKey) => (
                  <MenuItem key={deptKey} value={deptKey}>
                    {deptKey.charAt(0).toUpperCase() + deptKey.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Show message when no departments are available */}
            {departmentNames.length === 0 && (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: 1,
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="body2" color="#856404">
                  {auth.userType[0].toLowerCase() === 'superadmin'
                    ? 'No finished departments available to update.'
                    : 'Finish the work to update the form.'}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 2 }}>
              {/* Headers */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 1,
                  fontWeight: 'bold',
                  mb: 0.5,
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2">Pass</Typography>
                <Typography variant="subtitle2">Reject</Typography>
                <Typography variant="subtitle2">Line</Typography>
              </Box>

              {/* Size input rows */}
              {['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'].map((size) => (
                <Box key={size} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>
                    {size.toUpperCase()}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                    <TextField
                      type="number"
                      size="small"
                      value={sizes[size]?.pass || ''}
                      onChange={handleSizeChange(size, 'pass')}
                      inputProps={{ min: 0 }}
                      disabled={departmentNames.length === 0}
                    />
                    <TextField
                      type="number"
                      size="small"
                      value={sizes[size]?.reject || ''}
                      onChange={handleSizeChange(size, 'reject')}
                      inputProps={{ min: 0 }}
                      disabled={departmentNames.length === 0}
                    />
                    <TextField
                      type="number"
                      size="small"
                      value={sizes[size]?.line || ''}
                      onChange={handleSizeChange(size, 'line')}
                      inputProps={{ min: 0 }}
                      disabled={departmentNames.length === 0}
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Auto-calculated totals */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <TextField
                label="QC Pass (Auto-calculated)"
                type="number"
                value={pass}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                  },
                }}
              />
              <TextField
                label="QC Reject (Auto-calculated)"
                type="number"
                value={reject}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                  },
                }}
              />
              <TextField
                label="QC Line (Auto-calculated)"
                type="number"
                value={line}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                  },
                }}
              />
              <TextField
                label="Total (Auto-calculated)"
                type="number"
                value={total}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>

            {/* Remarks field */}
            <TextField
              label="Remarks"
              value={remarks}
              onChange={handleRemarksChange}
              fullWidth
              multiline
              rows={3}
              size="small"
              disabled={departmentNames.length === 0}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || departmentNames.length === 0}
          sx={{ minWidth: '120px' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuantsUpdate;
