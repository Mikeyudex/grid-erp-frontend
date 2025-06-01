"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";
import { CustomerHelper } from "../helper/customer-helper";
import { CustomerContext } from "../context/customerContext";

import ModalAddTypeClient from "../components/ModalAddTypeClient";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { BULK_DELETE_CUSTOMERS_TYPES, DELETE_CUSTOMERS_TYPES, UPDATE_CUSTOMERS_TYPES } from "../helper/url_helper";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";

const helper = new CustomerHelper();

const ListTypeOfClient = () => {
    document.title = "Tipo de cliente | Quality Erp";

    const { updateCustomerData, customerData } = useContext(CustomerContext);

    const [clientTypes, setClientTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [reloadData, setReloadData] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "name", label: "Nombre", type: "text", editable: true, searchable: true }
    ]

    // Cargar datos
    const fetchTypeOfClients = async () => {
        setLoading(true);
        setError(null);

        helper.getTypeOfClients()
            .then(async (typeOfClients) => {
                if (typeOfClients && Array.isArray(typeOfClients) && typeOfClients.length > 0) {
                    setClientTypes(typeOfClients);
                    updateCustomerData({ ...customerData, typeOfClientList: [...customerData.typeOfClientList, typeOfClients] });
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
        fetchTypeOfClients();
    }, [customerData.reloadTableTypeOfClient, reloadData]);

    // Manejadores de eventos
    const handleUpdate = async (updated) => {
        try {
            let token = getToken();
            const response = await fetch(`${UPDATE_CUSTOMERS_TYPES}/${updated._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: updated?.name
                }),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el tipo de cliente")
            }

            // Actualizar estado local
            setClientTypes((prev) => prev.map((item) => (item._id === updated._id ? updated : item)))
            updateCustomerData({ ...customerData, reloadTableTypeOfClient: !customerData.reloadTableTypeOfClient });
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleDelete = async (id) => {
        try {
            let token = getToken();
            const response = await fetch(`${DELETE_CUSTOMERS_TYPES}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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
            let token = getToken();
            const response = await fetch(`${BULK_DELETE_CUSTOMERS_TYPES}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar los tipos de cliente seleccionados")
            }

            // Actualizar estado local
            setClientTypes((prev) => prev.filter((item) => !ids.includes(item._id)))
            updateCustomerData({ ...customerData, reloadTableTypeOfClient: !customerData.reloadTableTypeOfClient });
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleCloseModalAddTypeCustomer = () => {
        setOpenModalAdd(!openModalAdd);
    }

    const handleOpenModalAddTypeCustomer = () => {
        setOpenModalAdd(true);
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Tipo de cliente"
            pageTitleBreadcrumb="Tipo de cliente"
            main={
                <Fragment>
                    <ModalAddTypeClient
                        isOpen={openModalAdd}
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
                                        title="Tipo de cliente"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchTypeOfClients}
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

export default ListTypeOfClient
