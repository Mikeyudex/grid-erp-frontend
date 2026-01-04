import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import { validateToken } from "../helpers/jwt-token-access/validate-token";
import SpinnerLoading from '../Components/Common/SpinnerLoading';
import { ResourceProtected } from "./ResourceProtected";


const AuthProtected = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const valid = await validateToken();
      setIsValid(valid);
      setLoading(false);
    };
    checkToken();
  }, []);

  if (loading) return <SpinnerLoading />;

  return isValid ? <>{children}</> : <Navigate to="/auth-signin" replace />;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

const AuthAndResourceProtected = ({ children }) => {
  return (
    <AuthProtected>
      <ResourceProtected>
        {children}
      </ResourceProtected>
    </AuthProtected>
  );
};

export { AuthProtected, AccessRoute, AuthAndResourceProtected };