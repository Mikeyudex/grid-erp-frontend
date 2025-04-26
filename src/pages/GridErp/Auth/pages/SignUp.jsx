import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row, Form, Input, Button } from 'reactstrap';

import AuthSlider from '../../../AuthenticationInner/authCarousel';
import { validateEmail, validatePassword, validatePhone } from '../helpers/validations_helper';
import { SIGN_UP, baseUrl } from '../helpers/url_helper';
import { FooterQuality } from '../components/Footer';
import AlertCustom from '../../commons/AlertCustom';


const SignUp = () => {
    document.title = "Registrar cuenta | ERP Quality";

    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        documento: "",
        email: "",
        phone: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [messsageAlert, setMessageAlert] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState('success');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateInputs = () => {
        const newErrors = {};
        const data = formData;
        if (!data.documento) {
            newErrors.documento = 'Documento es requerido';
        }
        if (!data.email) {
            newErrors.email = 'Email es requerido';
        }
        if (!validateEmail(data.email)) {
            newErrors.email = 'Email no válido';
        }
        if (!data.phone) {
            newErrors.phone = 'Teléfono es requerido';
        }
        if (!validatePhone(data.phone)) {
            newErrors.phone = 'Teléfono no válido';
        }
        if (!data.lastname) {
            newErrors.lastname = 'Apellido es requerido';
        }
        if (!data.name) {
            newErrors.name = 'Nombre es requerido';
        }
        if (!data.password) {
            newErrors.password = 'Contraseña es requerida';
        }
        if (!validatePassword(data.password)) {
            newErrors.password = `
            Contraseña debe contener: \n
            - Al menos 6 caracteres \n
            - Al menos una letra minúscula \n
            - Al menos una letra mayúscula \n
            - Al menos un número \n
            - Al menos un caracter especial
            `;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
    };

    const handleSubmit = async () => {
        if (!validateInputs()) return;
        setIsOpenModal(false);
        setMessageAlert('');
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}${SIGN_UP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.status === 400) {
                let messages = data?.errors;
                let messageParsed = messages.map((item) => { return item.message });
                setMessageAlert(messageParsed.join('\n'));
                setIsOpenModal(true);
                setTypeModal('danger');
                return;
            }
            if (data?.error) {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
            } else {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('success');
                return setTimeout(() => {
                    navigate('/auth-signin');
                }, 2000);
            }
        } catch (error) {
            setMessageAlert('Error al crear la cuenta');
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
                                <Card className="overflow-hidden m-0 card-bg-fill border-0 card-border-effect-none">
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
                                                <div>
                                                    <h5 className="text-primary">Registrar Cuenta</h5>
                                                    <p className="text-muted">Backoffice Quality</p>
                                                </div>

                                                <div className="mt-4">
                                                    <Form noValidate action="index">

                                                        <div className="mb-3">
                                                            <label htmlFor="documento" className="form-label">Documento <span className="text-danger">*</span></label>
                                                            <input
                                                                onChange={handleChange}
                                                                value={formData.documento}
                                                                name='documento'
                                                                type="number"
                                                                className="form-control"
                                                                id="documento"
                                                                placeholder="#"
                                                                required
                                                                invalid={errors.documento ? true : false}
                                                            />
                                                            <div className="invalid-feedback">
                                                                Ingrese su documento
                                                            </div>
                                                            {errors.documento && (
                                                                <span style={{ color: "#f18275" }}>{errors.documento}</span>
                                                            )}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                                                            <input
                                                                onChange={handleChange}
                                                                value={formData.email}
                                                                name='email'
                                                                type="email"
                                                                className="form-control"
                                                                id="email"
                                                                placeholder="@quality.co"
                                                                required
                                                                invalid={errors.email ? true : false}
                                                            />

                                                            {errors.email && (
                                                                <span className="fs-12" style={{ color: "#f18275" }}>{errors.email}</span>
                                                            )}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="phone" className="form-label">Teléfono <span className="text-danger">*</span></label>
                                                            <input
                                                                onChange={handleChange}
                                                                value={formData.phone}
                                                                name='phone'
                                                                type="number"
                                                                className="form-control"
                                                                id="phone"
                                                                placeholder="+57"
                                                                required
                                                                invalid={errors.phone ? true : false}
                                                            />
                                                            {errors.phone && (
                                                                <span className="fs-12" style={{ color: "#f18275" }}>{errors.phone}</span>
                                                            )}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="name" className="form-label">Nombre <span className="text-danger">*</span></label>
                                                            <input
                                                                onChange={handleChange}
                                                                value={formData.name}
                                                                name='name'
                                                                type="text"
                                                                className="form-control"
                                                                id="name"
                                                                placeholder="nombre"
                                                                required
                                                                invalid={true}
                                                            />
                                                            <div className="invalid-feedback">
                                                                Ingrese su nombre
                                                            </div>
                                                            {errors.name && (
                                                                <span className="fs-12" style={{ color: "#f18275" }}>{errors.name}</span>
                                                            )}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="lastname" className="form-label">Apellidos <span className="text-danger">*</span></label>
                                                            <input
                                                                onChange={handleChange}
                                                                value={formData.lastname}
                                                                name='lastname'
                                                                type="text"
                                                                className="form-control"
                                                                id="lastname"
                                                                placeholder="apellidos"
                                                                required
                                                                invalid={errors.lastname ? true : false}
                                                            />
                                                            {errors.lastname && (
                                                                <span className="fs-12" style={{ color: "#f18275" }}>{errors.lastname}</span>
                                                            )}
                                                        </div>


                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="password-input">Contraseña <span className="text-danger">*</span></label>
                                                            <div className="position-relative auth-pass-inputgroup">
                                                                <Input
                                                                    type={passwordShow ? "text" : "password"}
                                                                    className="form-control pe-5 password-input"
                                                                    placeholder="Ingrese su contraseña"
                                                                    id="password-input"
                                                                    name="password"
                                                                    value={formData.password}
                                                                    onChange={handleChange}
                                                                />
                                                                {
                                                                    errors.password && (
                                                                        <div className="p-3 mt-2 bg-light mb-2 rounded password-contain">
                                                                            <h5 className="fs-13">Contraseña debe contener:</h5>
                                                                            <p className="invalid fs-12 mb-2" style={{ color: "#f18275" }}>Al menos <b>8 caracteres</b></p>
                                                                            <p className="invalid fs-12 mb-2" style={{ color: "#f18275" }}>Al menos una letra minúscula <b>a-z</b></p>
                                                                            <p className="invalid fs-12 mb-2" style={{ color: "#f18275" }}>Al menos una letra mayúscula <b>A-Z</b></p>
                                                                            <p className="invalid fs-12 mb-2" style={{ color: "#f18275" }}>Al menos un número <b>0-9</b></p>
                                                                            <p className="invalid fs-12 mb-2" style={{ color: "#f18275" }}>Al menos un caracter especial</p>
                                                                        </div>
                                                                    )
                                                                }
                                                                <Button color="link" onClick={() => setPasswordShow(!passwordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button"
                                                                    id="password-addon"><i className="ri-eye-fill align-middle"></i></Button>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <button
                                                                className="btn btn-primary w-100"
                                                                type="button"
                                                                onClick={handleSubmit}
                                                            >{loading ? "Cargando..." : "Crear cuenta"}
                                                            </button>
                                                        </div>
                                                    </Form>
                                                </div>

                                                <div className="mt-3 pt-1 text-center">
                                                    <p className="mb-0">Ya tienes una cuenta ? <Link to="/auth-signin" className="fw-semibold text-primary text-decoration-underline"> Ingresar</Link> </p>
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

export default SignUp;