import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../../Products/helper/product_helper';
import { styles } from '../../MatMaterialPrice/pages/styles';
import { ADD_ZONE, BASE_URL } from '../../../../helpers/url_helper';
import { getToken } from '../../../../helpers/jwt-token-access/get_token';

const ModalAddZone = ({ isOpen, closeModal, handleAddItemToList }) => {
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [formData, setFormData] = useState({
        name: '', shortCode: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const handleClearForm = () => {
        setFormData({
            name: '', shortCode: '',
        });
        setErrors({});
    }

    const handleCloseModal = () => {
        closeModal();
        handleClearForm();
    }

    const handleSubmit = async () => {
        try {
            if (!validateForm()) return;
            setIsLoading(true);
            let token = getToken();
            formData.name = formData.name.toUpperCase();
            let response = await fetch(`${BASE_URL}${ADD_ZONE}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error("Error al actualizar la sede")
            }
            let data = await response.json();
            if (data) {
                handleAddItemToList(data);
            }
            handleCloseModal();
            openSnackbarSuccess('Registro creado exitosamente');
        } catch (error) {
            console.log(error);
            openSnackbarDanger('Ocurrió un error al crear el registro: ', error?.message);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = 'Requerido';
        }
        if (!formData.shortCode) {
            errors.shortCode = 'Requerido'
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    return (
        <Modal
            isOpen={isOpen}
            toggle={handleCloseModal}
            className={"modal-dialog-centered"}
            size='lg'
        >
            <ModalHeader toggle={handleCloseModal}>{'Crear nueva Sede'}</ModalHeader>
            <ModalBody>
                {"Ingresa los datos de la nueva Sede"}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1.5em' }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="name">*Nombre:</label>
                            <input
                                name={'name'}
                                onChange={handleInputChange}
                                placeholder={'Nombre de la sede'}
                                value={formData.name}
                                type={"text"}
                                className={"input-box"}
                                id={'name'}
                                required={true}
                            />
                            {errors.name && (<span className="form-product-input-error">{errors.name}</span>)}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="shortCode">*Código corto:</label>
                            <input
                                name={'shortCode'}
                                onChange={handleInputChange}
                                placeholder={'Código corto de la sede'}
                                value={formData.shortCode}
                                type={"text"}
                                className={"input-box"}
                                id={'shortCode'}
                                required={true}
                            />
                            {errors.shortCode && (<span className="form-product-input-error">{errors.shortCode}</span>)}
                        </div>
                    </div>
                </div>

                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                    <button
                        type="button"
                        className="btn w-sm btn-light"
                        onClick={handleCloseModal}
                    >Cancelar</button>
                    <button
                        type="button"
                        className="btn w-sm btn-primary"
                        id="delete-record"
                        onClick={handleSubmit}
                    >Crear</button>
                </div>
                {
                    isLoading && (
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

export default ModalAddZone;

