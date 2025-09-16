import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toaster = () => {
  return (
    <ToastContainer position="top-right" autoClose={3000} />
  )
}

export default Toaster