import BlankLayout from '@/layouts/blank/BlankLayout';
import { Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Error from '@/pages/error/Error';

const Router = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/', element: <Navigate to="/login" /> },
      { path: '/login', element: <Login /> },

      { path: '/error/404', element: <Error /> },
      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
];
export default Router;
