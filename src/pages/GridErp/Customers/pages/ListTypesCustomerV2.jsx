"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import {Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";
import { CustomerHelper } from "../helper/customer-helper";
import { CustomerContext } from "../context/customerContext";

import ModalAddTypeCustomer from "../components/ModalAddTypeCustomer";
import { BASE_URL } from "../../../../helpers/url_helper";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";

const helper = new CustomerHelper();

const ClientTypesPage = () => {
    document.title = "Categoría de cliente | Quality Erp";

    const { updateCustomerData, customerData } = useContext(CustomerContext);

    const [clientTypes, setClientTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentClientType, setCurrentClientType] = useState(null);
    const [openModalAddTypeCustomer, setOpenModalAddTypeCustomer] = useState(false);
    const [reloadData, setReloadData] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "name", label: "Nombre", type: "text", editable: true, searchable: true },
        { key: "description", label: "Descripción", type: "text", editable: true, searchable: true },
        /* { key: "shortCode", label: "Código", type: "text", editable: true, searchable: true }, */
        { key: "percentDiscount", label: "Descuento (%)", type: "percentage", editable: true, searchable: true },
        { key: "active", label: "Activo", type: "boolean", editable: true, searchable: false },
    ]

    // Cargar datos
    const fetchClientTypes = async () => {
        setLoading(true);
        setError(null);

        helper.getTypesCustomer()
            .then(async (typesCustomers) => {
                if (typesCustomers && Array.isArray(typesCustomers) && typesCustomers.length > 0) {
                    setClientTypes(typesCustomers);
                    updateCustomerData({ ...customerData, typeCustomerList: [...customerData.typeCustomerList, typesCustomers] });
                }
                return;
            })
            .catch(e => {
                console.error("Error:", err)
                setError(err.message)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchClientTypes();
    }, [customerData.reloadTableTypeCustomer, reloadData]);

    // Manejadores de eventos
    const handleUpdate = async (updatedClientType) => {
        try {
            const response = await fetch(`${BASE_URL}/customers/updateTypeCustomer/${updatedClientType._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: updatedClientType?.name,
                    description: updatedClientType?.description,
                    shortCode: updatedClientType?.shortCode,
                    percentDiscount: updatedClientType?.percentDiscount,
                    active: updatedClientType?.active,
                }),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el tipo de cliente")
            }

            // Actualizar estado local
            setClientTypes((prev) => prev.map((item) => (item._id === updatedClientType._id ? updatedClientType : item)))
            updateCustomerData({ ...customerData, reloadTableTypeCustomer: !customerData.reloadTableTypeCustomer });
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/customers/deleteTypeCustomer/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Error al eliminar el tipo de cliente")
            }

            // Actualizar estado local
            setClientTypes((prev) => prev.filter((item) => item._id !== id))

            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleBulkDelete = async (ids) => {
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/customers/typeCustomer/bulkDelete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar los tipos de cliente seleccionados")
            }

            // Actualizar estado local
            setClientTypes((prev) => prev.filter((item) => !ids.includes(item._id)))
            updateCustomerData({ ...customerData, reloadTableTypeCustomer: !customerData.reloadTableTypeCustomer });
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleCloseModalAddTypeCustomer = () => {
        setOpenModalAddTypeCustomer(!openModalAddTypeCustomer);
        updateCustomerData({ ...customerData, openModalCreateTypeCustomer: !customerData.openModalCreateTypeCustomer });
    }

    const handleOpenModalAddTypeCustomer = () => {
        updateCustomerData({ ...customerData, openModalCreateTypeCustomer: true });
    }

    useEffect(() => {
        setOpenModalAddTypeCustomer(customerData.openModalCreateTypeCustomer);
    }, [customerData.openModalCreateTypeCustomer]);

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Categoría de cliente"
            pageTitleBreadcrumb="Categoría de cliente"
            main={
                <Fragment>
                    <ModalAddTypeCustomer
                        isOpen={openModalAddTypeCustomer}
                        closeModal={handleCloseModalAddTypeCustomer} 
                        setReloadData={setReloadData}
                        reloadData={reloadData}
                        />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleOpenModalAddTypeCustomer}>
                                        <FaPlus className="me-1" /> Nuevo
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={clientTypes}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Categoría de cliente"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchClientTypes}
                                        searchable={true}
                                        itemsPerPage={10}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Fragment>
            }
        >
        </TopLayoutGeneralView >

    )
}

export default ClientTypesPage
