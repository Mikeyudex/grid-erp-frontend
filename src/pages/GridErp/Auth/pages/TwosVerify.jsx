import React, { useEffect, useState } from 'react';
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

    const moveToNext = (index, event) => {
        const input = getInputElement(index);

        if (event.key === "Backspace") {
            // Si el input actual está vacío, mover foco al anterior
            if (input.value === "" && index > 1) {
                const prevInput = getInputElement(index - 1);
                prevInput.focus();
                prevInput.value = ""; // opcional: limpiar por si tenía algo
                setOtp(otp.slice(0, -1));
            } else {
                input.value = "";
                setOtp(otp.slice(0, -1));
            }
            return;
        }

        // Si se escribió un dígito, avanzar al siguiente
        if (input.value.length === 1) {
            if (index < 6) {
                getInputElement(index + 1).focus();
                setOtp(otp.concat(input.value));
            } else {
                input.blur();
                let _otp = otp.concat(input.value);
                setOtp(_otp);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsOpenModal(false);
        setMessageAlert('');
        setLoading(true);
        try {
            const response = await authHelper.verifyOtp({ otp: otp, email: localStorage.getItem('userEmail') });
            const data = await response?.json();
            if (!response.ok) {
                setMessageAlert(response.statusText);
                setIsOpenModal(true);
                setTypeModal('danger');
            } else {
                let isValid = data?.data?.isValid;
                if (isValid) {
                    setMessageAlert(data?.message);
                    setIsOpenModal(true);
                    setTypeModal('success');
                    return setTimeout(() => {
                        navigate('/home');
                    }, 2000);
                } else {
                    setMessageAlert(data?.message);
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

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit(event);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSubmit]);

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
                                                                        onKeyUp={(e) => moveToNext(1, e)}
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
                                                                        onKeyUp={(e) => moveToNext(2, e)}
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
                                                                        onKeyUp={(e) => moveToNext(3, e)}
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
                                                                        onKeyUp={(e) => moveToNext(4, e)}
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
                                                                        onKeyUp={(e) => moveToNext(5, e)}
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
                                                                        onKeyUp={(e) => moveToNext(6, e)}
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