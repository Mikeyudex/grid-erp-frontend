import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { styles } from '../pages/styles';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../../Products/helper/product_helper';
import { MatMaterialPriceContext } from '../context/Context';
import { ADD_MATERIAL_PRICE } from '../../Products/helper/url_helper';

const ModalAddMaterialPrice = ({ isOpen, closeModal }) => {
    const { matMaterialPriceData, updateMatMaterialPriceData } = React.useContext(MatMaterialPriceContext);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [formData, setFormData] = useState({
        tipo_tapete: '',
        tipo_material: '',
        precioBase: '',
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
        updateMatMaterialPriceData({ ...matMaterialPriceData, openModalAddMaterialPrice: false });
    }

    const handleSubmit = async () => {
        try {
            if (!validateForm()) return;
            setIsLoading(true);
            let { data } = await fetch(`${ADD_MATERIAL_PRICE}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            updateMatMaterialPriceData({
                ...matMaterialPriceData,
                matMaterialPriceList: [...matMaterialPriceData.matMaterialPriceList, data],
                reloadTableMatMaterialPriceList: !matMaterialPriceData.reloadTableMatMaterialPriceList,
            });
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
        if (!formData.tipo_tapete) {
            errors.tipo_tapete = 'Requerido';
        }
        if (!formData.tipo_material) {
            errors.tipo_material = 'Requerido';
        }
        if (!formData.precioBase) {
            errors.precioBase = 'Requerido';
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
            <ModalHeader toggle={handleCloseModal}>{'Crear nuevo tipo - material'}</ModalHeader>
            <ModalBody>
                {"Ingresa los datos del nuevo tipo - material"}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1.5em' }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="quantity">*Tipo de tapete:</label>
                            <input
                                name={'tipo_tapete'}
                                onChange={handleInputChange}
                                placeholder={'Nombre del tipo de tapete'}
                                value={formData.tipo_tapete}
                                type={"text"}
                                className={"input-box"}
                                id={'tipo_tapete'}
                                required={true}
                            />
                            {errors.tipo_tapete && (<span className="form-product-input-error">{errors.tipo_tapete}</span>)}
                        </div>
                    </div>

                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="quantity">*Tipo de material:</label>
                            <input
                                name={'tipo_material'}
                                onChange={handleInputChange}
                                placeholder={'Nombre del tipo de material'}
                                value={formData.tipo_material}
                                type={"text"}
                                className={"input-box"}
                                id={'tipo_material'}
                                required={true}
                            />
                            {errors.tipo_material && (<span className="form-product-input-error">{errors.tipo_material}</span>)}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="quantity">*Precio base:</label>
                            <input
                                name={'precioBase'}
                                onChange={handleInputChange}
                                placeholder={'Precio base'}
                                value={formData.precioBase}
                                type={"number"}
                                className={"input-box"}
                                id={'precioBase'}
                                required={true}
                            />
                            {errors.precioBase && (<span className="form-product-input-error">{errors.precioBase}</span>)}
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

export default ModalAddMaterialPrice;

