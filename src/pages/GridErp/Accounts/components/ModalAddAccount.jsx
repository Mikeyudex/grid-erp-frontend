import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { styles } from '../pages/styles';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../../Products/helper/product_helper';
import { AccountHelper } from '../helpers/account_helper';
import { typeBankAccountOptions, bankAccountOptions } from '../../../../helpers/options';

const helper = new AccountHelper();

const ModalAddAccount = ({ isOpen, closeModal }) => {

    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [formData, setFormData] = useState({
        name: '',
        typeAccount: '',
        bankAccount: '',
        numberAccount: '',
        description: '',
        isActive: '',
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
            tipo_tapete: '',
            tipo_material: '',
            precioBase: '',
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

            await helper.createAccount(formData);

            handleCloseModal();
            openSnackbarSuccess('Registro creado exitosamente');
        } catch (error) {
            console.log(error);
            openSnackbarDanger('Ocurrió un error al crear el registro');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = 'Requerido';
        }
        if (!formData.typeAccount) {
            errors.typeAccount = 'Requerido';
        }
        if (!formData.bankAccount) {
            errors.bankAccount = 'Requerido';
        }
        if (!formData.numberAccount) {
            errors.numberAccount = 'Requerido';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckboxChange = (e) => {
        const isActive = e.target.checked;
        setFormData({
            ...formData,
            isActive,
        });
    }

    return (
        <Modal
            isOpen={isOpen}
            toggle={handleCloseModal}
            className={"modal-dialog-centered"}
            size='lg'
        >
            <ModalHeader toggle={handleCloseModal}>{'Crear nueva cuenta'}</ModalHeader>
            <ModalBody>
                {"Ingresa los datos de la nueva cuenta"}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1.5em' }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="name">*Nombre:</label>
                            <input
                                name={'name'}
                                onChange={handleInputChange}
                                placeholder={'Nombre de la cuenta'}
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
                            <label className='form-label' htmlFor="quantity">*Tipo de cuenta:</label>
                            <select
                                name={'typeAccount'}
                                onChange={handleInputChange}
                                placeholder={'Tipo de cuenta'}
                                type={"select"}
                                className={"input-box"}
                                id={'typeAccount'}
                                required={true}
                            >

                            {typeBankAccountOptions.map((typeAccount, idx) => (
                                <option key={idx} value={typeAccount.value}>
                                    {typeAccount.label}
                                </option>
                            ))}
                            </select>

                            {errors.typeAccount && (<span className="form-product-input-error">{errors.typeAccount}</span>)}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="bankAccount">*Banco:</label>
                            <select
                                name={'bankAccount'}
                                onChange={handleInputChange}
                                placeholder={'Banco'}
                                className={"input-box"}
                                id={'bankAccount'}
                                required={true}
                            >
                                {bankAccountOptions.map((bankAccount, idx) => (
                                    <option key={idx} value={bankAccount.label}>
                                        {bankAccount.label}
                                    </option>
                                ))}
                            </select>
                            {errors.bankAccount && (<span className="form-product-input-error">{errors.bankAccount}</span>)}
                        </div>
                    </div>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="numberAccount">*Número de cuenta:</label>
                            <input
                                name={'numberAccount'}
                                onChange={handleInputChange}
                                placeholder={'Número de cuenta'}
                                value={formData.numberAccount}
                                className={"input-box"}
                                id={'numberAccount'}
                                required={true}
                            />
                            {errors.numberAccount && (<span className="form-product-input-error">{errors.numberAccount}</span>)}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="description">*Descripción:</label>
                            <input
                                name={'description'}
                                onChange={handleInputChange}
                                placeholder={'Descripción'}
                                value={formData.description}
                                className={"input-box"}
                                id={'description'}
                                required={true}
                            />
                            {errors.description && (<span className="form-product-input-error">{errors.description}</span>)}
                        </div>
                    </div>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="isActive">*Activa:</label>
                            <input
                                name={'isActive'}
                                className='form-check-input m-2 cursor-pointer'
                                type='checkbox'
                                id='isActive'
                                checked={formData.isActive}
                                onChange={handleCheckboxChange}
                            />
                            {errors.isActive && (<span className="form-product-input-error">{errors.isActive}</span>)}
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

export default ModalAddAccount;

