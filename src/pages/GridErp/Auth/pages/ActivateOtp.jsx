import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Row } from 'reactstrap';

//import images
import AuthSlider from '../../../AuthenticationInner/authCarousel';
import { FooterQuality } from '../components/Footer';
import { GENERATE_QR_OTP, URL_BASE_API } from '../helpers/url_helper';
import { getCookie } from '../../../../helpers/cookies/cookie_helper';
import AlertCustom from '../../commons/AlertCustom';

const ActivateOtp = () => {
    document.title = "Activar código de verificación | ERP Quality";

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [messsageAlert, setMessageAlert] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState('success');
    const [qrCode, setQrCode] = useState('');

    const handleReturnToValidateOtp = () => {
        return navigate('/auth-otp');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsOpenModal(false);
        setMessageAlert('');
        const userEmail = localStorage.getItem('userEmail');
        setLoading(true);
        try {
            const response = await fetch(`${URL_BASE_API}${GENERATE_QR_OTP}/${userEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (data?.error) {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
            } else {
                let qrCode = data?.data?.qrcode;
                setQrCode(qrCode);
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('success');
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

    /* useEffect(() => {
        const cookieValue = getCookie('jwt-quality');
        if (!cookieValue) {
            setTimeout(() => {
                navigate('/auth-signin');
            }, 2000);
        }
    }, []); */

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
                                            <AlertCustom
                                                messsageAlert={messsageAlert}
                                                typeAlert={typeModal}
                                                isOpen={isOpenModal}
                                            />
                                            <div className="p-lg-5 p-4">
                                                <div className="mb-4">
                                                    <div className="avatar-lg mx-auto">
                                                        <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                                                            <i className="ri-lock-password-line"></i>
                                                        </div>
                                                    </div>
                                                </div>


                                                {
                                                    qrCode ? (
                                                        <div className="text-muted text-center mx-lg-3">
                                                            <div className='qrCode'>
                                                                <h4 className="">QR generado</h4>
                                                                <p className='pt-2'>Escanea este código QR en Google Authenticator o en otro aplicación de autenticación para generar códigos de inicio de sesión.</p>
                                                                <img className='mt-2' id='qrCode' src={qrCode} alt='qrCode' />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="text-muted text-center mx-lg-3">
                                                                <h4 className="">Autenticación de dos pasos</h4>
                                                                <p>La autenticación de dos pasos es una capa adicional de protección para tu cuenta de Backoffice.</p>
                                                                <p className='pt-2'>Cuando inicies sesión, ademas de tu correo electrónico y contraseña deberás ingresar un código de seguridad que se genere en una aplicación de autenticación.</p>
                                                            </div>
                                                        </>
                                                    )
                                                }

                                                <div className="mt-4">
                                                    <form>
                                                        <div className="mt-3">
                                                            {
                                                                qrCode ? (
                                                                    <Button
                                                                        onClick={handleReturnToValidateOtp}
                                                                        color="primary"
                                                                        className="w-100"
                                                                    >Continuar</Button>
                                                                )
                                                                    : (
                                                                        <Button
                                                                            disabled={loading}
                                                                            onClick={handleSubmit}
                                                                            color="primary"
                                                                            className="w-100"
                                                                        >{loading ? "Generando..." : "Habilitar autenticación de dos pasos"}</Button>
                                                                    )
                                                            }
                                                        </div>
                                                    </form>
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

export default ActivateOtp;