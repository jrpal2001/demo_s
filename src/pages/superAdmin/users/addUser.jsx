import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Grid,
  Button,
  Stack,
  MenuItem,
  FormControl,
  FormHelperText,
  styled,
  Avatar,
  Box,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import ParentCard from '@/components/shared/ParentCard';
import { userAdd } from '@/api/admin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userimg from '@/assets/images/profile/user-1.jpg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { departments } from '@/data/departments';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const AddUser = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    setError,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
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
  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/users`, title: 'Users' },
    { title: 'Add' },
  ];
  async function onSubmit(data) {
    const upData = {
      ...data,
      email: data.email.toLowerCase(),
      department: data.department
        .filter((dept) => dept != '')
        .map((dept) => {
          console.log(dept);
          if (dept !== '') {
            return { deptName: dept, subDept: 'HOD' };
          }
        }),
    };
    console.log(upData.department);
    if (!(upData.department.length > 0)) {
      setError('department', { type: 'manual', message: 'Please select a department' });
      return;
    }
    console.log(upData);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(upData).forEach(([key, value]) => {
        if (key === 'profileImage' || key === 'userImg') return;
        if (value !== undefined && value !== null) {
          if (key === 'department') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      console.log('🚀 ~ onSubmit ~ formData:', formData);
      const response = await userAdd(formData);
      setIsSubmitting(false);
      navigate(`/${userType}/users`);
      toast.success(response.message);
    } catch (error) {
      console.log(error);
      error.data?.map((err) => {
        console.log(err);
        setError(err, { type: 'manual', message: error.message });
      });
      setIsSubmitting((prev) => !prev);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <PageContainer title="Add User" description="Add a new user">
            <Breadcrumb title="Add User" items={BCrumb} />     {' '}
      <ParentCard title="Add User">
               {' '}
        <form onSubmit={handleSubmit(onSubmit)}>
                   {' '}
          <Grid container spacing={2}>
                       {' '}
            <Grid item xs={12}>
                           {' '}
              <Box display="flex" alignItems="center" height="20vh">
                               {' '}
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                               {' '}
                <ProfileImage onClick={handleImageClick}>
                                   {' '}
                  <Avatar
                    src={imagePreviewUrl || userimg}
                    alt={imagePreviewUrl || userimg}
                    sx={{
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      border: '4px solid #fff',
                    }}
                  />
                                 {' '}
                </ProfileImage>
                             {' '}
              </Box>
                         {' '}
            </Grid>
                        {/* Name Field */}           {' '}
            <Grid item xs={12} sm={6} lg={4}>
                            <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
                           {' '}
              <CustomTextField
                id="name"
                placeholder="Enter name"
                {...register('fullName', { required: 'Name is required' })}
                variant="outlined"
                fullWidth
                size="small"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
                         {' '}
            </Grid>
                        {/* Email Field */}           {' '}
            <Grid item xs={12} sm={6} lg={4}>
                            <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                           {' '}
              <CustomTextField
                id="email"
                placeholder="Enter email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                variant="outlined"
                fullWidth
                size="small"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
                         {' '}
            </Grid>
                        {/* Phone Field */}           {' '}
            <Grid item xs={12} sm={6} lg={4}>
                            <CustomFormLabel htmlFor="phone">Phone</CustomFormLabel>
                           {' '}
              <CustomTextField
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                onInput={(event) => {
                  const numericValue = event.target.value.replace(/[^\+\-0-9]/g, ''); // Allow only numbers
                  setValue('phoneNumber', numericValue); // Update react-hook-form value
                }}
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+\-0-9]{8,15}$/,
                    message: 'Phone number must be 10 digits',
                  },
                })}
                variant="outlined"
                fullWidth
                size="small"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
                         {' '}
            </Grid>
            {/* Employee ID Field */}
            <Grid item xs={12} sm={6} lg={4}>
              <CustomFormLabel htmlFor="employeeId">Employee ID</CustomFormLabel>
              <Controller
                name="employeeId"
                control={control}
                rules={{
                  required: 'Employee ID is required',
                  pattern: {
                    value: /^[A-Z0-9]+$/, // Updated to allow only uppercase alphabets and numbers
                    message: 'Employee ID must contain only uppercase alphabets and numbers', // Updated message
                  },
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    id="employeeId"
                    placeholder="Enter Employee ID"
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase()); // Convert to uppercase before updating RHF state
                    }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={!!errors.employeeId}
                    helperText={errors.employeeId?.message}
                  />
                )}
              />
            </Grid>
                        {/* Password Field */}           {' '}
            <Grid item xs={12} sm={6} lg={4}>
                            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>         
                 {' '}
              <Box sx={{ position: 'relative' }}>
                               {' '}
                <CustomTextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@?+\-$])/,
                      message:
                        'Please enter atleast one capital letter, small letter, special character and atleast one number',
                    },
                  })}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                               {' '}
                <Box sx={{ position: 'absolute', top: 0, right: 1 }}>
                                   {' '}
                  <IconButton onClick={handlePasswordVisibility}>
                                       {' '}
                    {showPassword == false ? (
                      <Visibility sx={{ color: '#42a5f5' }} />
                    ) : (
                      <VisibilityOff sx={{ color: 'red', opacity: 0.6 }} />
                    )}
                                     {' '}
                  </IconButton>
                                 {' '}
                </Box>
                             {' '}
              </Box>
                         {' '}
            </Grid>
                        {/* Department Field */}           {' '}
            <Grid item xs={12} sm={6} lg={4}>
                            <CustomFormLabel htmlFor="department">Department</CustomFormLabel>     
                     {' '}
              <FormControl
                fullWidth
                size="small"
                error={!!errors.department} // Highlight red when there's an error
              >
                               {' '}
                <Controller
                  name="department"
                  control={control}
                  defaultValue={['']}
                  rules={{ required: 'Department is required' }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      id="department"
                      multiple
                      value={field.value || []} // Use field.value directly
                      onChange={(event) => {
                        const filteredValue = event.target.value.filter((val) => val !== ''); // Remove placeholder
                        field.onChange(filteredValue); // Update react-hook-form state
                      }}
                    >
                                           {' '}
                      <MenuItem value="" disabled>
                                                Select Department                      {' '}
                      </MenuItem>
                                           {' '}
                      {departments.map((department) =>
                        Object.entries(department).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                                                        {value}                         {' '}
                          </MenuItem>
                        )),
                      )}
                                         {' '}
                    </CustomSelect>
                  )}
                />
                                <FormHelperText>{errors.department?.message}</FormHelperText>       
                     {' '}
              </FormControl>
                         {' '}
            </Grid>
                        {/* Actions */}           {' '}
            <Grid item xs={12}>
                           {' '}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                               {' '}
                <LoadingButton
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                                    Add User                {' '}
                </LoadingButton>
                               {' '}
                <Button
                  disabled={isSubmitting}
                  variant="outlined"
                  color="secondary"
                  type="reset"
                  onClick={() => navigate(`/${userType}/users`)}
                >
                                    Cancel                {' '}
                </Button>
                             {' '}
              </Stack>
                         {' '}
            </Grid>
                     {' '}
          </Grid>
                 {' '}
        </form>
             {' '}
      </ParentCard>
         {' '}
    </PageContainer>
  );
};
export default AddUser;
