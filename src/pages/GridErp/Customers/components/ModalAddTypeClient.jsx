import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { styles } from '../pages/styles';
import { ADD_CUSTOMER_TYPES } from '../helper/url_helper';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../../Products/helper/product_helper';
import { CustomerContext } from '../context/customerContext';
import { getToken } from '../../../../helpers/jwt-token-access/get_token';


const ModalAddTypeClient = ({ isOpen, closeModal, reloadData, setReloadData }) => {
    const { customerData, updateCustomerData } = React.useContext(CustomerContext);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [formData, setFormData] = useState({
        name: '',
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
            let { data } = await fetch(`${ADD_CUSTOMER_TYPES}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            updateCustomerData({
                ...customerData,
                typeOfClientList: [...customerData.typeOfClientList, data],
                reloadTableTypeOfClient: !customerData.reloadTableTypeOfClient,
            });
            setReloadData(!reloadData);
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
                {"Ingresa los datos del tipo de cliente"}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1.5em' }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="quantity">*Nombre:</label>
                            <input
                                name={'name'}
                                onChange={handleInputChange}
                                placeholder={'Nombre'}
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

export default ModalAddTypeClient;

