import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Col, Container, Input, Label, Row, Button } from 'reactstrap';

import AuthSlider from '../../../AuthenticationInner/authCarousel';
import { SIGN_IN, BASE_URL_API } from '../helpers/auth_url_helper';
import { validateEmail } from '../helpers/validations_helper';
import { FooterQuality } from '../components/Footer';
import { IndexedDBService } from '../../../../helpers/indexedDb/indexed-db-helper';
import AlertCustom from '../../commons/AlertCustom';
import { getResourcesByRole } from '../../../../helpers/api_helper';
import { AuthHelper } from '../helpers/auth_helper';

const indexedDBService = new IndexedDBService();
const authHelper = new AuthHelper();

const SignIn = () => {
    document.title = "Login | ERP Quality";

    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setFormData({ email: '', password: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsOpenModal(false);
        setMessageAlert('');
        setTypeModal('success');
        if (!validateInputs()) return;
        setLoading(true);

        try {
            const response = await authHelper.login(formData);

            if (response?.error) {
                setMessageAlert(response?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
            } else {
                if (!response?.data?.access_token) {
                    throw new Error('Error al autenticar');
                }
                let token = response?.data?.access_token;
                //guardar el token en una cookie
                document.cookie = `jwt-quality=${token}`;
                let user = response?.data?.user;
                localStorage.setItem('userId', user?.id);
                localStorage.setItem('userEmail', user?.email);

                setMessageAlert(response?.message);
                setIsOpenModal(true);
                setTypeModal('success');

                let roleId = user?.role?._id;

                let resources = await getResourcesByRole(roleId);
                if (resources) {
                    user.resources = resources;
                }
                indexedDBService.addItem(user)
                    .then(() => {
                        console.log('User added to IndexedDB');
                    })
                    .catch(error => {
                        console.log(error);
                    });

                if (!user?.activeOtp) {
                    return setTimeout(() => {
                        navigate('/auth-activate-otp');
                    }, 3000);
                }

                setTimeout(() => {
                    return navigate('/auth-otp');
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
        if (!formData.email) {
            newErrors.email = 'email es requerido';
        }
        if (!validateEmail(formData.email)) {
            newErrors.email = 'email no válido';
        }
        if (!formData.password) {
            newErrors.password = 'contraseña es requerida';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    document.title = "Login | ERP Quality";
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
                                                <div>
                                                    <h5 className="text-primary">Bienvenido de nuevo !</h5>
                                                    <p className="text-muted">Inicie sesión para continuar en Backoffice Quality.</p>
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

                                                        <div className="mb-3">
                                                            <div className="float-end">
                                                                <Link to="/auth-forgot-password" className="text-muted">Olvidaste tu contraseña?</Link>
                                                            </div>
                                                            <Label className="form-label" htmlFor="password-input">Contraseña</Label>
                                                            <div className="position-relative auth-pass-inputgroup mb-3">
                                                                <Input
                                                                    onChange={handleChange}
                                                                    value={formData.password}
                                                                    name='password'
                                                                    type={passwordShow ? "password" : "text"}
                                                                    className="form-control pe-5 password-input"
                                                                    placeholder="contraseña"
                                                                    id="password-input" />
                                                                <button onClick={() => setPasswordShow(!passwordShow)} className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon"><i className="ri-eye-fill align-middle"></i></button>
                                                                {errors.password && (<span className="fs-12" style={{ color: "#f18275" }}>{errors.password}</span>)}
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <Button
                                                                color="primary"
                                                                className="w-100"
                                                                type="button"
                                                                onClick={handleSubmit}
                                                            >{loading ? "Cargando..." : "Ingresar"}
                                                            </Button>
                                                        </div>

                                                    </form>
                                                </div>

                                                <div className="mt-5 text-center">
                                                    <p className="mb-0">Ya tienes una cuenta ? <a onClick={() => navigate("/auth-signup")} href="#" className="fw-semibold text-primary text-decoration-underline"> Crear cuenta</a> </p>
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

export default SignIn;