import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Grid, Box, Stack, Typography, Button, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import PageContainer from '@/components/container/PageContainer';
import img1 from '@/assets/images/backgrounds/login-bg.svg';
import Logo from '@/layouts/full/shared/logo/Logo';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import { login } from '@/api/auth';
import { setAuth } from '@/store/auth/AuthSlice';

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  function handlePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  const handleLogin = async (data) => {
    let loginTime;
    try {
      setIsSubmitting(true);
      loginTime = setTimeout(() => {
        toast.warn('Please wait login is taking time');
      }, 3000);
      const response = await login({
        ...data,
        email: data.email.trim(),
      });
      console.log(data.email);

      if (response) {
        dispatch(
          setAuth({
            _id: response.user._id,
            phoneNumber: response.user.phoneNumber,
            email: response.user.email,
            fullName: response.user.fullName,
            userType: response.user.userType,
            isAuthenticated: true,
          }),
        );
        navigate(`/${response.user.userType[0]}/dashboard`);
        toast.success(response.message);
      }
    } catch (err) {
      if (err.statusCode === 403) {
        err.errors.forEach(({ field, message }) => {
          setError(field, {
            type: 'manual',
            message: message,
          });
        });
      }
    } finally {
      clearTimeout(loginTime);
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid container spacing={0} sx={{ overflowX: 'hidden' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={7}
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
              position: 'absolute',
              height: '100%',
              width: '100%',
              opacity: '0.3',
            },
          }}
        >
          <Box position="relative">
            <Box px={3}>
              <Logo />
            </Box>
            <Box
              alignItems="center"
              justifyContent="center"
              height={'calc(100vh - 75px)'}
              sx={{
                display: {
                  xs: 'none',
                  lg: 'flex',
                },
              }}
            >
              <img
                src={img1}
                alt="bg"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} lg={6} xl={5} my={'auto'}>
          <Box p={4}>
            <Typography fontWeight="700" variant="h3" mb={1}>
              Welcome to Samurai
            </Typography>

            <form onSubmit={handleSubmit(handleLogin)}>
              <Stack spacing={2}>
                <Box>
                  <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                  <CustomTextField
                    id="email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Box>
                <Box>
                  <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                  <Box sx={{ position: 'relative' }}>
                    <CustomTextField
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      fullWidth
                      {...register('password', { required: 'Password is required' })}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                    <Box sx={{ position: 'absolute', top: 0, right: 1 }}>
                      <IconButton onClick={handlePasswordVisibility}>
                        {showPassword == false ? (
                          <Visibility sx={{ color: '#42a5f5' }} />
                        ) : (
                          <VisibilityOff sx={{ color: 'red', opacity: 0.6 }} />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center">
                  <Typography
                    component={Link}
                    to="/auth/forgot-password"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Stack>
              </Stack>
              <Box mt={2}>
                <Button color="primary" variant="contained" size="large" fullWidth type="submit">
                  {isSubmitting ? 'Signing In ...' : 'Sign In'}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;
