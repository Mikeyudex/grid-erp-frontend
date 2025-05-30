import React from "react";
import { Col } from "reactstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

//import logo
import logo from "../../assets/images/logo-quality.jpeg";
import logo2 from "../../assets/images/logo-quality-2.png";

const AuthSlider = () => {
    return (
        <React.Fragment>

            <Col lg={6}>
                <div className="p-lg-5 p-4 auth-one-bg h-100">
                    <div className="bg-overlay"></div>
                    <div className="position-relative h-100 d-flex flex-column">
                        <div className="mb-4">
                            <Link to="/dashboard" className="d-block">
                                <img style={{
                                    width: "466px",
                                    height: "200px",
                                    marginTop: "2rem",
                                    maxWidth:"100%",
                                    objectFit: "contain"
                                }} src={logo2} alt="" height="26" />
                            </Link>
                        </div>
                    </div>
                </div>
            </Col>
        </React.Fragment >
    );
};

export default AuthSlider;