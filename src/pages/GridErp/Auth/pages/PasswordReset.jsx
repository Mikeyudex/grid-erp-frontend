import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Container, Input, Label, Row, Button } from 'reactstrap';

import AuthSlider from '../../../AuthenticationInner/authCarousel';
import { validateEmail } from '../helpers/validations_helper';
import { FooterQuality } from '../components/Footer';
import AlertCustom from '../../commons/AlertCustom';
import { AuthHelper } from '../helpers/auth_helper';

const authHelper = new AuthHelper();

const PasswordReset = () => {
    document.title = "Recuperar contraseña | ERP Quality";

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [messsageAlert, setMessageAlert] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState('success');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const cleanForm = () => {
        setFormData({ email: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsOpenModal(false);
        setMessageAlert('');
        setTypeModal('success');
        if (!validateInputs()) return;
        setLoading(true);

        try {
            const response = await authHelper.requestPasswordReset(formData);
            if (response?.error) {
                setMessageAlert(response?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
            } else {
                setMessageAlert(response?.message);
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
            cleanForm();
        }
    };

    const validateInputs = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'email es requerido';
        }
        if (!validateEmail(formData.email)) {
            newErrors.email = 'email no válido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                                    <Row className="g-0">
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
                                                <h5 className="text-primary">Olvidaste la contraseña?</h5>
                                                <p className="text-muted">Recuperar contraseña con ERP Quality</p>

                                                <div className="mt-2 text-center">
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/rhvddzym.json"
                                                        trigger="loop"
                                                        colors="primary:#8c68cd"
                                                        className="avatar-xl"
                                                        style={{ width: "120px", height: "120px" }}>
                                                    </lord-icon>
                                                </div>

                                                <div className="alert border-0 alert-info text-center mb-2 mx-2" role="alert">
                                                    Ingresa tu correo y te enviaremos instrucciones para recuperar tu contraseña!
                                                </div>

                                                <div className="mt-4">
                                                    <form >

                                                        <div className="mb-3">
                                                            <Label htmlFor="email" className="form-label">Correo</Label>
                                                            <Input
                                                                value={formData.email}
                                                                type="text"
                                                                className="form-control"
                                                                id="email"
                                                                placeholder="@quality.co"
                                                                onChange={handleChange}
                                                                name='email'
                                                            />
                                                            {errors.email && (<span className="fs-12" style={{ color: "#f18275" }}>{errors.email}</span>)}
                                                        </div>

                                                        <div className="mt-4">
                                                            <Button
                                                                color="primary"
                                                                className="w-100"
                                                                type="button"
                                                                onClick={handleSubmit}
                                                            >{loading ? "Cargando..." : "Enviar link de recuperación"}
                                                            </Button>
                                                        </div>

                                                    </form>
                                                </div>

                                                <div className="mt-5 text-center">
                                                    <p className="mb-0">Espera, recuerdo mi contraseña <a href="#" onClick={() => navigate('/auth-signin')} className="fw-semibold text-primary text-decoration-underline"> Iniciar sesión</a> </p>
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
        </React.Fragment>
    );
};

export default PasswordReset;