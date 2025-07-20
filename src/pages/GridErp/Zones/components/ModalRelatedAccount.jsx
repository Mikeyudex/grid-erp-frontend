import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import Select from 'react-select';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../../Products/helper/product_helper';
import { styles } from '../../MatMaterialPrice/pages/styles';
import { ADD_ACCOUNT_TO_ZONE, BASE_URL } from '../../../../helpers/url_helper';
import { getToken } from '../../../../helpers/jwt-token-access/get_token';
import { ZonesHelper } from '../helper/zones_helper';

const zoneHelper = new ZonesHelper();

const ModalRelatedAccount = ({ isOpen, closeModal, accountList, selectedRows, setReloadData }) => {
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [formData, setFormData] = useState({
        accountIds: [],
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [accountsRelated, setAccountsRelated] = useState([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

    const handleClearForm = () => {
        setFormData({
            accountIds: [],
        });
        setErrors({});
    }

    const handleCloseModal = () => {
        closeModal();
        handleClearForm();
        setIsLoading(false);
    }

    const fetchAccountsRelated = async () => {
        try {
            setIsLoadingAccounts(true);
            const accounts = await zoneHelper.getAccountsFromZone(selectedRows[0]);
            if (accounts && Array.isArray(accounts) && accounts.length > 0) {
                setAccountsRelated(accounts);
            }
            return;
        } catch (error) {
            console.log(error);
        }finally {
            setIsLoadingAccounts(false);
        }

    }

    const handleSubmit = async () => {
        try {
            if (!validateForm()) return;
            setIsLoading(true);
            let token = getToken();
            let payload = {
                accountIds: formData.accountIds,
                ids: selectedRows,
            };
            let response = await fetch(`${BASE_URL}${ADD_ACCOUNT_TO_ZONE}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error("Error al agregar la cuenta a la sede")
            }
            handleCloseModal();
            openSnackbarSuccess('Proceso finalizado exitosamente');
            setReloadData(true);
        } catch (error) {
            console.log(error);
            openSnackbarDanger('Ocurrió un error al asociar la cuenta a la sede: ', error?.message);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.accountIds) {
            errors.accountIds = 'Requerido';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        if (!selectedRows.length) return;
        fetchAccountsRelated();
    }, [selectedRows]);

    useEffect(() => {
        // Inicializar formData con las cuentas ya relacionadas
        if (accountsRelated.length > 0) {
            setFormData({
                accountIds: accountsRelated.map(a => a._id),
            });
        }
    }, [accountsRelated]);

    // Preparar opciones y valores seleccionados
    const relatedIds = accountsRelated.map(acc => acc._id?.toString());

    const accountOptions = accountList
        .filter(a => !relatedIds.includes(a._id?.toString()))
        .map(account => ({
            value: account._id,
            label: `${account.name} (${account.numberAccount})`
        }));

    const selectedAccountOptions = accountList
        .filter(a => relatedIds.includes(a._id?.toString()))
        .map(account => ({
            value: account._id,
            label: `${account.name} (${account.numberAccount})`
        }));

    const combinedOptions = [...selectedAccountOptions, ...accountOptions];

    const selectedValues = accountList
        .filter(a => formData.accountIds.includes(a._id))
        .map(account => ({
            value: account._id,
            label: `${account.name} (${account.numberAccount})`
        }));



    return (
        <Modal
            isOpen={isOpen}
            toggle={handleCloseModal}
            className={"modal-dialog-centered"}
            size='lg'
        >
            <ModalHeader toggle={handleCloseModal}>{'Asociar cuentas a una Sede'}</ModalHeader>
            <ModalBody>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1.5em' }}>
                    <div style={{ flex: "1 1 30%", minWidth: "200px" }}>
                        <div style={styles.formGroup}>
                            <label className='form-label' htmlFor="name">*Cuentas:</label>
                            {isLoadingAccounts && (
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="sr-only">Cargando...</span>
                                    </div>
                                </div>
                            )}
                            {!isLoadingAccounts && accountList.length > 0 && (
                                <Select
                                    id="accountIds"
                                    name="accountIds"
                                    isMulti
                                    options={combinedOptions}
                                    value={selectedValues}
                                    onChange={(option) => {
                                        const values = option.map(o => o.value);
                                        setFormData({
                                            ...formData,
                                            accountIds: values,
                                        });
                                    }}
                                    classNamePrefix="react-select"
                                    placeholder="Selecciona una cuenta"
                                    className="form-control"
                                    isDisabled={isLoadingAccounts}
                                    styles={{
                                        multiValue: (provided) => ({
                                            ...provided,
                                            color: "white",
                                        }),
                                    }}
                                />
                            )}
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
                    >Asociar</button>
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

export default ModalRelatedAccount;

