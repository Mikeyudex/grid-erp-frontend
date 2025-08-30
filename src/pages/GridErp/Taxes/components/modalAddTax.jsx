import { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { styles } from './../../Accounts/pages/styles';
import { optionsSnackbarDanger, optionsSnackbarSuccess, ProductHelper } from '../../Products/helper/product_helper';
import { TaxHelper } from '../helpers/tax-helper';

const helper = new TaxHelper();
const productHelper = new ProductHelper();

const ModalAddTax = ({ isOpen, closeModal, handleReload }) => {

    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [formData, setFormData] = useState({
        companyId: productHelper.companyId,
        name: '',
        percentage: 0,
        description: '',
        shortCode: '',
        active: true,
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
            companyId: productHelper.companyId,
            name: '',
            percentage: 0,
            description: '',
            shortCode: '',
            active: true,
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
            await helper.create(formData);
            handleCloseModal();
            openSnackbarSuccess('Registro creado exitosamente');
            handleReload();
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
        if (!formData.shortCode) {
            errors.shortCode = 'Requerido';
        }
        if (!formData.percentage) {
            errors.percentage = 'Requerido';
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
            <ModalHeader toggle={handleCloseModal}>{'Crear nuevo impuesto'}</ModalHeader>
            <ModalBody>
                {"Ingresa los datos del nuevo impuesto"}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1.5em' }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="name">*Nombre:</label>
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

                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="name">*Código:</label>
                            <input
                                name={'shortCode'}
                                onChange={handleInputChange}
                                placeholder={'Código'}
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

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1.5em' }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="name">*Porcentaje:</label>
                            <input
                                name={'percentage'}
                                onChange={handleInputChange}
                                placeholder={'Porcentaje'}
                                value={formData.percentage}
                                type={"number"}
                                className={"input-box"}
                                id={'percentage'}
                                required={true}
                            />
                            {errors.percentage && (<span className="form-product-input-error">{errors.percentage}</span>)}
                        </div>
                    </div>

                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="name">*Descripción:</label>
                            <input
                                name={'description'}
                                onChange={handleInputChange}
                                placeholder={'Descripción'}
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

export default ModalAddTax;

