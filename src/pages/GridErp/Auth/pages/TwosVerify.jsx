import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Row } from 'reactstrap';

//import images
import AuthSlider from '../../../AuthenticationInner/authCarousel';
import { FooterQuality } from '../components/Footer';
import AlertCustom from '../../commons/AlertCustom';
import { AuthHelper } from '../helpers/auth_helper';

const authHelper = new AuthHelper();

const TwosVerify = () => {
    document.title = "Código de verificación | ERP Quality";

    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [messsageAlert, setMessageAlert] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState('success');

    const getInputElement = (index) => {
        return document.getElementById(`digit${index}-input`);
    }

    const moveToNext = (index) => {
        if (index === 1 && getInputElement(index).value.length === 0) {
            setOtp('');
        }
        if (getInputElement(index).value.length === 1) {
            if (index !== 6) {
                getInputElement(index + 1).focus();
                setOtp(otp.concat(getInputElement(index).value));
            } else {
                getInputElement(index).blur();
                let _otp = otp.concat(getInputElement(index).value);
                setOtp(_otp);
            }
        } else if (getInputElement(index).value.length === 0) {
            setOtp(otp.slice(0, -1));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsOpenModal(false);
        setMessageAlert('');
        setLoading(true);
        try {
            const response = await authHelper.verifyOtp({ otp: otp, email: localStorage.getItem('userEmail') });
            if (response?.error) {
                setMessageAlert(response?.error);
                setIsOpenModal(true);
                setTypeModal('danger');
            } else {
                let isValid = response?.data?.isValid;
                if (isValid) {
                    setMessageAlert(response?.message);
                    setIsOpenModal(true);
                    setTypeModal('success');
                    return setTimeout(() => {
                        navigate('/home');
                    }, 2000);
                } else {
                    setMessageAlert(response?.message);
                    setIsOpenModal(true);
                    setTypeModal('danger');
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            setMessageAlert('Error interno');
            setIsOpenModal(true);
            setTypeModal('danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="bg-overlay"></div>
                <div className="auth-page-content overflow-hidden pt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <Card className="overflow-hidden card-bg-fill border-0 card-border-effect-none">
                                    <Row className="justify-content-center g-0">
                                        <AuthSlider />

                                        <Col lg={6}>
                                            {
                                                isOpenModal && (
                                                    <AlertCustom
                                                        messsageAlert={messsageAlert}
                                                        typeAlert={typeModal}
                                                        isOpen={isOpenModal}
                                                    />
                                                )
                                            }
                                            <div className="p-lg-5 p-4">
                                                <div className="mb-4">
                                                    <div className="avatar-lg mx-auto">
                                                        <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                                                            <i className="ri-smartphone-line"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-muted text-center mx-lg-3">
                                                    <h4 className="">Código de verificación</h4>
                                                    <p>Introducir el código de acceso generado por la aplicación de autenticación</p>
                                                </div>

                                                <div className="mt-4">
                                                    <form>
                                                        <Row>
                                                            <Col className="col-2">
                                                                <div className="mb-3">
                                                                    <label htmlFor="digit1-input" className="visually-hidden">Digit 1</label>
                                                                    <input type="number"
                                                                        className="form-control form-control-lg bg-light text-center"
                                                                        maxLength="1"
                                                                        id="digit1-input"
                                                                        onKeyUp={() => moveToNext(1)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col className="col-2">
                                                                <div className="mb-3">
                                                                    <label htmlFor="digit2-input" className="visually-hidden">Digit 2</label>
                                                                    <input type="number"
                                                                        className="form-control form-control-lg bg-light text-center"
                                                                        maxLength="1"
                                                                        id="digit2-input"
                                                                        onKeyUp={() => moveToNext(2)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col className="col-2">
                                                                <div className="mb-3">
                                                                    <label htmlFor="digit3-input" className="visually-hidden">Digit 3</label>
                                                                    <input type="number"
                                                                        className="form-control form-control-lg bg-light text-center"
                                                                        maxLength="1"
                                                                        id="digit3-input"
                                                                        onKeyUp={() => moveToNext(3)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col className="col-2">
                                                                <div className="mb-3">
                                                                    <label htmlFor="digit4-input" className="visually-hidden">Digit 4</label>
                                                                    <input type="number"
                                                                        className="form-control form-control-lg bg-light text-center"
                                                                        maxLength="1"
                                                                        id="digit4-input"
                                                                        onKeyUp={() => moveToNext(4)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col className="col-2">
                                                                <div className="mb-3">
                                                                    <label htmlFor="digit5-input" className="visually-hidden">Digit 5</label>
                                                                    <input type="number"
                                                                        className="form-control form-control-lg bg-light text-center"
                                                                        maxLength="1"
                                                                        id="digit5-input"
                                                                        onKeyUp={() => moveToNext(5)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col className="col-2">
                                                                <div className="mb-3">
                                                                    <label htmlFor="digit6-input" className="visually-hidden">Digit 6</label>
                                                                    <input type="number"
                                                                        className="form-control form-control-lg bg-light text-center"
                                                                        maxLength="1"
                                                                        id="digit6-input"
                                                                        onKeyUp={() => moveToNext(6)}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <div className="mt-3">
                                                            <Button
                                                                disabled={loading}
                                                                onClick={handleSubmit}
                                                                color="primary"
                                                                className="w-100"
                                                            >{loading ? "Cargando..." : "Verificar"}</Button>
                                                        </div>

                                                    </form>

                                                </div>

                                                <div className="mt-5 text-center">
                                                    <p className="mb-0"><Link to="/auth-activate-otp" className="fw-semibold text-primary text-decoration-underline">Habilitar autenticación de dos pasos</Link> </p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                        </Row>
                    </Container>
                </div>
                <FooterQuality />
            </div>
        </React.Fragment >
    );
};

export default TwosVerify;