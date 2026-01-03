'use client'

import { useState, Fragment } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { capitalizeFirstLetter } from '../../../../helpers/transform_helper';
import { getToken } from '../../../../helpers/jwt-token-access/get_token';
import * as url from '../../../../helpers/url_helper';
import AlertCustom from '../../../../Components/Common/Alert';
import { validateOtp } from '../../../../helpers/validations-helpers';


export default function TableAdminUsers({
    usersData,
    setGetUsers,
    getUsers,
    totalPages,
    currentPage,
    setCurrentPage,
    roles
}) {

    const [loading, setLoading] = useState(false);
    const [messsageAlert, setMessageAlert] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState('success');
    const [viewModalActive, setViewModalActive] = useState(false);
    const [messageModalActive, setMessageModalActive] = useState('');
    const [viewModalInsertOtp, setViewModalInsertOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [user, setUser] = useState({});
    const [errors, setErrors] = useState({});
    const [endpoint, setEndpoint] = useState('');
    const [updatingRole, setUpdatingRole] = useState(false);

    const handleClickSwitch = (user) => {
        setUser(user);
        let hasActive = user?.active;
        setEndpoint(hasActive ? url.DEACTIVATE_USER : url.ACTIVATE_USER);
        setViewModalActive(true);
        setMessageModalActive(hasActive ? '¿ Desea desactivar el usuario ?' : '¿ Desea activar el usuario ?');
    }

    const handleViewModalInsertOtp = () => {
        setViewModalActive(false);
        setViewModalInsertOtp(true);
    }

    const handleSendOtp = async () => {
        try {
            setLoading(true);
            setIsOpenModal(false);
            setMessageAlert('');
            setTypeModal('success');
            setErrors({});

            if (!otp) {
                setErrors({ otp: 'Código de verificación es requerido' });
                return;
            }
            if (!validateOtp(otp)) {
                setErrors({ otp: 'Código de verificación no válido' });
                return;
            }
            let response = await fetch(`${url.BASE_URL}${url.VERIFY_OTP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: localStorage.getItem('userEmail'), otp })
            });
            const data = await response.json();
            if (data?.statusCode !== 200) {
                setErrors({ otp: data?.message });
                return;
            }
            await updateUser(user?._id);
        } catch (error) {
            setMessageAlert('Error al validar el código de verificación');
            setIsOpenModal(true);
            setTypeModal('danger');
            return;
        } finally {
            setLoading(false);
        }
    }

    const updateUser = async (id) => {
        try {
            setLoading(true);
            setIsOpenModal(false);
            setMessageAlert('');
            setTypeModal('success');
            let token = getToken();
            let response = await fetch(`${url.BASE_URL}${endpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.status !== 200) {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
                return;
            }
            setViewModalInsertOtp(false);
            setViewModalActive(false);
            setErrors({});
            setOtp('');
            setMessageAlert(data?.message);
            setIsOpenModal(true);
            setTypeModal('success');
            setGetUsers(!getUsers);
            return;
        } catch (error) {
            setMessageAlert('Error al actualizar el usuario');
            setIsOpenModal(true);
            setTypeModal('danger');
            return;
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (updatingRole) return;
        setUpdatingRole(true);
        setMessageAlert('');
        setIsOpenModal(false);
        setTypeModal('success');
        try {
            let token = getToken();
            let response = await fetch(`${url.BASE_URL}${url.UPDATE_ROLE}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ idRole: newRole })
            });
            const data = await response.json();
            if (response.status !== 200) {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
            } else {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('success');
                setGetUsers(!getUsers); // Refrescar lista
            }
        } catch (error) {
            setMessageAlert('Error al actualizar el rol');
            setIsOpenModal(true);
            setTypeModal('danger');
        } finally {
            setUpdatingRole(false);
        }
    };


    return (
        <Fragment>
            {
                isOpenModal && (
                    <AlertCustom
                        messsageAlert={messsageAlert}
                        typeAlert={typeModal}
                        isOpen={isOpenModal}
                    />
                )
            }
            {
                viewModalActive && (
                    <ModalAlertQuestion
                        isOpen={viewModalActive}
                        messsageAlert={messageModalActive}
                        closeModal={() => setViewModalActive(false)}
                        handleViewModalInsertOtp={handleViewModalInsertOtp}
                    />
                )
            }
            {
                viewModalInsertOtp && (
                    <ModalInsertOtp
                        isOpen={viewModalInsertOtp}
                        closeModal={() => setViewModalInsertOtp(false)}
                        handleSendOtp={handleSendOtp}
                        otp={otp}
                        setOtp={setOtp}
                        errors={errors}
                        setErrors={setErrors}
                        loading={loading}
                    />
                )
            }
            <table className="table table-nowrap mb-0">
                <thead className="table-light">
                    <tr>
                        <th scope="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="cardtableCheck" />
                                <label className="form-check-label" for="cardtableCheck"></label>
                            </div>
                        </th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Documento</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Rol</th>
                        <th scope="col">Estado</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        (usersData ?? []).map((item, index) => (
                            < tr key={index}>
                                <td>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="cardtableCheck01" />
                                        <label className="form-check-label" for="cardtableCheck01"></label>
                                    </div>
                                </td>
                                <td><a href="#" className="fw-semibold">
                                    {capitalizeFirstLetter(String(item?.name).split(' ')[0])} {" "}
                                    {capitalizeFirstLetter(String(item?.name).split(' ')[1])} {" "}
                                    {capitalizeFirstLetter(String(item?.lastname).split(' ')[0])} {" "}
                                    {capitalizeFirstLetter(String(item?.lastname).split(' ')[1])}
                                </a></td>
                                <td>{item?.documento}</td>
                                <td>{item?.email}</td>
                                <td>{item?.phone}</td>
                                <td>
                                    <select
                                        className='form-select'
                                        name='role'
                                        id='role'
                                        aria-label='Role'
                                        size={'small'}
                                        value={item?.role?._id}
                                        onChange={(e) => handleRoleChange(item?._id, e.target.value)}
                                        disabled={updatingRole}
                                    >
                                        {roles.map((role) => (
                                            <option key={role?._id} value={role?._id}>{capitalizeFirstLetter(role?.name)}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="status">
                                    <div className="form-check form-switch form-switch-md form-switch-secondary">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="SwitchCheck1"
                                            checked={item?.active}
                                            onClick={() => handleClickSwitch(item)}
                                        />
                                        <span
                                            className={`${item?.active ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"} badge text-uppercase`}
                                        >{item?.active ? 'Activo' : 'Inactivo'}</span>
                                    </div>

                                </td>

                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {/* Paginación */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-between mt-3">
                    <Button
                        color="primary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Anterior
                    </Button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <Button
                        color="primary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </Fragment>
    )
}

const ModalAlertQuestion = ({ isOpen, messsageAlert, closeModal, handleViewModalInsertOtp }) => {
    return (
        <Modal
            isOpen={isOpen}
            toggle={closeModal}
            className={"modal-dialog-centered"}
        >
            <ModalHeader toggle={closeModal}>{'¿Está seguro?'}</ModalHeader>
            <ModalBody>
                {messsageAlert}
                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                    <button
                        type="button"
                        className="btn w-sm btn-light"
                        onClick={() => closeModal()}
                    >Cancelar</button>
                    <button
                        type="button"
                        className="btn w-sm btn-primary"
                        id="delete-record"
                        onClick={() => handleViewModalInsertOtp()}
                    >Sí, estoy seguro!</button>
                </div>
            </ModalBody>
        </Modal>
    );
};

const ModalInsertOtp = ({ isOpen, closeModal, handleSendOtp, otp, setOtp, errors, setErrors, loading }) => {
    return (
        <Modal
            isOpen={isOpen}
            toggle={closeModal}
            className={"modal-dialog-centered"}
        >
            <ModalHeader toggle={closeModal}>{'Ingresar código de verificación'}</ModalHeader>
            <ModalBody>
                {"Ingresa el código OTP"}

                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="number"
                        maxLength={6}
                        name="code"
                        id="code"
                        className="form-control"
                        placeholder="Código"
                        required />
                </div>
                {errors.otp && (<span className="text-sm" style={{ color: "#fc3e58", fontStyle: "italic" }}>{errors.otp}</span>)}
                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                    <button
                        type="button"
                        className="btn w-sm btn-light"
                        onClick={() => {
                            closeModal();
                            setOtp('');
                            setErrors({});
                        }}
                    >Cancelar</button>
                    <button
                        type="button"
                        className="btn w-sm btn-primary"
                        id="delete-record"
                        onClick={() => handleSendOtp()}
                    >Enviar</button>
                </div>
                {
                    loading && (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Cargando...</span>
                            </div>
                        </div>
                    )
                }
            </ModalBody>
        </Modal>
    );
};

