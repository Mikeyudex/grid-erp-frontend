import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import classnames from "classnames";

//import images
import avatar1 from '../../../../assets/images/users/user-dummy-img.jpg';
import { IndexedDBService } from '../../../../helpers/indexedDb/indexed-db-helper';
import { capitalizeFirstLetter, homologateRole } from '../../../../helpers/transform_helper';
import * as url from '../../../../helpers/url_helper';
import AlertCustom from '../../commons/AlertCustom';
import { validateEmail, validateEmailDomain } from '../../Auth/helpers/validations_helper';
import { getToken } from '../../../../helpers/jwt-token-access/get_token';
import { ProfileContext } from '../../../../context/profile/profileContext';
import { AuthHelper } from '../../Auth/helpers/auth_helper';


const indexedDBService = new IndexedDBService();
const authHelper = new AuthHelper();

const ProfileSettings = () => {
    document.title = "Perfil | ERP Quality";

    const { updateProfile, profile } = useContext(ProfileContext);
    const [user, setUser] = useState({});
    const [formProfile, setFormProfile] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: ''
    });
    const [activeTab, setActiveTab] = useState("1");
    const [loading, setLoading] = useState(false);
    const [messsageAlert, setMessageAlert] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState('success');
    const [errors, setErrors] = useState({});
    const [avatar, setAvatar] = useState(avatar1);
    const [zone, setZone] = useState(null);

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const handleGetZone = async (zoneId) => {
        let response = await authHelper.getZoneById(zoneId);
        let zone = response?.data;
        setZone(zone);
    }

    const getUser = async () => {
        const user = await indexedDBService.getItemById(localStorage.getItem('userId'));
        setUser(user);
        if (user?.avatar) {
            setAvatar(user?.avatar);
        }
        setFormProfile({
            name: user?.name,
            lastname: user?.lastname,
            phone: user?.phone,
            email: user?.email
        });

        await handleGetZone(user?.zoneId);
    };

    const handleChangeInputsProfile = (e) => {
        setFormProfile({
            ...formProfile,
            [e.target.name]: e.target.value
        });
    };

    const validateInputsProfile = () => {
        const newErrors = {};
        if (!formProfile.name) {
            newErrors.name = 'Nombre es requerido';
        }
        if (!formProfile.lastname) {
            newErrors.lastname = 'Apellidos es requerido';
        }
        if (!formProfile.phone) {
            newErrors.phone = 'Teléfono es requerido';
        }
        if (!formProfile.email) {
            newErrors.email = 'Email es requerido';
        }
        if (!validateEmail(formProfile.email)) {
            newErrors.email = 'Email no válido';
        }
        if (!validateEmailDomain(formProfile.email)) {
            newErrors.email = 'Email no válido, debe ser @galilea.co';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitProfile = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            setIsOpenModal(false);
            setMessageAlert('');
            setTypeModal('success');
            setErrors({});

            if (!validateInputsProfile()) return;

            const user = {
                name: formProfile.name,
                lastname: formProfile.lastname,
                phone: formProfile.phone,
                email: formProfile.email
            }
            let userId = localStorage.getItem('userId');
            let token = getToken();
            let response = await fetch(`${url.BASE_URL}${url.UPDATE_USER_PROFILE}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();

            if (response.status !== 200) {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
                return;
            }
            setMessageAlert(data?.message);
            setIsOpenModal(true);
            setTypeModal('success');
            return;
        } catch (error) {
            console.log(error);
            setMessageAlert(error?.message);
            setIsOpenModal(true);
            setTypeModal('danger');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeAvatar = (e) => {
        const file = e.target.files[0];
        setAvatar(URL.createObjectURL(file));
        handleUploadAvatar(file);
    };

    const handleUploadAvatar = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            let token = getToken();
            let response = await fetch(`${url.BASE_URL}${url.UPLOAD_USER_IMAGE}/${localStorage.getItem('userId')}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await response.json();

            if (response.status === 200) {
                let urlAvatar = data.data.url;
                let userData = await indexedDBService.getItemById(localStorage.getItem('userId'));
                userData.avatar = urlAvatar;
                await indexedDBService.updateItem(localStorage.getItem('userId'), userData);
                updateProfile({ ...profile, changeAvatar: true });
                setAvatar(urlAvatar);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Perfil" pageTitle="Home" />
                    <Row>
                        {
                            isOpenModal && (
                                <AlertCustom
                                    messsageAlert={messsageAlert}
                                    typeAlert={typeModal}
                                    isOpen={isOpenModal}
                                />
                            )
                        }
                        <Col xxl={3}>
                            <Card className="card-bg-fill">
                                <CardBody className="p-4">

                                    <div className="text-center">
                                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                            <img src={avatar}
                                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                alt="user-profile" />
                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Input
                                                    id="profile-img-file-input"
                                                    type="file"
                                                    className="profile-img-file-input"
                                                    onChange={handleChangeAvatar}
                                                />
                                                <Label htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-light text-body">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>

                                        <h5 className="fs-16 mb-1">{`${capitalizeFirstLetter(String(user?.name).split(' ')[0]) ?? ''} ${capitalizeFirstLetter(String(user?.name).split(' ')[1]) ?? ''}`}</h5>
                                        <p className="text-muted mb-0">{`${capitalizeFirstLetter(String(user?.lastname).split(' ')[0]) ?? ''} ${capitalizeFirstLetter(String(user?.lastname).split(' ')[1]) ?? ''}`}</p>
                                        <p className="text-muted mb-0"><strong>Rol:</strong>  {user?.role?.name ?? 'Rol'}</p>
                                        <p className="text-muted mb-0">{zone?.shortCode ?? 'Sin definir'} - {zone?.name ?? 'Sin definir'}</p>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xxl={9}>
                            <Card>
                                <CardHeader>
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => {
                                                    tabChange("1");
                                                }}>
                                                <i className="fas fa-home"></i>
                                                Datos personales
                                            </NavLink>
                                        </NavItem>

                                        {/* <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "4" })}
                                                onClick={() => {
                                                    tabChange("4");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Política de privacidad
                                            </NavLink>
                                        </NavItem> */}
                                    </Nav>
                                </CardHeader>

                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <Form>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="firstnameInput" className="form-label">Nombres</Label>
                                                            <Input
                                                                onChange={handleChangeInputsProfile}
                                                                value={`${capitalizeFirstLetter(String(formProfile.name).split(' ')[0]) ?? ''} ${capitalizeFirstLetter(String(formProfile?.name).split(' ')[1]) ?? ''}`}
                                                                name='name'
                                                                type="text"
                                                                className="form-control"
                                                                id="firstnameInput"
                                                                placeholder="Ingresa tus nombres"
                                                                defaultValue="nombres" />
                                                            {errors.name && (<span className="fs-12" style={{ color: "#f18275" }}>{errors.name}</span>)}
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="lastnameInput" className="form-label">Apellidos</Label>
                                                            <Input
                                                                onChange={handleChangeInputsProfile}
                                                                value={`${capitalizeFirstLetter(String(formProfile?.lastname).split(' ')[0])} ${capitalizeFirstLetter(String(formProfile?.lastname).split(' ')[1])}`}
                                                                name='lastname'
                                                                type="text"
                                                                className="form-control"
                                                                id="lastnameInput"
                                                                placeholder="Ingresa tus apellidos"
                                                                defaultValue="apellidos" />
                                                            {errors.lastname && (<span className="fs-12" style={{ color: "#f18275" }}>{errors.lastname}</span>)}
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="phonenumberInput"
                                                                className="form-label">Teléfono</Label>
                                                            <Input
                                                                onChange={handleChangeInputsProfile}
                                                                value={formProfile.phone}
                                                                name='phone'
                                                                type="text"
                                                                className="form-control"
                                                                id="phonenumberInput"
                                                                placeholder="Ingresa tu teléfono"
                                                                defaultValue="+(57) 300 000 0000" />
                                                            {errors.phone && (<span className="fs-12" style={{ color: "#f18275" }}>{errors.phone}</span>)}
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="emailInput"
                                                                className="form-label">Correo</Label>
                                                            <Input
                                                                onChange={handleChangeInputsProfile}
                                                                value={formProfile.email}
                                                                name='email'
                                                                type="email"
                                                                className="form-control"
                                                                id="emailInput"
                                                                placeholder="Ingresa tu correo"
                                                                defaultValue="example@galilea.co" />
                                                            {errors.email && (<span className="fs-12" style={{ color: "#f18275" }}>{errors.email}</span>)}
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <button
                                                                disabled={loading}
                                                                onClick={handleSubmitProfile}
                                                                type="button"
                                                                className="btn btn-primary">{loading ? "Cargando..." : "Actualizar"}</button>
                                                            {/* <button type="button"
                                                                className="btn btn-soft-danger">Cancelar</button> */}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </TabPane>

                                        <TabPane tabId="4">
                                            <div className="mb-4 pb-2">
                                                <h5 className="card-title text-decoration-underline mb-3">Security:</h5>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Two-factor Authentication</h6>
                                                        <p className="text-muted">Two-factor authentication is an enhanced
                                                            security meansur. Once enabled, you'll be required to give
                                                            two types of identification when you log into Google
                                                            Authentication and SMS are Supported.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm btn-primary">Enable Two-facor
                                                            Authentication</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Secondary Verification</h6>
                                                        <p className="text-muted">The first factor is a password and the
                                                            second commonly includes a text with a code sent to your
                                                            smartphone, or biometrics using your fingerprint, face, or
                                                            retina.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#" className="btn btn-sm btn-primary">Set
                                                            up secondary method</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Backup Codes</h6>
                                                        <p className="text-muted mb-sm-0">A backup code is automatically
                                                            generated for you when you turn on two-factor authentication
                                                            through your iOS or Android Twitter app. You can also
                                                            generate a backup code on twitter.com.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm btn-primary">Generate backup codes</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <h5 className="card-title text-decoration-underline mb-3">Application Notifications:</h5>
                                                <ul className="list-unstyled mb-0">
                                                    <li className="d-flex">
                                                        <div className="flex-grow-1">
                                                            <label htmlFor="directMessage"
                                                                className="form-check-label fs-14">Direct messages</label>
                                                            <p className="text-muted">Messages from people you follow</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="directMessage" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="desktopNotification">
                                                                Show desktop notifications
                                                            </Label>
                                                            <p className="text-muted">Choose the option you want as your
                                                                default setting. Block a site: Next to "Not allowed to
                                                                send notifications," click Add.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="desktopNotification" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="emailNotification">
                                                                Show email notifications
                                                            </Label>
                                                            <p className="text-muted"> Under Settings, choose Notifications.
                                                                Under Select an account, choose the account to enable
                                                                notifications for. </p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="emailNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="chatNotification">
                                                                Show chat notifications
                                                            </Label>
                                                            <p className="text-muted">To prevent duplicate mobile
                                                                notifications from the Gmail and Chat apps, in settings,
                                                                turn off Chat notifications.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="chatNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="purchaesNotification">
                                                                Show purchase notifications
                                                            </Label>
                                                            <p className="text-muted">Get real-time purchase alerts to
                                                                protect yourself from fraudulent charges.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="purchaesNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="card-title text-decoration-underline mb-3">Delete This
                                                    Account:</h5>
                                                <p className="text-muted">Go to the Data & Privacy section of your profile
                                                    Account. Scroll to "Your data & privacy options." Delete your
                                                    Profile Account. Follow the instructions to delete your account :
                                                </p>
                                                <div>
                                                    <Input type="password" className="form-control" id="passwordInput"
                                                        placeholder="Enter your password" defaultValue="make@321654987"
                                                        style={{ maxWidth: "265px" }} />
                                                </div>
                                                <div className="hstack gap-2 mt-3">
                                                    <Link to="#" className="btn btn-soft-danger">Close &
                                                        Delete This Account</Link>
                                                    <Link to="#" className="btn btn-light">Cancel</Link>
                                                </div>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ProfileSettings;