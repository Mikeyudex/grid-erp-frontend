"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";

import { BASE_URL } from "../../../../helpers/url_helper";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import ModalAddWarehouse from "../components/ModalAddWarehouse";

const WarehouseListPage = () => {
    document.title = "Bodegas | Quality";


    const [warehouseList, setWarehouseList] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [reloadData, setReloadData] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "name", label: "Nombre", type: "text", editable: true, searchable: true },
        { key: "description", label: "Descripción", type: "text", editable: true, searchable: true },
        { key: "shortCode", label: "Código corto", type: "text", editable: true, searchable: true },
        { key: "active", label: "Activo", type: "boolean", editable: true, searchable: false },
    ]


    // Cargar datos
    const fetchWarehouses = async () => {
        setLoading(true);
        setError(null);

        let token = getToken();
        fetch(`${BASE_URL}/warehouse/getAll`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los bodegas");
                }
                let warehouses = await response.json();
                if (warehouses && Array.isArray(warehouses) && warehouses.length > 0) {
                    setWarehouseList(warehouses);
                }
                return;
            })
            .catch(err => {
                console.error("Error:", err)
                setError(err.message)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchWarehouses();
    }, [reloadData]);

    // Manejadores de eventos
    const handleUpdate = async (updatedItem) => {
        try {
            setError(null);
            if (!updatedItem) {
                setError("No se ha seleccionado ningún item");
                return false
            }
            let token = getToken();
            const response = await fetch(`${BASE_URL}/warehouse/update/${updatedItem._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: updatedItem?.name,
                    description: updatedItem?.description,
                    shortCode: updatedItem?.shortCode,
                    active: updatedItem?.active,
                }),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el tipo de cliente")
            }

            // Actualizar estado local
            setWarehouseList((prev) =>
                prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
            )
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleDelete = async (id) => {
        try {
            setError(null);
            if (!id) {
                setError("No se ha seleccionado ninguna tipo de material");
                return false
            }
            let token = getToken();
            const response = await fetch(`${BASE_URL}/warehouse/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Error al eliminar el tipo de cliente")
            }

            // Actualizar estado local
            setWarehouseList((prev) => prev.filter((item) => item._id !== id))

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
            const response = await fetch(`${BASE_URL}/warehouse/bulkDelete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar los tipos de cliente seleccionados")
            }

            // Actualizar estado local
            setWarehouseList((prev) => prev.filter((item) => !ids.includes(item._id)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleOpenModalAdd = () => {
        setOpenModalAdd(!openModalAdd);
    }

    const handleCloseModalAdd = () => {
        setOpenModalAdd(false);
    }

    const handleAddItemToList = (newItem) => {
       setWarehouseList((prev) => [...prev, newItem]);
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Lista de Bodegas"
            pageTitleBreadcrumb="Bodegas"
            main={
                <Fragment>

                    <ModalAddWarehouse
                        isOpen={openModalAdd}
                        closeModal={handleCloseModalAdd}
                        handleAddItemToList={handleAddItemToList} />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleOpenModalAdd}>
                                        <FaPlus className="me-1" /> Nueva Bodega
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={warehouseList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Bodegas"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchWarehouses}
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

export default WarehouseListPage
