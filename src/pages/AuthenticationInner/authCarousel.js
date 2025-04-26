import React from "react";
import { Col } from "reactstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

//import logo
import logo from "../../assets/images/logo-quality.jpeg";

const AuthSlider = () => {
    return (
        <React.Fragment>

            <Col lg={6}>
                <div className="p-lg-5 p-4 auth-one-bg h-100">
                    <div className="bg-overlay"></div>
                    <div className="position-relative h-100 d-flex flex-column">
                        <div className="mb-4">
                            <Link to="/dashboard" className="d-block">
                                <img src={logo} alt="" height="26" />
                            </Link>
                        </div>
                        <div className="mt-auto">
                           {/*  <div className="mb-3">
                                <i className="ri-double-quotes-l display-4 text-success"></i>
                            </div> */}

                            {/* <Carousel showThumbs={false} autoPlay={true} showArrows={false} showStatus={false} infiniteLoop={true} className="carousel slide" id="qoutescarouselIndicators" >
                                <div className="carousel-inner text-center text-white pb-5">
                                    <div className="item">
                                        <p className="fs-15 fst-italic">" Galilea será el banco digital líder de inclusión financiera en Colombia y Latinoamérica. "</p>
                                    </div>
                                </div>
                                <div className="carousel-inner text-center text-white pb-5">
                                    <div className="item">
                                        <p className="fs-15 fst-italic">" Estamos cambiando la manera en la que te relacionas con los servicios financieros. "</p>
                                    </div>
                                </div>
                                <div className="carousel-inner text-center text-white pb-5">
                                    <div className="item">
                                        <p className="fs-15 fst-italic">" Dentro de nuestros objetivos a la sociedad, es seguramente uno de los más ambiciosos. "</p>
                                    </div>
                                </div>
                            </Carousel> */}
                        </div>
                    </div>
                </div>
            </Col>
        </React.Fragment >
    );
};

export default AuthSlider;