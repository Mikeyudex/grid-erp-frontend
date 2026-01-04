import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import SpinnerLoading from "../Components/Common/SpinnerLoading";
import { validateResourceAccess } from "../helpers/resource-validator";

export const ResourceProtected = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkResourceAccess = async () => {
      setLoading(true);
      const access = await validateResourceAccess(location.pathname);
      setHasAccess(access);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    checkResourceAccess();
  }, [location.pathname]);

  if (loading) {
    return <SpinnerLoading />;
  }

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};