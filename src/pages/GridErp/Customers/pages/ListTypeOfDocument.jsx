"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";
import { CustomerHelper } from "../helper/customer-helper";
import { CustomerContext } from "../context/customerContext";

import ModalAddTypeClient from "../components/ModalAddTypeClient";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { BULK_DELETE_CUSTOMERS_TYPES, BULK_DELETE_CUSTOMERS_TYPES_DOCUMENTS, DELETE_CUSTOMERS_TYPES, DELETE_CUSTOMERS_TYPES_DOCUMENTS, UPDATE_CUSTOMERS_TYPES, UPDATE_CUSTOMERS_TYPES_DOCUMENTS } from "../helper/url_helper";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import ModalAddTypeDocument from "../components/ModalAddTypeDocument";

const helper = new CustomerHelper();

const ListTypeOfDocument = () => {
    document.title = "Tipo de documento | Quality Erp";

    const { updateCustomerData, customerData } = useContext(CustomerContext);

    const [documentTypes, setDocumentTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [reloadData, setReloadData] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "name", label: "Nombre", type: "text", editable: true, searchable: true }
    ]

    // Cargar datos
    const fetchTypeOfDocuments = async () => {
        setLoading(true);
        setError(null);

        helper.getTypeOfDocuments()
            .then(async (typeOfDocuments) => {
                if (typeOfDocuments && Array.isArray(typeOfDocuments) && typeOfDocuments.length > 0) {
                    setDocumentTypes(typeOfDocuments);
                    updateCustomerData({ ...customerData, typeOfDocumentList: [...customerData.typeOfDocumentList, typeOfDocuments] });
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
        fetchTypeOfDocuments();
    }, [customerData.reloadTableTypeOfDocument, reloadData]);

    // Manejadores de eventos
    const handleUpdate = async (updated) => {
        try {
            let token = getToken();
            const response = await fetch(`${UPDATE_CUSTOMERS_TYPES_DOCUMENTS}/${updated._id}`, {
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
                throw new Error("Error al actualizar el tipo de documento")
            }

            // Actualizar estado local
            setDocumentTypes((prev) => prev.map((item) => (item._id === updated._id ? updated : item)))
            updateCustomerData({ ...customerData, reloadTableTypeOfDocument: !customerData.reloadTableTypeOfDocument });
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
            const response = await fetch(`${DELETE_CUSTOMERS_TYPES_DOCUMENTS}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Error al eliminar el tipo de documento")
            }

            // Actualizar estado local
            setDocumentTypes((prev) => prev.filter((item) => item._id !== id))

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
            const response = await fetch(`${BULK_DELETE_CUSTOMERS_TYPES_DOCUMENTS}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar los tipos de documento seleccionados")
            }

            // Actualizar estado local
            setDocumentTypes((prev) => prev.filter((item) => !ids.includes(item._id)))
            updateCustomerData({ ...customerData, reloadTableTypeOfDocument: !customerData.reloadTableTypeOfDocument });
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleCloseModalAdd = () => {
        setOpenModalAdd(!openModalAdd);
    }

    const handleOpenModalAdd = () => {
        setOpenModalAdd(true);
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Tipo de documento"
            pageTitleBreadcrumb="Tipo de documento"
            main={
                <Fragment>
                    <ModalAddTypeDocument
                        isOpen={openModalAdd}
                        closeModal={handleCloseModalAdd}
                        setReloadData={setReloadData}
                        reloadData={reloadData}
                    />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleOpenModalAdd}>
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
                                        data={documentTypes}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Tipo de documento"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchTypeOfDocuments}
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

export default ListTypeOfDocument
