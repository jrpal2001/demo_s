import Spinner from '@/components/common/spinner/Spinner';
import PageContainer from '@/components/container/PageContainer';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid, MenuItem, IconButton, Typography, styled, Avatar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { userEdit, userView } from '@/api/admin';
import { departments } from '@/data/departments';
import userimg from '@/assets/images/profile/user-1.jpg';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const EditUser = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [isLoading] = useState(false);
  const [initialData, setInitialData] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm({
    defaultValues: {},
  });
  const fileInputRef = useRef(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
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
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/users`, title: 'Users' },
    { title: 'Edit' },
  ];
  const fetchData = async () => {
    try {
      const response = await userView(id);
      setInitialData(response.data);
      reset({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phoneNumber: response.data.phoneNumber || '',
        employeeId: response.data.employeeId || '',
        department: response.data.department?.map((dept) => dept.deptName) || [], // ...other fields if needed
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  async function onSubmit(data) {
    const changedFields = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== '' && data[key] !== undefined) {
        if (key === 'fullName' || key === 'email' || key === 'employeeId') {
          changedFields[key] = data[key];
        } else if (
          key == 'department' &&
          JSON.stringify(changedFields[key]) !==
            JSON.stringify(initialData[key].map((dept) => dept.deptName))
        ) {
          changedFields[key] = data[key];
        } else if (key !== 'department' && data[key] !== initialData[key]) {
          changedFields[key] = data[key];
        }
      }
    });
    if (Object.keys(changedFields).length == 0 && !profileImageFile) {
      toast.warning('You have not edited anything');
      return;
    }
    if (changedFields.department?.length > 0) {
      const arry = changedFields.department.map((dept) => ({
        deptName: dept,
        subDept: 'HOD',
      }));
      changedFields.department = arry;
    } // Remove userType from payload if present
    if ('userType' in changedFields) {
      delete changedFields.userType;
    }
    try {
      console.log(changedFields);
      const formData = new FormData();
      Object.entries(changedFields).forEach(([key, value]) => {
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
      const response = await userEdit(id, formData);
      console.log('🚀 ~ onSubmit ~ response:', response);
      if (response) {
        toast.success('User updated successfully');
        navigate(`/${userType}/users`);
      }
    } catch (error) {
      if (error.data == 'email') {
        setError('email', { message: 'Email already exists' });
      } else if (error.data == 'phoneNumber') {
        setError('phoneNumber', { message: 'Phone number already exists' });
      } else if (error.data == 'employeeId') {
        setError('employeeId', { message: 'Employee ID already exists' });
      }
    }
  }
  function handlePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setValue('profileImage', file);
    }
  };
  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setImagePreviewUrl(null);
    setValue('profileImage', null);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <PageContainer title="Samurai - Edit User">
            <Breadcrumb title="Edit User" items={BCrumb} />     {' '}
      <ParentCard title="Edit User">
               {' '}
        {isLoading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Image Upload Section */}           {' '}
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
                    {...register('profileImage')}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                                   {' '}
                  <ProfileImage onClick={handleImageClick}>
                                       {' '}
                    <Avatar
                      src={imagePreviewUrl || initialData?.profileImage || userimg}
                      alt={imagePreviewUrl || initialData?.profileImage || userimg}
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
                  {(imagePreviewUrl || initialData?.profileImage) && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={handleRemoveImage}
                    >
                                            Remove Image                    {' '}
                    </Button>
                  )}
                                 {' '}
                </Box>
                             {' '}
              </Grid>
                         {' '}
            </Grid>
                        {/* Form Fields Section */}           {' '}
            <Grid container spacing={3}>
                           {' '}
              <Grid item xs={12} sm={6} md={4}>
                                <CustomFormLabel htmlFor="fullName">Name</CustomFormLabel>
                               {' '}
                <CustomTextField
                  id="fullName"
                  variant="outlined"
                  fullWidth
                  size="small"
                  {...register('fullName', { required: false })}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
                             {' '}
              </Grid>
                           {' '}
              <Grid item xs={12} sm={6} md={4}>
                                <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                               {' '}
                <CustomTextField
                  id="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  {...register('email', {
                    required: false,
                    pattern: {
                      value: /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                             {' '}
              </Grid>
                           {' '}
              <Grid item xs={12} sm={6} md={4}>
                                <CustomFormLabel htmlFor="phoneNumber">Phone</CustomFormLabel>
                               {' '}
                <CustomTextField
                  id="phoneNumber"
                  variant="outlined"
                  fullWidth
                  size="small"
                  {...register('phoneNumber', {
                    required: false,
                    pattern: {
                      value: /^[+0-9][0-9-]{7,}$/,
                      message: 'Please enter a valid mobile number',
                    },
                  })}
                  inputProps={{
                    pattern: '[0-9+-]',
                  }}
                  onInput={(e) => {
                    // Prevent invalid characters from being entered
                    e.target.value = e.target.value.replace(/[^0-9+-]/, '');
                  }}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
                             {' '}
              </Grid>
              {/* Employee ID Field */}
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel htmlFor="employeeId">Employee ID</CustomFormLabel>
                <Controller
                  name="employeeId"
                  control={control}
                  rules={{
                    required: 'Employee ID is required',
                    pattern: {
                      value: /^[A-Z0-9]+$/, // Only uppercase alphabets and numbers
                      message: 'Employee ID must contain only uppercase alphabets and numbers',
                    },
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="employeeId"
                      placeholder="Enter Employee ID"
                      onChange={(e) => {
                        field.onChange(e.target.value.toUpperCase()); // Convert to uppercase
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
                           {' '}
              <Grid item xs={12} sm={6} md={4}>
                                <CustomFormLabel htmlFor="password">Password</CustomFormLabel>     
                         {' '}
                <Box sx={{ position: 'relative' }}>
                                   {' '}
                  <CustomTextField
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="*********"
                    variant="outlined"
                    fullWidth
                    size="small"
                    {...register('password', {
                      required: false,
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{3,}$/,
                        message:
                          'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 3 characters long',
                      },
                    })}
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
                           {' '}
              <Grid item xs={12} sm={6} md={4}>
                                <CustomFormLabel htmlFor="department">Department</CustomFormLabel>
                               {' '}
                <Controller
                  name="department"
                  control={control}
                  rules={{ required: 'At least one department should be selected' }}
                  render={({ field }) => (
                    <CustomSelect
                      id="department"
                      value={
                        field.value ?? initialData?.department.map((dept) => dept.deptName) ?? ['']
                      }
                      multiple
                      fullWidth
                      size="small"
                      {...register('department', { required: false })}
                      onChange={(event) =>
                        field.onChange(() => {
                          if (event.target.value.includes('')) {
                            const array = event.target.value.filter((ar) => ar !== '');
                            return array;
                          }
                          return event.target.value;
                        })
                      }
                      error={!!errors.department}
                    >
                                           {' '}
                      <MenuItem value="" disabled>
                                                Select Department                      {' '}
                      </MenuItem>
                                           {' '}
                      {departments.map((department) => {
                        const [key, value] = Object.entries(department)[0]; // Extract key and value from the object
                        return (
                          <MenuItem value={key} key={key}>
                                                        {value}                         {' '}
                          </MenuItem>
                        );
                      })}
                                         {' '}
                    </CustomSelect>
                  )}
                />
                               {' '}
                {errors.department?.message && (
                  <Typography
                    sx={{
                      color: '#fa896b',
                      margin: '4px 14px 0px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  >
                                        Please select at least one department                  {' '}
                  </Typography>
                )}
                             {' '}
              </Grid>
                           {' '}
              <Grid item xs={12}>
                               {' '}
                <Box display="flex" flexDirection="row-reverse">
                                   {' '}
                  <Button
                    sx={{ marginLeft: '1em' }}
                    type="reset"
                    disabled={isLoading}
                    onClick={() => {
                      navigate(`/${userType}/users`);
                    }}
                  >
                                        Cancel                  {' '}
                  </Button>
                                   {' '}
                  <Button color="error" type="submit" disabled={isLoading}>
                                        Save                  {' '}
                  </Button>
                                 {' '}
                </Box>
                             {' '}
              </Grid>
                         {' '}
            </Grid>
                     {' '}
          </form>
        )}
             {' '}
      </ParentCard>
         {' '}
    </PageContainer>
  );
};
export default EditUser;
