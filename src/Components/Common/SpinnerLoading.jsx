import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerLoading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner color="primary" />
    </div>
  );
};

export default SpinnerLoading;