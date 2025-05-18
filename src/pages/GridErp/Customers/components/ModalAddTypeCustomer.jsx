import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { styles } from '../pages/styles';
import { ADD_CUSTOMER_TYPE } from '../helper/url_helper';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../../Products/helper/product_helper';
import { CustomerContext } from '../context/customerContext';


const ModalAddTypeCustomer = ({ isOpen, closeModal }) => {
    const { customerData, updateCustomerData } = React.useContext(CustomerContext);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortCode: '',
        active: true,
        percentDiscount: 0,
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
            name: '',
            description: '',
            shortCode: '',
            active: true,
            percentDiscount: 0,
        });
        setErrors({});
    }

    const handleCloseModal = () => {
        closeModal();
        handleClearForm();
        updateCustomerData({ ...customerData, openModalCreateTypeCustomer: false });
    }

    const handleSubmit = async () => {
        try {
            if (!validateForm()) return;
            setIsLoading(true);
            
            formData.name = formData.name.toUpperCase();

            let { data } = await fetch(`${ADD_CUSTOMER_TYPE}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            updateCustomerData({
                ...customerData,
                typeCustomerList: [...customerData.typeCustomerList, data],
                reloadTableTypeCustomer: !customerData.reloadTableTypeCustomer,
            });
            handleCloseModal();
            openSnackbarSuccess('Tipo de cliente creado exitosamente');
        } catch (error) {
            console.log(error);
            openSnackbarDanger('Ocurrió un error al crear el tipo de cliente');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = 'Requerido';
        }
        if (!formData.description) {
            errors.description = 'Requerido';
        }
        if (!formData.shortCode) {
            errors.shortCode = 'Requerido';
        }
        if (!formData.active) {
            errors.active = 'Requerido';
        }
        if (formData.percentDiscount < 0 || formData.percentDiscount > 100) {
            errors.percentDiscount = 'Debe ser un valor entre 0 y 100';
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
            <ModalHeader toggle={handleCloseModal}>{'Crear nuevo tipo de cliente'}</ModalHeader>
            <ModalBody>
                {"Ingresa los datos del nuevo tipo de cliente"}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1.5em' }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="quantity">*Nombre:</label>
                            <input
                                name={'name'}
                                onChange={handleInputChange}
                                placeholder={'Nombre del tipo de cliente'}
                                value={formData.name}
                                type={"text"}
                                className={"input-box"}
                                id={'name'}
                                required={true}
                            />
                            {errors.name && (<span className="form-product-input-error">{errors.name}</span>)}
                        </div>
                    </div>

                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="quantity">*Descripción:</label>
                            <input
                                name={'description'}
                                onChange={handleInputChange}
                                placeholder={'Descripción del tipo de cliente'}
                                value={formData.description}
                                type={"text"}
                                className={"input-box"}
                                id={'description'}
                                required={true}
                            />
                            {errors.description && (<span className="form-product-input-error">{errors.description}</span>)}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="quantity">*Código corto:</label>
                            <input
                                name={'shortCode'}
                                onChange={handleInputChange}
                                placeholder={'Código corto del tipo de cliente'}
                                value={formData.shortCode}
                                type={"text"}
                                className={"input-box"}
                                id={'shortCode'}
                                required={true}
                            />
                            {errors.shortCode && (<span className="form-product-input-error">{errors.shortCode}</span>)}
                        </div>
                    </div>

                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="quantity">% Descuento:</label>
                            <input
                                name={'percentDiscount'}
                                onChange={handleInputChange}
                                placeholder={'Porcentaje de descuento'}
                                value={formData.percentDiscount}
                                type={"number"}
                                className={"input-box"}
                                id={'percentDiscount'}
                                required={true}
                            />
                            {errors.percentDiscount && (<span className="form-product-input-error">{errors.percentDiscount}</span>)}
                        </div>
                    </div>

                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <input
                                style={{ marginTop: '1.5em' }}
                                className="form-check-input cursor-pointer"
                                type="checkbox"
                                role="switch"
                                id="SwitchCheck1"
                                checked={formData.active}
                                onClick={() => handleInputChange({ target: { name: 'active', value: !formData.active } })}
                            />
                            <span
                                style={{ marginLeft: '0.9em', marginTop: '1.5em' }}
                                className={`${formData.active ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"} badge text-uppercase`}
                            >{formData.active ? 'Activo' : 'Inactivo'}</span>
                            {errors.active && (<span className="form-product-input-error">{errors.active}</span>)}
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

export default ModalAddTypeCustomer;

