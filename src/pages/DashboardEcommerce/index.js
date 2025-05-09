import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Widget from "./Widgets";
import BestSellingProducts from "./BestSellingProducts";
import RecentActivity from "./RecentActivity";
import RecentOrders from "./RecentOrders";
import Revenue from "./Revenue";
import SalesByLocations from "./SalesByLocations";
import Section from "./Section";
import StoreVisits from "./StoreVisits";
import TopSellers from "./TopSellers";

const DashboardEcommerce = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
           
          <h1 className="mb-4">Ecommerce Dashboard</h1>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
