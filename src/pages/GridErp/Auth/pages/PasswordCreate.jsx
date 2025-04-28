import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Container, Input, Row, Button } from 'reactstrap';

import AuthSlider from '../../../AuthenticationInner/authCarousel';
import { validatePassword } from '../helpers/validations_helper';
import { FooterQuality } from '../components/Footer';
import AlertCustom from '../../commons/AlertCustom';

const PasswordCreate = () => {
    document.title = "Crear contraseña | ERP Quality";

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        passwordConfirm: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [messsageAlert, setMessageAlert] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState('success');

    const token = useRef(window.location.search.split('token=')[1]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const cleanForm = () => {
        setFormData({ password: '', passwordConfirm: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsOpenModal(false);
        setMessageAlert('');
        setTypeModal('success');
        if (!validateInputs()) return;
        setLoading(true);

        try {
            const response = await fetch(`${URL_BASE_API}${RESET_PASSWORD}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        token: token.current,
                        newPassword: formData.passwordConfirm,
                    }
                ),
            });
            const data = await response.json();
            if (data?.error) {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
            } else {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('success');
                setTimeout(() => {
                    return navigate('/auth-signin');
                }, 3000);
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
        if (!formData.password || !formData.passwordConfirm) {
            newErrors.password = 'Faltan datos';
        }
        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = 'Las contraseñas no coinciden';
        }

        if (!validatePassword(formData.passwordConfirm)) {
            newErrors.passwordConfirm = `
            Contraseña debe contener: \n
            - Al menos 6 caracteres \n
            - Al menos una letra minúscula \n
            - Al menos una letra mayúscula \n
            - Al menos un número \n
            - Al menos un caracter especial
            `;
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
                                                <h5 className="text-primary">Crear nueva contraseña</h5>
                                                <p className="text-muted">Crear nueva contraseña con ERP Quality</p>

                                                <div className="mt-4">
                                                    <form >
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="password-input">Contraseña <span className="text-danger">*</span></label>
                                                            <div className="position-relative auth-pass-inputgroup">
                                                                <Input
                                                                    type={"text"}
                                                                    className="form-control pe-5 password-input mb-2"
                                                                    placeholder="Escriba su contraseña"
                                                                    id="password-input-1"
                                                                    name="password"
                                                                    value={formData.password}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.password && (<span className="fs-12" style={{ color: "#f18275" }}>{errors.password}</span>)}
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="password-input">Confirmar contraseña <span className="text-danger">*</span></label>
                                                            <div className="position-relative auth-pass-inputgroup">
                                                                <Input
                                                                    type={"text"}
                                                                    className="form-control pe-5 password-input mb-2"
                                                                    placeholder="Confirme su contraseña"
                                                                    id="password-input-2"
                                                                    name="passwordConfirm"
                                                                    value={formData.passwordConfirm}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.passwordConfirm && (<span className="fs-12" style={{ color: "#f18275" }}>{errors.passwordConfirm}</span>)}
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <Button
                                                                color="primary"
                                                                className="w-100"
                                                                type="button"
                                                                onClick={handleSubmit}
                                                            >{loading ? "Cargando..." : "Crear contraseña"}
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </div>

                                                <div className="mt-5 text-center">
                                                    <p className="mb-0">Espera, recuerdo mi contraseña <a href="/auth-signin" className="fw-semibold text-primary text-decoration-underline"> Iniciar sesión</a> </p>
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

export default PasswordCreate;