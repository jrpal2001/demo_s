import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setupInterceptors } from "@/utils/axios";

const InterceptorSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setupInterceptors(navigate, dispatch);
  }, [navigate, dispatch]);

  return null;
};

export default InterceptorSetup;
